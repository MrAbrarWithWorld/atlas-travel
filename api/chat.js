import { createClient } from '@supabase/supabase-js';

async function geocodeLocation(placeName) {
  try {
    const query = encodeURIComponent(placeName);
    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
    const data = await res.json();
    if (data.results?.[0]?.geometry?.location) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lon: lng };
    }
    return null;
  } catch { return null; }
}

async function getPlacesNearby(destination, type = 'lodging') {
  try {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      console.log('No GOOGLE_MAPS_API_KEY');
      return '';
    }
    const geo = await geocodeLocation(destination);
    if (!geo) {
      console.log('Geocode failed for:', destination);
      return '';
    }
    console.log('Geocode success:', destination, geo);
    const res = await fetch(`https://places.googleapis.com/v1/places:searchNearby`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.rating,places.priceLevel,places.googleMapsUri,places.primaryTypeDisplayName',
      },
      body: JSON.stringify({
        includedTypes: [type],
        maxResultCount: 3,
        locationRestriction: {
          circle: {
            center: { latitude: geo.lat, longitude: geo.lon },
            radius: 5000.0
          }
        }
      }),
    });
    const data = await res.json();
    console.log('Places API response:', JSON.stringify(data).slice(0,200));
    if (!data.places?.length) return '';
    return data.places.map(p => 
      `- [${p.displayName?.text}](${p.googleMapsUri}) ⭐${p.rating||'N/A'}`
    ).join('\n');
  } catch(e) {
    console.log('Places error:', e.message);
    return '';
  }
}

async function searchWeb(query) {
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query,
        search_depth: 'basic',
        max_results: 3,
        include_answer: true,
      }),
    });
    const data = await res.json();
    return data.answer || data.results?.map(r => r.content).join('\n') || '';
  } catch { return ''; }
}

async function getYouTubeVideos(destination) {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(destination + ' travel guide')}`;
  const fallback = `[📺 Watch ${destination} travel videos on YouTube →](${searchUrl})`;
  try {
    if (!process.env.YOUTUBE_API_KEY) return fallback;
    const query = encodeURIComponent(`${destination} travel guide`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=2&key=${process.env.YOUTUBE_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) {
      console.error('YouTube API error:', data.error.message);
      return fallback;
    }
    if (!data.items?.length) return fallback;
    return data.items.map(v => `[📺 ${v.snippet.title}](https://youtube.com/watch?v=${v.id.videoId})`).join('\n');
  } catch(e) {
    console.error('YouTube fetch error:', e.message);
    return fallback;
  }
}

async function getWeather(destination) {
  try {
    if (!process.env.GOOGLE_MAPS_API_KEY) return '';
    const geo = await geocodeLocation(destination);
    if (!geo) return '';
    const res = await fetch(`https://weather.googleapis.com/v1/currentConditions:lookup?key=${process.env.GOOGLE_MAPS_API_KEY}&location.latitude=${geo.lat}&location.longitude=${geo.lon}`);
    const data = await res.json();
    if (!data || data.error) return '';
    const temp = data.temperature?.degrees || '';
    const condition = data.weatherCondition?.description?.text || '';
    const humidity = data.relativeHumidity || '';
    return `\n\n🌤️ CURRENT WEATHER (${destination}):\nTemperature: ${temp}°C | ${condition} | Humidity: ${humidity}%`;
  } catch(e) {
    console.error('Weather error:', e.message);
    return '';
  }
}

async function getTravelContext(messages) {
  // --- Smarter destination extraction ---
  // Scan last 6 messages (user + assistant) most-recent-first for the destination
  const SKIP_WORDS = new Set(['I','My','The','This','That','What','How','When','Where','Why','Can','Could','Please','Thanks','Yes','No','Ok','Sure','Great','Hello','Hi','And','But','Or']);

  function extractDest(content) {
    const txt = (typeof content === 'string' ? content
      : Array.isArray(content) ? (content.find(c => c.type === 'text')?.text || '') : '')
      .replace(/\[Current date.*$/s, '').trim();

    // Pattern 1: "go/drive/fly [to] <dest> for/on/<date-word>/,"
    // Catches: "go montrial for 3 days", "drive to Paris for a weekend", "fly Tokyo this May"
    const goMatch = txt.match(/\b(?:go|drive|fly|head|travel|visit|going|driving|flying)\b\s+(?:to\s+)?([a-zA-Z]{3,}(?:\s+[a-zA-Z]{3,})?)\s*(?:for\s+\d|for\s+a|this\s+|next\s+|in\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)|on\s+|,)/i);
    if (goMatch) {
      const w = goMatch[1].trim();
      if (!SKIP_WORDS.has(w)) return w;
    }

    // Pattern 2: "trip to / travel to / want to visit / planning to go to <dest>"
    const kwMatch = txt.match(/(?:trip\s+to|travel(?:ling)?\s+to|visit(?:ing)?\s+to|plan(?:ning)?\s+(?:to\s+(?:go\s+to|visit)|a\s+trip\s+to)|want\s+to\s+(?:go\s+to|visit))\s+([a-zA-Z]{3,}(?:\s+[a-zA-Z]{3,})?)/i);
    if (kwMatch) {
      const w = kwMatch[1].trim();
      if (!SKIP_WORDS.has(w)) return w;
    }

    // Pattern 3: "<dest> trip/travel/tour" suffix — "Montreal trip", "paris travel guide"
    const suffixMatch = txt.match(/\b([a-zA-Z]{3,}(?:\s+[a-zA-Z]{3,})?)\s+(?:trip|travel|visit|tour|guide|jabo|jaoa|jawar|jawa)\b/i);
    if (suffixMatch && !SKIP_WORDS.has(suffixMatch[1])) return suffixMatch[1].trim();

    // Pattern 4: Capitalized proper noun (for well-formed messages like "I want to go to Montreal")
    const properNouns = txt.match(/\b([A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})?)\b/g) || [];
    const dest = properNouns.find(w => !SKIP_WORDS.has(w.trim()));
    if (dest) return dest.trim();

    return null;
  }

  let searchQuery = '';
  const recent = [...messages].slice(-6).reverse();
  for (const msg of recent) {
    const d = extractDest(msg.content);
    if (d) { searchQuery = d; break; }
  }

  // Final fallback: first latin words of last user message
  if (!searchQuery) {
    const userMsgs = messages.filter(m => m.role === 'user');
    const last = userMsgs[userMsgs.length - 1]?.content;
    const text = typeof last === 'string' ? last
      : Array.isArray(last) ? (last.find(c => c.type === 'text')?.text || '') : '';
    const cleanText = text.replace(/\[Current date.*$/s, '').trim();
    const destMatch = cleanText.match(/^([a-zA-Z\s]+?)(?:\s+for|\s+\d|\s+solo|\s+budget|,|$)/i);
    searchQuery = destMatch ? destMatch[1].trim() : cleanText.slice(0, 30);
  }

  if (!searchQuery || searchQuery.length < 3) return '';

  // passport detection across all user messages
  const allUserText = messages.filter(m => m.role === 'user').map(m =>
    typeof m.content === 'string' ? m.content : (Array.isArray(m.content) ? (m.content.find(c => c.type === 'text')?.text || '') : '')
  ).join(' ');
  const passport = allUserText.match(/\b(canadian|american|british|bangladeshi|indian|pakistani|nigerian|australian|eu|european)\s*(passport|rtd|ctd|travel document)\b/i)?.[0] || 'canadian passport';

  const queries = [
    `${searchQuery} visa requirements 2026`,
    `${searchQuery} travel entry requirements 2026`,
  ];

 const [results, videos, hotels, weather] = await Promise.all([
    Promise.all(queries.map(q => searchWeb(q))),
    getYouTubeVideos(searchQuery),
    getPlacesNearby(searchQuery + ' city center', 'lodging'),
    getWeather(searchQuery),
]);

  let context = results.filter(Boolean).join('\n\n');

  // Geocode from search query
  const geo = await geocodeLocation(searchQuery);
  if (geo) context += `\n\nVERIFIED COORDINATES: ${searchQuery}: ${geo.lat},${geo.lon}`;

  const videoSection = videos ? `\n\n📺 DESTINATION VIDEOS:\n${videos}` : '';
  const hotelSection = hotels ? `\n\n🏨 NEARBY HOTELS (verified):\n${hotels}` : '';
const weatherSection = weather || '';
return (context || videos || hotels || weather) ? `\n\nREAL-TIME TRAVEL DATA (verified ${new Date().toLocaleDateString()}):\n${context}${weatherSection}${videoSection}${hotelSection}` : '';
}

const SUPABASE_URL = 'https://prffhhkemxibujjjiyhg.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const userMap = new Map();
const RESET_MS = 24 * 60 * 60 * 1000;

const LIMITS = {
  guest:    { plans: 3,   tokens: 100000 },
  free:     { plans: 7,   tokens: 300000 },
  pro:      { plans: 350, tokens: 500000 },
  explorer: { plans: 999, tokens: 999999 },
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

CURRENCY: If "User preferred currency" is provided in the context, use THAT currency for ALL prices in your response (hotel costs, flights, budget breakdowns, daily estimates). Always show amounts in the user's local currency. If no currency is detected, default to USD.

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
Include EVERY destination city and attraction. NEVER include the user's home city or departure airport. Use accurate coordinates. NEVER skip.

RTD & TRAVEL DOCUMENTS:
RTD = Refugee/Convention Travel Document — NEVER same as passport.
Canada RTD: Visa-free ~40-50 countries only. Needs visa for USA, UK, Schengen.
USA RTD: Visa-free ~130+ countries. Schengen visa-free 90 days.
UK CTD: Visa-free ~140+ countries including Schengen.
EU CTD: Free movement within Schengen. Outside EU varies.
Australia RTD: Visa-free ~140+ countries.
ALWAYS ask which country issued RTD before visa advice.
USER PROFILE USAGE: If user profile is provided below, use it automatically. Do NOT ask for passport, travel style, or preferences that are already in the profile. Skip those questions.

REALISTIC PRICING: NEVER invent hotel prices. Base on user's stated budget. Show 3 tiers if unclear.

WEATHER & SEASONAL AWARENESS: Always mention season, weather risks, what to pack.

HIDDEN GEMS — MANDATORY: Every trip plan MUST include a dedicated section:
## 💎 HIDDEN GEMS & LOCAL SECRETS
Include 2-3 hidden/lesser-known places locals love. These must be genuinely off-the-beaten-path — NOT tourist traps. Examples: a hidden alley café, a local night market, a secret viewpoint, a neighborhood not in guidebooks. Label each with 💎. Never skip this section.

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

VERIFIED HOTELS — CRITICAL:
If "NEARBY HOTELS (verified)" section exists in your context, you MUST use ONLY those hotel links. NEVER invent hotel URLs. NEVER use fake camping or hotel websites. Only link to major booking platforms: Booking.com, Hostelworld, Agoda, Expedia, Airbnb.

HOTEL LINKS:
For LUXURY: [Four Seasons](https://www.fourseasons.com/find-a-hotel/?q=City) · [Marriott](https://www.marriott.com/search/default.mi?q=Hotel+City)
For BUDGET: [Hostelworld](https://www.hostelworld.com/search?q=City) · [Booking.com](https://www.booking.com/search.html?ss=City) · [Airbnb](https://www.airbnb.com/s/City) For CAMPING: [Booking.com Camping](https://www.booking.com/search.html?ss=City+camping) · [Airbnb](https://www.airbnb.com/s/City)
For MID-RANGE: [Booking.com](https://www.booking.com/search.html?ss=City) · [Agoda](https://www.agoda.com/search?q=City) · [Expedia](https://www.expedia.com/Hotel-Search?destination=City)

ESIM — MANDATORY:
**📱 SIM & CONNECTIVITY** — Recommended: [eSIMania](https://tidd.ly/4cXnOko)

LINKS — MANDATORY: Every hotel, flight, visa, transport must have a clickable link.

YOUTUBE VIDEOS — MANDATORY:
If DESTINATION VIDEOS are provided in your context, you MUST include them in your response under a section called:
## 📺 WATCH BEFORE YOU GO
List every video link exactly as provided. Never skip this section if videos are available.`;

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
          userTier = 'explorer';
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

  // Get real-time travel context
const travelContext = await getTravelContext(messages);
  
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
  const useClaudeNow = needsClaudeQuality(messages) || imageInMessages || userTier === 'pro' || userTier === 'explorer';
  const plansLeft = Math.max(0, limits.plans - user.plansUsed);

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
  { role: "system", content: SYSTEM_MSG + (travelContext ? travelContext : '') },
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
        res.setHeader('X-Plans-Left', Math.max(0, limits.plans - user.plansUsed));
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
          system_instruction: { parts: [{ text: SYSTEM_MSG + (travelContext ? travelContext : '') }] },
          contents: geminiMessages,
          generationConfig: { maxOutputTokens: 4000, temperature: 0.7 }
        }),
      });
      const geminiData = await geminiRes.json();
      const geminiReply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (geminiReply) {
        user.tokensUsed += 2000;
        if (requestingNewPlan) user.plansUsed += 1;
        res.setHeader('X-Plans-Left', Math.max(0, limits.plans - user.plansUsed));
        return res.status(200).json({
          content: [{ type: "text", text: geminiReply }],
          usage: { input_tokens: 1000, output_tokens: 1000 }
        });
      }
    } catch(e) {}
  }

 try {
    const userPrefs=req.headers['x-user-prefs']?(()=>{try{return JSON.parse(decodeURIComponent(escape(atob(req.headers['x-user-prefs']))));}catch{return {};}})():{};
    const prefStr=[
      userPrefs.passport?`User passport: ${userPrefs.passport}`:'',
      userPrefs.homeCity?`User home city: ${userPrefs.homeCity}`:'',
      userPrefs.travelStyle?`User travel style: ${userPrefs.travelStyle}`:'',
      userPrefs.customPrefs?`User preferences: ${userPrefs.customPrefs}`:'',
    ].filter(Boolean).join('\n');
    // Explorer custom system prompt
    const customInstruction = userTier==='explorer' && req.headers['x-custom-prompt']
      ? decodeURIComponent(req.headers['x-custom-prompt'].replace(/\+/g,' ')).slice(0,500)
      : '';
    const systemWithPrefs = SYSTEM_MSG +
  (travelContext ? travelContext : '') +
  (prefStr ? `\n\nUSER PROFILE:\n${prefStr}` : '') +
  (customInstruction ? `\n\nEXPLORER CUSTOM INSTRUCTION (follow this for every response):\n${customInstruction}` : '');
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
        messages: messages.filter(m => m.role !== "system"),
      }),
    });
    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error });
    const inputTok = data.usage?.input_tokens || 0;
    const outputTok = data.usage?.output_tokens || 0;
    const used = inputTok + outputTok;
    user.tokensUsed += used;
    if (requestingNewPlan) user.plansUsed += 1;
    res.setHeader('X-Plans-Left', Math.max(0, limits.plans - user.plansUsed));
    // Log usage to Supabase (fire and forget)
    if (SUPABASE_SERVICE_KEY) {
      const costUsd = (inputTok / 1_000_000) * 3 + (outputTok / 1_000_000) * 15;
      const sbLog = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      sbLog.from('api_usage_log').insert({ user_id: userId || null, model: 'claude-sonnet-4', input_tokens: inputTok, output_tokens: outputTok, cost_usd: costUsd }).then(() => {}).catch(() => {});
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: { message: error.message } });
  }
}
