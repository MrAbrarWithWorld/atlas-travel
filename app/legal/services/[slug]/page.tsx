import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LegalDocView, { legalMetadata } from '../../LegalDocView';
import { SLUGS, getLegalDoc } from '../../content';

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDoc('services', slug);
  return doc ? legalMetadata(doc) : {};
}

export default async function ServicesLegalPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const doc = getLegalDoc('services', slug);
  if (!doc) notFound();
  return <LegalDocView doc={doc} />;
}
