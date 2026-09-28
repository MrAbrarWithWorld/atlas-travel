import Link from 'next/link';
import { ArrowRight, Check, CheckCircle } from '@phosphor-icons/react/dist/ssr';
import styles from '../business.module.css';
import { FREE_PLANS, OFFER_TERMS, PAID_PLANS, contactFor, type Plan } from '../lib/offer';

export type Faq = { q: string; a: string };

function PlanCard({ plan, free }: { plan: Plan; free?: boolean }) {
  const cls = [styles.plan, free ? styles.planFree : '', plan.highlight ? styles.planHighlight : ''].join(' ');
  return (
    <article className={cls}>
      {free && <span className={`${styles.badge} ${styles.badgeFree}`}>Free</span>}
      {plan.highlight && <span className={styles.badge}>Best place to start</span>}
      <h3 className={styles.planName}>{plan.name}</h3>
      <p className={styles.planTag}>{plan.tagline}</p>
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

export function PricingSection({ heading }: { heading?: string }) {
  return (
    <section id="pricing" className={styles.section} aria-labelledby="pricing-title">
      <div className={styles.wrap}>
        <span className={styles.eyebrow}>Founding prices</span>
        <h2 id="pricing-title" className={styles.h2}>{heading ?? 'Start free. Pay only when it works for you.'}</h2>
        <p className={styles.lead}>
          We are taking on our first clients in Canada, so prices are the lowest they will ever be.
          Lock them in now and keep them for as long as you stay.
        </p>
        <div className={styles.freeGrid}>
          {FREE_PLANS.map((plan) => <PlanCard key={plan.id} plan={plan} free />)}
        </div>
        <div className={styles.priceGrid}>
          {PAID_PLANS.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
        </div>
        <ul className={styles.terms}>
          {OFFER_TERMS.map((term) => (
            <li key={term}>
              <CheckCircle size={18} weight="fill" aria-hidden="true" />
              <span>{term}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function StepsSection() {
  return (
    <section className={styles.section} aria-labelledby="how-title">
      <div className={styles.wrap}>
        <span className={styles.eyebrow}>How it works</span>
        <h2 id="how-title" className={styles.h2}>From first message to running system in about two weeks.</h2>
        <ol className={styles.steps}>
          <li className={styles.step}>
            <h3>Free audit</h3>
            <p>We test how fast your business answers a new enquiry and send you a short report.</p>
            <span className={styles.stepTime}>2–3 days</span>
          </li>
          <li className={styles.step}>
            <h3>15-minute call</h3>
            <p>We agree on one workflow, a fixed price and what &ldquo;done&rdquo; looks like. In writing.</p>
            <span className={styles.stepTime}>Day 1</span>
          </li>
          <li className={styles.step}>
            <h3>We build and test</h3>
            <p>We connect your form, phone, email and calendar, then test it with you before go-live.</p>
            <span className={styles.stepTime}>Up to 2 weeks</span>
          </li>
          <li className={styles.step}>
            <h3>You stay in control</h3>
            <p>Leads are answered instantly. Anything important waits for your approval. Weekly report included.</p>
            <span className={styles.stepTime}>Every week</span>
          </li>
        </ol>
      </div>
    </section>
  );
}

export function FaqSection({ items }: { items: Faq[] }) {
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

export function FinalCta({ title, text }: { title: string; text: string }) {
  return (
    <section className={styles.final}>
      <div className={styles.wrap}>
        <h2 className={styles.h2}>{title}</h2>
        <p className={styles.lead}>{text}</p>
        <div className={styles.actions}>
          <Link className={styles.primary} href={contactFor('free-audit')}>
            Get my free missed-lead audit <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </Link>
          <Link className={styles.secondary} href="/#pricing">See founding prices</Link>
        </div>
      </div>
    </section>
  );
}

export function BusinessFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.wrap} ${styles.footerInner}`}>
        <span>© {new Date().getFullYear()} Atlas AI Technology · Toronto, Canada</span>
        <nav aria-label="Footer">
          <Link href="/#services">Services</Link>
          <Link href="/#pricing">Pricing</Link>
          <Link href="/for/trades">Trades</Link>
          <Link href="/for/realtors">Realtors</Link>
          <Link href="/for/bookkeepers">Bookkeepers</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy" prefetch={false}>Privacy</Link>
          <Link href="/terms" prefetch={false}>Terms</Link>
          <Link href="/travel" prefetch={false}>Atlas Travel app</Link>
        </nav>
      </div>
    </footer>
  );
}
