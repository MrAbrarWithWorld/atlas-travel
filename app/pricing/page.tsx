import type { Metadata } from 'next';
import SiteNav from '../components/SiteNav';
import styles from '../business.module.css';
import { BusinessFooter, PricingSection } from '../components/BusinessBlocks';
import RevealRoot from '../components/fx/RevealRoot';
import { FREE_PLANS, PAID_PLANS, contactFor } from '../lib/offer';
import { SITE, breadcrumbs, businessNode, jsonLd } from '../lib/schema';

export const metadata: Metadata = {
  title: { absolute: 'Founding Prices: Lead Rescue, Follow-Up System & Projects | Atlas AI Technology' },
  description:
    'Free missed-lead audit and auto-reply starter. Lead Rescue $99 setup + $29/mo, Follow-Up System $299 setup + $59/mo, Custom Automation from $500, Digital Base Setup from CAD 1,500, your own AI assistant from CAD 249. Prices in CAD.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    type: 'website',
    url: `${SITE}/pricing`,
    siteName: 'Atlas AI Technology',
    title: 'Start free. Pay only when it works for you. | Atlas AI Technology',
    description: 'Founding prices for our first clients in Canada. Lock them in now and keep them for as long as you stay.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

// Machine-readable amounts for the visible prices (setup fee, or the "from" amount for quoted work).
const AMOUNTS: Record<string, { price: number; from?: boolean }> = {
  'free-audit': { price: 0 },
  'auto-reply': { price: 0 },
  'lead-rescue': { price: 99 },
  'follow-up-system': { price: 299 },
  custom: { price: 500, from: true },
  'digital-base': { price: 1500, from: true },
  'ai-assistant': { price: 249, from: true },
};

const structuredData = [
  businessNode({
    makesOffer: [...FREE_PLANS, ...PAID_PLANS].map((plan) => {
      const amount = AMOUNTS[plan.id];
      const base = {
        '@type': 'Offer',
        name: plan.name,
        description: `${plan.price} · ${plan.priceNote}`,
        priceCurrency: 'CAD',
        url: `${SITE}${contactFor(plan.service)}`,
      };
      return amount.from
        ? { ...base, priceSpecification: { '@type': 'PriceSpecification', minPrice: amount.price, priceCurrency: 'CAD' } }
        : { ...base, price: String(amount.price) };
    }),
  }),
  breadcrumbs('Pricing', '/pricing'),
];

export default function PricingPage() {
  return (
    <div className={`${styles.page} ${styles.fx}`}>
      <RevealRoot />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />
      <SiteNav activePath="/pricing" ctaLabel="Free audit →" ctaHref={contactFor('free-audit')} />
      <main>
        <PricingSection asPage fx more={{ href: '/faq', label: 'More questions →' }} />
      </main>
      <BusinessFooter />
    </div>
  );
}
