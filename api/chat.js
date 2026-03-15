const userMap = new Map();
const RESET_MS = 1 * 60 * 1000;
const MAX_TOKENS = 999999;
const MAX_PLANS = 999;

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
  const userMsgs = messages.filter(m => m.role === "user");
  if (userMsgs.length > 2) return false;
  const lastContent = userMsgs[userMsgs.length - 1]?.content;
  const last = typeof lastContent === "string"
    ? lastContent.toLowerCase()
    : Array.isArray(lastContent)
      ? (lastContent.find(c => c.type === "text")?.text || "").toLowerCase()
      : "";
  const keywords = ["trip","travel","visit","plan","itinerary","days","budget",
                    "fly","tour","vacation","holiday","night","week",
                    "যাব","ট্রিপ","ভ্রমণ","দিন","বাজেট","টাকা","রাত"];
  return keywords.some(k => last.includes(k));
}

function hasImage(messages) {
  return messages.some(m =>
    Array.isArray(m.content) && m.content.some(c => c.type === "image")
  );
}

export default async function handler(req, res) {

  const SYSTEM_MSG = `You are ATLAS — AI travel intelligence. If the user asks for 10-15 days, you MUST provide ALL days completely. Never use "..." or stop early. Never say you "will plan" — just give the full plan immediately.

LANGUAGE: Detect user language instantly. Respond ENTIRELY in that language. If user writes in Bengali script (বাংলা), respond in Bengali script only. NEVER use romanized Bengali (Banglish). If user writes in English, respond in English.
CURRENCY: Use exactly the currency the user mentions.

PHOTO IDENTIFICATION: If the user sends a photo, identify the location, landmark, or place shown. Provide: place name, city/country, travel info, nearby attractions, best time to visit, how to get there, and hotel/booking links for that area.

TRIP PLANNING — MANDATORY: For every trip plan, always provide complete DAY BY DAY breakdown. Each day must include: morning/afternoon/evening activities, exact transport (metro line number, bus number, taxi cost, walk time), entry fees, meal spots with prices, and distance between places. NEVER skip days. NEVER give a summary — give FULL details every single day. Format each day as:
**Day 1 — [Area Name]**
- Morning: [activity] → go by [transport, cost, time]
- Lunch: [restaurant, cost]
- Afternoon: [activity] → go by [transport, cost, time]
- Dinner: [restaurant, cost]
- Return to hotel by [transport, cost]

HOTEL LINKS — detect budget level:
For LUXURY (luxury, 5-star, premium): Show [Four Seasons](https://www.fourseasons.com/find-a-hotel/?q=City) · [Marriott](https://www.marriott.com/search/default.mi?q=Hotel+City) · [Leading Hotels](https://www.lhw.com/search?q=City) · [Mr & Mrs Smith](https://www.mrandmrssmith.com/search?q=Hotel+City). Mention Amex Platinum perks.
For BUDGET (cheap, budget, hostel): Show [Hostelworld](https://www.hostelworld.com/search?q=City) · [Booking.com](https://www.booking.com/search.html?ss=City). Mention Rakuten cashback.
For NORMAL/MID-RANGE: Show [Booking.com](https://www.booking.com/search.html?ss=City) · [Agoda](https://www.agoda.com/search?q=City) · [Expedia](https://www.expedia.com/Hotel-Search?destination=City) · [Hotels.com](https://www.hotels.com/search.do?q-destination=City).
Card offers: Mastercard 10% off on Agoda, Amex extra points on Expedia, Visa offers on Hotels.com.
Replace spaces with + in all URLs. NEVER invent direct hotel URLs.

LINKS — MANDATORY: Every hotel, flight, visa, transport must have a clickable [Text](https://url.com) link.`;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.headers["x-real-ip"] || "unknown";
  const user = getUser(ip);
  const resetInHours = Math.ceil((user.resetAt - Date.now()) / (1000 * 60 * 60));

  if (user.tokensUsed >= MAX_TOKENS) {
    return res.status(429).json({ error: { message: `LIMIT_REACHED|${resetInHours}` } });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages required" });
  }

  const requestingNewPlan = isNewPlan(messages);
  if (requestingNewPlan && user.plansUsed >= MAX_PLANS) {
    const tokensLeft = MAX_TOKENS - user.tokensUsed;
    return res.status(429).json({ error: { message: `PLAN_LIMIT|${resetInHours}|${tokensLeft}` } });
  }

  const tokensLeft = MAX_TOKENS - user.tokensUsed;
  const imageInMessages = hasImage(messages);

  // Image আছে → directly Anthropic (Groq vision support নেই)
  // Image নেই → Groq first, Anthropic fallback
  if (!imageInMessages && process.env.GROQ_API_KEY) {
    try {
      const groqMessages = messages.map(m => ({
        role: m.role,
        content: typeof m.content === "string"
          ? m.content
          : Array.isArray(m.content)
            ? (m.content.find(c => c.type === "text")?.text || "")
            : m.content
      }));

      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: Math.min(tokensLeft, 6000),
          messages: [
            { role: "system", content: SYSTEM_MSG },
            ...groqMessages.filter(m => m.role !== "system")
          ],
        }),
      });

      const groqData = await groqRes.json();
      if (groqData.choices?.[0]?.message?.content) {
        const reply = groqData.choices[0].message.content;
        const used = (groqData.usage?.prompt_tokens || 0) + (groqData.usage?.completion_tokens || 0);
        user.tokensUsed += used;
        if (requestingNewPlan) user.plansUsed += 1;
        return res.status(200).json({
          content: [{ type: "text", text: reply }],
          usage: { input_tokens: groqData.usage?.prompt_tokens || 0, output_tokens: groqData.usage?.completion_tokens || 0 }
        });
      }
    } catch(e) {
      // Groq failed, Anthropic এ যাও
    }
  }

  // Anthropic — text + image দুটোই handle করে
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: Math.min(tokensLeft, 6000),
        system: SYSTEM_MSG,
        messages: messages.filter(m => m.role !== "system"),
      }),
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error });

    const used = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);
    user.tokensUsed += used;
    if (requestingNewPlan) user.plansUsed += 1;

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: { message: error.message } });
  }
}
