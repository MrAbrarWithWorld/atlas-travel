import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import SiteNav from '../components/SiteNav';
import styles from '../business.module.css';
import { BusinessFooter, FinalCta } from '../components/BusinessBlocks';
import RevealRoot from '../components/fx/RevealRoot';
import ServiceIcon from '../components/fx/ServiceIcon';
import { contactFor } from '../lib/offer';
import { SERVICES, SERVICES_HEADING, SERVICES_LEAD } from '../lib/services';
import { SITE, breadcrumbs, businessNode, jsonLd } from '../lib/schema';

export const metadata: Metadata = {
  title: { absolute: 'Services: Lead Capture, Follow-Ups, Portals & Automation | Atlas AI Technology' },
  description:
    'Lead capture & instant reply, follow-ups & email automation, client intake & portals, reports & dashboards, business process automation, AI assistants and digital base setup. Atlas AI Technology, Toronto.',
  alternates: { canonical: '/services' },
  openGraph: {
    type: 'website',
    url: `${SITE}/services`,
    siteName: 'Atlas AI Technology',
    title: 'Seven ways we take work off your plate | Atlas AI Technology',
    description: 'Every system is built, tested and supported by us, and you approve anything that talks to your customers.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

const structuredData = [
  businessNode({
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Atlas AI Technology services',
      itemListElement: SERVICES.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.text,
          url: `${SITE}/services#${service.slug}`,
        },
      })),
    },
  }),
  breadcrumbs('Services', '/services'),
];

export default function ServicesPage() {
  return (
    <div className={`${styles.page} ${styles.fx}`}>
      <RevealRoot />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />
      <SiteNav activePath="/services" ctaLabel="Free audit →" ctaHref={contactFor('free-audit')} />

      <main>
        <section className={`${styles.section} ${styles.pageHead}`} aria-labelledby="services-title">
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>What we build</span>
            <h1 id="services-title" className={`${styles.h2} ${styles.pageTitle}`}>{SERVICES_HEADING}</h1>
            <p className={styles.lead}>{SERVICES_LEAD}</p>
            <nav className={styles.svcJump} aria-label="Services on this page">
              {SERVICES.map((service) => (
                <a key={service.slug} href={`#${service.slug}`}>{service.title}</a>
              ))}
            </nav>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionTight}`} aria-label="All services">
          <div className={`${styles.wrap} ${styles.svcList}`}>
            {SERVICES.map((service, i) => (
              <article key={service.slug} id={service.slug} className={styles.svcRow} data-reveal="">
                <div className={styles.svcVisual} aria-hidden="true">
                  <span className={styles.svcNum}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.svcOrbit} style={{ animationDelay: `${-i * 3}s` } as CSSProperties} />
                  <span className={`${styles.svcOrbit} ${styles.svcOrbit2}`} style={{ animationDelay: `${-i * 2}s` } as CSSProperties} />
                  <span className={styles.svcBigIcon}><ServiceIcon id={service.icon} size={48} /></span>
                </div>
                <div className={styles.svcBody}>
                  <h2>{service.title}</h2>
                  <p>{service.text}</p>
                  <Link className={styles.svcCta} href={contactFor(service.service)}>Ask about this →</Link>
                </div>
              </article>
            ))}
          </div>
        </section>

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
