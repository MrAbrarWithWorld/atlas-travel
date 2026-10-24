import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import {
  ArrowRight,
  Briefcase,
  Calculator,
  CheckCircle,
  ClockCountdown,
  HouseLine,
  PhoneX,
  ChatsCircle,
  Storefront,
  Wrench,
  Scissors,
  ShieldCheck,
  Code,
} from '@phosphor-icons/react/dist/ssr';
import SiteNav from './components/SiteNav';
import styles from './business.module.css';
import {
  BusinessFooter,
  FaqSection,
  FinalCta,
  FlowSteps,
  PricingSection,
  faqJsonLd,
} from './components/BusinessBlocks';
import RevealRoot from './components/fx/RevealRoot';
import HeroConstellation from './components/fx/HeroConstellation';
import ServiceIcon from './components/fx/ServiceIcon';
import { PAID_PLANS, PRICE_RANGE, contactFor } from './lib/offer';
import { SERVICES, SERVICES_HEADING, SERVICES_LEAD } from './lib/services';
import { FAQS } from './lib/faqs';

// Travel planner moved to /travel (and travel.getatlas.ca); see next.config.ts.

export const metadata: Metadata = {
  title: { absolute: 'Lead Follow-Up Automation for Small Businesses in Toronto | Atlas AI Technology' },
  description:
    'Answer every lead in seconds. Missed-call text-back, instant web-form replies and follow-ups you approve, built in 2 weeks. Free missed-lead audit. Founding prices from $29/month.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://getatlas.ca/',
    siteName: 'Atlas AI Technology',
    title: 'Every lead answered in seconds | Atlas AI Technology',
    description:
      'Missed-call text-back, instant replies and follow-ups you approve. Free audit. Founding prices from $29/month.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

const PROBLEMS = [
  {
    Icon: PhoneX,
    title: 'Missed calls on the job',
    text: 'You are on a roof, with a client, or driving. The customer does not leave a voicemail. They call the next company.',
  },
  {
    Icon: ClockCountdown,
    title: 'Slow replies to web enquiries',
    text: 'Customers often contact more than one business. The first clear reply usually wins the work.',
  },
  {
    Icon: ChatsCircle,
    title: 'Follow-ups that never happen',
    text: 'Quotes go out and nobody checks back. Warm leads go cold because everyone is busy.',
  },
];

const NICHES = [
  { Icon: Wrench, title: 'Trades & home services', text: 'HVAC, plumbing, roofing, renovation and cleaning.', href: '/for/trades' },
  { Icon: HouseLine, title: 'Realtors & mortgage agents', text: 'Answer portal and website leads before they go cold.', href: '/for/realtors' },
  { Icon: Calculator, title: 'Bookkeepers & tax preparers', text: 'Client intake, document checklists and reminders.', href: '/for/bookkeepers' },
  { Icon: Scissors, title: 'Salons, spas & studios', text: 'Booking reminders, fewer no-shows, more reviews.', href: '' },
  { Icon: Storefront, title: 'Restaurants & local shops', text: 'Catering enquiries answered and review requests sent.', href: '' },
  { Icon: Briefcase, title: 'Agencies & freelancers', text: 'Automations you can resell to your own clients.', href: '' },
];

const leadRescue = PAID_PLANS.find((plan) => plan.id === 'lead-rescue')!;

const businessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Atlas AI Technology',
  url: 'https://getatlas.ca/',
  description:
    'Lead follow-up and workflow automation for small businesses: missed-call text-back, instant web-form replies, CRM setup and approved follow-ups.',
  areaServed: [
    { '@type': 'City', name: 'Toronto' },
    { '@type': 'AdministrativeArea', name: 'Greater Toronto Area' },
    { '@type': 'Country', name: 'Canada' },
  ],
  email: 'support@getatlas.ca',
  priceRange: PRICE_RANGE,
  makesOffer: [
    { '@type': 'Offer', name: 'Free Missed-Lead Audit', price: '0', priceCurrency: 'CAD' },
    { '@type': 'Offer', name: 'Lead Rescue', price: '99', priceCurrency: 'CAD', description: '$99 setup + $29/month, first month free' },
    { '@type': 'Offer', name: 'Follow-Up System', price: '299', priceCurrency: 'CAD', description: '$299 setup + $59/month' },
  ],
};

export default function HomePage() {
  return (
    <div className={`${styles.page} ${styles.fx}`}>
      <RevealRoot />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([businessJsonLd, faqJsonLd(FAQS)]) }}
      />
      <SiteNav activePath="/" ctaLabel="Free audit →" ctaHref={contactFor('free-audit')} />

      <main>
        <section className={`${styles.hero} ${styles.fxHero}`}>
          <HeroConstellation targetId="lead-demo" />
          <div className={`${styles.wrap} ${styles.heroGrid}`}>
            <div className={styles.heroIn}>
              <span className={styles.eyebrow}>Atlas AI Technology · Toronto &amp; GTA</span>
              <h1 className={styles.h1}>
                Every lead answered in seconds. <em>Even when you&rsquo;re on the job.</em>
              </h1>
              <p className={styles.heroText}>
                We set up simple automations for small businesses: missed-call text-back, instant replies
                to website enquiries, and follow-ups you approve with one tap. Built for you in about two weeks.
                Founding prices from $29/month.
              </p>
              <div className={styles.actions}>
                <Link className={styles.primary} href={contactFor('free-audit')}>
                  Get my free missed-lead audit <ArrowRight size={16} weight="bold" aria-hidden="true" />
                </Link>
                <Link className={styles.secondary} href="#pricing">See prices</Link>
              </div>
              <div className={styles.trustRow}>
                <span><CheckCircle size={18} weight="fill" aria-hidden="true" /> Free audit, no card</span>
                <span><CheckCircle size={18} weight="fill" aria-hidden="true" /> You approve every follow-up</span>
                <span><CheckCircle size={18} weight="fill" aria-hidden="true" /> Cancel anytime</span>
                <span><CheckCircle size={18} weight="fill" aria-hidden="true" /> 30-day money-back</span>
              </div>
            </div>

            <div className={styles.demoStage}>
            <div id="lead-demo" className={styles.demo} aria-label="Example: how Lead Rescue handles a missed call">
              <div className={styles.demoHead}>
                <span>Example · Lead Rescue</span>
                <span className={styles.live}>Running</span>
              </div>
              <ol className={styles.events}>
                <li className={styles.event}>
                  <span className={styles.time}>7:42 pm</span>
                  <div>
                    <div className={styles.eventTitle}>Missed call</div>
                    <div className={styles.eventBody}>New number. No voicemail left.</div>
                  </div>
                </li>
                <li className={styles.event}>
                  <span className={styles.time}>7:42 pm</span>
                  <div>
                    <div className={styles.eventTitle}>Text sent automatically</div>
                    <div className={styles.eventBody}>&ldquo;Sorry we missed you! How can we help? You can also book here: …&rdquo;</div>
                  </div>
                </li>
                <li className={styles.event}>
                  <span className={styles.time}>7:44 pm</span>
                  <div>
                    <div className={styles.eventTitle}>Customer replied</div>
                    <div className={styles.eventBody}>&ldquo;AC stopped working, need a quote this week.&rdquo;</div>
                  </div>
                </li>
                <li className={`${styles.event} ${styles.eventDone}`}>
                  <span className={styles.time}>7:44 pm</span>
                  <div>
                    <div className={styles.eventTitle}>Saved to CRM + owner alerted</div>
                    <div className={styles.eventBody}>Follow-up drafted and waiting for your OK.</div>
                  </div>
                </li>
              </ol>
              <div className={styles.demoFoot}>
                {leadRescue.name}: {leadRescue.price} · {leadRescue.priceNote.toLowerCase()}
              </div>
            </div>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="problem-title">
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>The problem</span>
            <h2 id="problem-title" className={styles.h2}>Most small businesses don&rsquo;t lack leads. They lose them.</h2>
            <p className={styles.lead}>
              Not because the work is bad. Because nobody had time to answer. Our systems answer for you,
              keep every lead in one place and remind you who to call back.
            </p>
            <div className={styles.problems}>
              {PROBLEMS.map(({ Icon, title, text }, i) => (
                <div key={title} className={styles.card} data-reveal="" style={{ '--d': `${i * 90}ms` } as CSSProperties}>
                  <span className={styles.icon}><Icon size={22} weight="duotone" aria-hidden="true" /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className={styles.section} aria-labelledby="services-title">
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>What we build</span>
            <h2 id="services-title" className={styles.h2}>{SERVICES_HEADING}</h2>
            <p className={styles.lead}>{SERVICES_LEAD}</p>
            {/* Cards open the service's detail block on /services; Contact is the CTA inside it. */}
            <div className={`${styles.nicheGrid} ${styles.svcGrid}`}>
              {SERVICES.map(({ icon, title, text, slug }, i) => (
                <Link
                  key={slug}
                  href={`/services#${slug}`}
                  className={styles.niche}
                  data-reveal=""
                  data-glow=""
                  style={{ '--d': `${(i % 4) * 80}ms` } as CSSProperties}
                >
                  <span className={styles.iconTile}><ServiceIcon id={icon} /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <span className={styles.more}>See details →</span>
                </Link>
              ))}
            </div>
            <div className={styles.moreRow}>
              <Link className={styles.moreLink} href="/services">See all services →</Link>
            </div>
          </div>
        </section>

        <PricingSection fx more={{ href: '/pricing', label: 'All prices →' }} />

        <section className={styles.section} aria-labelledby="who-title">
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>Who it&rsquo;s for</span>
            <h2 id="who-title" className={styles.h2}>Built for busy owners who can&rsquo;t sit by the phone.</h2>
            <div className={styles.nicheGrid}>
              {NICHES.map(({ Icon, title, text, href }, i) => {
                const inner = (
                  <>
                    <span className={styles.icon}><Icon size={22} weight="duotone" aria-hidden="true" /></span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                    {href && <span className={styles.more}>See how it works →</span>}
                  </>
                );
                const fxProps = { 'data-reveal': '', style: { '--d': `${(i % 3) * 90}ms` } as CSSProperties };
                return href ? (
                  <Link key={title} href={href} className={styles.niche} data-glow="" {...fxProps}>{inner}</Link>
                ) : (
                  <div key={title} className={styles.niche} {...fxProps}>{inner}</div>
                );
              })}
            </div>
          </div>
        </section>

        <FlowSteps />

        <section className={styles.section} aria-labelledby="proof-title">
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>Why trust us</span>
            <h2 id="proof-title" className={styles.h2}>Proof through work, not promises.</h2>
            <div className={styles.proofGrid}>
              <div className={styles.card} data-reveal="">
                <span className={styles.icon}><Code size={22} weight="duotone" aria-hidden="true" /></span>
                <h3>Engineer-built, on proven tools</h3>
                <p>
                  Every system is built and tested by an automation engineer, not a template. Our own enquiries
                  run on the same kind of system we sell: every lead is logged, tracked and followed up.
                </p>
                <div className={styles.stack}>
                  {['n8n', 'Supabase', 'Gmail & Outlook', 'Google Calendar', 'Webhooks & APIs', 'AI drafting'].map((tool) => (
                    <span key={tool} className={styles.chip}>{tool}</span>
                  ))}
                </div>
              </div>
              <div className={styles.card} data-reveal="" style={{ '--d': '90ms' } as CSSProperties}>
                <span className={styles.icon}><ShieldCheck size={22} weight="duotone" aria-hidden="true" /></span>
                <h3>Low risk by design</h3>
                <p>
                  Start with a free audit. Pay a small setup fee only when you want the system. Month to month,
                  30-day money-back on setup, and every message follows Canadian anti-spam rules (CASL).
                </p>
                <p className={styles.founder}>
                  Designed, built and supported from <strong>Toronto, Canada</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        <FaqSection items={FAQS} more={{ href: '/faq', label: 'More questions →' }} />

        <FinalCta
          title="Find out how many leads you are missing. Free."
          text="Tell us about your business. We test your response time and send a short report with a fix plan within 2–3 business days."
          pricingHref="/pricing"
          textured
        />
      </main>

      <BusinessFooter />
    </div>
  );
}
