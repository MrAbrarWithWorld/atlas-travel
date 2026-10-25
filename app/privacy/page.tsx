import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LegalDocView, { legalMetadata } from '../legal/LegalDocView';
import { getLegalDoc } from '../legal/content';

// Atlas AI Travel Planner privacy policy. This URL is used by the Android app and Google Play: keep it.
export function generateMetadata(): Metadata {
  const doc = getLegalDoc('travel', 'privacy');
  return doc ? legalMetadata(doc) : {};
}

export default function TravelPrivacyPage() {
  const doc = getLegalDoc('travel', 'privacy');
  if (!doc) notFound();
  return <LegalDocView doc={doc} />;
}
