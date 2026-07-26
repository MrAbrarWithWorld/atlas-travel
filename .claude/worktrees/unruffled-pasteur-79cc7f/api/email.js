import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '../lib/send-email.js';

const SUPABASE_URL = 'https://prffhhkemxibujjjiyhg.supabase.co';

function welcomeHtml(displayName, email) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to Atlas</title>
</head>
<body style="margin:0;padding:0;background:#1a1510;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1510;padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- Header -->
      <tr><td style="text-align:center;padding:40px 0 32px;">
        <div style="font-size:13px;letter-spacing:4px;color:#c9a96e;text-transform:uppercase;margin-bottom:16px;">Atlas Travel</div>
        <div style="font-size:36px;color:#e8dcc8;font-weight:400;line-height:1.2;">Welcome to Atlas, ${displayName}! 🌍</div>
      </td></tr>

      <!-- Divider -->
      <tr><td style="padding:0 40px;">
        <div style="border-top:1px solid #2e2519;"></div>
      </td></tr>

      <!-- Body -->
      <tr><td style="padding:36px 40px;">
        <p style="color:#b5a48a;font-size:17px;line-height:1.8;margin:0 0 20px;">
          You can now plan unlimited trips with AI — from visa requirements and flight routes to day-by-day itineraries and hidden gems only locals know about.
        </p>
        <p style="color:#b5a48a;font-size:17px;line-height:1.8;margin:0 0 32px;">
          Just tell Atlas where you want to go, your budget, and how many days — and watch a complete travel plan come together in seconds.
        </p>

        <!-- CTA -->
        <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
          <tr><td align="center" style="border-radius:4px;background:#c9a96e;">
            <a href="https://getatlas.ca" style="display:inline-block;padding:16px 40px;color:#1a1510;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:1px;font-family:Georgia,serif;">
              Start Planning
            </a>
          </td></tr>
        </table>
      </td></tr>

      <!-- Feature highlights -->
      <tr><td style="padding:0 40px 36px;">
        <div style="border-top:1px solid #2e2519;margin-bottom:32px;"></div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="33%" style="text-align:center;padding:0 10px;">
              <div style="font-size:24px;margin-bottom:8px;">✈️</div>
              <div style="color:#c9a96e;font-size:13px;letter-spacing:1px;margin-bottom:6px;">FLIGHT ROUTES</div>
              <div style="color:#8a7a60;font-size:13px;line-height:1.5;">Real durations &amp; booking links</div>
            </td>
            <td width="33%" style="text-align:center;padding:0 10px;">
              <div style="font-size:24px;margin-bottom:8px;">🛂</div>
              <div style="color:#c9a96e;font-size:13px;letter-spacing:1px;margin-bottom:6px;">VISA GUIDANCE</div>
              <div style="color:#8a7a60;font-size:13px;line-height:1.5;">Passport-specific advice</div>
            </td>
            <td width="33%" style="text-align:center;padding:0 10px;">
              <div style="font-size:24px;margin-bottom:8px;">💎</div>
              <div style="color:#c9a96e;font-size:13px;letter-spacing:1px;margin-bottom:6px;">HIDDEN GEMS</div>
              <div style="color:#8a7a60;font-size:13px;line-height:1.5;">Off-the-beaten-path spots</div>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding:24px 40px 40px;text-align:center;">
        <div style="border-top:1px solid #2e2519;margin-bottom:24px;"></div>
        <p style="color:#4a3f30;font-size:12px;line-height:1.7;margin:0;">
          You're receiving this because you created an Atlas account.<br>
          <a href="https://getatlas.ca/api/subscribe?email=${encodeURIComponent(email)}" style="color:#6a5a40;text-decoration:underline;">Unsubscribe</a> &nbsp;·&nbsp;
          <a href="https://getatlas.ca" style="color:#6a5a40;text-decoration:underline;">getatlas.ca</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// POST /api/email?action=welcome  — { email, name }
async function handleWelcome(req, res) {
  const { email, name } = req.body || {};
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });

  const displayName = name?.split(' ')[0] || 'Traveler';
  await sendEmail({
    to: email,
    subject: `Welcome to Atlas, ${displayName}! 🌍`,
    html: welcomeHtml(displayName, email),
  });
  return res.status(200).json({ ok: true });
}

// POST /api/email?action=newsletter  — { subject, html }  (requires x-admin-key)
async function handleNewsletter(req, res) {
  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { subject, html } = req.body || {};
  if (!subject || !html) return res.status(400).json({ error: 'Missing subject/html' });

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) return res.status(500).json({ error: 'Missing Supabase service key' });

  const sb = createClient(SUPABASE_URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let allEmails = [];
  let page = 1;
  while (true) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) return res.status(500).json({ error: `Supabase error: ${error.message}` });
    const emails = data.users.map(u => u.email).filter(e => e && e.includes('@'));
    allEmails = allEmails.concat(emails);
    if (data.users.length < 1000) break;
    page++;
  }

  if (!allEmails.length) return res.status(200).json({ ok: true, sent: 0 });

  let sent = 0;
  let failed = 0;
  const BATCH = 10;
  for (let i = 0; i < allEmails.length; i += BATCH) {
    const batch = allEmails.slice(i, i + BATCH);
    const results = await Promise.allSettled(
      batch.map(email => sendEmail({ to: email, subject, html }))
    );
    sent += results.filter(r => r.status === 'fulfilled').length;
    failed += results.filter(r => r.status === 'rejected').length;
    if (i + BATCH < allEmails.length) await new Promise(r => setTimeout(r, 200));
  }

  console.log(`Newsletter: sent=${sent} failed=${failed} total=${allEmails.length}`);
  return res.status(200).json({ ok: true, sent, failed, total: allEmails.length });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const action = req.query?.action || (req.body || {}).action;

  try {
    if (action === 'welcome') return await handleWelcome(req, res);
    if (action === 'newsletter') return await handleNewsletter(req, res);
    return res.status(400).json({ error: 'Unknown action. Use ?action=welcome or ?action=newsletter' });
  } catch (e) {
    console.error(`email/${action} error:`, e.message);
    return res.status(500).json({ error: e.message });
  }
}
