import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  pro_monthly: "price_1TGqLxB0HqRlFQjUckzzRyed",
  pro_yearly: "price_1TGqLvB0HqRlFQjUnkJMKhOH",
  explorer_monthly: "price_1TGqLzB0HqRlFQjUz54ahjDk",
  explorer_yearly: "price_1TGqLyB0HqRlFQjUr9Gr0Sup",
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { plan, userId, userEmail } = req.body;

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
