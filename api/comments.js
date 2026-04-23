import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://prffhhkemxibujjjiyhg.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

// Simple in-memory rate limit: max 3 comments per IP per 10 minutes
const rateLimitMap = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const key = ip;
  const entry = rateLimitMap.get(key) || { count: 0, reset: now + 10 * 60 * 1000 };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + 10 * 60 * 1000; }
  entry.count++;
  rateLimitMap.set(key, entry);
  return entry.count > 3;
}

export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { slug, action } = req.query;

  // ── GET: fetch comments for a post ──────────────────────────────────────
  if (req.method === 'GET') {
    if (!slug) return res.status(400).json({ error: 'slug required' });

    const { data, error } = await sb
      .from('comments')
      .select('id, name, content, photo_url, likes, parent_id, created_at')
      .eq('post_slug', slug)
      .eq('is_approved', true)
      .order('created_at', { ascending: true })
      .limit(200);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ comments: data || [] });
  }

  // ── POST: submit comment or like ─────────────────────────────────────────
  if (req.method === 'POST') {

    // Like a comment
    if (action === 'like') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      const { error } = await sb.rpc('increment_comment_likes', { comment_id: id });
      // Fallback if RPC doesn't exist
      if (error) {
        const { data: c } = await sb.from('comments').select('likes').eq('id', id).single();
        await sb.from('comments').update({ likes: (c?.likes || 0) + 1 }).eq('id', id);
      }
      return res.status(200).json({ ok: true });
    }

    // Upload comment photo
    if (action === 'upload-photo') {
      // handled separately by /api/upload — redirect
      return res.status(400).json({ error: 'Use /api/upload for photo uploads' });
    }

    // Submit new comment
    const { name, content, photo_url, parent_id } = req.body || {};
    if (!slug) return res.status(400).json({ error: 'slug required' });
    if (!name || !content) return res.status(400).json({ error: 'name and content required' });
    if (content.length > 1200) return res.status(400).json({ error: 'Comment too long (max 1200 chars)' });

    // Rate limit check
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown';
    if (isRateLimited(ip)) return res.status(429).json({ error: 'Too many comments. Please wait a few minutes.' });

    // Verify post exists
    const { data: post } = await sb.from('blog_posts').select('slug').eq('slug', slug).single();
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const { data, error } = await sb.from('comments').insert({
      post_slug: slug,
      name: name.trim().slice(0, 80),
      content: content.trim().slice(0, 1200),
      photo_url: photo_url || null,
      parent_id: parent_id || null,
    }).select().single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ comment: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
