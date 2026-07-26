const DESTINATIONS = {
  tokyo: {
    name: "Tokyo", country: "Japan", emoji: "🗼",
    title: "Tokyo Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your perfect Tokyo trip with Atlas AI. Get a custom day-by-day itinerary, visa info for your passport, hotel picks, and a map of top attractions — free.",
    hero: "Tokyo is a city where ancient temples stand beside neon-lit skyscrapers, and a bowl of ramen can cost $5 or $500. From the electric chaos of Shibuya Crossing to the silent moss gardens of Kyoto-style shrines tucked inside the city, Tokyo rewards the curious traveller at every turn.",
    highlights: ["Shibuya Crossing & Harajuku", "Senso-ji Temple in Asakusa", "teamLab Borderless digital art", "Tsukiji Outer Market breakfast", "Shinjuku Gyoen National Garden", "Akihabara electronics & anime district"],
    bestTime: "March–April (cherry blossoms) and October–November (autumn foliage). Avoid August — hot, humid, and crowded.",
    visa: "Visa-free for 90 days for Canadian, US, UK, EU, Australian passports. Bangladeshi and Pakistani passports require a visa (apply at Japanese embassy).",
    budget: "Budget: $70–100/day. Mid-range: $150–250/day. Luxury: $400+/day.",
    faqs: [
      { q: "Do I need a visa for Tokyo?", a: "Most Western passports (Canada, USA, UK, EU, Australia) are visa-free for 90 days. South Asian passports (Bangladesh, Pakistan, India) require a tourist visa." },
      { q: "How many days do I need in Tokyo?", a: "5–7 days covers the main neighbourhoods comfortably. 10+ days lets you add day trips to Nikko, Hakone, or Kyoto." },
      { q: "What is the best area to stay in Tokyo?", a: "Shinjuku for convenience, Shibuya for nightlife, Asakusa for traditional culture, Akihabara for anime and tech." },
    ]
  },
  paris: {
    name: "Paris", country: "France", emoji: "🗺",
    title: "Paris Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your perfect Paris trip with Atlas AI. Day-by-day itineraries, visa requirements, hotel picks from budget to luxury, and an interactive map — free.",
    hero: "Paris is the city that invented the idea of the romantic getaway — and somehow it still lives up to the reputation. Beyond the Eiffel Tower and the Louvre lies a city of covered passages, neighbourhood markets, and bistros where a glass of wine and a steak frites is an event worth lingering over.",
    highlights: ["Eiffel Tower at golden hour", "Musée du Louvre (book in advance)", "Montmartre & Sacré-Cœur", "Seine River cruise", "Le Marais neighbourhood", "Versailles day trip"],
    bestTime: "April–June and September–October. July–August is peak tourist season with long queues. December is magical for Christmas markets.",
    visa: "Schengen visa-free for up to 90 days for Canadian, US, UK, Australian passports. Bangladeshi, Pakistani, Indian passports require a Schengen short-stay visa.",
    budget: "Budget: $100–130/day. Mid-range: $200–350/day. Luxury: $500+/day.",
    faqs: [
      { q: "Do I need a Schengen visa for Paris?", a: "Canadian, US, Australian, and most Western passports are visa-free for 90 days. South Asian and African passports need a Schengen visa — apply 3–6 weeks in advance." },
      { q: "How many days is enough for Paris?", a: "3–4 days for the main sights. 5–7 days to explore neighbourhoods and take a Versailles day trip at a relaxed pace." },
      { q: "Is Paris expensive?", a: "Paris can fit any budget. A boulangerie lunch is under $10. Museum entry is €20. Budget travellers spend $100–130/day; mid-range $200–350." },
    ]
  },
  bali: {
    name: "Bali", country: "Indonesia", emoji: "🌴",
    title: "Bali Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Bali trip with Atlas AI. Get a personalised itinerary with rice terraces, temples, beach clubs, visa-on-arrival info, and hotels for every budget.",
    hero: "Bali is one of the few places on earth where spirituality, nature, and world-class hospitality exist in perfect balance. Rice paddies cascade down volcanic hillsides in Ubud while surfers chase barrels in Uluwatu and digital nomads fill café terraces in Canggu.",
    highlights: ["Tegallalang Rice Terraces in Ubud", "Uluwatu Temple at sunset", "Seminyak beach clubs", "Mount Batur sunrise hike", "Tirta Empul holy spring temple", "Nusa Penida island day trip"],
    bestTime: "May–October (dry season) is ideal. November–April is wet season — cheaper but afternoon showers are common.",
    visa: "Visa-on-arrival (30 days, extendable) for most nationalities including Canada, US, UK, EU, Australia, Bangladesh, India, Pakistan. Cost: ~$35 USD.",
    budget: "Budget: $40–60/day. Mid-range: $100–180/day. Luxury villas: $300+/day.",
    faqs: [
      { q: "Do I need a visa for Bali?", a: "Most nationalities including Canada, USA, UK, EU, Australia, Bangladesh, India, and Pakistan can get a visa-on-arrival at Denpasar airport. Cost is ~$35 USD for 30 days." },
      { q: "How long should I spend in Bali?", a: "10–14 days lets you explore Ubud, Seminyak, Uluwatu, and Nusa Penida comfortably. A week is doable but feels rushed." },
      { q: "Is Bali good for solo travel?", a: "Bali is one of the most solo-friendly destinations in Asia. The backpacker scene is huge, especially in Canggu and Ubud." },
    ]
  },
  dubai: {
    name: "Dubai", country: "UAE", emoji: "🏙",
    title: "Dubai Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Dubai trip with Atlas AI. Instant itineraries, visa requirements, hotel and resort picks, and a full cost breakdown for any passport type.",
    hero: "Dubai is a city built on ambition — the tallest building, the largest mall, the only 7-star hotel. But underneath the spectacle is a genuinely fascinating place where a multicultural city of 200 nationalities has created its own unique character. The spice souks of Deira are as much Dubai as the infinity pools of the Palm.",
    highlights: ["Burj Khalifa At the Top observation deck", "Dubai Mall & the Dubai Fountain", "Old Dubai — Al Fahidi & Dubai Creek", "Desert safari with sandboarding", "Palm Jumeirah & Atlantis", "Dubai Marina yacht cruise"],
    bestTime: "November–March: perfect weather (24–28°C). April–October is extremely hot (40°C+). Dubai is a winter destination.",
    visa: "Visa-free for Canadian, US, UK, EU, Australian passports (30–90 days). Bangladeshi, Pakistani, Indian passports require a UAE tourist visa (apply online, 30-day e-visa ~$90).",
    budget: "Budget: $100–150/day. Mid-range: $200–350/day. Luxury: $500+/day.",
    faqs: [
      { q: "Do I need a visa for Dubai?", a: "Canadian, US, UK, and EU passport holders get visa-free entry. Bangladeshi, Indian, and Pakistani nationals need a 30-day e-visa — apply online at icp.gov.ae." },
      { q: "What is the best time to visit Dubai?", a: "November to March is ideal — warm but not extreme. Avoid May to September unless you love 45°C heat." },
      { q: "Is Dubai expensive?", a: "Dubai can be surprisingly affordable if you avoid luxury hotels. Budget travellers spend $100–150/day. Metro and buses are cheap. Food ranges from $2 shawarmas to $200 steakhouses." },
    ]
  },
  "new-york": {
    name: "New York", country: "USA", emoji: "🗽",
    title: "New York City Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your New York City trip with Atlas AI. Day-by-day itineraries covering Manhattan, Brooklyn, and beyond — visa info, hotels for all budgets, and insider tips.",
    hero: "New York City is the city that never stops surprising you. The skyline from the Brooklyn Bridge at dawn, a $1 pizza slice eaten on the sidewalk, the silence inside the MoMA — New York is a thousand cities in one, and a week there barely scratches the surface.",
    highlights: ["Central Park & the Met Museum", "Brooklyn Bridge walk", "Times Square & Broadway show", "High Line elevated park", "One World Observatory", "Smorgasburg food market (weekends)"],
    bestTime: "April–June and September–November. Christmas season (December) is magical but expensive. July–August is hot and humid.",
    visa: "Canadian citizens enter visa-free. Most other nationalities need a US tourist visa (B-1/B-2) or ESTA waiver (for VWP countries like UK, EU, Australia). Cost: ESTA $21, B-2 visa $185.",
    budget: "Budget: $120–180/day. Mid-range: $250–400/day. Luxury: $600+/day.",
    faqs: [
      { q: "Do I need a US visa for New York?", a: "Canadian citizens are visa-free. Citizens of Visa Waiver Program countries (UK, EU, Australia, Japan etc.) need an ESTA ($21). Other nationalities need a B-2 tourist visa." },
      { q: "How many days should I spend in New York?", a: "5–7 days covers Manhattan highlights plus Brooklyn. 10 days lets you explore Queens, the Bronx, and day trips to the Hamptons or Hudson Valley." },
      { q: "Which neighbourhood should I stay in NYC?", a: "Midtown Manhattan for convenience. Lower East Side or Brooklyn for a more local vibe. Avoid Times Square hotels — expensive and noisy." },
    ]
  },
  london: {
    name: "London", country: "UK", emoji: "🎡",
    title: "London Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your London trip with Atlas AI. Custom itineraries, visa info for your passport, neighbourhood guides, and budget breakdowns — free.",
    hero: "London is a city that reinvents itself constantly while keeping its character intact. Free world-class museums, a pub on every corner, and a food scene that long ago stopped apologising for itself. From the grandeur of Westminster to the markets of Brick Lane, London rewards every style of traveller.",
    highlights: ["British Museum & National Gallery (free)", "Tower of London & Tower Bridge", "Borough Market for food", "Notting Hill & Portobello Road", "West End theatre show", "Greenwich & the Meridian Line"],
    bestTime: "May–September for the best weather and outdoor events. December for Christmas atmosphere. July–August is peak season with crowds.",
    visa: "UK has its own visa rules (not Schengen). Canadian, Australian, and US citizens are visa-free for 6 months. Most South Asian passports (Bangladesh, India, Pakistan) need a UK Standard Visitor Visa.",
    budget: "Budget: $100–150/day. Mid-range: $200–350/day. Luxury: $500+/day.",
    faqs: [
      { q: "Do Bangladeshi citizens need a visa for London?", a: "Yes. Bangladeshi, Pakistani, and Indian nationals need a UK Standard Visitor Visa — apply at the UK Visas and Immigration website. Processing takes 3–8 weeks." },
      { q: "How many days do I need in London?", a: "4–5 days covers the main sights. 7–10 days lets you do day trips to Oxford, Bath, Stonehenge, and explore London's many distinct neighbourhoods at a relaxed pace." },
      { q: "Is London expensive?", a: "London is one of Europe's priciest cities, but many of its best attractions — the British Museum, National Gallery, Tate Modern — are completely free. Budget travellers manage on $100–150/day." },
    ]
  },
  rome: {
    name: "Rome", country: "Italy", emoji: "🏛",
    title: "Rome Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Rome trip with Atlas AI. Itineraries for the Colosseum, Vatican, and beyond — Schengen visa info, hotel picks, and a full cost breakdown.",
    hero: "Rome is the world's greatest open-air museum. Every piazza has a story; every cobblestone street leads somewhere worth stopping. The Colosseum, the Pantheon, and the Vatican are obvious starting points — but Rome rewards those who get lost in Trastevere with a glass of wine and no agenda.",
    highlights: ["The Colosseum & Roman Forum", "Vatican Museums & Sistine Chapel", "Pantheon (now requires booking)", "Trastevere neighbourhood at night", "Trevi Fountain at dawn (fewer crowds)", "Campo de' Fiori morning market"],
    bestTime: "April–June and September–October. July–August is extremely hot and crowded. Christmas is quiet and atmospheric.",
    visa: "Schengen visa-free (90 days) for Canadian, US, Australian, UK passports. Bangladeshi, Pakistani, Indian passports need a Schengen C-visa — apply at Italian consulate.",
    budget: "Budget: $80–110/day. Mid-range: $180–280/day. Luxury: $400+/day.",
    faqs: [
      { q: "Do I need a visa for Rome?", a: "Most Western passports are Schengen visa-free for 90 days. Bangladeshi, Indian, and Pakistani citizens need a Schengen tourist visa from the Italian consulate." },
      { q: "How many days do I need in Rome?", a: "3–4 days for the main highlights. 5–6 days to include day trips to Pompeii, Tivoli, or the Amalfi Coast." },
      { q: "Is Rome safe for tourists?", a: "Rome is generally safe. Watch out for pickpockets around tourist sites (Colosseum, Trevi Fountain, on Metro Line A). Keep your bag in front of you in crowds." },
    ]
  },
  bangkok: {
    name: "Bangkok", country: "Thailand", emoji: "🛕",
    title: "Bangkok Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Bangkok trip with Atlas AI. Itineraries, visa-on-arrival info, budget breakdowns, street food guides, and hotel picks for every budget.",
    hero: "Bangkok is a city that hits all your senses at once — the smell of pad thai from a street cart, the roar of a tuk-tuk, the golden spires of Wat Phra Kaew rising above the Chao Phraya. It's chaotic, beautiful, deeply spiritual, and relentlessly fun.",
    highlights: ["Grand Palace & Wat Phra Kaew", "Wat Pho reclining Buddha", "Chatuchak Weekend Market", "Khao San Road nightlife", "Floating markets day trip", "Chinatown (Yaowarat) for food"],
    bestTime: "November–February (cool season, 25–32°C). March–May is very hot. June–October is rainy season but cheaper.",
    visa: "Visa exemption 30 days (extendable to 60) for Canadian, US, UK, EU, Australian passports. Bangladeshi passport: visa-on-arrival at Bangkok airport ($35, 15 days). Indian passport: visa-on-arrival ($35, 15 days).",
    budget: "Budget: $35–55/day. Mid-range: $80–150/day. Luxury: $250+/day.",
    faqs: [
      { q: "Do Bangladeshi citizens need a visa for Bangkok?", a: "Bangladeshi citizens can get a visa-on-arrival at Suvarnabhumi Airport — cost is approximately $35 USD for 15 days. Bring a passport photo and proof of accommodation." },
      { q: "Is Bangkok good for budget travel?", a: "Bangkok is one of the world's best cities for budget travel. Street food meals cost $1–3, hostel dorms from $8/night, and tuk-tuk rides are fun and cheap." },
      { q: "How many days should I spend in Bangkok?", a: "3–4 days to see the main temples, markets, and nightlife. Use Bangkok as a base to add Pattaya, Phuket, Chiang Mai, or Krabi." },
    ]
  },
  singapore: {
    name: "Singapore", country: "Singapore", emoji: "🦁",
    title: "Singapore Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Singapore trip with Atlas AI. Itineraries covering Marina Bay, Gardens by the Bay, Hawker centres, and visa info for all passport types.",
    hero: "Singapore is proof that a tiny island city-state can become one of the world's most dynamic destinations. Gardens by the Bay glows at night, hawker centres serve some of the world's best cheap food, and the mix of Chinese, Malay, Indian, and Western cultures creates a city unlike anywhere else.",
    highlights: ["Gardens by the Bay & the Supertrees", "Marina Bay Sands SkyPark", "Sentosa Island & Universal Studios", "Chinatown, Little India & Kampong Glam", "Hawker centres (Maxwell, Lau Pa Sat)", "Singapore Zoo morning safari"],
    bestTime: "February–April is the driest period. Singapore is warm and humid year-round (27–32°C). Rain is possible any month.",
    visa: "Visa-free for Canadian, US, UK, EU, Australian, Indian, Bangladeshi passports (30 days). Most nationalities enter without a visa.",
    budget: "Budget: $80–120/day. Mid-range: $180–300/day. Luxury: $500+/day.",
    faqs: [
      { q: "Do Bangladeshi citizens need a visa for Singapore?", a: "No. Bangladeshi passport holders get visa-free entry to Singapore for 30 days." },
      { q: "Is Singapore expensive?", a: "Singapore is pricier than its Southeast Asian neighbours, but hawker centre meals cost $3–6 SGD. Budget travellers spend around $80–120/day. Hotels are the biggest expense." },
      { q: "How many days should I spend in Singapore?", a: "3–4 days is enough to see the city's highlights. Singapore also works well as a transit stop when flying between Europe/North America and Southeast Asia." },
    ]
  },
  maldives: {
    name: "Maldives", country: "Maldives", emoji: "🏝",
    title: "Maldives Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Maldives trip with Atlas AI. Overwater villa options for every budget, visa-on-arrival info, inter-island transfers, snorkelling spots, and full cost breakdowns.",
    hero: "The Maldives is the purest expression of tropical paradise — turquoise lagoons, white sand that squeaks underfoot, and the kind of silence you travel the world to find. Whether you're splurging on an overwater villa or exploring local guesthouses on inhabited islands, the Maldives delivers.",
    highlights: ["Overwater bungalow sunrise", "Snorkelling with manta rays & whale sharks", "Local island guesthouses (budget option)", "Underwater restaurant at Ithaa", "Bioluminescent beach at Vaadhoo", "Seaplane transfers between atolls"],
    bestTime: "November–April (dry season, calm seas). May–October is wet season with lower prices and possible rain.",
    visa: "Free 30-day visa on arrival for all nationalities — no advance application needed. Just show proof of onward ticket and accommodation.",
    budget: "Budget (local islands): $80–120/day. Mid-range resort: $300–600/day. Luxury overwater villa: $1,000–5,000+/day.",
    faqs: [
      { q: "Do I need a visa for the Maldives?", a: "No. Every nationality gets a free 30-day visa on arrival at Malé International Airport. You need a return ticket and proof of accommodation." },
      { q: "Can I visit the Maldives on a budget?", a: "Yes — stay on local guesthouses on inhabited islands like Maafushi or Thulusdhoo. Meals and accommodation cost $60–100/day total. Resort islands are far more expensive." },
      { q: "How do I get between islands?", a: "Speedboat transfers ($25–80 USD) for nearby atolls. Seaplanes ($350–700 USD per person) for remote atolls. Public ferries are cheapest but slow." },
    ]
  },
  barcelona: {
    name: "Barcelona", country: "Spain", emoji: "🌞",
    title: "Barcelona Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Barcelona trip with Atlas AI. Gaudí architecture, beach, food, Schengen visa info, and a full day-by-day itinerary for any budget.",
    hero: "Barcelona is the city that produces architectural genius, world-class food, and the Mediterranean's best urban beach — all within walking distance of each other. Gaudí's Sagrada Família has been under construction for over 140 years and is still the most breathtaking building in Europe.",
    highlights: ["Sagrada Família (book weeks ahead)", "Park Güell at opening time", "La Barceloneta beach", "La Boqueria market", "Gothic Quarter evening stroll", "Camp Nou stadium tour"],
    bestTime: "May–June and September–October. July–August is peak season — hot, crowded, and pricey. Spring and autumn are perfect.",
    visa: "Schengen visa-free (90 days) for Canadian, US, UK, Australian passports. Bangladeshi, Pakistani, Indian passports need a Schengen visa from the Spanish consulate.",
    budget: "Budget: $80–110/day. Mid-range: $180–280/day. Luxury: $400+/day.",
    faqs: [
      { q: "Do I need a visa for Barcelona?", a: "Schengen visa-free for most Western passports. Bangladeshi, Indian, and Pakistani citizens need a Spain Schengen visa — apply 4–6 weeks in advance at the consulate." },
      { q: "When should I visit Barcelona?", a: "May, June, September, and October are the sweet spots — warm but not overwhelmingly hot, and far fewer crowds than peak July/August." },
      { q: "Is Barcelona safe for tourists?", a: "Barcelona is generally safe but has a high rate of pickpocketing, especially on Las Ramblas, at Barceloneta beach, and the Metro. Use a crossbody bag and keep valuables out of sight." },
    ]
  },
  istanbul: {
    name: "Istanbul", country: "Turkey", emoji: "🕌",
    title: "Istanbul Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Istanbul trip with Atlas AI. Hagia Sophia, Grand Bazaar, Bosphorus cruise itineraries — visa info, budget tips, and hotels for every budget.",
    hero: "Istanbul is the only city in the world that straddles two continents — and its culture, food, and architecture reflect that unique position. The call to prayer echoes over the Bosphorus as ferries cut between Europe and Asia, and a glass of çay (tea) is always within reach.",
    highlights: ["Hagia Sophia & Blue Mosque", "Grand Bazaar & Spice Market", "Bosphorus strait cruise", "Topkapi Palace", "Karaköy & Galata Tower neighbourhood", "Balık ekmek (fish sandwich) at Eminönü"],
    bestTime: "April–May and September–October. July–August is hot and crowded. December–February is cold but uncrowded.",
    visa: "Turkish e-Visa online ($50–$100 depending on nationality) for Canadian, US, UK passports. EU citizens often visa-free. Bangladeshi passports: e-Visa available online.",
    budget: "Budget: $50–80/day. Mid-range: $120–200/day. Luxury: $350+/day.",
    faqs: [
      { q: "Do I need a visa for Istanbul?", a: "Most nationalities can apply for a Turkish e-Visa online at evisa.gov.tr before travelling. Costs vary by nationality. EU citizens are often visa-free." },
      { q: "Is Istanbul safe for tourists?", a: "Istanbul's main tourist areas are generally very safe. Normal city awareness applies. The metro and trams are reliable and safe." },
      { q: "How many days do I need in Istanbul?", a: "3–4 days covers the Sultanahmet and Beyoğlu highlights. 5–7 days lets you slow down, explore Asian side neighbourhoods, and do a Princes' Islands day trip." },
    ]
  },
  seoul: {
    name: "Seoul", country: "South Korea", emoji: "🏙",
    title: "Seoul Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Seoul trip with Atlas AI. K-culture, street food, palaces, visa info for all passports, and budget breakdowns — day-by-day itinerary, free.",
    hero: "Seoul is the city that exported its culture to the world — K-pop, K-dramas, Korean BBQ, skincare — and then kept its best secrets for those who show up in person. Ancient palaces sit between gleaming glass towers. Pojangmacha tented food stalls spill onto pavements at night.",
    highlights: ["Gyeongbokgung Palace at dawn", "Bukchon Hanok Village", "Myeongdong shopping & street food", "Hongdae indie music and nightlife", "Insadong tea houses and galleries", "Han River park picnic at sunset"],
    bestTime: "March–May (spring, cherry blossoms) and September–November (crisp autumn colours). January–February is very cold. Summer is hot and humid.",
    visa: "Visa-free 90 days for Canadian, US, UK, EU, Australian passports. Bangladeshi passport requires a South Korean tourist visa. Indian passport: K-ETA (electronic travel authorisation) or visa.",
    budget: "Budget: $50–80/day. Mid-range: $120–200/day. Luxury: $350+/day.",
    faqs: [
      { q: "Do Bangladeshi citizens need a visa for Seoul?", a: "Yes, Bangladeshi citizens need a South Korean tourist visa — apply at the Korean embassy in Dhaka. Processing takes 5–10 business days." },
      { q: "Is Seoul good for solo travel?", a: "Seoul is excellent for solo travellers — incredibly safe, easy to navigate by subway, and full of solo-friendly cafés, restaurants, and guesthouses." },
      { q: "How many days should I spend in Seoul?", a: "4–5 days covers the city highlights. Add day trips to the DMZ, Suwon Fortress, or Nami Island for a longer trip." },
    ]
  },
  kyoto: {
    name: "Kyoto", country: "Japan", emoji: "⛩",
    title: "Kyoto Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Kyoto trip with Atlas AI. Temples, geishas, bamboo groves, and cherry blossoms — custom itineraries, visa info, and hotel picks for every budget.",
    hero: "Kyoto is where Japan keeps its soul. Fifteen hundred temples, geishas still walking to evening appointments in Gion, the bamboo groves of Arashiyama at dawn, the perfectly raked gravel of Ryoan-ji's zen garden — Kyoto is the counterweight to Tokyo's electricity.",
    highlights: ["Fushimi Inari shrine at sunrise (before crowds)", "Arashiyama Bamboo Grove early morning", "Gion district geisha spotting at dusk", "Kinkaku-ji (Golden Pavilion)", "Nishiki Market for street food", "Philosopher's Path in cherry blossom season"],
    bestTime: "March–April for cherry blossoms, late November for autumn leaves. Both are very crowded. May–June and September–October are quieter and pleasant.",
    visa: "Same as Japan — visa-free 90 days for Canadian, US, UK, EU, Australian passports. Bangladeshi/Pakistani passports need a Japan tourist visa.",
    budget: "Budget: $65–95/day. Mid-range: $140–230/day. Luxury ryokan (inn): $400+/day.",
    faqs: [
      { q: "How do I get from Tokyo to Kyoto?", a: "Shinkansen (bullet train) from Tokyo to Kyoto takes 2h 15min and costs ¥13,870 (~$100 USD). A Japan Rail Pass can make this good value if you're travelling widely." },
      { q: "When should I visit Kyoto?", a: "Cherry blossom season (late March–early April) and autumn (late November) are most beautiful but extremely crowded. Visit May–June or September–October for fewer crowds." },
      { q: "Should I stay in Kyoto or Tokyo?", a: "Stay in both. Kyoto for traditional Japan, temples, and nature; Tokyo for modern Japan, food, and urban energy. They are only 2h 15min apart by bullet train." },
    ]
  },
  amsterdam: {
    name: "Amsterdam", country: "Netherlands", emoji: "🚲",
    title: "Amsterdam Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Amsterdam trip with Atlas AI. Canal houses, world-class museums, cycling culture — Schengen visa info and day-by-day itineraries for all budgets.",
    hero: "Amsterdam is a city built on water and ideas. Over 1,500 bridges cross its 165 canals, and the gabled 17th-century houses that line them are as photogenic today as when Rembrandt painted them. The Rijksmuseum and Anne Frank House anchor a culture that takes art and history seriously.",
    highlights: ["Rijksmuseum & Van Gogh Museum", "Anne Frank House (book far in advance)", "Canal boat tour in golden hour", "Jordaan neighbourhood cafés", "Vondelpark on a sunny afternoon", "Haarlem or Keukenhof Gardens day trip"],
    bestTime: "April–May (tulip season) and June–August (long sunny days). September–October is quieter and still pleasant. Avoid cold, grey November–February unless you love a cosy brown café.",
    visa: "Schengen visa-free (90 days) for Canadian, US, UK, Australian passports. Bangladeshi, Pakistani, Indian passports need a Schengen visa (Netherlands).",
    budget: "Budget: $100–140/day. Mid-range: $200–320/day. Luxury: $450+/day.",
    faqs: [
      { q: "Do I need a visa for Amsterdam?", a: "Schengen visa-free for most Western passports. Bangladeshi, Indian, and Pakistani citizens need a Netherlands Schengen visa — apply at the Dutch consulate 4–6 weeks ahead." },
      { q: "Should I rent a bike in Amsterdam?", a: "Absolutely — Amsterdam is built for cycling. Renting a bike for a day ($12–18 USD) is the best way to see the city like a local. Watch out for trams on the tracks." },
      { q: "How many days should I spend in Amsterdam?", a: "3–4 days covers the city's highlights. 5–6 days lets you add day trips to Delft, The Hague, Rotterdam, or the tulip fields at Keukenhof (April–May)." },
    ]
  },
  prague: {
    name: "Prague", country: "Czech Republic", emoji: "🏰",
    title: "Prague Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Prague trip with Atlas AI. Medieval architecture, Czech beer, visa info, and budget-friendly day-by-day itineraries — free.",
    hero: "Prague is the most intact medieval capital in Europe — no major wars destroyed its Old Town, and the result is a city of extraordinary Gothic and Baroque architecture that looks like it was designed as a film set. It also happens to have the best beer culture in the world and some of Europe's most affordable prices.",
    highlights: ["Prague Castle & St. Vitus Cathedral", "Charles Bridge at sunrise", "Old Town Square & Astronomical Clock", "Josefov Jewish Quarter", "Vinohrady neighbourhood for local life", "Czech beer tasting in a traditional pub"],
    bestTime: "May–June and September–October. July–August is packed with tourists. December Christmas markets are spectacular but cold.",
    visa: "Schengen visa-free (90 days) for Canadian, US, UK, Australian passports. Bangladeshi, Pakistani, Indian passports need a Schengen visa (Czech Republic entry).",
    budget: "Budget: $60–85/day. Mid-range: $130–220/day. Luxury: $350+/day.",
    faqs: [
      { q: "Is Prague cheap for tourists?", a: "Prague is one of Western Europe's most affordable capitals. A full meal and beer in a local pub costs $8–12. Budget travellers comfortably spend $60–85/day." },
      { q: "Do I need a visa for Prague?", a: "Schengen visa-free for most Western passports. South Asian passport holders need a Schengen visa from the Czech consulate." },
      { q: "How many days should I spend in Prague?", a: "3 days covers the main sights. 4–5 days lets you explore beyond the tourist centre and do a day trip to Český Krumlov or Kutná Hora." },
    ]
  },
  santorini: {
    name: "Santorini", country: "Greece", emoji: "🏛",
    title: "Santorini Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Santorini trip with Atlas AI. Oia sunsets, volcanic beaches, Schengen visa info, and hotel picks from budget studios to cliffside infinity pools.",
    hero: "Santorini is the image that sells Greece to the world — blue-domed churches against white walls against the deep blue of the Aegean caldera. It's become iconic for good reason. The sunsets in Oia are genuinely among the best in the world, the volcanic beaches are otherworldly, and the local wine is excellent.",
    highlights: ["Oia sunset from the castle", "Fira to Oia caldera hike (10km)", "Red and Black Beach volcanic sand", "Akrotiri ancient Minoan excavations", "Ammoudi Bay fresh seafood lunch", "Santorini wine tasting — Assyrtiko variety"],
    bestTime: "May–June and September–October. July–August is extremely crowded and hot. The island is virtually empty November–March.",
    visa: "Schengen visa-free (90 days) for Canadian, US, UK, Australian passports. Bangladeshi, Pakistani, Indian passports need a Schengen visa (Greece entry).",
    budget: "Budget: $100–140/day. Mid-range: $250–450/day. Luxury cliffside hotel: $600–2,000+/night.",
    faqs: [
      { q: "When is the best time to visit Santorini?", a: "Late May and late September are the sweet spots — fewer crowds than peak July/August, still warm enough to swim, and more affordable accommodation." },
      { q: "How do I get to Santorini?", a: "Fly direct to Santorini (JTR) from Athens (45 min) or many European cities. Ferries from Athens' Piraeus port take 5–8 hours (conventional) or 4.5 hours (high-speed)." },
      { q: "Is Santorini worth the price?", a: "It's expensive, but for a once-in-a-lifetime trip the caldera views justify it. Stay in Firostefani or Imerovigli instead of Oia to get similar views for 30–40% less." },
    ]
  },
  lisbon: {
    name: "Lisbon", country: "Portugal", emoji: "🌉",
    title: "Lisbon Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Lisbon trip with Atlas AI. Trams, Fado music, Pastéis de Nata, Schengen visa info, and a full itinerary for Portugal's sun-soaked capital.",
    hero: "Lisbon is Europe's most loveable capital — hilly, faded-beautiful, impossibly affordable, and bathed in that famous soft Atlantic light. The neighbourhood tram lines still run, the Fado music in Alfama is as melancholic as ever, and the pastéis de nata at Pastéis de Belém have a two-decade queue for good reason.",
    highlights: ["Alfama neighbourhood & São Jorge Castle", "Belém Tower & Jerónimos Monastery", "LX Factory Sunday market", "Tram 28 through the hills", "Sintra palaces day trip (30 min)", "Pastéis de nata custard tarts"],
    bestTime: "March–May and September–October. June–August is peak season but reliably sunny. November–February is mild but rainy.",
    visa: "Schengen visa-free (90 days) for Canadian, US, UK, Australian passports. Bangladeshi, Pakistani, Indian passports need a Schengen visa (Portugal).",
    budget: "Budget: $70–95/day. Mid-range: $150–250/day. Luxury: $400+/day.",
    faqs: [
      { q: "Is Lisbon cheap compared to other European capitals?", a: "Lisbon is significantly more affordable than London, Paris, or Amsterdam. A meal at a local tasca is $10–15. Coffee costs $1. Budget travellers do well on $70–95/day." },
      { q: "Do I need a visa for Lisbon?", a: "Schengen visa-free for most Western passports. South Asian passport holders need a Portugal Schengen visa — apply at the Portuguese consulate 3–6 weeks ahead." },
      { q: "What day trips can I do from Lisbon?", a: "Sintra (fairy-tale palaces, 40 min), Cascais (beach town, 40 min), Setúbal (wine region, 1 hour), Évora (Roman ruins, 1.5 hours) — all easily done by train or bus." },
    ]
  },
  "cape-town": {
    name: "Cape Town", country: "South Africa", emoji: "🌍",
    title: "Cape Town Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Cape Town trip with Atlas AI. Table Mountain, wine routes, penguin colonies, visa info, and day-by-day itineraries for South Africa's most spectacular city.",
    hero: "Cape Town is the most dramatically beautiful city on earth — a flat-topped mountain rising above a city between two oceans, with wine estates, penguin colonies, and some of the world's best beaches within an hour's drive. It's also a city of profound complexity, where the legacy of apartheid and the energy of a new South Africa coexist.",
    highlights: ["Table Mountain cable car or hike", "Boulders Beach penguin colony", "Cape Point & Cape of Good Hope", "Stellenbosch wine tasting day trip", "V&A Waterfront for food and views", "Robben Island where Mandela was imprisoned"],
    bestTime: "November–March (Southern Hemisphere summer). April–October is cool and wetter. December–February is peak season.",
    visa: "Visa-free 90 days for Canadian, US, UK, EU, Australian passports. Bangladeshi, Pakistani, Indian passports need a South African tourist visa.",
    budget: "Budget: $60–90/day. Mid-range: $150–280/day. Luxury: $400+/day.",
    faqs: [
      { q: "Is Cape Town safe for tourists?", a: "Cape Town has areas that require caution — avoid townships and certain neighbourhoods at night without a guide. Tourist areas like the V&A Waterfront, City Bowl, and the Garden Route are generally safe." },
      { q: "Do I need a visa for South Africa?", a: "Most Western passports are visa-free. Bangladeshi, Indian, and Pakistani citizens need a South African visa — apply at the high commission weeks in advance." },
      { q: "How many days should I spend in Cape Town?", a: "5–7 days lets you do Table Mountain, the Peninsula, a wine route, Boulders Beach, and a day trip into the winelands. 10+ days to explore the Garden Route." },
    ]
  },
  sydney: {
    name: "Sydney", country: "Australia", emoji: "🦘",
    title: "Sydney Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Sydney trip with Atlas AI. Opera House, Bondi Beach, Blue Mountains, Australian visa info, and day-by-day itineraries for every budget.",
    hero: "Sydney is the city that makes you understand why Australians are so relaxed — it's hard to be tense when the harbour is this beautiful, the coffee this good, and the beach this close. The Opera House and Harbour Bridge are genuinely as impressive in person as in photographs.",
    highlights: ["Sydney Opera House guided tour", "Bondi Beach & coastal walk to Coogee", "Sydney Harbour Bridge climb", "Manly Ferry from Circular Quay", "Blue Mountains day trip", "The Rocks historic neighbourhood"],
    bestTime: "September–November (spring) and March–May (autumn) are ideal. December–February is hot and peak season. June–August is mild but good value.",
    visa: "Electronic Travel Authority (ETA) for Canadian, US, UK, and most passport holders ($20 AUD via app). No traditional visa stamp needed. Processing is instant.",
    budget: "Budget: $110–150/day. Mid-range: $220–380/day. Luxury: $500+/day.",
    faqs: [
      { q: "Do I need a visa for Sydney?", a: "Most visitors need an Electronic Travel Authority (ETA) — apply via the Australian ETA app for $20 AUD. Approved instantly. Bangladeshi, Pakistani passports need a full Australian tourist visa." },
      { q: "How many days should I spend in Sydney?", a: "4–5 days covers the city highlights. 7–10 days lets you add the Blue Mountains, Hunter Valley wine region, and the NSW South Coast." },
      { q: "Is Sydney expensive?", a: "Sydney is one of the world's pricier cities — accommodation and dining costs are high. Budget travellers spend $110–150/day staying in hostels and cooking some meals." },
    ]
  },
  dhaka: {
    name: "Dhaka", country: "Bangladesh", emoji: "🕌",
    title: "Dhaka Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Dhaka trip with Atlas AI. Old Dhaka food tours, rickshaw rides, Mughal mosques, visa info, and a full itinerary for Bangladesh's vibrant capital.",
    hero: "Dhaka is one of the world's most densely packed and endlessly fascinating cities. Old Dhaka's labyrinthine lanes hide 400-year-old Mughal mosques, the country's best street food, and a riverfront life on the Buriganga that has barely changed in centuries. It's chaotic, alive, and completely unlike anywhere else.",
    highlights: ["Ahsan Manzil (Pink Palace) on the Buriganga", "Lalbagh Fort — 17th century Mughal citadel", "Old Dhaka food tour — biryani, bakarkhani, borhani", "Sadarghat river terminal — launch boats to Sundarbans", "Star Mosque (Tara Masjid) in Armanitola", "Dhaka University area and Shaheed Minar"],
    bestTime: "November–February (cool, dry season, 15–25°C). March–May is very hot. June–October is monsoon — beautiful but flooding is common.",
    visa: "Bangladeshi citizens — home country. Foreign nationals: most get visa-on-arrival at Dhaka airport (30 days). Check bangladeshivisa.gov.bd for your nationality.",
    budget: "Budget: BDT 2,000–4,000/day (~$20–40 USD). Mid-range: BDT 5,000–10,000/day. Luxury: BDT 15,000+/day.",
    faqs: [
      { q: "Is Dhaka safe for tourists?", a: "Dhaka is generally safe for tourists. The main challenges are traffic congestion and air pollution rather than crime. Rickshaws and CNG auto-rickshaws are safe and fun to use." },
      { q: "What is the best food to try in Dhaka?", a: "Old Dhaka biryani (especially Haji Biriyani), bakarkhani bread, halim, kacchi biryani, and street-side fuchka. Dhaka's food scene is one of South Asia's best-kept secrets." },
      { q: "How many days should I spend in Dhaka?", a: "2–3 days covers Old Dhaka, key monuments, and the food scene. 4–5 days to include Sonargaon, Savar, or a river trip to the Sundarbans." },
    ]
  },
  "coxs-bazar": {
    name: "Cox's Bazar", country: "Bangladesh", emoji: "🏖",
    title: "Cox's Bazar Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Cox's Bazar trip with Atlas AI. World's longest natural sea beach, Inani, Saint Martin's Island, and full itineraries for Bangladesh's favourite beach.",
    hero: "Cox's Bazar is home to the world's longest natural sea beach — 120 km of unbroken golden sand on the Bay of Bengal. It's Bangladesh's most visited destination and for good reason: the sunsets are extraordinary, the seafood is exceptional, and the nearby Saint Martin's Island is one of Bangladesh's most beautiful spots.",
    highlights: ["Cox's Bazar main beach at sunrise or sunset", "Inani Beach — rocky coral formations", "Saint Martin's Island (Narikel Jinjira) — overnight trip", "Himchhari Waterfall and National Park", "Rakhain tribal village at Teknaf", "Fresh seafood at Kolatali beach stalls"],
    bestTime: "November–February (best weather, calm sea). March–April is fine. May–October is monsoon — swimming is dangerous.",
    visa: "Same as Bangladesh — visa-on-arrival for most nationalities at Dhaka airport. Domestic flights to Cox's Bazar take 1 hour.",
    budget: "Budget: BDT 2,500–5,000/day. Mid-range: BDT 6,000–12,000/day. Beach resort: BDT 15,000+/day.",
    faqs: [
      { q: "How do I get to Cox's Bazar from Dhaka?", a: "Fly from Dhaka to Cox's Bazar — 1 hour, flights from BDT 3,000–8,000. Bus takes 10–12 hours but is much cheaper (BDT 700–1,500)." },
      { q: "Can I visit Saint Martin's Island from Cox's Bazar?", a: "Yes — launch boats depart from Teknaf (1.5 hours south of Cox's Bazar). The journey takes 2.5–3 hours. Best October–March; boats stop in monsoon season." },
      { q: "Is Cox's Bazar suitable for foreign tourists?", a: "Yes, Cox's Bazar is Bangladesh's most tourist-friendly destination. English is spoken at most hotels and the area is very safe for international visitors." },
    ]
  },
  kathmandu: {
    name: "Kathmandu", country: "Nepal", emoji: "🏔",
    title: "Kathmandu Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Kathmandu trip with Atlas AI. Himalayan trekking base, ancient temples, visa-on-arrival info, and itineraries for Everest Base Camp and beyond.",
    hero: "Kathmandu is the gateway to the Himalayas and one of Asia's most spiritually charged cities. Ancient stupas, living goddess shrines, and medieval palace squares exist alongside tea houses packed with trekkers preparing for Everest Base Camp. The air is thin, the culture is deep, and the mountains are always on the horizon.",
    highlights: ["Pashupatinath Temple & cremation ghats on the Bagmati", "Boudhanath Stupa — one of the world's largest", "Swayambhunath (Monkey Temple) hilltop views", "Durbar Squares — Kathmandu, Bhaktapur, Patan", "Thamel district for trekking gear and food", "Pokhara day trip or Everest Base Camp flight"],
    bestTime: "March–May and September–November. Winter (December–February) is cold but clear. Monsoon June–August brings leeches on trails but lush greenery.",
    visa: "Visa-on-arrival at Tribhuvan Airport for most nationalities including Canada, US, UK, EU, Australia, Bangladesh, India. $30 USD (15 days), $50 (30 days), $125 (90 days).",
    budget: "Budget: $25–45/day. Mid-range: $60–100/day. Luxury lodge: $200+/day.",
    faqs: [
      { q: "Do I need a visa for Nepal?", a: "Most nationalities including Bangladesh get visa-on-arrival at Kathmandu airport. Bring USD cash — $30 for 15 days, $50 for 30 days. Indian citizens enter free." },
      { q: "Can I do Everest Base Camp from Kathmandu?", a: "Yes — EBC trek takes 12–14 days from Lukla (fly from Kathmandu, 35 min). Best seasons: March–May and September–November." },
      { q: "How many days do I need in Kathmandu?", a: "2–3 days for the city's temples and squares. 4–5 days to add Chitwan jungle safari or Pokhara. 14–21 days for a full trekking expedition." },
    ]
  },
  "kuala-lumpur": {
    name: "Kuala Lumpur", country: "Malaysia", emoji: "🏙",
    title: "Kuala Lumpur Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Kuala Lumpur trip with Atlas AI. Petronas Towers, Batu Caves, halal food, visa-free entry for Bangladeshi passports, and day-by-day itineraries.",
    hero: "Kuala Lumpur is Southeast Asia's most underrated city — the Petronas Twin Towers pierce the clouds, the street food rivals anywhere in Asia, and the diversity of Malay, Chinese, Indian, and Western cultures creates a city of extraordinary energy. For Muslim travellers, it's one of the world's most comfortable destinations.",
    highlights: ["Petronas Twin Towers sky bridge & Observation Deck", "Batu Caves Hindu temple complex", "Bukit Bintang for food, shopping, and nightlife", "Central Market & Chinatown Petaling Street", "Masjid Jamek — KL's oldest mosque", "Jalan Alor street food at night"],
    bestTime: "Year-round — KL is hot and humid (27–33°C) every month. May–July and November–December see more rain.",
    visa: "Visa-free 30–90 days for Canadian, US, UK, EU, Australian, Bangladeshi, Indian passports. Malaysia has one of the most open visa policies in Southeast Asia.",
    budget: "Budget: $35–55/day. Mid-range: $80–150/day. Luxury: $250+/day.",
    faqs: [
      { q: "Do Bangladeshi citizens need a visa for Malaysia?", a: "No. Bangladeshi passport holders get visa-free entry to Malaysia for 30 days. No advance application needed — just show your passport on arrival." },
      { q: "Is Malaysia halal-friendly?", a: "Malaysia is one of the world's best destinations for Muslim travellers. Halal food is everywhere, mosques are abundant, and prayer times are publicly observed." },
      { q: "How many days do I need in Kuala Lumpur?", a: "3–4 days covers KL highlights. Use it as a base for Penang (1 hour flight), Langkawi (1 hour flight), or Cameron Highlands (3 hour drive)." },
    ]
  },
  "ho-chi-minh": {
    name: "Ho Chi Minh City", country: "Vietnam", emoji: "🛵",
    title: "Ho Chi Minh City Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Ho Chi Minh City trip with Atlas AI. War Remnants Museum, Mekong Delta, street food, e-visa info, and budget-friendly itineraries.",
    hero: "Ho Chi Minh City (Saigon) is Vietnam at its most intense — 10 million people, 8 million motorbikes, and some of the world's best street food all compressed into a city that never stops moving. The War Remnants Museum is one of the most powerful in Southeast Asia, and the Mekong Delta is an hour away.",
    highlights: ["War Remnants Museum — powerful and essential", "Cu Chi Tunnels day trip", "Ben Thanh Market for street food", "Bui Vien Walking Street — backpacker nightlife", "Mekong Delta day trip by boat", "Reunification Palace — 1975 history preserved"],
    bestTime: "December–April (dry season). May–November is rainy season — cheaper and green.",
    visa: "E-visa online for most nationalities including Bangladesh (~$25 USD, 90 days). Apply at evisa.xuatnhapcanh.gov.vn at least 3 days before travel.",
    budget: "Budget: $30–50/day. Mid-range: $70–130/day. Luxury: $250+/day.",
    faqs: [
      { q: "Do Bangladeshi citizens need a visa for Vietnam?", a: "Yes. Apply for a Vietnam e-visa online at evisa.xuatnhapcanh.gov.vn — costs about $25 USD and takes 3 business days. Valid for 90 days." },
      { q: "Is Ho Chi Minh City safe for tourists?", a: "Generally safe, but watch for bag snatchers on motorbikes. Keep bags on the inside, away from the road." },
      { q: "How many days should I spend in Ho Chi Minh City?", a: "3–4 days for the city and a Mekong Delta day trip. Add 4–5 days to travel north to Hoi An, Da Nang, or Hanoi." },
    ]
  },
  phuket: {
    name: "Phuket", country: "Thailand", emoji: "🌊",
    title: "Phuket Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Phuket trip with Atlas AI. Phi Phi Islands, Patong Beach, visa exemption info, and personalised itineraries for Thailand's most famous island.",
    hero: "Phuket is Thailand's largest island and its most famous beach destination — limestone karsts rise from turquoise water, long-tail boats ferry travellers to impossibly blue bays, and the night market scene in Old Town rivals anywhere in Southeast Asia.",
    highlights: ["Phi Phi Islands day trip by speedboat", "Phang Nga Bay (James Bond Island)", "Old Phuket Town walking tour", "Patong Beach and Bangla Road night market", "Big Buddha viewpoint at sunset", "Kata and Karon beaches — quieter than Patong"],
    bestTime: "November–April (dry season, calm Andaman Sea). May–October is wet season — cheaper but some boat trips cancel.",
    visa: "30-day visa exemption for most passports. Bangladeshi passport: visa-on-arrival at Phuket airport ($35, 15 days).",
    budget: "Budget: $40–65/day. Mid-range: $100–200/day. Luxury resort: $400+/day.",
    faqs: [
      { q: "Do I need a visa for Phuket?", a: "Most Western passports get 30-day visa exemption. Bangladeshi passports can get visa-on-arrival at Phuket International Airport — $35 USD for 15 days." },
      { q: "How do I get to Phi Phi Islands from Phuket?", a: "Speedboat from Rassada Pier takes 45 minutes (~$25–40 USD return). Ferry takes 1.5–2 hours. Most visitors do a guided day tour." },
      { q: "Is Phuket better than Bali?", a: "Different experiences — Phuket has better beaches and island-hopping. Bali has more culture and spiritual atmosphere. Both are excellent." },
    ]
  },
  "sri-lanka": {
    name: "Sri Lanka", country: "Sri Lanka", emoji: "🐘",
    title: "Sri Lanka Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Sri Lanka trip with Atlas AI. Sigiriya Rock, Ella train ride, temple elephants, ETA visa info, and full itineraries for this island gem.",
    hero: "Sri Lanka packs extraordinary diversity into a country the size of Ireland — ancient rock fortresses, colonial hill stations in tea plantation mist, whale watching off the southern coast, and Buddhist temples where elephants are part of daily ceremonial life.",
    highlights: ["Sigiriya Lion Rock ancient fortress (UNESCO)", "Ella — nine arch bridge and Little Adam's Peak", "Kandy Temple of the Tooth", "Galle Fort colonial Dutch architecture", "Yala National Park safari", "Colombo street food and Pettah market"],
    bestTime: "West coast: November–April. East coast: May–September. Hill country: year-round.",
    visa: "ETA required for all nationalities — apply at eta.gov.lk. Cost: $20 USD, 30 days, approved in minutes. Bangladesh, India, Canada, UK, USA all eligible.",
    budget: "Budget: $35–55/day. Mid-range: $80–150/day. Luxury: $300+/day.",
    faqs: [
      { q: "Do Bangladeshi citizens need a visa for Sri Lanka?", a: "Yes. Apply for a Sri Lanka ETA online at eta.gov.lk — costs $20 USD, usually approved within minutes. Valid for 30 days." },
      { q: "What is the famous train ride in Sri Lanka?", a: "The Kandy to Ella train is one of the world's most scenic rail journeys — 6 hours through tea plantations and misty hills. Book observation car seats in advance." },
      { q: "How many days do I need for Sri Lanka?", a: "10–14 days to cover the cultural triangle, hill country, and southern coast. 7 days is possible but rushed." },
    ]
  },
  "chiang-mai": {
    name: "Chiang Mai", country: "Thailand", emoji: "⛪",
    title: "Chiang Mai Travel Guide 2026 — AI Trip Planner | Atlas",
    description: "Plan your Chiang Mai trip with Atlas AI. Ancient temples, ethical elephant sanctuaries, night markets — visa info and day-by-day itineraries for northern Thailand.",
    hero: "Chiang Mai is the cultural capital of northern Thailand — a walled city of 300 temples surrounded by jungle mountains, with a food scene that tops best-in-Thailand lists and an elephant sanctuary culture that has shifted toward ethical practices. It's calmer than Bangkok and, many would argue, more interesting.",
    highlights: ["Doi Inthanon National Park — Thailand's highest peak", "Elephant Nature Park — ethical elephant sanctuary", "Sunday Walking Street night market", "Doi Suthep temple panoramic views over the city", "Thai cooking class with morning market visit", "Old City moat — temple hop all day"],
    bestTime: "November–February (cool season, 15–25°C at night). March–April is smoke season — avoid. May–October is rainy but green.",
    visa: "30-day visa exemption for most passports. Bangladeshi passport: visa-on-arrival at Chiang Mai airport.",
    budget: "Budget: $30–50/day. Mid-range: $70–130/day. Luxury boutique hotel: $200+/day.",
    faqs: [
      { q: "How do I get from Bangkok to Chiang Mai?", a: "Fly (1 hour, $20–60 USD), overnight train (12 hours, $15–40 USD sleeper — one of Asia's great train journeys), or overnight bus (10 hours, $10–20 USD)." },
      { q: "Which elephant sanctuary is ethical in Chiang Mai?", a: "Elephant Nature Park (elephantnaturepark.org) is most reputable — no riding, natural behaviour, rescue focus. Book weeks ahead as it's very popular." },
      { q: "How many days should I spend in Chiang Mai?", a: "4–5 days covers city temples, a cooking class, and Doi Suthep. Add 2–3 days for Doi Inthanon and the elephant sanctuary." },
    ]
  },
};

function buildPage(dest, data) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristDestination",
        "name": data.name,
        "description": data.hero,
        "url": `https://getatlas.ca/plan/${dest}`,
        "image": "https://getatlas.ca/icon-512.png",
        "containedInPlace": { "@type": "Country", "name": data.country }
      },
      {
        "@type": "FAQPage",
        "mainEntity": data.faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Atlas", "item": "https://getatlas.ca" },
          { "@type": "ListItem", "position": 2, "name": `${data.name} Travel Guide`, "item": `https://getatlas.ca/plan/${dest}` }
        ]
      }
    ]
  };

  const highlights = data.highlights.map(h => `<li>${h}</li>`).join('');
  const faqs = data.faqs.map(f => `
    <div class="faq-item">
      <h3>${f.q}</h3>
      <p>${f.a}</p>
    </div>`).join('');

  const ctaUrl = `https://getatlas.ca/?dest=${encodeURIComponent(data.name)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${data.title}</title>
<meta name="description" content="${data.description}"/>
<meta name="robots" content="index, follow"/>
<link rel="canonical" href="https://getatlas.ca/plan/${dest}"/>
<meta property="og:type" content="article"/>
<meta property="og:url" content="https://getatlas.ca/plan/${dest}"/>
<meta property="og:title" content="${data.title}"/>
<meta property="og:description" content="${data.description}"/>
<meta property="og:image" content="https://getatlas.ca/icon-512.png"/>
<meta property="og:site_name" content="Atlas AI Travel Planner"/>
<script type="application/ld+json">${JSON.stringify(schema)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#1c1914;color:#ede5d5;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;line-height:1.7;}
a{color:#c9a96e;text-decoration:none;}
a:hover{text-decoration:underline;}
header{padding:1.25rem 1.5rem;border-bottom:1px solid rgba(201,169,110,0.15);display:flex;align-items:center;justify-content:space-between;max-width:760px;margin:0 auto;}
.logo{font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:300;letter-spacing:0.25em;color:#c9a96e;text-transform:uppercase;}
.logo-dot{display:inline-block;width:5px;height:5px;background:#c9a96e;border-radius:50%;margin:0 6px 2px;vertical-align:middle;}
nav a{font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;color:#6a5a3a;margin-left:1.5rem;}
main{max-width:760px;margin:0 auto;padding:2.5rem 1.5rem 4rem;}
.breadcrumb{font-size:0.7rem;color:#4a3a22;letter-spacing:0.08em;margin-bottom:2rem;}
.breadcrumb a{color:#6a5a3a;}
.breadcrumb span{margin:0 0.4rem;}
.hero-emoji{font-size:2.2rem;margin-bottom:0.75rem;}
h1{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:300;color:#d4aa6e;letter-spacing:0.08em;line-height:1.25;margin-bottom:1rem;}
.subtitle{font-size:0.85rem;color:#8a7a55;margin-bottom:2rem;max-width:580px;}
.hero-text{font-size:0.9rem;color:#b8b0a0;line-height:1.85;margin-bottom:2.5rem;padding-bottom:2rem;border-bottom:1px solid rgba(201,169,110,0.1);}
.cta-box{background:linear-gradient(135deg,rgba(201,169,110,0.12),rgba(201,169,110,0.06));border:1px solid rgba(201,169,110,0.3);border-radius:12px;padding:1.5rem;margin-bottom:2.5rem;text-align:center;}
.cta-box p{font-size:0.82rem;color:#8a7a55;margin-bottom:1rem;}
.cta-btn{display:inline-block;padding:0.8rem 2rem;background:rgba(201,169,110,0.15);border:1px solid rgba(201,169,110,0.5);border-radius:8px;color:#c9a96e;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;font-family:'DM Sans',sans-serif;font-weight:500;transition:all 0.2s;}
.cta-btn:hover{background:rgba(201,169,110,0.25);text-decoration:none;}
.section-label{font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;color:#c9a96e;margin-bottom:0.75rem;display:flex;align-items:center;gap:0.4rem;}
.section-label::before{content:'◆';font-size:0.5rem;}
h2{font-family:'Cormorant Garamond',serif;font-size:1.35rem;font-weight:400;color:#d4aa6e;margin-bottom:1.25rem;}
section{margin-bottom:2.5rem;}
ul{list-style:none;padding:0;}
ul li{padding:0.35rem 0;font-size:0.85rem;color:#b8b0a0;padding-left:1rem;position:relative;}
ul li::before{content:'◆';position:absolute;left:0;color:#c9a96e;font-size:0.45rem;top:9px;}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:2.5rem;}
.info-card{background:rgba(201,169,110,0.04);border:1px solid rgba(201,169,110,0.12);border-radius:8px;padding:1rem 1.1rem;}
.info-card .label{font-size:0.58rem;letter-spacing:0.18em;text-transform:uppercase;color:#6a5a3a;margin-bottom:0.4rem;}
.info-card p{font-size:0.8rem;color:#a8a090;line-height:1.65;}
.faq-item{margin-bottom:1.25rem;padding-bottom:1.25rem;border-bottom:1px solid rgba(201,169,110,0.08);}
.faq-item:last-child{border-bottom:none;}
.faq-item h3{font-size:0.85rem;font-weight:500;color:#d4aa6e;margin-bottom:0.4rem;}
.faq-item p{font-size:0.81rem;color:#a8a090;line-height:1.7;}
footer{max-width:760px;margin:0 auto;padding:1.5rem;border-top:1px solid rgba(201,169,110,0.1);text-align:center;}
footer p{font-size:0.7rem;color:#3a2a14;letter-spacing:0.05em;}
footer a{color:#4a3a22;}
@media(max-width:520px){h1{font-size:1.7rem;}.info-grid{grid-template-columns:1fr;}}
</style>
</head>
<body>
<header>
  <a href="/" class="logo">A<span class="logo-dot"></span>TLAS</a>
  <nav><a href="/">Plan a Trip</a></nav>
</header>
<main>
  <div class="breadcrumb"><a href="/">Atlas</a><span>›</span>${data.name} Travel Guide</div>
  <div class="hero-emoji">${data.emoji}</div>
  <h1>${data.name}, ${data.country}<br/>Travel Guide 2026</h1>
  <p class="subtitle">AI-powered trip planner — custom itinerary, visa info, hotels, and maps for ${data.name}.</p>
  <p class="hero-text">${data.hero}</p>

  <div class="cta-box">
    <p>Get a personalised ${data.name} itinerary in seconds — day-by-day plan, visa requirements for your passport, hotel picks, and an interactive map.</p>
    <a href="${ctaUrl}" class="cta-btn">✈️ Plan My ${data.name} Trip</a>
  </div>

  <section>
    <div class="section-label">Highlights</div>
    <h2>Top Things to Do in ${data.name}</h2>
    <ul>${highlights}</ul>
  </section>

  <div class="info-grid">
    <div class="info-card">
      <div class="label">Best Time to Visit</div>
      <p>${data.bestTime}</p>
    </div>
    <div class="info-card">
      <div class="label">Visa Requirements</div>
      <p>${data.visa}</p>
    </div>
    <div class="info-card">
      <div class="label">Average Budget</div>
      <p>${data.budget}</p>
    </div>
    <div class="info-card">
      <div class="label">Plan With Atlas</div>
      <p>Tell Atlas your passport, budget, and travel dates — get a complete personalised itinerary in seconds.</p>
    </div>
  </div>

  <section>
    <div class="section-label">FAQ</div>
    <h2>Frequently Asked Questions</h2>
    ${faqs}
  </section>

  <div class="cta-box">
    <p>Ready to plan your ${data.name} trip? Atlas AI creates a complete day-by-day itinerary personalised to your passport, budget, and travel style.</p>
    <a href="${ctaUrl}" class="cta-btn">✈️ Start Planning — It's Free</a>
  </div>
</main>
<footer>
  <p><a href="/">Atlas AI Travel Planner</a> · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></p>
</footer>
</body>
</html>`;
}

export default function handler(req, res) {
  const dest = (req.query.dest || '').toLowerCase().replace(/\s+/g, '-');
  const data = DESTINATIONS[dest];

  if (!data) {
    // Redirect unknown destinations to homepage
    res.setHeader('Location', '/');
    return res.status(302).end();
  }

  const html = buildPage(dest, data);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
  return res.status(200).send(html);
}
