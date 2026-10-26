import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, CheckCircle } from '@phosphor-icons/react/dist/ssr';
import styles from '../business.module.css';
import { FREE_PLANS, OFFER_TERMS, PAID_PLANS, contactFor, type Plan } from '../lib/offer';
import { Analytics } from '@vercel/analytics/next';
import AskAtlas from './AskAtlas';

export type Faq = { q: string; a: string };

function PlanCard({ plan, free, fx, index = 0 }: { plan: Plan; free?: boolean; fx?: boolean; index?: number }) {
  const cls = [styles.plan, free ? styles.planFree : '', plan.highlight ? styles.planHighlight : ''].join(' ');
  const fxProps = fx ? { 'data-reveal': '', style: { '--d': `${index * 90}ms` } as CSSProperties } : {};
  return (
    <article className={cls} {...fxProps}>
      {free && <span className={`${styles.badge} ${styles.badgeFree}`}>Free</span>}
      {plan.highlight && <span className={styles.badge}>Best place to start</span>}
      {plan.label && !plan.highlight && <span className={styles.badge}>{plan.label}</span>}
      <h3 className={styles.planName}>{plan.name}</h3>
      {plan.tagline && <p className={styles.planTag}>{plan.tagline}</p>}
      <div className={styles.price}>{plan.price}</div>
      <div className={styles.priceNote}>{plan.priceNote}</div>
      {plan.normally && (
        <div className={styles.normally}>
          Normally <s>{plan.normally}</s> · founding price
        </div>
      )}
      <ul className={styles.features}>
        {plan.features.map((feature) => (
          <li key={feature}>
            <Check size={16} weight="bold" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link className={styles.planCta} href={contactFor(plan.service)}>
        {plan.cta}
      </Link>
    </article>
  );
}

type MoreLink = { href: string; label: string };

function MoreLinkRow({ more }: { more?: MoreLink }) {
  if (!more) return null;
  return (
    <div className={styles.moreRow}>
      <Link className={styles.moreLink} href={more.href}>{more.label}</Link>
    </div>
  );
}

// On the /pricing page the heading sits on a glass plate; elsewhere it renders exactly as before.
function HeadWrap({ asPage, children }: { asPage: boolean; children: ReactNode }) {
  return asPage ? <div className={styles.headPlate}>{children}</div> : <>{children}</>;
}

/**
 * Founding prices block. Defaults render exactly as on the /for pages.
 * `asPage` makes it the /pricing page header (h1); `fx` turns on reveal + hover polish;
 * `more` adds an "All prices →" style link under the block.
 */
export function PricingSection({
  heading,
  asPage = false,
  fx = false,
  more,
}: {
  heading?: string;
  asPage?: boolean;
  fx?: boolean;
  more?: MoreLink;
}) {
  const Title = asPage ? 'h1' : 'h2';
  const sectionClass = asPage ? `${styles.section} ${styles.pageHead} ${styles.pageHeadFlush}` : styles.section;
  return (
    <section id="pricing" className={sectionClass} aria-labelledby="pricing-title">
      <div className={styles.wrap}>
        <HeadWrap asPage={asPage}>
          <span className={styles.eyebrow}>Founding prices</span>
          <Title id="pricing-title" className={asPage ? `${styles.h2} ${styles.pageTitle}` : styles.h2}>{heading ?? 'Start free. Pay only when it works for you.'}</Title>
          <p className={styles.lead}>
            We are taking on our first clients in Canada, so prices are the lowest they will ever be.
            Lock them in now and keep them for as long as you stay.
          </p>
        </HeadWrap>
        <div className={styles.freeGrid}>
          {FREE_PLANS.map((plan, i) => <PlanCard key={plan.id} plan={plan} free fx={fx} index={i} />)}
        </div>
        <div className={styles.priceGrid}>
          {PAID_PLANS.map((plan, i) => <PlanCard key={plan.id} plan={plan} fx={fx} index={i} />)}
        </div>
        <ul className={styles.terms} {...(fx ? { 'data-reveal': '' } : {})}>
          {OFFER_TERMS.map((term) => (
            <li key={term}>
              <CheckCircle size={18} weight="fill" aria-hidden="true" />
              <span>{term}</span>
            </li>
          ))}
        </ul>
        <p className={styles.termsPolicy}>
          <Link href="/legal/services/terms#pricing-guarantee-and-cancellation">How the guarantee, cancellation and refunds work →</Link>
        </p>
        <MoreLinkRow more={more} />
      </div>
    </section>
  );
}

export const STEPS = [
  { title: 'Free audit', text: 'We test how fast your business answers a new enquiry and send you a short report.', time: '2–3 days' },
  { title: '15-minute call', text: 'We agree on one workflow, a fixed price and what \u201cdone\u201d looks like. In writing.', time: 'Day 1' },
  { title: 'We build and test', text: 'We connect your form, phone, email and calendar, then test it with you before go-live.', time: 'Up to 2 weeks' },
  { title: 'You stay in control', text: 'Leads are answered instantly. Anything important waits for your approval. Weekly report included.', time: 'Every week' },
];
const STEPS_HEADING = 'From first message to running system in about two weeks.';

export function StepsSection() {
  return (
    <section className={styles.section} aria-labelledby="how-title">
      <div className={styles.wrap}>
        <span className={styles.eyebrow}>How it works</span>
        <h2 id="how-title" className={styles.h2}>{STEPS_HEADING}</h2>
        <ol className={styles.steps}>
          {STEPS.map((step) => (
            <li key={step.title} className={styles.step}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <span className={styles.stepTime}>{step.time}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Homepage version of the steps: numbered nodes on a line that draws itself on scroll. */
export function FlowSteps() {
  return (
    <section className={styles.section} aria-labelledby="how-title">
      <div className={styles.wrap}>
        <span className={styles.eyebrow}>How it works</span>
        <h2 id="how-title" className={styles.h2}>{STEPS_HEADING}</h2>
        <ol className={styles.flow} data-reveal="" data-flow="">
          {STEPS.map((step, i) => (
            <li key={step.title} className={styles.flowStep} style={{ '--i': i } as CSSProperties}>
              <span className={styles.flowNode} aria-hidden="true">{i + 1}</span>
              <div className={styles.flowCard}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <span className={styles.stepTime}>{step.time}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function FaqSection({ items, more }: { items: Faq[]; more?: MoreLink }) {
  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-title">
      <div className={styles.wrap}>
        <span className={styles.eyebrow}>Questions</span>
        <h2 id="faq-title" className={styles.h2}>Straight answers.</h2>
        <div className={styles.faq}>
          {items.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
        <MoreLinkRow more={more} />
      </div>
    </section>
  );
}

export function faqJsonLd(items: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function FinalCta({
  title,
  text,
  pricingHref = '/#pricing',
  textured = false,
}: {
  title: string;
  text: string;
  pricingHref?: string;
  textured?: boolean;
}) {
  return (
    <section className={textured ? `${styles.final} ${styles.texture}` : styles.final}>
      <div className={styles.wrap}>
        <h2 className={styles.h2}>{title}</h2>
        <p className={styles.lead}>{text}</p>
        <div className={styles.actions}>
          <Link className={styles.primary} href={contactFor('free-audit')}>
            Get my free missed-lead audit <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </Link>
          <Link className={styles.secondary} href={pricingHref}>See founding prices</Link>
        </div>
      </div>
    </section>
  );
}

export function BusinessFooter({ extra = [] }: { extra?: MoreLink[] }) {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.wrap} ${styles.footerInner}`}>
        <span>© {new Date().getFullYear()} Atlas AI Technologies · Toronto &amp; GTA — working with clients across Canada and internationally.</span>
        <nav aria-label="Footer">
          <Link href="/services">Services</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/for/trades">Trades</Link>
          <Link href="/for/realtors">Realtors</Link>
          <Link href="/for/bookkeepers">Bookkeepers</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/legal/services/privacy">Privacy</Link>
          <Link href="/legal/services/terms">Terms</Link>
          <Link href="/legal">Legal</Link>
          {extra.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          <Link href="/travel" prefetch={false}>Atlas Travel app</Link>
        </nav>
      </div>
      <AskAtlas />
      {/* Cookieless visit counts (Vercel Web Analytics), business pages only. See /legal/services/privacy §12. */}
      <Analytics />
    </footer>
  );
}
