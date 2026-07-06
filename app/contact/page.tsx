import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '../components/SiteNav';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Book a Discovery Call | Atlas Technology',
  description: 'Book a free 30-minute discovery call with Atlas Technology. Based in Canada, serving clients remotely worldwide. We review your workflow and come back with a clear plan.',
  openGraph: {
    title: 'Book a Discovery Call | Atlas Technology',
    description: 'Free 30-minute call. We review your workflow and come back with a clear plan — no sales pitch, no commitment.',
    url: 'https://getatlas.ca/contact',
  },
};

export default function ContactPage() {
  return (
    <div style={{ background: '#1c1914', minHeight: '100vh', color: '#ede5d5', fontFamily: 'DM Sans, sans-serif' }}>
      <SiteNav activePath="/contact" />

      <style>{`
        .contact-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 64px; align-items: start; }
        @media (max-width: 860px) { .contact-grid { grid-template-columns: 1fr; gap: 40px; } }
        .contact-sidebar { padding-top: 16px; }
        @media (max-width: 860px) { .contact-sidebar { padding-top: 0; } }
      `}</style>

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '100px 24px 80px' }}>
        <div className="contact-grid">

          {/* Left: Info */}
          <div className="contact-sidebar">
            {/* Canada badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#231f18', border: '1px solid #3a3228', borderRadius: 100, padding: '5px 14px', marginBottom: 24 }}>
              <span style={{ fontSize: 13 }}>🍁</span>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#a09070', textTransform: 'uppercase' }}>Based in Canada · Remote worldwide</span>
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 16 }}>
              Free · 30 Minutes · No Commitment
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(32px,4vw,50px)', fontWeight: 600, color: '#e8c994', lineHeight: 1.15, margin: '0 0 20px' }}>
              Book a Discovery Call
            </h1>
            <p style={{ fontSize: 15, color: '#c5b99a', lineHeight: 1.7, margin: '0 0 36px' }}>
              Tell us what you&apos;re doing manually. On the call we review your workflow, identify the highest-value automation opportunities, and walk you through a clear plan. No pitch, no invoice.
            </p>

            {/* Trust items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {[
                { icon: '📅', title: '30-minute focused call', desc: 'We come prepared. You describe the problem; we map it to a solution and leave you with a clear written scope.' },
                { icon: '⚡', title: 'Response within 24 hours', desc: 'We review every request personally and confirm a call time fast — regardless of your timezone.' },
                { icon: '🔒', title: 'Your information stays private', desc: 'We never share your details with third parties. Everything discussed on the call stays between us.' },
                { icon: '🌍', title: 'Fully remote · worldwide', desc: 'Remote-first by design. We\'ve worked with clients across 4 continents. Timezone is never a problem.' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 20, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#ede5d5', marginBottom: 3 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: '#a09070', lineHeight: 1.55 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Travel app link */}
            <div style={{ marginTop: 40, paddingTop: 28, borderTop: '1px solid #3a3228' }}>
              <div style={{ fontSize: 12, color: '#a09070', marginBottom: 10 }}>Looking for the travel app?</div>
              <Link href="/" style={{ fontSize: 13, color: '#c9a96e', textDecoration: 'none', fontWeight: 600 }}>
                Atlas AI Travel Planner →
              </Link>
            </div>
          </div>

          {/* Right: Form */}
          <div style={{ background: '#231f18', border: '1px solid #3a3228', borderRadius: 16, padding: '36px 32px' }}>
            <ContactForm />
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #3a3228', padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: '#a09070' }}>
          © {new Date().getFullYear()} Atlas Technology &nbsp;·&nbsp;
          <Link href="/services" style={{ color: '#a09070', textDecoration: 'none' }}>Services</Link>
          &nbsp;·&nbsp;
          <Link href="/blog" style={{ color: '#a09070', textDecoration: 'none' }}>Blog</Link>
          &nbsp;·&nbsp;
          <Link href="/" style={{ color: '#a09070', textDecoration: 'none' }}>Travel App</Link>
        </div>
      </footer>
    </div>
  );
}
