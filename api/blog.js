import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://prffhhkemxibujjjiyhg.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

function buildHead(title, description, path) {
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
<meta name="twitter:card" content="summary_large_image"/>
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
.related{margin-top:2.5rem;padding-top:1.5rem;border-top:1px solid rgba(201,169,110,0.15);}
.related h3{margin-bottom:0.75rem;}
.related-links{display:flex;flex-wrap:wrap;gap:0.5rem;}
.related-links a{font-size:0.72rem;padding:0.3rem 0.75rem;border:1px solid rgba(201,169,110,0.2);border-radius:4px;color:#c9a96e;text-decoration:none;letter-spacing:0.06em;transition:background 0.2s,border-color 0.2s;}
.related-links a:hover{background:rgba(201,169,110,0.1);border-color:rgba(201,169,110,0.4);}
.articles-grid{display:flex;flex-direction:column;gap:1.25rem;margin-top:1.5rem;}
.article-card{border:1px solid rgba(201,169,110,0.15);border-radius:10px;padding:1.25rem 1.5rem;text-decoration:none;transition:border-color 0.2s,background 0.2s;display:block;}
.article-card:hover{border-color:rgba(201,169,110,0.35);background:rgba(201,169,110,0.04);}
.card-top{display:flex;align-items:flex-start;gap:0.75rem;margin-bottom:0.5rem;}
.card-emoji{font-size:1.5rem;flex-shrink:0;}
.card-title{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:400;color:#e8dcc8;line-height:1.25;}
.card-desc{font-size:0.82rem;color:#7a7060;line-height:1.7;margin-bottom:0.6rem;}
.card-meta{display:flex;gap:0.75rem;font-size:0.65rem;color:#5a4a2a;letter-spacing:0.08em;text-transform:uppercase;flex-wrap:wrap;align-items:center;}
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
  <a href="/blog/${a.slug}" class="article-card">
    <div class="card-top">
      <span class="card-emoji">${a.hero_emoji}</span>
      <div class="card-title">${a.title}</div>
    </div>
    <p class="card-desc">${a.description}</p>
    <div class="card-meta">
      <span class="badge">${a.category}</span>
      <span>${dateStr}</span>
      <span>${a.read_time}</span>
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
    '/blog'
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

  return buildHead(article.title, article.description, `/blog/${slug}`) + `
<body>
<div class="container">
  <header><a href="/">${logoSvg()}<span>Atlas</span></a></header>
  <span class="badge">${article.category}</span>
  <h1 style="margin-top:0.75rem;">${article.hero_emoji} ${article.title}</h1>
  <div class="meta">
    <span>${dateFormatted}</span>
    <span>${article.read_time}</span>
  </div>
  <div class="article-body">${article.content}</div>
  <div class="cta">
    <p>Ready to plan your trip? Let ATLAS build a personalized itinerary in seconds.</p>
    <a href="/" class="cta-btn">Plan with ATLAS →</a>
  </div>
  ${relatedLinks ? `<div class="related"><h3>Plan a Trip</h3><div class="related-links">${relatedLinks}</div></div>` : ''}
  <a href="/blog" class="back">← Back to Blog</a>
</div>
<script type="application/ld+json">${schema}</script>
<script type="application/ld+json">${breadcrumb}</script>
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
      .select('slug, title, description, category, date_published, read_time, hero_emoji')
      .eq('is_published', true)
      .order('date_published', { ascending: false });

    if (error) return res.status(500).send('<h1>Error loading blog</h1>');
    return res.status(200).send(buildListingPage(data || []));
  }

  const { data, error } = await sb
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) {
    res.writeHead(302, { Location: '/blog' });
    return res.end();
  }

  return res.status(200).send(buildArticlePage(slug, data));
}
