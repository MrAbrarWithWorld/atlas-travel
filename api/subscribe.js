import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://prffhhkemxibujjjiyhg.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, source = 'blog' } = req.body || {};
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });

  const { error } = await sb.from('newsletter_subscribers').upsert({ email, source }, { onConflict: 'email', ignoreDuplicates: true });
  if (error) return res.status(500).json({ error: 'Database error' });

  return res.status(200).json({ ok: true });
}
