// Google Play subscription verification for the Atlas Android app.
// Used by api/create-checkout.js (action=verify_play). No extra dependencies:
// the service-account JWT is signed with Node's crypto module.
//
// Env: GOOGLE_PLAY_SERVICE_ACCOUNT_JSON — the JSON key of a Google Cloud service
// account that has been invited in Play Console (Users and permissions) with
// "View financial data" and "Manage orders and subscriptions".
// It may be pasted as raw JSON or base64.

import { createSign } from "crypto";

export const PLAY_PACKAGE_NAME = "ca.getatlas.app";

// Play Console product IDs → Atlas tier; base plan IDs → billing period.
export const PLAY_PRODUCT_TIERS = { atlas_pro: "pro", atlas_explorer: "explorer" };
const BASE_PLAN_PERIODS = { monthly: "monthly", yearly: "yearly" };

// Access is kept until expiry for these states (a cancelled subscription
// stays usable until the end of the paid period).
const ENTITLED_STATES = new Set([
  "SUBSCRIPTION_STATE_ACTIVE",
  "SUBSCRIPTION_STATE_IN_GRACE_PERIOD",
  "SUBSCRIPTION_STATE_CANCELED",
]);

function serviceAccount() {
  const raw = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  const text = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
  const json = JSON.parse(text);
  if (!json.client_email || !json.private_key) throw new Error("Service account JSON is missing client_email/private_key");
  return json;
}

const b64url = (input) =>
  Buffer.from(typeof input === "string" ? input : JSON.stringify(input))
    .toString("base64")
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

export function buildServiceAccountJwt(sa, nowSeconds = Math.floor(Date.now() / 1000)) {
  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/androidpublisher",
    aud: sa.token_uri || "https://oauth2.googleapis.com/token",
    iat: nowSeconds,
    exp: nowSeconds + 3600,
  };
  const unsigned = `${b64url(header)}.${b64url(claims)}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const signature = signer
    .sign(sa.private_key, "base64")
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `${unsigned}.${signature}`;
}

let cachedToken = null; // { token, expiresAt }

async function accessToken(fetchImpl = fetch) {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.token;
  const sa = serviceAccount();
  if (!sa) throw Object.assign(new Error("Google Play verification is not configured"), { status: 503 });
  const res = await fetchImpl(sa.token_uri || "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: buildServiceAccountJwt(sa),
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) {
    throw Object.assign(new Error(`Google auth failed (${res.status})`), { status: 502 });
  }
  cachedToken = { token: body.access_token, expiresAt: Date.now() + (body.expires_in || 3600) * 1000 };
  return cachedToken.token;
}

/**
 * Turn a purchases.subscriptionsv2 resource into what Atlas stores.
 * Pure function so it can be unit-tested without network access.
 */
export function interpretSubscription(resource, { productId, userId, now = Date.now() } = {}) {
  const lineItem =
    (resource.lineItems || []).find((li) => li.productId === productId) || (resource.lineItems || [])[0];
  if (!lineItem) return { ok: false, status: 400, error: "Purchase has no subscription line item" };

  const tier = PLAY_PRODUCT_TIERS[lineItem.productId];
  if (!tier) return { ok: false, status: 400, error: "Unknown subscription product" };

  const ownerId = resource.externalAccountIdentifiers?.obfuscatedExternalAccountId;
  if (ownerId && userId && ownerId !== userId) {
    return { ok: false, status: 403, error: "This purchase belongs to a different Atlas account" };
  }

  const basePlanId = lineItem.offerDetails?.basePlanId;
  const period = BASE_PLAN_PERIODS[basePlanId] || "monthly";
  const expiryMs = Date.parse(lineItem.expiryTime || "");
  const active =
    ENTITLED_STATES.has(resource.subscriptionState) && Number.isFinite(expiryMs) && expiryMs > now;

  return {
    ok: true,
    tier,
    plan: `${tier}_${period}`,
    active,
    status: active ? "active" : String(resource.subscriptionState || "unknown").replace("SUBSCRIPTION_STATE_", "").toLowerCase(),
    currentPeriodEnd: Number.isFinite(expiryMs) ? new Date(expiryMs).toISOString() : null,
    productId: lineItem.productId,
    orderId: resource.latestOrderId || null,
    needsAcknowledgement: resource.acknowledgementState === "ACKNOWLEDGEMENT_STATE_PENDING",
    linkedPurchaseToken: resource.linkedPurchaseToken || null,
    testPurchase: Boolean(resource.testPurchase),
  };
}

export async function fetchPlaySubscription(purchaseToken, fetchImpl = fetch) {
  const token = await accessToken(fetchImpl);
  const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PLAY_PACKAGE_NAME}/purchases/subscriptionsv2/tokens/${encodeURIComponent(purchaseToken)}`;
  const res = await fetchImpl(url, { headers: { Authorization: `Bearer ${token}` } });
  const body = await res.json().catch(() => ({}));
  if (res.status === 404 || res.status === 410) {
    throw Object.assign(new Error("Purchase not found on Google Play"), { status: 400 });
  }
  if (!res.ok) throw Object.assign(new Error(`Google Play API error (${res.status})`), { status: 502 });
  return body;
}

export async function acknowledgePlaySubscription(productId, purchaseToken, fetchImpl = fetch) {
  const token = await accessToken(fetchImpl);
  const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PLAY_PACKAGE_NAME}/purchases/subscriptions/${encodeURIComponent(productId)}/tokens/${encodeURIComponent(purchaseToken)}:acknowledge`;
  const res = await fetchImpl(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: "{}",
  });
  return res.ok;
}
