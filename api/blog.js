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
.lang-selector{position:relative;display:inline-block;margin-bottom:1.5rem;}
.lang-selected{display:flex;align-items:center;gap:0.5rem;background:rgba(201,169,110,0.08);border:1px solid rgba(201,169,110,0.25);border-radius:8px;padding:0.45rem 0.9rem;cursor:pointer;font-size:0.78rem;color:#c9a96e;font-family:'DM Sans',sans-serif;user-select:none;}
.lang-selected-arrow{font-size:0.65rem;margin-left:0.2rem;transition:transform 0.2s;}
.lang-dropdown{position:absolute;top:calc(100% + 4px);left:0;background:#1e1a14;border:1px solid rgba(201,169,110,0.2);border-radius:8px;overflow:hidden;z-index:100;min-width:160px;box-shadow:0 4px 20px rgba(0,0,0,0.4);display:none;}
.lang-dropdown.open{display:block;}
.lang-option{padding:0.5rem 0.9rem;font-size:0.78rem;color:#ede5d5;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background 0.15s;}
.lang-option:hover{background:rgba(201,169,110,0.12);}
.lang-option.active{color:#c9a96e;font-weight:600;}
[dir="rtl"] .article-body{direction:rtl;text-align:right;font-family:'DM Sans',Tahoma,Arial,sans-serif;}
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
<script async defer src="https://widget.getyourguide.com/dist/pa.umd.production.min.js" data-gyg-partner-id="TIBSGZK"></script>
</head>`;
}

function logoSvg() {
  return `<svg width="28" height="28" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><circle cx="200" cy="200" r="170" fill="none" stroke="#c9a96e" stroke-width="2.2"/><circle cx="200" cy="200" r="130" fill="none" stroke="#8a6a3a" stroke-width="1"/><circle cx="200" cy="200" r="18" fill="#c9a96e"/></svg>`;
}

function buildListingPage(articles, activeCatParam) {
  const hero = articles[0];
  const row1 = articles.slice(1, 3);
  const grid1 = articles.slice(3, 6);
  const row2 = articles.slice(6, 8);
  const grid2 = articles.slice(8, 11);
  const rest = articles.slice(11);

  function heroDate(a) {
    return new Date(a.date_published).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  }

  function fullRow(a, imgRight) {
    if (!a) return '';
    const d = heroDate(a);
    const img = a.cover_image_url
      ? `<div class="afr-image"><img src="${a.cover_image_url}" alt="${a.title}" loading="lazy"/></div>`
      : `<div class="afr-image" style="background:#2a2419;"></div>`;
    const text = `
      <div class="afr-content">
        <div class="afr-issue">${a.category}</div>
        <h2 class="afr-title">${a.title}</h2>
        <p class="afr-excerpt">${a.description}</p>
        <div class="afr-meta"><span>${d}</span><span class="afr-sep"></span><span>${a.read_time}</span></div>
        <div class="afr-link">Read the story <div class="afr-link-line"></div></div>
      </div>`;
    return `<a href="/blog/${a.slug}" class="article-fullrow${imgRight ? '' : ' reverse'}">${imgRight ? text + img : img + text}</a>`;
  }

  function threeGrid(arr) {
    if (!arr.length) return '';
    const cards = arr.map((a, i) => `
      <a href="/blog/${a.slug}" class="sg-card">
        <div class="sg-img">${a.cover_image_url ? `<img src="${a.cover_image_url}" alt="${a.title}" loading="lazy"/>` : ''}<span class="sg-num">0${i+1}</span></div>
        <div class="sg-cat">${a.category}</div>
        <div class="sg-title">${a.title}</div>
        <p class="sg-excerpt">${a.description}</p>
        <div class="sg-meta">${a.read_time} · ${heroDate(a)}</div>
      </a>`).join('');
    return `<div class="three-grid">${cards}</div>`;
  }

  function restCards(arr) {
    if (!arr.length) return '';
    const cards = arr.map(a => `
      <a href="/blog/${a.slug}" class="rest-card">
        <div class="rest-img">${a.cover_image_url ? `<img src="${a.cover_image_url}" alt="${a.title}" loading="lazy"/>` : ''}</div>
        <div class="rest-body">
          <div class="rest-cat">${a.category}</div>
          <div class="rest-title">${a.title}</div>
          <div class="rest-meta">${a.read_time} · ${heroDate(a)}</div>
        </div>
      </a>`).join('');
    return `<div class="rest-grid">${cards}</div>`;
  }

  const heroHtml = hero ? `
  <a href="/blog/${hero.slug}" class="full-hero">
    ${hero.cover_image_url ? `<img src="${hero.cover_image_url}" alt="${hero.title}"/>` : ''}
    <div class="full-hero-overlay">
      <div class="hero-tag"><div class="hero-tag-line"></div><span class="hero-tag-text">Featured Story · ${hero.category}</span></div>
      <h1 class="hero-h1">${hero.title}</h1>
      <p class="hero-desc">${hero.description}</p>
      <div class="hero-read-btn">Read the story <div class="hero-arrow"></div></div>
    </div>
    <div class="scroll-indicator"><div class="scroll-line"></div><span>Scroll</span></div>
  </a>` : '';

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "ATLAS Travel Blog",
    "description": "Travel guides, visa tips, budget breakdowns, and destination deep-dives.",
    "url": "https://getatlas.ca/blog",
    "publisher": { "@type": "Organization", "name": "ATLAS", "url": "https://getatlas.ca" }
  });

  const destCategories = [
    { label: 'South Asia', sub: 'Bangladesh · Maldives · Nepal · India', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', q: 'southasia' },
    { label: 'East & Southeast Asia', sub: 'Japan · Bali · Singapore · Thailand', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80', q: 'eastasia' },
    { label: 'Europe & Middle East', sub: 'Istanbul · Turkey · Beyond', img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80', q: 'europe' },
    { label: 'Visa & Budget Tips', sub: 'Guides · Packing · Solo Travel', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80', q: 'tips' },
  ];
  const activeCat = activeCatParam || null;

  const destGrid = `
  <section class="dest-section">
    <div class="section-head-bar">
      <h2 class="sh-title">Browse by <em>Destination</em></h2>
      ${activeCat ? `<a href="/blog" class="sh-link">← All articles</a>` : ''}
    </div>
    <div class="dest-grid">
      ${destCategories.map(d => `
      <a href="/blog?cat=${d.q}" class="dest-card${activeCat === d.q ? ' active-cat' : ''}">
        <img src="${d.img}" alt="${d.label}" loading="lazy"/>
        <div class="dest-overlay">
          <div class="dest-label">${d.label}</div>
          <div class="dest-sub">${d.sub}</div>
        </div>
      </a>`).join('')}
    </div>
  </section>`;

  const listingStyles = `
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#17140f;color:#ede3d2;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;}
a{text-decoration:none;color:inherit;}
img{display:block;width:100%;height:100%;object-fit:cover;}

/* NAV */
.blog-nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 3rem;height:64px;background:rgba(23,20,15,0.95);backdrop-filter:blur(16px);border-bottom:1px solid rgba(201,169,110,0.15);}
.blog-nav-logo{font-family:'Cormorant Garamond',serif;font-size:1.45rem;font-weight:600;color:#c9a96e;letter-spacing:0.05em;display:flex;align-items:center;gap:0.6rem;}
.blog-nav-links{display:flex;gap:2rem;list-style:none;}
.blog-nav-links a{color:#8a7960;font-size:0.78rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;transition:color 0.2s;}
.blog-nav-links a:hover,.blog-nav-links a.active{color:#c9a96e;}
.blog-nav-cta{background:#c9a96e;color:#17140f;border:none;padding:0.48rem 1.3rem;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:0.75rem;font-weight:600;cursor:pointer;letter-spacing:0.04em;}
.blog-nav-cta:hover{opacity:0.88;}
@media(max-width:700px){.blog-nav{padding:0 1.2rem;}.blog-nav-links{display:none;}}

/* HERO */
.full-hero{position:relative;height:100vh;min-height:560px;max-height:920px;overflow:hidden;display:block;}
.full-hero img{width:100%;height:100%;object-fit:cover;transition:transform 8s ease;}
.full-hero:hover img{transform:scale(1.03);}
.full-hero-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(23,20,15,0.88) 0%,rgba(23,20,15,0.45) 55%,rgba(23,20,15,0.15) 100%);display:flex;flex-direction:column;justify-content:center;padding:0 5rem;}
.hero-tag{display:inline-flex;align-items:center;gap:0.6rem;margin-bottom:1.8rem;}
.hero-tag-line{width:26px;height:1px;background:#c9a96e;}
.hero-tag-text{font-size:0.66rem;letter-spacing:0.2em;text-transform:uppercase;color:#c9a96e;font-weight:500;}
.hero-h1{font-family:'Cormorant Garamond',serif;font-size:clamp(2.4rem,5vw,5rem);font-weight:300;color:#f5ede0;line-height:1.08;letter-spacing:-0.01em;max-width:660px;margin-bottom:1.5rem;}
.hero-desc{color:rgba(237,227,210,0.7);font-size:0.92rem;line-height:1.75;max-width:460px;margin-bottom:2.2rem;}
.hero-read-btn{display:inline-flex;align-items:center;gap:0.8rem;color:#c9a96e;font-size:0.73rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;}
.hero-arrow{width:38px;height:1px;background:#c9a96e;position:relative;transition:width 0.3s;}
.hero-arrow::after{content:'';position:absolute;right:0;top:-3px;border:3px solid transparent;border-left:5px solid #c9a96e;}
.full-hero:hover .hero-arrow{width:56px;}
.scroll-indicator{position:absolute;bottom:2.2rem;right:3.5rem;display:flex;flex-direction:column;align-items:center;gap:0.5rem;color:#c9a96e;}
.scroll-indicator span{font-size:0.58rem;letter-spacing:0.15em;text-transform:uppercase;writing-mode:vertical-rl;}
.scroll-line{width:1px;height:38px;background:linear-gradient(to bottom,#c9a96e,transparent);}
@media(max-width:700px){.full-hero-overlay{padding:0 1.5rem;}.scroll-indicator{display:none;}}

/* DEST SECTION */
.dest-section{padding:3.5rem 3rem 0;}
.section-head-bar{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:1.8rem;padding-bottom:1.2rem;border-bottom:1px solid rgba(201,169,110,0.15);}
.sh-title{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;color:#ede3d2;}
.sh-title em{font-style:italic;color:#c9a96e;}
.sh-link{font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;color:#8a7960;transition:color 0.2s;}
.sh-link:hover{color:#c9a96e;}
.dest-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(201,169,110,0.12);border-radius:10px;overflow:hidden;}
.dest-card{position:relative;height:220px;overflow:hidden;display:block;}
.dest-card img{transition:transform 0.5s ease;}
.dest-card:hover img{transform:scale(1.06);}
.dest-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(23,20,15,0.88) 0%,rgba(23,20,15,0.3) 60%,rgba(23,20,15,0.05) 100%);display:flex;flex-direction:column;justify-content:flex-end;padding:1.3rem 1.2rem;}
.dest-label{font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:500;color:#f0e8d8;margin-bottom:0.25rem;}
.dest-sub{font-size:0.62rem;color:rgba(201,169,110,0.7);letter-spacing:0.06em;}
.dest-card.active-cat{box-shadow:inset 0 0 0 2px #c9a96e;}
@media(max-width:800px){.dest-grid{grid-template-columns:repeat(2,1fr);}.dest-section{padding:2.5rem 1.2rem 0;}}

/* FULL-ROW ARTICLES */
.articles-body{padding:0 3rem 4rem;}
.article-fullrow{display:grid;grid-template-columns:1fr 1fr;min-height:440px;border-bottom:1px solid rgba(201,169,110,0.12);margin-top:0;text-decoration:none;color:inherit;}
.article-fullrow.reverse .afr-image{order:1;}
.article-fullrow.reverse .afr-content{order:2;}
.afr-image{position:relative;overflow:hidden;background:#1e1a12;}
.afr-image img{width:100%;height:100%;object-fit:cover;transition:transform 0.6s ease;}
.article-fullrow:hover .afr-image img{transform:scale(1.04);}
.afr-content{display:flex;flex-direction:column;justify-content:center;padding:3.5rem 4rem;background:#1e1a12;transition:background 0.25s;}
.article-fullrow:hover .afr-content{background:#242019;}
.afr-issue{font-size:0.6rem;letter-spacing:0.18em;text-transform:uppercase;color:#c9a96e;font-weight:500;margin-bottom:1.3rem;display:flex;align-items:center;gap:0.8rem;}
.afr-issue::before{content:'';width:18px;height:1px;background:#c9a96e;}
.afr-title-link{display:block;}
.afr-title{font-family:'Cormorant Garamond',serif;font-size:clamp(1.6rem,2.5vw,2.5rem);font-weight:400;color:#ede3d2;line-height:1.15;letter-spacing:-0.01em;margin-bottom:1rem;transition:color 0.2s;}
.article-fullrow:hover .afr-title{color:#c9a96e;}
.afr-excerpt{color:#8a7960;font-size:0.86rem;line-height:1.8;margin-bottom:2rem;max-width:390px;}
.afr-meta{display:flex;align-items:center;gap:1rem;font-size:0.7rem;color:#52473a;margin-bottom:1.8rem;}
.afr-sep{width:3px;height:3px;border-radius:50%;background:#52473a;}
.afr-link{display:inline-flex;align-items:center;gap:0.9rem;color:#c9a96e;font-size:0.7rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;transition:gap 0.2s;}
.afr-link:hover{gap:1.3rem;}
.afr-link-line{width:30px;height:1px;background:#c9a96e;}
@media(max-width:800px){.article-fullrow{grid-template-columns:1fr;min-height:auto;}.afr-image{height:240px;}.afr-content{padding:2rem 1.5rem;}.article-fullrow.reverse .afr-image{order:0;}.article-fullrow.reverse .afr-content{order:1;}.articles-body{padding:0 0 3rem;}}

/* THREE GRID */
.three-grid{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid rgba(201,169,110,0.12);}
.sg-card{padding:2.5rem 2.2rem;border-right:1px solid rgba(201,169,110,0.12);transition:background 0.2s;display:block;}
.sg-card:last-child{border-right:none;}
.sg-card:hover{background:#1e1a12;}
.sg-img{height:180px;border-radius:5px;overflow:hidden;margin-bottom:1.5rem;position:relative;background:#1e1a12;}
.sg-img img{transition:transform 0.4s;}
.sg-card:hover .sg-img img{transform:scale(1.05);}
.sg-num{font-family:'Cormorant Garamond',serif;font-size:4.5rem;font-weight:300;color:rgba(201,169,110,0.06);line-height:1;position:absolute;bottom:-0.8rem;right:0.8rem;}
.sg-cat{font-size:0.6rem;letter-spacing:0.14em;text-transform:uppercase;color:#c9a96e;font-weight:500;margin-bottom:0.55rem;}
.sg-title{font-family:'Cormorant Garamond',serif;font-size:1.25rem;font-weight:500;color:#ede3d2;line-height:1.25;margin-bottom:0.7rem;transition:color 0.2s;}
.sg-card:hover .sg-title{color:#c9a96e;}
.sg-excerpt{font-size:0.78rem;color:#8a7960;line-height:1.7;margin-bottom:0.8rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.sg-meta{font-size:0.67rem;color:#52473a;}
@media(max-width:800px){.three-grid{grid-template-columns:1fr;}.sg-card{border-right:none;border-bottom:1px solid rgba(201,169,110,0.12);padding:1.8rem 1.5rem;}}

/* REST GRID */
.rest-section{padding:3rem 3rem 2rem;}
.rest-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;}
.rest-card{display:block;border:1px solid rgba(201,169,110,0.12);border-radius:10px;overflow:hidden;transition:border-color 0.2s,background 0.2s;}
.rest-card:hover{border-color:rgba(201,169,110,0.3);background:#1e1a12;}
.rest-img{height:150px;overflow:hidden;background:#1e1a12;}
.rest-img img{transition:transform 0.4s;}
.rest-card:hover .rest-img img{transform:scale(1.04);}
.rest-body{padding:1.1rem 1.3rem 1.3rem;}
.rest-cat{font-size:0.58rem;letter-spacing:0.12em;text-transform:uppercase;color:#c9a96e;font-weight:500;margin-bottom:0.4rem;}
.rest-title{font-family:'Cormorant Garamond',serif;font-size:1.05rem;font-weight:500;color:#ede3d2;line-height:1.25;margin-bottom:0.5rem;transition:color 0.2s;}
.rest-card:hover .rest-title{color:#c9a96e;}
.rest-meta{font-size:0.65rem;color:#52473a;}
@media(max-width:800px){.rest-section{padding:2rem 1.2rem;}.rest-grid{grid-template-columns:1fr 1fr;gap:1rem;}@media(max-width:480px){.rest-grid{grid-template-columns:1fr;}}}

/* NEWSLETTER */
.nl-section{display:grid;grid-template-columns:1fr 1fr;min-height:300px;border-top:1px solid rgba(201,169,110,0.15);}
.nl-left{position:relative;overflow:hidden;}
.nl-left img{width:100%;height:100%;object-fit:cover;filter:brightness(0.45) sepia(0.25);}
.nl-left-overlay{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:3rem;}
.nl-big{font-family:'Cormorant Garamond',serif;font-size:clamp(1.8rem,3.5vw,3rem);font-weight:300;color:#f0e8d8;line-height:1.1;}
.nl-big em{font-style:italic;color:#c9a96e;}
.nl-right{background:#1e1a12;display:flex;flex-direction:column;justify-content:center;padding:3.5rem 4.5rem;border-left:1px solid rgba(201,169,110,0.12);}
.nl-right h3{font-family:'Cormorant Garamond',serif;font-size:1.55rem;font-weight:400;color:#ede3d2;margin-bottom:0.7rem;}
.nl-right p{color:#8a7960;font-size:0.83rem;line-height:1.7;margin-bottom:1.8rem;}
.nl-form{display:flex;flex-direction:column;gap:0.65rem;}
.nl-input{background:#17140f;border:1px solid rgba(201,169,110,0.2);border-radius:7px;padding:0.72rem 1.1rem;color:#ede3d2;font-family:'DM Sans',sans-serif;font-size:0.83rem;outline:none;transition:border-color 0.2s;}
.nl-input:focus{border-color:#c9a96e;}
.nl-btn{background:#c9a96e;color:#17140f;border:none;border-radius:7px;padding:0.72rem 1.8rem;font-family:'DM Sans',sans-serif;font-size:0.8rem;font-weight:600;letter-spacing:0.04em;cursor:pointer;align-self:flex-start;transition:opacity 0.2s;}
.nl-btn:hover{opacity:0.88;}
.nl-note{font-size:0.66rem;color:#52473a;margin-top:0.4rem;}
@media(max-width:800px){.nl-section{grid-template-columns:1fr;}.nl-left{height:220px;}.nl-right{padding:2.5rem 1.5rem;border-left:none;}}

/* ARTICLES SECTION HEADER */
.sec-divider{padding:3rem 3rem 0;margin-bottom:0;}
.sec-divider-bar{display:flex;align-items:baseline;justify-content:space-between;padding-bottom:1.2rem;border-bottom:1px solid rgba(201,169,110,0.15);}
.sec-divider h2{font-family:'Cormorant Garamond',serif;font-size:1.9rem;font-weight:300;color:#ede3d2;}
.sec-divider h2 em{font-style:italic;color:#c9a96e;}
.sec-divider a{font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;color:#8a7960;}
.sec-divider a:hover{color:#c9a96e;}
@media(max-width:700px){.sec-divider{padding:2rem 1.2rem 0;}}
</style>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Travel Blog — Guides, Visa Tips &amp; Destination Deep-Dives | ATLAS</title>
<meta name="description" content="Expert travel guides, visa information, budget breakdowns, and destination deep-dives. Plan your next trip smarter with ATLAS."/>
<meta property="og:title" content="Travel Blog — ATLAS"/>
<meta property="og:description" content="Travel guides, visa tips, budget breakdowns, and destination deep-dives."/>
<meta property="og:type" content="website"/>
<meta property="og:url" content="https://getatlas.ca/blog"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="canonical" href="https://getatlas.ca/blog"/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
${listingStyles}
</head>
<body>

<!-- NAV -->
<nav class="blog-nav">
  <a href="/blog" class="blog-nav-logo">${logoSvg()} Atlas</a>
  <ul class="blog-nav-links">
    <li><a href="/blog"${!activeCat ? ' class="active"' : ''}>All</a></li>
    <li><a href="/blog?cat=southasia"${activeCat==='southasia' ? ' class="active"' : ''}>South Asia</a></li>
    <li><a href="/blog?cat=eastasia"${activeCat==='eastasia' ? ' class="active"' : ''}>East Asia</a></li>
    <li><a href="/blog?cat=tips"${activeCat==='tips' ? ' class="active"' : ''}>Tips & Visa</a></li>
  </ul>
  <a href="/" class="blog-nav-cta">Plan Free →</a>
</nav>

<!-- HERO -->
${heroHtml}

<!-- DESTINATION CATEGORIES -->
${destGrid}

<!-- LATEST STORIES -->
<div class="sec-divider"><div class="sec-divider-bar"><h2>Latest <em>Stories</em></h2><span></span></div></div>
<div class="articles-body">
  ${fullRow(row1[0], false)}
  ${fullRow(row1[1], true)}
</div>

${threeGrid(grid1)}

<div class="sec-divider"><div class="sec-divider-bar"><h2>More <em>to Explore</em></h2><span></span></div></div>
<div class="articles-body">
  ${fullRow(row2[0], false)}
  ${fullRow(row2[1], true)}
</div>

${threeGrid(grid2)}

${rest.length ? `<div class="rest-section"><div class="section-head-bar" style="margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:1px solid rgba(201,169,110,0.12);"><h2 class="sh-title">All <em>Articles</em></h2></div>${restCards(rest)}</div>` : ''}

<!-- NEWSLETTER -->
<div class="nl-section">
  <div class="nl-left">
    <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80" alt="Travel"/>
    <div class="nl-left-overlay">
      <div class="nl-big">Discover the<br>world <em>with us.</em></div>
    </div>
  </div>
  <div class="nl-right">
    <h3>The Atlas Dispatch</h3>
    <p>Hidden gems, budget routes, and destination inspiration from across the globe — delivered to your inbox every week. No spam, just stories worth reading.</p>
    <div class="nl-form">
      <input class="nl-input" type="email" placeholder="your@email.com" id="nl-email" required/>
      <button class="nl-btn" id="nl-btn" onclick="nlSubscribe()">Subscribe — it's free</button>
      <p class="nl-note" id="nl-msg" style="display:none;"></p>
    </div>
  </div>
</div>

<script type="application/ld+json">${schema}</script>
<script>
async function nlSubscribe(){
  var email=document.getElementById('nl-email').value;
  if(!email||!email.includes('@')) return;
  var btn=document.getElementById('nl-btn');
  var msg=document.getElementById('nl-msg');
  btn.textContent='...'; btn.disabled=true;
  try{
    var r=await fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,source:'blog-index'})});
    msg.style.display='';
    if(r.ok){msg.style.color='#c9a96e';msg.textContent='✓ You\\'re in! First email coming soon.';btn.style.display='none';}
    else{msg.style.color='#c08060';msg.textContent='Something went wrong — try again.';btn.textContent='Subscribe — it\\'s free';btn.disabled=false;}
  }catch(e){msg.style.display='';msg.style.color='#c08060';msg.textContent='Connection error — try again.';btn.textContent='Subscribe — it\\'s free';btn.disabled=false;}
}
</script>
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

  // Build available languages list
  const translations = article.content_translations || {};
  const LANGS = [
    { code: 'en',  label: '🇬🇧 English',  content: article.content,  rtl: false },
    { code: 'bn',  label: '🇧🇩 বাংলা',     content: contentBn,        rtl: false },
    { code: 'hi',  label: '🇮🇳 हिंदी',      content: translations.hi,  rtl: false },
    { code: 'ar',  label: '🇸🇦 العربية',    content: translations.ar,  rtl: true  },
    { code: 'zh',  label: '🇨🇳 中文',       content: translations.zh,  rtl: false },
    { code: 'ja',  label: '🇯🇵 日本語',     content: translations.ja,  rtl: false },
    { code: 'ko',  label: '🇰🇷 한국어',     content: translations.ko,  rtl: false },
    { code: 'es',  label: '🇪🇸 Español',   content: translations.es,  rtl: false },
    { code: 'fr',  label: '🇫🇷 Français',  content: translations.fr,  rtl: false },
  ].filter(l => l.content);

  const hasMultiLang = LANGS.length > 1;

  const langToggle = hasMultiLang ? `
  <div class="lang-selector" id="lang-selector">
    <div class="lang-selected" id="lang-selected" onclick="toggleLangDropdown()">
      ${LANGS[0].label} <span class="lang-selected-arrow">▾</span>
    </div>
    <div class="lang-dropdown" id="lang-dropdown">
      ${LANGS.map((l, i) => `<div class="lang-option${i===0?' active':''}" onclick="switchLang('${l.code}',this)">${l.label}</div>`).join('')}
    </div>
  </div>` : '';

  const contentHtml = hasMultiLang
    ? LANGS.map((l, i) => `<div id="content-${l.code}" class="article-body"${i>0?' style="display:none"':''}${l.rtl?' dir="rtl"':''}>${l.content}</div>`).join('\n')
    : `<div class="article-body">${article.content}</div>`;

  // Derive a destination name for contextual CTAs
  const destName = article.related_destinations && article.related_destinations.length > 0
    ? article.related_destinations[0].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'your next destination';

  // GetYourGuide activity link — replace GYG_PARTNER_ID with your real ID after signup
  const gygDestQuery = (article.related_destinations && article.related_destinations.length > 0)
    ? article.related_destinations[0].replace(/-/g, '+')
    : 'travel';
  const gygUrl = `https://www.getyourguide.com/s/?q=${gygDestQuery}&partner_id=TIBSGZK`;

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
    <div class="newsletter-title">Discover the world — one destination at a time</div>
    <p class="newsletter-desc">Hidden gems, budget routes, and travel inspiration from across the globe — straight to your inbox. No spam, unsubscribe anytime.</p>
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
  // Language switcher
  function toggleLangDropdown(){
    var dd=document.getElementById('lang-dropdown');
    var arrow=document.querySelector('.lang-selected-arrow');
    var isOpen=dd.classList.toggle('open');
    if(arrow) arrow.style.transform=isOpen?'rotate(180deg)':'';
  }
  function switchLang(lang,el){
    var label=el.textContent;
    document.getElementById('lang-selected').innerHTML=label+' <span class="lang-selected-arrow">▾</span>';
    document.querySelectorAll('.lang-option').forEach(function(o){o.classList.remove('active');});
    el.classList.add('active');
    document.getElementById('lang-dropdown').classList.remove('open');
    document.querySelector('.lang-selected-arrow').style.transform='';
    document.querySelectorAll('.article-body').forEach(function(e){e.style.display='none';});
    var t=document.getElementById('content-'+lang);
    if(t) t.style.display='';
  }
  document.addEventListener('click',function(e){
    var sel=document.getElementById('lang-selector');
    if(sel&&!sel.contains(e.target)){
      var dd=document.getElementById('lang-dropdown');
      if(dd) dd.classList.remove('open');
      var arrow=document.querySelector('.lang-selected-arrow');
      if(arrow) arrow.style.transform='';
    }
  });

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

const CAT_KEYWORDS = {
  southasia: ['bangladesh','dhaka','cox','sundarbans','maldives','nepal','everest','india'],
  eastasia: ['japan','kyoto','bali','singapore','thailand','asia','pacific'],
  europe: ['istanbul','turkey','europe','middle-east'],
  tips: ['visa','budget','packing','solo','tips','travel-tips'],
};

export default async function handler(req, res) {
  const { slug, cat } = req.query;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'index, follow');
  res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');

  if (!slug || slug === 'index') {
    const { data, error } = await sb
      .from('blog_posts')
      .select('slug, title, description, category, date_published, read_time, hero_emoji, cover_image_url')
      .eq('is_published', true)
      .order('date_published', { ascending: false });

    if (error) return res.status(500).send('<h1>Error loading blog</h1>');

    let articles = data || [];

    // Filter by category if ?cat= param present
    if (cat && CAT_KEYWORDS[cat]) {
      const kw = CAT_KEYWORDS[cat];
      articles = articles.filter(a => {
        const haystack = (a.slug + ' ' + (a.category || '')).toLowerCase();
        return kw.some(k => haystack.includes(k));
      });
    }

    return res.status(200).send(buildListingPage(articles, cat || null));
  }

  const { data, error } = await sb
    .from('blog_posts')
    .select('slug,title,description,category,date_published,read_time,hero_emoji,content,content_bn,content_translations,cover_image_url,key_facts,highlights,related_destinations,updated_at')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) {
    res.writeHead(302, { Location: '/blog' });
    return res.end();
  }

  return res.status(200).send(buildArticlePage(slug, data));
}
