// The seven "What we build" services. Shared by the homepage grid and the /services page.
// Copy is the approved card copy; do not add deliverables, timelines or results here.
import type { ServiceId } from './lead-intake';

export type ServiceIconId =
  | 'lead-capture'
  | 'follow-ups'
  | 'client-intake'
  | 'reports'
  | 'process'
  | 'ai'
  | 'digital-base';

export type Service = {
  slug: string; // anchor on /services
  icon: ServiceIconId;
  title: string;
  text: string;
  service: ServiceId; // contact form value preselected by "Ask about this →"
};

export const SERVICES: Service[] = [
  {
    slug: 'lead-capture',
    icon: 'lead-capture',
    title: 'Lead capture & instant reply',
    text: 'Missed-call text-back, web-form and Google enquiry replies, every lead saved in one CRM.',
    service: 'crm-lead-capture',
  },
  {
    slug: 'follow-ups',
    icon: 'follow-ups',
    title: 'Follow-ups & email automation',
    text: 'Quote follow-ups, reminders and review requests, drafted by AI and sent after your OK.',
    service: 'email-report-automation',
  },
  {
    slug: 'client-intake',
    icon: 'client-intake',
    title: 'Client intake & portals',
    text: 'Intake forms, document checklists and simple client portals that fill your records for you.',
    service: 'client-intake',
  },
  {
    slug: 'reports-dashboards',
    icon: 'reports',
    title: 'Reports & dashboards',
    text: 'A weekly view of leads, jobs and revenue, built from the tools you already use.',
    service: 'reports-dashboards',
  },
  {
    slug: 'process-automation',
    icon: 'process',
    title: 'Business process automation',
    text: 'Connect your apps so data moves on its own: no copy-paste between email, sheets and CRM.',
    service: 'process-automation',
  },
  {
    slug: 'ai-assistants',
    icon: 'ai',
    title: 'AI assistants & integrations',
    text: 'AI that drafts, sorts and summarizes inside your workflow, always with a human in control.',
    service: 'ai-product-integration',
  },
  {
    slug: 'digital-base-setup',
    icon: 'digital-base',
    title: 'Digital base setup',
    text: 'Your website, profiles and listings finished and connected: every page completed, Google and social profiles fixed, listings where your buyers look, and one tracker for every enquiry.',
    service: 'digital-base-setup',
  },
];

export const SERVICES_HEADING = 'Seven ways we take work off your plate.';
export const SERVICES_LEAD =
  'Most clients start with Lead Rescue, then add more as it pays off. Every system is built, tested and supported by us, and you approve anything that talks to your customers.';
