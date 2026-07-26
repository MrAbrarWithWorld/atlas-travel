import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://prffhhkemxibujjjiyhg.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

const UNSUBSCRIBE_HTML = (msg, ok) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${ok ? 'Unsubscribed' : 'Error'} — Atlas</title></head>
<body style="margin:0;background:#0e0c08;font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
<div style="text-align:center;color:#e8dcc8;padding:2rem;max-width:400px;">
  <div style="font-size:2.5rem;margin-bottom:1rem;">${ok ? '✓' : '⚠️'}</div>
  <h2 style="font-family:Georgia,serif;font-weight:400;color:#c9a96e;margin-bottom:0.75rem;">${ok ? "You've been unsubscribed" : 'Something went wrong'}</h2>
  <p style="color:#8a7a60;font-size:0.9rem;line-height:1.7;">${msg}</p>
  <a href="https://getatlas.ca/blog" style="display:inline-block;margin-top:1.5rem;color:#c9a96e;font-size:0.85rem;text-decoration:none;">← Back to the blog</a>
</div></body></html>`;

export default async function handler(req, res) {
  // ── Unsubscribe (GET) ────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const email = req.query.email;
    res.setHeader('Content-Type', 'text/html');
    if (!email) return res.status(400).send(UNSUBSCRIBE_HTML('Invalid unsubscribe link.', false));
    await sb.from('newsletter_subscribers').update({ unsubscribed: true }).eq('email', decodeURIComponent(email));
    return res.status(200).send(UNSUBSCRIBE_HTML("You won't receive any more emails from Atlas Travel. Sorry to see you go!", true));
  }

  // ── Subscribe (POST) ─────────────────────────────────────────────────────────
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, source = 'blog' } = req.body || {};
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });

  const { error } = await sb.from('newsletter_subscribers').upsert(
    { email, source, unsubscribed: false },
    { onConflict: 'email' }
  );
  if (error) return res.status(500).json({ error: 'Database error' });

  return res.status(200).json({ ok: true });
}
