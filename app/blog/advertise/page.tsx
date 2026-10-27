import type { Metadata } from 'next';
import Link from 'next/link';
import BlogNav from '../components/BlogNav';

const URL = 'https://getatlas.ca/blog/advertise';
const MAILTO = 'mailto:support@getatlas.ca?subject=Advertising%20on%20Atlas%20Travel';

export const metadata: Metadata = {
  title: { absolute: 'Advertise with Atlas Travel — Sponsored guides & partnerships' },
  description:
    'Reach travellers planning their next trip on the Atlas Travel blog. Sponsored guides and travel partnerships, always clearly labelled.',
  alternates: { canonical: URL },
  openGraph: {
    type: 'website',
    url: URL,
    title: 'Advertise with Atlas Travel',
    description: 'Sponsored guides and travel partnerships, always clearly labelled.',
  },
};

const gold = '#c9a96e';
const text = '#ede5d5';
const muted = '#a09684';
const line = '#3a3228';
const serif = 'var(--font-cormorant-garamond),serif';

const FORMATS = [
  { title: 'Sponsored guide', text: 'A destination guide or story written with you, published on the blog and marked Sponsored at the top.' },
  { title: 'Travel partnership', text: 'Tours, stays, insurance, eSIMs and other travel services we can genuinely recommend, linked from relevant guides.' },
];

const RULES = [
  'Every paid placement is clearly marked Sponsored, and its links are marked as sponsored for search engines.',
  'Our regular guides and the Atlas travel planner are not for sale: sponsors do not change what we recommend.',
  'We only feature products and places we would be comfortable suggesting to a friend.',
  'We do not accept ads that are misleading or unlawful in Canada, and we may decline any campaign.',
];

const STEPS = [
  'Email us with your brand, what you want to promote and your timing.',
  'We reply with current reader numbers and the options that fit.',
  'We agree the price, dates, wording and labels in writing before anything is published.',
  'After the campaign we share the results we can measure, such as views and clicks.',
];

export default function AdvertisePage() {
  const h2 = { fontFamily: serif, fontSize: 'clamp(28px,3.4vw,40px)', fontWeight: 400, color: text, margin: '56px 0 16px', lineHeight: 1.1 } as const;
  const p = { fontSize: 16, color: muted, lineHeight: 1.75, margin: '0 0 14px', maxWidth: 680 } as const;
  return (
    <div style={{ background: '#1c1914', minHeight: '100vh', color: text, fontFamily: 'var(--font-dm-sans),sans-serif' }}>
      <BlogNav />
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '112px 24px 96px' }}>
        <Link href="/blog" style={{ fontSize: 13, color: gold, textDecoration: 'none' }}>← Back to the blog</Link>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(40px,6vw,72px)', fontWeight: 300, lineHeight: 1, letterSpacing: '-0.02em', margin: '24px 0 20px' }}>
          Advertise with <em style={{ fontStyle: 'italic', color: gold }}>Atlas Travel</em>
        </h1>
        <p style={{ ...p, fontSize: 18, color: '#cfc6b4' }}>
          Atlas Travel publishes destination guides, visa tips and budget routes, and runs a free AI trip planner. Our readers are
          people actively planning a trip. If your travel brand can help them, we would like to hear from you.
        </p>

        <h2 style={h2}>Who reads Atlas Travel</h2>
        <p style={p}>
          Travellers researching where to go, what visas they need, how much a trip costs and how to plan each day. We share
          current reader numbers when you get in touch, so you can judge the fit with real data.
        </p>

        <h2 style={h2}>Ways to work with us</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
          {FORMATS.map((f) => (
            <div key={f.title} style={{ border: `1px solid ${line}`, borderRadius: 12, padding: 22, background: '#231f18' }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: text, margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ ...p, fontSize: 15, margin: 0 }}>{f.text}</p>
            </div>
          ))}
        </div>

        <h2 style={h2}>Our rules</h2>
        <ul style={{ ...p, paddingLeft: 20, listStyle: 'disc' }}>
          {RULES.map((r) => <li key={r} style={{ marginBottom: 8 }}>{r}</li>)}
        </ul>

        <h2 style={h2}>How it works</h2>
        <ol style={{ ...p, paddingLeft: 20, listStyle: 'decimal' }}>
          {STEPS.map((s) => <li key={s} style={{ marginBottom: 8 }}>{s}</li>)}
        </ol>

        <a
          href={MAILTO}
          style={{ display: 'inline-block', marginTop: 24, padding: '14px 26px', borderRadius: 999, background: gold, color: '#1c1914', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}
        >
          Email us about advertising
        </a>

        <p style={{ ...p, fontSize: 13, marginTop: 56, borderTop: `1px solid ${line}`, paddingTop: 20 }}>
          Atlas Travel is run by Atlas AI Technologies, Toronto, Canada. See our <Link href="/privacy" style={{ color: gold }}>Privacy Policy</Link>.
        </p>
      </main>
    </div>
  );
}
