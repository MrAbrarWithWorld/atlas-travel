import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://prffhhkemxibujjjiyhg.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { subscription, action } = req.body;
    if (!subscription && action !== 'unsubscribe') return res.status(400).json({ error: 'No subscription' });

    // Get user from auth token
    const authHeader = req.headers['authorization'];
    let userId = null;
    if (authHeader && SUPABASE_SERVICE_KEY) {
      const token = authHeader.replace('Bearer ', '');
      const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      const { data: { user } } = await sb.auth.getUser(token);
      userId = user?.id || null;
    }

    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    if (action === 'unsubscribe') {
      await sb.from('push_subscriptions').delete().eq('user_id', userId);
      return res.json({ success: true, action: 'unsubscribed' });
    }

    // Upsert push subscription
    const { error } = await sb.from('push_subscriptions').upsert({
      user_id: userId,
      subscription: JSON.stringify(subscription),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    if (error) {
      console.error('Push subscribe error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, action: 'subscribed' });
  } catch (e) {
    console.error('Push subscribe exception:', e);
    res.status(500).json({ error: e.message });
  }
}
