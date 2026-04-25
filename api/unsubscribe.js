import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://prffhhkemxibujjjiyhg.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const email = req.query.email || req.body?.email;

  if (!email) {
    res.setHeader('Content-Type', 'text/html');
    return res.status(400).send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Unsubscribe</title></head>
<body style="margin:0;background:#0e0c08;font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
<div style="text-align:center;color:#e8dcc8;padding:2rem;">
  <div style="font-size:2.5rem;margin-bottom:1rem;">⚠️</div>
  <p style="color:#8a7a60;">Invalid unsubscribe link.</p>
  <a href="https://getatlas.ca/blog" style="color:#c9a96e;font-size:0.85rem;">← Back to Atlas</a>
</div></body></html>`);
  }

  await sb.from('newsletter_subscribers')
    .update({ unsubscribed: true })
    .eq('email', decodeURIComponent(email));

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Unsubscribed — Atlas</title></head>
<body style="margin:0;background:#0e0c08;font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
<div style="text-align:center;color:#e8dcc8;padding:2rem;max-width:400px;">
  <div style="font-size:2.5rem;margin-bottom:1rem;">✓</div>
  <h2 style="font-family:Georgia,serif;font-weight:400;color:#c9a96e;margin-bottom:0.75rem;">You've been unsubscribed</h2>
  <p style="color:#8a7a60;font-size:0.9rem;line-height:1.7;">You won't receive any more emails from Atlas Travel. Sorry to see you go!</p>
  <a href="https://getatlas.ca/blog" style="display:inline-block;margin-top:1.5rem;color:#c9a96e;font-size:0.85rem;text-decoration:none;">← Back to the blog</a>
</div></body></html>`);
}
