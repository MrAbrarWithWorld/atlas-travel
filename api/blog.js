import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://prffhhkemxibujjjiyhg.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

function buildHead(title, description, path, imageUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${title}</title>
<meta name="description" content="${description}"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${description}"/>
<meta property="og:type" content="website"/>
<meta property="og:url" content="https://getatlas.ca${path}"/>
<meta property="og:site_name" content="ATLAS — AI Travel Planner"/>
${imageUrl ? `<meta property="og:image" content="${imageUrl}"/>` : ''}
<meta name="twitter:card" content="summary_large_image"/>
${imageUrl ? `<meta name="twitter:image" content="${imageUrl}"/>` : ''}
<link rel="canonical" href="https://getatlas.ca${path}"/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#1c1914;color:#ede5d5;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;min-height:100vh;}
.container{max-width:740px;margin:0 auto;padding:3rem 1.5rem 5rem;}
header{display:flex;align-items:center;gap:0.75rem;margin-bottom:3rem;padding-bottom:1.5rem;border-bottom:1px solid rgba(201,169,110,0.15);}
header a{display:flex;align-items:center;gap:0.75rem;text-decoration:none;}
header span{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:300;letter-spacing:0.3em;color:#d4aa6e;text-transform:uppercase;}
h1{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;color:#e8dcc8;margin-bottom:0.75rem;line-height:1.25;}
h2{font-family:'Cormorant Garamond',serif;font-size:1.35rem;font-weight:400;color:#d4aa6e;margin:2rem 0 0.65rem;padding-bottom:0.35rem;border-bottom:1px solid rgba(201,169,110,0.12);}
h3{font-size:0.85rem;font-weight:600;color:#c9a96e;letter-spacing:0.05em;margin:1.25rem 0 0.5rem;text-transform:uppercase;}
p{font-size:0.875rem;color:#a8a090;line-height:1.9;margin-bottom:0.85rem;}
ul,ol{margin:0.5rem 0 0.85rem 1.25rem;}
li{font-size:0.875rem;color:#a8a090;line-height:1.8;margin-bottom:0.3rem;}
li::marker{color:#c9a96e;}
strong{color:#d4c8b0;font-weight:500;}
a{color:#c9a96e;}
a:hover{color:#e8dcc8;}
.meta{display:flex;gap:1rem;align-items:center;font-size:0.7rem;color:#6a5a3a;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:2rem;flex-wrap:wrap;}
.badge{background:rgba(201,169,110,0.1);border:1px solid rgba(201,169,110,0.2);border-radius:4px;padding:0.2rem 0.6rem;color:#c9a96e;font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;}
.back{display:inline-flex;align-items:center;gap:0.4rem;font-size:0.65rem;color:#6a5a3a;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;margin-top:3rem;border:1px solid rgba(201,169,110,0.15);padding:0.5rem 1rem;border-radius:6px;transition:color 0.2s,border-color 0.2s;}
.back:hover{color:#c9a96e;border-color:rgba(201,169,110,0.35);}
.cta{background:rgba(201,169,110,0.06);border:1px solid rgba(201,169,110,0.2);border-radius:12px;padding:1.5rem 1.75rem;margin:2.5rem 0;text-align:center;}
.cta p{margin-bottom:0.75rem;color:#c4b89a;font-size:0.85rem;}
.cta-btn{display:inline-block;background:#c9a96e;color:#1c1914;font-size:0.75rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;padding:0.65rem 1.5rem;border-radius:8px;text-decoration:none;transition:background 0.2s;}
.cta-btn:hover{background:#e0c080;color:#1c1914;}
.hero-img{width:100%;height:380px;object-fit:cover;border-radius:14px;margin-bottom:2rem;display:block;}
.inline-img{width:100%;height:260px;object-fit:cover;border-radius:10px;margin:1.5rem 0;display:block;}
.inline-img-caption{font-size:0.7rem;color:#5a4a2a;text-align:center;margin-top:-1rem;margin-bottom:1.5rem;letter-spacing:0.06em;}
.card-img{width:100%;height:170px;object-fit:cover;border-radius:8px 8px 0 0;margin-bottom:0;display:block;}
.related{margin-top:2.5rem;padding-top:1.5rem;border-top:1px solid rgba(201,169,110,0.15);}
.related h3{margin-bottom:0.75rem;}
.related-links{display:flex;flex-wrap:wrap;gap:0.5rem;}
.related-links a{font-size:0.72rem;padding:0.3rem 0.75rem;border:1px solid rgba(201,169,110,0.2);border-radius:4px;color:#c9a96e;text-decoration:none;letter-spacing:0.06em;transition:background 0.2s,border-color 0.2s;}
.related-links a:hover{background:rgba(201,169,110,0.1);border-color:rgba(201,169,110,0.4);}
.articles-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.1rem;margin-top:1.5rem;}
@media(max-width:580px){.articles-grid{grid-template-columns:1fr;}}
.article-card{border:1px solid rgba(201,169,110,0.15);border-radius:10px;text-decoration:none;transition:border-color 0.2s,background 0.2s;display:block;overflow:hidden;}
.article-card:hover{border-color:rgba(201,169,110,0.35);background:rgba(201,169,110,0.04);}
.card-top{display:flex;align-items:flex-start;gap:0.6rem;margin-bottom:0.4rem;}
.card-emoji{font-size:1.3rem;flex-shrink:0;}
.card-title{font-family:'Cormorant Garamond',serif;font-size:1.05rem;font-weight:400;color:#e8dcc8;line-height:1.25;}
.card-desc{font-size:0.8rem;color:#7a7060;line-height:1.65;margin-bottom:0.6rem;}
.card-meta{display:flex;gap:0.6rem;font-size:0.62rem;color:#5a4a2a;letter-spacing:0.08em;text-transform:uppercase;flex-wrap:wrap;align-items:center;}
.key-facts{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:0.75rem;margin:1.5rem 0 2rem;background:rgba(201,169,110,0.04);border:1px solid rgba(201,169,110,0.15);border-radius:12px;padding:1.1rem 1.25rem;}
.fact-item{display:flex;flex-direction:column;gap:0.2rem;}
.fact-label{font-size:0.6rem;color:#6a5a3a;letter-spacing:0.12em;text-transform:uppercase;}
.fact-value{font-size:0.82rem;color:#d4c8b0;font-weight:500;}
.lang-toggle{display:flex;gap:0;margin-bottom:1.5rem;border:1px solid rgba(201,169,110,0.2);border-radius:6px;overflow:hidden;width:fit-content;}
.lang-btn{font-size:0.68rem;letter-spacing:0.08em;text-transform:uppercase;padding:0.35rem 0.85rem;cursor:pointer;border:none;background:transparent;color:#6a5a3a;transition:background 0.15s,color 0.15s;}
.lang-btn.active{background:rgba(201,169,110,0.15);color:#c9a96e;}
.highlights{display:flex;flex-wrap:wrap;gap:0.5rem;margin:0.75rem 0 1.5rem;}
.highlight-tag{background:rgba(201,169,110,0.08);border:1px solid rgba(201,169,110,0.2);border-radius:20px;padding:0.3rem 0.85rem;font-size:0.75rem;color:#c9a96e;}
.newsletter{background:linear-gradient(135deg,rgba(201,169,110,0.08),rgba(201,169,110,0.03));border:1px solid rgba(201,169,110,0.25);border-radius:14px;padding:1.75rem 2rem;margin:2.5rem 0;text-align:center;}
.newsletter-icon{font-size:2rem;margin-bottom:0.75rem;}
.newsletter-title{font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:400;color:#e8dcc8;margin-bottom:0.5rem;}
.newsletter-desc{font-size:0.82rem;color:#8a7a60;margin-bottom:1.1rem;line-height:1.7;}
.newsletter-form{display:flex;gap:0.5rem;max-width:400px;margin:0 auto;}
.newsletter-form input{flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(201,169,110,0.25);border-radius:7px;padding:0.6rem 0.9rem;color:#ede5d5;font-size:0.82rem;font-family:'DM Sans',sans-serif;outline:none;}
.newsletter-form input::placeholder{color:#5a4a2a;}
.newsletter-form input:focus{border-color:rgba(201,169,110,0.5);}
.newsletter-form button{background:#c9a96e;color:#1c1914;border:none;border-radius:7px;padding:0.6rem 1.1rem;font-size:0.78rem;font-weight:600;letter-spacing:0.06em;cursor:pointer;white-space:nowrap;font-family:'DM Sans',sans-serif;}
.newsletter-form button:hover{background:#e0c080;}
.newsletter-note{font-size:0.75rem;margin-top:0.6rem;}
@media(max-width:480px){.newsletter-form{flex-direction:column;}.newsletter{padding:1.4rem 1.2rem;}}
.gyg-section{margin:2rem 0;padding:1.25rem 1.5rem;border:1px solid rgba(201,169,110,0.15);border-radius:12px;background:rgba(201,169,110,0.03);}
.gyg-section h3{font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:400;color:#d4aa6e;margin-bottom:0.4rem;border:none;padding:0;text-transform:none;letter-spacing:0;}
.gyg-section p{font-size:0.8rem;color:#8a7a60;margin-bottom:0.85rem;}
.gyg-btn{display:inline-block;border:1px solid rgba(201,169,110,0.35);color:#c9a96e;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;padding:0.45rem 1rem;border-radius:6px;text-decoration:none;transition:background 0.2s,border-color 0.2s;}
.gyg-btn:hover{background:rgba(201,169,110,0.1);border-color:rgba(201,169,110,0.5);color:#c9a96e;}
.sticky-cta{position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#2a1f0e,#1c1408);border-top:1px solid rgba(201,169,110,0.25);padding:0.9rem 1.5rem;display:flex;align-items:center;justify-content:space-between;z-index:999;transform:translateY(100%);transition:transform 0.35s ease;}
.sticky-cta.visible{transform:translateY(0);}
.sticky-cta-text{font-size:0.78rem;color:#c4b89a;flex:1;}
.sticky-cta-text strong{color:#e8dcc8;display:block;font-size:0.85rem;}
.sticky-cta-btn{background:#c9a96e;color:#1c1914;font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:0.55rem 1.2rem;border-radius:7px;text-decoration:none;white-space:nowrap;flex-shrink:0;}
.sticky-cta-btn:hover{background:#e0c080;color:#1c1914;}
@media(max-width:480px){.sticky-cta-text{display:none;}.sticky-cta{justify-content:center;}}
</style>
</head>`;
}

function logoSvg() {
  return `<svg width="28" height="28" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><circle cx="200" cy="200" r="170" fill="none" stroke="#c9a96e" stroke-width="2.2"/><circle cx="200" cy="200" r="130" fill="none" stroke="#8a6a3a" stroke-width="1"/><circle cx="200" cy="200" r="18" fill="#c9a96e"/></svg>`;
}

function buildListingPage(articles) {
  const cards = articles.map(a => {
    const dateStr = new Date(a.date_published).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return `
  <a href="/blog/${a.slug}" class="article-card" style="padding:0;overflow:hidden;">
    ${a.cover_image_url ? `<img src="${a.cover_image_url}" alt="${a.title}" class="card-img" loading="lazy"/>` : ''}
    <div style="padding:1.1rem 1.35rem 1.25rem;">
      <div class="card-top" style="margin-bottom:0.4rem;">
        <span class="card-emoji">${a.hero_emoji}</span>
        <div class="card-title">${a.title}</div>
      </div>
      <p class="card-desc">${a.description}</p>
      <div class="card-meta">
        <span class="badge">${a.category}</span>
        <span>${dateStr}</span>
        <span>${a.read_time}</span>
      </div>
    </div>
  </a>`;
  }).join('');

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "ATLAS Travel Blog",
    "description": "Travel guides, visa tips, budget breakdowns, and destination deep-dives.",
    "url": "https://getatlas.ca/blog",
    "publisher": { "@type": "Organization", "name": "ATLAS", "url": "https://getatlas.ca" }
  });

  return buildHead(
    'Travel Blog — Guides, Visa Tips & Destination Deep-Dives | ATLAS',
    'Expert travel guides, visa information, budget breakdowns, and destination deep-dives. Plan your next trip smarter with ATLAS.',
    '/blog',
    null
  ) + `
<body>
<div class="container">
  <header><a href="/">${logoSvg()}<span>Atlas</span></a></header>
  <h1>Travel Blog</h1>
  <p style="color:#7a7060;font-size:0.85rem;margin-bottom:1.5rem;">Guides, visa tips, budget breakdowns, and destination deep-dives.</p>
  <div class="articles-grid">${cards}</div>
  <a href="/" class="back">← Back to ATLAS</a>
</div>
<script type="application/ld+json">${schema}</script>
</body></html>`;
}

function buildArticlePage(slug, article) {
  const dateFormatted = new Date(article.date_published).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const relatedLinks = (article.related_destinations || []).map(dest => {
    const destName = dest.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return `<a href="/plan/${dest}">Plan trip to ${destName}</a>`;
  }).join('');

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "datePublished": article.date_published,
    "dateModified": article.updated_at ? article.updated_at.slice(0, 10) : article.date_published,
    "author": { "@type": "Organization", "name": "ATLAS", "url": "https://getatlas.ca" },
    "publisher": { "@type": "Organization", "name": "ATLAS", "url": "https://getatlas.ca" },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://getatlas.ca/blog/${slug}` }
  });

  const breadcrumb = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://getatlas.ca/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://getatlas.ca/blog" },
      { "@type": "ListItem", "position": 3, "name": article.title, "item": `https://getatlas.ca/blog/${slug}` }
    ]
  });

  // Parse key facts and highlights from article metadata
  const keyFacts = article.key_facts || null;
  const highlights = article.highlights || [];
  const contentBn = article.content_bn || null;

  const keyFactsHtml = keyFacts ? `
  <div class="key-facts">
    ${Object.entries(keyFacts).map(([k,v]) => `<div class="fact-item"><span class="fact-label">${k}</span><span class="fact-value">${v}</span></div>`).join('')}
  </div>` : '';

  const highlightsHtml = highlights.length ? `
  <div class="highlights">
    ${highlights.map(h => `<span class="highlight-tag">${h}</span>`).join('')}
  </div>` : '';

  const langToggle = contentBn ? `
  <div class="lang-toggle">
    <button class="lang-btn active" onclick="switchLang('en')">English</button>
    <button class="lang-btn" onclick="switchLang('bn')">বাংলা</button>
  </div>
  <script>
    function switchLang(lang) {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.textContent.trim() === (lang==='en'?'English':'বাংলা')));
      document.getElementById('content-en').style.display = lang==='en' ? '' : 'none';
      document.getElementById('content-bn').style.display = lang==='bn' ? '' : 'none';
    }
  </script>` : '';

  const contentHtml = contentBn ? `
  <div id="content-en" class="article-body">${article.content}</div>
  <div id="content-bn" class="article-body" style="display:none">${contentBn}</div>` :
  `<div class="article-body">${article.content}</div>`;

  // Derive a destination name for contextual CTAs
  const destName = article.related_destinations && article.related_destinations.length > 0
    ? article.related_destinations[0].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'your next destination';

  // GetYourGuide activity link — replace GYG_PARTNER_ID with your real ID after signup
  const gygDestQuery = (article.related_destinations && article.related_destinations.length > 0)
    ? article.related_destinations[0].replace(/-/g, '+')
    : 'travel';
  const gygUrl = `https://www.getyourguide.com/s/?q=${gygDestQuery}&partner_id=GYG_PARTNER_ID`;

  return buildHead(article.title, article.description, `/blog/${slug}`, article.cover_image_url) + `
<body>
<!-- Sticky floating CTA bar -->
<div class="sticky-cta" id="sticky-cta">
  <div class="sticky-cta-text">
    <strong>Plan ${destName} with ATLAS</strong>
    AI itinerary, visa info, hotels &amp; budget — free in seconds
  </div>
  <a href="/" class="sticky-cta-btn">Plan Now →</a>
</div>

<div class="container">
  <header><a href="/">${logoSvg()}<span>Atlas</span></a></header>
  ${article.cover_image_url ? `<img src="${article.cover_image_url}" alt="${article.title}" class="hero-img"/>` : ''}
  <span class="badge">${article.category}</span>
  <h1 style="margin-top:0.75rem;">${article.hero_emoji} ${article.title}</h1>
  <div class="meta">
    <span>${dateFormatted}</span>
    <span>${article.read_time}</span>
  </div>
  ${highlightsHtml}
  ${keyFactsHtml}
  ${langToggle}
  ${contentHtml}

  <!-- Primary CTA -->
  <div class="cta" style="margin-top:2.5rem;">
    <p style="font-size:1rem;color:#e8dcc8;font-family:'Cormorant Garamond',serif;font-weight:300;font-size:1.2rem;margin-bottom:0.4rem;">Ready to plan your trip to ${destName}?</p>
    <p>ATLAS builds your full itinerary in seconds — day-by-day schedule, visa info, hotel picks, and budget estimate. Free to use.</p>
    <a href="/" class="cta-btn">Plan with ATLAS — It's Free →</a>
  </div>

  <!-- GetYourGuide activities -->
  <div class="gyg-section">
    <h3>🎟 Book Tours &amp; Activities</h3>
    <p>Skip the queue and book the best experiences in ${destName} — guided tours, day trips, transfers, and more.</p>
    <a href="${gygUrl}" class="gyg-btn" target="_blank" rel="noopener">Browse Activities on GetYourGuide →</a>
  </div>

  <!-- Newsletter signup -->
  <div class="newsletter">
    <div class="newsletter-icon">✉️</div>
    <div class="newsletter-title">Travel tips for Bangladeshi passport holders</div>
    <p class="newsletter-desc">Visa news, budget routes, hidden destinations — straight to your inbox. No spam, unsubscribe anytime.</p>
    <form class="newsletter-form" id="subscribe-form">
      <input type="email" placeholder="your@email.com" required id="sub-email"/>
      <button type="submit" id="sub-btn">Subscribe →</button>
    </form>
    <p class="newsletter-note" id="sub-msg" style="display:none;"></p>
  </div>

  ${relatedLinks ? `<div class="related"><h3>Plan a Trip</h3><div class="related-links">${relatedLinks}</div></div>` : ''}
  <a href="/blog" class="back">← Back to Blog</a>
</div>

<script type="application/ld+json">${schema}</script>
<script type="application/ld+json">${breadcrumb}</script>
<script>
  // Sticky CTA — show after scrolling 40% of page
  (function(){
    var bar = document.getElementById('sticky-cta');
    var shown = false;
    window.addEventListener('scroll', function(){
      var pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if(!shown && pct > 0.35){ bar.classList.add('visible'); shown = true; }
      if(shown && pct < 0.1){ bar.classList.remove('visible'); shown = false; }
    }, {passive:true});
  })();

  // Newsletter subscribe
  document.getElementById('subscribe-form').addEventListener('submit', async function(e){
    e.preventDefault();
    var email = document.getElementById('sub-email').value;
    var btn = document.getElementById('sub-btn');
    var msg = document.getElementById('sub-msg');
    btn.textContent = '...';
    btn.disabled = true;
    try {
      var res = await fetch('/api/subscribe', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({email: email, source: 'blog-article'})
      });
      msg.style.display = '';
      if(res.ok){
        msg.style.color = '#c9a96e';
        msg.textContent = '✓ You\\'re in! First email coming soon.';
        document.getElementById('subscribe-form').style.display = 'none';
      } else {
        msg.style.color = '#c08060';
        msg.textContent = 'Something went wrong — try again.';
        btn.textContent = 'Subscribe →';
        btn.disabled = false;
      }
    } catch(err){
      msg.style.display = '';
      msg.style.color = '#c08060';
      msg.textContent = 'Connection error — try again.';
      btn.textContent = 'Subscribe →';
      btn.disabled = false;
    }
  });
</script>
</body></html>`;
}

export default async function handler(req, res) {
  const { slug } = req.query;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'index, follow');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');

  if (!slug || slug === 'index') {
    const { data, error } = await sb
      .from('blog_posts')
      .select('slug, title, description, category, date_published, read_time, hero_emoji, cover_image_url')
      .eq('is_published', true)
      .order('date_published', { ascending: false });

    if (error) return res.status(500).send('<h1>Error loading blog</h1>');
    return res.status(200).send(buildListingPage(data || []));
  }

  const { data, error } = await sb
    .from('blog_posts')
    .select('slug,title,description,category,date_published,read_time,hero_emoji,content,content_bn,cover_image_url,key_facts,highlights,related_destinations,updated_at')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) {
    res.writeHead(302, { Location: '/blog' });
    return res.end();
  }

  return res.status(200).send(buildArticlePage(slug, data));
}
