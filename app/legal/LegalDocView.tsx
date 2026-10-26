import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '../components/SiteNav';
import { BusinessFooter } from '../components/BusinessBlocks';
import biz from '../business.module.css';
import styles from './legal.module.css';
import LegalMarkdown, { EmailLink } from './LegalMarkdown';
import HideAfter from './HideAfter';
import { SET_LABELS, formatEffective, type LegalDoc } from './content';
import { contactFor } from '../lib/offer';

export function legalMetadata(doc: LegalDoc): Metadata {
  return {
    title: { absolute: `${doc.title} | Atlas AI Technologies` },
    description: doc.summary,
    alternates: { canonical: doc.url },
    // Documents awaiting approval must never be indexed or treated as in effect.
    robots: doc.status === 'in-effect' ? undefined : { index: false, follow: false },
  };
}

function TravelHeader() {
  return (
    <header className={styles.travelHeader}>
      <div className={`${biz.wrap} ${styles.travelHeaderInner}`}>
        <a href="/travel" className={styles.travelBrand} aria-label="Atlas AI Travel Planner">
          <svg width="26" height="26" viewBox="0 0 400 400" aria-hidden="true">
            <circle cx="200" cy="200" r="170" fill="none" stroke="currentColor" strokeWidth="14" />
            <circle cx="200" cy="200" r="22" fill="currentColor" />
          </svg>
          <span>Atlas AI Travel Planner</span>
        </a>
        <a href="/travel" className={styles.travelCta}>Open the planner →</a>
      </div>
    </header>
  );
}

function TravelFooter() {
  return (
    <footer className={styles.travelFooter}>
      <div className={biz.wrap}>
        <nav aria-label="Travel Planner legal">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <a href="/account/delete">Delete your account</a>
          <Link href="/legal">All legal documents</Link>
          <Link href="/">Atlas AI Technologies</Link>
        </nav>
        <p>© {new Date().getFullYear()} Atlas AI Technologies · Toronto, Canada · <EmailLink email="support@getatlas.ca" /></p>
      </div>
    </footer>
  );
}

export default function LegalDocView({ doc }: { doc: LegalDoc }) {
  const isTravel = doc.set === 'travel';
  const inEffect = doc.status === 'in-effect';
  const startsAt = doc.effective ? new Date(`${doc.effective}T00:00:00-05:00`).getTime() : 0;
  const upcoming = inEffect && Boolean(doc.previous) && Boolean(doc.effective) && Date.now() < startsAt;
  return (
    <div className={biz.page}>
      {isTravel ? <TravelHeader /> : <SiteNav activePath="/legal" ctaLabel="Free audit →" ctaHref={contactFor('free-audit')} />}
      <main className={isTravel ? `${styles.shell} ${styles.shellTravel}` : styles.shell}>
        <div className={biz.wrap}>
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/legal">Legal</Link>
            <span aria-hidden="true">/</span>
            <span>{SET_LABELS[doc.set].title}</span>
          </nav>
          <h1 className={styles.title}>{doc.title}</h1>
          <div className={styles.meta}>
            <span><strong>Version:</strong> {doc.version}</span>
            <span><strong>Effective:</strong> {inEffect && doc.effective ? formatEffective(doc.effective) : 'on approval'}</span>
          </div>
          {!inEffect && (
            <div className={styles.draftBanner} role="note">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
              <div>
                <strong>Review copy — not yet in effect.</strong> This version takes effect only after final approval.
              </div>
            </div>
          )}
          {upcoming && (
            <HideAfter until={startsAt}>
            <div className={styles.draftBanner} role="note">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              <div>
                <strong>These terms take effect on {formatEffective(doc.effective)}.</strong> Until then, the{' '}
                <a href={doc.previous}>previous Terms of Service</a> apply.
              </div>
            </div>
            </HideAfter>
          )}
          <LegalMarkdown source={doc.body} />
        </div>
      </main>
      {isTravel ? <TravelFooter /> : <BusinessFooter />}
    </div>
  );
}
