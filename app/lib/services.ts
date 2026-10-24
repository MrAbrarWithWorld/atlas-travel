// The eight "What we build" services. Shared by the homepage grid and the /services page.
// Card copy is approved copy. "What you get" bullets may ONLY reuse text that already exists on
// the site (pricing-card bullets, card text, FAQ answers); each one notes its source.
// Never name internal tools, platforms, models or vendors here.
import type { ServiceId } from './lead-intake';

export type ServiceIconId =
  | 'lead-capture'
  | 'follow-ups'
  | 'client-intake'
  | 'reports'
  | 'process'
  | 'ai'
  | 'digital-base'
  | 'assistant';

// Tier wording is the brief's, split at its own punctuation: "<name> — <price> (<note>): <text>".
export type Tier = { name: string; price: string; note?: string; text: string; highlight?: boolean };

export type Service = {
  slug: string; // anchor on /services (homepage cards link to /services#slug)
  icon: ServiceIconId;
  title: string;
  text: string;
  service: ServiceId; // contact form value preselected by the block's "Ask about this →"
  gets: string[]; // "What you get"
  howItStarts: boolean; // show the shared "How it starts" line
  tiers?: Tier[]; // "Three ways to start"
};

// Shared "How it starts" steps: Free missed-lead audit (offer), "Fixed written quote first"
// (pricing cards), "Built for you in about two weeks" (homepage hero).
export const HOW_IT_STARTS = ['Free missed-lead audit', 'Fixed written quote', 'Built for you in about two weeks'];

export const SERVICES: Service[] = [
  {
    slug: 'lead-capture',
    icon: 'lead-capture',
    title: 'Lead capture & instant reply',
    text: 'Missed-call text-back, web-form and Google enquiry replies, every lead saved in one CRM.',
    service: 'crm-lead-capture',
    gets: [
      'Missed-call text-back or web-form instant reply', // Lead Rescue card
      'Every lead saved in one simple CRM', // Lead Rescue card
      'Instant alert to your phone or email', // Lead Rescue card
      'Booking link sent automatically', // Lead Rescue card
      'If you have no CRM, we set one up for you', // FAQ: Do I need to change my software?
    ],
    howItStarts: true,
  },
  {
    slug: 'follow-ups',
    icon: 'follow-ups',
    title: 'Follow-ups & email automation',
    text: 'Quote follow-ups, reminders and review requests, drafted by AI and sent after your OK.',
    service: 'email-report-automation',
    gets: [
      'AI-drafted follow-ups you approve with one tap', // Follow-Up System card
      '3-step follow-up for quiet leads', // Follow-Up System card
      'Review requests after the job', // Follow-Up System card
      'Weekly lead report', // Follow-Up System card
    ],
    howItStarts: true,
  },
  {
    slug: 'client-intake',
    icon: 'client-intake',
    title: 'Client intake & portals',
    text: 'Intake forms, document checklists and simple client portals that fill your records for you.',
    service: 'client-intake',
    gets: [
      'Client intake portals and document checklists', // Custom Automation card
      'Connections between the tools you already use', // Custom Automation card
    ],
    howItStarts: true,
  },
  {
    slug: 'reports-dashboards',
    icon: 'reports',
    title: 'Reports & dashboards',
    text: 'A weekly view of leads, jobs and revenue, built from the tools you already use.',
    service: 'reports-dashboards',
    gets: [
      'Reports and dashboards from your own data', // Custom Automation card
      'Weekly lead report', // Follow-Up System card
    ],
    howItStarts: true,
  },
  {
    slug: 'process-automation',
    icon: 'process',
    title: 'Business process automation',
    text: 'Connect your apps so data moves on its own: no copy-paste between email, sheets and CRM.',
    service: 'process-automation',
    gets: [
      'Connections between the tools you already use', // Custom Automation card
      'We connect what you already use', // FAQ: Do I need to change my software?
    ],
    howItStarts: true,
  },
  {
    slug: 'ai-integrations',
    icon: 'ai',
    title: 'AI assistants & integrations',
    text: 'AI that drafts, sorts and summarizes inside your workflow, always with a human in control.',
    service: 'ai-product-integration',
    gets: [
      'AI-drafted follow-ups you approve with one tap', // Follow-Up System card
      'Follow-ups and anything important are drafted for you and wait for your one-tap approval', // FAQ: Will it send messages without me knowing?
      'Connections between the tools you already use', // Custom Automation card
      'Your data stays in your own accounts wherever possible', // FAQ: Is my customer data safe?
    ],
    howItStarts: true,
  },
  {
    slug: 'digital-base-setup',
    icon: 'digital-base',
    title: 'Digital base setup',
    text: 'Your website, profiles and listings finished and connected: every page completed, Google and social profiles fixed, listings where your buyers look, and one tracker for every enquiry.',
    service: 'digital-base-setup',
    gets: [
      'Website completion: every empty page filled, forms working, no dead links', // Digital Base Setup card
      'Google Business Profile + social profiles corrected and connected', // Digital Base Setup card
      'Listings/portals setup for your market (e.g. real estate portals)', // Digital Base Setup card
      'One lead tracker for enquiries from every channel', // Digital Base Setup card
    ],
    howItStarts: true,
  },
  {
    // Owner-approved copy (batch 3 brief), verbatim.
    slug: 'ai-assistant',
    icon: 'assistant',
    title: 'Your own AI assistant',
    text: 'A private AI assistant set up for you on your own server: it organises your day, drafts, researches and handles routine work — your data stays on your machine, under your control.',
    service: 'ai-assistant',
    gets: [
      'Your assistant installed on a private server (VPS) — bring your own, or we set one up for you',
      '1 messaging channel of your choice, plus your email and calendar connected',
      '1 workflow set up for your daily work — extra channels, modules and workflows available as fixed-price add-ons, quoted in writing before we start',
      'AI usage, your choice: your own AI account (you pay only for what you use), or a prepaid credit balance we manage for you, with a monthly limit you set — when it runs low we let you know, and you can top up or raise the limit anytime',
      'A personal training session, a written guide, and 14 days of setup support',
      'Optional care plan afterwards, or pay per fix — never locked in',
    ],
    howItStarts: false,
    tiers: [
      {
        name: 'Pilot',
        price: 'from CAD 249',
        note: 'founding offer, our first 5 assistant clients',
        text: 'The base above; your starting rate is locked, and in exchange we ask for an honest testimonial',
        highlight: true,
      },
      {
        name: 'Standard',
        price: 'from CAD 499',
        text: '2–3 channels, your choice of 2 add-on modules (e.g. image, video, social, inbox), 2 workflows',
      },
      {
        name: 'Business',
        price: 'from CAD 999',
        text: 'The full module set, team/multi-user setup, priority support window',
      },
    ],
  },
];

export const SERVICES_HEADING = 'Eight ways we take work off your plate.';
export const SERVICES_LEAD =
  'Most clients start with Lead Rescue, then add more as it pays off. Every system is built, tested and supported by us, and you approve anything that talks to your customers.';
