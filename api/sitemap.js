import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://prffhhkemxibujjjiyhg.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const today = new Date().toISOString().slice(0, 10);

  // Fetch all published blog posts dynamically from Supabase
  const [{ data: blogs }, { data: trips }] = await Promise.all([
    sb.from('blog_posts')
      .select('slug, updated_at, date_published')
      .eq('is_published', true)
      .order('date_published', { ascending: false }),
    sb.from('saved_plans')
      .select('share_id, updated_at')
      .eq('is_public', true)
      .not('share_id', 'is', null)
      .limit(1000)
  ]);

  const tripUrls = (trips || []).map(p => `
  <url>
    <loc>https://getatlas.ca/trip/${p.share_id}</loc>
    <lastmod>${(p.updated_at || today).slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('');

  const destinations = ['tokyo','paris','bali','dubai','new-york','london','rome','bangkok','singapore','maldives','barcelona','istanbul','seoul','kyoto','amsterdam','prague','santorini','lisbon','cape-town','sydney','dhaka','coxs-bazar','kathmandu','kuala-lumpur','ho-chi-minh','phuket','sri-lanka','chiang-mai','petra','cox-s-bazar','sundarbans','nepal'];
  const destUrls = destinations.map(d => `
  <url>
    <loc>https://getatlas.ca/plan/${d}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  const blogUrls = [
    `\n  <url>\n    <loc>https://getatlas.ca/blog</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
    ...(blogs || []).map(b => {
      const lastmod = (b.updated_at || b.date_published || today).slice(0, 10);
      return `\n  <url>\n    <loc>https://getatlas.ca/blog/${b.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.65</priority>\n  </url>`;
    })
  ].join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://getatlas.ca/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${destUrls}
  ${blogUrls}
  <url>
    <loc>https://getatlas.ca/privacy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://getatlas.ca/terms</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  ${tripUrls}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(xml);
}
