import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import SiteNav from '../../components/SiteNav';
import styles from '../../business.module.css';
import { AuditBand, BusinessFooter, FaqSection, FinalCta, faqJsonLd, type Faq } from '../../components/BusinessBlocks';
import { contactFor, PAID_PLANS } from '../../lib/offer';
import { SITE, breadcrumbs, jsonLd } from '../../lib/schema';

const PATH = '/guides/diy-automation-vs-hiring-help';
const TITLE = 'DIY Automation vs Hiring Help: A Fair Guide for Small Businesses';
const DESCRIPTION =
  'Tools like HubSpot, Zapier, Make and GoHighLevel can do a lot. Here is when to set up lead follow-up yourself, when to hire help, and what each really costs you in time.';
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

const OPTIONS: { title: string; best: string; points: string[] }[] = [
  {
    title: 'Do it yourself',
    best: 'Best if you enjoy tools and have a few free hours a week.',
    points: [
      'Platforms such as HubSpot, Zapier, Make and GoHighLevel are capable and widely used.',
      'You pay for the software, and your own time is the main cost.',
      'You learn how it works, so changes are easy later.',
      'Watch for: forms that change, phone and text rules, and silent failures nobody notices.',
    ],
  },
  {
    title: 'Hire a freelancer or studio',
    best: 'Best if you want it working without learning the tools.',
    points: [
      'Someone else maps your process, builds it and tests it.',
      'Ask for a fixed written quote and for the accounts to be in your name.',
      'Ask who fixes it when something breaks, and what that costs.',
      'Watch for: long contracts, vague scopes, and setups only the builder understands.',
    ],
  },
  {
    title: 'Hire a starter-level setup',
    best: 'Best if you want to test the idea cheaply first.',
    points: [
      `At the moment our Lead Rescue plan is ${PAID_PLANS[0].price}, ${PAID_PLANS[0].priceNote.toLowerCase()}.`,
      'One workflow, one fixed price, month to month.',
      'You approve customer messages before they go out at the start.',
      'You can outgrow it and move to a bigger build or to DIY later.',
    ],
  },
];

const CHECKS = [
  'Do you have three or more free hours a week for the first month?',
  'Are you comfortable connecting a website form, a phone number and email to one tool?',
  'Will you notice if the automation stops working?',
  'Do you know the Canadian rules for commercial text messages (CASL) and consent?',
  'Is a lost lead costing you more than the setup would?',
];

const FAQS: Faq[] = [
  {
    q: 'Is it cheaper to do it myself?',
    a: 'In cash, often yes. In time, usually not for the first setup. A simple form reply can take an afternoon; phone, text, CRM and follow-ups can take weeks, and someone has to keep checking that it still works.',
  },
  {
    q: 'Do you build on top of tools like HubSpot or Zapier?',
    a: 'We connect the tools you already use, such as your form, email, calendar and CRM, instead of replacing them. During the free audit we tell you which tools fit your business before you pay.',
  },
  {
    q: 'Can I start DIY and ask for help later?',
    a: 'Yes. Many owners start with a free auto-reply and add follow-ups later. Keep the accounts in your own name so any helper can take over.',
  },
  {
    q: 'What if I am not sure which option fits?',
    a: 'Start with a free missed-lead audit. It shows how many enquiries you are losing today, and you can use the fix plan yourself or with us.',
  },
];

export default function DiyVsHirePage() {
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
        dangerouslySetInnerHTML={jsonLd([articleJsonLd, breadcrumbs('Guide: DIY vs hiring help', PATH), faqJsonLd(FAQS)])}
      />
      <SiteNav activePath={PATH} ctaLabel="Free audit →" ctaHref={contactFor('free-audit')} />
      <main>
        <section className={styles.hero}>
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>Guide · Updated October 2026</span>
            <h1 className={styles.h1}>DIY automation or hire help? A fair look for small businesses.</h1>
            <p className={styles.heroText}>
              The big platforms are good, and many owners can set up lead follow-up themselves. Here is how to decide, and
              what each path costs in time, money and risk. We sell setup, so we have told you where DIY is the better choice.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primary} href={contactFor('free-audit')}>
                Get my free missed-lead audit <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="options-title">
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>Three ways to do it</span>
            <h2 id="options-title" className={styles.h2}>What each option really asks of you.</h2>
            <div className={styles.proofGrid}>
              {OPTIONS.map((o) => (
                <div key={o.title} className={styles.card}>
                  <h3>{o.title}</h3>
                  <p><strong>{o.best}</strong></p>
                  <ul className={styles.features}>
                    {o.points.map((pt) => <li key={pt}><span>{pt}</span></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <AuditBand />

        <section className={styles.section} aria-labelledby="check-title">
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>Quick self-check</span>
            <h2 id="check-title" className={styles.h2}>Five questions to decide.</h2>
            <ol className={styles.steps}>
              {CHECKS.map((c, i) => (
                <li key={c} className={styles.step}>
                  <h3>{i + 1}</h3>
                  <p>{c}</p>
                </li>
              ))}
            </ol>
            <p className={styles.lead}>
              Mostly yes to the first four: DIY can work well. Mostly no, or yes to the last: a small paid setup usually pays
              for itself. For a neutral way to judge any provider, see our{' '}
              <Link href="/guides/how-to-choose-an-automation-partner">checklist for choosing an automation partner</Link>.
            </p>
          </div>
        </section>

        <FaqSection items={FAQS} />
        <FinalCta
          title="Not sure which path? Start with the free audit."
          text="We test your response time and send a short report with a fix plan. Use it yourself or with us."
        />
      </main>
      <BusinessFooter />
    </div>
  );
}
