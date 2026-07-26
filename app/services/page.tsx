import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'AI Automation & Web Solutions | Atlas Technology',
  description: 'Atlas Technology helps online businesses worldwide automate workflows, capture leads, build websites, and save time with AI. Based in Canada — serving clients remotely worldwide.',
  openGraph: {
    title: 'AI Automation & Web Solutions | Atlas Technology',
    description: 'Automate your business workflows. AI-powered CRMs, websites, and process automation for businesses worldwide.',
    url: 'https://getatlas.ca/services',
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
