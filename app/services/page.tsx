import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '../components/SiteNav';

export const metadata: Metadata = {
  title: 'AI Automation & Web Services | Atlas Technology',
  description: 'Atlas Technology builds AI-powered automation systems, CRM pipelines, lead capture systems, and custom websites for small and medium businesses.',
  openGraph: {
    title: 'AI Automation & Web Services | Atlas Technology',
    description: 'Automate your business workflows. AI-powered CRMs, websites, and process automation for SMBs.',
    url: 'https://getatlas.ca/services',
  },
};

const services = [
  {
    icon: '🤖',
    title: 'AI Workflow Automation',
    desc: 'Automate repetitive business processes — from lead follow-up to reporting — using n8n, AI agents, and smart triggers. You focus on growth, automation handles the rest.',
  },
  {
    icon: '📋',
    title: 'CRM & Lead Capture System',
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
    icon: '🧠',
    title: 'AI Assistant & Agent Setup',
    desc: 'Custom AI assistants trained on your business context. Deploy as a website chatbot, internal knowledge base, or automated customer support agent.',
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
      <section style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 0', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 16 }}>
            Atlas Technology · AI &amp; Automation Services
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(36px,5vw,60px)', fontWeight: 600, color: '#e8c994', lineHeight: 1.15, marginBottom: 20, margin: '0 0 20px' }}>
            Automate your business.<br />Ship faster. Grow smarter.
          </h1>
          <p style={{ fontSize: 17, color: '#c5b99a', lineHeight: 1.7, marginBottom: 36, maxWidth: 580, margin: '0 auto 36px' }}>
            We build AI-powered automation systems, smart CRMs, and modern websites that work while you sleep.
            Built for small and medium businesses ready to scale.
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
            .service-card:hover { border-color: #c9a96e !important; }
          `}</style>
          <div className="services-grid">
            {services.map(s => (
              <div key={s.title} className="service-card" style={{ background: '#231f18', border: '1px solid #3a3228', borderRadius: 12, padding: '28px 24px', transition: 'border-color 0.2s' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#ede5d5', marginBottom: 10, margin: '0 0 10px' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#a09070', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '60px 24px', background: '#231f18', borderTop: '1px solid #3a3228', borderBottom: '1px solid #3a3228' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#a09070', textTransform: 'uppercase', marginBottom: 12 }}>Simple Process</div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px,3vw,38px)', fontWeight: 600, color: '#e8c994', marginBottom: 48, margin: '0 0 48px' }}>How it works</h2>
          <style>{`
            .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; }
            @media (max-width: 768px) { .steps-grid { grid-template-columns: repeat(2, 1fr); } }
            @media (max-width: 480px) { .steps-grid { grid-template-columns: 1fr; } }
          `}</style>
          <div className="steps-grid">
            {steps.map(step => (
              <div key={step.num} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 40, fontWeight: 600, color: '#c9a96e', marginBottom: 10 }}>{step.num}</div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ede5d5', marginBottom: 8, margin: '0 0 8px' }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: '#a09070', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 600, color: '#e8c994', marginBottom: 16, margin: '0 0 16px' }}>
            Ready to automate your business?
          </h2>
          <p style={{ fontSize: 16, color: '#a09070', marginBottom: 32, margin: '0 0 32px' }}>
            Request a free automation audit — we&apos;ll review your workflow and show you exactly what we&apos;d build.
          </p>
          <Link href="/contact" style={{
            display: 'inline-block', background: '#c9a96e', color: '#1c1914', borderRadius: 8,
            padding: '14px 36px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none',
          }}>
            Get Free Automation Audit →
          </Link>
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
          <Link href="/" style={{ color: '#a09070', textDecoration: 'none' }}>Travel Planner</Link>
        </div>
      </footer>
    </div>
  );
}
