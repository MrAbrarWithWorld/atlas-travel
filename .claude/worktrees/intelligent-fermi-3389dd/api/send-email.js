const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = 'Atlas Travel <noreply@getatlas.ca>';
const REPLY_TO = 'support@getatlas.ca';

export async function sendEmail({ to, subject, html }) {
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not set');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, reply_to: REPLY_TO, to, subject, html }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Resend API error');
  return data;
}

// Serverless handler (POST { to, subject, html })
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Only allow internal calls (same-origin server-to-server)
  const internalKey = req.headers['x-internal-key'];
  if (internalKey !== process.env.INTERNAL_API_KEY && process.env.INTERNAL_API_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { to, subject, html } = req.body || {};
  if (!to || !subject || !html) return res.status(400).json({ error: 'Missing to/subject/html' });

  try {
    const data = await sendEmail({ to, subject, html });
    return res.status(200).json({ ok: true, id: data.id });
  } catch (e) {
    console.error('send-email error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
