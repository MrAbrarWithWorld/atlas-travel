import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '../components/SiteNav';

export const metadata: Metadata = {
  title: 'AI Automation & Web Solutions | Atlas Technology',
  description: 'Atlas Technology helps online businesses worldwide automate workflows, capture leads, build websites, and save time with AI. Based in Canada — serving clients remotely worldwide.',
  openGraph: {
    title: 'AI Automation & Web Solutions | Atlas Technology',
    description: 'Automate your business workflows. AI-powered CRMs, websites, and process automation for businesses worldwide.',
    url: 'https://getatlas.ca/services',
  },
};

const services = [
  {
    icon: '🤖',
    title: 'AI Workflow Automation',
    desc: 'Automate repetitive business processes — from lead follow-up to reporting — using n8n, AI agents, and smart triggers. You focus on growth; automation handles the rest.',
  },
  {
    icon: '📋',
    title: 'CRM & Lead Capture Systems',
    desc: 'Custom CRM pipelines built on Supabase and n8n. Capture leads from your website, qualify them automatically, and get approval-gated email drafts — no missed follow-ups.',
  },
  {
    icon: '🌐',
    title: 'Website & Landing Page Development',
    desc: 'Professional Next.js websites and landing pages hosted on Vercel. Fast, SEO-optimized, and built to convert — from company sites to product landing pages.',
  },
  {
    icon: '📧',
    title: 'Email & Report Automation',
    desc: 'Automated email sequences, scheduled business reports, and digest emails. Sent from your domain, triggered by events, always under your control.',
  },
  {
    icon: '⚙️',
    title: 'Business Process Automation',
    desc: 'Map and automate your core workflows — invoicing, onboarding, notifications, data sync. Cut manual work and reduce errors with smart automation.',
  },
  {
    icon: '✈️',
    title: 'Travel-Tech & AI Product Development',
    desc: 'End-to-end AI product development for travel and hospitality — itinerary engines, booking assistants, recommendation systems, and full-stack SaaS platforms.',
  },
];

const steps = [
  { num: '01', title: 'Free Audit', desc: 'We map your current workflow and identify where automation saves the most time and money.' },
  { num: '02', title: 'Custom Plan', desc: 'Get a clear proposal — what we build, timeline, and fixed price. No surprises.' },
  { num: '03', title: 'We Build It', desc: 'We build, test, and deploy. You get full access and ownership of everything we create.' },
  { num: '04', title: 'You Scale', desc: 'Your business runs smarter. We stay available for support and new improvements.' },
];

export default function ServicesPage() {
  return (
    <div style={{ background: '#1c1914', minHeight: '100vh', color: '#ede5d5', fontFamily: 'DM Sans, sans-serif' }}>
      <SiteNav activePath="/services" />

      {/* Hero */}
      <section style={{ paddingTop: 100 }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '56px 24px 72px', textAlign: 'center' }}>
          {/* Trust badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#231f18', border: '1px solid #3a3228', borderRadius: 100, padding: '6px 16px', marginBottom: 28 }}>
            <span style={{ fontSize: 14 }}>🍁</span>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#a09070', textTransform: 'uppercase' }}>Based in Canada · Serving clients worldwide</span>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 16 }}>
            Atlas Technology · AI &amp; Automation
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(36px,5vw,62px)', fontWeight: 600, color: '#e8c994', lineHeight: 1.12, margin: '0 0 22px' }}>
            Automate your business.<br />Ship faster. Grow smarter.
          </h1>
          <p style={{ fontSize: 17, color: '#c5b99a', lineHeight: 1.75, maxWidth: 580, margin: '0 auto 16px' }}>
            We help online businesses worldwide automate workflows, capture leads, build websites, and save time with AI — fully remote, fixed price, no surprises.
          </p>
          <p style={{ fontSize: 14, color: '#a09070', lineHeight: 1.6, maxWidth: 480, margin: '0 auto 40px' }}>
            From solopreneurs to growing teams — we build the systems that let you focus on what matters.
          </p>
          <Link href="/contact" style={{
            display: 'inline-block', background: '#c9a96e', color: '#1c1914', borderRadius: 8,
            padding: '14px 32px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none',
          }}>
            Get Free Automation Audit →
          </Link>
          <div style={{ marginTop: 14, fontSize: 12, color: '#a09070' }}>Free consultation · No commitment · Response within 24h</div>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#a09070', textTransform: 'uppercase', marginBottom: 12 }}>What We Build</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 600, color: '#e8c994', margin: 0 }}>Our Services</h2>
          </div>
          <style>{`
            .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
            @media (max-width: 900px) { .services-grid { grid-template-columns: repeat(2, 1fr); } }
            @media (max-width: 580px) { .services-grid { grid-template-columns: 1fr; } }
            .service-card { transition: border-color 0.2s, transform 0.2s; }
            .service-card:hover { border-color: #c9a96e !important; transform: translateY(-2px); }
          `}</style>
          <div className="services-grid">
            {services.map(s => (
              <div key={s.title} className="service-card" style={{ background: '#231f18', border: '1px solid #3a3228', borderRadius: 12, padding: '28px 24px' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#ede5d5', margin: '0 0 10px' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#a09070', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Atlas */}
      <section style={{ padding: '60px 24px', background: '#231f18', borderTop: '1px solid #3a3228', borderBottom: '1px solid #3a3228' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#a09070', textTransform: 'uppercase', marginBottom: 12 }}>Why Atlas</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px,3vw,38px)', fontWeight: 600, color: '#e8c994', margin: 0 }}>Built for remote-first businesses</h2>
          </div>
          <style>{`
            .why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
            @media (max-width: 720px) { .why-grid { grid-template-columns: 1fr; gap: 24px; } }
          `}</style>
          <div className="why-grid">
            {[
              { icon: '🌍', title: 'Fully Remote', desc: 'We work with clients across North America, Europe, Asia, and beyond. 100% remote — no office visits needed.' },
              { icon: '💰', title: 'Fixed Price', desc: 'Every project comes with a clear scope and fixed cost. No hourly billing surprises or scope creep.' },
              { icon: '🔑', title: 'You Own Everything', desc: 'Full source code, database access, and credentials delivered to you. No vendor lock-in, ever.' },
            ].map(item => (
              <div key={item.title} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ede5d5', margin: '0 0 8px' }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: '#a09070', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '72px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#a09070', textTransform: 'uppercase', marginBottom: 12 }}>Simple Process</div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px,3vw,38px)', fontWeight: 600, color: '#e8c994', margin: '0 0 52px' }}>How it works</h2>
          <style>{`
            .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; }
            @media (max-width: 768px) { .steps-grid { grid-template-columns: repeat(2, 1fr); } }
            @media (max-width: 480px) { .steps-grid { grid-template-columns: 1fr; } }
          `}</style>
          <div className="steps-grid">
            {steps.map(step => (
              <div key={step.num}>
                <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 44, fontWeight: 600, color: '#c9a96e', marginBottom: 10 }}>{step.num}</div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ede5d5', margin: '0 0 8px' }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: '#a09070', lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '72px 24px', background: '#231f18', borderTop: '1px solid #3a3228', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 600, color: '#e8c994', margin: '0 0 16px' }}>
            Ready to automate your business?
          </h2>
          <p style={{ fontSize: 15, color: '#a09070', lineHeight: 1.7, margin: '0 0 32px' }}>
            Request a free automation audit. We&apos;ll review your workflow and tell you exactly what we&apos;d build — no sales pitch, no commitment.
          </p>
          <Link href="/contact" style={{
            display: 'inline-block', background: '#c9a96e', color: '#1c1914', borderRadius: 8,
            padding: '14px 36px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none',
          }}>
            Get Free Automation Audit →
          </Link>
          <div style={{ marginTop: 14, fontSize: 12, color: '#a09070' }}>🍁 Based in Canada &nbsp;·&nbsp; Remote worldwide &nbsp;·&nbsp; Response within 24h</div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #3a3228', padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: '#a09070' }}>
          © {new Date().getFullYear()} Atlas Technology &nbsp;·&nbsp;
          <Link href="/blog" style={{ color: '#a09070', textDecoration: 'none' }}>Blog</Link>
          &nbsp;·&nbsp;
          <Link href="/contact" style={{ color: '#a09070', textDecoration: 'none' }}>Contact</Link>
          &nbsp;·&nbsp;
          <Link href="/" style={{ color: '#a09070', textDecoration: 'none' }}>Atlas Travel Planner</Link>
        </div>
      </footer>
    </div>
  );
}
