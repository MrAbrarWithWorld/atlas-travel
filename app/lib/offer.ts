// Founding offer shown on the business homepage and niche pages.
// Prices in CAD. Approved by the owner on 2026-09-27: lowest prices now, raised step by step later.

export type Plan = {
  id: 'free-audit' | 'auto-reply' | 'lead-rescue' | 'follow-up-system' | 'custom';
  service: string; // ServiceId passed to /contact?service=
  name: string;
  tagline: string;
  price: string;
  priceNote: string;
  normally?: string;
  features: string[];
  cta: string;
  highlight?: boolean;
};

export const FREE_PLANS: Plan[] = [
  {
    id: 'free-audit',
    service: 'free-audit',
    name: 'Free Missed-Lead Audit',
    tagline: 'Find out how many leads slip away today.',
    price: 'Free',
    priceNote: 'No card, no obligation',
    features: [
      'We test your website form, email and phone response time',
      'A 1-page report with what we found',
      'A simple fix plan you can use with or without us',
    ],
    cta: 'Get my free audit',
  },
  {
    id: 'auto-reply',
    service: 'free-audit',
    name: 'Free Auto-Reply Starter',
    tagline: 'Every website enquiry gets an answer in seconds.',
    price: 'Free',
    priceNote: 'For small businesses in Canada',
    features: [
      'Instant, polite reply to every contact-form message',
      'Email alert to you with the enquiry details',
      'Set up for you in one short call',
    ],
    cta: 'Claim the free setup',
  },
];

export const PAID_PLANS: Plan[] = [
  {
    id: 'lead-rescue',
    service: 'lead-rescue',
    name: 'Lead Rescue',
    tagline: 'Never lose a lead to a slow reply again.',
    price: '$99 setup + $29/mo',
    priceNote: 'First month free',
    normally: '$750 + $99/mo',
    features: [
      'Missed-call text-back or web-form instant reply',
      'Every lead saved in one simple CRM',
      'Instant alert to your phone or email',
      'Booking link sent automatically',
    ],
    cta: 'Start with Lead Rescue',
    highlight: true,
  },
  {
    id: 'follow-up-system',
    service: 'follow-up-system',
    name: 'Follow-Up System',
    tagline: 'Turn more enquiries into booked jobs.',
    price: '$299 setup + $59/mo',
    priceNote: 'Everything in Lead Rescue, plus',
    normally: '$1,950 + $249/mo',
    features: [
      'AI-drafted follow-ups you approve with one tap',
      '3-step follow-up for quiet leads',
      'Review requests after the job',
      'Weekly lead report',
    ],
    cta: 'Choose Follow-Up System',
  },
  {
    id: 'custom',
    service: 'not-sure',
    name: 'Custom Automation',
    tagline: 'Portals, dashboards and multi-step workflows.',
    price: 'From $500',
    priceNote: 'Fixed written quote first',
    normally: '$4,500+',
    features: [
      'Client intake portals and document checklists',
      'Reports and dashboards from your own data',
      'Connections between the tools you already use',
    ],
    cta: 'Describe your workflow',
  },
];

export const OFFER_TERMS = [
  'First 5 founding clients: setup free, in exchange for an honest review.',
  'Founding prices stay locked for as long as you stay a client.',
  '30-day money-back guarantee on the setup fee.',
  'Month to month. Cancel anytime. Prices in CAD, plus applicable tax.',
];

export function contactFor(service: string) {
  return `/contact?service=${encodeURIComponent(service)}`;
}
