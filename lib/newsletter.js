// "The Atlas Dispatch" travel newsletter, sent with Resend from noreply@getatlas.ca.
// Sent only from the admin panel: a test to support@ first, then to all active subscribers
// (Supabase table newsletter_subscribers, unsubscribed = false). Read-only on the database.
//
// CASL: every email names the sender, gives a mailing address and a working unsubscribe link.
// The mailing address comes from NEWSLETTER_MAILING_ADDRESS in Vercel; without it, the send to
// subscribers is refused (the test send still works).

const SITE = 'https://getatlas.ca';
const FROM = process.env.NEWSLETTER_FROM || 'Atlas Travel <noreply@getatlas.ca>';
const REPLY_TO = 'support@getatlas.ca';
const BATCH = 100; // Resend batch endpoint limit

const GOLD = '#b8894a';
const INK = '#1c1914';
const MUTED = '#6b6253';

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function unsubscribeUrl(email) {
  return `${SITE}/api/subscribe?email=${encodeURIComponent(email)}`;
}

export async function latestPosts(sb, count = 3) {
  const { data, error } = await sb
    .from('blog_posts')
    .select('slug,title,description,cover_image_url,date_published')
    .eq('is_published', true)
    .order('date_published', { ascending: false })
    .limit(count);
  if (error) throw new Error(`blog posts: ${error.message}`);
  return data || [];
}

export async function activeSubscribers(sb) {
  const out = [];
  for (let from = 0; from < 100000; from += 1000) {
    const { data, error } = await sb
      .from('newsletter_subscribers')
      .select('email')
      .eq('unsubscribed', false)
      .range(from, from + 999);
    if (error) throw new Error(`subscribers: ${error.message}`);
    // Keep the stored spelling: the unsubscribe link matches on it exactly.
    for (const r of data || []) if (r.email && r.email.includes('@')) out.push(r.email.trim());
    if (!data || data.length < 1000) break;
  }
  const seen = new Set();
  return out.filter((e) => (seen.has(e.toLowerCase()) ? false : (seen.add(e.toLowerCase()), true)));
}

export function buildNewsletter({ posts, email, now = new Date(), mailingAddress = process.env.NEWSLETTER_MAILING_ADDRESS || '' }) {
  const month = now.toLocaleString('en-CA', { month: 'long', year: 'numeric', timeZone: 'America/Toronto' });
  const subject = posts[0] ? `The Atlas Dispatch: ${posts[0].title}` : `The Atlas Dispatch, ${month}`;
  const unsub = unsubscribeUrl(email);
  const address = mailingAddress ? esc(mailingAddress) : '[mailing address missing]';

  const cards = posts.map((p) => {
    const url = `${SITE}/blog/${encodeURIComponent(p.slug)}`;
    const img = /^https?:\/\//.test(p.cover_image_url || '')
      ? `<a href="${url}"><img src="${esc(p.cover_image_url)}" alt="" width="560" style="display:block;width:100%;max-width:560px;height:auto;border-radius:8px;margin:0 0 12px;"></a>`
      : '';
    return `<tr><td style="padding:0 0 28px;">${img}
      <a href="${url}" style="font-family:Georgia,serif;font-size:21px;line-height:1.3;color:${INK};text-decoration:none;">${esc(p.title)}</a>
      <p style="margin:8px 0 10px;font-size:15px;line-height:1.6;color:${MUTED};">${esc(p.description || '')}</p>
      <a href="${url}" style="font-size:14px;color:${GOLD};font-weight:bold;text-decoration:none;">Read the guide</a></td></tr>`;
  }).join('');

  const html = `<!doctype html><html><body style="margin:0;background:#f4f1ea;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;font-family:Arial,Helvetica,sans-serif;">
<tr><td style="padding:28px 20px 8px;">
  <div style="font-size:12px;letter-spacing:2px;color:${GOLD};font-weight:bold;">ATLAS TRAVEL</div>
  <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:28px;color:${INK};margin:6px 0 4px;">The Atlas Dispatch</h1>
  <p style="margin:0 0 20px;font-size:14px;color:${MUTED};">${esc(month)} · New travel guides from the Atlas blog</p>
</td></tr>
<tr><td style="padding:0 20px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${cards}</table></td></tr>
<tr><td style="padding:4px 20px 24px;">
  <a href="${SITE}/travel" style="display:inline-block;background:${INK};color:#ffffff;padding:12px 20px;border-radius:999px;font-size:14px;text-decoration:none;">Plan a trip with Atlas</a>
</td></tr>
<tr><td style="padding:18px 20px 26px;border-top:1px solid #eee;font-size:12px;line-height:1.6;color:${MUTED};">
  You are receiving this because you subscribed to the Atlas Travel newsletter at getatlas.ca.<br>
  <a href="${unsub}" style="color:${MUTED};">Unsubscribe</a> · Questions? Reply to this email or write to support@getatlas.ca.<br>
  Atlas AI Technologies · ${address}
</td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    'The Atlas Dispatch',
    `${month} · New travel guides from the Atlas blog`,
    '',
    ...posts.flatMap((p) => [p.title, p.description || '', `${SITE}/blog/${p.slug}`, '']),
    `Plan a trip with Atlas: ${SITE}/travel`,
    '',
    'You are receiving this because you subscribed to the Atlas Travel newsletter at getatlas.ca.',
    `Unsubscribe: ${unsub}`,
    'Questions? Write to support@getatlas.ca.',
    `Atlas AI Technologies · ${mailingAddress || '[mailing address missing]'}`,
  ].join('\n');

  return {
    subject,
    html,
    text,
    headers: { 'List-Unsubscribe': `<${unsub}>, <mailto:${REPLY_TO}?subject=unsubscribe>` },
  };
}

export async function newsletterStatus({ sb }) {
  const [posts, subs] = await Promise.all([latestPosts(sb), activeSubscribers(sb)]);
  return {
    status: 'ok',
    subscribers: subs.length,
    posts: posts.map((p) => ({ slug: p.slug, title: p.title })),
    hasResendKey: Boolean(process.env.RESEND_API_KEY),
    hasMailingAddress: Boolean(process.env.NEWSLETTER_MAILING_ADDRESS),
  };
}

export async function sendNewsletterTest({ sb, fetchImpl = fetch, apiKey = process.env.RESEND_API_KEY, to = process.env.NEWSLETTER_TEST_TO || REPLY_TO }) {
  if (!apiKey) return { status: 'missing_resend_key' };
  const posts = await latestPosts(sb);
  if (!posts.length) return { status: 'no_posts' };
  const email = buildNewsletter({ posts, email: to });
  const res = await fetchImpl('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], reply_to: REPLY_TO, subject: `[Test] ${email.subject}`, html: email.html, text: email.text, headers: email.headers }),
  });
  if (!res.ok) return { status: 'error', error: `Resend ${res.status}: ${(await res.text().catch(() => '')).slice(0, 200)}` };
  return { status: 'test_sent', to };
}

/** Send to every active subscriber. The admin must pass confirm: "SEND". */
export async function sendNewsletter({ sb, confirm, fetchImpl = fetch, apiKey = process.env.RESEND_API_KEY, now = new Date() }) {
  if (confirm !== 'SEND') return { status: 'not_confirmed' };
  if (!apiKey) return { status: 'missing_resend_key' };
  if (!process.env.NEWSLETTER_MAILING_ADDRESS) return { status: 'missing_mailing_address' };
  const [posts, subs] = await Promise.all([latestPosts(sb), activeSubscribers(sb)]);
  if (!posts.length) return { status: 'no_posts' };
  if (!subs.length) return { status: 'no_subscribers' };
  // Same posts + same day => same idempotency keys, so a double click does not send twice.
  const day = now.toISOString().slice(0, 10);
  const issue = `${day}-${posts.map((p) => p.slug).join('+')}`.slice(0, 200);
  let sent = 0;
  for (let i = 0; i < subs.length; i += BATCH) {
    const chunk = subs.slice(i, i + BATCH);
    const res = await fetchImpl('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `dispatch-${issue}-${i / BATCH}` },
      body: JSON.stringify(chunk.map((to) => {
        const e = buildNewsletter({ posts, email: to, now });
        return { from: FROM, to: [to], reply_to: REPLY_TO, subject: e.subject, html: e.html, text: e.text, headers: e.headers };
      })),
    });
    if (!res.ok) return { status: 'error', sent, total: subs.length, error: `Resend ${res.status}: ${(await res.text().catch(() => '')).slice(0, 200)}` };
    sent += chunk.length;
  }
  return { status: 'sent', sent, total: subs.length };
}
