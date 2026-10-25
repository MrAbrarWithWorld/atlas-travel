import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LegalDocView, { legalMetadata } from '../legal/LegalDocView';
import { getLegalDoc } from '../legal/content';

// Atlas AI Travel Planner terms of service. This URL is used by the Android app and Google Play: keep it.
export function generateMetadata(): Metadata {
  const doc = getLegalDoc('travel', 'terms');
  return doc ? legalMetadata(doc) : {};
}

export default function TravelTermsPage() {
  const doc = getLegalDoc('travel', 'terms');
  if (!doc) notFound();
  return <LegalDocView doc={doc} />;
}
