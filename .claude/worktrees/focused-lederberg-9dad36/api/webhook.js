import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const sb = createClient(
  "https://prffhhkemxibujjjiyhg.supabase.co",
  process.env.SUPABASE_SERVICE_KEY
);

export const config = { api: { bodyParser: false } };

async function sendWelcomeEmail(toEmail, toName, plan) {
  const isExplorer = plan?.includes("explorer");
  const planLabel = isExplorer ? "💎 Explorer" : "⭐ Pro";
  const planFeatures = isExplorer
    ? ["Unlimited trip plans", "Priority AI for every message", "PDF export", "Custom AI instructions", "Multi-destination planning"]
    : ["Unlimited trip plans", "Priority AI for every message", "PDF export"];

  const featureRows = planFeatures.map(f => `<tr><td style="padding:6px 0;color:#c9a96e;font-size:14px;">✓ ${f}</td></tr>`).join("");

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#1c1914;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1c1914;padding:40px 20px;">
<tr><td align="center">
<table width="540" cellpadding="0" cellspacing="0" style="background:#211e18;border:1px solid rgba(201,169,110,0.2);border-radius:12px;overflow:hidden;">

  <!-- Header -->
  <tr><td style="padding:32px 40px 24px;border-bottom:1px solid rgba(201,169,110,0.12);text-align:center;">
    <div style="font-size:13px;letter-spacing:4px;color:#c9a96e;text-transform:uppercase;font-weight:300;">ATLAS</div>
    <div style="font-size:11px;letter-spacing:2px;color:#5a4a2a;text-transform:uppercase;margin-top:4px;">AI Travel Planner</div>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:32px 40px;">
    <p style="font-size:22px;font-weight:300;color:#e8dcc8;margin:0 0 8px;">Welcome to ${planLabel}</p>
    <p style="font-size:14px;color:#7a6a50;margin:0 0 28px;line-height:1.6;">
      ${toName ? `Hi ${toName}, your` : "Your"} subscription is active. Here's what you now have access to:
    </p>

    <table cellpadding="0" cellspacing="0" style="width:100%;background:rgba(201,169,110,0.04);border:1px solid rgba(201,169,110,0.15);border-radius:8px;padding:16px 20px;">
      <tbody>${featureRows}</tbody>
    </table>

    <div style="margin:28px 0;text-align:center;">
      <a href="https://getatlas.ca" style="display:inline-block;background:rgba(201,169,110,0.12);border:1px solid rgba(201,169,110,0.35);border-radius:8px;padding:12px 32px;color:#c9a96e;text-decoration:none;font-size:13px;letter-spacing:2px;text-transform:uppercase;">
        Start Planning →
      </a>
    </div>

    <p style="font-size:12px;color:#4a3a20;line-height:1.7;margin:0;">
      Your subscription renews automatically. To manage billing or cancel, reply to this email or visit your account settings at <a href="https://getatlas.ca" style="color:#6a5a30;">getatlas.ca</a>.
    </p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:20px 40px;border-top:1px solid rgba(201,169,110,0.1);text-align:center;">
    <p style="font-size:11px;color:#3a2a10;margin:0;letter-spacing:1px;">
      ATLAS · <a href="https://getatlas.ca/privacy" style="color:#3a2a10;">Privacy</a> · <a href="https://getatlas.ca/terms" style="color:#3a2a10;">Terms</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: { user: process.env.ZOHO_FROM, pass: process.env.ZOHO_PASS },
  });

  await transporter.sendMail({
    from: `"Atlas Travel" <${process.env.ZOHO_FROM}>`,
    to: toEmail,
    subject: `You're now on ${planLabel} — welcome to Atlas 🌍`,
    html,
  });
}

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"];
  const rawBody = await getRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  try {
    switch (event.type) {

      // ✅ Payment successful — new subscription
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        if (!userId || !session.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(session.subscription);

        await sb.from("subscriptions").upsert({
          user_id: userId,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          plan: plan || "pro_monthly",
          status: "active",
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: "stripe_subscription_id" });

        // Send welcome email
        const customerEmail = session.customer_details?.email || session.customer_email;
        const customerName = session.customer_details?.name || "";
        if (customerEmail) {
          try { await sendWelcomeEmail(customerEmail, customerName, plan || "pro_monthly"); }
          catch (emailErr) { console.error("Welcome email failed:", emailErr.message); }
        }
        break;
      }

      // ✅ Subscription renewed
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        if (!invoice.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        const customerId = invoice.customer;

        // Find user by customer ID
        const { data: existing } = await sb
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (existing?.user_id) {
          await sb.from("subscriptions").upsert({
            user_id: existing.user_id,
            stripe_customer_id: customerId,
            stripe_subscription_id: invoice.subscription,
            status: "active",
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: "stripe_subscription_id" });
        }
        break;
      }

      // ✅ Subscription cancelled or expired
      case "customer.subscription.deleted":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const newStatus = subscription.status === "active" ? "active" : subscription.status;

        await sb.from("subscriptions")
          .update({
            status: newStatus,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).json({ error: err.message });
  }
}
