import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://prffhhkemxibujjjiyhg.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { data } = await sb
    .from('saved_plans')
    .select('share_id, updated_at')
    .eq('is_public', true)
    .not('share_id', 'is', null)
    .limit(1000);

  const tripUrls = (data || []).map(p => `
  <url>
    <loc>https://getatlas.ca/trip/${p.share_id}</loc>
    <lastmod>${(p.updated_at || '2026-04-13').slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('');

  const destinations = ['tokyo','paris','bali','dubai','new-york','london','rome','bangkok','singapore','maldives','barcelona','istanbul','seoul','kyoto','amsterdam','prague','santorini','lisbon','cape-town','sydney','dhaka','coxs-bazar','kathmandu','kuala-lumpur','ho-chi-minh','phuket','sri-lanka','chiang-mai','petra'];
  const destUrls = destinations.map(d => `
  <url>
    <loc>https://getatlas.ca/plan/${d}</loc>
    <lastmod>2026-04-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  const blogSlugs = ['visa-free-countries-bangladeshi-passport','best-time-to-visit-thailand','budget-travel-southeast-asia','coxs-bazar-travel-guide','nepal-everest-base-camp-guide','maldives-on-a-budget','solo-travel-safety-guide','travel-packing-list-southeast-asia','dhaka-guide-for-travelers'];
  const blogUrls = [
    `\n  <url>\n    <loc>https://getatlas.ca/blog</loc>\n    <lastmod>2026-04-18</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
    ...blogSlugs.map(s => `\n  <url>\n    <loc>https://getatlas.ca/blog/${s}</loc>\n    <lastmod>2026-04-18</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.65</priority>\n  </url>`)
  ].join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://getatlas.ca/</loc>
    <lastmod>2026-04-18</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${destUrls}
  ${blogUrls}
  <url>
    <loc>https://getatlas.ca/privacy</loc>
    <lastmod>2026-04-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://getatlas.ca/terms</loc>
    <lastmod>2026-04-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  ${tripUrls}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(xml);
}
