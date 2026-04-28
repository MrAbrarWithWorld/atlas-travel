import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://prffhhkemxibujjjiyhg.supabase.co';
const sb = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

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
.inline-img{width:100%;height:auto;border-radius:10px;margin:1.5rem 0;display:block;}
.inline-img-caption{font-size:0.7rem;color:#5a4a2a;text-align:center;margin-top:-1rem;margin-bottom:1.5rem;letter-spacing:0.06em;}
.card-img{width:100%;height:170px;object-fit:cover;border-radius:8px 8px 0 0;margin-bottom:0;display:block;}
.related{margin-top:2.5rem;padding-top:1.5rem;border-top:1px solid rgba(201,169,110,0.15);}
.related h3{margin-bottom:0.75rem;}
.related-links{display:flex;flex-wrap:wrap;gap:0.5rem;}
.related-links a{font-size:0.72rem;padding:0.3rem 0.75rem;border:1px solid rgba(201,169,110,0.2);border-radius:4px;color:#c9a96e;text-decoration:none;letter-spacing:0.06em;transition:background 0.2s,border-color 0.2s;}
.related-links a:hover{background:rgba(201,169,110,0.1);border-color:rgba(201,169,110,0.4);}
.related-posts-section{margin-top:2.5rem;padding-top:1.5rem;border-top:1px solid rgba(201,169,110,0.15);}
.related-posts-title{font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:400;color:#c9a96e;letter-spacing:0.08em;margin-bottom:1rem;}
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
.visa-disclaimer{display:flex;align-items:flex-start;gap:0.6rem;background:rgba(201,169,110,0.06);border:1px solid rgba(201,169,110,0.2);border-left:3px solid #c9a96e;border-radius:0 8px 8px 0;padding:0.7rem 1rem;margin:-0.5rem 0 1.5rem;font-size:0.78rem;color:#9a8a70;line-height:1.6;}
.visa-disclaimer-icon{flex-shrink:0;font-size:0.9rem;margin-top:0.05rem;}
.visa-disclaimer strong{color:#c9a96e;}
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
/* Share */
.share-section{margin:2.5rem 0 1rem;padding-top:1.5rem;border-top:1px solid rgba(201,169,110,0.15);}
.share-label{font-size:0.68rem;letter-spacing:0.12em;text-transform:uppercase;color:#6a5a3a;margin-bottom:0.75rem;}
.share-btns{display:flex;flex-wrap:wrap;gap:0.5rem;}
.share-btn{display:inline-flex;align-items:center;gap:0.4rem;padding:0.4rem 0.9rem;border-radius:7px;font-size:0.75rem;font-family:'DM Sans',sans-serif;text-decoration:none;cursor:pointer;border:1px solid rgba(201,169,110,0.2);background:rgba(201,169,110,0.06);color:#c9a96e;transition:background 0.2s,border-color 0.2s;}
.share-btn:hover{background:rgba(201,169,110,0.14);border-color:rgba(201,169,110,0.4);}
.share-btn svg{width:14px;height:14px;flex-shrink:0;}
.share-wa{color:#25D366;border-color:rgba(37,211,102,0.25);background:rgba(37,211,102,0.06);}
.share-wa:hover{background:rgba(37,211,102,0.12);}
.share-fb{color:#1877F2;border-color:rgba(24,119,242,0.25);background:rgba(24,119,242,0.06);}
.share-fb:hover{background:rgba(24,119,242,0.12);}
.share-tw{color:#e8dcc8;border-color:rgba(232,220,200,0.2);background:rgba(232,220,200,0.04);}
.share-tw:hover{background:rgba(232,220,200,0.08);}
/* Comments */
.comments-section{margin:2.5rem 0;padding-top:1.5rem;border-top:1px solid rgba(201,169,110,0.15);}
.comments-title{font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:400;color:#d4aa6e;margin-bottom:1.5rem;display:flex;align-items:center;gap:0.6rem;}
.comment-count-badge{background:rgba(201,169,110,0.12);border:1px solid rgba(201,169,110,0.2);border-radius:12px;padding:0.1rem 0.6rem;font-size:0.7rem;font-family:'DM Sans',sans-serif;color:#c9a96e;}
.comment-item{padding:1rem 0;border-bottom:1px solid rgba(201,169,110,0.08);}
.comment-meta{display:flex;gap:0.75rem;align-items:center;margin-bottom:0.4rem;}
.comment-author{font-size:0.8rem;font-weight:500;color:#d4c8b0;}
.comment-date{font-size:0.68rem;color:#5a4a2a;letter-spacing:0.05em;}
.comment-body{font-size:0.85rem;color:#a8a090;line-height:1.8;white-space:pre-wrap;word-break:break-word;}
.comment-photo{margin-top:0.75rem;}
.comment-photo img{max-height:220px;border-radius:8px;cursor:zoom-in;border:1px solid rgba(201,169,110,0.15);}
.comment-actions{margin-top:0.5rem;display:flex;gap:1rem;}
.like-btn{background:none;border:none;color:#6a5a3a;font-size:0.75rem;cursor:pointer;padding:0;display:flex;align-items:center;gap:0.3rem;transition:color 0.2s;}
.like-btn:hover,.like-btn.liked{color:#c9a96e;}
.comment-form-wrap{margin-top:2rem;background:rgba(201,169,110,0.04);border:1px solid rgba(201,169,110,0.15);border-radius:12px;padding:1.5rem;}
.comment-form-title{font-size:0.8rem;font-weight:500;color:#c9a96e;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:1rem;}
.comment-input,.comment-textarea{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(201,169,110,0.2);border-radius:8px;padding:0.65rem 0.9rem;color:#ede5d5;font-size:0.85rem;font-family:'DM Sans',sans-serif;outline:none;margin-bottom:0.6rem;box-sizing:border-box;}
.comment-input:focus,.comment-textarea:focus{border-color:rgba(201,169,110,0.45);}
.comment-textarea{resize:vertical;min-height:90px;}
.comment-char-count{font-size:0.68rem;color:#5a4a2a;text-align:right;margin-bottom:0.6rem;}
.comment-photo-row{display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem;flex-wrap:wrap;}
.comment-photo-btn{background:rgba(201,169,110,0.08);border:1px solid rgba(201,169,110,0.25);color:#c9a96e;padding:0.4rem 0.9rem;border-radius:7px;font-size:0.75rem;cursor:pointer;font-family:'DM Sans',sans-serif;}
.comment-submit-btn{background:#c9a96e;color:#1c1914;border:none;padding:0.6rem 1.5rem;border-radius:8px;font-size:0.8rem;font-weight:600;letter-spacing:0.06em;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background 0.2s;}
.comment-submit-btn:hover{background:#e0c080;}
.comment-submit-btn:disabled{opacity:0.6;cursor:default;}
/* Image lightbox */
#img-modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;align-items:center;justify-content:center;cursor:zoom-out;}
#img-modal img{max-width:90vw;max-height:90vh;border-radius:10px;}
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
/* Reading progress bar */
#read-progress{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#c9a96e,#e8c87a,#c9a96e);width:0%;z-index:9999;border-radius:0 2px 2px 0;transition:width 0.08s linear;pointer-events:none;}
/* Table of Contents sidebar */
.toc-sidebar{display:none;position:fixed;top:50%;right:1.5rem;transform:translateY(-50%);width:185px;background:rgba(18,15,10,0.94);border:1px solid rgba(201,169,110,0.18);border-radius:10px;padding:1rem 1.1rem;z-index:50;backdrop-filter:blur(10px);max-height:60vh;overflow-y:auto;}
@media(min-width:1140px){.toc-sidebar{display:block;}}
.toc-sidebar-title{font-size:0.56rem;letter-spacing:0.18em;text-transform:uppercase;color:#4a3a1a;font-weight:700;margin-bottom:0.7rem;padding-bottom:0.5rem;border-bottom:1px solid rgba(201,169,110,0.1);}
.toc-sidebar a{display:block;font-size:0.7rem;color:#6a5a3a;padding:0.22rem 0 0.22rem 0.65rem;line-height:1.45;border-left:2px solid rgba(201,169,110,0.08);margin-bottom:0.1rem;transition:color 0.15s,border-color 0.15s;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.toc-sidebar a:hover{color:#c9a96e;border-left-color:rgba(201,169,110,0.4);}
.toc-sidebar a.toc-active{color:#c9a96e;border-left-color:#c9a96e;font-weight:500;}
/* Back to top button */
#back-top{position:fixed;bottom:5rem;right:1.5rem;width:38px;height:38px;background:rgba(201,169,110,0.12);border:1px solid rgba(201,169,110,0.28);border-radius:50%;color:#c9a96e;font-size:1.1rem;cursor:pointer;z-index:998;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transform:translateY(8px);transition:opacity 0.25s,transform 0.25s,background 0.2s;line-height:1;}
#back-top.visible{opacity:1;pointer-events:auto;transform:translateY(0);}
#back-top:hover{background:rgba(201,169,110,0.25);}
@media(max-width:600px){#back-top{bottom:4.5rem;right:1rem;}}
/* ── Unique Atlas blog features ───────────────────────────── */
/* Local Tip callout */
.local-tip{display:flex;align-items:flex-start;gap:0.75rem;background:rgba(201,169,110,0.07);border:1px solid rgba(201,169,110,0.22);border-left:3px solid #c9a96e;border-radius:0 10px 10px 0;padding:0.9rem 1.1rem;margin:1.6rem 0;position:relative;}
.local-tip::before{content:'💡';font-size:1.05rem;flex-shrink:0;margin-top:0.05rem;}
.local-tip-body{flex:1;}
.local-tip-label{font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:#c9a96e;font-weight:700;margin-bottom:0.3rem;}
.local-tip p{font-size:0.82rem;color:#b0a080;line-height:1.75;margin:0;}
/* Pull quote */
.pull-quote{margin:2rem -0.5rem;padding:1.3rem 1.8rem;border-top:2px solid rgba(201,169,110,0.3);border-bottom:2px solid rgba(201,169,110,0.3);text-align:center;}
.pull-quote p{font-family:'Cormorant Garamond',serif;font-size:1.35rem;font-weight:300;color:#d4c8b0;line-height:1.55;font-style:italic;margin:0;}
.pull-quote cite{display:block;font-size:0.65rem;color:#6a5a3a;letter-spacing:0.12em;text-transform:uppercase;margin-top:0.6rem;font-style:normal;}
/* Atlas Verdict box */
.atlas-verdict{background:rgba(201,169,110,0.06);border:1px solid rgba(201,169,110,0.25);border-radius:12px;padding:1.2rem 1.4rem;margin:2rem 0;position:relative;overflow:hidden;}
.atlas-verdict::before{content:'ATLAS VERDICT';font-size:0.5rem;letter-spacing:0.22em;color:#c9a96e;font-weight:700;display:block;margin-bottom:0.55rem;}
.atlas-verdict-score{position:absolute;top:1.1rem;right:1.2rem;font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;color:#c9a96e;line-height:1;}
.atlas-verdict-score span{font-size:0.7rem;color:#6a5a3a;vertical-align:middle;}
.atlas-verdict p{font-size:0.82rem;color:#b0a080;line-height:1.75;margin:0;}
/* Best-for tag pills */
.best-for{display:flex;flex-wrap:wrap;gap:0.4rem;margin:1rem 0 1.5rem;}
.best-for-label{font-size:0.57rem;letter-spacing:0.14em;text-transform:uppercase;color:#6a5a3a;margin-right:0.2rem;line-height:2;}
.best-for-tag{font-size:0.65rem;padding:0.25rem 0.7rem;background:rgba(201,169,110,0.08);border:1px solid rgba(201,169,110,0.2);border-radius:20px;color:#c9a96e;letter-spacing:0.06em;}
/* Budget bar */
.budget-bar{margin:1rem 0 1.5rem;}
.budget-bar-label{font-size:0.6rem;letter-spacing:0.12em;text-transform:uppercase;color:#6a5a3a;margin-bottom:0.5rem;}
.budget-bar-track{background:rgba(201,169,110,0.1);border-radius:4px;height:6px;overflow:hidden;}
.budget-bar-fill{height:100%;background:linear-gradient(90deg,#c9a96e,#e8c87a);border-radius:4px;transition:width 0.6s ease;}
.budget-bar-range{display:flex;justify-content:space-between;font-size:0.62rem;color:#5a4a2a;margin-top:0.3rem;}
</style>
<script async defer src="https://widget.getyourguide.com/dist/pa.umd.production.min.js" data-gyg-partner-id="TIBSGZK"></script>
</head>`;
}

function logoSvg() {
  return `<svg width="28" height="28" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><circle cx="200" cy="200" r="170" fill="none" stroke="#c9a96e" stroke-width="2.2"/><circle cx="200" cy="200" r="130" fill="none" stroke="#8a6a3a" stroke-width="1"/><circle cx="200" cy="200" r="18" fill="#c9a96e"/></svg>`;
}

// Shared styles for listing pages (also used by buildCommunityIndexPage)
const LISTING_STYLES = `<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#17140f;color:#ede3d2;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;}
a{text-decoration:none;color:inherit;}
img{display:block;width:100%;height:100%;object-fit:cover;}
.blog-nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 3rem;height:64px;background:rgba(23,20,15,0.95);backdrop-filter:blur(16px);border-bottom:1px solid rgba(201,169,110,0.15);}
.blog-nav-logo{font-family:'Cormorant Garamond',serif;font-size:1.45rem;font-weight:600;color:#c9a96e;letter-spacing:0.05em;display:flex;align-items:center;gap:0.6rem;}
.blog-nav-links{display:flex;gap:2rem;list-style:none;}
.blog-nav-links a{color:#8a7960;font-size:0.78rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;transition:color 0.2s;}
.blog-nav-links a:hover,.blog-nav-links a.active{color:#c9a96e;}
.blog-nav-cta{background:#c9a96e;color:#17140f;border:none;padding:0.48rem 1.3rem;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:0.75rem;font-weight:600;cursor:pointer;letter-spacing:0.04em;}
.blog-nav-cta:hover{opacity:0.88;}
@media(max-width:700px){.blog-nav{padding:0 1.2rem;}.blog-nav-links{display:none;}}
.dest-section{padding:3.5rem 3rem 0;}
.section-head-bar{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:1.8rem;padding-bottom:1.2rem;border-bottom:1px solid rgba(201,169,110,0.15);}
.sh-title{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;color:#ede3d2;}
.sh-title em{font-style:italic;color:#c9a96e;}
.sh-link{font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;color:#8a7960;transition:color 0.2s;}
.sh-link:hover{color:#c9a96e;}
.community-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.2rem;margin-top:0;}
.comm-card{background:#1e1a12;border:1px solid rgba(201,169,110,0.15);border-radius:10px;overflow:hidden;transition:border-color 0.2s,background 0.2s;color:inherit;}
.comm-card:hover{border-color:rgba(201,169,110,0.35);background:#242019;}
.comm-img{width:100%;height:180px;object-fit:cover;display:block;}
.comm-body{padding:1rem 1.2rem 1.3rem;}
.comm-dest{font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;color:#c9a96e;margin-bottom:0.4rem;}
.comm-title{font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:500;color:#ede3d2;line-height:1.3;margin-bottom:0.5rem;}
.comm-excerpt{font-size:0.78rem;color:#8a7960;line-height:1.7;margin-bottom:0.6rem;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
.comm-meta{font-size:0.65rem;color:#52473a;}
.community-badge{display:inline-block;background:rgba(100,160,100,0.15);border:1px solid rgba(100,180,100,0.25);color:#8aba8a;font-size:0.6rem;letter-spacing:0.12em;text-transform:uppercase;padding:0.15rem 0.5rem;border-radius:4px;margin-left:0.6rem;vertical-align:middle;}
.write-modal{display:none;position:fixed;inset:0;background:rgba(10,8,5,0.88);z-index:9999;align-items:center;justify-content:center;padding:1.5rem;}
.write-modal.open{display:flex;}
.write-box{background:#1e1a12;border:1px solid rgba(201,169,110,0.25);border-radius:14px;width:100%;max-width:600px;max-height:90vh;overflow-y:auto;padding:2rem 2.2rem;}
.write-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;}
.write-title{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:300;color:#e8dcc8;}
.write-close{background:none;border:none;color:#8a7960;font-size:1.4rem;cursor:pointer;padding:0.2rem 0.5rem;border-radius:4px;}
.write-close:hover{color:#c9a96e;}
.write-author{font-size:0.75rem;color:#6a5a3a;margin-bottom:1.2rem;padding:0.5rem 0.8rem;background:rgba(201,169,110,0.06);border-radius:6px;}
.write-author strong{color:#c9a96e;}
.write-input,.write-textarea{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(201,169,110,0.2);border-radius:8px;padding:0.7rem 1rem;color:#ede5d5;font-size:0.85rem;font-family:'DM Sans',sans-serif;outline:none;margin-bottom:0.75rem;box-sizing:border-box;}
.write-input:focus,.write-textarea:focus{border-color:rgba(201,169,110,0.5);}
.write-textarea{min-height:200px;resize:vertical;line-height:1.7;}
.write-label{font-size:0.68rem;color:#6a5a3a;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.35rem;display:block;}
.write-photo-btn{background:rgba(201,169,110,0.08);border:1px solid rgba(201,169,110,0.25);color:#c9a96e;padding:0.4rem 0.9rem;border-radius:7px;font-size:0.75rem;cursor:pointer;font-family:'DM Sans',sans-serif;margin-bottom:0.5rem;}
.write-submit-btn{background:#c9a96e;color:#1c1914;border:none;padding:0.7rem 1.8rem;border-radius:8px;font-size:0.8rem;font-weight:600;letter-spacing:0.08em;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background 0.2s;margin-top:0.5rem;}
.write-submit-btn:hover{background:#e0c080;}
.write-submit-btn:disabled{opacity:0.6;cursor:default;}
.write-chars{font-size:0.68rem;color:#5a4a2a;text-align:right;margin:-0.5rem 0 0.75rem;}
.blog-nav-write{background:rgba(201,169,110,0.15);border:1px solid rgba(201,169,110,0.4);color:#c9a96e;padding:0.45rem 1rem;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:0.75rem;font-weight:600;cursor:pointer;letter-spacing:0.04em;display:none;align-items:center;gap:0.4rem;margin-right:0.6rem;transition:background 0.2s;}
.blog-nav-write:hover{background:rgba(201,169,110,0.28);}
@media(max-width:700px){.dest-section{padding:2.5rem 1.2rem 0;}.community-grid{grid-template-columns:1fr;}.write-box{padding:1.5rem 1.2rem;}}
</style>`;

function buildListingPage(articles, activeCatParam) {
  const hero = articles[0];
  const row1 = articles.slice(1, 3);
  const grid1 = articles.slice(3, 6);
  const row2 = articles.slice(6, 8);
  const grid2 = articles.slice(8, 11);
  const rest = articles.slice(11);
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  function heroDate(a) {
    return new Date(a.date_published).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  }

  function isNew(a) {
    return new Date(a.date_published).getTime() > thirtyDaysAgo;
  }

  function fullRow(a, imgRight) {
    if (!a) return '';
    const d = heroDate(a);
    const newBadge = isNew(a) ? '<span class="new-badge">New</span>' : '';
    const emojiPrefix = a.hero_emoji ? `${a.hero_emoji} ` : '';
    const img = a.cover_image_url
      ? `<div class="afr-image"><img src="${a.cover_image_url}" alt="${a.title}" loading="lazy"/></div>`
      : `<div class="afr-image" style="background:#2a2419;"></div>`;
    const text = `
      <div class="afr-content">
        <div class="afr-issue">${a.category}${newBadge}</div>
        <h2 class="afr-title">${emojiPrefix}${a.title}</h2>
        <p class="afr-excerpt">${a.description}</p>
        <div class="afr-meta"><span>${d}</span><span class="afr-sep"></span><span>${a.read_time}</span></div>
        <div class="afr-link">Read the story <div class="afr-link-line"></div></div>
      </div>`;
    return `<a href="/blog/${a.slug}" class="article-fullrow${imgRight ? '' : ' reverse'}">${imgRight ? text + img : img + text}</a>`;
  }

  function threeGrid(arr) {
    if (!arr.length) return '';
    const cards = arr.map((a, i) => {
      const newBadge = isNew(a) ? '<span class="new-badge">New</span>' : '';
      const emojiPrefix = a.hero_emoji ? `${a.hero_emoji} ` : '';
      return `
      <a href="/blog/${a.slug}" class="sg-card">
        <div class="sg-img">${a.cover_image_url ? `<img src="${a.cover_image_url}" alt="${a.title}" loading="lazy"/>` : ''}<span class="sg-num">0${i+1}</span></div>
        <div class="sg-cat">${a.category}${newBadge}</div>
        <div class="sg-title">${emojiPrefix}${a.title}</div>
        <p class="sg-excerpt">${a.description}</p>
        <div class="sg-meta">${a.read_time} · ${heroDate(a)}</div>
      </a>`;
    }).join('');
    return `<div class="three-grid">${cards}</div>`;
  }

  function restCards(arr) {
    if (!arr.length) return '';
    const cards = arr.map(a => {
      const emojiPrefix = a.hero_emoji ? `${a.hero_emoji} ` : '';
      const newBadge = isNew(a) ? '<span class="new-badge">New</span>' : '';
      return `
      <a href="/blog/${a.slug}" class="rest-card">
        <div class="rest-img">${a.cover_image_url ? `<img src="${a.cover_image_url}" alt="${a.title}" loading="lazy"/>` : ''}</div>
        <div class="rest-body">
          <div class="rest-cat">${a.category}${newBadge}</div>
          <div class="rest-title">${emojiPrefix}${a.title}</div>
          <div class="rest-meta">${a.read_time} · ${heroDate(a)}</div>
        </div>
      </a>`;
    }).join('');
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
  const totalCount = articles.length;

  const catBar = `
  <nav class="cat-bar">
    <a href="/blog" class="cat-pill${!activeCat ? ' active' : ''}">All Stories</a>

    <div class="cat-pill-wrap">
      <a href="/blog?cat=southasia" class="cat-pill${activeCat==='southasia' ? ' active' : ''}">South Asia <span class="cat-arrow">▾</span></a>
      <div class="cat-drop">
        <a href="/blog?cat=southasia" class="cat-drop-item cat-drop-all">All South Asia articles →</a>
        <div class="cat-drop-divider"></div>
        <a href="/plan/dhaka" class="cat-drop-item">🇧🇩 Bangladesh</a>
        <a href="/plan/coxs-bazar" class="cat-drop-item">🏖 Cox's Bazar</a>
        <a href="/plan/maldives" class="cat-drop-item">🇲🇻 Maldives</a>
        <a href="/plan/kathmandu" class="cat-drop-item">🇳🇵 Nepal</a>
        <a href="/plan/delhi" class="cat-drop-item">🇮🇳 India</a>
        <a href="/plan/colombo" class="cat-drop-item">🇱🇰 Sri Lanka</a>
      </div>
    </div>

    <div class="cat-pill-wrap">
      <a href="/blog?cat=eastasia" class="cat-pill${activeCat==='eastasia' ? ' active' : ''}">East Asia <span class="cat-arrow">▾</span></a>
      <div class="cat-drop">
        <a href="/blog?cat=eastasia" class="cat-drop-item cat-drop-all">All East Asia articles →</a>
        <div class="cat-drop-divider"></div>
        <a href="/plan/tokyo" class="cat-drop-item">🇯🇵 Japan</a>
        <a href="/plan/bali" class="cat-drop-item">🇮🇩 Bali</a>
        <a href="/plan/singapore" class="cat-drop-item">🇸🇬 Singapore</a>
        <a href="/plan/bangkok" class="cat-drop-item">🇹🇭 Thailand</a>
        <a href="/plan/seoul" class="cat-drop-item">🇰🇷 South Korea</a>
        <a href="/plan/tokyo" class="cat-drop-item">🇯🇵 Tokyo</a>
      </div>
    </div>

    <div class="cat-pill-wrap">
      <a href="/blog?cat=europe" class="cat-pill${activeCat==='europe' ? ' active' : ''}">Europe &amp; ME <span class="cat-arrow">▾</span></a>
      <div class="cat-drop">
        <a href="/blog?cat=europe" class="cat-drop-item cat-drop-all">All Europe &amp; ME articles →</a>
        <div class="cat-drop-divider"></div>
        <a href="/plan/istanbul" class="cat-drop-item">🇹🇷 Istanbul</a>
        <a href="/plan/paris" class="cat-drop-item">🇫🇷 Paris</a>
        <a href="/plan/rome" class="cat-drop-item">🇮🇹 Rome</a>
        <a href="/plan/barcelona" class="cat-drop-item">🇪🇸 Barcelona</a>
        <a href="/plan/dubai" class="cat-drop-item">🇦🇪 Dubai</a>
      </div>
    </div>

    <a href="/blog?cat=tips" class="cat-pill${activeCat==='tips' ? ' active' : ''}">Tips &amp; Visa</a>
    <a href="/blog?cat=community" class="cat-pill${activeCat==='community' ? ' active' : ''}">Community ✍️</a>
  </nav>`;

  const destGrid = `
  <section class="dest-section">
    <div class="section-head-bar">
      <h2 class="sh-title">Browse by <em>Destination</em></h2>
      <span class="articles-count">${activeCat ? `<a href="/blog" class="sh-link">← All ${totalCount} articles</a>` : `${totalCount} articles`}</span>
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

  const listingStyles = `<style>
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
@media(max-width:800px){.three-grid{grid-template-columns:1fr 1fr;}.sg-card{border-right:none;border-bottom:1px solid rgba(201,169,110,0.12);padding:1.8rem 1.5rem;}.sg-card:nth-child(odd){border-right:1px solid rgba(201,169,110,0.12);}}
@media(max-width:500px){.three-grid{grid-template-columns:1fr;}.sg-card:nth-child(odd){border-right:none;}}

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

/* WRITE BUTTON */
.blog-nav-write{background:rgba(201,169,110,0.15);border:1px solid rgba(201,169,110,0.4);color:#c9a96e;padding:0.45rem 1rem;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:0.75rem;font-weight:600;cursor:pointer;letter-spacing:0.04em;display:none;align-items:center;gap:0.4rem;margin-right:0.6rem;transition:background 0.2s;}
.blog-nav-write:hover{background:rgba(201,169,110,0.28);}

/* COMMUNITY SECTION */
.community-section{padding:3rem 3rem 2.5rem;display:none;}
.community-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.2rem;margin-top:1.5rem;}
.comm-card{background:#1e1a12;border:1px solid rgba(201,169,110,0.15);border-radius:10px;overflow:hidden;transition:border-color 0.2s,background 0.2s;}
.comm-card:hover{border-color:rgba(201,169,110,0.35);}
.comm-img{width:100%;height:150px;object-fit:cover;display:block;}
.comm-body{padding:1rem 1.2rem 1.3rem;}
.comm-dest{font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;color:#c9a96e;margin-bottom:0.4rem;}
.comm-title{font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:500;color:#ede3d2;line-height:1.3;margin-bottom:0.5rem;}
.comm-excerpt{font-size:0.78rem;color:#8a7960;line-height:1.7;margin-bottom:0.6rem;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
.comm-meta{font-size:0.65rem;color:#52473a;}
.community-badge{display:inline-block;background:rgba(100,160,100,0.15);border:1px solid rgba(100,180,100,0.25);color:#8aba8a;font-size:0.6rem;letter-spacing:0.12em;text-transform:uppercase;padding:0.15rem 0.5rem;border-radius:4px;margin-left:0.6rem;vertical-align:middle;}
@media(max-width:700px){.community-section{padding:2.5rem 1.2rem;}.community-grid{grid-template-columns:1fr;}}

/* WRITE MODAL */
.write-modal{display:none;position:fixed;inset:0;background:rgba(10,8,5,0.88);z-index:9999;align-items:center;justify-content:center;padding:1.5rem;}
.write-modal.open{display:flex;}
.write-box{background:#1e1a12;border:1px solid rgba(201,169,110,0.25);border-radius:14px;width:100%;max-width:600px;max-height:90vh;overflow-y:auto;padding:2rem 2.2rem;}
.write-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;}
.write-title{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:300;color:#e8dcc8;}
.write-close{background:none;border:none;color:#8a7960;font-size:1.4rem;cursor:pointer;padding:0.2rem 0.5rem;border-radius:4px;}
.write-close:hover{color:#c9a96e;}
.write-author{font-size:0.75rem;color:#6a5a3a;margin-bottom:1.2rem;padding:0.5rem 0.8rem;background:rgba(201,169,110,0.06);border-radius:6px;}
.write-author strong{color:#c9a96e;}
.write-input,.write-textarea{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(201,169,110,0.2);border-radius:8px;padding:0.7rem 1rem;color:#ede5d5;font-size:0.85rem;font-family:'DM Sans',sans-serif;outline:none;margin-bottom:0.75rem;box-sizing:border-box;}
.write-input:focus,.write-textarea:focus{border-color:rgba(201,169,110,0.5);}
.write-textarea{min-height:200px;resize:vertical;line-height:1.7;}
.write-label{font-size:0.68rem;color:#6a5a3a;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.35rem;display:block;}
.write-photo-btn{background:rgba(201,169,110,0.08);border:1px solid rgba(201,169,110,0.25);color:#c9a96e;padding:0.4rem 0.9rem;border-radius:7px;font-size:0.75rem;cursor:pointer;font-family:'DM Sans',sans-serif;margin-bottom:0.5rem;}
.write-submit-btn{background:#c9a96e;color:#1c1914;border:none;padding:0.7rem 1.8rem;border-radius:8px;font-size:0.8rem;font-weight:600;letter-spacing:0.08em;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background 0.2s;margin-top:0.5rem;}
.write-submit-btn:hover{background:#e0c080;}
.write-submit-btn:disabled{opacity:0.6;cursor:default;}
.write-chars{font-size:0.68rem;color:#5a4a2a;text-align:right;margin:-0.5rem 0 0.75rem;}
@media(max-width:500px){.write-box{padding:1.5rem 1.2rem;}}

/* MEGA MENU NAV */
.blog-nav{overflow:visible;}
.nav-dest-item{position:static;list-style:none;}
.nav-dest-trigger{color:#8a7960;font-size:0.78rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;display:flex;align-items:center;gap:0.3rem;transition:color 0.2s;user-select:none;}
.nav-dest-trigger:hover,.nav-dest-trigger.active{color:#c9a96e;}
.nav-arrow{font-size:0.5rem;opacity:0.4;transition:transform 0.25s,opacity 0.2s;}
.nav-dest-item:hover .nav-arrow,.nav-dest-item.open .nav-arrow{opacity:1;transform:rotate(180deg);}
.nav-dest-item:hover .nav-dest-trigger,.nav-dest-item.open .nav-dest-trigger{color:#c9a96e;}
.mega-panel{position:absolute;top:64px;left:0;right:0;background:#1a1610;border-bottom:1px solid rgba(201,169,110,0.15);padding:2rem 4rem 2.5rem;display:none;z-index:200;box-shadow:0 24px 64px rgba(0,0,0,0.7);}
.nav-dest-item:hover .mega-panel,.nav-dest-item.open .mega-panel{display:block;}
.mega-inner{display:grid;grid-template-columns:repeat(7,1fr);gap:0;max-width:1380px;margin:0 auto;}
.mega-col{padding:0 1.2rem;border-right:1px solid rgba(201,169,110,0.07);}
.mega-col:first-child{padding-left:0;}
.mega-col:last-child{border-right:none;padding-right:0;}
.mega-continent{font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;color:#c9a96e;font-weight:600;margin-bottom:0.5rem;display:flex;align-items:center;gap:0.4rem;}
.mega-continent-icon{font-size:0.85rem;}
.mega-region-title{font-size:0.52rem;letter-spacing:0.18em;text-transform:uppercase;color:#4a3a1a;font-weight:600;margin:0.65rem 0 0.5rem;padding-bottom:0.4rem;border-bottom:1px solid rgba(201,169,110,0.08);}
.mega-region-title:first-of-type{margin-top:0;}
.mega-link{display:flex;align-items:center;gap:0.45rem;padding:0.28rem 0;font-size:0.73rem;color:#8a7960;transition:color 0.15s;white-space:nowrap;}
.mega-link:hover{color:#e8dcc8;}
.mega-link-flag{font-size:0.9rem;line-height:1;}
.mega-coming{font-size:0.68rem;color:#3a2e1a;font-style:italic;padding:0.3rem 0;}
.mega-all{display:inline-flex;align-items:center;gap:0.35rem;margin-top:0.8rem;padding-top:0.5rem;border-top:1px solid rgba(201,169,110,0.08);font-size:0.58rem;letter-spacing:0.1em;text-transform:uppercase;color:#c9a96e;transition:color 0.15s;}
.mega-all:hover{color:#e0c080;}
@media(max-width:1150px){.mega-panel{padding:1.5rem 2rem 2rem;}.mega-inner{grid-template-columns:repeat(4,1fr);gap:0;}.mega-col{border-right:none;border-bottom:1px solid rgba(201,169,110,0.07);padding:1rem 1.2rem;}.mega-col:nth-child(4n){border-right:none;}.mega-col:nth-last-child(-n+4):nth-child(4n+1),.mega-col:nth-last-child(-n+3),.mega-col:nth-last-child(-n+2),.mega-col:last-child{border-bottom:none;}}
@media(max-width:750px){.mega-panel{display:none !important;}}

/* NEW BADGE */
.new-badge{display:inline-block;background:rgba(100,200,120,0.12);border:1px solid rgba(100,200,120,0.28);color:#7aba7a;font-size:0.54rem;letter-spacing:0.1em;text-transform:uppercase;padding:0.1rem 0.45rem;border-radius:3px;margin-left:0.5rem;vertical-align:middle;font-family:'DM Sans',sans-serif;}

/* ARTICLE COUNT */
.articles-count{font-size:0.68rem;color:#52473a;letter-spacing:0.08em;}
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
    <li class="nav-dest-item">
      <span class="nav-dest-trigger${activeCat && ['southasia','eastasia','europe','middleeast','americas','africa'].includes(activeCat) ? ' active' : ''}">Destinations <span class="nav-arrow">▾</span></span>
      <div class="mega-panel">
        <div class="mega-inner">

          <!-- SOUTH ASIA -->
          <div class="mega-col">
            <div class="mega-continent"><span class="mega-continent-icon">🌏</span> Asia</div>
            <div class="mega-region-title">South Asia</div>
            <a href="/plan/dhaka" class="mega-link"><span class="mega-link-flag">🇧🇩</span> Bangladesh</a>
            <a href="/plan/coxs-bazar" class="mega-link"><span class="mega-link-flag">🏖</span> Cox's Bazar</a>
            <a href="/plan/maldives" class="mega-link"><span class="mega-link-flag">🇲🇻</span> Maldives</a>
            <a href="/plan/kathmandu" class="mega-link"><span class="mega-link-flag">🇳🇵</span> Nepal</a>
            <a href="/plan/delhi" class="mega-link"><span class="mega-link-flag">🇮🇳</span> India</a>
            <a href="/plan/colombo" class="mega-link"><span class="mega-link-flag">🇱🇰</span> Sri Lanka</a>
            <a href="/blog?cat=southasia" class="mega-all">All South Asia →</a>
          </div>

          <!-- EAST ASIA -->
          <div class="mega-col">
            <div class="mega-continent" style="opacity:0;pointer-events:none;">·</div>
            <div class="mega-region-title">East Asia</div>
            <a href="/plan/tokyo" class="mega-link"><span class="mega-link-flag">🇯🇵</span> Japan</a>
            <a href="/plan/bali" class="mega-link"><span class="mega-link-flag">🇮🇩</span> Bali</a>
            <a href="/plan/singapore" class="mega-link"><span class="mega-link-flag">🇸🇬</span> Singapore</a>
            <a href="/plan/bangkok" class="mega-link"><span class="mega-link-flag">🇹🇭</span> Thailand</a>
            <a href="/plan/seoul" class="mega-link"><span class="mega-link-flag">🇰🇷</span> South Korea</a>
            <a href="/plan/hanoi" class="mega-link"><span class="mega-link-flag">🇻🇳</span> Vietnam</a>
            <a href="/blog?cat=eastasia" class="mega-all">All East Asia →</a>
          </div>

          <!-- EUROPE -->
          <div class="mega-col">
            <div class="mega-continent"><span class="mega-continent-icon">🌍</span> Europe</div>
            <div class="mega-region-title">Western Europe</div>
            <a href="/plan/paris" class="mega-link"><span class="mega-link-flag">🇫🇷</span> France</a>
            <a href="/plan/rome" class="mega-link"><span class="mega-link-flag">🇮🇹</span> Italy</a>
            <a href="/plan/barcelona" class="mega-link"><span class="mega-link-flag">🇪🇸</span> Spain</a>
            <a href="/plan/london" class="mega-link"><span class="mega-link-flag">🇬🇧</span> UK</a>
            <a href="/plan/amsterdam" class="mega-link"><span class="mega-link-flag">🇳🇱</span> Netherlands</a>
            <a href="/blog?cat=europe" class="mega-all">All Europe →</a>
          </div>

          <!-- MIDDLE EAST -->
          <div class="mega-col">
            <div class="mega-continent"><span class="mega-continent-icon">🌙</span> Middle East</div>
            <div class="mega-region-title">Gulf &amp; Levant</div>
            <a href="/plan/dubai" class="mega-link"><span class="mega-link-flag">🇦🇪</span> Dubai</a>
            <a href="/plan/istanbul" class="mega-link"><span class="mega-link-flag">🇹🇷</span> Turkey</a>
            <a href="/plan/jordan" class="mega-link"><span class="mega-link-flag">🇯🇴</span> Jordan</a>
            <a href="/plan/riyadh" class="mega-link"><span class="mega-link-flag">🇸🇦</span> Saudi Arabia</a>
            <a href="/plan/doha" class="mega-link"><span class="mega-link-flag">🇶🇦</span> Qatar</a>
            <a href="/blog?cat=middleeast" class="mega-all">All Middle East →</a>
          </div>

          <!-- AMERICAS -->
          <div class="mega-col">
            <div class="mega-continent"><span class="mega-continent-icon">🌎</span> Americas</div>
            <div class="mega-region-title">North America</div>
            <a href="/blog/banff-canada-travel-guide" class="mega-link"><span class="mega-link-flag">🇨🇦</span> Canada / Banff</a>
            <a href="/plan/new-york" class="mega-link"><span class="mega-link-flag">🇺🇸</span> New York</a>
            <a href="/plan/los-angeles" class="mega-link"><span class="mega-link-flag">🇺🇸</span> Los Angeles</a>
            <a href="/plan/mexico-city" class="mega-link"><span class="mega-link-flag">🇲🇽</span> Mexico</a>
            <div class="mega-region-title">South America</div>
            <a href="/plan/rio" class="mega-link"><span class="mega-link-flag">🇧🇷</span> Brazil</a>
            <a href="/plan/bogota" class="mega-link"><span class="mega-link-flag">🇨🇴</span> Colombia</a>
            <a href="/blog?cat=americas" class="mega-all">All Americas →</a>
          </div>

          <!-- AFRICA -->
          <div class="mega-col">
            <div class="mega-continent"><span class="mega-continent-icon">🌍</span> Africa</div>
            <div class="mega-region-title">North Africa</div>
            <a href="/plan/marrakech" class="mega-link"><span class="mega-link-flag">🇲🇦</span> Morocco</a>
            <a href="/plan/cairo" class="mega-link"><span class="mega-link-flag">🇪🇬</span> Egypt</a>
            <div class="mega-region-title">East &amp; Southern</div>
            <a href="/plan/cape-town" class="mega-link"><span class="mega-link-flag">🇿🇦</span> South Africa</a>
            <a href="/plan/nairobi" class="mega-link"><span class="mega-link-flag">🇰🇪</span> Kenya</a>
            <a href="/plan/tanzania" class="mega-link"><span class="mega-link-flag">🇹🇿</span> Tanzania</a>
            <a href="/blog?cat=africa" class="mega-all">All Africa →</a>
          </div>

          <!-- OCEANIA -->
          <div class="mega-col">
            <div class="mega-continent"><span class="mega-continent-icon">🌏</span> Oceania</div>
            <div class="mega-region-title">Australia &amp; Pacific</div>
            <a href="/plan/sydney" class="mega-link"><span class="mega-link-flag">🇦🇺</span> Australia</a>
            <a href="/plan/auckland" class="mega-link"><span class="mega-link-flag">🇳🇿</span> New Zealand</a>
            <a href="/plan/fiji" class="mega-link"><span class="mega-link-flag">🇫🇯</span> Fiji</a>
            <a href="/plan/bali" class="mega-link"><span class="mega-link-flag">🇮🇩</span> Bali</a>
            <a href="/plan/phuket" class="mega-link"><span class="mega-link-flag">🇹🇭</span> Phuket</a>
            <a href="/blog?cat=oceania" class="mega-all">All Oceania →</a>
          </div>

        </div>
      </div>
    </li>
    <li><a href="/blog?cat=tips"${activeCat==='tips' ? ' class="active"' : ''}>Tips &amp; Visa</a></li>
    <li><a href="/blog?cat=community"${activeCat==='community' ? ' class="active"' : ''}>Community ✍️</a></li>
  </ul>
  <button id="write-btn" class="blog-nav-write" onclick="openWriteModal()" style="display:inline-flex;">✍️ Write</button>
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

${rest.length ? `<div class="rest-section"><div class="section-head-bar" style="margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:1px solid rgba(201,169,110,0.12);"><h2 class="sh-title">All <em>Articles</em></h2><span class="articles-count">${rest.length + 11} total</span></div>${restCards(rest)}</div>` : ''}

<!-- COMMUNITY STORIES -->
<div class="community-section" id="community-section">
  <div class="sec-divider-bar" style="padding-bottom:1.2rem;border-bottom:1px solid rgba(201,169,110,0.15);margin-bottom:0;">
    <h2 class="sh-title">Community <em>Stories</em> <span class="community-badge">Traveller-written</span></h2>
    <button id="write-btn-2" onclick="openWriteModal()" style="display:none;background:rgba(201,169,110,0.12);border:1px solid rgba(201,169,110,0.3);color:#c9a96e;padding:0.4rem 1rem;border-radius:6px;font-size:0.75rem;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;">✍️ Share Your Story</button>
  </div>
  <div class="community-grid" id="community-grid"></div>
</div>

<!-- WRITE STORY MODAL -->
<div class="write-modal" id="write-modal" onclick="if(event.target===this)closeWriteModal()">
  <div class="write-box">

    <!-- STEP 1: Sign in (shown when not logged in) -->
    <div id="ws-auth-step">
      <div class="write-header">
        <div class="write-title">Share Your Story</div>
        <button class="write-close" onclick="closeWriteModal()">✕</button>
      </div>
      <p style="font-size:0.85rem;color:#8a7a60;margin-bottom:1.5rem;line-height:1.7;">Sign in to share your travel story with the Atlas community — tips, itineraries, visa experiences, hidden gems.</p>
      <button id="ws-google-btn" onclick="signInWithGoogle()" style="width:100%;display:flex;align-items:center;justify-content:center;gap:0.75rem;background:#fff;color:#1c1914;border:none;border-radius:8px;padding:0.75rem 1.2rem;font-size:0.9rem;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;margin-bottom:1.2rem;transition:opacity 0.2s;">
        <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/></svg>
        Continue with Google
      </button>
      <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.2rem;">
        <div style="flex:1;height:1px;background:rgba(201,169,110,0.15);"></div>
        <span style="font-size:0.7rem;color:#5a4a2a;letter-spacing:0.08em;">OR</span>
        <div style="flex:1;height:1px;background:rgba(201,169,110,0.15);"></div>
      </div>
      <label class="write-label">Sign in with email</label>
      <input type="email" id="ws-magic-email" class="write-input" placeholder="your@email.com"/>
      <button id="ws-magic-btn" onclick="signInWithMagicLink()" class="write-submit-btn" style="width:100%;text-align:center;">Send Magic Link →</button>
      <div id="ws-magic-msg" style="display:none;margin-top:0.75rem;font-size:0.82rem;"></div>
    </div>

    <!-- STEP 2: Write form (shown when logged in) -->
    <div id="ws-write-form" style="display:none;">
      <div class="write-header">
        <div class="write-title">Share Your Travel Story</div>
        <button class="write-close" onclick="closeWriteModal()">✕</button>
      </div>
      <div class="write-author">Writing as <strong id="write-author-name"></strong></div>
      <label class="write-label">Title *</label>
      <input type="text" id="ws-title" class="write-input" placeholder="e.g. 10 Days in Bali on a Budget — What I Actually Spent" maxlength="200"/>
      <label class="write-label">Destination (optional)</label>
      <input type="text" id="ws-dest" class="write-input" placeholder="e.g. Bali, Indonesia"/>
      <label class="write-label">Your Story * <span style="color:#5a4a2a;font-size:0.65rem;text-transform:none;">(min 100 characters)</span></label>
      <textarea id="ws-content" class="write-textarea" placeholder="Write your travel experience, tips, hidden gems, visa advice, budget breakdown — anything that would help fellow travellers..." maxlength="15000" oninput="document.getElementById('ws-chars').textContent=this.value.length"></textarea>
      <div class="write-chars"><span id="ws-chars">0</span>/15000</div>
      <label class="write-label">Photos — up to 3 (optional)</label>
      <div style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:0.75rem;">
        ${[0,1,2].map(i => `
        <div>
          <button type="button" class="write-photo-btn" onclick="document.getElementById('ws-photo-input-${i}').click()">${i===0?'📷 Cover Photo':'📷 Photo '+(i+1)}</button>
          <span id="ws-photo-status-${i}" style="font-size:0.75rem;margin-left:0.5rem;color:#c9a96e;"></span>
          <input type="file" id="ws-photo-input-${i}" accept="image/jpeg,image/jpg,image/png,image/webp" style="display:none;" onchange="uploadStoryPhoto(this,${i})"/>
          <input type="hidden" id="ws-photo-url-${i}" value=""/>
          <div id="ws-photo-preview-wrap-${i}" style="display:none;margin-top:0.4rem;">
            <img id="ws-photo-preview-${i}" src="" style="max-height:120px;border-radius:8px;border:1px solid rgba(201,169,110,0.2);"/>
            <button onclick="removeStoryPhoto(${i})" style="display:block;margin-top:0.25rem;background:none;border:none;color:#c08060;font-size:0.72rem;cursor:pointer;">✕ Remove</button>
          </div>
        </div>`).join('')}
      </div>
      <p style="font-size:0.72rem;color:#5a4a2a;margin-bottom:1rem;line-height:1.6;">Your story will be reviewed before it goes live — usually within 24 hours.</p>
      <button class="write-submit-btn" id="ws-submit-btn" onclick="submitStory()">Submit Story →</button>
      <div id="ws-msg" style="display:none;margin-top:0.75rem;font-size:0.82rem;"></div>
    </div>

  </div>
</div>

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
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
<script>
// Newsletter
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

// ── Supabase client for blog auth ─────────────────────────────────────────
var _sb=window.supabase.createClient(
  'https://prffhhkemxibujjjiyhg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByZmZoaGtlbXhpYnVqamppeWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NzYwMDIsImV4cCI6MjA5MDM1MjAwMn0.Tqxz_6EHwv4oWA9NvPSRK1uC7HJ1_chhFjZGg2PRhiE'
);
var _blogUser=null;

function _setUser(session){
  if(!session||!session.user) return;
  var u=session.user;
  _blogUser={
    id:u.id,email:u.email,token:session.access_token,
    name:(u.user_metadata&&(u.user_metadata.full_name||u.user_metadata.name))||u.email.split('@')[0]||'Traveller'
  };
  var wb=document.getElementById('write-btn');
  if(wb) wb.textContent='✍️ '+_blogUser.name.split(' ')[0];
  var el=document.getElementById('write-author-name');
  if(el) el.textContent=_blogUser.name+' ('+_blogUser.email+')';
}

async function initBlogAuth(){
  var {data:{session}}=await _sb.auth.getSession();
  _setUser(session);
  loadCommunityPosts();
  // Listen for sign-in after OAuth/magic link redirect
  _sb.auth.onAuthStateChange(function(event,sess){
    if(event==='SIGNED_IN'&&sess){
      _setUser(sess);
      // If modal is open, switch to write form
      var modal=document.getElementById('write-modal');
      if(modal&&modal.style.display==='flex') showWriteForm();
    }
  });
}

// ── Write Story Modal ──────────────────────────────────────────────────────
function openWriteModal(){
  document.getElementById('write-modal').style.display='flex';
  document.body.style.overflow='hidden';
  if(_blogUser) showWriteForm(); else showAuthStep();
}
function closeWriteModal(){
  document.getElementById('write-modal').style.display='none';
  document.body.style.overflow='';
}
function showAuthStep(){
  document.getElementById('ws-auth-step').style.display='';
  document.getElementById('ws-write-form').style.display='none';
}
function showWriteForm(){
  document.getElementById('ws-auth-step').style.display='none';
  document.getElementById('ws-write-form').style.display='';
}

async function signInWithGoogle(){
  var btn=document.getElementById('ws-google-btn');
  btn.disabled=true;btn.textContent='Opening Google sign in...';
  await _sb.auth.signInWithOAuth({
    provider:'google',
    options:{redirectTo:window.location.href}
  });
}

async function signInWithMagicLink(){
  var email=document.getElementById('ws-magic-email').value.trim();
  var msg=document.getElementById('ws-magic-msg');
  if(!email||!email.includes('@')){msg.style.color='#e08060';msg.textContent='Please enter a valid email.';msg.style.display='';return;}
  var btn=document.getElementById('ws-magic-btn');
  btn.disabled=true;btn.textContent='Sending...';
  var {error}=await _sb.auth.signInWithOtp({email,options:{emailRedirectTo:window.location.href}});
  msg.style.display='';
  if(error){
    msg.style.color='#e08060';msg.textContent='✗ '+error.message;
    btn.disabled=false;btn.textContent='Send Magic Link →';
  }else{
    msg.style.color='#6aaa7a';
    msg.textContent='✓ Check your email — click the link to come back and start writing.';
    btn.textContent='Email sent ✓';
  }
}

async function submitStory(){
  if(!_blogUser) return;
  var title=document.getElementById('ws-title').value.trim();
  var content=document.getElementById('ws-content').value.trim();
  var destination=document.getElementById('ws-dest').value.trim();
  var photos=[0,1,2].map(function(i){return document.getElementById('ws-photo-url-'+i).value;}).filter(Boolean);
  var msg=document.getElementById('ws-msg');
  var btn=document.getElementById('ws-submit-btn');
  if(!title){msg.style.color='#e08060';msg.textContent='Please add a title.';msg.style.display='';return;}
  if(content.length<100){msg.style.color='#e08060';msg.textContent='Story should be at least 100 characters.';msg.style.display='';return;}
  btn.disabled=true;btn.textContent='Submitting...';
  try{
    var r=await fetch('/api/blog?action=submit_post',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+_blogUser.token},
      body:JSON.stringify({title,content,destination:destination||null,photos:photos.length?photos:null})
    });
    var d=await r.json();
    if(!r.ok) throw new Error(d.error||'Failed to submit');
    msg.style.color='#6aaa7a';
    msg.textContent='✓ Story submitted! It will appear after a quick review (usually within 24h).';
    msg.style.display='';
    document.getElementById('ws-title').value='';
    document.getElementById('ws-content').value='';
    document.getElementById('ws-dest').value='';
    document.getElementById('ws-chars').textContent='0';
    [0,1,2].forEach(function(i){removeStoryPhoto(i);});
    setTimeout(closeWriteModal,3000);
  }catch(e){
    msg.style.color='#e08060';msg.textContent='✗ '+e.message;msg.style.display='';
  }
  btn.disabled=false;btn.textContent='Submit Story →';
}

async function uploadStoryPhoto(input,slot){
  if(!input.files||!input.files[0]) return;
  var file=input.files[0];
  if(file.size>5*1024*1024){alert('Photo too large (max 5MB)');return;}
  var status=document.getElementById('ws-photo-status-'+slot);
  status.textContent='Uploading...';status.style.color='#c9a96e';
  var reader=new FileReader();
  reader.onload=async function(e){
    try{
      var base64=e.target.result.split(',')[1];
      var r=await fetch('/api/admin?section=upload',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({base64,filename:file.name,mimeType:file.type,uploadType:'community'})
      });
      var d=await r.json();
      if(d.url){
        document.getElementById('ws-photo-url-'+slot).value=d.url;
        document.getElementById('ws-photo-preview-'+slot).src=d.url;
        document.getElementById('ws-photo-preview-wrap-'+slot).style.display='';
        status.textContent='✓ Uploaded';status.style.color='#6aaa7a';
      }else{throw new Error(d.error||'Upload failed');}
    }catch(err){status.textContent='✗ '+err.message;status.style.color='#e08060';}
  };
  reader.readAsDataURL(file);
}

function removeStoryPhoto(slot){
  document.getElementById('ws-photo-url-'+slot).value='';
  document.getElementById('ws-photo-preview-wrap-'+slot).style.display='none';
  document.getElementById('ws-photo-status-'+slot).textContent='';
  document.getElementById('ws-photo-input-'+slot).value='';
}

// ── Community Posts ────────────────────────────────────────────────────────
function escHtml(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

async function loadCommunityPosts(){
  try{
    var r=await fetch('/api/blog?action=community_posts');
    var d=await r.json();
    var posts=d.posts||[];
    var section=document.getElementById('community-section');
    if(!posts.length||!section) return;
    section.style.display='';
    var grid=document.getElementById('community-grid');
    grid.innerHTML=posts.map(function(p){
      var date=new Date(p.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
      var excerpt=p.excerpt||(p.content?p.content.slice(0,160)+'...':'');
      var coverPhoto=p.cover_photo||(p.photos&&p.photos[0])||null;
      var href=p.slug?'/blog/'+p.slug:'#';
      var tag=p.slug?'a':'div';
      return '<'+tag+(p.slug?' href="'+escHtml(href)+'"':'')+' class="comm-card" style="display:block;text-decoration:none;">'
        +(coverPhoto?'<img src="'+escHtml(coverPhoto)+'" class="comm-img" loading="lazy"/>':'')
        +'<div class="comm-body">'
        +(p.destination?'<div class="comm-dest">✈️ '+escHtml(p.destination)+'</div>':'')
        +'<div class="comm-title">'+escHtml(p.title)+'</div>'
        +'<div class="comm-excerpt">'+escHtml(excerpt)+'</div>'
        +'<div class="comm-meta">By '+escHtml(p.user_name)+' · '+date+'</div>'
        +'</div>'
        +'</'+tag+'>';
    }).join('');
  }catch(e){}
}

window.addEventListener('DOMContentLoaded',initBlogAuth);

// Mega-menu — click/tap to toggle on mobile/tablet; hover handled by CSS on desktop
(function(){
  var item=document.querySelector('.nav-dest-item');
  if(!item)return;
  var trigger=item.querySelector('.nav-dest-trigger');
  if(!trigger)return;
  trigger.addEventListener('click',function(e){
    e.stopPropagation();
    item.classList.toggle('open');
  });
  document.addEventListener('click',function(e){
    if(!e.target.closest('.nav-dest-item'))item.classList.remove('open');
  });
})();
</script>
</body></html>`;
}

function buildArticlePage(slug, article, relatedPosts = []) {
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
  </div>
  <div class="visa-disclaimer">
    <span class="visa-disclaimer-icon">⚠️</span>
    <span><strong>Visa rules vary by passport.</strong> The info above is a general overview — requirements differ significantly by nationality. Use <a href="/" style="color:#c9a96e;">Atlas AI</a> to get accurate visa rules for your specific passport.</span>
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

  // Inject inline photos — uses [photo-N] markers if present, otherwise auto-distributes between H2 sections
  function injectInlinePhotos(html, photos) {
    if (!photos || !photos.length) return html;
    const validPhotos = photos.filter(Boolean);
    if (!validPhotos.length) return html;
    // If explicit markers exist, replace them
    const makeImg = (url) => `<img src="${url}" alt="" class="inline-img" loading="lazy" onerror="this.style.display='none'"/>`;
    if (/\[photo-\d+\]/i.test(html)) {
      return html.replace(/\[photo-(\d+)\]/gi, (match, num) => {
        const idx = parseInt(num) - 1;
        if (idx >= 0 && idx < validPhotos.length && validPhotos[idx]) {
          return makeImg(validPhotos[idx]);
        }
        return '';
      });
    }
    // Auto-distribute: insert a photo after every Nth H2 closing tag
    // Distribute photos as evenly as possible across H2 sections
    const h2Count = (html.match(/<\/h2>/gi) || []).length;
    if (h2Count === 0) {
      // No H2s — just prepend photos at start
      return validPhotos.map(u => makeImg(u)).join('') + html;
    }
    const interval = Math.max(1, Math.floor(h2Count / Math.min(validPhotos.length, h2Count)));
    let photoIdx = 0;
    let h2Seen = 0;
    return html.replace(/<\/h2>/gi, (match) => {
      h2Seen++;
      if (photoIdx < validPhotos.length && h2Seen % interval === 0) {
        const img = makeImg(validPhotos[photoIdx]);
        photoIdx++;
        return match + img;
      }
      return match;
    });
  }

  const inlinePhotos = Array.isArray(article.inline_photos) ? article.inline_photos : [];
  const enrichedContent = injectInlinePhotos(article.content || '', inlinePhotos);

  const contentHtml = hasMultiLang
    ? LANGS.map((l, i) => {
        const enriched = l.code === 'en' ? injectInlinePhotos(l.content || '', inlinePhotos) : l.content;
        return `<div id="content-${l.code}" class="article-body"${i>0?' style="display:none"':''}${l.rtl?' dir="rtl"':''}>${enriched}</div>`;
      }).join('\n')
    : `<div class="article-body">${enrichedContent}</div>`;

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
<div id="read-progress"></div>
<div class="toc-sidebar" id="toc-sidebar"></div>
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
  ${langToggle}
  ${highlightsHtml}
  ${keyFactsHtml}
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

  <!-- Share Buttons -->
  <div class="share-section">
    <div class="share-label">Share this article</div>
    <div class="share-btns">
      <a class="share-btn share-wa" href="https://wa.me/?text=${encodeURIComponent(article.title + ' — ' + 'https://getatlas.ca/blog/' + slug)}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.106 1.508 5.836L0 24l6.335-1.652A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.368l-.36-.214-3.727.977.993-3.62-.235-.374A9.818 9.818 0 1112 21.818z"/></svg>
        WhatsApp
      </a>
      <a class="share-btn share-fb" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://getatlas.ca/blog/' + slug)}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        Facebook
      </a>
      <a class="share-btn share-tw" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent('https://getatlas.ca/blog/' + slug)}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        X / Twitter
      </a>
      <button class="share-btn share-copy" onclick="copyLink()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
        <span id="copy-label">Copy Link</span>
      </button>
    </div>
  </div>

  <!-- Related Blog Posts -->
  ${relatedPosts.length > 0 ? `<div class="related-posts-section">
    <h3 class="related-posts-title">Read More</h3>
    <div class="articles-grid">
      ${relatedPosts.map(p => {
        const pDate = new Date(p.date_published).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const pCat = (p.category || 'travel').replace(/-/g, ' ');
        return `<a href="/blog/${p.slug}" class="article-card">
          ${p.cover_image_url ? `<img src="${p.cover_image_url}" alt="${p.title}" class="card-img" loading="lazy"/>` : ''}
          <div style="padding:0.85rem 1rem 1rem;">
            <div class="card-top"><span class="card-emoji">${p.hero_emoji || '✈️'}</span><span class="card-title">${p.title}</span></div>
            <p class="card-desc">${(p.description || '').slice(0, 110)}${(p.description || '').length > 110 ? '…' : ''}</p>
            <div class="card-meta"><span>${pDate}</span><span>·</span><span>${pCat}</span>${p.read_time ? `<span>·</span><span>${p.read_time}</span>` : ''}</div>
          </div>
        </a>`;
      }).join('')}
    </div>
  </div>` : ''}

  <!-- Comments Section -->
  <div class="comments-section" id="comments-section">
    <h2 class="comments-title">Comments <span id="comment-count" class="comment-count-badge"></span></h2>
    <div id="comments-list"></div>

    <!-- Comment Form -->
    <div class="comment-form-wrap">
      <div class="comment-form-title">Leave a Comment</div>
      <input type="text" id="c-name" placeholder="Your name" maxlength="80" class="comment-input"/>
      <textarea id="c-content" placeholder="Share your thoughts, tips, or questions..." maxlength="1200" rows="4" class="comment-textarea"></textarea>
      <div class="comment-char-count"><span id="c-chars">0</span>/1200</div>
      <div class="comment-photo-row">
        <button type="button" class="comment-photo-btn" onclick="document.getElementById('c-photo-input').click()">📷 Add Photo (optional)</button>
        <span id="c-photo-status"></span>
        <input type="file" id="c-photo-input" accept="image/jpeg,image/jpg,image/png,image/webp" style="display:none;" onchange="uploadCommentPhoto(this)"/>
      </div>
      <div id="c-photo-preview-wrap" style="display:none;margin:0.75rem 0;">
        <img id="c-photo-preview" src="" style="max-height:180px;border-radius:8px;border:1px solid rgba(201,169,110,0.2);"/>
        <button onclick="removeCommentPhoto()" style="display:block;margin-top:0.4rem;background:none;border:none;color:#c08060;font-size:0.72rem;cursor:pointer;">✕ Remove photo</button>
      </div>
      <input type="hidden" id="c-photo-url" value=""/>
      <button class="comment-submit-btn" onclick="submitComment()">Post Comment →</button>
      <div id="c-msg" style="display:none;margin-top:0.75rem;font-size:0.8rem;"></div>
    </div>
  </div>

  <a href="/blog" class="back">← Back to Blog</a>
</div>

<button id="back-top" title="Back to top" aria-label="Back to top">↑</button>

<script type="application/ld+json">${schema}</script>
<script type="application/ld+json">${breadcrumb}</script>
<script>
  var _postSlug = ${JSON.stringify(slug)};

  // ── Share ────────────────────────────────────────────────────────────────
  function copyLink(){
    navigator.clipboard.writeText(window.location.href).then(function(){
      var el = document.getElementById('copy-label');
      el.textContent = 'Copied!';
      setTimeout(function(){ el.textContent = 'Copy Link'; }, 2000);
    });
  }

  // ── Comments ─────────────────────────────────────────────────────────────
  document.getElementById('c-content').addEventListener('input', function(){
    document.getElementById('c-chars').textContent = this.value.length;
  });

  async function loadComments(){
    try {
      var r = await fetch('/api/blog?action=comments&slug=' + _postSlug);
      var d = await r.json();
      var comments = d.comments || [];
      var badge = document.getElementById('comment-count');
      badge.textContent = comments.length > 0 ? comments.length : '';
      var list = document.getElementById('comments-list');
      if(comments.length === 0){
        list.innerHTML = '<p style="color:#6a5a3a;font-size:0.82rem;margin-bottom:1.5rem;">No comments yet — be the first!</p>';
        return;
      }
      var html = '';
      comments.forEach(function(c){
        var d = new Date(c.created_at);
        var dateStr = d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
        var photoHtml = c.photo_url ? '<div class="comment-photo"><img src="'+c.photo_url+'" loading="lazy" onclick="openImgModal(this.src)"/></div>' : '';
        html += '<div class="comment-item" id="comment-'+c.id+'">'
          + '<div class="comment-meta"><span class="comment-author">'+escHtml(c.name)+'</span><span class="comment-date">'+dateStr+'</span></div>'
          + '<div class="comment-body">'+escHtml(c.content)+'</div>'
          + photoHtml
          + '<div class="comment-actions">'
          + '<button class="like-btn" onclick="likeComment(\''+c.id+'\',this)">♥ <span>'+c.likes+'</span></button>'
          + '</div>'
          + '</div>';
      });
      list.innerHTML = html;
    } catch(e){ console.error('Failed to load comments', e); }
  }

  function escHtml(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  async function likeComment(id, btn){
    btn.disabled = true;
    try {
      await fetch('/api/blog?action=comments', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({likeId: id}) });
      var span = btn.querySelector('span');
      span.textContent = parseInt(span.textContent) + 1;
      btn.classList.add('liked');
    } catch(e){ btn.disabled = false; }
  }

  async function uploadCommentPhoto(input){
    var file = input.files[0];
    if(!file) return;
    var status = document.getElementById('c-photo-status');
    status.textContent = '⏳ Uploading...';
    status.style.color = '#c9a96e';
    try {
      var base64 = await new Promise(function(res,rej){ var rd=new FileReader(); rd.onload=function(e){res(e.target.result.split(',')[1]);}; rd.onerror=rej; rd.readAsDataURL(file); });
      var r = await fetch('/api/admin?section=upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64: base64, filename: file.name, mimeType: file.type, uploadType: 'comment' })
      });
      var d = await r.json();
      if(!r.ok) throw new Error(d.error || 'Upload failed');
      document.getElementById('c-photo-url').value = d.url;
      document.getElementById('c-photo-preview').src = d.url;
      document.getElementById('c-photo-preview-wrap').style.display = '';
      status.textContent = '✓ Photo added';
      status.style.color = '#6aaa7a';
    } catch(e){
      status.textContent = '✗ ' + e.message;
      status.style.color = '#e08060';
    }
    input.value = '';
  }

  function removeCommentPhoto(){
    document.getElementById('c-photo-url').value = '';
    document.getElementById('c-photo-preview-wrap').style.display = 'none';
    document.getElementById('c-photo-status').textContent = '';
  }

  function openImgModal(src){
    var m = document.getElementById('img-modal');
    document.getElementById('img-modal-img').src = src;
    m.style.display = 'flex';
  }

  async function submitComment(){
    var name = document.getElementById('c-name').value.trim();
    var content = document.getElementById('c-content').value.trim();
    var photo_url = document.getElementById('c-photo-url').value;
    var msg = document.getElementById('c-msg');
    if(!name){ showMsg('Please enter your name.', '#e08060'); return; }
    if(!content || content.length < 2){ showMsg('Please write a comment.', '#e08060'); return; }
    var btn = document.querySelector('.comment-submit-btn');
    btn.textContent = 'Posting...';
    btn.disabled = true;
    try {
      var r = await fetch('/api/blog?action=comments&slug=' + _postSlug, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name, content, photo_url: photo_url || null })
      });
      var d = await r.json();
      if(!r.ok) throw new Error(d.error || 'Failed to post');
      document.getElementById('c-name').value = '';
      document.getElementById('c-content').value = '';
      document.getElementById('c-chars').textContent = '0';
      removeCommentPhoto();
      showMsg('✓ Comment posted!', '#6aaa7a');
      await loadComments();
    } catch(e){
      showMsg('✗ ' + e.message, '#e08060');
    }
    btn.textContent = 'Post Comment →';
    btn.disabled = false;
  }

  function showMsg(text, color){
    var msg = document.getElementById('c-msg');
    msg.textContent = text;
    msg.style.color = color;
    msg.style.display = '';
    setTimeout(function(){ msg.style.display = 'none'; }, 4000);
  }

  // ── Auth: auto-fill name from Supabase session ──────────────────────────
  (function(){
    try{
      var raw=localStorage.getItem('sb-prffhhkemxibujjjiyhg-auth-token');
      if(!raw) return;
      var parsed=JSON.parse(raw);
      var session=Array.isArray(parsed)?parsed[0]:parsed;
      var user=session&&session.user;
      if(!user) return;
      var name=user.user_metadata&&(user.user_metadata.full_name||user.user_metadata.name)||user.email.split('@')[0]||'';
      if(name){
        var nameInput=document.getElementById('c-name');
        if(nameInput&&!nameInput.value) nameInput.value=name;
      }
    }catch(e){}
  })();

  loadComments();

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
<!-- Image lightbox modal -->
<div id="img-modal" onclick="this.style.display='none'" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;align-items:center;justify-content:center;cursor:zoom-out;">
  <img id="img-modal-img" src="" alt="" style="max-width:90vw;max-height:90vh;border-radius:10px;"/>
</div>
</body></html>`;
}

// ─── Community Post Page ───────────────────────────────────────────────────

function buildCommunityPostPage(slug, post) {
  const dateFormatted = new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const coverPhoto = post.cover_photo || (Array.isArray(post.photos) && post.photos[0]) || null;
  const extraPhotos = Array.isArray(post.photos) ? post.photos.slice(1) : [];

  function escHtml(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  const photosHtml = extraPhotos.map(url => `<img src="${escHtml(url)}" alt="" class="inline-img" loading="lazy" onerror="this.style.display='none'"/>`).join('');

  const contentHtml = (post.content || '').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>');

  return buildHead(
    post.title + ' — Community Story | ATLAS Travel Blog',
    post.excerpt || post.content?.slice(0, 150) || '',
    `/blog/${slug}`,
    coverPhoto
  ) + `
<body>
<div class="sticky-cta" id="sticky-cta">
  <div class="sticky-cta-text">
    <strong>Plan your trip with ATLAS</strong>
    AI itinerary, visa info, hotels &amp; budget — free in seconds
  </div>
  <a href="/" class="sticky-cta-btn">Plan Now →</a>
</div>

<div class="container">
  <header><a href="/">${logoSvg()}<span>Atlas</span></a></header>
  ${coverPhoto ? `<img src="${escHtml(coverPhoto)}" alt="${escHtml(post.title)}" class="hero-img"/>` : ''}
  <span class="badge">Community Story</span>
  <h1 style="margin-top:0.75rem;">${escHtml(post.title)}</h1>
  <div class="meta">
    <span>By ${escHtml(post.user_name)}</span>
    <span>${dateFormatted}</span>
    ${post.destination ? `<span class="badge">✈️ ${escHtml(post.destination)}</span>` : ''}
  </div>

  <div class="article-body">
    <p>${contentHtml}</p>
  </div>

  ${photosHtml ? `<div style="margin:2rem 0;">${photosHtml}</div>` : ''}

  <div class="cta" style="margin-top:2.5rem;">
    <p style="font-family:'Cormorant Garamond',serif;font-weight:300;font-size:1.2rem;color:#e8dcc8;margin-bottom:0.4rem;">Ready to plan your own trip?</p>
    <p>ATLAS builds your full itinerary in seconds — day-by-day schedule, visa info, hotel picks, and budget estimate. Free to use.</p>
    <a href="/" class="cta-btn">Plan with ATLAS — It's Free →</a>
  </div>

  <div class="share-section">
    <div class="share-label">Share this story</div>
    <div class="share-btns">
      <a class="share-btn share-wa" href="https://wa.me/?text=${encodeURIComponent(post.title + ' — https://getatlas.ca/blog/' + slug)}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.106 1.508 5.836L0 24l6.335-1.652A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.368l-.36-.214-3.727.977.993-3.62-.235-.374A9.818 9.818 0 1112 21.818z"/></svg>
        WhatsApp
      </a>
      <button class="share-btn share-copy" onclick="navigator.clipboard.writeText(window.location.href).then(function(){var e=document.getElementById('copy-label');e.textContent='Copied!';setTimeout(function(){e.textContent='Copy Link';},2000);})">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
        <span id="copy-label">Copy Link</span>
      </button>
    </div>
  </div>

  <!-- Comments Section -->
  <div class="comments-section" id="comments-section">
    <h2 class="comments-title">Comments <span id="comment-count" class="comment-count-badge"></span></h2>
    <div id="comments-list"></div>
    <div class="comment-form-wrap">
      <div class="comment-form-title">Leave a Comment</div>
      <input type="text" id="c-name" placeholder="Your name" maxlength="80" class="comment-input"/>
      <textarea id="c-content" placeholder="Share your thoughts..." maxlength="1200" rows="4" class="comment-textarea"></textarea>
      <div class="comment-char-count"><span id="c-chars">0</span>/1200</div>
      <div class="comment-photo-row">
        <button type="button" class="comment-photo-btn" onclick="document.getElementById('c-photo-input').click()">📷 Add Photo (optional)</button>
        <span id="c-photo-status"></span>
        <input type="file" id="c-photo-input" accept="image/jpeg,image/jpg,image/png,image/webp" style="display:none;" onchange="uploadCommentPhoto(this)"/>
      </div>
      <div id="c-photo-preview-wrap" style="display:none;margin:0.75rem 0;">
        <img id="c-photo-preview" src="" style="max-height:180px;border-radius:8px;border:1px solid rgba(201,169,110,0.2);"/>
        <button onclick="removeCommentPhoto()" style="display:block;margin-top:0.4rem;background:none;border:none;color:#c08060;font-size:0.72rem;cursor:pointer;">✕ Remove photo</button>
      </div>
      <input type="hidden" id="c-photo-url" value=""/>
      <button class="comment-submit-btn" onclick="submitComment()">Post Comment →</button>
      <div id="c-msg" style="display:none;margin-top:0.75rem;font-size:0.8rem;"></div>
    </div>
  </div>

  <a href="/blog?cat=community" class="back">← Back to Community Stories</a>
</div>

<div id="img-modal" onclick="this.style.display='none'" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;align-items:center;justify-content:center;cursor:zoom-out;">
  <img id="img-modal-img" src="" alt="" style="max-width:90vw;max-height:90vh;border-radius:10px;"/>
</div>

<script>
  var _postSlug = ${JSON.stringify(slug)};

  document.getElementById('c-content').addEventListener('input', function(){
    document.getElementById('c-chars').textContent = this.value.length;
  });

  function escHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  async function loadComments(){
    try {
      var r = await fetch('/api/blog?action=comments&slug=' + _postSlug);
      var d = await r.json();
      var comments = d.comments || [];
      var badge = document.getElementById('comment-count');
      badge.textContent = comments.length > 0 ? comments.length : '';
      var list = document.getElementById('comments-list');
      if(comments.length === 0){ list.innerHTML = '<p style="color:#6a5a3a;font-size:0.82rem;margin-bottom:1.5rem;">No comments yet — be the first!</p>'; return; }
      list.innerHTML = comments.map(function(c){
        var dateStr = new Date(c.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
        var photoHtml = c.photo_url ? '<div class="comment-photo"><img src="'+c.photo_url+'" loading="lazy" onclick="openImgModal(this.src)"/></div>' : '';
        return '<div class="comment-item" id="comment-'+c.id+'">'
          + '<div class="comment-meta"><span class="comment-author">'+escHtml(c.name)+'</span><span class="comment-date">'+dateStr+'</span></div>'
          + '<div class="comment-body">'+escHtml(c.content)+'</div>'
          + photoHtml
          + '<div class="comment-actions"><button class="like-btn" onclick="likeComment(\''+c.id+'\',this)">♥ <span>'+c.likes+'</span></button></div>'
          + '</div>';
      }).join('');
    } catch(e){}
  }

  async function likeComment(id, btn){
    btn.disabled = true;
    try {
      await fetch('/api/blog?action=comments', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({likeId: id}) });
      var span = btn.querySelector('span');
      span.textContent = parseInt(span.textContent) + 1;
      btn.classList.add('liked');
    } catch(e){ btn.disabled = false; }
  }

  async function uploadCommentPhoto(input){
    var file = input.files[0]; if(!file) return;
    var status = document.getElementById('c-photo-status');
    status.textContent = '⏳ Uploading...'; status.style.color = '#c9a96e';
    try {
      var base64 = await new Promise(function(res,rej){ var rd=new FileReader(); rd.onload=function(e){res(e.target.result.split(',')[1]);}; rd.onerror=rej; rd.readAsDataURL(file); });
      var r = await fetch('/api/admin?section=upload', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({base64,filename:file.name,mimeType:file.type,uploadType:'comment'}) });
      var d = await r.json();
      if(!r.ok) throw new Error(d.error||'Upload failed');
      document.getElementById('c-photo-url').value = d.url;
      document.getElementById('c-photo-preview').src = d.url;
      document.getElementById('c-photo-preview-wrap').style.display = '';
      status.textContent = '✓ Photo added'; status.style.color = '#6aaa7a';
    } catch(e){ status.textContent = '✗ '+e.message; status.style.color='#e08060'; }
    input.value = '';
  }

  function removeCommentPhoto(){
    document.getElementById('c-photo-url').value='';
    document.getElementById('c-photo-preview-wrap').style.display='none';
    document.getElementById('c-photo-status').textContent='';
  }

  function openImgModal(src){
    var m = document.getElementById('img-modal');
    document.getElementById('img-modal-img').src = src;
    m.style.display = 'flex';
  }

  async function submitComment(){
    var name = document.getElementById('c-name').value.trim();
    var content = document.getElementById('c-content').value.trim();
    var photo_url = document.getElementById('c-photo-url').value;
    var msg = document.getElementById('c-msg');
    if(!name){ showMsg('Please enter your name.','#e08060'); return; }
    if(!content||content.length<2){ showMsg('Please write a comment.','#e08060'); return; }
    var btn = document.querySelector('.comment-submit-btn');
    btn.textContent='Posting...'; btn.disabled=true;
    try {
      var r = await fetch('/api/blog?action=comments&slug='+_postSlug, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name,content,photo_url:photo_url||null}) });
      var d = await r.json();
      if(!r.ok) throw new Error(d.error||'Failed to post');
      document.getElementById('c-name').value='';
      document.getElementById('c-content').value='';
      document.getElementById('c-chars').textContent='0';
      removeCommentPhoto();
      showMsg('✓ Comment posted!','#6aaa7a');
      await loadComments();
    } catch(e){ showMsg('✗ '+e.message,'#e08060'); }
    btn.textContent='Post Comment →'; btn.disabled=false;
  }

  function showMsg(text,color){
    var msg=document.getElementById('c-msg');
    msg.textContent=text; msg.style.color=color; msg.style.display='';
    setTimeout(function(){msg.style.display='none';},4000);
  }

  // Auto-fill name from Supabase session
  (function(){
    try{
      var raw=localStorage.getItem('sb-prffhhkemxibujjjiyhg-auth-token');
      if(!raw) return;
      var parsed=JSON.parse(raw);
      var session=Array.isArray(parsed)?parsed[0]:parsed;
      var user=session&&session.user;
      if(!user) return;
      var name=user.user_metadata&&(user.user_metadata.full_name||user.user_metadata.name)||user.email.split('@')[0]||'';
      if(name){ var ni=document.getElementById('c-name'); if(ni&&!ni.value) ni.value=name; }
    }catch(e){}
  })();

  loadComments();

  // Sticky CTA + reading progress bar
  (function(){
    var cta=document.getElementById('sticky-cta');
    var prog=document.getElementById('read-progress');
    var backTop=document.getElementById('back-top');
    var shown=false;
    window.addEventListener('scroll',function(){
      var scrolled=window.scrollY;
      var total=document.documentElement.scrollHeight-window.innerHeight;
      var pct=total>0?(scrolled/total*100):0;
      if(prog)prog.style.width=pct+'%';
      if(cta){
        if(!shown&&pct>35){cta.classList.add('visible');shown=true;}
        if(shown&&pct<10){cta.classList.remove('visible');shown=false;}
      }
      if(backTop){
        if(scrolled>500)backTop.classList.add('visible');
        else backTop.classList.remove('visible');
      }
    },{passive:true});
    if(backTop)backTop.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
  })();

  // Auto Table of Contents
  (function(){
    var sidebar=document.getElementById('toc-sidebar');
    if(!sidebar)return;
    var visibleBody=document.querySelector('.article-body:not([style*="display:none"]),.article-body');
    if(!visibleBody)return;
    var hh=visibleBody.querySelectorAll('h2');
    var headings=[];
    hh.forEach(function(h,i){
      if(!h.id)h.id='toc-'+i;
      headings.push({id:h.id,text:h.textContent.trim()});
    });
    if(headings.length<3){sidebar.style.display='none';return;}
    var links=headings.map(function(h){
      return '<a href="#'+h.id+'">'+h.text.slice(0,38)+(h.text.length>38?'…':'')+'</a>';
    }).join('');
    sidebar.innerHTML='<div class="toc-sidebar-title">On This Page</div>'+links;
    var tocAnchors=sidebar.querySelectorAll('a');
    window.addEventListener('scroll',function(){
      var current='';
      headings.forEach(function(h){
        var el=document.getElementById(h.id);
        if(el&&el.getBoundingClientRect().top<130)current=h.id;
      });
      tocAnchors.forEach(function(a){
        a.classList.toggle('toc-active',a.getAttribute('href')==='#'+current);
      });
    },{passive:true});
  })();
</script>
</body></html>`;
}

// ─── Community Index Page ──────────────────────────────────────────────────

function buildCommunityIndexPage(posts) {
  function escHtml(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  const communityCards = posts.length ? posts.map(p => {
    const date = new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const excerpt = p.excerpt || (p.content ? p.content.slice(0, 160) + '...' : '');
    const cover = p.cover_photo || (Array.isArray(p.photos) && p.photos[0]) || null;
    const href = p.slug ? '/blog/' + p.slug : '#';
    return `<a href="${escHtml(href)}" class="comm-card" style="display:block;text-decoration:none;">
      ${cover ? `<img src="${escHtml(cover)}" class="comm-img" loading="lazy"/>` : ''}
      <div class="comm-body">
        ${p.destination ? `<div class="comm-dest">✈️ ${escHtml(p.destination)}</div>` : ''}
        <div class="comm-title">${escHtml(p.title)}</div>
        <div class="comm-excerpt">${escHtml(excerpt)}</div>
        <div class="comm-meta">By ${escHtml(p.user_name)} · ${date}</div>
      </div>
    </a>`;
  }).join('') : `<div style="padding:3rem;text-align:center;color:#6a5a3a;font-size:0.9rem;">No community stories yet — be the first to share yours! ✍️</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Community Travel Stories | ATLAS Blog</title>
<meta name="description" content="Real travel stories from the Atlas community — tips, itineraries, visa experiences, and hidden gems shared by fellow travellers."/>
<link rel="canonical" href="https://getatlas.ca/blog?cat=community"/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
${LISTING_STYLES}
</head>
<body>

<nav class="blog-nav">
  <a href="/blog" class="blog-nav-logo">${logoSvg()} Atlas</a>
  <ul class="blog-nav-links">
    <li><a href="/blog">All</a></li>
    <li><a href="/blog?cat=southasia">South Asia</a></li>
    <li><a href="/blog?cat=eastasia">East Asia</a></li>
    <li><a href="/blog?cat=tips">Tips &amp; Visa</a></li>
    <li><a href="/blog?cat=community" class="active">Community ✍️</a></li>
  </ul>
  <button id="write-btn" class="blog-nav-write" onclick="openWriteModal()" style="display:inline-flex;">✍️ Write</button>
  <a href="/" class="blog-nav-cta">Plan Free →</a>
</nav>

<div style="padding-top:96px;">
  <div class="dest-section" style="padding-bottom:3rem;">
    <div class="section-head-bar">
      <h2 class="sh-title">Community <em>Stories</em> <span class="community-badge">Traveller-written</span></h2>
      <a href="/blog" class="sh-link">← All Articles</a>
    </div>
    <p style="font-size:0.85rem;color:#7a6a50;margin-top:1rem;margin-bottom:2rem;line-height:1.7;">Real experiences from fellow travellers — itineraries, visa tips, budget breakdowns, and hidden gems. Want to share yours?
      <button onclick="openWriteModal()" style="background:none;border:none;color:#c9a96e;cursor:pointer;font-size:0.85rem;font-family:'DM Sans',sans-serif;text-decoration:underline;padding:0;">Write your story →</button>
    </p>
    <div class="community-grid">${communityCards}</div>
  </div>
</div>

<!-- WRITE STORY MODAL -->
<div class="write-modal" id="write-modal" onclick="if(event.target===this)closeWriteModal()">
  <div class="write-box">
    <div id="ws-auth-step">
      <div class="write-header">
        <div class="write-title">Share Your Story</div>
        <button class="write-close" onclick="closeWriteModal()">✕</button>
      </div>
      <p style="font-size:0.85rem;color:#8a7a60;margin-bottom:1.5rem;line-height:1.7;">Sign in to share your travel story with the Atlas community.</p>
      <button id="ws-google-btn" onclick="signInWithGoogle()" style="width:100%;display:flex;align-items:center;justify-content:center;gap:0.75rem;background:#fff;color:#1c1914;border:none;border-radius:8px;padding:0.75rem 1.2rem;font-size:0.9rem;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;margin-bottom:1.2rem;transition:opacity 0.2s;">
        <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/></svg>
        Continue with Google
      </button>
      <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.2rem;">
        <div style="flex:1;height:1px;background:rgba(201,169,110,0.15);"></div>
        <span style="font-size:0.7rem;color:#5a4a2a;letter-spacing:0.08em;">OR</span>
        <div style="flex:1;height:1px;background:rgba(201,169,110,0.15);"></div>
      </div>
      <label class="write-label">Sign in with email</label>
      <input type="email" id="ws-magic-email" class="write-input" placeholder="your@email.com"/>
      <button id="ws-magic-btn" onclick="signInWithMagicLink()" class="write-submit-btn" style="width:100%;text-align:center;">Send Magic Link →</button>
      <div id="ws-magic-msg" style="display:none;margin-top:0.75rem;font-size:0.82rem;"></div>
    </div>
    <div id="ws-write-form" style="display:none;">
      <div class="write-header">
        <div class="write-title">Share Your Travel Story</div>
        <button class="write-close" onclick="closeWriteModal()">✕</button>
      </div>
      <div class="write-author">Writing as <strong id="write-author-name"></strong></div>
      <label class="write-label">Title *</label>
      <input type="text" id="ws-title" class="write-input" placeholder="e.g. 10 Days in Bali on a Budget" maxlength="200"/>
      <label class="write-label">Destination (optional)</label>
      <input type="text" id="ws-dest" class="write-input" placeholder="e.g. Bali, Indonesia"/>
      <label class="write-label">Your Story * <span style="color:#5a4a2a;font-size:0.65rem;text-transform:none;">(min 100 characters)</span></label>
      <textarea id="ws-content" class="write-textarea" placeholder="Share your experience..." maxlength="15000" oninput="document.getElementById('ws-chars').textContent=this.value.length"></textarea>
      <div class="write-chars"><span id="ws-chars">0</span>/15000</div>
      <label class="write-label">Photos — up to 3 (optional)</label>
      <div style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:0.75rem;">
        ${[0,1,2].map(i => `
        <div>
          <button type="button" class="write-photo-btn" onclick="document.getElementById('ws-photo-input-${i}').click()">${i===0?'📷 Cover Photo':'📷 Photo '+(i+1)}</button>
          <span id="ws-photo-status-${i}" style="font-size:0.75rem;margin-left:0.5rem;color:#c9a96e;"></span>
          <input type="file" id="ws-photo-input-${i}" accept="image/jpeg,image/jpg,image/png,image/webp" style="display:none;" onchange="uploadStoryPhoto(this,${i})"/>
          <input type="hidden" id="ws-photo-url-${i}" value=""/>
          <div id="ws-photo-preview-wrap-${i}" style="display:none;margin-top:0.4rem;">
            <img id="ws-photo-preview-${i}" src="" style="max-height:120px;border-radius:8px;border:1px solid rgba(201,169,110,0.2);"/>
            <button onclick="removeStoryPhoto(${i})" style="display:block;margin-top:0.25rem;background:none;border:none;color:#c08060;font-size:0.72rem;cursor:pointer;">✕ Remove</button>
          </div>
        </div>`).join('')}
      </div>
      <p style="font-size:0.72rem;color:#5a4a2a;margin-bottom:1rem;line-height:1.6;">Your story will be reviewed before it goes live — usually within 24 hours.</p>
      <button class="write-submit-btn" id="ws-submit-btn" onclick="submitStory()">Submit Story →</button>
      <div id="ws-msg" style="display:none;margin-top:0.75rem;font-size:0.82rem;"></div>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
<script>
var _sb=window.supabase.createClient(
  'https://prffhhkemxibujjjiyhg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByZmZoaGtlbXhpYnVqamppeWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NzYwMDIsImV4cCI6MjA5MDM1MjAwMn0.Tqxz_6EHwv4oWA9NvPSRK1uC7HJ1_chhFjZGg2PRhiE'
);
var _blogUser=null;
function _setUser(session){
  if(!session||!session.user) return;
  var u=session.user;
  _blogUser={id:u.id,email:u.email,token:session.access_token,name:(u.user_metadata&&(u.user_metadata.full_name||u.user_metadata.name))||u.email.split('@')[0]||'Traveller'};
  var wb=document.getElementById('write-btn'); if(wb) wb.textContent='✍️ '+_blogUser.name.split(' ')[0];
  var el=document.getElementById('write-author-name'); if(el) el.textContent=_blogUser.name+' ('+_blogUser.email+')';
}
async function initBlogAuth(){
  var {data:{session}}=await _sb.auth.getSession();
  _setUser(session);
  _sb.auth.onAuthStateChange(function(event,sess){
    if(event==='SIGNED_IN'&&sess){_setUser(sess);var modal=document.getElementById('write-modal');if(modal&&modal.style.display==='flex')showWriteForm();}
  });
}
function openWriteModal(){ document.getElementById('write-modal').style.display='flex'; document.body.style.overflow='hidden'; if(_blogUser)showWriteForm();else showAuthStep(); }
function closeWriteModal(){ document.getElementById('write-modal').style.display='none'; document.body.style.overflow=''; }
function showAuthStep(){ document.getElementById('ws-auth-step').style.display=''; document.getElementById('ws-write-form').style.display='none'; }
function showWriteForm(){ document.getElementById('ws-auth-step').style.display='none'; document.getElementById('ws-write-form').style.display=''; }
async function signInWithGoogle(){ var btn=document.getElementById('ws-google-btn'); btn.disabled=true; btn.textContent='Opening Google sign in...'; await _sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.href}}); }
async function signInWithMagicLink(){ var email=document.getElementById('ws-magic-email').value.trim(); var msg=document.getElementById('ws-magic-msg'); if(!email||!email.includes('@')){msg.style.color='#e08060';msg.textContent='Please enter a valid email.';msg.style.display='';return;} var btn=document.getElementById('ws-magic-btn'); btn.disabled=true; btn.textContent='Sending...'; var {error}=await _sb.auth.signInWithOtp({email,options:{emailRedirectTo:window.location.href}}); msg.style.display=''; if(error){msg.style.color='#e08060';msg.textContent='✗ '+error.message;btn.disabled=false;btn.textContent='Send Magic Link →';}else{msg.style.color='#6aaa7a';msg.textContent='✓ Check your email — click the link to come back and start writing.';btn.textContent='Email sent ✓';} }
async function uploadStoryPhoto(input,slot){ if(!input.files||!input.files[0]) return; var file=input.files[0]; if(file.size>5*1024*1024){alert('Photo too large (max 5MB)');return;} var status=document.getElementById('ws-photo-status-'+slot); status.textContent='Uploading...'; status.style.color='#c9a96e'; var reader=new FileReader(); reader.onload=async function(e){ try{ var base64=e.target.result.split(',')[1]; var r=await fetch('/api/admin?section=upload',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({base64,filename:file.name,mimeType:file.type,uploadType:'community'})}); var d=await r.json(); if(d.url){document.getElementById('ws-photo-url-'+slot).value=d.url;document.getElementById('ws-photo-preview-'+slot).src=d.url;document.getElementById('ws-photo-preview-wrap-'+slot).style.display='';status.textContent='✓ Uploaded';status.style.color='#6aaa7a';}else{throw new Error(d.error||'Upload failed');} }catch(err){status.textContent='✗ '+err.message;status.style.color='#e08060';} }; reader.readAsDataURL(file); }
function removeStoryPhoto(slot){ document.getElementById('ws-photo-url-'+slot).value=''; document.getElementById('ws-photo-preview-wrap-'+slot).style.display='none'; document.getElementById('ws-photo-status-'+slot).textContent=''; document.getElementById('ws-photo-input-'+slot).value=''; }
async function submitStory(){ if(!_blogUser) return; var title=document.getElementById('ws-title').value.trim(); var content=document.getElementById('ws-content').value.trim(); var destination=document.getElementById('ws-dest').value.trim(); var photos=[0,1,2].map(function(i){return document.getElementById('ws-photo-url-'+i).value;}).filter(Boolean); var msg=document.getElementById('ws-msg'); var btn=document.getElementById('ws-submit-btn'); if(!title){msg.style.color='#e08060';msg.textContent='Please add a title.';msg.style.display='';return;} if(content.length<100){msg.style.color='#e08060';msg.textContent='Story should be at least 100 characters.';msg.style.display='';return;} btn.disabled=true;btn.textContent='Submitting...'; try{ var r=await fetch('/api/blog?action=submit_post',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+_blogUser.token},body:JSON.stringify({title,content,destination:destination||null,photos:photos.length?photos:null})}); var d=await r.json(); if(!r.ok) throw new Error(d.error||'Failed to submit'); msg.style.color='#6aaa7a'; msg.textContent='✓ Story submitted! It will appear after a quick review.'; msg.style.display=''; [0,1,2].forEach(function(i){removeStoryPhoto(i);}); document.getElementById('ws-title').value=''; document.getElementById('ws-content').value=''; document.getElementById('ws-dest').value=''; document.getElementById('ws-chars').textContent='0'; setTimeout(closeWriteModal,3000); }catch(e){msg.style.color='#e08060';msg.textContent='✗ '+e.message;msg.style.display='';} btn.disabled=false;btn.textContent='Submit Story →'; }
window.addEventListener('DOMContentLoaded',initBlogAuth);
</script>
</body></html>`;
}

const CAT_KEYWORDS = {
  southasia: ['bangladesh','dhaka','cox','sundarbans','maldives','nepal','everest','india'],
  eastasia: ['japan','kyoto','bali','singapore','thailand','asia','pacific'],
  europe: ['istanbul','turkey','europe','middle-east'],
  tips: ['visa','budget','packing','solo','tips','travel-tips'],
};

// In-memory rate limit for comments
const commentRateMap = new Map();
function isCommentRateLimited(ip) {
  const now = Date.now();
  const e = commentRateMap.get(ip) || { count: 0, reset: now + 10 * 60 * 1000 };
  if (now > e.reset) { e.count = 0; e.reset = now + 10 * 60 * 1000; }
  e.count++;
  commentRateMap.set(ip, e);
  return e.count > 5;
}

export default async function handler(req, res) {
  const { slug, cat, action } = req.query;

  // ── Comments API (action=comments) ───────────────────────────────────────
  if (action === 'comments') {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET') {
      if (!slug) return res.status(400).json({ error: 'slug required' });
      const { data, error } = await sb.from('comments')
        .select('id, name, content, photo_url, likes, parent_id, created_at')
        .eq('post_slug', slug).eq('is_approved', true)
        .order('created_at', { ascending: true }).limit(200);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ comments: data || [] });
    }

    if (req.method === 'POST') {
      let body = {};
      try {
        const raw = await new Promise(r => { let d = ''; req.on('data', c => d += c); req.on('end', () => r(d)); });
        body = JSON.parse(raw);
      } catch { return res.status(400).json({ error: 'Invalid JSON' }); }

      const { name, content, photo_url, parent_id, likeId } = body;

      // Like action
      if (likeId) {
        const { data: c } = await sb.from('comments').select('likes').eq('id', likeId).single();
        await sb.from('comments').update({ likes: (c?.likes || 0) + 1 }).eq('id', likeId);
        return res.status(200).json({ ok: true });
      }

      // Submit comment
      if (!slug || !name || !content) return res.status(400).json({ error: 'slug, name and content required' });
      if (content.length > 1200) return res.status(400).json({ error: 'Too long' });
      const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
      if (isCommentRateLimited(ip)) return res.status(429).json({ error: 'Too many comments. Wait a few minutes.' });
      // Allow comments on both blog posts and approved community posts
      let postExists = false;
      if (slug.startsWith('community-')) {
        const { data: cp } = await sb.from('user_posts').select('slug').eq('slug', slug).eq('status', 'approved').single();
        postExists = !!cp;
      } else {
        const { data: bp } = await sb.from('blog_posts').select('slug').eq('slug', slug).single();
        postExists = !!bp;
      }
      if (!postExists) return res.status(404).json({ error: 'Post not found' });
      const { data, error } = await sb.from('comments').insert({
        post_slug: slug, name: name.trim().slice(0, 80),
        content: content.trim().slice(0, 1200),
        photo_url: photo_url || null, parent_id: parent_id || null,
      }).select().single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json({ comment: data });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Community Posts (action=community_posts) ─────────────────────────────
  if (action === 'community_posts') {
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.setHeader('Content-Type', 'application/json');
    const { data: cposts, error: cperr } = await sb
      .from('user_posts')
      .select('id, slug, user_name, title, excerpt, content, cover_photo, photos, destination, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(20);
    if (cperr) return res.status(500).json({ error: cperr.message });
    return res.status(200).json({ posts: cposts || [] });
  }

  // ── Submit Post (action=submit_post) ─────────────────────────────────────
  if (action === 'submit_post') {
    res.setHeader('Content-Type', 'application/json');
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Login required to submit a story' });
    const token = authHeader.slice(7);
    const sbAuth = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const { data: { user: authUser }, error: authErr } = await sbAuth.auth.getUser(token);
    if (authErr || !authUser) return res.status(401).json({ error: 'Session expired. Please log in again.' });
    let body = {};
    try {
      const raw = await new Promise(r => { let d = ''; req.on('data', c => d += c); req.on('end', () => r(d)); });
      body = JSON.parse(raw);
    } catch { return res.status(400).json({ error: 'Invalid JSON' }); }
    const { title, content, destination, photos } = body;
    if (!title?.trim() || !content?.trim()) return res.status(400).json({ error: 'Title and content required' });
    if (title.length > 200) return res.status(400).json({ error: 'Title too long (max 200 characters)' });
    if (content.length > 15000) return res.status(400).json({ error: 'Story too long (max 15,000 characters)' });
    if (content.length < 100) return res.status(400).json({ error: 'Story too short (min 100 characters)' });
    const userName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Traveller';
    const excerpt = content.replace(/\n+/g, ' ').trim().slice(0, 200) + (content.length > 200 ? '...' : '');
    const photosArr = Array.isArray(photos) ? photos.filter(u => typeof u === 'string' && u.startsWith('http')).slice(0, 3) : [];
    const cover_photo = photosArr[0] || null;
    const { error: insErr } = await sb.from('user_posts').insert({
      user_id: authUser.id,
      user_name: userName,
      user_email: authUser.email,
      title: title.trim(),
      excerpt,
      content: content.trim(),
      cover_photo,
      photos: photosArr.length ? photosArr : null,
      destination: destination?.trim() || null,
      status: 'pending',
    });
    if (insErr) return res.status(500).json({ error: insErr.message });
    return res.status(201).json({ ok: true, message: 'Story submitted! It will appear after review.' });
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'index, follow');
  res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');

  if (!slug || slug === 'index') {
    // Community index page
    if (cat === 'community') {
      const { data: cposts } = await sb
        .from('user_posts')
        .select('id, slug, user_name, title, excerpt, content, cover_photo, photos, destination, created_at')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(50);
      return res.status(200).send(buildCommunityIndexPage(cposts || []));
    }

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

  // Community post individual page
  if (slug.startsWith('community-')) {
    const { data: cpost, error: cperr } = await sb
      .from('user_posts')
      .select('id, slug, title, excerpt, content, cover_photo, photos, destination, user_name, created_at')
      .eq('slug', slug)
      .eq('status', 'approved')
      .single();
    if (cperr || !cpost) {
      res.writeHead(302, { Location: '/blog?cat=community' });
      return res.end();
    }
    return res.status(200).send(buildCommunityPostPage(slug, cpost));
  }

  const { data, error } = await sb
    .from('blog_posts')
    .select('slug,title,description,category,date_published,read_time,hero_emoji,content,content_bn,content_translations,cover_image_url,key_facts,highlights,related_destinations,updated_at,inline_photos')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) {
    res.writeHead(302, { Location: '/blog' });
    return res.end();
  }

  // Fetch related blog posts (same category, excluding current article, limit 3)
  const { data: relatedPosts } = await sb
    .from('blog_posts')
    .select('slug,title,description,category,date_published,read_time,hero_emoji,cover_image_url')
    .eq('is_published', true)
    .eq('category', data.category)
    .neq('slug', slug)
    .order('date_published', { ascending: false })
    .limit(3);

  // If not enough from same category, fill with recent posts
  let related = relatedPosts || [];
  if (related.length < 3) {
    const exclude = [slug, ...related.map(p => p.slug)];
    const { data: morePosts } = await sb
      .from('blog_posts')
      .select('slug,title,description,category,date_published,read_time,hero_emoji,cover_image_url')
      .eq('is_published', true)
      .not('slug', 'in', `(${exclude.map(s => `"${s}"`).join(',')})`)
      .order('date_published', { ascending: false })
      .limit(3 - related.length);
    related = [...related, ...(morePosts || [])];
  }

  return res.status(200).send(buildArticlePage(slug, data, related));
}
