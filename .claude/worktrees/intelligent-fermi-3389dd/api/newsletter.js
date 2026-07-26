import { createClient } from '@supabase/supabase-js';
import { sendEmail } from './send-email.js';

const SUPABASE_URL = 'https://prffhhkemxibujjjiyhg.supabase.co';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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

  // Fetch all auth users
  let allEmails = [];
  let page = 1;
  while (true) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) return res.status(500).json({ error: `Supabase error: ${error.message}` });
    const emails = data.users
      .map(u => u.email)
      .filter(e => e && e.includes('@'));
    allEmails = allEmails.concat(emails);
    if (data.users.length < 1000) break;
    page++;
  }

  if (!allEmails.length) return res.status(200).json({ ok: true, sent: 0 });

  // Send in batches of 10 to avoid rate limits
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
    // Small delay between batches
    if (i + BATCH < allEmails.length) await new Promise(r => setTimeout(r, 200));
  }

  console.log(`Newsletter: sent=${sent} failed=${failed} total=${allEmails.length}`);
  return res.status(200).json({ ok: true, sent, failed, total: allEmails.length });
}
