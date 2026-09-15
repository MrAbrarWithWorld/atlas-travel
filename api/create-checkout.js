import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import {
  acknowledgePlaySubscription,
  fetchPlaySubscription,
  interpretSubscription,
} from "../lib/google-play.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  pro_monthly: "price_1TGqLxB0HqRlFQjUckzzRyed",
  pro_yearly: "price_1TGqLvB0HqRlFQjUnkJMKhOH",
  explorer_monthly: "price_1TGqLzB0HqRlFQjUz54ahjDk",
  explorer_yearly: "price_1TGqLyB0HqRlFQjUr9Gr0Sup",
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { plan, action } = req.body || {};

  // Identify the buyer from their Supabase session so a subscription can
  // never be attached to someone else's account.
  const token = (req.headers["authorization"] || "").replace(/^Bearer\s+/i, "");
  if (!token || !process.env.SUPABASE_SERVICE_KEY) {
    return res.status(401).json({ error: "Please sign in first to upgrade." });
  }
  const sb = createClient("https://prffhhkemxibujjjiyhg.supabase.co", process.env.SUPABASE_SERVICE_KEY);
  const { data: authData, error: authError } = await sb.auth.getUser(token);
  if (authError || !authData?.user) {
    return res.status(401).json({ error: "Please sign in first to upgrade." });
  }
  const userId = authData.user.id;
  const userEmail = authData.user.email;

  // ── Google Play subscription from the Android app ─────────────────────────
  if (action === "verify_play") {
    return verifyPlay(req, res, sb, userId);
  }

  if (!plan || !PRICE_IDS[plan]) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: PRICE_IDS[plan],
          quantity: 1,
        },
      ],
      customer_email: userEmail || undefined,
      client_reference_id: userId || undefined,
      success_url: `https://getatlas.ca/?payment=success&plan=${plan}`,
      cancel_url: `https://getatlas.ca/?payment=cancelled`,
      metadata: {
        plan,
        userId: userId || "",
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return res.status(500).json({ error: error.message });
  }
}

async function verifyPlay(req, res, sb, userId) {
  const { productId, purchaseToken } = req.body || {};
  if (typeof purchaseToken !== "string" || purchaseToken.length < 10 || purchaseToken.length > 4096) {
    return res.status(400).json({ error: "Invalid purchase token" });
  }
  try {
    const resource = await fetchPlaySubscription(purchaseToken);
    const result = interpretSubscription(resource, { productId, userId });
    if (!result.ok) return res.status(result.status).json({ error: result.error });

    const { error: dbError } = await sb.from("subscriptions").upsert(
      {
        user_id: userId,
        provider: "google_play",
        play_purchase_token: purchaseToken,
        play_product_id: result.productId,
        play_order_id: result.orderId,
        plan: result.plan,
        status: result.status,
        current_period_end: result.currentPeriodEnd,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "play_purchase_token" },
    );
    if (dbError) {
      console.error("verify_play db error:", dbError.message);
      return res.status(500).json({ error: "Could not save subscription" });
    }

    // An upgrade/downgrade replaces the previous purchase token.
    if (result.linkedPurchaseToken) {
      await sb
        .from("subscriptions")
        .update({ status: "replaced", updated_at: new Date().toISOString() })
        .eq("play_purchase_token", result.linkedPurchaseToken)
        .eq("user_id", userId);
    }

    // Google refunds subscriptions that are not acknowledged within 3 days.
    if (result.needsAcknowledgement && result.active) {
      await acknowledgePlaySubscription(result.productId, purchaseToken).catch((e) =>
        console.error("verify_play acknowledge failed:", e.message),
      );
    }

    return res.status(200).json({ ok: true, plan: result.plan, active: result.active, currentPeriodEnd: result.currentPeriodEnd });
  } catch (error) {
    console.error("verify_play error:", error.message);
    return res.status(error.status || 500).json({ error: error.status === 503 ? "Google Play billing is not set up yet" : "Could not verify the purchase" });
  }
}
