import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '../components/SiteNav';
import { BusinessFooter } from '../components/BusinessBlocks';
import biz from '../business.module.css';
import styles from './legal.module.css';
import { EmailLink } from './LegalMarkdown';
import { SET_LABELS, listLegalDocs, type LegalSet } from './content';
import { contactFor } from '../lib/offer';

const SETS: LegalSet[] = ['services', 'travel'];
const pending = SETS.some((set) => listLegalDocs(set).some((d) => d.status !== 'in-effect'));

export const metadata: Metadata = {
  title: { absolute: 'Legal | Atlas AI Technologies' },
  description: 'Privacy and terms for Atlas AI Technologies business services and the Atlas AI Travel Planner.',
  alternates: { canonical: '/legal' },
  robots: pending ? { index: false, follow: false } : undefined,
};

export default function LegalHub() {
  return (
    <div className={biz.page}>
      <SiteNav activePath="/legal" ctaLabel="Free audit →" ctaHref={contactFor('free-audit')} />
      <main className={styles.shell}>
        <div className={biz.wrap}>
          <span className={biz.eyebrow}>Legal</span>
          <h1 className={styles.title}>Privacy and terms</h1>
          <p className={styles.hubIntro}>
            Atlas AI Technologies offers two different things: technology services for businesses, and the
            Atlas AI Travel Planner for travellers. Each has its own privacy policy and terms.
          </p>
          {pending && (
            <div className={styles.draftBanner} role="note">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
              <div><strong>Review copy — not yet in effect.</strong> These versions take effect only after final approval.</div>
            </div>
          )}

          {SETS.map((set) => (
            <section key={set} className={styles.set} aria-labelledby={`set-${set}`}>
              <h2 id={`set-${set}`}>{SET_LABELS[set].title}</h2>
              <p>{SET_LABELS[set].intro}</p>
              <ul className={styles.docGrid}>
                {listLegalDocs(set).map((doc) => (
                  <li key={doc.slug}>
                    <Link className={styles.docCard} href={doc.url}>
                      <em>{doc.status === 'in-effect' ? `Version ${doc.version}` : 'Awaiting approval'}</em>
                      <strong>{doc.shortTitle}</strong>
                      <span>{doc.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <p className={styles.note}>
            To delete a Travel Planner account, go to <a href="/account/delete">getatlas.ca/account/delete</a>.
            Business clients receive our services agreement, statement of work and, where needed, data processing
            agreement to review before signing. Questions: <EmailLink email="support@getatlas.ca" />.
          </p>
        </div>
      </main>
      <BusinessFooter />
    </div>
  );
}
