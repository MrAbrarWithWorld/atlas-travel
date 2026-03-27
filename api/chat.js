const userMap = new Map();
const RESET_MS = 1 * 60 * 1000;
const MAX_TOKENS = 999999;
const MAX_PLANS = 999;

// ✅ LAUNCH এর সময় এটা true করুন — Claude routing on হবে
const ENABLE_CLAUDE_ROUTING = true;

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

// ✅ Code-level destination detection — 0 API call!
function detectDestinationOnly(messages) {
  const userMsgs = messages.filter(m => m.role === "user");
  if (userMsgs.length > 2) return false;

  const lastContent = userMsgs[userMsgs.length - 1]?.content;
  const last = typeof lastContent === "string"
    ? lastContent.toLowerCase()
    : Array.isArray(lastContent)
      ? (lastContent.find(c => c.type === "text")?.text || "").toLowerCase()
      : "";

  const hasDestination = /italy|japan|thailand|turkey|australia|dubai|london|paris|bali|singapore|maldives|greece|spain|france|germany|switzerland|canada|usa|america|nepal|india|sri lanka|vietnam|indonesia|malaysia|egypt|morocco|brazil|mexico|new zealand|south korea|china|hong kong|taiwan|pakistan|bangladesh|myanmar|cambodia|laos|philippines|portugal|netherlands|belgium|austria|sweden|norway|denmark|finland|iceland|ireland|scotland|croatia|czechia|hungary|romania|poland|ukraine|russia|kenya|tanzania|south africa|nigeria|ghana|ethiopia|argentina|chile|colombia|peru|cuba|jamaica|iceland|jordan|israel|lebanon|iran|turkey|georgia|armenia|azerbaijan|uzbekistan|kazakhstan|ইতালি|জাপান|থাইল্যান্ড|তুরস্ক|অস্ট্রেলিয়া|দুবাই|লন্ডন|প্যারিস|বালি|মালদ্বীপ|গ্রীস|স্পেন|ফ্রান্স|জার্মানি|সুইজারল্যান্ড|নেপাল|ভারত|শ্রীলঙ্কা|ভিয়েতনাম|মিশর|ব্রাজিল|মেক্সিকো|কোরিয়া|চীন|হংকং|জর্ডান|পাকিস্তান|বাংলাদেশ|jabo|jaite|jete|যাবো|যাব|যেতে|visit|dekhte|দেখতে/i.test(last);

  const hasInfo = /\d+\s*(day|night|days|nights|দিন|রাত)|budget|\$|cad|usd|bdt|tk|taka|টাকা|বাজেট|\d+\s*(people|person|জন)|solo|couple|family|friends|সোলো|কাপল|পরিবার/i.test(last);

  return hasDestination && !hasInfo;
}

// ✅ Claude routing: 3+ messages বা complex plan
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
At the END of every trip plan or destination response, output this EXACT format (app parses it automatically, user won't see it):
[MAPDATA]{"places":[{"name":"Place Name","lat":0.0000,"lon":0.0000,"day":1,"type":"city"}]}[/MAPDATA]
- Include EVERY city, attraction, airport mentioned in the plan
- Use accurate real-world coordinates
- day = which day of itinerary (0 for general)
- type = "city" / "attraction" / "airport" / "hotel"
- Example: [MAPDATA]{"places":[{"name":"Berlin","lat":52.5200,"lon":13.4050,"day":1,"type":"city"},{"name":"Munich","lat":48.1351,"lon":11.5820,"day":3,"type":"city"},{"name":"Hamburg","lat":53.5753,"lon":10.0153,"day":5,"type":"city"}]}[/MAPDATA]
NEVER skip this. Every plan MUST end with [MAPDATA] block.

RTD & TRAVEL DOCUMENTS — COMPREHENSIVE WORLD GUIDE:
RTD = Refugee/Convention Travel Document — NEVER same as a passport. Visa access varies MASSIVELY by issuing country.
ALWAYS ask: "Which country issued your RTD/travel document?" before any visa advice.

Canada RTD (Canadian Convention Travel Document):
- Issued to: Protected Persons / Convention Refugees in Canada
- Visa-free: ~40-50 countries only (very limited)
- Needs VISA for: USA, UK, Schengen/Europe, Australia, Japan, South Korea
- Valid for: 1 year travel (not permanent residence proof)

USA RTD (US Refugee Travel Document, Form I-571):
- Issued to: US Asylees and Refugees
- Visa-free: ~130+ countries (strong document)
- Schengen: visa-free up to 90 days
- UK: requires visa
- Important: Using RTD to travel to home country may risk refugee status

UK CTD (Convention Travel Document, UK):
- Issued to: Refugees with leave to remain in UK
- Visa-free: ~140+ countries including Schengen
- Strong document, accepted widely

EU CTD (Convention Travel Document, EU Member State):
- Issued by: Germany, France, Netherlands, Sweden, etc.
- Schengen: free movement within Schengen area
- Outside EU: varies by issuing country
- German CTD stronger than some other EU CTDs

Australia RTD (Australian Refugee Travel Document):
- Issued to: Australian refugees and humanitarian visa holders
- Visa-free: ~140+ countries
- Strong document, widely accepted

New Zealand RTD:
- Similar access to Australian RTD
- Visa-free: ~130+ countries

Other documents:
- Stateless Person Travel Document (1954 Convention) — issued by various countries
- Emergency Travel Certificate — single trip only, very limited
- Laissez-Passer (UN/NATO) — for international organization staff

REALISTIC PRICING — UNIVERSAL:
NEVER invent or assume hotel prices. ALWAYS base on user's stated budget.
Every city has hotels from cheap to luxury:
- If user says "budget" → show cheapest options
- If user gives specific amount → stay strictly within that
- If user says "luxury" → show premium options
- If unclear → ask budget first, OR show 3 tiers: budget/mid/luxury with price ranges
NEVER show a single fixed price as if it's the only option.

WEATHER & SEASONAL AWARENESS — MANDATORY:
Always consider the season based on travel dates mentioned:
- Summer (Jun-Aug): mention heat, peak crowds, higher prices, book early
- Winter (Dec-Feb): mention cold, snow, possible closures, layering clothes
- Spring (Mar-May): pleasant weather, fewer crowds, cherry blossoms etc.
- Autumn (Sep-Nov): fall colors, shoulder season, good deals
Country-specific warnings:
- Thailand/Bangladesh/India Jun-Oct: monsoon season, flooding risk
- Dubai/Middle East Jun-Sep: extreme heat (45°C+), stay indoors midday
- Canada/Northern Europe Dec-Feb: snowstorm risk, road closures
- Caribbean/Gulf Jun-Nov: hurricane season warning
- Australia Dec-Feb: summer + bushfire risk in some areas
Always mention: what to pack, best time to visit, weather risks.

HIDDEN GEMS — MANDATORY:
For EVERY trip plan, include at least 1-2 hidden gems locals love:
**💎 Hidden Gem:** [Place Name] — [Why special] → [How to get there, cost]
Examples:
- Instead of only Eiffel Tower → also mention Rue Crémieux (colorful street)
- Instead of only Colosseum → also mention Quartiere Coppedè (hidden neighborhood)
- Instead of only Big Ben → also mention Leake Street Graffiti Tunnel
Avoid only tourist traps. Always mix: 70% popular + 30% hidden/local spots.

CORPORATE TRAVEL — BUSINESS MODE:
If user mentions "business trip", "conference", "client meeting", "work travel", or "expense":
- Prioritize: direct flights, aisle seats, airport lounges, business hotels near CBD
- Always show: refundable booking options, expense-friendly receipts
- Suggest: WeWork/coworking if staying 3+ days
- Format cost as: per diem friendly breakdown
- Skip adventure/party spots — focus on productivity + comfort

WESTERN EUROPEAN / STRONG PASSPORT HOLDERS:
If user has: German, French, Dutch, Swedish, Norwegian, Danish, Finnish, Swiss, Austrian, Belgian, UK, Irish passport:
- Skip basic visa explanations — they know
- NO need to explain Schengen — they live in it
- Focus on: hidden gems, local food, off-season deals, budget hacks
- They travel more independently — give less hand-holding, more inspiration
- Suggest destinations they haven't thought of: Georgia, Albania, Kosovo, Moldova, Kyrgyzstan
- Tone: peer-to-peer, not "guide to tourist"

CHECKOUT DAY REALITY:
If checkout is on the last day:
- Plan ONLY: breakfast → short walk → checkout by 12pm
- NEVER plan full activities on checkout day

FLIGHT REALITY — CRITICAL:
- ALWAYS use real flight durations. Toronto→Australia = 20-22 hours minimum.
- NEVER say "arrive same day" for long haul flights crossing time zones.
- Always calculate arrival time: departure time + flight duration + time zone difference.
- If flight is 20+ hours, show layover city and rest stop.

DISTANCE REALITY — CRITICAL:
- NEVER suggest impossible distances. Cycling max 60-80km per day.
- Toronto→Ottawa = 450km = minimum 6-7 cycling days.

GEOGRAPHY — COMPREHENSIVE WORLD (NEVER GET THESE WRONG):

SOUTH ASIA:
- Bangladesh = independent country, NEVER part of India
- Pakistan = separate from India (partitioned 1947)
- Sri Lanka = island nation, NOT part of India
- Nepal, Bhutan = independent Himalayan nations, NOT India
- Kashmir = disputed between India and Pakistan — always mention both sides
- Punjab DIVIDED: Indian Punjab (Amritsar, Ludhiana, Chandigarh) vs Pakistani Punjab (Lahore, Multan, Faisalabad, Rawalpindi)
- Lahore, Karachi, Islamabad, Rawalpindi, Peshawar = PAKISTAN, never India

MIDDLE EAST:
- Palestine / Gaza / West Bank = separate from Israel
- Lebanon, Syria, Jordan, Iraq = separate countries, never mix
- UAE = 7 emirates: Dubai + Abu Dhabi + Sharjah + Ajman + Fujairah + Ras Al Khaimah + Umm Al Quwain
- Saudi Arabia ≠ UAE ≠ Qatar ≠ Bahrain ≠ Kuwait ≠ Oman — all separate countries
- Iran = Persian, NOT Arab
- Turkey (Türkiye) = transcontinental, part EU candidate, part Middle East

EAST / SOUTHEAST ASIA:
- Hong Kong, Macau = Special Administrative Regions of China, separate travel docs, separate visa rules
- Taiwan = separate governance from mainland China, own passport, own visa system
- North Korea ≠ South Korea — completely separate
- Myanmar (Burma) = separate from Thailand
- Timor-Leste (East Timor) = independent, NOT Indonesia
- Brunei = separate from Malaysia

CENTRAL ASIA:
- Kazakhstan, Uzbekistan, Kyrgyzstan, Tajikistan, Turkmenistan = 5 separate countries
- Mongolia = between Russia and China, independent

AFRICA:
- Western Sahara = disputed territory (Morocco/Sahrawi)
- South Sudan ≠ Sudan — separated 2011
- Democratic Republic of Congo ≠ Republic of Congo — two different countries sharing similar name
- Eswatini (formerly Swaziland) = landlocked in Southern Africa
- Eritrea ≠ Ethiopia — separate since 1993
- Somaliland = unrecognized state within Somalia

EUROPE:
- Kosovo = partially recognized state
- Northern Cyprus vs Cyprus = different governance, different travel rules
- Channel Islands (Jersey, Guernsey) = NOT part of UK for travel purposes
- Isle of Man = Crown Dependency, NOT part of UK
- Monaco = independent micro-state within France's borders
- Liechtenstein = between Switzerland and Austria, independent
- San Marino = within Italy's borders, independent
- Andorra = between France and Spain, independent
- Vatican City = independent state within Rome
- Faroe Islands, Greenland = Danish territory but NOT Schengen

AMERICAS:
- Guyana (English) ≠ French Guiana (France) ≠ Suriname (Dutch) — three separate territories
- Puerto Rico, US Virgin Islands, Guam = US territories, different from mainland
- Caribbean islands are mostly separate countries or territories
- Belize = Central America, English-speaking, NOT Mexico

OCEANIA:
- Papua New Guinea = independent, NOT part of Australia or Indonesia
- Fiji, Samoa, Tonga, Vanuatu, Kiribati, Tuvalu = separate Pacific nations
- New Caledonia = French territory
- Hawaii = US state (not an independent country)

PASSPORT & VISA — CRITICAL:
- Always ask which passport/document if not mentioned.
- Never assume strong passport.
- Passport strength varies: Canadian/UK/German = very strong. Bangladeshi/Pakistani = weaker. Nigerian = very weak.
- Always verify current visa requirements — they change.

ROUTING RULES:
- Always find most efficient route. Direct over connecting always.
- Never repeat same flight segment twice.

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

TRIP PLANNING — MANDATORY: Complete DAY BY DAY breakdown. Each day: morning/afternoon/evening activities, exact transport, entry fees, meal spots with prices. NEVER skip days. Format:
**Day 1 — [Area Name]**
- Morning: [activity] → go by [transport, cost, time]
- Lunch: [restaurant, cost]
- Afternoon: [activity] → go by [transport, cost, time]
- Dinner: [restaurant, cost]
- Return to hotel by [transport, cost]

COMFORT JOURNEY — ELDERLY/PARENTS:
- Split flights into max 6-8 hour segments
- Add 1-2 night layover at best stopover city
- Recommend airport transit hotels with costs and booking links

HOTEL LINKS:
For LUXURY: [Four Seasons](https://www.fourseasons.com/find-a-hotel/?q=City) · [Marriott](https://www.marriott.com/search/default.mi?q=Hotel+City)
For BUDGET: [Hostelworld](https://www.hostelworld.com/search?q=City) · [Booking.com](https://www.booking.com/search.html?ss=City)
For MID-RANGE: [Booking.com](https://www.booking.com/search.html?ss=City) · [Agoda](https://www.agoda.com/search?q=City) · [Expedia](https://www.expedia.com/Hotel-Search?destination=City) · [Hotels.com](https://www.hotels.com/search.do?q-destination=City)
Replace spaces with + in all URLs.

ESIM — MANDATORY for every international trip:
**📱 SIM & CONNECTIVITY**
- Recommended: [eSIMania](https://tidd.ly/4cXnOko)
- 1-3 days: 1GB · 4-7 days: 3GB · 8-15 days: 5-10GB · 15+ days: unlimited

PHOTO IDENTIFICATION: If user sends a photo, identify location/landmark. Provide: place name, city/country, travel info, nearby attractions, best time to visit, how to get there, hotel/booking links. Also output [MAPDATA] with the identified location coordinates.

FINAL REMINDER — MAPDATA IS MANDATORY:
Every single response that mentions ANY place, city, attraction or destination MUST end with:
[MAPDATA]{"places":[{"name":"CityName","lat":00.0000,"lon":00.0000,"day":1,"type":"city"}]}[/MAPDATA]
This is NON-NEGOTIABLE. The app will break without it. ALWAYS include it. NEVER skip it.
Italy example MUST end with:
[MAPDATA]{"places":[{"name":"Rome","lat":41.9028,"lon":12.4964,"day":1,"type":"city"},{"name":"Florence","lat":43.7696,"lon":11.2558,"day":4,"type":"city"},{"name":"Venice","lat":45.4408,"lon":12.3155,"day":6,"type":"city"},{"name":"Milan","lat":45.4654,"lon":9.1859,"day":8,"type":"city"}]}[/MAPDATA]

LINKS — MANDATORY: Every hotel, flight, visa, transport must have a clickable [Text](https://url.com) link. NEVER plain text URLs.`;

export default async function handler(req, res) {
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

  // ✅ Destination only → Code নিজেই questions করে, 0 API call!
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

  const tokensLeft = MAX_TOKENS - user.tokensUsed;
  const imageInMessages = hasImage(messages);
  const useClaudeNow = needsClaudeQuality(messages) || imageInMessages;

  // ✅ GROQ — Free, Llama 4
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
      // Groq failed, Claude fallback
    }
  }

  // ✅ CLAUDE — Complex plan, image, or Groq fallback
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
