import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

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

  const { plan } = req.body || {};

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
