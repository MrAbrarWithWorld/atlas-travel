import { createClient } from '@supabase/supabase-js';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByZmZoaGtlbXhpYnVqamppYWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MzM4NzMsImV4cCI6MjA1OTIwOTg3M30.pPFBIdXzXGNkIKK_bVOQjWyJQBFHILnX2tB0I8Tg5Rw';

const sb = createClient(
  'https://prffhhkemxibujjjiyhg.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Fetch published blog posts
  const { data: blogs } = await sb
    .from('blog_posts')
    .select('slug, date_published')
    .eq('is_published', true)
    .order('date_published', { ascending: false })
    .limit(1000);

  // Fetch public shared trips
  const { data: trips } = await sb
    .from('saved_plans')
    .select('share_id, updated_at')
    .eq('is_public', true)
    .not('share_id', 'is', null)
    .limit(1000);

  const blogUrls = (blogs || []).map(b => `
  <url>
    <loc>https://getatlas.ca/blog/${b.slug}</loc>
    <lastmod>${(b.date_published || '2026-04-01').slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  const tripUrls = (trips || []).map(p => `
  <url>
    <loc>https://getatlas.ca/trip/${p.share_id}</loc>
    <lastmod>${(p.updated_at || '2026-04-13').slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://getatlas.ca/</loc>
    <lastmod>2026-05-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://getatlas.ca/privacy</loc>
    <lastmod>2026-04-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://getatlas.ca/terms</loc>
    <lastmod>2026-04-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  ${blogUrls}
  ${tripUrls}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).send(xml);
}
