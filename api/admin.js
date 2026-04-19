import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const sb = createClient(
  'https://prffhhkemxibujjjiyhg.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

const PASSWORD = process.env.ADMIN_PASSWORD || 'atlas2024admin';
const TOKEN = createHash('sha256').update(PASSWORD).digest('hex');

const CSS = `
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#141210;color:#ede5d5;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;min-height:100vh;}
a{color:#c9a96e;text-decoration:none;}
a:hover{text-decoration:underline;}
.container{max-width:960px;margin:0 auto;padding:2.5rem 1.5rem 5rem;}
header{display:flex;align-items:center;justify-content:space-between;margin-bottom:2.5rem;padding-bottom:1.25rem;border-bottom:1px solid rgba(201,169,110,0.15);}
.logo{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:300;letter-spacing:0.3em;color:#d4aa6e;text-transform:uppercase;}
h1{font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:300;color:#e8dcc8;margin-bottom:1.5rem;}
h2{font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:300;color:#c9a96e;margin:1.5rem 0 0.75rem;}
table{width:100%;border-collapse:collapse;font-size:0.82rem;margin-bottom:2rem;}
th{text-align:left;padding:0.5rem 0.75rem;color:#c9a96e;font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;border-bottom:1px solid rgba(201,169,110,0.2);}
td{padding:0.55rem 0.75rem;color:#a8a090;border-bottom:1px solid rgba(201,169,110,0.07);}
tr:hover td{background:rgba(201,169,110,0.03);}
.btn{display:inline-block;background:#c9a96e;color:#1c1914;border:none;border-radius:7px;padding:0.55rem 1.2rem;font-size:0.8rem;font-weight:600;cursor:pointer;letter-spacing:0.05em;font-family:'DM Sans',sans-serif;}
.btn:hover{background:#e0c080;text-decoration:none;}
.btn-sm{padding:0.3rem 0.75rem;font-size:0.72rem;}
.btn-ghost{background:transparent;border:1px solid rgba(201,169,110,0.3);color:#c9a96e;}
.btn-ghost:hover{background:rgba(201,169,110,0.08);text-decoration:none;}
.badge{display:inline-block;padding:0.15rem 0.5rem;border-radius:3px;font-size:0.65rem;letter-spacing:0.06em;text-transform:uppercase;}
.badge-yes{background:rgba(100,200,100,0.1);color:#7ada7a;}
.badge-no{background:rgba(255,255,255,0.05);color:#6a5a3a;}
.field{margin-bottom:1.25rem;}
label{display:block;font-size:0.7rem;color:#6a5a3a;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.4rem;}
input[type=text],input[type=number],textarea{width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(201,169,110,0.2);border-radius:7px;padding:0.6rem 0.85rem;color:#ede5d5;font-size:0.82rem;font-family:'DM Sans',sans-serif;outline:none;}
input[type=text]:focus,input[type=number]:focus,textarea:focus{border-color:rgba(201,169,110,0.5);}
textarea{resize:vertical;line-height:1.5;}
.check-row{display:flex;align-items:center;gap:0.6rem;font-size:0.82rem;color:#a8a090;}
input[type=checkbox]{width:16px;height:16px;accent-color:#c9a96e;}
.photo-row{display:flex;align-items:center;gap:1rem;margin-bottom:1rem;padding:0.75rem;background:rgba(201,169,110,0.03);border:1px solid rgba(201,169,110,0.1);border-radius:8px;}
.photo-row img{width:80px;height:60px;object-fit:cover;border-radius:5px;flex-shrink:0;background:#2a2420;}
.photo-row input{flex:1;}
.photo-label{font-size:0.7rem;color:#6a5a3a;margin-bottom:0.35rem;}
.success-banner{background:rgba(100,200,100,0.1);border:1px solid rgba(100,200,100,0.25);border-radius:8px;padding:0.75rem 1rem;margin-bottom:1.5rem;font-size:0.82rem;color:#7ada7a;}
.back{font-size:0.75rem;color:#6a5a3a;margin-bottom:1.5rem;display:inline-block;}
.back:hover{color:#c9a96e;}
/* Login */
.login-wrap{display:flex;align-items:center;justify-content:center;min-height:100vh;}
.login-box{text-align:center;width:320px;}
.login-logo{font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:300;letter-spacing:0.35em;color:#d4aa6e;text-transform:uppercase;margin-bottom:0.5rem;}
.login-sub{font-size:0.72rem;color:#5a4a2a;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:2rem;}
.login-box input[type=password]{width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(201,169,110,0.2);border-radius:8px;padding:0.7rem 1rem;color:#ede5d5;font-size:0.9rem;font-family:'DM Sans',sans-serif;outline:none;margin-bottom:0.85rem;text-align:center;letter-spacing:0.2em;}
.login-box input[type=password]:focus{border-color:rgba(201,169,110,0.5);}
.login-box .btn{width:100%;padding:0.7rem;}
.login-err{color:#c06050;font-size:0.78rem;margin-top:0.5rem;}
`;

const HEAD = `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Atlas Admin</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>${CSS}</style></head><body>`;

function parseCookies(req) {
  const raw = req.headers.cookie || '';
  return Object.fromEntries(raw.split(';').map(c => c.trim().split('=').map(decodeURIComponent)));
}

function parseBody(str) {
  const params = new URLSearchParams(str);
  const out = {};
  for (const [k, v] of params) out[k] = v;
  return out;
}

function isAuthed(req) {
  const cookies = parseCookies(req);
  return cookies['atlas_admin'] === TOKEN;
}

function loginPage(err = '') {
  return HEAD + `
<div class="login-wrap">
  <div class="login-box">
    <div class="login-logo">Atlas</div>
    <div class="login-sub">Admin Panel</div>
    <form method="POST" action="/admin">
      <input type="password" name="password" placeholder="Password" autofocus/>
      <button type="submit" class="btn">Enter →</button>
      ${err ? `<p class="login-err">${err}</p>` : ''}
    </form>
  </div>
</div></body></html>`;
}

async function dashboardPage() {
  const { data: posts } = await sb
    .from('blog_posts')
    .select('slug, title, category, date_published, is_published')
    .order('date_published', { ascending: false });

  const rows = (posts || []).map(p => `
    <tr>
      <td><a href="/admin?edit=${p.slug}">${p.title}</a></td>
      <td>${p.category || '—'}</td>
      <td>${p.date_published || '—'}</td>
      <td><span class="badge ${p.is_published ? 'badge-yes' : 'badge-no'}">${p.is_published ? 'Live' : 'Draft'}</span></td>
      <td><a href="/admin?edit=${encodeURIComponent(p.slug)}" class="btn btn-sm">Edit →</a></td>
    </tr>`).join('');

  return HEAD + `
<div class="container">
  <header>
    <span class="logo">Atlas Admin</span>
    <a href="/admin?logout=1" class="btn btn-ghost btn-sm">Logout</a>
  </header>
  <h1>Blog Articles</h1>
  <table>
    <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Status</th><th></th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</div></body></html>`;
}

async function editorPage(slug, saved = false) {
  const { data: post } = await sb
    .from('blog_posts')
    .select('slug,title,description,read_time,is_published,cover_image_url,content')
    .eq('slug', slug)
    .single();

  if (!post) return HEAD + `<div class="container"><p style="padding:3rem;color:#c06050">Article not found: ${slug}</p></div></body></html>`;

  // Extract inline images from content
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
  let match;
  const imgs = [];
  while ((match = imgRegex.exec(post.content || '')) !== null) {
    imgs.push({ full: match[0], src: match[1] });
  }

  const photoInputs = imgs.map((img, i) => `
    <div class="photo-row">
      <img src="${img.src}" alt="Photo ${i + 1}" onerror="this.style.opacity=0.2"/>
      <div style="flex:1">
        <div class="photo-label">Photo ${i + 1}</div>
        <input type="text" name="img_${i}" value="${img.src}" placeholder="Image URL"/>
        <input type="hidden" name="img_orig_${i}" value="${img.src.replace(/"/g, '&quot;')}"/>
      </div>
    </div>`).join('');

  return HEAD + `
<div class="container">
  <header>
    <span class="logo">Atlas Admin</span>
    <a href="/admin?logout=1" class="btn btn-ghost btn-sm">Logout</a>
  </header>
  <a href="/admin" class="back">← Back to articles</a>
  ${saved ? '<div class="success-banner">✓ Saved successfully</div>' : ''}
  <h1>${post.title}</h1>
  <form method="POST" action="/admin?edit=${encodeURIComponent(slug)}">

    <div class="field">
      <label>Title</label>
      <input type="text" name="title" value="${(post.title || '').replace(/"/g, '&quot;')}"/>
    </div>

    <div class="field">
      <label>Description</label>
      <textarea name="description" rows="3">${post.description || ''}</textarea>
    </div>

    <div class="field">
      <label>Read Time (e.g. "8 min read")</label>
      <input type="text" name="read_time" value="${post.read_time || ''}"/>
    </div>

    <div class="field">
      <label class="check-row">
        <input type="checkbox" name="is_published" value="1" ${post.is_published ? 'checked' : ''}/>
        Published (visible on blog)
      </label>
    </div>

    <h2>Cover Photo</h2>
    <div class="photo-row">
      <img src="${post.cover_image_url || ''}" alt="Cover" onerror="this.style.opacity=0.2"/>
      <div style="flex:1">
        <div class="photo-label">Cover image URL</div>
        <input type="text" name="cover_image_url" value="${(post.cover_image_url || '').replace(/"/g, '&quot;')}"/>
      </div>
    </div>

    ${imgs.length > 0 ? `<h2>Inline Photos (${imgs.length})</h2>${photoInputs}` : ''}

    <h2>Content HTML (English)</h2>
    <div class="field">
      <textarea name="content" rows="20" style="font-size:0.75rem;font-family:monospace;">${(post.content || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
    </div>

    <button type="submit" class="btn">Save Changes</button>
    &nbsp;<a href="/blog/${slug}" target="_blank" class="btn btn-ghost btn-sm">View Live →</a>
  </form>
</div></body></html>`;
}

async function saveArticle(slug, body) {
  const post = await sb.from('blog_posts').select('content').eq('slug', slug).single();
  let content = body.content || post.data?.content || '';

  // Decode HTML entities in textarea output
  content = content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

  // Replace inline image srcs
  let i = 0;
  while (body[`img_orig_${i}`] !== undefined) {
    const orig = body[`img_orig_${i}`];
    const newSrc = body[`img_${i}`] || orig;
    if (orig !== newSrc) {
      content = content.replaceAll(orig, newSrc);
    }
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

async function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
  });
}

export default async function handler(req, res) {
  const { method } = req;
  const url = new URL(req.url, `https://${req.headers.host}`);
  const editSlug = url.searchParams.get('edit');
  const logout = url.searchParams.get('logout');
  const saved = url.searchParams.get('saved') === '1';

  // Logout
  if (logout) {
    res.setHeader('Set-Cookie', 'atlas_admin=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict');
    res.setHeader('Location', '/admin');
    return res.status(302).end();
  }

  // POST — login or save
  if (method === 'POST') {
    const rawBody = await readBody(req);
    const body = parseBody(rawBody);

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
    if (!isAuthed(req)) {
      res.setHeader('Location', '/admin');
      return res.status(302).end();
    }
    await saveArticle(editSlug, body);
    res.setHeader('Location', `/admin?edit=${encodeURIComponent(editSlug)}&saved=1`);
    return res.status(302).end();
  }

  // GET
  if (!isAuthed(req)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(loginPage());
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  if (editSlug) {
    return res.status(200).send(await editorPage(editSlug, saved));
  }
  return res.status(200).send(await dashboardPage());
}
