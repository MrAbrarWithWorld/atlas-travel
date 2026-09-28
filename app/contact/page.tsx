import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarCheck, ChatCircleText, ClipboardText, EnvelopeSimple, LockSimple, Globe } from '@phosphor-icons/react/dist/ssr';
import SiteNav from '../components/SiteNav';
import ContactForm from './ContactForm';
import { ATTRIBUTION_KEYS, isServiceId, type Attribution } from '../lib/lead-intake';

export const metadata: Metadata = {
  title: { absolute: 'Free Missed-Lead Audit & Contact | Atlas AI Technology' },
  description: 'Get a free missed-lead audit or ask about Lead Rescue and the Follow-Up System. Atlas AI Technology, Toronto. Founding prices from $29/month.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Free Missed-Lead Audit | Atlas AI Technology',
    description: 'Tell us about your business. We test your response time and send a short report with a fix plan. Free, no card.',
    url: 'https://getatlas.ca/contact',
  },
};

type ContactPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const requestedService = first(params.service);
  const service = isServiceId(requestedService) ? requestedService : 'not-sure';
  const attribution: Attribution = {};

  for (const key of ATTRIBUTION_KEYS) {
    const value = first(params[key])?.trim().slice(0, 160);
    if (value) attribution[key] = value;
  }

  return (
    <div style={{ background: '#1c1914', minHeight: '100vh', color: '#ede5d5', fontFamily: 'DM Sans, sans-serif' }}>
      <SiteNav activePath="/contact" />

      <style>{`
        .contact-grid { display: grid; grid-template-columns: 1fr 1.5fr; grid-template-areas: 'intro form' 'details form'; column-gap: 64px; row-gap: 0; align-items: start; }
        .contact-intro { grid-area: intro; padding-top: 16px; }
        .contact-details { grid-area: details; }
        .contact-form { grid-area: form; }
        @media (max-width: 860px) {
          .contact-grid { grid-template-columns: 1fr; grid-template-areas: 'intro' 'form' 'details'; row-gap: 32px; }
          .contact-intro { padding-top: 0; }
          .contact-form { padding: 28px 20px !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '100px 24px 80px' }}>
        <div className="contact-grid">

          {/* Left: intro */}
          <div className="contact-intro">
            {/* Canada badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#231f18', border: '1px solid #3a3228', borderRadius: 100, padding: '5px 14px', marginBottom: 24 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#a09070', textTransform: 'uppercase' }}>Toronto · Serving all of Canada</span>
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 16 }}>
              Free · No card · No obligation
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(32px,4vw,50px)', fontWeight: 600, color: '#e8c994', lineHeight: 1.15, margin: '0 0 20px' }}>
              Get your free missed-lead audit
            </h1>
            <p style={{ fontSize: 15, color: '#c5b99a', lineHeight: 1.7, margin: '0 0 36px' }}>
              Tell us about your business and how customers reach you. We test how fast new enquiries get an answer and send you a short report with a fix plan. Want Lead Rescue or the Follow-Up System instead? Pick it in the form.
            </p>

          </div>

          {/* Left: details (below the form on phones) */}
          <div className="contact-details">
            {/* What happens next */}
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 14 }}>
              What happens next
            </div>
            <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: 0, borderLeft: '1px solid #3a3228' }}>
              {[
                { Icon: ClipboardText, title: 'We review your request', desc: 'Atlas reads every request personally and usually replies within two business days.' },
                { Icon: CalendarCheck, title: 'Your free audit report', desc: 'A 1-page report with what we found and a simple fix plan, usually within 2–3 business days.' },
                { Icon: ChatCircleText, title: 'Optional 15-minute call', desc: 'If you want us to fix it, we agree on a fixed founding price in writing. No obligation.' },
              ].map(({ Icon, title, desc }, index) => (
                <li key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '0 0 20px 20px', position: 'relative' }}>
                  <span aria-hidden="true" style={{ position: 'absolute', left: -12, top: 0, width: 24, height: 24, borderRadius: '50%', background: '#1c1914', border: '1px solid #c9a96e', color: '#c9a96e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={13} weight="bold" />
                  </span>
                  <div style={{ paddingLeft: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#ede5d5', marginBottom: 3 }}>
                      <span style={{ color: '#a09070', fontWeight: 500, marginRight: 6 }}>{index + 1}.</span>{title}
                    </div>
                    <div style={{ fontSize: 12.5, color: '#a09070', lineHeight: 1.55 }}>{desc}</div>
                  </div>
                </li>
              ))}
            </ol>

            {/* Trust items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { Icon: LockSimple, title: 'Handled with care', desc: 'Your details are only used to review and respond to your request, as described in our privacy policy.' },
                { Icon: Globe, title: 'Canadian and CASL-aware', desc: 'Based in Toronto. Every automated message follows Canadian anti-spam rules.' },
              ].map(({ Icon, title, desc }) => (
                <div key={title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Icon size={18} color="#c9a96e" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#ede5d5', marginBottom: 3 }}>{title}</div>
                    <div style={{ fontSize: 12.5, color: '#a09070', lineHeight: 1.55 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct email */}
            <a href="mailto:support@getatlas.ca?subject=Free%20missed-lead%20audit" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 28, fontSize: 13, color: '#c9a96e', textDecoration: 'none' }}>
              <EnvelopeSimple size={16} aria-hidden="true" /> Prefer email? support@getatlas.ca
            </a>

            {/* Travel app link */}
            <div style={{ marginTop: 40, paddingTop: 28, borderTop: '1px solid #3a3228' }}>
              <div style={{ fontSize: 12, color: '#a09070', marginBottom: 10 }}>Looking for the travel app?</div>
              <Link href="/travel" prefetch={false} style={{ fontSize: 13, color: '#c9a96e', textDecoration: 'none', fontWeight: 600 }}>
                Atlas AI Travel Planner →
              </Link>
            </div>
          </div>

          {/* Right: Form */}
          <div className="contact-form" style={{ background: '#231f18', border: '1px solid #3a3228', borderRadius: 16, padding: '36px 32px' }}>
            <ContactForm initialService={service} attribution={attribution} />
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #3a3228', padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: '#a09070' }}>
          © {new Date().getFullYear()} Atlas AI Technology &nbsp;·&nbsp;
          <Link href="/#services" style={{ color: '#a09070', textDecoration: 'none' }}>Services</Link>
          &nbsp;·&nbsp;
          <Link href="/blog" style={{ color: '#a09070', textDecoration: 'none' }}>Blog</Link>
          &nbsp;·&nbsp;
          <Link href="/travel" prefetch={false} style={{ color: '#a09070', textDecoration: 'none' }}>Travel App</Link>
        </div>
      </footer>
    </div>
  );
}
