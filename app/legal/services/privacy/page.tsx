import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LegalDocView, { legalMetadata } from '../../LegalDocView';
import { getLegalDoc } from '../../content';

// Technology Services Privacy Notice. A plain static page (no dynamic segment) keeps the
// deployment within the Hobby plan's serverless-function limit.
export function generateMetadata(): Metadata {
  const doc = getLegalDoc('services', 'privacy');
  return doc ? legalMetadata(doc) : {};
}

export default function ServicesPrivacyPage() {
  const doc = getLegalDoc('services', 'privacy');
  if (!doc) notFound();
  return <LegalDocView doc={doc} />;
}
