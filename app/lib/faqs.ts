// Homepage FAQ, shared with /faq. Questions and answers are approved copy: reuse verbatim.
import type { Faq } from '../components/BusinessBlocks';

export type FaqGroup = 'Prices' | 'How it works' | 'Trust';

export const FAQS: Array<Faq & { group: FaqGroup }> = [
  {
    group: 'Prices',
    q: 'How much does it cost?',
    a: 'The missed-lead audit and the auto-reply starter are free. Lead Rescue is $99 setup + $29/month with the first month free. The Follow-Up System is $299 setup + $59/month. Prices are in CAD and are founding prices for our first clients.',
  },
  {
    group: 'Prices',
    q: 'Why are the prices so low?',
    a: 'We are building our first case studies in Canada. Early clients get founding prices and keep them for as long as they stay. Prices will go up for new clients later.',
  },
  {
    group: 'How it works',
    q: 'Do I need to change my software?',
    a: 'Usually not. We connect what you already use: your website form, phone number, Gmail or Outlook, Google Calendar and a simple CRM. If you have no CRM, we set one up for you.',
  },
  {
    group: 'How it works',
    q: 'Will it send messages without me knowing?',
    a: 'Only the instant first reply that you approve in advance. Follow-ups and anything important are drafted for you and wait for your one-tap approval.',
  },
  {
    group: 'Prices',
    q: 'Is there a contract?',
    a: 'No long contract. Plans are month to month and you can cancel anytime. If you are not happy with your setup, tell us within 30 days after it goes live and we refund the setup fee.',
  },
  {
    group: 'Trust',
    q: 'Is my customer data safe?',
    a: 'Your data stays in your own accounts wherever possible. We only use it to run your automations and we follow Canadian anti-spam law (CASL) for every message.',
  },
];

// /faq page only (batch 3 brief): owner-approved Q&A, verbatim. Homepage FAQ keeps the six above.
export const FAQ_AI_ASSISTANT: Faq & { group: FaqGroup } = {
  group: 'How it works',
  q: 'Can you build me my own AI assistant?',
  a: 'Yes. We set up a private AI assistant on your own server (a VPS — yours, or one we arrange for you), configured for your work, with training and handover included. It can work with WhatsApp, Telegram, Slack or Discord, your email (Gmail or Outlook), Google Calendar, Google Drive, Docs and Sheets, and your CRM or other business tools. For AI usage you can use your own AI account and pay only for what you use, or take a prepaid credit balance with a monthly limit you control; when it runs low we tell you, and you can top up or raise the limit anytime. Setup starts from CAD 249 for our Founding Pilot (our first 5 assistant clients); bigger setups are a fixed written quote after a short discussion, because no two clients need the same assistant.',
};

// Proposed copy (not yet owner-approved): positioning for larger teams. Canada's ISED counts 1–99 employees as small, 100–499 as medium.
export const FAQ_LARGER_TEAMS: Faq & { group: FaqGroup } = {
  group: 'How it works',
  q: 'Do you work with larger companies?',
  a: 'Yes, as custom projects. Our starter plans are built for small businesses, and most of our work is there. For teams of 100 or more people, such as client portals, dashboards or connections between your tools, we scope the project on a short call and give you a fixed written quote first. We are a small studio, so if a project is too big or too regulated for us, we will tell you before you pay anything. We also work with clients outside Canada.',
};

export const FAQS_PAGE = [...FAQS, FAQ_AI_ASSISTANT, FAQ_LARGER_TEAMS];

export const FAQ_GROUPS: FaqGroup[] = ['Prices', 'How it works', 'Trust'];
