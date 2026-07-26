import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import webpush from 'web-push';
import nodemailer from 'nodemailer';

const sb = createClient(
  'https://prffhhkemxibujjjiyhg.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

// VAPID setup for push notifications
const VAPID_PUBLIC_KEY = 'BGptz3aIXzAwHRW37OhPoRetGGR9GtHE-RprbaEnn351x2BgT0_0MiUrI-PJ1Q2Vr3JtOPtB5GyQPSkJ_3pAeEE';
if (process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails('mailto:support@getatlas.ca', VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
}

async function sendBlogPushNotifications(title, slug, description) {
  if (!process.env.VAPID_PRIVATE_KEY) return;
  try {
    const { data: subs } = await sb.from('push_subscriptions').select('subscription');
    if (!subs?.length) return;
    const payload = JSON.stringify({
      title: '📖 New on Atlas Blog',
      body: title,
      icon: '/icon-192.png',
      url: `/blog/${slug}`,
      tag: `blog-${slug}`
    });
    const results = await Promise.allSettled(
      subs.map(row => {
        try {
          const sub = JSON.parse(row.subscription);
          return webpush.sendNotification(sub, payload);
        } catch { return Promise.resolve(); }
      })
    );
    const sent = results.filter(r => r.status === 'fulfilled').length;
    console.log(`Push sent to ${sent}/${subs.length} subscribers for: ${title}`);
  } catch (e) {
    console.error('Push notification error:', e.message);
  }
}

async function sendNewsletterEmails(title, slug, description, heroEmoji) {
  if (!process.env.ZOHO_APP_PASSWORD) return;
  try {
    const { data: subscribers } = await sb
      .from('newsletter_subscribers')
      .select('email')
      .eq('unsubscribed', false);
    if (!subscribers?.length) return;

    const articleUrl = `https://getatlas.ca/blog/${slug}`;
    const emoji = heroEmoji || '✈️';

    const buildHtml = (email) => `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0e0c08;font-family:'Georgia',serif;">
  <div style="max-width:560px;margin:0 auto;padding:2rem 1rem;">
    <div style="text-align:center;padding-bottom:1.5rem;border-bottom:1px solid rgba(201,169,110,0.2);">
      <p style="font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;color:#8a6a3a;margin:0 0 0.5rem;">Atlas · AI Travel Intelligence</p>
      <p style="font-size:0.75rem;color:#5a4a2a;margin:0;">New article just published</p>
    </div>
    <div style="padding:2rem 0;">
      <div style="font-size:3rem;text-align:center;margin-bottom:1rem;">${emoji}</div>
      <h1 style="font-family:'Georgia',serif;font-size:1.6rem;font-weight:400;color:#e8dcc8;text-align:center;line-height:1.35;margin:0 0 1rem;">${title}</h1>
      <p style="font-size:0.9rem;color:#8a7a60;line-height:1.75;text-align:center;margin:0 0 2rem;">${description || ''}</p>
      <div style="text-align:center;">
        <a href="${articleUrl}" style="display:inline-block;background:#c9a96e;color:#1c1914;text-decoration:none;padding:0.85rem 2rem;border-radius:8px;font-size:0.85rem;font-weight:600;letter-spacing:0.08em;">Read Article →</a>
      </div>
    </div>
    <div style="border-top:1px solid rgba(201,169,110,0.15);padding-top:1.5rem;text-align:center;">
      <p style="font-size:0.7rem;color:#3a3020;margin:0 0 0.5rem;">You're receiving this because you subscribed to Atlas Travel updates.</p>
      <p style="font-size:0.7rem;color:#3a3020;margin:0;">
        <a href="https://getatlas.ca/api/subscribe?email=${encodeURIComponent(email)}" style="color:#5a4a2a;text-decoration:underline;">Unsubscribe</a>
        &nbsp;·&nbsp;
        <a href="https://getatlas.ca/blog" style="color:#5a4a2a;text-decoration:underline;">View all articles</a>
      </p>
    </div>
  </div>
</body></html>`;

    const zohoFrom = process.env.ZOHO_FROM || 'support@getatlas.ca';
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: zohoFrom,
        pass: process.env.ZOHO_APP_PASSWORD
      }
    });

    const results = await Promise.allSettled(
      subscribers.map(row =>
        transporter.sendMail({
          from: `"Atlas Travel" <${zohoFrom}>`,
          to: row.email,
          subject: `${emoji} ${title}`,
          html: buildHtml(row.email)
        })
      )
    );
    const sent = results.filter(r => r.status === 'fulfilled').length;
    console.log(`Newsletter sent to ${sent}/${subscribers.length} subscribers for: ${title}`);
  } catch (e) {
    console.error('Newsletter email error:', e.message);
  }
}

const PASSWORD = process.env.ADMIN_PASSWORD || 'Pinuatlas2121@';
const TOKEN = createHash('sha256').update(PASSWORD).digest('hex');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseCookies(req) {
  return Object.fromEntries(
    (req.headers.cookie || '').split(';').map(c => c.trim().split('=').map(s => decodeURIComponent(s || '')))
  );
}

function parseBody(str) {
  const out = {};
  for (const [k, v] of new URLSearchParams(str)) out[k] = v;
  return out;
}

function isAuthed(req) {
  return parseCookies(req)['atlas_admin'] === TOKEN;
}

async function readBody(req) {
  return new Promise(resolve => {
    let d = '';
    req.on('data', c => { d += c; });
    req.on('end', () => resolve(d));
  });
}

// ─── CSS + Shell ───────────────────────────────────────────────────────────────

const CSS = `
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#111009;color:#ede5d5;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;min-height:100vh;display:flex;}
a{color:#c9a96e;text-decoration:none;}
a:hover{opacity:.8;}

/* Sidebar */
.sidebar{width:220px;min-height:100vh;background:#0e0c08;border-right:1px solid rgba(201,169,110,0.1);display:flex;flex-direction:column;flex-shrink:0;position:sticky;top:0;height:100vh;}
.sidebar-logo{padding:1.5rem 1.25rem 1rem;border-bottom:1px solid rgba(201,169,110,0.1);}
.sidebar-logo .wordmark{font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:300;letter-spacing:0.35em;color:#d4aa6e;text-transform:uppercase;}
.sidebar-logo .sub{font-size:0.6rem;color:#4a3a1a;letter-spacing:0.15em;text-transform:uppercase;margin-top:0.2rem;}
nav{flex:1;padding:0.75rem 0;}
.nav-item{display:flex;align-items:center;gap:0.6rem;padding:0.6rem 1.25rem;font-size:0.78rem;color:#6a5a3a;cursor:pointer;transition:all 0.15s;border-left:2px solid transparent;text-decoration:none;}
.nav-item:hover{color:#c9a96e;background:rgba(201,169,110,0.04);}
.nav-item.active{color:#c9a96e;background:rgba(201,169,110,0.06);border-left-color:#c9a96e;}
.nav-item .icon{font-size:0.9rem;width:18px;text-align:center;}
.nav-section{font-size:0.58rem;color:#3a2a0a;letter-spacing:0.15em;text-transform:uppercase;padding:0.9rem 1.25rem 0.3rem;}
.sidebar-foot{padding:1rem 1.25rem;border-top:1px solid rgba(201,169,110,0.1);}
.logout{font-size:0.7rem;color:#4a3a1a;cursor:pointer;background:none;border:none;font-family:'DM Sans',sans-serif;padding:0;}
.logout:hover{color:#c9a96e;}

/* Main */
.main{flex:1;padding:2rem 2.5rem 4rem;overflow-y:auto;max-width:1000px;}
h1{font-family:'Cormorant Garamond',serif;font-size:1.7rem;font-weight:300;color:#e8dcc8;margin-bottom:1.75rem;}
h2{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:300;color:#c9a96e;margin:1.75rem 0 0.85rem;letter-spacing:0.03em;}
h3{font-size:0.8rem;font-weight:500;color:#a89880;margin:1.25rem 0 0.5rem;letter-spacing:0.05em;text-transform:uppercase;}

/* Cards */
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:0.85rem;margin-bottom:1rem;}
.card{background:rgba(201,169,110,0.04);border:1px solid rgba(201,169,110,0.12);border-radius:10px;padding:1rem 1.2rem;}
.card-label{font-size:0.6rem;color:#5a4a2a;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:0.4rem;}
.card-value{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;color:#e8dcc8;line-height:1.1;}
.card-sub{font-size:0.68rem;color:#6a5a3a;margin-top:0.25rem;}

/* Table */
table{width:100%;border-collapse:collapse;font-size:0.8rem;margin-bottom:1.5rem;}
th{text-align:left;padding:0.45rem 0.7rem;color:#7a6a50;font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;border-bottom:1px solid rgba(201,169,110,0.15);}
td{padding:0.5rem 0.7rem;color:#9a8a70;border-bottom:1px solid rgba(201,169,110,0.06);}
tr:hover td{background:rgba(201,169,110,0.02);}

/* Badge */
.badge{display:inline-block;padding:0.15rem 0.5rem;border-radius:3px;font-size:0.62rem;letter-spacing:0.06em;text-transform:uppercase;}
.badge-yes{background:rgba(80,200,80,0.1);color:#70c070;}
.badge-no{background:rgba(255,255,255,0.04);color:#5a4a2a;}

/* Buttons */
.btn{display:inline-block;background:#c9a96e;color:#1c1914;border:none;border-radius:7px;padding:0.5rem 1.1rem;font-size:0.78rem;font-weight:600;cursor:pointer;letter-spacing:0.04em;font-family:'DM Sans',sans-serif;transition:background 0.15s;}
.btn:hover{background:#e0c080;}
.btn-sm{padding:0.28rem 0.7rem;font-size:0.7rem;}
.btn-ghost{background:transparent;border:1px solid rgba(201,169,110,0.25);color:#c9a96e;}
.btn-ghost:hover{background:rgba(201,169,110,0.08);}

/* Form */
.field{margin-bottom:1.1rem;}
label{display:block;font-size:0.65rem;color:#5a4a2a;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.35rem;}
input[type=text],input[type=number],textarea{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(201,169,110,0.18);border-radius:7px;padding:0.55rem 0.8rem;color:#ede5d5;font-size:0.8rem;font-family:'DM Sans',sans-serif;outline:none;}
input[type=text]:focus,input[type=number]:focus,textarea:focus{border-color:rgba(201,169,110,0.45);}
textarea{resize:vertical;line-height:1.5;}
.check-label{display:flex;align-items:center;gap:0.5rem;font-size:0.8rem;color:#9a8a70;cursor:pointer;}
input[type=checkbox]{width:15px;height:15px;accent-color:#c9a96e;}

/* Photo row */
.photo-row{display:flex;align-items:center;gap:0.85rem;margin-bottom:0.75rem;padding:0.65rem 0.85rem;background:rgba(201,169,110,0.03);border:1px solid rgba(201,169,110,0.09);border-radius:8px;}
.photo-row img{width:72px;height:54px;object-fit:cover;border-radius:5px;flex-shrink:0;background:#1e1a14;}
.photo-row input{flex:1;}
.photo-tag{font-size:0.62rem;color:#4a3a1a;margin-bottom:0.3rem;}

/* Alerts */
.success{background:rgba(80,200,80,0.08);border:1px solid rgba(80,200,80,0.2);border-radius:8px;padding:0.65rem 1rem;margin-bottom:1.25rem;font-size:0.8rem;color:#70c070;}
.back-link{font-size:0.72rem;color:#5a4a2a;display:inline-block;margin-bottom:1.25rem;}
.back-link:hover{color:#c9a96e;}

/* Placeholder */
.placeholder-box{border:1px dashed rgba(201,169,110,0.15);border-radius:12px;padding:3rem 2rem;text-align:center;color:#4a3a1a;}
.placeholder-box .icon{font-size:2.5rem;margin-bottom:0.75rem;}
.placeholder-box p{font-size:0.8rem;line-height:1.7;}

/* Login */
.login-page{display:flex;align-items:center;justify-content:center;min-height:100vh;width:100%;background:#111009;}
.login-box{text-align:center;width:300px;}
.login-logo{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;letter-spacing:0.4em;color:#d4aa6e;text-transform:uppercase;margin-bottom:0.3rem;}
.login-sub{font-size:0.65rem;color:#4a3a1a;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:2rem;}
.login-box input[type=password]{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(201,169,110,0.2);border-radius:8px;padding:0.7rem 1rem;color:#ede5d5;font-size:0.88rem;font-family:'DM Sans',sans-serif;outline:none;margin-bottom:0.75rem;text-align:center;letter-spacing:0.15em;}
.login-box input[type=password]:focus{border-color:rgba(201,169,110,0.45);}
.login-box .btn{width:100%;padding:0.65rem;font-size:0.82rem;}
.login-err{color:#c06050;font-size:0.75rem;margin-top:0.5rem;}

@media(max-width:700px){.sidebar{display:none;}.main{padding:1.25rem 1rem 4rem;}}
`;

const HEAD = (title = 'Atlas Admin') => `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title} — Atlas Admin</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>${CSS}</style></head><body>`;

function sidebar(active) {
  const item = (section, icon, label) =>
    `<a class="nav-item${active === section ? ' active' : ''}" href="/admin?section=${section}">
      <span class="icon">${icon}</span>${label}
    </a>`;
  return `<div class="sidebar">
    <div class="sidebar-logo">
      <div class="wordmark">Atlas</div>
      <div class="sub">Admin Panel</div>
    </div>
    <nav>
      <div class="nav-section">Dashboard</div>
      ${item('overview', '📊', 'Overview')}
      <div class="nav-section">Content</div>
      ${item('blog', '📝', 'Blog Articles')}
      ${item('schedule', '🗓️', 'Schedule')}
      ${item('community', '✍️', 'Community Posts')}
      ${item('news', '📰', 'Atlas News')}
    </nav>
    <div class="sidebar-foot">
      <form method="POST" action="/admin?logout=1" style="display:inline">
        <button class="logout" type="submit">← Logout</button>
      </form>
    </div>
  </div>`;
}

function shell(active, title, body) {
  return HEAD(title) + sidebar(active) + `<div class="main">${body}</div></body></html>`;
}

// ─── Login page ────────────────────────────────────────────────────────────────

function loginPage(err = '') {
  return HEAD('Login') + `<div class="login-page">
  <div class="login-box">
    <div class="login-logo">Atlas</div>
    <div class="login-sub">Admin Panel</div>
    <form method="POST" action="/admin">
      <input type="password" name="password" placeholder="Password" autofocus autocomplete="current-password"/>
      <button type="submit" class="btn">Enter →</button>
      ${err ? `<p class="login-err">${err}</p>` : ''}
    </form>
  </div>
</div></body></html>`;
}

// ─── Overview ─────────────────────────────────────────────────────────────────

async function overviewPage() {
  const fmt = n => n?.toLocaleString() ?? '—';
  const money = n => n != null ? `$${Number(n).toFixed(2)}` : '—';

  const [
    { count: totalUsers },
    { count: proUsers },
    { count: newUsers30d },
    { count: savedPlans },
    { count: publicTrips },
    { count: blogPosts },
    { data: recentUsers },
    { data: recentPlans },
    { data: recentBlog },
    { data: subData },
    { data: subscribers }
  ] = await Promise.all([
    sb.from('allowed_users').select('*', { count: 'exact', head: true }),
    sb.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    sb.from('allowed_users').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString()),
    sb.from('saved_plans').select('*', { count: 'exact', head: true }),
    sb.from('saved_plans').select('*', { count: 'exact', head: true }).eq('is_public', true),
    sb.from('blog_posts').select('*', { count: 'exact', head: true }).eq('is_published', true),
    sb.from('allowed_users').select('email,created_at,plan').order('created_at', { ascending: false }).limit(8),
    sb.from('saved_plans').select('title,destination,user_email,created_at,is_public').order('created_at', { ascending: false }).limit(8),
    sb.from('blog_posts').select('slug,title,category,date_published').order('date_published', { ascending: false }).limit(8),
    sb.from('subscriptions').select('amount').eq('status', 'active'),
    sb.from('newsletter_subscribers').select('email,source,subscribed_at').order('subscribed_at', { ascending: false }).limit(8),
  ]);

  const mrr = (subData || []).reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const card = (label, value, sub = '') => `<div class="card"><div class="card-label">${label}</div><div class="card-value">${value}</div>${sub ? `<div class="card-sub">${sub}</div>` : ''}</div>`;

  const userRows = (recentUsers || []).map(u => `<tr>
    <td>${u.email ?? '—'}</td>
    <td>${u.created_at ? new Date(u.created_at).toLocaleDateString('en-CA') : '—'}</td>
    <td><span class="badge ${u.plan === 'pro' ? 'badge-yes' : 'badge-no'}">${u.plan ?? 'free'}</span></td>
  </tr>`).join('');

  const planRows = (recentPlans || []).map(p => `<tr>
    <td>${p.title ?? p.destination ?? '—'}</td>
    <td style="font-size:0.72rem;color:#5a4a2a">${p.user_email ?? '—'}</td>
    <td>${p.created_at ? new Date(p.created_at).toLocaleDateString('en-CA') : '—'}</td>
    <td>${p.is_public ? '✓' : '—'}</td>
  </tr>`).join('');

  const blogRows = (recentBlog || []).map(b => `<tr>
    <td><a href="/blog/${b.slug}">${b.title}</a></td>
    <td style="font-size:0.72rem;color:#5a4a2a">${b.category}</td>
    <td>${b.date_published}</td>
  </tr>`).join('');

  const subRows = (subscribers || []).map(s => `<tr>
    <td>${s.email}</td>
    <td style="font-size:0.72rem;color:#5a4a2a">${s.source ?? '—'}</td>
    <td>${s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString('en-CA') : '—'}</td>
  </tr>`).join('');

  return shell('overview', 'Overview', `
    <h1>Overview</h1>
    <div class="cards">
      ${card('Total Users', fmt(totalUsers))}
      ${card('Pro Subscribers', fmt(proUsers), 'active')}
      ${card('New Users (30d)', fmt(newUsers30d))}
      ${card('MRR (est.)', money(mrr))}
      ${card('Saved Plans', fmt(savedPlans))}
      ${card('Public Trips', fmt(publicTrips))}
      ${card('Blog Posts', fmt(blogPosts), 'published')}
    </div>

    <h2>Recent Users</h2>
    <table><thead><tr><th>Email</th><th>Joined</th><th>Plan</th></tr></thead><tbody>${userRows || '<tr><td colspan="3" style="color:#4a3a1a">No users yet</td></tr>'}</tbody></table>

    <h2>Recent Saved Plans</h2>
    <table><thead><tr><th>Plan</th><th>User</th><th>Date</th><th>Public</th></tr></thead><tbody>${planRows || '<tr><td colspan="4" style="color:#4a3a1a">No plans yet</td></tr>'}</tbody></table>

    <h2>Newsletter Subscribers</h2>
    <table><thead><tr><th>Email</th><th>Source</th><th>Date</th></tr></thead><tbody>${subRows || '<tr><td colspan="3" style="color:#4a3a1a">No subscribers yet</td></tr>'}</tbody></table>

    <h2>Recent Blog Posts</h2>
    <table><thead><tr><th>Title</th><th>Category</th><th>Date</th></tr></thead><tbody>${blogRows}</tbody></table>
  `);
}

// ─── Blog list ─────────────────────────────────────────────────────────────────

async function blogListPage() {
  const { data: posts } = await sb
    .from('blog_posts')
    .select('slug,title,category,date_published,is_published')
    .order('date_published', { ascending: false });

  const rows = (posts || []).map(p => `<tr>
    <td><a href="/admin?section=blog&edit=${encodeURIComponent(p.slug)}">${p.title}</a></td>
    <td style="font-size:0.72rem;color:#5a4a2a">${p.category ?? '—'}</td>
    <td>${p.date_published ?? '—'}</td>
    <td><span class="badge ${p.is_published ? 'badge-yes' : 'badge-no'}">${p.is_published ? 'Live' : 'Draft'}</span></td>
    <td><a href="/admin?section=blog&edit=${encodeURIComponent(p.slug)}" class="btn btn-sm btn-ghost">Edit →</a></td>
  </tr>`).join('');

  return shell('blog', 'Blog Articles', `
    <h1>Blog Articles</h1>
    <table>
      <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Status</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `);
}

// ─── Blog editor ───────────────────────────────────────────────────────────────

async function blogEditorPage(slug, saved = false) {
  const { data: post } = await sb
    .from('blog_posts')
    .select('slug,title,description,category,read_time,is_published,date_published,cover_image_url,content,inline_photos')
    .eq('slug', slug)
    .single();

  if (!post) return shell('blog', 'Not Found', `<p style="color:#c06050;padding:2rem">Article not found: ${slug}</p>`);

  // Always show 5 inline photo slots, pulling from inline_photos JSONB array
  const savedPhotos = Array.isArray(post.inline_photos) ? post.inline_photos : [];
  const PHOTO_SLOTS = 5;
  const photoSlots = Array.from({ length: PHOTO_SLOTS }, (_, i) => savedPhotos[i] || '');

  const photoInputs = photoSlots.map((url, i) => `
    <div class="photo-row">
      <img id="inline-preview-${i}" src="${url}" alt="" onerror="this.style.opacity=0.15" style="${url ? '' : 'opacity:0.15;background:#2a2419;'}"/>
      <div style="flex:1">
        <div class="photo-tag">Photo ${i + 1}${url ? '' : ' <span style="color:#4a3a1a;font-size:0.62rem;">(empty)</span>'}</div>
        <input type="text" id="inline-url-${i}" name="inline_photo_${i}" value="${url.replace(/"/g, '&quot;')}" placeholder="Photo URL paste করো অথবা upload করো" style="margin-bottom:0.4rem;" oninput="updateInlinePreview(${i},this.value)"/>
        <div style="display:flex;gap:0.6rem;align-items:center;">
          <button type="button" onclick="document.getElementById('inline-file-${i}').click()" style="background:rgba(201,169,110,0.12);border:1px solid rgba(201,169,110,0.3);color:#c9a96e;padding:0.3rem 0.75rem;border-radius:6px;font-size:0.72rem;cursor:pointer;font-family:'DM Sans',sans-serif;">📁 Upload</button>
          <span id="inline-status-${i}" style="font-size:0.7rem;color:#8a7a5a;"></span>
        </div>
        <input type="file" id="inline-file-${i}" accept="image/jpeg,image/jpg,image/png,image/webp" style="display:none;" onchange="uploadInlinePhoto(${i}, this)"/>
      </div>
    </div>`).join('');

  const safeContent = (post.content || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return shell('blog', post.title, `
    <a class="back-link" href="/admin?section=blog">← Back to articles</a>
    ${saved ? '<div class="success">✓ Changes saved successfully</div>' : ''}
    <h1>${post.title}</h1>
    <form method="POST" action="/admin?section=blog&edit=${encodeURIComponent(slug)}">
      <div class="field"><label>Title</label><input type="text" name="title" value="${(post.title || '').replace(/"/g, '&quot;')}"/></div>
      <div class="field"><label>Description</label><textarea name="description" rows="3">${post.description || ''}</textarea></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;">
        <div class="field"><label>Category</label><input type="text" name="category" value="${(post.category || '').replace(/"/g, '&quot;')}" placeholder="e.g. americas, southasia, tips"/></div>
        <div class="field"><label>Publish Date</label><input type="date" name="date_published" value="${post.date_published || ''}"/></div>
        <div class="field"><label>Read Time</label><input type="text" name="read_time" value="${post.read_time || ''}" placeholder="e.g. 12 min read"/></div>
      </div>
      <div class="field"><label class="check-label"><input type="checkbox" name="is_published" value="1" ${post.is_published ? 'checked' : ''}/> Published (visible on blog)</label></div>

      <h2>Cover Photo</h2>
      <div class="photo-row">
        <img id="cover-preview" src="${post.cover_image_url || ''}" alt="" onerror="this.style.opacity=0.15" style="cursor:pointer;" onclick="openPhotoModal()"/>
        <div style="flex:1">
          <div class="photo-tag">Cover image URL — <span style="color:#8a7a5a;font-size:0.72rem;">URL paste করো অথবা নিচের বাটন দিয়ে PC থেকে upload করো</span></div>
          <input type="text" id="cover-url-input" name="cover_image_url" value="${(post.cover_image_url || '').replace(/"/g, '&quot;')}" oninput="updateCoverPreview(this.value)" onpaste="setTimeout(()=>updateCoverPreview(this.value),50)" style="margin-bottom:0.5rem;"/>
          <div style="display:flex;gap:0.6rem;align-items:center;margin-bottom:0.5rem;">
            <button type="button" onclick="document.getElementById('pc-photo-input').click()" style="background:rgba(201,169,110,0.12);border:1px solid rgba(201,169,110,0.3);color:#c9a96e;padding:0.4rem 1rem;border-radius:6px;font-size:0.75rem;cursor:pointer;font-family:'DM Sans',sans-serif;">📁 PC থেকে Upload</button>
            <span id="upload-status" style="font-size:0.72rem;color:#8a7a5a;"></span>
          </div>
          <input type="file" id="pc-photo-input" accept="image/jpeg,image/jpg,image/png,image/webp" style="display:none;" onchange="uploadPhotoFromPC(this)"/>
          <div id="photo-warn" style="display:none;margin-top:0.5rem;padding:0.5rem 0.8rem;background:rgba(200,80,50,0.12);border:1px solid rgba(200,80,50,0.3);border-radius:6px;font-size:0.75rem;color:#e08060;">
            ⚠️ ছবিটি article-এর destination-এর সাথে match করছে কিনা verify করুন।
          </div>
        </div>
      </div>

      <!-- Photo confirm modal -->
      <div id="photo-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:none;align-items:center;justify-content:center;flex-direction:column;gap:1rem;">
        <div style="background:#1a1610;border:1px solid rgba(201,169,110,0.25);border-radius:14px;padding:2rem;max-width:560px;width:90%;text-align:center;">
          <div style="font-size:0.68rem;letter-spacing:0.15em;text-transform:uppercase;color:#c9a96e;margin-bottom:1rem;">Photo Verification</div>
          <img id="modal-img" src="" style="width:100%;height:240px;object-fit:cover;border-radius:8px;margin-bottom:1.2rem;"/>
          <div style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;color:#ede5d5;margin-bottom:0.6rem;" id="modal-title"></div>
          <div style="font-size:0.82rem;color:#8a7a5a;margin-bottom:1.5rem;">এই ছবিটি কি উপরের article-এর destination-এর সাথে সঠিকভাবে match করছে?</div>
          <div style="display:flex;gap:0.8rem;justify-content:center;">
            <button onclick="confirmSave()" style="background:#5a9a6a;color:#fff;border:none;padding:0.6rem 1.5rem;border-radius:7px;font-size:0.82rem;cursor:pointer;font-family:'DM Sans',sans-serif;">✓ হ্যাঁ, ঠিক আছে — Save করো</button>
            <button onclick="closeModal()" style="background:rgba(201,169,110,0.1);color:#c9a96e;border:1px solid rgba(201,169,110,0.25);padding:0.6rem 1.5rem;border-radius:7px;font-size:0.82rem;cursor:pointer;font-family:'DM Sans',sans-serif;">✗ না, ছবি পরিবর্তন করব</button>
          </div>
        </div>
      </div>

      <h2>Inline Photos (Article-এ ছড়িয়ে দেওয়া হবে)</h2>
      <p style="font-size:0.72rem;color:#5a4a2a;margin-bottom:0.85rem;">Content-এ যেখানে photo দিতে চাও সেখানে <strong>[photo-1]</strong>, <strong>[photo-2]</strong>, <strong>[photo-3]</strong> লিখে দাও — ওই জায়গায় ছবি বসবে। ফাঁকা রাখলে skip করবে।</p>
      ${photoInputs}

      <h2>Content HTML (English)</h2>
      <div class="field"><textarea name="content" rows="22" style="font-size:0.72rem;font-family:monospace">${safeContent}</textarea></div>

      <button type="button" class="btn" onclick="checkBeforeSave()">Save Changes</button>
      &nbsp;&nbsp;<a href="/blog/${slug}" target="_blank" class="btn btn-ghost btn-sm">View Live →</a>
    </form>

    <script>
    var _articleTitle = ${JSON.stringify(post.title || '')};
    var _formConfirmed = false;

    async function uploadPhotoFromPC(input) {
      var file = input.files[0];
      if (!file) return;
      var status = document.getElementById('upload-status');
      status.textContent = '⏳ Uploading...';
      status.style.color = '#c9a96e';
      try {
        var base64 = await new Promise(function(resolve, reject) {
          var reader = new FileReader();
          reader.onload = function(e) { resolve(e.target.result.split(',')[1]); };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        var resp = await fetch('/api/admin?section=upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64: base64, filename: file.name, mimeType: file.type, uploadType: 'admin' })
        });
        var data = await resp.json();
        if (!resp.ok) throw new Error(data.error || 'Upload failed');
        var urlInput = document.getElementById('cover-url-input');
        urlInput.value = data.url;
        updateCoverPreview(data.url);
        status.textContent = '✓ Upload সফল!';
        status.style.color = '#6aaa7a';
        setTimeout(function(){ status.textContent = ''; }, 3000);
      } catch(e) {
        status.textContent = '✗ Error: ' + e.message;
        status.style.color = '#e08060';
      }
      input.value = '';
    }

    function updateInlinePreview(idx, url) {
      var img = document.getElementById('inline-preview-' + idx);
      if (url && url.startsWith('http')) { img.src = url; img.style.opacity = 1; }
    }

    async function uploadInlinePhoto(idx, input) {
      var file = input.files[0];
      if (!file) return;
      var status = document.getElementById('inline-status-' + idx);
      status.textContent = '⏳ Uploading...';
      status.style.color = '#c9a96e';
      try {
        var base64 = await new Promise(function(resolve, reject) {
          var reader = new FileReader();
          reader.onload = function(e) { resolve(e.target.result.split(',')[1]); };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        var resp = await fetch('/api/admin?section=upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64: base64, filename: file.name, mimeType: file.type, uploadType: 'admin' })
        });
        var data = await resp.json();
        if (!resp.ok) throw new Error(data.error || 'Upload failed');
        document.getElementById('inline-url-' + idx).value = data.url;
        document.getElementById('inline-preview-' + idx).src = data.url;
        status.textContent = '✓ Done!';
        status.style.color = '#6aaa7a';
        setTimeout(function(){ status.textContent = ''; }, 3000);
      } catch(e) {
        status.textContent = '✗ ' + e.message;
        status.style.color = '#e08060';
      }
      input.value = '';
    }

    function updateCoverPreview(url) {
      var img = document.getElementById('cover-preview');
      if (url && url.startsWith('http')) {
        img.src = url;
        img.style.opacity = 1;
        document.getElementById('photo-warn').style.display = 'none';
      }
    }

    function openPhotoModal() {
      var url = document.getElementById('cover-url-input').value;
      document.getElementById('modal-img').src = url;
      document.getElementById('modal-title').textContent = _articleTitle;
      document.getElementById('photo-modal').style.display = 'flex';
    }

    function closeModal() {
      document.getElementById('photo-modal').style.display = 'none';
      document.getElementById('photo-warn').style.display = 'block';
    }

    function confirmSave() {
      document.getElementById('photo-modal').style.display = 'none';
      _formConfirmed = true;
      document.querySelector('form').submit();
    }

    function checkBeforeSave() {
      if (_formConfirmed) { document.querySelector('form').submit(); return; }
      openPhotoModal();
    }

    // ESC closes modal
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });
    </script>
  `);
}

// ─── Atlas News placeholder ────────────────────────────────────────────────────

function newsPage() {
  return shell('news', 'Atlas News', `
    <h1>Atlas News</h1>
    <div class="placeholder-box">
      <div class="icon">📰</div>
      <p>Atlas News integration coming soon.<br/>This section will be connected when the project is ready.</p>
    </div>
  `);
}

// ─── Community Posts ───────────────────────────────────────────────────────────

async function communityPage(msg = '') {
  const { data: posts } = await sb
    .from('user_posts')
    .select('id, user_name, user_email, title, destination, excerpt, content, cover_photo, status, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  const allPosts = posts || [];
  const pending = allPosts.filter(p => p.status === 'pending');
  const approved = allPosts.filter(p => p.status === 'approved');
  const rejected = allPosts.filter(p => p.status === 'rejected');

  function statusBadge(s) {
    if (s === 'approved') return '<span style="background:rgba(100,180,100,0.15);border:1px solid rgba(100,180,100,0.3);color:#8aba8a;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:0.15rem 0.5rem;border-radius:4px;">Approved</span>';
    if (s === 'rejected') return '<span style="background:rgba(200,100,100,0.12);border:1px solid rgba(200,100,100,0.25);color:#c08080;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:0.15rem 0.5rem;border-radius:4px;">Rejected</span>';
    return '<span style="background:rgba(201,169,110,0.12);border:1px solid rgba(201,169,110,0.25);color:#c9a96e;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:0.15rem 0.5rem;border-radius:4px;">Pending</span>';
  }

  function postRow(p) {
    const date = new Date(p.created_at).toLocaleDateString('en-CA');
    const preview = (p.excerpt || p.content || '').slice(0, 120) + '...';
    return `<tr>
      <td style="padding:0.9rem 1rem;">
        <div style="font-size:0.85rem;color:#e8dcc8;font-weight:500;margin-bottom:0.25rem;">${p.title}</div>
        <div style="font-size:0.72rem;color:#6a5a3a;">${preview}</div>
      </td>
      <td style="padding:0.9rem 1rem;font-size:0.78rem;color:#a8a090;white-space:nowrap;">${p.user_name}<br/><span style="font-size:0.68rem;color:#5a4a2a;">${p.user_email || ''}</span></td>
      <td style="padding:0.9rem 1rem;font-size:0.75rem;color:#7a7060;">${p.destination || '—'}</td>
      <td style="padding:0.9rem 1rem;">${statusBadge(p.status)}</td>
      <td style="padding:0.9rem 1rem;font-size:0.72rem;color:#5a4a2a;white-space:nowrap;">${date}</td>
      <td style="padding:0.9rem 1rem;">
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
          <button onclick="togglePreview('${p.id}')" style="background:rgba(201,169,110,0.1);border:1px solid rgba(201,169,110,0.2);color:#c9a96e;padding:0.3rem 0.7rem;border-radius:5px;font-size:0.72rem;cursor:pointer;font-family:'DM Sans',sans-serif;">👁 View</button>
          ${p.status !== 'approved' ? `<form method="POST" action="/admin?section=community" style="display:inline;"><input type="hidden" name="post_id" value="${p.id}"/><input type="hidden" name="action" value="approve"/><button type="submit" style="background:rgba(100,180,100,0.15);border:1px solid rgba(100,180,100,0.3);color:#8aba8a;padding:0.3rem 0.7rem;border-radius:5px;font-size:0.72rem;cursor:pointer;font-family:'DM Sans',sans-serif;">✓ Approve</button></form>` : ''}
          ${p.status !== 'rejected' ? `<form method="POST" action="/admin?section=community" style="display:inline;"><input type="hidden" name="post_id" value="${p.id}"/><input type="hidden" name="action" value="reject"/><button type="submit" style="background:rgba(200,100,100,0.1);border:1px solid rgba(200,100,100,0.2);color:#c08080;padding:0.3rem 0.7rem;border-radius:5px;font-size:0.72rem;cursor:pointer;font-family:'DM Sans',sans-serif;">✕ Reject</button></form>` : ''}
        </div>
        <div id="preview-${p.id}" style="display:none;margin-top:0.75rem;padding:0.75rem;background:rgba(0,0,0,0.2);border-radius:6px;font-size:0.78rem;color:#a8a090;white-space:pre-wrap;word-break:break-word;max-height:220px;overflow-y:auto;">${p.content || ''}</div>
      </td>
    </tr>`;
  }

  const tableStyle = 'width:100%;border-collapse:collapse;';
  const thStyle = 'padding:0.6rem 1rem;font-size:0.65rem;color:#6a5a3a;letter-spacing:0.1em;text-transform:uppercase;border-bottom:1px solid rgba(201,169,110,0.12);text-align:left;';

  return shell('community', 'Community Posts', `
    <h1>Community Posts <span style="font-size:0.8rem;font-weight:400;color:#6a5a3a;margin-left:0.5rem;">${pending.length} pending · ${approved.length} approved · ${rejected.length} rejected</span></h1>
    ${msg ? `<div style="margin-bottom:1rem;padding:0.65rem 1rem;background:rgba(100,180,100,0.1);border:1px solid rgba(100,180,100,0.25);border-radius:8px;font-size:0.82rem;color:#8aba8a;">${msg}</div>` : ''}

    ${pending.length ? `
    <div style="margin-bottom:2rem;">
      <div style="font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;color:#c9a96e;margin-bottom:0.75rem;">⏳ Pending Review (${pending.length})</div>
      <div style="border:1px solid rgba(201,169,110,0.2);border-radius:10px;overflow:hidden;">
        <table style="${tableStyle}">
          <thead><tr><th style="${thStyle}">Title</th><th style="${thStyle}">Author</th><th style="${thStyle}">Destination</th><th style="${thStyle}">Status</th><th style="${thStyle}">Date</th><th style="${thStyle}">Actions</th></tr></thead>
          <tbody>${pending.map(postRow).join('')}</tbody>
        </table>
      </div>
    </div>` : '<div style="padding:1.5rem;border:1px solid rgba(201,169,110,0.12);border-radius:8px;color:#5a4a2a;font-size:0.82rem;">No pending submissions.</div>'}

    ${approved.length ? `
    <div style="margin-bottom:2rem;margin-top:1.5rem;">
      <div style="font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;color:#8aba8a;margin-bottom:0.75rem;">✓ Approved (${approved.length})</div>
      <div style="border:1px solid rgba(201,169,110,0.15);border-radius:10px;overflow:hidden;">
        <table style="${tableStyle}">
          <thead><tr><th style="${thStyle}">Title</th><th style="${thStyle}">Author</th><th style="${thStyle}">Destination</th><th style="${thStyle}">Status</th><th style="${thStyle}">Date</th><th style="${thStyle}">Actions</th></tr></thead>
          <tbody>${approved.map(postRow).join('')}</tbody>
        </table>
      </div>
    </div>` : ''}

    ${rejected.length ? `
    <div style="margin-top:1.5rem;">
      <div style="font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;color:#c08080;margin-bottom:0.75rem;">✕ Rejected (${rejected.length})</div>
      <div style="border:1px solid rgba(201,169,110,0.12);border-radius:10px;overflow:hidden;">
        <table style="${tableStyle}">
          <thead><tr><th style="${thStyle}">Title</th><th style="${thStyle}">Author</th><th style="${thStyle}">Destination</th><th style="${thStyle}">Status</th><th style="${thStyle}">Date</th><th style="${thStyle}">Actions</th></tr></thead>
          <tbody>${rejected.map(postRow).join('')}</tbody>
        </table>
      </div>
    </div>` : ''}

    <script>
    function togglePreview(id){
      var el=document.getElementById('preview-'+id);
      el.style.display=el.style.display==='none'?'':'none';
    }
    </script>
  `);
}

// ─── Schedule page ─────────────────────────────────────────────────────────────

async function schedulePage(msg) {
  const today = new Date().toISOString().slice(0, 10);

  const { data: posts } = await sb
    .from('blog_posts')
    .select('slug,title,category,date_published,is_published,cover_image_url')
    .order('date_published', { ascending: false });

  const all = posts || [];
  const upcoming = all.filter(p => p.date_published && p.date_published > today);
  const live     = all.filter(p => p.date_published && p.date_published <= today && p.is_published);
  const drafts   = all.filter(p => !p.is_published && (!p.date_published || p.date_published <= today));

  const row = (p, badge, badgeCls) => `
  <tr>
    <td style="width:38px;">
      ${p.cover_image_url
        ? `<img src="${p.cover_image_url}" style="width:36px;height:36px;object-fit:cover;border-radius:4px;display:block;" onerror="this.style.display='none'"/>`
        : `<div style="width:36px;height:36px;background:#2a2010;border-radius:4px;"></div>`}
    </td>
    <td>
      <a href="/admin?section=blog&edit=${encodeURIComponent(p.slug)}" style="color:#e8dcc8;font-size:0.85rem;font-weight:500;">${p.title}</a>
      <div style="font-size:0.68rem;color:#5a4a2a;margin-top:0.1rem;">${p.slug}</div>
    </td>
    <td style="font-size:0.75rem;color:#8a7960;">${p.category ?? '—'}</td>
    <td style="font-size:0.8rem;font-weight:500;color:#c9a96e;">${p.date_published ?? '—'}</td>
    <td><span class="badge ${badgeCls}">${badge}</span></td>
    <td>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <a href="/admin?section=blog&edit=${encodeURIComponent(p.slug)}" class="btn btn-sm btn-ghost">Edit →</a>
        <a href="/blog/${p.slug}" target="_blank" class="btn btn-sm btn-ghost" style="color:#5a4a2a;">View ↗</a>
      </div>
    </td>
  </tr>`;

  const section = (title, rows, emptyMsg) => rows.length
    ? `<h2 style="margin:2rem 0 0.75rem;font-size:1rem;color:#c9a96e;letter-spacing:0.05em;">${title} <span style="font-size:0.72rem;color:#5a4a2a;font-family:'DM Sans',sans-serif;font-weight:400;">(${rows.length})</span></h2>
       <table><thead><tr><th style="width:38px;"></th><th>Title</th><th>Category</th><th>Publish Date</th><th>Status</th><th></th></tr></thead>
       <tbody>${rows.map(p => {
         if (title.includes('Upcoming')) return row(p, '🗓 Scheduled', 'badge-scheduled');
         if (title.includes('Live'))     return row(p, '✓ Live',      'badge-yes');
         return row(p, '○ Draft', 'badge-no');
       }).join('')}</tbody></table>`
    : `<h2 style="margin:2rem 0 0.75rem;font-size:1rem;color:#c9a96e;">${title}</h2><p style="color:#4a3a1a;font-size:0.82rem;padding:0.5rem 0;">${emptyMsg}</p>`;

  return shell('schedule', 'Schedule', `
    <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:0.5rem;">
      <h1>Content Schedule</h1>
      <a href="/admin?section=blog&edit=new" class="btn" style="font-size:0.78rem;">+ New Article</a>
    </div>
    ${msg ? `<div class="success">${msg}</div>` : ''}

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.5rem;">
      <div class="card" style="background:rgba(201,169,110,0.06);border:1px solid rgba(201,169,110,0.15);border-radius:10px;padding:1rem 1.25rem;">
        <div style="font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:#5a4a2a;margin-bottom:0.3rem;">Upcoming / Scheduled</div>
        <div style="font-size:2rem;font-weight:300;color:#c9a96e;font-family:'Cormorant Garamond',serif;">${upcoming.length}</div>
      </div>
      <div class="card" style="background:rgba(100,180,100,0.05);border:1px solid rgba(100,180,100,0.15);border-radius:10px;padding:1rem 1.25rem;">
        <div style="font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:#5a4a2a;margin-bottom:0.3rem;">Published &amp; Live</div>
        <div style="font-size:2rem;font-weight:300;color:#8aba8a;font-family:'Cormorant Garamond',serif;">${live.length}</div>
      </div>
      <div class="card" style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:1rem 1.25rem;">
        <div style="font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:#5a4a2a;margin-bottom:0.3rem;">Drafts</div>
        <div style="font-size:2rem;font-weight:300;color:#6a5a3a;font-family:'Cormorant Garamond',serif;">${drafts.length}</div>
      </div>
    </div>

    ${section('🗓 Upcoming / Scheduled', upcoming, 'No scheduled posts — create one from Blog Articles.')}
    ${section('✓ Live Articles', live, 'No published articles yet.')}
    ${section('○ Drafts', drafts, 'No drafts.')}

    <style>
      .badge-scheduled{background:rgba(201,169,110,0.15);border:1px solid rgba(201,169,110,0.3);color:#c9a96e;}
    </style>
  `);
}

// ─── Save article ──────────────────────────────────────────────────────────────

async function saveArticle(slug, body) {
  const { data: post } = await sb.from('blog_posts').select('content').eq('slug', slug).single();
  let content = body.content || post?.content || '';
  content = content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

  // Collect inline photos (up to 5 slots), filter empty
  const inlinePhotos = [];
  for (let i = 0; i < 5; i++) {
    const url = (body[`inline_photo_${i}`] || '').trim();
    inlinePhotos.push(url); // keep empty strings to preserve slot order
  }
  // Trim trailing empties
  while (inlinePhotos.length && !inlinePhotos[inlinePhotos.length - 1]) inlinePhotos.pop();

  await sb.from('blog_posts').update({
    title: body.title,
    description: body.description,
    category: body.category,
    read_time: body.read_time,
    date_published: body.date_published || null,
    is_published: body.is_published === '1',
    cover_image_url: body.cover_image_url,
    content,
    inline_photos: inlinePhotos,
  }).eq('slug', slug);
}

// ─── Handler ───────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const section = url.searchParams.get('section') || 'overview';
  const editSlug = url.searchParams.get('edit');
  const saved = url.searchParams.get('saved') === '1';
  const logout = url.searchParams.get('logout') === '1';

  res.setHeader('Cache-Control', 'no-store');

  // Logout
  if (logout) {
    res.setHeader('Set-Cookie', 'atlas_admin=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict');
    res.setHeader('Location', '/admin');
    return res.status(302).end();
  }

  // ── Upload (base64 JSON body) ──────────────────────────────────────────────
  if (req.method === 'POST' && section === 'upload') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let body;
    try { body = JSON.parse(await readBody(req)); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }
    const { base64, filename = 'photo.jpg', mimeType = 'image/jpeg', uploadType = 'admin' } = body;
    const isPublicUpload = uploadType === 'comment' || uploadType === 'community';
    if (!isPublicUpload && !isAuthed(req)) return res.status(401).json({ error: 'Unauthorized' });
    const allowed = ['image/jpeg','image/jpg','image/png','image/webp'];
    if (!allowed.includes(mimeType)) return res.status(400).json({ error: 'Only JPEG, PNG, WebP allowed' });
    if (!base64) return res.status(400).json({ error: 'No image data' });
    const buffer = Buffer.from(base64, 'base64');
    if (buffer.length > 3 * 1024 * 1024) return res.status(400).json({ error: 'Max 3MB' });
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
    const bucket = isPublicUpload ? 'comment-photos' : 'blog-images';
    const folder = isPublicUpload ? 'uploads' : 'covers';
    const path = `${folder}/${Date.now()}-${safeName}`;
    const { error } = await sb.storage.from(bucket).upload(path, buffer, { contentType: mimeType, upsert: false });
    if (error) return res.status(500).json({ error: error.message });
    const { data: { publicUrl } } = sb.storage.from(bucket).getPublicUrl(path);
    return res.status(200).json({ url: publicUrl });
  }

  // POST
  if (req.method === 'POST') {
    const body = parseBody(await readBody(req));

    // Login
    if (!editSlug && section !== 'community') {
      if (body.password === PASSWORD) {
        res.setHeader('Set-Cookie', `atlas_admin=${TOKEN}; Path=/; Max-Age=86400; HttpOnly; SameSite=Strict`);
        res.setHeader('Location', '/admin');
        return res.status(302).end();
      }
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(401).send(loginPage('Wrong password — try again.'));
    }

    if (!isAuthed(req)) { res.setHeader('Location', '/admin'); return res.status(302).end(); }

    // Community post approve/reject
    if (section === 'community') {
      const { post_id, action: postAction } = body;
      if (post_id && (postAction === 'approve' || postAction === 'reject')) {
        const newStatus = postAction === 'approve' ? 'approved' : 'rejected';
        const updateData = { status: newStatus, updated_at: new Date().toISOString() };
        if (postAction === 'approve') {
          updateData.slug = 'community-' + post_id.slice(0, 8);
        }
        await sb.from('user_posts').update(updateData).eq('id', post_id);
        res.setHeader('Location', `/admin?section=community&msg=${postAction === 'approve' ? 'approved' : 'rejected'}`);
        return res.status(302).end();
      }
      res.setHeader('Location', '/admin?section=community');
      return res.status(302).end();
    }

    // Save article — check if newly publishing to trigger push notifications
    const wasPublished = await (async () => {
      const { data } = await sb.from('blog_posts').select('is_published').eq('slug', editSlug).single();
      return data?.is_published ?? false;
    })();
    await saveArticle(editSlug, body);
    const nowPublished = body.is_published === '1';
    if (!wasPublished && nowPublished) {
      // Newly published — send push + newsletter email (fire and forget)
      sendBlogPushNotifications(body.title, editSlug, body.description).catch(() => {});
      sendNewsletterEmails(body.title, editSlug, body.description, body.hero_emoji).catch(() => {});
    }
    res.setHeader('Location', `/admin?section=blog&edit=${encodeURIComponent(editSlug)}&saved=1`);
    return res.status(302).end();
  }

  // GET — not logged in
  if (!isAuthed(req)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(loginPage());
  }

  // GET — logged in
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (section === 'blog') {
    if (editSlug) return res.status(200).send(await blogEditorPage(editSlug, saved));
    return res.status(200).send(await blogListPage());
  }
  if (section === 'schedule') return res.status(200).send(await schedulePage(url.searchParams.get('msg') || ''));
  if (section === 'news') return res.status(200).send(newsPage());
  if (section === 'community') {
    const msgParam = req.query.msg;
    const msgText = msgParam === 'approved' ? '✓ Post approved and is now live on the blog.'
      : msgParam === 'rejected' ? '✓ Post has been rejected.' : '';
    return res.status(200).send(await communityPage(msgText));
  }
  return res.status(200).send(await overviewPage());
}
