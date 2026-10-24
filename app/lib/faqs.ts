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
    a: 'No long contract. Plans are month to month and you can cancel anytime. If the setup does not save you time in the first 30 days, we refund the setup fee.',
  },
  {
    group: 'Trust',
    q: 'Is my customer data safe?',
    a: 'Your data stays in your own accounts wherever possible. We only use it to run your automations and we follow Canadian anti-spam law (CASL) for every message.',
  },
];

export const FAQ_GROUPS: FaqGroup[] = ['Prices', 'How it works', 'Trust'];
