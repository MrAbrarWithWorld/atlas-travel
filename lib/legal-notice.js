// Automatic email notice to Atlas AI Travel Planner account holders when a Travel Planner
// legal document (Privacy Policy, Terms of Service) gets a new version.
//
// - What changed: https://getatlas.ca/legal/versions.json, a static file built from
//   content/legal/travel/*.md at every deploy (version, effective date, short "notice" text).
// - Who gets it: every Supabase Auth user with an email address, once per set of versions.
// - Sender: Resend (RESEND_API_KEY), from noreply@getatlas.ca, replies go to support@getatlas.ca.
// - Progress: private Supabase Storage bucket "system-state", one JSON file per notice, holding
//   only the user IDs already emailed (no email addresses), so a run can resume safely.
// - Runs from the daily cron (api/cron-report.js) and the admin "Send now" button (api/admin.js).
//
// No new serverless function: this module is imported by the two existing ones.
import { createHash } from 'crypto';

const SITE = 'https://getatlas.ca';
const BUCKET = 'system-state';
const FROM = process.env.LEGAL_NOTICE_FROM || 'Atlas AI Travel Planner <noreply@getatlas.ca>';
const REPLY_TO = 'support@getatlas.ca';
const BATCH = 100; // Resend batch API limit
const ANNOUNCE_WINDOW_DAYS = 30; // only announce documents effective within the last 30 days or later
const LOCK_MS = 90_000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function formatDate(iso) {
  const d = new Date(`${iso}T12:00:00Z`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function formatShort(iso) {
  const d = new Date(`${iso}T12:00:00Z`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/** The Travel Planner documents that should be announced now (may be empty). */
export async function getAnnouncedDocs({ fetchImpl = fetch, now = new Date() } = {}) {
  const res = await fetchImpl(`${SITE}/legal/versions.json`, { headers: { 'Cache-Control': 'no-cache' } });
  if (!res.ok) throw new Error(`versions.json returned ${res.status}`);
  const { docs = [] } = await res.json();
  const cutoff = new Date(now.getTime() - ANNOUNCE_WINDOW_DAYS * 86_400_000).toISOString().slice(0, 10);
  return docs
    .filter((d) => d.set === 'travel' && d.effective && d.effective >= cutoff)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function noticeKey(docs) {
  const raw = docs.map((d) => `${d.slug}@${d.version}@${d.effective}`).join('|');
  return { raw, id: createHash('sha256').update(raw).digest('hex').slice(0, 16) };
}

/** First name for the greeting, from the Google profile. Never stored. */
export function firstName(user) {
  const raw = String(user?.user_metadata?.full_name || user?.user_metadata?.name || '').trim();
  if (!raw || raw.includes('@')) return '';
  const first = raw.split(/\s+/)[0].replace(/[^\p{L}\p{M}'-]/gu, '');
  return first.length >= 2 && first.length <= 30 ? first : '';
}

/** Split a document's "notice" summary into bullet points (separated by ";"). */
function bullets(notice) {
  return String(notice || '')
    .split(';')
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => b.charAt(0).toUpperCase() + b.slice(1));
}

export function buildEmail(docs, now = new Date(), { name = '' } = {}) {
  const hi = name ? `Hi ${name},` : 'Hi,';
  const today = now.toISOString().slice(0, 10);
  const names = docs.map((d) => d.shortTitle);
  const subject = `We've updated our ${names.join(' and ')}`;
  const upcoming = docs.filter((d) => d.effective > today);
  const lastUpcoming = upcoming.map((d) => d.effective).sort().pop();
  const whenLabel = (d) => (d.effective > today ? `Takes effect ${formatDate(d.effective)}` : `In effect from ${formatDate(d.effective)}`);
  const badgeLabel = (d) => (d.effective > today ? `Takes effect · ${formatShort(d.effective)}` : `In effect · ${formatShort(d.effective)}`);
  const preheader = docs
    .map((d) => `${d.shortTitle}: ${d.effective > today ? `changes on ${formatDate(d.effective)}` : 'updated'}`)
    .join(' · ');

  // ---------- plain text ----------
  const t = [
    `We've updated our ${names.join(' and ')}`,
    '',
    hi,
    '',
    'We want you to know exactly how the Atlas AI Travel Planner works and how we handle your information. Here is what changed.',
    '',
  ];
  for (const d of docs) {
    t.push(`${d.shortTitle.toUpperCase()} (${whenLabel(d)})`);
    for (const b of bullets(d.notice)) t.push(`- ${b}`);
    t.push(`Read it: ${d.url}`, '');
  }
  t.push('WHAT YOU NEED TO DO');
  if (upcoming.length) {
    t.push(
      `Nothing. Until ${formatDate(lastUpcoming)}, the previous ${upcoming.map((d) => d.shortTitle).join(' and ')} apply. If you don't agree with the new version, you can cancel your subscription and delete your account at ${SITE}/account/delete before then.`,
    );
  } else {
    t.push(`Nothing. You can read the full documents any time at ${SITE}/legal.`);
  }
  t.push(
    '',
    'Questions? Write to support@getatlas.ca. We are happy to help.',
    '',
    '--',
    'Atlas AI Travel Planner',
    `Privacy Policy: ${SITE}/privacy | Terms of Service: ${SITE}/terms | Delete account: ${SITE}/account/delete`,
    "You're receiving this service notice because you have an Atlas AI Travel Planner account. Notices about our terms and privacy go to all account holders.",
    `(c) ${now.getUTCFullYear()} Atlas AI Technologies (${SITE}), Toronto, Canada`,
  );
  const text = t.join('\n');

  // ---------- HTML (table layout + inline styles for email clients) ----------
  const GOLD = '#c9a96e';
  const CREAM = '#ede5d5';
  const BODY = '#c8bfae';
  const MUTED = '#8a7d66';
  const BG = '#0e0c08';
  const CARD = '#17140f';
  const PANEL = '#1f1b14';
  const LINE = '#3a3122';
  const serif = "Georgia,'Times New Roman',serif";
  const sans = "-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

  const button = (href, label) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0 2px;"><tr><td bgcolor="${GOLD}" style="border-radius:8px;">
<a href="${esc(href)}" style="display:inline-block;padding:12px 22px;font-family:${sans};font-size:14px;font-weight:700;letter-spacing:0.02em;color:#1c1914;text-decoration:none;border-radius:8px;">${esc(label)} &rarr;</a></td></tr></table>`;

  const docPanel = (d) => {
    const isUpcoming = d.effective > today;
    const badgeBg = isUpcoming ? '#2a2216' : '#1d2a1c';
    const badgeFg = isUpcoming ? '#e6c27a' : '#9fd39a';
    const items = bullets(d.notice)
      .map((b) => `<tr><td valign="top" style="padding:0 10px 8px 0;font-family:${sans};font-size:15px;line-height:1.55;color:${GOLD};">&#9679;</td><td style="padding:0 0 8px;font-family:${sans};font-size:15px;line-height:1.55;color:${BODY};">${esc(b)}</td></tr>`)
      .join('');
    return `<tr><td style="padding:0 32px 18px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${PANEL}" style="background:${PANEL};border:1px solid ${LINE};border-radius:12px;">
<tr><td style="padding:22px 22px 20px;">
<div style="font-family:${sans};font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;"><span style="display:inline-block;background:${badgeBg};color:${badgeFg};padding:5px 10px;border-radius:999px;white-space:nowrap;">${esc(badgeLabel(d))}</span></div>
<h2 style="margin:14px 0 12px;font-family:${serif};font-size:22px;font-weight:400;line-height:1.3;color:${CREAM};">${esc(d.shortTitle)}</h2>
${items ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0">${items}</table>` : ''}
${button(d.url, `Read the ${d.shortTitle}`)}
</td></tr></table></td></tr>`;
  };

  const todo = upcoming.length
    ? `<strong style="color:${CREAM};">Nothing.</strong> Until ${esc(formatDate(lastUpcoming))}, the previous ${esc(upcoming.map((d) => d.shortTitle).join(' and '))} apply. If you don't agree with the new version, you can cancel your subscription and <a href="${SITE}/account/delete" style="color:${GOLD};text-decoration:underline;">delete your account</a> before then.`
    : `<strong style="color:${CREAM};">Nothing.</strong> You can read the full documents any time at <a href="${SITE}/legal" style="color:${GOLD};text-decoration:underline;">getatlas.ca/legal</a>.`;

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light"><meta name="supported-color-schemes" content="dark light">
<title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${BG};" bgcolor="${BG}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${BG};font-size:1px;line-height:1px;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
<tr><td align="center" style="padding:28px 12px 36px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

<tr><td align="center" style="padding:6px 0 22px;">
<a href="${SITE}/travel" style="text-decoration:none;"><img src="${SITE}/atlas-icon-512.png" width="56" height="56" alt="Atlas" style="display:block;border:0;border-radius:14px;margin:0 auto 12px;"></a>
<div style="font-family:${serif};font-size:22px;letter-spacing:0.42em;color:${GOLD};text-transform:uppercase;padding-left:0.42em;">Atlas</div>
<div style="font-family:${sans};font-size:10.5px;letter-spacing:0.28em;color:${MUTED};text-transform:uppercase;margin-top:6px;">AI Travel Planner</div>
</td></tr>

<tr><td bgcolor="${CARD}" style="background:${CARD};border:1px solid ${LINE};border-radius:16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="height:4px;line-height:4px;font-size:0;background:${GOLD};border-radius:16px 16px 0 0;">&nbsp;</td></tr>
<tr><td style="padding:30px 32px 8px;">
<div style="font-family:${sans};font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${GOLD};">Account notice</div>
<h1 style="margin:10px 0 14px;font-family:${serif};font-size:28px;font-weight:400;line-height:1.25;color:${CREAM};">We've updated our ${esc(names.join(' and '))}</h1>
<p style="margin:0 0 10px;font-family:${sans};font-size:15.5px;line-height:1.65;color:${BODY};">${esc(hi)}</p>
<p style="margin:0 0 22px;font-family:${sans};font-size:15.5px;line-height:1.65;color:${BODY};">We want you to know exactly how the Atlas AI Travel Planner works and how we handle your information. Here is what changed.</p>
</td></tr>
${docs.map(docPanel).join('')}
<tr><td style="padding:4px 32px 26px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-left:3px solid ${GOLD};">
<tr><td style="padding:4px 0 4px 16px;">
<div style="font-family:${sans};font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${GOLD};margin-bottom:6px;">What you need to do</div>
<div style="font-family:${sans};font-size:15px;line-height:1.6;color:${BODY};">${todo}</div>
</td></tr></table>
</td></tr>
<tr><td style="padding:0 32px 30px;">
<p style="margin:0;font-family:${sans};font-size:15px;line-height:1.6;color:${BODY};">Questions? Write to <a href="mailto:support@getatlas.ca" style="color:${GOLD};text-decoration:underline;">support@getatlas.ca</a>. We're happy to help.</p>
</td></tr>
</table></td></tr>

<tr><td align="center" style="padding:24px 20px 0;font-family:${sans};font-size:12.5px;line-height:1.7;color:${MUTED};">
<a href="${SITE}/privacy" style="color:${BODY};text-decoration:none;">Privacy Policy</a> &nbsp;&middot;&nbsp;
<a href="${SITE}/terms" style="color:${BODY};text-decoration:none;">Terms of Service</a> &nbsp;&middot;&nbsp;
<a href="${SITE}/account/delete" style="color:${BODY};text-decoration:none;">Delete account</a> &nbsp;&middot;&nbsp;
<a href="${SITE}/travel" style="color:${BODY};text-decoration:none;">Open Atlas</a>
<div style="margin-top:12px;">You're receiving this service notice because you have an Atlas AI Travel Planner account. Notices about our terms and privacy go to all account holders.</div>
<div style="margin-top:6px;">&copy; ${now.getUTCFullYear()} <a href="${SITE}" style="color:${MUTED};text-decoration:underline;">Atlas AI Technologies</a> &middot; Toronto, Canada</div>
</td></tr>

</table></td></tr></table>
</body></html>`;
  return { subject, text, html };
}

async function ensureBucket(sb) {
  const { error } = await sb.storage.createBucket(BUCKET, { public: false });
  if (error && !/exist/i.test(error.message || '')) throw new Error(`storage bucket: ${error.message}`);
}

async function loadState(sb, id) {
  const { data, error } = await sb.storage.from(BUCKET).download(`legal-notices/${id}.json`);
  if (error || !data) return null;
  try { return JSON.parse(await data.text()); } catch { return null; }
}

async function saveState(sb, id, state) {
  const body = Buffer.from(JSON.stringify(state));
  const { error } = await sb.storage.from(BUCKET).upload(`legal-notices/${id}.json`, body, {
    upsert: true,
    contentType: 'application/json',
  });
  if (error) throw new Error(`save state: ${error.message}`);
}

async function listRecipients(sb) {
  const out = [];
  for (let page = 1; page < 1000; page++) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(`list users: ${error.message}`);
    const users = data?.users || [];
    for (const u of users) if (u.email && !u.deleted_at) out.push({ id: u.id, email: u.email, name: firstName(u) });
    if (users.length < 1000) break;
  }
  return out;
}

async function sendBatch({ fetchImpl, apiKey, idempotencyKey, emailFor, recipients }) {
  const res = await fetchImpl('https://api.resend.com/emails/batch', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(
      recipients.map((r) => {
        const email = emailFor(r);
        return { from: FROM, to: [r.email], reply_to: REPLY_TO, subject: email.subject, text: email.text, html: email.html };
      }),
    ),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 200)}`);
  }
}

/** Send the current notice to one address (default support@getatlas.ca) to check it before everyone gets it. */
export async function sendLegalNoticeTest({ fetchImpl = fetch, now = new Date(), apiKey = process.env.RESEND_API_KEY, to = process.env.LEGAL_NOTICE_TEST_TO || REPLY_TO }) {
  if (!apiKey) return { status: 'missing_resend_key' };
  const docs = await getAnnouncedDocs({ fetchImpl, now });
  if (!docs.length) return { status: 'nothing_to_announce' };
  const email = buildEmail(docs, now);
  const res = await fetchImpl('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], reply_to: REPLY_TO, subject: `[Test] ${email.subject}`, text: email.text, html: email.html }),
  });
  if (!res.ok) return { status: 'error', error: `Resend ${res.status}: ${(await res.text().catch(() => '')).slice(0, 200)}` };
  return { status: 'test_sent', to };
}

/** Current status, without sending anything (admin panel). */
export async function legalNoticeStatus({ sb, fetchImpl = fetch, now = new Date() }) {
  const docs = await getAnnouncedDocs({ fetchImpl, now });
  if (!docs.length) return { status: 'nothing_to_announce', docs: [] };
  const key = noticeKey(docs);
  await ensureBucket(sb);
  const state = await loadState(sb, key.id);
  return {
    status: state?.status || 'not_started',
    key: key.raw,
    docs: docs.map(({ slug, version, effective, shortTitle }) => ({ slug, version, effective, shortTitle })),
    total: state?.total ?? null,
    sent: state?.sentIds?.length ?? 0,
    lastRunAt: state?.lastRunAt ?? null,
    lastError: state?.lastError ?? null,
    hasResendKey: Boolean(process.env.RESEND_API_KEY),
  };
}

/** Send any pending notice, within a time budget. Safe to call repeatedly (resumes, never re-sends). */
export async function runLegalNotices({ sb, fetchImpl = fetch, timeBudgetMs = 20_000, now = new Date(), apiKey = process.env.RESEND_API_KEY }) {
  const started = Date.now();
  if (!apiKey) return { status: 'missing_resend_key' };
  const docs = await getAnnouncedDocs({ fetchImpl, now });
  if (!docs.length) return { status: 'nothing_to_announce' };

  const key = noticeKey(docs);
  await ensureBucket(sb);
  let state = (await loadState(sb, key.id)) || { key: key.raw, status: 'sending', createdAt: now.toISOString(), sentIds: [] };
  if (state.status === 'done') return { status: 'done', key: key.raw, total: state.total, sent: state.sentIds.length };
  if (state.lockUntil && state.lockUntil > Date.now()) return { status: 'busy', key: key.raw, sent: state.sentIds.length };

  state.lockUntil = Date.now() + LOCK_MS;
  state.lastRunAt = now.toISOString();
  await saveState(sb, key.id, state);

  const emailFor = (r) => buildEmail(docs, now, { name: r.name });
  try {
    const recipients = await listRecipients(sb);
    const sent = new Set(state.sentIds);
    const pending = recipients.filter((r) => !sent.has(r.id));
    state.total = recipients.length;

    for (let i = 0; i < pending.length; i += BATCH) {
      if (i > 0 && Date.now() - started > timeBudgetMs) break; // always make progress: at least one batch per run
      const chunk = pending.slice(i, i + BATCH);
      await sendBatch({ fetchImpl, apiKey, idempotencyKey: `legal-${key.id}-${chunk[0].id}`, emailFor, recipients: chunk });
      for (const r of chunk) state.sentIds.push(r.id);
      state.lastError = null;
      await saveState(sb, key.id, state);
      if (i + BATCH < pending.length) await sleep(600); // stay under Resend's rate limit
    }

    const remaining = recipients.filter((r) => !new Set(state.sentIds).has(r.id)).length;
    if (remaining === 0) {
      state.status = 'done';
      state.completedAt = new Date().toISOString();
    }
    state.lockUntil = 0;
    await saveState(sb, key.id, state);
    return { status: state.status === 'done' ? 'done' : 'in_progress', key: key.raw, total: state.total, sent: state.sentIds.length, remaining };
  } catch (err) {
    state.lastError = String(err.message || err).slice(0, 300);
    state.lockUntil = 0;
    await saveState(sb, key.id, state).catch(() => {});
    return { status: 'error', key: key.raw, error: state.lastError, total: state.total ?? null, sent: state.sentIds.length };
  }
}
