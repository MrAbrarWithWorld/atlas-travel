'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import styles from '../../business.module.css';

type Item = { q: string; a: string; group: string };

/**
 * One-open-at-a-time accordion built on <details>.
 * Without JS: native <details name="faq"> (exclusive in current browsers), instant open/close.
 * With JS: the same markup, plus a smooth height animation and exclusivity handled here.
 */
export default function FaqAccordion({ items, groups }: { items: Item[]; groups: string[] }) {
  const refs = useRef<Array<HTMLDetailsElement | null>>([]);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    setEnhanced(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const body = (d: HTMLDetailsElement) => d.querySelector<HTMLElement>('[data-faq-body]');

  const close = (d: HTMLDetailsElement) => {
    const el = body(d);
    if (!el || !d.open) return;
    const h = el.offsetHeight;
    const anim = el.animate(
      [{ height: `${h}px`, opacity: 1 }, { height: '0px', opacity: 0 }],
      { duration: 220, easing: 'cubic-bezier(.4,0,.2,1)' },
    );
    anim.onfinish = () => {
      d.open = false;
    };
  };

  const open = (d: HTMLDetailsElement) => {
    d.open = true;
    const el = body(d);
    if (!el) return;
    const h = el.offsetHeight;
    el.animate(
      [{ height: '0px', opacity: 0 }, { height: `${h}px`, opacity: 1 }],
      { duration: 300, easing: 'cubic-bezier(.2,.7,.2,1)' },
    );
  };

  const onToggleClick = (event: MouseEvent<HTMLElement>, index: number) => {
    if (!enhanced) return; // native behaviour
    event.preventDefault();
    const d = refs.current[index];
    if (!d) return;
    if (d.open) {
      close(d);
      return;
    }
    refs.current.forEach((other, i) => {
      if (other && i !== index && other.open) close(other);
    });
    open(d);
  };

  return (
    <div className={styles.faqPage}>
      {groups.map((group) => (
        <div key={group} className={styles.faqGroup} data-reveal="">
          <h2 className={styles.faqGroupTitle}>{group}</h2>
          <div className={styles.faqList}>
            {items.map((item, index) =>
              item.group !== group ? null : (
                <details
                  key={item.q}
                  ref={(el) => {
                    refs.current[index] = el;
                  }}
                  className={styles.faqItem}
                  // Native exclusivity when JS is off; JS manages it (with animation) when on.
                  {...(enhanced ? {} : { name: 'faq' })}
                >
                  <summary onClick={(e) => onToggleClick(e, index)}>
                    <span>{item.q}</span>
                    <span className={styles.faqChevron} aria-hidden="true" />
                  </summary>
                  <div className={styles.faqBody} data-faq-body="">
                    <p>{item.a}</p>
                  </div>
                </details>
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
