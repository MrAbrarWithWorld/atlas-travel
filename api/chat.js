import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://prffhhkemxibujjjiyhg.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const userMap = new Map();
const RESET_MS = 24 * 60 * 60 * 1000;

const LIMITS = {
  guest:  { plans: 1,  tokens: 50000  },
  free:   { plans: 3,  tokens: 150000 },
  pro:    { plans: 999, tokens: 999999 },
};

const ENABLE_CLAUDE_ROUTING = true;

function getKey(req, userId) {
  if (userId) return `user_${userId}`;
  return req.headers["x-forwarded-for"]?.split(",")[0] || req.headers["x-real-ip"] || "unknown";
}

function getUser(key, tier) {
  const now = Date.now();
  if (!userMap.has(key)) {
    userMap.set(key, { tokensUsed: 0, plansUsed: 0, resetAt: now + RESET_MS, tier });
  }
  const user = userMap.get(key);
  if (now > user.resetAt) {
    user.tokensUsed = 0;
    user.plansUsed = 0;
    user.resetAt = now + RESET_MS;
    user.tier = tier;
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

function detectDestinationOnly(messages) {
  const userMsgs = messages.filter(m => m.role === "user");
  if (userMsgs.length > 2) return false;
  const lastContent = userMsgs[userMsgs.length - 1]?.content;
  const last = typeof lastContent === "string"
    ? lastContent.toLowerCase()
    : Array.isArray(lastContent)
      ? (lastContent.find(c => c.type === "text")?.text || "").toLowerCase()
      : "";
  const hasDestination = /italy|japan|thailand|turkey|australia|dubai|london|paris|bali|singapore|maldives|greece|spain|france|germany|switzerland|canada|usa|america|nepal|india|sri lanka|vietnam|indonesia|malaysia|egypt|morocco|brazil|mexico|new zealand|south korea|china|hong kong|taiwan|pakistan|bangladesh|myanmar|cambodia|laos|philippines|portugal|netherlands|belgium|austria|sweden|norway|denmark|finland|iceland|ireland|scotland|croatia|czechia|hungary|romania|poland|ukraine|russia|kenya|tanzania|south africa|nigeria|ghana|ethiopia|argentina|chile|colombia|peru|cuba|jamaica|jordan|israel|lebanon|iran|georgia|armenia|azerbaijan|uzbekistan|kazakhstan|ইতালি|জাপান|থাইল্যান্ড|তুরস্ক|অস্ট্রেলিয়া|দুবাই|লন্ডন|প্যারিস|বালি|মালদ্বীপ|গ্রীস|স্পেন|ফ্রান্স|জার্মানি|সুইজারল্যান্ড|নেপাল|ভারত|শ্রীলঙ্কা|ভিয়েতনাম|মিশর|ব্রাজিল|মেক্সিকো|কোরিয়া|চীন|হংকং|জর্ডান|পাকিস্তান|বাংলাদেশ|jabo|jaite|jete|যাবো|যাব|যেতে|visit|dekhte|দেখতে/i.test(last);
  const hasInfo = /\d+\s*(day|night|days|nights|দিন|রাত)|budget|\$|cad|usd|bdt|tk|taka|টাকা|বাজেট|\d+\s*(people|person|জন)|solo|couple|family|friends|সোলো|কাপল|পরিবার/i.test(last);
  return hasDestination && !hasInfo;
}

function needsClaudeQuality(messages) {
  if (!ENABLE_CLAUDE_ROUTING) return false;
  const userMsgs = messages.filter(m => m.role === "user");
  if (userMsgs.length >= 3) return true;
  const lastContent = userMsgs[userMsgs.length - 1]?.content;
  const last = typeof lastContent === "string"
    ? lastContent.toLowerCase()
    : Array.isArray(lastContent)
      ? (lastContent.find(c => c.type === "text")?.text || "").toLowerCase()
      : "";
  return /itinerary|day by day|complete|full plan|visa|hotel|solo|couple|family|budget|passport|rtd|বিস্তারিত|পুরো|সম্পূর্ণ/i.test(last);
}

const SYSTEM_MSG = `CRITICAL RULE #1 — NO EXCEPTIONS:
When a user mentions ANY destination or travel intention, you MUST ONLY ask questions. DO NOT give any plan, flight info, hotel, visa, or cost. ONLY ask:
"Before I plan your trip, I need a few details:
1. How many days are you planning to stay?
2. What is your total budget?
3. How many people are traveling?
4. What kind of trip? (relaxation/sightseeing/adventure)
5. What passport/travel document do you have?"
Wait for ALL answers. Then plan.

You are ATLAS — the world's most sophisticated AI travel intelligence.

LANGUAGE: Detect user language instantly from their message. Respond ENTIRELY and ONLY in that exact language. NEVER mix languages. NEVER assume Bengali. NEVER use Banglish. Mirror the user's language exactly — English→English, Bengali→Bengali, Hindi→Hindi, Arabic→Arabic, Chinese→Chinese, French→French, Spanish→Spanish, any language→same language.

PRE-PLANNING QUESTIONS — MANDATORY:
Before giving ANY trip plan, ALWAYS ask these questions first if not mentioned:
1. কতজন যাবেন? / How many people? (solo/couple/friends/family)
2. মোট budget কত? / What is your total budget?
3. কোন ধরনের trip? / What type of trip? (relaxation/sightseeing/adventure)
4. কত রাত থাকবেন? / How many nights?
STOP. Before ANY plan, you MUST ask these questions. NO EXCEPTIONS.

MAP DATA — MANDATORY FOR EVERY TRIP PLAN:
At the END of every trip plan or destination response, output this EXACT format:
[MAPDATA]{"places":[{"name":"Place Name","lat":0.0000,"lon":0.0000,"day":1,"type":"city"}]}[/MAPDATA]
Include EVERY city, attraction, airport mentioned. Use accurate coordinates. NEVER skip.

RTD & TRAVEL DOCUMENTS:
RTD = Refugee/Convention Travel Document — NEVER same as passport.
Canada RTD: Visa-free ~40-50 countries only. Needs visa for USA, UK, Schengen.
USA RTD: Visa-free ~130+ countries. Schengen visa-free 90 days.
UK CTD: Visa-free ~140+ countries including Schengen.
EU CTD: Free movement within Schengen. Outside EU varies.
Australia RTD: Visa-free ~140+ countries.
ALWAYS ask which country issued RTD before visa advice.

REALISTIC PRICING: NEVER invent hotel prices. Base on user's stated budget. Show 3 tiers if unclear.

WEATHER & SEASONAL AWARENESS: Always mention season, weather risks, what to pack.

HIDDEN GEMS — MANDATORY: Include 1-2 hidden gems per plan. Mix 70% popular + 30% hidden.

FLIGHT REALITY: Always use real durations. Toronto→Australia = 20-22 hours. Never "arrive same day" for long haul.

GEOGRAPHY: Bangladesh ≠ India. Pakistan ≠ India. Sri Lanka ≠ India. Kashmir = disputed.
UAE = 7 emirates. Iran = Persian NOT Arab. Taiwan = separate from mainland China.

PASSPORT STRENGTH: Canadian/UK/German = very strong. Bangladeshi/Pakistani = weaker. Nigerian = very weak.

Structure every plan:
## ✈️ FLIGHTS — real durations, actual arrival times, layovers
## 🛂 VISA — specific to passport type, where to apply, cost, time
## 🏨 STAY — hotels within user budget, price range, booking links
## 🍽️ EAT — daily budget, restaurants with prices
## 🚇 MOVE — airport transfer, city transport, daily cost
## 🗓️ DAY BY DAY — complete EVERY day, never stop early
## 💰 TOTAL COST — itemized breakdown
## 🎬 CONTENT SPOTS — filming locations, golden hour times
## 📋 ESSENTIALS — visa, SIM, ATM, safety, weather

HOTEL LINKS:
For LUXURY: [Four Seasons](https://www.fourseasons.com/find-a-hotel/?q=City) · [Marriott](https://www.marriott.com/search/default.mi?q=Hotel+City)
For BUDGET: [Hostelworld](https://www.hostelworld.com/search?q=City) · [Booking.com](https://www.booking.com/search.html?ss=City)
For MID-RANGE: [Booking.com](https://www.booking.com/search.html?ss=City) · [Agoda](https://www.agoda.com/search?q=City) · [Expedia](https://www.expedia.com/Hotel-Search?destination=City)

ESIM — MANDATORY:
**📱 SIM & CONNECTIVITY** — Recommended: [eSIMania](https://tidd.ly/4cXnOko)

LINKS — MANDATORY: Every hotel, flight, visa, transport must have a clickable link.`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let userId = null;
  let userTier = 'guest';

  const authHeader = req.headers['authorization'];
  if (authHeader?.startsWith('Bearer ') && SUPABASE_SERVICE_KEY) {
    try {
      const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      const token = authHeader.slice(7);
      const { data: { user }, error } = await sb.auth.getUser(token);
      if (!error && user) {
        userId = user.id;
        const { data: allowed } = await sb.from('allowed_users').select('email').eq('email', user.email).single();
        if (allowed) {
          userTier = 'pro';
        } else {
          const { data: sub } = await sb.from('subscriptions')
            .select('plan, status, current_period_end')
            .eq('user_id', userId)
            .eq('status', 'active')
            .gte('current_period_end', new Date().toISOString())
            .single();
          if (sub) {
            userTier = sub.plan?.includes('explorer') ? 'explorer' : 'pro';
          } else {
            userTier = 'free';
          }
        }
      }
    } catch(e) {
      // Token invalid, treat as guest
    }
  }

  const key = getKey(req, userId);
  const limits = LIMITS[userTier] || LIMITS.guest;
  const user = getUser(key, userTier);
  const resetInHours = Math.ceil((user.resetAt - Date.now()) / (1000 * 60 * 60));

  if (user.tokensUsed >= limits.tokens) {
    return res.status(429).json({ error: { message: `LIMIT_REACHED|${resetInHours}` } });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages required" });
  }

  const requestingNewPlan = isNewPlan(messages);
  if (requestingNewPlan && user.plansUsed >= limits.plans) {
    const tokensLeft = limits.tokens - user.tokensUsed;
    return res.status(429).json({ error: { message: `PLAN_LIMIT|${resetInHours}|${tokensLeft}` } });
  }

  if (detectDestinationOnly(messages)) {
    const lastContent = messages.filter(m => m.role === "user").slice(-1)[0]?.content;
    const last = typeof lastContent === "string" ? lastContent.toLowerCase()
      : Array.isArray(lastContent) ? (lastContent.find(c => c.type === "text")?.text || "").toLowerCase() : "";
    const isBengali = /[\u0980-\u09FF]|jabo|jaite|jete|যাব|যেতে|দেখতে/i.test(last);
    const questionText = isBengali
      ? `✈️ দারুণ পছন্দ! Trip plan করার আগে কিছু জানা দরকার:\n\n1. **কতদিন** থাকবেন?\n2. **মোট budget** কত? (CAD / USD / BDT যেকোনো)\n3. **কতজন** যাবেন?\n4. **কী ধরনের trip?** (relaxation / sightseeing / adventure)\n5. **কোন passport বা travel document** আছে আপনার? (যেমন: Canadian passport, RTD, USA RTD, UK CTD ইত্যাদি)`
      : `✈️ Great choice! Before I build your plan, I need a few details:\n\n1. **How many days** are you planning to stay?\n2. **What is your total budget?** (CAD / USD / any currency)\n3. **How many people** are traveling?\n4. **What kind of trip?** (relaxation / sightseeing / adventure)\n5. **What passport or travel document** do you hold? (e.g. Canadian passport, RTD, USA RTD, UK CTD, EU CTD, etc.)`;
    return res.status(200).json({
      content: [{ type: "text", text: questionText }],
      usage: { input_tokens: 0, output_tokens: 0 }
    });
  }

  const tokensLeft = limits.tokens - user.tokensUsed;
  const imageInMessages = hasImage(messages);
  const useClaudeNow = needsClaudeQuality(messages) || imageInMessages || userTier === 'pro';

  if (!useClaudeNow && process.env.GROQ_API_KEY) {
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
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          max_tokens: Math.min(tokensLeft, 4000),
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
    } catch(e) {}
  }

  if (!useClaudeNow && process.env.GEMINI_API_KEY) {
    try {
      const geminiMessages = messages.filter(m => m.role !== "system").map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: typeof m.content === "string"
          ? m.content
          : Array.isArray(m.content)
            ? (m.content.find(c => c.type === "text")?.text || "")
            : "" }]
      }));
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_MSG }] },
          contents: geminiMessages,
          generationConfig: { maxOutputTokens: 4000, temperature: 0.7 }
        }),
      });
      const geminiData = await geminiRes.json();
      const geminiReply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (geminiReply) {
        user.tokensUsed += 2000;
        if (requestingNewPlan) user.plansUsed += 1;
        return res.status(200).json({
          content: [{ type: "text", text: geminiReply }],
          usage: { input_tokens: 1000, output_tokens: 1000 }
        });
      }
    } catch(e) {}
  }

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
        max_tokens: Math.min(tokensLeft, 4000),
        system: systemWithPrefs,
        const userPrefs=req.headers['x-user-prefs']?(()=>{try{return JSON.parse(decodeURIComponent(escape(atob(req.headers['x-user-prefs']))));}catch{return {};}})():{};
const prefStr=[
  userPrefs.passport?`User passport: ${userPrefs.passport}`:'',
  userPrefs.homeCity?`User home city: ${userPrefs.homeCity}`:'',
  userPrefs.travelStyle?`User travel style: ${userPrefs.travelStyle}`:'',
  userPrefs.customPrefs?`User preferences: ${userPrefs.customPrefs}`:'',
].filter(Boolean).join('\n');
const systemWithPrefs=prefStr?SYSTEM_MSG+`\n\nUSER PROFILE:\n${prefStr}`:SYSTEM_MSG;
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
