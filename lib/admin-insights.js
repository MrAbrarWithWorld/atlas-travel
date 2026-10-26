// Read-only numbers and checks for the admin panel (/admin), served through api/admin.js.
// Nothing here writes to the database except moderateCommunityPost, which repeats the old
// admin's approve/reject. Never return secret values: environment keys are reported as yes/no.

const SITE = 'https://getatlas.ca';
const DAY = 86_400_000;

async function safe(fn) {
  try {
    return await fn();
  } catch (e) {
    return { error: e?.message || 'failed' };
  }
}

async function count(query) {
  return safe(async () => {
    const { count: n, error } = await query;
    if (error) throw new Error(error.message);
    return n ?? 0;
  });
}

async function accountNumbers(sb, now) {
  let total = 0, new7 = 0, new30 = 0, active7 = 0;
  for (let page = 1; page < 50; page++) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(error.message);
    const users = data?.users || [];
    for (const u of users) {
      if (u.deleted_at) continue;
      total += 1;
      const created = Date.parse(u.created_at || '');
      const seen = Date.parse(u.last_sign_in_at || '');
      if (created >= now - 7 * DAY) new7 += 1;
      if (created >= now - 30 * DAY) new30 += 1;
      if (seen >= now - 7 * DAY) active7 += 1;
    }
    if (users.length < 1000) break;
  }
  return { total, new7, new30, active7 };
}

async function subscriptionNumbers(sb, now) {
  const nowIso = new Date(now).toISOString();
  const { data, error } = await sb
    .from('subscriptions')
    .select('plan,provider,status,current_period_end')
    .eq('status', 'active')
    .or(`current_period_end.is.null,current_period_end.gte.${nowIso}`);
  if (error) throw new Error(error.message);
  const byPlan = {};
  const byChannel = { website: 0, googlePlay: 0 };
  for (const s of data || []) {
    const plan = s.plan || 'unknown';
    byPlan[plan] = (byPlan[plan] || 0) + 1;
    if (s.provider === 'google_play') byChannel.googlePlay += 1;
    else byChannel.website += 1;
  }
  return { active: (data || []).length, byPlan, byChannel };
}

async function aiCostThisMonth(sb, now) {
  const d = new Date(now);
  const since = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString();
  let usd = 0, calls = 0;
  for (let from = 0; from < 200_000; from += 1000) {
    const { data, error } = await sb.from('api_usage_log').select('cost_usd').gte('created_at', since).range(from, from + 999);
    if (error) throw new Error(error.message);
    for (const r of data || []) {
      usd += Number(r.cost_usd) || 0;
      calls += 1;
    }
    if (!data || data.length < 1000) break;
  }
  return { usd: Math.round(usd * 100) / 100, calls, since: since.slice(0, 10) };
}

export async function adminOverview(sb, now = Date.now()) {
  const [accounts, subscriptions, aiCost, freeAccess, savedTrips, sharedTrips, newsletter, push, communityPending, postsLive, postsDraft] =
    await Promise.all([
      safe(() => accountNumbers(sb, now)),
      safe(() => subscriptionNumbers(sb, now)),
      safe(() => aiCostThisMonth(sb, now)),
      count(sb.from('allowed_users').select('*', { count: 'exact', head: true })),
      count(sb.from('saved_plans').select('*', { count: 'exact', head: true })),
      count(sb.from('saved_plans').select('*', { count: 'exact', head: true }).eq('is_public', true)),
      count(sb.from('newsletter_subscribers').select('*', { count: 'exact', head: true }).eq('unsubscribed', false)),
      count(sb.from('push_subscriptions').select('*', { count: 'exact', head: true })),
      count(sb.from('user_posts').select('*', { count: 'exact', head: true }).eq('status', 'pending')),
      count(sb.from('blog_posts').select('*', { count: 'exact', head: true }).eq('is_published', true)),
      count(sb.from('blog_posts').select('*', { count: 'exact', head: true }).eq('is_published', false)),
    ]);
  return {
    accounts, subscriptions, aiCost, freeAccess, savedTrips, sharedTrips, newsletter, push,
    communityPending, postsLive, postsDraft, generatedAt: new Date(now).toISOString(),
  };
}

export async function listCommunityPosts(sb) {
  const { data, error } = await sb
    .from('user_posts')
    .select('id,user_name,user_email,title,destination,excerpt,content,cover_photo,status,created_at')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return (data || []).map((p) => ({ ...p, content: (p.content || '').slice(0, 6000) }));
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Same rules as the old HTML admin: approving gives the post its community slug.
export async function moderateCommunityPost(sb, postId, decision) {
  if (typeof postId !== 'string' || !UUID.test(postId)) throw new Error('Invalid post');
  if (decision !== 'approve' && decision !== 'reject') throw new Error('Invalid action');
  const update = { status: decision === 'approve' ? 'approved' : 'rejected', updated_at: new Date().toISOString() };
  if (decision === 'approve') update.slug = 'community-' + postId.slice(0, 8);
  const { error } = await sb.from('user_posts').update(update).eq('id', postId);
  if (error) throw new Error(error.message);
  return { ok: true, status: update.status };
}

const HEALTH_PAGES = [
  '/', '/services', '/pricing', '/faq', '/contact', '/travel', '/blog',
  '/privacy', '/terms', '/legal/services/privacy', '/legal/services/terms', '/account/delete', '/sitemap.xml',
];

async function timed(url, init = {}) {
  const started = Date.now();
  try {
    const res = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(9000), ...init });
    return { status: res.status, ms: Date.now() - started, res };
  } catch (e) {
    return { status: 0, ms: Date.now() - started, error: e?.name === 'TimeoutError' ? 'timeout' : 'unreachable' };
  }
}

export async function siteHealth() {
  const headers = { 'user-agent': 'AtlasAdminHealth/1.0' };
  const pages = await Promise.all(
    HEALTH_PAGES.map(async (path) => {
      const r = await timed(SITE + path, { headers });
      return { path, status: r.status, ms: r.ms, error: r.error };
    }),
  );

  let legal = null;
  let termsBannerLive = null;
  const v = await timed(SITE + '/legal/versions.json', { headers });
  if (v.res?.ok) {
    try { legal = (await v.res.json())?.docs || null; } catch { legal = null; }
  }
  // Vercel Web Analytics serves this script only when it is switched on for the project.
  const a = await timed(SITE + '/_vercel/insights/script.js', { headers });
  const analyticsOn = a.status === 200;
  const t = await timed(SITE + '/terms', { headers });
  if (t.res?.ok) {
    try { termsBannerLive = /take effect on/i.test(await t.res.text()); } catch { termsBannerLive = null; }
  }

  const keys = {
    'Legal-update emails': !!process.env.RESEND_API_KEY,
    'Website chat (main AI)': !!process.env.ANTHROPIC_API_KEY,
    'Website chat (backup AI)': !!process.env.GROQ_API_KEY,
    'Contact form → CRM': !!process.env.ATLAS_CRM_WEBHOOK_URL,
    'Stripe payments': !!process.env.STRIPE_SECRET_KEY,
    'Push notifications': !!process.env.VAPID_PRIVATE_KEY,
  };

  return {
    checkedAt: new Date().toISOString(),
    pages,
    legal,
    termsBannerLive,
    analyticsOn,
    keys,
    version: {
      commit: (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7) || null,
      message: (process.env.VERCEL_GIT_COMMIT_MESSAGE || '').split('\n')[0].slice(0, 120) || null,
      environment: process.env.VERCEL_ENV || 'local',
    },
  };
}

// One real question to the website assistant (costs one AI answer).
export async function chatTest() {
  const r = await timed(SITE + '/api/lead-intake?mode=ask', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: SITE, 'user-agent': 'AtlasAdminHealth/1.0' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'In one sentence, what does Atlas AI Technologies do?' }] }),
  });
  let reply = null;
  if (r.res) {
    try { reply = (await r.res.json())?.reply || null; } catch { reply = null; }
  }
  const ok = r.status === 200 && !!reply && !/can't answer right now/i.test(reply);
  return { ok, status: r.status, ms: r.ms, reply: reply ? reply.slice(0, 300) : null, error: r.error };
}
