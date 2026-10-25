import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LegalDocView, { legalMetadata } from '../../LegalDocView';
import { getLegalDoc } from '../../content';

// Technology Services Terms of Service. A plain static page (no dynamic segment) keeps the
// deployment within the Hobby plan's serverless-function limit.
export function generateMetadata(): Metadata {
  const doc = getLegalDoc('services', 'terms');
  return doc ? legalMetadata(doc) : {};
}

export default function ServicesTermsPage() {
  const doc = getLegalDoc('services', 'terms');
  if (!doc) notFound();
  return <LegalDocView doc={doc} />;
}
