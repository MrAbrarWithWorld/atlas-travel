import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from '@phosphor-icons/react/dist/ssr';
import SiteNav from '../../components/SiteNav';
import styles from '../../business.module.css';
import { BusinessFooter, FaqSection, FinalCta, faqJsonLd, type Faq } from '../../components/BusinessBlocks';
import { contactFor } from '../../lib/offer';
import { SITE, breadcrumbs, jsonLd } from '../../lib/schema';

const PATH = '/guides/how-to-choose-an-automation-partner';
const TITLE = 'How to Choose an Automation Partner for Your Small Business (Toronto Guide)';
const DESCRIPTION =
  'A plain checklist for small-business owners hiring someone to automate lead follow-up, intake or reporting: what to ask, what to avoid, and how to start with a low-risk test.';
const PUBLISHED = '2026-10-27';

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Atlas AI Technologies` },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: 'article',
    url: `${SITE}${PATH}`,
    siteName: 'Atlas AI Technologies',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

const CHECKLIST: { title: string; text: string }[] = [
  {
    title: 'Start from one problem, not from a tool',
    text: 'Good projects begin with a sentence like “we lose enquiries that arrive after 5 pm”. If a vendor starts by listing software, ask which problem it fixes and how you will measure it.',
  },
  {
    title: 'Ask for a fixed written quote',
    text: 'You should know the setup cost and the monthly cost before work starts. Be careful with open-ended hourly estimates for a first project.',
  },
  {
    title: 'Check what you can see and approve',
    text: 'Messages that go to your customers should use your wording and wait for your approval at first. Ask to see every message before it goes live.',
  },
  {
    title: 'Find out who owns the accounts',
    text: 'Your CRM, forms, phone numbers and automations should sit in accounts you control. If you leave, you should be able to take them with you.',
  },
  {
    title: 'Ask how your customers’ data is handled',
    text: 'In Canada this includes consent for commercial messages (CASL) and privacy law. A partner should be able to say where data is stored and what is kept.',
  },
  {
    title: 'Look for a low-risk first step',
    text: 'A free audit, a small pilot or a month-to-month plan lets you test the result before committing. Long contracts for an untested system are a warning sign.',
  },
  {
    title: 'Ask what happens when something breaks',
    text: 'Automations fail sometimes: a form changes, a phone provider updates. Ask who monitors it, how fast they respond and what support is included.',
  },
  {
    title: 'Be wary of guarantees and rankings',
    text: 'Nobody can honestly guarantee more sales. Be sceptical of “top agency” lists written by the agency itself, and ask for work you can look at or speak to a client about.',
  },
];

const FAQS: Faq[] = [
  {
    q: 'What should a small business automate first?',
    a: 'Usually the step where leads are lost today: answering missed calls and web enquiries quickly, and following up on quotes. These are simple to set up and easy to measure.',
  },
  {
    q: 'How long does a first automation take?',
    a: 'A simple lead-reply system can often be live in about two weeks. Larger projects such as client portals or dashboards take longer and should come with a written timeline.',
  },
  {
    q: 'Do I need to replace my current software?',
    a: 'Often not. Many automations connect through email, forms, calendars and shared folders you already use. A good partner confirms this before you pay.',
  },
  {
    q: 'What does Atlas AI Technologies offer?',
    a: 'We are a Toronto-based studio that sets up lead follow-up, intake and reporting automations for small businesses. We start with a free missed-lead audit, then quote any work in writing.',
  },
];

export default function GuidePage() {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITLE,
    description: DESCRIPTION,
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    author: { '@type': 'Organization', name: 'Atlas AI Technologies', url: `${SITE}/` },
    publisher: { '@type': 'Organization', name: 'Atlas AI Technologies', url: `${SITE}/` },
    mainEntityOfPage: `${SITE}${PATH}`,
  };

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([articleJsonLd, breadcrumbs('Guide: choosing an automation partner', PATH), faqJsonLd(FAQS)])}
      />
      <SiteNav activePath={PATH} ctaLabel="Free audit →" ctaHref={contactFor('free-audit')} />
      <main>
        <section className={styles.hero}>
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>Guide · Updated October 2026</span>
            <h1 className={styles.h1}>How to choose an automation partner for your small business.</h1>
            <p className={styles.heroText}>
              Hiring someone to automate follow-ups, intake or reports is easy to get wrong. Here is a plain checklist you
              can use with any provider, including us, and a low-risk way to start.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primary} href={contactFor('free-audit')}>
                Get my free missed-lead audit <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="checklist-title">
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>The checklist</span>
            <h2 id="checklist-title" className={styles.h2}>Eight questions to ask before you hire anyone.</h2>
            <div className={styles.proofGrid}>
              {CHECKLIST.map((item) => (
                <div key={item.title} className={styles.card}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="start-title">
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>A low-risk start</span>
            <h2 id="start-title" className={styles.h2}>Test before you commit.</h2>
            <p className={styles.lead}>
              Before paying for anything, find out how many leads you lose today. A short audit tests how fast your website
              form, email and phone answer an enquiry and gives you a one-page fix plan, whether or not you hire anyone.
            </p>
            <ul className={styles.features}>
              {[
                'Pick one problem you can measure, such as response time to new enquiries.',
                'Ask for a fixed written quote and a month-to-month plan.',
                'Approve every customer-facing message at the start.',
                'Review the results after a month before adding more.',
              ].map((step) => (
                <li key={step}><CheckCircle size={16} weight="fill" aria-hidden="true" /><span>{step}</span></li>
              ))}
            </ul>
          </div>
        </section>

        <FaqSection items={FAQS} />
        <FinalCta
          title="Find out how many leads you are missing. Free."
          text="We test your response time and send a short report with a fix plan. No card, no obligation."
        />
      </main>
      <BusinessFooter />
    </div>
  );
}
