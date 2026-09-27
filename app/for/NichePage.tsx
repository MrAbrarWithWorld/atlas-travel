import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Lightning, Warning } from '@phosphor-icons/react/dist/ssr';
import SiteNav from '../components/SiteNav';
import styles from '../business.module.css';
import {
  BusinessFooter,
  FaqSection,
  FinalCta,
  PricingSection,
  StepsSection,
  faqJsonLd,
  type Faq,
} from '../components/BusinessBlocks';
import { contactFor } from '../lib/offer';

type Niche = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  intro: string;
  pains: string[];
  builds: string[];
  startWith: string;
  faqs: Faq[];
};

export const NICHES: Record<'trades' | 'realtors' | 'bookkeepers', Niche> = {
  trades: {
    slug: 'trades',
    metaTitle: 'Missed-Call Text-Back & Lead Follow-Up for Contractors in Toronto',
    metaDescription:
      'For HVAC, plumbing, roofing, renovation and cleaning companies: text back missed calls in seconds, answer web enquiries instantly and follow up on every quote. Free audit.',
    eyebrow: 'For trades & home services',
    h1: 'Stop losing jobs to missed calls.',
    intro:
      'When you are on a roof or under a sink you can’t answer the phone. Lead Rescue texts every missed caller in seconds, saves the lead and tells you who to call back.',
    pains: [
      'Customers who can’t reach you call the next company on Google.',
      'Web enquiries sit in the inbox until the evening.',
      'Quotes go out and nobody follows up.',
      'Reviews are never asked for, so competitors look busier.',
    ],
    builds: [
      'Missed-call text-back with your booking link',
      'Instant reply to website and Google enquiries',
      'All leads in one simple list, with reminders to call back',
      'Automatic quote follow-up and review request after the job',
    ],
    startWith: 'lead-rescue',
    faqs: [
      {
        q: 'Do I need a new phone number?',
        a: 'Usually not. We can forward missed calls from your current number, or add a tracking number if your provider does not support it. We check this in the free audit.',
      },
      {
        q: 'What does the customer receive?',
        a: 'A short, friendly text in your business name, written with you, with a booking or callback link. You approve the wording before it goes live.',
      },
      {
        q: 'How much is it?',
        a: 'Lead Rescue is $99 setup + $29/month with the first month free (founding price). The first 5 founding clients get the setup free for an honest review.',
      },
    ],
  },
  realtors: {
    slug: 'realtors',
    metaTitle: 'Lead Follow-Up Automation for Realtors & Mortgage Agents in Toronto',
    metaDescription:
      'Reply to portal and website leads in seconds, run a 7-day follow-up you approve and keep every contact tagged in one CRM. Built for GTA realtors and mortgage agents. Free audit.',
    eyebrow: 'For realtors & mortgage agents',
    h1: 'Reply to every new lead before it goes cold.',
    intro:
      'Buyers and borrowers contact several agents at once. Atlas answers new leads in seconds in your voice, then runs a follow-up plan you approve, so you spend your time on showings, not inboxes.',
    pains: [
      'Portal and website leads arrive while you are at a showing.',
      'Follow-ups depend on memory and sticky notes.',
      'Past clients are never contacted again, so referrals dry up.',
      'Your CRM is full of untagged, half-finished contacts.',
    ],
    builds: [
      'Instant, personal first reply to every new lead',
      'A 7-day follow-up sequence drafted for your approval',
      'Leads tagged by buyer, seller, rental or mortgage',
      'Anniversary and check-in reminders for past clients',
    ],
    startWith: 'follow-up-system',
    faqs: [
      {
        q: 'Does it work with my brokerage tools?',
        a: 'In most cases yes. If your lead source can send an email or a webhook, we can connect it. We confirm this in the free audit before you pay anything.',
      },
      {
        q: 'Will messages sound like a robot?',
        a: 'No. We write the messages with you, in your voice. Follow-ups are drafted by AI but wait for your one-tap approval before they are sent.',
      },
      {
        q: 'How much is it?',
        a: 'The Follow-Up System is $299 setup + $59/month (founding price). You can also start with Lead Rescue at $99 setup + $29/month.',
      },
    ],
  },
  bookkeepers: {
    slug: 'bookkeepers',
    metaTitle: 'Client Intake & Document Reminder Automation for Bookkeepers in Canada',
    metaDescription:
      'Automate client intake, document checklists and reminders for bookkeepers and tax preparers. Less chasing during tax season. Free audit, founding prices.',
    eyebrow: 'For bookkeepers & tax preparers',
    h1: 'Less chasing documents. More billable hours.',
    intro:
      'Tax season means dozens of clients, missing slips and the same reminder emails every day. We set up an intake form, a checklist per client and polite automatic reminders, so documents arrive without you chasing.',
    pains: [
      'New clients email documents in pieces, in five different places.',
      'You send the same reminder email again and again.',
      'Enquiries in busy season go unanswered for days.',
      'It is hard to see who is ready and who is still missing slips.',
    ],
    builds: [
      'A simple intake form that creates the client record',
      'A document checklist per client, based on their situation',
      'Automatic, friendly reminders until everything arrives',
      'A weekly list of who is ready, waiting or missing documents',
    ],
    startWith: 'follow-up-system',
    faqs: [
      {
        q: 'Where are client documents stored?',
        a: 'In your own storage, such as Google Drive or OneDrive. We connect to it; we do not keep copies of your clients’ documents.',
      },
      {
        q: 'Can it work with my existing software?',
        a: 'Usually, yes. We connect through email, forms and shared folders, so it works alongside the accounting software you already use.',
      },
      {
        q: 'How much is it?',
        a: 'Most bookkeepers start with the Follow-Up System at $299 setup + $59/month (founding price). The missed-lead audit is free.',
      },
    ],
  },
};

export function nicheMetadata(data: Niche): Metadata {
  return {
    title: { absolute: `${data.metaTitle} | Atlas AI Technology` },
    description: data.metaDescription,
    alternates: { canonical: `/for/${data.slug}` },
    openGraph: {
      type: 'website',
      url: `https://getatlas.ca/for/${data.slug}`,
      siteName: 'Atlas AI Technology',
      title: data.metaTitle,
      description: data.metaDescription,
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
  };
}

export function NicheView({ data }: { data: Niche }) {
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.metaTitle,
    description: data.metaDescription,
    provider: { '@type': 'ProfessionalService', name: 'Atlas AI Technology', url: 'https://getatlas.ca/' },
    areaServed: [
      { '@type': 'City', name: 'Toronto' },
      { '@type': 'Country', name: 'Canada' },
    ],
    url: `https://getatlas.ca/for/${data.slug}`,
  };

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([serviceJsonLd, faqJsonLd(data.faqs)]) }}
      />
      <SiteNav activePath={`/for/${data.slug}`} ctaLabel="Free audit →" ctaHref={contactFor('free-audit')} />
      <main>
        <section className={styles.hero}>
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>{data.eyebrow} · Toronto &amp; GTA</span>
            <h1 className={styles.h1}>{data.h1}</h1>
            <p className={styles.heroText}>{data.intro}</p>
            <div className={styles.actions}>
              <Link className={styles.primary} href={contactFor('free-audit')}>
                Get my free missed-lead audit <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </Link>
              <Link className={styles.secondary} href={contactFor(data.startWith)}>Book a 15-minute call</Link>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="fit-title">
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>Sound familiar?</span>
            <h2 id="fit-title" className={styles.h2}>What we fix</h2>
            <div className={styles.proofGrid}>
              <div className={styles.card}>
                <span className={styles.icon}><Warning size={22} weight="duotone" aria-hidden="true" /></span>
                <h3>Where leads slip away today</h3>
                <ul className={styles.features}>
                  {data.pains.map((pain) => (
                    <li key={pain}><CheckCircle size={16} weight="fill" aria-hidden="true" /><span>{pain}</span></li>
                  ))}
                </ul>
              </div>
              <div className={styles.card}>
                <span className={styles.icon}><Lightning size={22} weight="duotone" aria-hidden="true" /></span>
                <h3>What we set up for you</h3>
                <ul className={styles.features}>
                  {data.builds.map((build) => (
                    <li key={build}><CheckCircle size={16} weight="fill" aria-hidden="true" /><span>{build}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <PricingSection heading="Founding prices. Start free." />
        <StepsSection />
        <FaqSection items={data.faqs} />
        <FinalCta
          title="See how many leads you are missing. Free."
          text="We test your response time and send a short report with a fix plan. No card, no obligation."
        />
      </main>
      <BusinessFooter />
    </div>
  );
}
