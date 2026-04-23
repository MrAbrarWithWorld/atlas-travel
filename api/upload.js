import { createClient } from '@supabase/supabase-js';

// Disable Vercel's default body parser so we get raw binary
export const config = { api: { bodyParser: false } };

const sb = createClient(
  'https://prffhhkemxibujjjiyhg.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

// Simple in-memory rate limit for public comment photo uploads
const uploadRateMap = new Map();
function isUploadRateLimited(ip) {
  const now = Date.now();
  const entry = uploadRateMap.get(ip) || { count: 0, reset: now + 60 * 60 * 1000 };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + 60 * 60 * 1000; }
  entry.count++;
  uploadRateMap.set(ip, entry);
  return entry.count > 10; // max 10 uploads/hour for public
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://getatlas.ca');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-filename, x-admin-auth, x-upload-type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const uploadType = req.headers['x-upload-type'] || 'admin'; // 'admin' or 'comment'
  const isCommentUpload = uploadType === 'comment';

  // Admin uploads require auth cookie
  if (!isCommentUpload) {
    const cookie = req.headers.cookie || '';
    const adminToken = req.headers['x-admin-auth'] || '';
    const cookieMatch = cookie.match(/atlas_admin=([^;]+)/);
    const tokenFromCookie = cookieMatch ? cookieMatch[1] : '';
    const expectedHash = process.env.ADMIN_HASH;
    if (tokenFromCookie !== expectedHash && adminToken !== expectedHash) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  } else {
    // Rate limit public comment uploads
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
    if (isUploadRateLimited(ip)) return res.status(429).json({ error: 'Too many uploads. Try again later.' });
  }

  // Get file metadata from headers
  const rawFilename = req.headers['x-filename'] || `upload-${Date.now()}.jpg`;
  const filename = rawFilename.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
  const contentType = req.headers['content-type'] || 'image/jpeg';

  // Validate content type
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowed.includes(contentType)) {
    return res.status(400).json({ error: 'Only JPEG, PNG, and WebP images are allowed.' });
  }

  // Collect raw binary body
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  if (buffer.length === 0) return res.status(400).json({ error: 'Empty file.' });
  if (buffer.length > 5 * 1024 * 1024) return res.status(400).json({ error: 'File too large (max 5MB).' });

  // Upload to Supabase Storage
  const bucket = isCommentUpload ? 'comment-photos' : 'blog-images';
  const folder = isCommentUpload ? 'uploads' : 'covers';
  const path = `${folder}/${Date.now()}-${filename}`;
  const { error } = await sb.storage
    .from(bucket)
    .upload(path, buffer, { contentType, upsert: false });

  if (error) return res.status(500).json({ error: error.message });

  const { data: { publicUrl } } = sb.storage
    .from(bucket)
    .getPublicUrl(path);

  return res.status(200).json({ url: publicUrl });
}
