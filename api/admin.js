import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://prffhhkemxibujjjiyhg.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

const ADMIN_EMAIL = 'smfahimabrar93@gmail.com';

function html(stats) {
  const fmt = n => n?.toLocaleString() ?? '—';
  const money = n => n != null ? `$${Number(n).toFixed(2)}` : '—';

  const statCard = (label, value, sub) => `
  <div class="card">
    <div class="card-label">${label}</div>
    <div class="card-value">${value}</div>
    ${sub ? `<div class="card-sub">${sub}</div>` : ''}
  </div>`;

  const tableRows = (rows, cols) => rows.map(r =>
    `<tr>${cols.map(c => `<td>${r[c] ?? '—'}</td>`).join('')}</tr>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Admin — ATLAS</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#141210;color:#ede5d5;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;min-height:100vh;}
.container{max-width:1100px;margin:0 auto;padding:2.5rem 1.5rem 5rem;}
header{display:flex;align-items:center;justify-content:space-between;margin-bottom:2.5rem;padding-bottom:1.25rem;border-bottom:1px solid rgba(201,169,110,0.15);}
.logo{display:flex;align-items:center;gap:0.6rem;text-decoration:none;}
.logo span{font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:300;letter-spacing:0.3em;color:#d4aa6e;text-transform:uppercase;}
.header-right{font-size:0.7rem;color:#5a4a2a;letter-spacing:0.1em;text-transform:uppercase;}
h2{font-family:'Cormorant Garamond',serif;font-size:1.25rem;font-weight:300;color:#c9a96e;margin:2rem 0 1rem;letter-spacing:0.05em;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1rem;margin-bottom:0.5rem;}
.card{background:rgba(201,169,110,0.05);border:1px solid rgba(201,169,110,0.15);border-radius:10px;padding:1.1rem 1.25rem;}
.card-label{font-size:0.65rem;color:#6a5a3a;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:0.5rem;}
.card-value{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;color:#e8dcc8;line-height:1;}
.card-sub{font-size:0.72rem;color:#7a6a50;margin-top:0.35rem;}
table{width:100%;border-collapse:collapse;font-size:0.8rem;margin-bottom:2rem;}
th{text-align:left;padding:0.5rem 0.75rem;color:#c9a96e;font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;border-bottom:1px solid rgba(201,169,110,0.2);}
td{padding:0.5rem 0.75rem;color:#a8a090;border-bottom:1px solid rgba(201,169,110,0.07);}
tr:hover td{background:rgba(201,169,110,0.03);}
.badge{display:inline-block;padding:0.15rem 0.5rem;border-radius:3px;font-size:0.65rem;letter-spacing:0.06em;text-transform:uppercase;}
.badge-pro{background:rgba(201,169,110,0.15);color:#c9a96e;}
.badge-free{background:rgba(255,255,255,0.05);color:#6a5a3a;}
.refresh{font-size:0.65rem;color:#5a4a2a;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border:1px solid rgba(201,169,110,0.15);padding:0.4rem 0.85rem;border-radius:5px;}
.refresh:hover{color:#c9a96e;border-color:rgba(201,169,110,0.35);}
.section{margin-bottom:0.5rem;}
</style>
</head>
<body>
<div class="container">
  <header>
    <a href="/" class="logo">
      <svg width="24" height="24" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><circle cx="200" cy="200" r="170" fill="none" stroke="#c9a96e" stroke-width="2.2"/><circle cx="200" cy="200" r="130" fill="none" stroke="#8a6a3a" stroke-width="1"/><circle cx="200" cy="200" r="18" fill="#c9a96e"/></svg>
      <span>Atlas Admin</span>
    </a>
    <div style="display:flex;align-items:center;gap:1rem;">
      <span class="header-right">Last updated: ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })} ET</span>
      <a href="/admin" class="refresh">↻ Refresh</a>
    </div>
  </header>

  <h2>Overview</h2>
  <div class="grid">
    ${statCard('Total Users', fmt(stats.totalUsers))}
    ${statCard('Pro Subscribers', fmt(stats.proUsers), 'active subscriptions')}
    ${statCard('New Users (30d)', fmt(stats.newUsers30d))}
    ${statCard('Saved Plans', fmt(stats.savedPlans))}
    ${statCard('Public Trips', fmt(stats.publicTrips))}
    ${statCard('Blog Posts', fmt(stats.blogPosts))}
    ${statCard('MRR (est.)', money(stats.mrr), 'from subscriptions')}
    ${statCard('API Calls (7d)', fmt(stats.apiCalls7d))}
  </div>

  <div class="section">
    <h2>Recent Users</h2>
    <table>
      <thead><tr><th>Email</th><th>Created</th><th>Plan</th></tr></thead>
      <tbody>
        ${stats.recentUsers.map(u => `
        <tr>
          <td>${u.email ?? '—'}</td>
          <td>${u.created_at ? new Date(u.created_at).toLocaleDateString('en-CA') : '—'}</td>
          <td><span class="badge ${u.plan === 'pro' ? 'badge-pro' : 'badge-free'}">${u.plan ?? 'free'}</span></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Recent Saved Plans</h2>
    <table>
      <thead><tr><th>Title / Destination</th><th>User</th><th>Saved</th><th>Public</th></tr></thead>
      <tbody>
        ${stats.recentPlans.map(p => `
        <tr>
          <td>${p.title ?? p.destination ?? '—'}</td>
          <td style="font-size:0.75rem;color:#6a5a3a;">${p.user_email ?? '—'}</td>
          <td>${p.created_at ? new Date(p.created_at).toLocaleDateString('en-CA') : '—'}</td>
          <td>${p.is_public ? '✓' : '—'}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Recent Blog Posts</h2>
    <table>
      <thead><tr><th>Title</th><th>Category</th><th>Published</th></tr></thead>
      <tbody>
        ${stats.recentBlog.map(b => `
        <tr>
          <td><a href="/blog/${b.slug}" style="color:#c9a96e;text-decoration:none;">${b.title}</a></td>
          <td style="font-size:0.75rem;color:#6a5a3a;">${b.category}</td>
          <td>${b.date_published}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>
</body>
</html>`;
}

export default async function handler(req, res) {
  // Auth check via Supabase session token
  const token = req.cookies?.['sb-prffhhkemxibujjjiyhg-auth-token']
    || req.headers?.authorization?.replace('Bearer ', '');

  if (token) {
    const { data: { user }, error } = await sb.auth.getUser(token);
    if (error || !user || user.email !== ADMIN_EMAIL) {
      return res.status(403).send('<h1 style="font-family:sans-serif;padding:2rem;color:#c00">Access denied.</h1>');
    }
  } else {
    // No token — show simple password gate via query param secret
    const secret = req.query.secret;
    if (secret !== process.env.ADMIN_SECRET) {
      return res.status(401).send(`<!DOCTYPE html><html><head><title>Admin Login</title>
<style>body{background:#141210;color:#ede5d5;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;}
form{text-align:center;} input{background:#2a2420;border:1px solid rgba(201,169,110,0.3);color:#ede5d5;padding:0.6rem 1rem;border-radius:6px;font-size:0.9rem;margin-bottom:0.75rem;display:block;width:240px;}
button{background:#c9a96e;color:#1c1914;border:none;padding:0.6rem 1.5rem;border-radius:6px;font-weight:600;cursor:pointer;font-size:0.85rem;}
label{font-size:0.75rem;color:#6a5a3a;letter-spacing:0.1em;text-transform:uppercase;display:block;margin-bottom:0.4rem;}</style>
</head><body><form method="GET" action="/admin"><label>Admin Password</label>
<input type="password" name="secret" autofocus/><button type="submit">Enter</button></form></body></html>`);
    }
  }

  // Gather stats in parallel
  const [
    { count: totalUsers },
    { count: proUsers },
    { count: newUsers30d },
    { count: savedPlans },
    { count: publicTrips },
    { count: blogPosts },
    { count: apiCalls7d },
    { data: recentUsers },
    { data: recentPlans },
    { data: recentBlog },
    { data: subData }
  ] = await Promise.all([
    sb.from('allowed_users').select('*', { count: 'exact', head: true }),
    sb.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    sb.from('allowed_users').select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString()),
    sb.from('saved_plans').select('*', { count: 'exact', head: true }),
    sb.from('saved_plans').select('*', { count: 'exact', head: true }).eq('is_public', true),
    sb.from('blog_posts').select('*', { count: 'exact', head: true }).eq('is_published', true),
    sb.from('api_usage_log').select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
    sb.from('allowed_users').select('email, created_at, plan').order('created_at', { ascending: false }).limit(10),
    sb.from('saved_plans').select('title, destination, user_email, created_at, is_public').order('created_at', { ascending: false }).limit(10),
    sb.from('blog_posts').select('slug, title, category, date_published').order('date_published', { ascending: false }).limit(10),
    sb.from('subscriptions').select('amount, currency').eq('status', 'active')
  ]);

  // Calculate MRR
  const mrr = (subData || []).reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

  const stats = {
    totalUsers: totalUsers || 0,
    proUsers: proUsers || 0,
    newUsers30d: newUsers30d || 0,
    savedPlans: savedPlans || 0,
    publicTrips: publicTrips || 0,
    blogPosts: blogPosts || 0,
    apiCalls7d: apiCalls7d || 0,
    mrr,
    recentUsers: recentUsers || [],
    recentPlans: recentPlans || [],
    recentBlog: recentBlog || []
  };

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).send(html(stats));
}
