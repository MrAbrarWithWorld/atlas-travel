import type { Metadata } from 'next';
import SiteNav from '../components/SiteNav';
import styles from '../business.module.css';
import { BusinessFooter, FinalCta, faqJsonLd } from '../components/BusinessBlocks';
import RevealRoot from '../components/fx/RevealRoot';
import FaqAccordion from '../components/fx/FaqAccordion';
import { contactFor } from '../lib/offer';
import { FAQS_PAGE, FAQ_GROUPS } from '../lib/faqs';
import { SITE, breadcrumbs, jsonLd } from '../lib/schema';

export const metadata: Metadata = {
  title: { absolute: 'FAQ: Prices, Contracts, Software & Data | Atlas AI Technology' },
  description:
    'Straight answers: how much it costs, why founding prices are low, whether you need new software, what gets sent without you, contracts, customer data safety and your own AI assistant.',
  alternates: { canonical: '/faq' },
  openGraph: {
    type: 'website',
    url: `${SITE}/faq`,
    siteName: 'Atlas AI Technology',
    title: 'Straight answers | Atlas AI Technology',
    description: 'Prices, contracts, software and data: the questions small businesses ask us first.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

const structuredData = [faqJsonLd(FAQS_PAGE), breadcrumbs('FAQ', '/faq')];

export default function FaqPage() {
  return (
    <div className={`${styles.page} ${styles.fx}`}>
      <RevealRoot />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />
      <SiteNav activePath="/faq" ctaLabel="Free audit →" ctaHref={contactFor('free-audit')} />

      <main>
        <section className={`${styles.section} ${styles.pageHead}`} aria-labelledby="faq-title">
          <div className={styles.wrap}>
            <div className={styles.headPlate}>
              <span className={styles.eyebrow}>Questions</span>
              <h1 id="faq-title" className={`${styles.h2} ${styles.pageTitle}`}>Straight answers.</h1>
            </div>
          </div>
        </section>

        <section id="faq" className={`${styles.section} ${styles.sectionTight}`} aria-label="Frequently asked questions">
          <div className={styles.wrap}>
            <FaqAccordion items={FAQS_PAGE} groups={FAQ_GROUPS} />
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
