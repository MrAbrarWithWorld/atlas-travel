import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Lightning, Warning } from '@phosphor-icons/react/dist/ssr';
import SiteNav from '../components/SiteNav';
import styles from '../business.module.css';
import {
  AuditBand,
  WhyUsSection,
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
  /** Plain outcomes the owner will notice. No numbers or promised results. */
  easier: string[];
  startWith: string;
  faqs: Faq[];
};

export const NICHES: Record<'trades' | 'realtors' | 'property-managers' | 'bookkeepers' | 'salons' | 'restaurants' | 'agencies', Niche> = {
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
    easier: [
      "You can stay on the job: callers get a reply even when you can't pick up.",
      'Every enquiry sits in one list, not in your head or your text messages.',
      'Quotes get a follow-up without you having to remember.',
      'Happy customers are asked for a review while the job is fresh.',
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
    metaTitle: 'Lead Follow-Up Automation for Realtors, Brokerages & Mortgage Agents in Toronto',
    metaDescription:
      'Reply to portal and website leads in seconds, run a 7-day follow-up you approve and keep every contact tagged in one CRM. Built for GTA realtors and mortgage agents. Free audit.',
    eyebrow: 'For real estate agents, brokerages & mortgage agents',
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
    easier: [
      'New leads hear from you within minutes, even during a showing.',
      'Follow-ups go out on schedule, and you approve each one.',
      'Past clients hear from you on anniversaries, which keeps referrals coming.',
      'You can see at a glance who is buying, selling, renting or financing.',
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
  'property-managers': {
    slug: 'property-managers',
    metaTitle: 'Tenant Enquiry, Showing & Maintenance Request Automation for Property Managers in Toronto',
    metaDescription:
      'For property managers, condo management offices and landlords: answer rental enquiries fast, book showings, log every maintenance request and keep owners updated. Free audit.',
    eyebrow: 'For property managers & landlords',
    h1: 'Faster replies to tenants. Fewer dropped requests.',
    intro:
      'Rental enquiries, showing requests and maintenance messages arrive all day by email, phone and portal. We set up a simple system that replies first, books what can be booked and keeps every request in one list your team can follow. Decisions stay with you.',
    pains: [
      'Rental enquiries wait hours for a reply, and good applicants rent elsewhere.',
      'Showing times are arranged through long back-and-forth messages.',
      'Maintenance requests come in by text, email and phone, and some get lost.',
      'Owners and boards ask for updates that take hours to put together.',
    ],
    builds: [
      'Instant reply to rental enquiries with a link to book a showing',
      'Showing reminders and a follow-up for unfinished applications',
      'One maintenance request form that logs each request and alerts the right person',
      'A simple weekly summary of open requests for owners or boards',
    ],
    easier: [
      'Prospects get an answer while they are still looking.',
      'Every maintenance request has a record, a status and a person responsible.',
      'Your team spends less time copying details between email and spreadsheets.',
      'Approvals, tenant decisions and anything sensitive stay with a person.',
    ],
    startWith: 'process-automation',
    faqs: [
      {
        q: 'Do I need to change my property management software?',
        a: 'Usually not. We connect the tools you already use where they allow it, such as email, forms and calendars. We check this in the free audit before you pay anything.',
      },
      {
        q: 'Who decides on applications and repairs?',
        a: 'You do. The system replies, collects details and sends reminders. Approvals and tenant decisions stay with your team.',
      },
      {
        q: 'How much is it?',
        a: 'Simple enquiry replies can start with Lead Rescue at $99 setup + $29/month (founding price). Maintenance logs and owner reports are quoted in writing first, from $500.',
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
    easier: [
      'Clients get one clear checklist instead of back-and-forth emails.',
      'Reminders go out on their own, so you chase less in tax season.',
      'New client details land in your records without retyping.',
      'You can see at a glance who is ready and who is still missing documents.',
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
  salons: {
    slug: 'salons',
    metaTitle: 'Booking Replies, Reminders & Review Requests for Salons and Spas in Toronto',
    metaDescription:
      'For salons, spas and studios: answer booking enquiries in seconds, send appointment reminders and ask for reviews automatically. Built for Toronto and GTA owners. Free audit.',
    eyebrow: 'For salons, spas & studios',
    h1: 'Fewer no-shows. More reviews. Less time on the phone.',
    intro:
      'You are with a client when the phone rings or a message arrives. We set up instant replies with your booking link, friendly appointment reminders and a review request after each visit, so the chair stays full without you glued to your phone.',
    pains: [
      'Booking enquiries wait until the end of the day, and the customer books somewhere else.',
      'No-shows leave gaps you cannot refill at short notice.',
      'Happy clients rarely leave a review unless someone asks.',
      'Instagram, calls and web messages all land in different places.',
    ],
    builds: [
      'Instant reply to every enquiry, with your booking link',
      'Appointment reminders that make it easy to confirm or reschedule',
      'A polite review request sent after the visit',
      'All enquiries saved in one simple list',
    ],
    easier: [
      'Clients can book from a text, even while you are with someone.',
      'Reminders go out before appointments, so fewer people forget.',
      'Clients are asked for a review after their visit.',
      'Regulars who have gone quiet get a friendly note to come back.',
    ],
    startWith: 'lead-rescue',
    faqs: [
      {
        q: 'Do I have to change my booking software?',
        a: 'No. We work with the booking link or calendar you already use. We check this in the free audit before you pay anything.',
      },
      {
        q: 'Who writes the messages?',
        a: 'We write them with you, in your tone, and you approve the wording before anything goes live.',
      },
      {
        q: 'How much is it?',
        a: 'Lead Rescue is $99 setup + $29/month with the first month free (founding price). Review requests are part of the Follow-Up System at $299 setup + $59/month.',
      },
    ],
  },
  restaurants: {
    slug: 'restaurants',
    metaTitle: 'Catering Enquiry Replies & Review Requests for Restaurants and Local Shops in Toronto',
    metaDescription:
      'For restaurants, cafes and local shops: answer catering and event enquiries in seconds, follow up on quotes and collect reviews automatically. Toronto and GTA. Free audit.',
    eyebrow: 'For restaurants & local shops',
    h1: 'Answer every catering enquiry while it is still hot.',
    intro:
      'Catering and event enquiries often go to whoever replies first. We set up an instant, friendly reply with your menu or quote link, remind you to follow up and ask happy customers for a review.',
    pains: [
      'Catering enquiries arrive during the lunch rush and get answered a day later.',
      'Quotes are sent and nobody checks back.',
      'Reviews depend on customers remembering to leave one.',
      'Enquiries come by phone, email, Instagram and your website.',
    ],
    builds: [
      'Instant reply to website and email enquiries, with your menu or quote link',
      'Missed-call text-back during busy hours',
      'A reminder list of quotes that still need a follow-up',
      'A review request sent after the order or event',
    ],
    easier: [
      'Catering and event enquiries get an answer the same hour.',
      'Order and booking details land in one place instead of several inboxes.',
      'Guests are asked for a review after their visit.',
      'You spend less time on the phone and more time on the floor.',
    ],
    startWith: 'lead-rescue',
    faqs: [
      {
        q: 'Does this work for a small, one-location business?',
        a: 'Yes. The systems are built for owner-run businesses. Lead Rescue starts at $99 setup + $29/month (founding price).',
      },
      {
        q: 'Will customers know it is automated?',
        a: 'Messages are written in your voice and sent in your business name. Anything that needs a human answer is flagged to you right away.',
      },
      {
        q: 'What does the free audit show?',
        a: 'We test how fast your website form, email and phone answer an enquiry, then send a one-page report with a simple fix plan.',
      },
    ],
  },
  agencies: {
    slug: 'agencies',
    metaTitle: 'Automation Builds for Agencies and Freelancers in Canada',
    metaDescription:
      'For agencies, consultants and freelancers: lead capture, client intake, reports and follow-up automations built to a fixed written quote. Toronto-based. Free audit.',
    eyebrow: 'For agencies & freelancers',
    h1: 'Automations you can offer your own clients.',
    intro:
      'You sell the creative or consulting work; we build the plumbing. Lead capture, client intake forms, reporting and follow-ups, designed with you and quoted in writing before any work starts.',
    pains: [
      'Enquiries and onboarding run on email threads and spreadsheets.',
      'Clients ask for reports you assemble by hand every month.',
      'Follow-ups on proposals depend on your memory.',
      'You turn down automation requests because you do not have time to build them.',
    ],
    builds: [
      'Lead capture that saves every enquiry to one place',
      'Client intake forms and onboarding checklists',
      'Monthly report and dashboard automation from your own data',
      'Proposal follow-up reminders you approve',
    ],
    easier: [
      'You can offer automation to clients without hiring a developer.',
      'Each build comes with notes your team can use to explain it.',
      "Your clients' accounts stay in their name.",
      'A fixed quote per project keeps your own margin clear.',
    ],
    startWith: 'workflow-automation',
    faqs: [
      {
        q: 'How is custom work priced?',
        a: 'Custom Automation starts from $500 and always begins with a fixed written quote, so you know the cost before work starts.',
      },
      {
        q: 'Can you work to my own tools and brand?',
        a: 'We connect to the tools you already use. What is possible depends on the tool, and we confirm it in the free audit before you pay.',
      },
      {
        q: 'Where do I start?',
        a: 'Book the free audit or describe one workflow you repeat every week. We will tell you honestly whether automating it is worth it.',
      },
    ],
  },
};

export function nicheMetadata(data: Niche): Metadata {
  return {
    title: { absolute: `${data.metaTitle} | Atlas AI Technologies` },
    description: data.metaDescription,
    alternates: { canonical: `/for/${data.slug}` },
    openGraph: {
      type: 'website',
      url: `https://getatlas.ca/for/${data.slug}`,
      siteName: 'Atlas AI Technologies',
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
    provider: { '@type': 'ProfessionalService', name: 'Atlas AI Technologies', url: 'https://getatlas.ca/' },
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

        <section className={styles.section} aria-labelledby="easier-title">
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>After setup</span>
            <h2 id="easier-title" className={styles.h2}>What gets easier</h2>
            <ul className={styles.easierList}>
              {data.easier.map((item) => (
                <li key={item}><CheckCircle size={18} weight="fill" aria-hidden="true" /><span>{item}</span></li>
              ))}
            </ul>
          </div>
        </section>

        <WhyUsSection />
        <PricingSection heading="Founding prices. Start free." />
        <AuditBand />
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
