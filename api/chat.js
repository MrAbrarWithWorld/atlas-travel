// api/chat.js — Smart Rate Limiting
// ২টা plan + questions সহ মোট ৪০০০ token, ৬ ঘণ্টা পর reset

const userMap = new Map();
const RESET_MS = 6 * 60 * 60 * 1000; // ৬ ঘণ্টা
const MAX_TOKENS = 4000;
const MAX_PLANS = 2;

function getUser(ip) {
  const now = Date.now();
  if (!userMap.has(ip)) {
    userMap.set(ip, { tokensUsed: 0, plansUsed: 0, resetAt: now + RESET_MS });
  }
  const user = userMap.get(ip);
  if (now > user.resetAt) {
    user.tokensUsed = 0;
    user.plansUsed = 0;
    user.resetAt = now + RESET_MS;
  }
  return user;
}

function isNewPlan(messages) {
  const isShortConversation = messages.filter(m => m.role === "user").length <= 2;
  if (!isShortConversation) return false;
  const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
  if (!lastUserMsg) return false;
  const text = lastUserMsg.content.toLowerCase();
  const keywords = ["trip","travel","visit","plan","itinerary","days","budget",
                    "fly","tour","vacation","holiday","night","week","month",
                    "যাব","ট্রিপ","ভ্রমণ","দিন","বাজেট","টাকা","রাত","সপ্তাহ"];
  return keywords.some(k => text.includes(k));
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] ||
             req.headers["x-real-ip"] || "unknown";

  const user = getUser(ip);
  const resetInMins = Math.ceil((user.resetAt - Date.now()) / (1000 * 60));
  const resetInHours = Math.ceil(resetInMins / 60);
  const resetText = resetInHours >= 1 ? `${resetInHours} hour${resetInHours > 1 ? 's' : ''}` : `${resetInMins} minutes`;

  // Token limit শেষ?
  if (user.tokensUsed >= MAX_TOKENS) {
    return res.status(429).json({
      error: {
        message: `✈️ Your ${MAX_TOKENS}-token session is complete.\n\nYou can use ATLAS again in ${resetText}.\n\nUsed: ${user.tokensUsed}/${MAX_TOKENS} tokens`
      }
    });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages required" });
  }

  // Plan limit শেষ?
  const requestingNewPlan = isNewPlan(messages);
  if (requestingNewPlan && user.plansUsed >= MAX_PLANS) {
    const tokensLeft = MAX_TOKENS - user.tokensUsed;
    return res.status(429).json({
      error: {
        message: `✈️ You've created ${MAX_PLANS} travel plans this session.\n\n💬 You still have ${tokensLeft} tokens — ask questions about your existing plans!\n\n🔄 New plans available in ${resetText}.`
      }
    });
  }

  try {
    const tokensLeft = MAX_TOKENS - user.tokensUsed;
    const maxForRequest = Math.min(tokensLeft, 3000);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: maxForRequest,
        messages: messages,
      }),
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error });

    // Token count করো
    const used = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);
    user.tokensUsed += used;
    if (requestingNewPlan) user.plansUsed += 1;

    res.setHeader("X-Tokens-Remaining", Math.max(0, MAX_TOKENS - user.tokensUsed));
    res.setHeader("X-Plans-Remaining", Math.max(0, MAX_PLANS - user.plansUsed));

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: { message: error.message } });
  }
}
