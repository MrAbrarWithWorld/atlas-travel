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

export function buildEmail(docs, now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  const names = docs.map((d) => d.shortTitle);
  const subject = `Atlas AI Travel Planner: updates to our ${names.join(' and ')}`;
  const upcoming = docs.filter((d) => d.effective > today);

  const textParts = ['Hi,', '', 'We have updated the legal documents for the Atlas AI Travel Planner.', ''];
  for (const d of docs) {
    const when = d.effective > today ? `takes effect on ${formatDate(d.effective)}` : `in effect from ${formatDate(d.effective)}`;
    textParts.push(`${d.shortTitle} (${when}): ${d.url}`);
    if (d.notice) textParts.push(d.notice);
    textParts.push('');
  }
  for (const d of upcoming) {
    textParts.push(
      `Until ${formatDate(d.effective)}, the previous ${d.shortTitle} apply. If you don't agree with the new version, you can cancel your subscription and delete your account at ${SITE}/account/delete before then.`,
      '',
    );
  }
  textParts.push(
    'This is a service notice sent to all Atlas AI Travel Planner account holders. For questions, write to support@getatlas.ca.',
    '',
    'Atlas AI Travel Planner',
    'Atlas AI Technologies, Toronto, Canada',
  );
  const text = textParts.join('\n');

  const p = (s) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#2b2620;">${s}</p>`;
  const docHtml = docs
    .map((d) => {
      const when = d.effective > today ? `takes effect on ${formatDate(d.effective)}` : `in effect from ${formatDate(d.effective)}`;
      return p(`<strong><a href="${esc(d.url)}" style="color:#8a6a2a;">${esc(d.shortTitle)}</a></strong> (${esc(when)})${d.notice ? `<br>${esc(d.notice)}` : ''}`);
    })
    .join('');
  const upcomingHtml = upcoming
    .map((d) => p(`Until ${esc(formatDate(d.effective))}, the previous ${esc(d.shortTitle)} apply. If you don't agree with the new version, you can cancel your subscription and delete your account at <a href="${SITE}/account/delete" style="color:#8a6a2a;">getatlas.ca/account/delete</a> before then.`))
    .join('');
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:24px 12px;background:#f6f3ee;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e6dfd3;border-radius:10px;padding:24px;">
${p('Hi,')}${p('We have updated the legal documents for the Atlas AI Travel Planner.')}${docHtml}${upcomingHtml}
<p style="margin:18px 0 0;font-size:12.5px;line-height:1.6;color:#7a7266;">This is a service notice sent to all Atlas AI Travel Planner account holders. For questions, write to <a href="mailto:support@getatlas.ca" style="color:#8a6a2a;">support@getatlas.ca</a>.<br>Atlas AI Travel Planner · Atlas AI Technologies, Toronto, Canada</p>
</div></body></html>`;
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
    for (const u of users) if (u.email && !u.deleted_at) out.push({ id: u.id, email: u.email });
    if (users.length < 1000) break;
  }
  return out;
}

async function sendBatch({ fetchImpl, apiKey, idempotencyKey, email, recipients }) {
  const res = await fetchImpl('https://api.resend.com/emails/batch', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(
      recipients.map((r) => ({
        from: FROM,
        to: [r.email],
        reply_to: REPLY_TO,
        subject: email.subject,
        text: email.text,
        html: email.html,
      })),
    ),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 200)}`);
  }
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

  const email = buildEmail(docs, now);
  try {
    const recipients = await listRecipients(sb);
    const sent = new Set(state.sentIds);
    const pending = recipients.filter((r) => !sent.has(r.id));
    state.total = recipients.length;

    for (let i = 0; i < pending.length; i += BATCH) {
      if (i > 0 && Date.now() - started > timeBudgetMs) break; // always make progress: at least one batch per run
      const chunk = pending.slice(i, i + BATCH);
      await sendBatch({ fetchImpl, apiKey, idempotencyKey: `legal-${key.id}-${chunk[0].id}`, email, recipients: chunk });
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
