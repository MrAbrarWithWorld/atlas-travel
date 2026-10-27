import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '../components/SiteNav';
import styles from '../business.module.css';
import { BusinessFooter, FaqSection, faqJsonLd, type Faq } from '../components/BusinessBlocks';
import { contactFor } from '../lib/offer';
import { SITE, breadcrumbs, jsonLd } from '../lib/schema';

const PATH = '/partners';
const TITLE = 'Partner with Atlas AI Technologies';
const DESCRIPTION =
  'For IT companies, web and marketing agencies, consultants and freelancers: refer a client, bring us in to build automation for your clients, or work with us project by project.';
// Partner enquiries go by email, not the contact form, so the lead-intake pipeline stays unchanged.
const MAILTO = 'mailto:support@getatlas.ca?subject=Partnership%20enquiry';

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Referrals, agencies & freelancers` },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: 'website',
    url: `${SITE}${PATH}`,
    siteName: 'Atlas AI Technologies',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

const WAYS: { title: string; who: string; text: string }[] = [
  {
    title: 'Refer a client',
    who: 'Accountants, IT support, web designers, consultants',
    text: 'Know a business that loses leads or is buried in admin? Introduce us. We run the free audit, quote in writing and keep you posted. Any thank-you for referrals is agreed in writing before the first introduction.',
  },
  {
    title: 'Build together',
    who: 'IT companies and web or marketing agencies',
    text: 'Bring us in for the automation or AI part of a client project, co-branded or under your brand. You keep the client relationship. We build, test and hand over notes your team can use.',
  },
  {
    title: 'Work with us project by project',
    who: 'Freelance developers, designers and writers',
    text: 'We are not hiring employees right now. If you build integrations, design, write or support clients, send us a few examples of your work. We bring in help when a project needs it.',
  },
];

const STEPS = [
  { title: 'A short call', text: 'We talk about your clients, your skills and whether working together makes sense.' },
  { title: 'Everything in writing', text: 'Scope, who speaks to the client, how payment works and any referral thank-you. Before any work starts.' },
  { title: 'Client data stays safe', text: 'Client data stays in client accounts wherever possible, and every message follows Canadian anti-spam law (CASL).' },
  { title: 'Clear hand-over', text: 'Each build comes with notes, so you and the client know how it works.' },
];

const FAQS: Faq[] = [
  {
    q: 'Do you pay referral fees?',
    a: 'We agree any referral thank-you in writing, case by case, before you introduce a client. We do not pay for introductions that were not agreed first.',
  },
  {
    q: 'Can you work under our brand?',
    a: 'Yes, for build projects with agencies and IT companies. We agree in writing how we are presented and who speaks to the client.',
  },
  {
    q: 'Are you hiring?',
    a: 'Not employees at the moment. We work with freelancers project by project. Email us a short note and a few examples of your work and we will keep it on file.',
  },
  {
    q: 'Do you work with partners outside Canada?',
    a: 'Yes. We are based in Toronto and work with partners and clients in other countries by phone and video.',
  },
];

export default function PartnersPage() {
  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd([breadcrumbs('Partner with us', PATH), faqJsonLd(FAQS)])} />
      <SiteNav activePath={PATH} ctaLabel="Get a free audit" ctaHref={contactFor('free-audit')} />
      <main>
        <section className={styles.hero}>
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>Partners</span>
            <h1 className={styles.h1}>Work with us on automation and AI projects.</h1>
            <p className={styles.heroText}>
              We are a small Toronto studio. We work with IT companies, agencies, consultants and freelancers whose
              clients need automation or AI, and with people who want to help us build it.
            </p>
            <div className={styles.actions}>
              <a className={styles.primary} href={MAILTO}>Email us about partnering</a>
              <Link className={styles.secondary} href="/services">See what we build</Link>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="ways-title">
          <div className={styles.wrap}>
            <h2 id="ways-title" className={styles.h2}>Three ways to work together</h2>
            <div className={styles.threeGrid}>
              {WAYS.map((w) => (
                <div key={w.title} className={styles.card}>
                  <h3>{w.title}</h3>
                  <p><strong>{w.who}</strong></p>
                  <p style={{ marginTop: 10 }}>{w.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="how-partner-title">
          <div className={styles.wrap}>
            <h2 id="how-partner-title" className={styles.h2}>How it works</h2>
            <ol className={styles.steps}>
              {STEPS.map((step) => (
                <li key={step.title} className={styles.step}>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <FaqSection items={FAQS} />

        <section className={styles.final}>
          <div className={styles.wrap}>
            <h2 className={styles.h2}>Have a client or a skill that fits?</h2>
            <p className={styles.lead}>Send a short note to support@getatlas.ca.</p>
            <div className={styles.actions}>
              <a className={styles.primary} href={MAILTO}>Email us about partnering</a>
            </div>
          </div>
        </section>
      </main>
      <BusinessFooter />
    </div>
  );
}
