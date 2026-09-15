import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: { absolute: 'AI Automation Services | Atlas AI Technology' },
  description: 'Atlas AI Technology builds practical automation systems that organize requests, prepare the next step, and keep your people in control.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'AI Automation Services | Atlas AI Technology',
    description: 'Practical AI automation for client communication, repetitive operations, and controlled business workflows.',
    url: 'https://getatlas.ca/services',
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
