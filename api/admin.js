import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const sb = createClient(
  'https://prffhhkemxibujjjiyhg.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

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
    .select('slug,title,description,read_time,is_published,cover_image_url,content')
    .eq('slug', slug)
    .single();

  if (!post) return shell('blog', 'Not Found', `<p style="color:#c06050;padding:2rem">Article not found: ${slug}</p>`);

  const imgs = [];
  const imgRe = /<img[^>]+src="([^"]+)"[^>]*>/gi;
  let m;
  while ((m = imgRe.exec(post.content || '')) !== null) imgs.push({ src: m[1] });

  const photoInputs = imgs.map((img, i) => `
    <div class="photo-row">
      <img src="${img.src}" alt="" onerror="this.style.opacity=0.15"/>
      <div style="flex:1">
        <div class="photo-tag">Photo ${i + 1}</div>
        <input type="text" name="img_${i}" value="${img.src.replace(/"/g, '&quot;')}"/>
        <input type="hidden" name="img_orig_${i}" value="${img.src.replace(/"/g, '&quot;')}"/>
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
      <div class="field"><label>Read Time</label><input type="text" name="read_time" value="${post.read_time || ''}"/></div>
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

      ${imgs.length > 0 ? `<h2>Inline Photos (${imgs.length})</h2>${photoInputs}` : ''}

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
        var resp = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': file.type,
            'x-filename': file.name
          },
          body: file
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

// ─── Save article ──────────────────────────────────────────────────────────────

async function saveArticle(slug, body) {
  const { data: post } = await sb.from('blog_posts').select('content').eq('slug', slug).single();
  let content = body.content || post?.content || '';
  content = content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

  let i = 0;
  while (body[`img_orig_${i}`] !== undefined) {
    const orig = body[`img_orig_${i}`];
    const next = body[`img_${i}`] || orig;
    if (orig !== next) content = content.split(orig).join(next);
    i++;
  }

  await sb.from('blog_posts').update({
    title: body.title,
    description: body.description,
    read_time: body.read_time,
    is_published: body.is_published === '1',
    cover_image_url: body.cover_image_url,
    content,
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

  // POST
  if (req.method === 'POST') {
    const body = parseBody(await readBody(req));

    // Login
    if (!editSlug) {
      if (body.password === PASSWORD) {
        res.setHeader('Set-Cookie', `atlas_admin=${TOKEN}; Path=/; Max-Age=86400; HttpOnly; SameSite=Strict`);
        res.setHeader('Location', '/admin');
        return res.status(302).end();
      }
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(401).send(loginPage('Wrong password — try again.'));
    }

    // Save article
    if (!isAuthed(req)) { res.setHeader('Location', '/admin'); return res.status(302).end(); }
    await saveArticle(editSlug, body);
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
  if (section === 'news') return res.status(200).send(newsPage());
  return res.status(200).send(await overviewPage());
}
