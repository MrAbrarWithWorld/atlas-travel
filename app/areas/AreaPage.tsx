import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, MapPin } from '@phosphor-icons/react/dist/ssr';
import SiteNav from '../components/SiteNav';
import styles from '../business.module.css';
import { AuditBand, BusinessFooter, FaqSection, FinalCta, StepsSection, faqJsonLd, type Faq } from '../components/BusinessBlocks';
import { AREAS, getArea } from '../lib/areas';
import { contactFor, PAID_PLANS } from '../lib/offer';
import { SITE, breadcrumbs, businessNode, jsonLd } from '../lib/schema';

export function areaMetadata(slug: string): Metadata {
  const area = getArea(slug);
  if (!area) return {};
  const title = `Missed-Call Text-Back & Lead Follow-Up in ${area.name} | Atlas AI Technologies`;
  const description = `Lead follow-up and missed-call text-back for small businesses in ${area.name}. Free audit, fixed written quote, month-to-month. Remote setup by phone and video.`;
  const path = `/areas/${area.slug}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      url: `${SITE}${path}`,
      siteName: 'Atlas AI Technologies',
      title,
      description,
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
  };
}

export function AreaView({ slug }: { slug: string }) {
  const area = getArea(slug);
  if (!area) throw new Error(`Unknown service area: ${slug}`);
  const path = `/areas/${area.slug}`;
  const lead = PAID_PLANS[0];

  const faqs: Faq[] = [
    {
      q: `Do you work with businesses in ${area.name}?`,
      a: `Yes. We are a Toronto-based studio. We work with small businesses across the GTA, including ${area.name}, and with clients in other countries too. Setup is done by phone and video, so you do not need to visit an office.`,
    },
    {
      q: `Does it work with ${area.areaCodes} phone numbers?`,
      a: 'Missed-call text-back works with most Canadian business numbers. We confirm yours during the free audit, before you pay anything.',
    },
    {
      q: 'How much does it cost?',
      a: `Lead Rescue is ${lead.price} (${lead.priceNote.toLowerCase()}) at our founding price. Bigger projects get a fixed written quote first. Prices are in CAD plus applicable tax.`,
    },
    {
      q: 'Do I have to sign a contract?',
      a: 'No long contract. Plans are month to month, and there is a 30-day money-back guarantee on the setup fee.',
    },
  ];

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Lead follow-up and missed-call text-back in ${area.name}`,
    serviceType: 'Small business lead follow-up automation',
    provider: { '@id': `${SITE}/#business` },
    areaServed: { '@type': 'City', name: area.name },
    url: `${SITE}${path}`,
  };

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([businessNode(), serviceJsonLd, breadcrumbs(`${area.name} service area`, path), faqJsonLd(faqs)])}
      />
      <SiteNav activePath={path} ctaLabel="Free audit →" ctaHref={contactFor('free-audit')} />
      <main>
        <section className={styles.hero}>
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>
              <MapPin size={14} weight="bold" aria-hidden="true" /> Service area · {area.name}
            </span>
            <h1 className={styles.h1}>Stop losing {area.name} customers to slow replies.</h1>
            <p className={styles.heroText}>{area.localNote}</p>
            <div className={styles.actions}>
              <Link className={styles.primary} href={contactFor('free-audit')}>
                Get my free audit <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </Link>
              <Link className={styles.secondary} href="/pricing">See founding prices</Link>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="fit-title">
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>Who it fits</span>
            <h2 id="fit-title" className={styles.h2}>Small businesses in {area.name} that miss calls and enquiries.</h2>
            <div className={styles.proofGrid}>
              <div className={styles.card}>
                <h3>Businesses we usually fit</h3>
                <ul className={styles.features}>
                  {area.fit.map((item) => (
                    <li key={item}><CheckCircle size={16} weight="fill" aria-hidden="true" /><span>{item}</span></li>
                  ))}
                </ul>
              </div>
              <div className={styles.card}>
                <h3>Areas we cover</h3>
                <p>{area.districts.join(' · ')}, and the rest of {area.region}.</p>
              </div>
              <div className={styles.card}>
                <h3>How we work</h3>
                <p>Free audit first, then one fixed-price workflow. Remote setup by phone and video, month-to-month plans, and every customer message approved by you at the start.</p>
              </div>
            </div>
          </div>
        </section>

        <AuditBand title={`Curious how fast your ${area.name} business answers?`} />
        <StepsSection />
        <FaqSection items={faqs} />

        <section className={styles.section} aria-labelledby="other-areas">
          <div className={styles.wrap}>
            <h2 id="other-areas" className={styles.h2}>Other service areas</h2>
            <p className={styles.lead}>
              {AREAS.filter((a) => a.slug !== area.slug).map((a, i, arr) => (
                <span key={a.slug}>
                  <Link href={`/areas/${a.slug}`}>{a.name}</Link>{i < arr.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </p>
          </div>
        </section>

        <FinalCta
          title={`Find out how many ${area.name} leads you are missing. Free.`}
          text="We test your response time and send a short report with a fix plan. No card, no obligation."
        />
      </main>
      <BusinessFooter />
    </div>
  );
}
