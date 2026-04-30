import { createClient } from '@supabase/supabase-js';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByZmZoaGtlbXhpYnVqamppeWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NzYwMDIsImV4cCI6MjA5MDM1MjAwMn0.Tqxz_6EHwv4oWA9NvPSRK1uC7HJ1_chhFjZGg2PRhiE';

const sb = createClient(
  'https://prffhhkemxibujjjiyhg.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY
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

  const destinations = [
    // Asia - Southeast
    'bali','bangkok','singapore','phuket','kuala-lumpur','ho-chi-minh-city','hanoi','chiang-mai','siem-reap','yangon','manila','jakarta','boracay','langkawi','penang','danang','hoi-an','phnom-penh','vientiane','luang-prabang',
    // Asia - East
    'tokyo','kyoto','osaka','seoul','busan','taipei','hong-kong','beijing','shanghai',
    // Asia - South
    'dhaka','coxs-bazar','sundarbans','sylhet','kathmandu','pokhara','sri-lanka','colombo','maldives','mumbai','delhi','goa','jaipur','agra','varanasi','nepal','bhutan','lahore','karachi',
    // Asia - Middle East
    'dubai','abu-dhabi','istanbul','doha','muscat','riyadh','amman','petra','jerusalem','tel-aviv','beirut','kuwait-city',
    // Europe
    'paris','london','rome','barcelona','amsterdam','prague','santorini','lisbon','madrid','athens','vienna','berlin','budapest','venice','florence','dubrovnik','porto','reykjavik','edinburgh','brussels','stockholm','oslo','copenhagen','helsinki','zurich','milan','naples','seville','valencia','granada','lyon','nice','monaco','luxembourg','valletta','tallinn','riga','vilnius','krakow','warsaw','bucharest','sofia','belgrade','zagreb','sarajevo','podgorica','tirana',
    // Americas
    'new-york','miami','los-angeles','chicago','las-vegas','san-francisco','boston','washington-dc','cancun','mexico-city','havana','bogota','medellin','lima','cusco','machu-picchu','rio-de-janeiro','buenos-aires','santiago','cartagena','quito','la-paz','montevideo','toronto','vancouver','montreal',
    // Africa & Oceania
    'cape-town','nairobi','zanzibar','marrakech','cairo','casablanca','accra','lagos','addis-ababa','sydney','melbourne','auckland','queenstown','fiji','bora-bora','tahiti',
  ].filter((v, i, a) => a.indexOf(v) === i); // deduplicate

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
    <loc>https://getatlas.ca/pricing</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
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

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=600');
  res.status(200).send(xml);
}
