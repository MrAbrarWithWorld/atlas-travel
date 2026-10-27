// JSON-LD shared by /services, /pricing and /faq. Values mirror the homepage's ProfessionalService node.
import { PRICE_RANGE } from './offer';

export const SITE = 'https://getatlas.ca';

export function businessNode(extra: Record<string, unknown> = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE}/#business`,
    name: 'Atlas AI Technologies',
    url: `${SITE}/`,
    description:
      'Lead follow-up and workflow automation for small and growing businesses: missed-call text-back, instant web-form replies, CRM setup and approved follow-ups.',
    areaServed: [
      { '@type': 'City', name: 'Toronto' },
      { '@type': 'AdministrativeArea', name: 'Greater Toronto Area' },
      { '@type': 'Country', name: 'Canada' },
    ],
    email: 'support@getatlas.ca',
    priceRange: PRICE_RANGE,
    ...extra,
  };
}

export function breadcrumbs(name: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name, item: `${SITE}${path}` },
    ],
  };
}

export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}
