'use client';

import { useEffect } from 'react';

/**
 * Scroll reveal for elements marked `data-reveal` (no animation library).
 *
 * Safety rules, so content can never be stranded invisible:
 * - Content is only hidden once this script runs (it sets `html[data-fx-ready]`); without JS,
 *   or if this throws, everything stays visible.
 * - Anything already on screen (or above it) at start is shown at once, without a flash.
 * - IntersectionObserver reveals the rest; a scroll/resize sweep and a ~1 s timer reveal
 *   anything in or above the viewport that the observer missed (fast scroll, anchor jumps).
 * - prefers-reduced-motion or no IntersectionObserver: everything is shown immediately.
 *
 * Also feeds the pointer position to `data-glow` cards (--mx / --my) for the hover glow.
 */
export default function RevealRoot() {
  useEffect(() => {
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const show = (el: Element) => el.setAttribute('data-in', '');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onPointer = (event: PointerEvent) => {
      const card = (event.target as Element | null)?.closest?.('[data-glow]') as HTMLElement | null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    };
    document.addEventListener('pointermove', onPointer, { passive: true });

    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(show);
      return () => document.removeEventListener('pointermove', onPointer);
    }

    const limit = () => window.innerHeight * 0.94;
    const pending = () => els.filter((el) => !el.hasAttribute('data-in'));
    const sweep = () => {
      for (const el of pending()) {
        if (el.getBoundingClientRect().top < limit()) show(el);
      }
    };

    // Show what is already visible before enabling the hidden state: no flash on load.
    sweep();
    root.setAttribute('data-fx-ready', '');

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0 },
    );
    pending().forEach((el) => io.observe(el));

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        sweep();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', onScroll);
    const failSafe = window.setTimeout(sweep, 1000);

    return () => {
      io.disconnect();
      window.clearTimeout(failSafe);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('hashchange', onScroll);
      document.removeEventListener('pointermove', onPointer);
      root.removeAttribute('data-fx-ready');
    };
  }, []);

  return null;
}
