import type { Metadata } from 'next';
import Link from 'next/link';
import { LockSimple, Globe } from '@phosphor-icons/react/dist/ssr';
import SiteNav from '../components/SiteNav';
import styles from '../business.module.css';
import { BusinessFooter } from '../components/BusinessBlocks';
import RevealRoot from '../components/fx/RevealRoot';
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

// Envelope outline (same shape as the other line icons), inlined for the email_off link below.
const MAIL_ICON =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.8 6.5 8.2 6.2 8.2-6.2"/></svg>';

const NEXT_STEPS = [
  { title: 'We review your request', desc: 'Atlas reads every request personally and usually replies within two business days.' },
  { title: 'Your free audit report', desc: 'A 1-page report with what we found and a simple fix plan, usually within 2–3 business days.' },
  { title: 'Optional 15-minute call', desc: 'If you want us to fix it, we agree on a fixed founding price in writing. No obligation.' },
];

const TRUST = [
  { Icon: LockSimple, title: 'Handled with care', desc: 'Your details are only used to review and respond to your request, as described in our privacy policy.' },
  { Icon: Globe, title: 'Canadian and CASL-aware', desc: 'Based in Toronto. Every automated message follows Canadian anti-spam rules.' },
];

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
    <div className={`${styles.page} ${styles.fx}`}>
      <RevealRoot />
      <SiteNav activePath="/contact" />

      <main className={`${styles.section} ${styles.pageHead}`}>
        <div className={`${styles.wrap} ${styles.contactGrid}`}>
          <div className={styles.contactIntro}>
            <span className={styles.pill}>Toronto · Serving all of Canada</span>
            <span className={styles.eyebrow}>Free · No card · No obligation</span>
            <h1 className={`${styles.h2} ${styles.pageTitle}`}>Get your free missed-lead audit</h1>
            <p className={styles.lead}>
              Tell us about your business and how customers reach you. We test how fast new enquiries get an answer and send you a short report with a fix plan. Want Lead Rescue or the Follow-Up System instead? Pick it in the form.
            </p>
          </div>

          <div className={styles.contactFormCard}>
            <ContactForm initialService={service} attribution={attribution} />
          </div>

          <aside className={styles.contactAside} aria-label="What happens next">
            <div className={styles.summaryCard}>
              <span className={styles.eyebrow}>What happens next</span>
              <ol className={styles.nextSteps}>
                {NEXT_STEPS.map(({ title, desc }, index) => (
                  <li key={title} className={styles.nextStep}>
                    <span className={styles.nextNum} aria-hidden="true">{index + 1}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className={styles.trustList}>
                {TRUST.map(({ Icon, title, desc }) => (
                  <div key={title} className={styles.trustItem}>
                    <Icon size={18} aria-hidden="true" />
                    <div>
                      <h3>{title}</h3>
                      <p>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cloudflare's email obfuscation rewrites plain emails in the HTML, which breaks React
                  hydration. The email_off markers tell Cloudflare to leave this link alone. */}
              <span
                className={styles.mailWrap}
                dangerouslySetInnerHTML={{
                  __html: `<!--email_off--><a class="${styles.mailLink}" href="mailto:support@getatlas.ca?subject=Free%20missed-lead%20audit">${MAIL_ICON} Prefer email? support@getatlas.ca</a><!--/email_off-->`,
                }}
              />

              <div className={styles.travelNote}>
                <div>Looking for the travel app?</div>
                <Link href="/travel" prefetch={false}>Atlas AI Travel Planner →</Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <BusinessFooter extra={[{ href: '/blog', label: 'Blog' }]} />
    </div>
  );
}
