'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import AtlasLogo from './AtlasLogo';

// Industry pages shown under "Who we help". Keep in sync with app/for/NichePage.tsx and the footer.
const WHO_WE_HELP = [
  { href: '/for/trades', label: 'Trades & home services', note: 'Missed calls texted back while you work' },
  { href: '/for/realtors', label: 'Realtors', note: 'Portal and website leads answered fast' },
  { href: '/for/bookkeepers', label: 'Bookkeepers', note: 'Client intake and document checklists' },
  { href: '/for/salons', label: 'Salons & studios', note: 'Booking reminders, fewer no-shows' },
  { href: '/for/restaurants', label: 'Restaurants & shops', note: 'Catering enquiries and review requests' },
  { href: '/for/agencies', label: 'Agencies & freelancers', note: 'Automations you can offer your clients' },
];

const LINKS_BEFORE = [{ href: '/services', label: 'Services' }];
const LINKS_AFTER = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteNav({
  activePath,
  ctaLabel = 'Get a free audit',
  ctaHref = '/contact?service=free-audit',
}: {
  activePath?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [whoOpen, setWhoOpen] = useState(false);
  const [mobileWhoOpen, setMobileWhoOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const whoBtnRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const mobileGroupId = useId();

  const whoActive = !!activePath && activePath.startsWith('/for/');
  // Labels without a trailing arrow; older call sites still pass "Free audit →".
  const cta = ctaLabel.replace(/\s*→\s*$/, '');
  // /travel is the static travel app (public/index.html), not a Next.js page: don't prefetch it.
  const ctaPrefetch = ctaHref.startsWith('/travel') ? false : undefined;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close the dropdown on outside click; Escape closes the dropdown or the drawer.
  useEffect(() => {
    function onPointer(e: PointerEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setWhoOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      if (whoOpen) { setWhoOpen(false); whoBtnRef.current?.focus(); }
      if (mobileOpen) setMobileOpen(false);
    }
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [whoOpen, mobileOpen]);

  const current = (href: string) => (activePath === href ? { 'aria-current': 'page' as const } : {});

  const mobileDrawer = (
    <div className="snav-scrim" onClick={() => setMobileOpen(false)}>
      <div className="snav-drawer" role="dialog" aria-modal="true" aria-label="Menu" onClick={(e) => e.stopPropagation()}>
        <div className="snav-drawer-head">
          <AtlasLogo />
          <button type="button" className="snav-icon-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
        <nav aria-label="Main">
          {LINKS_BEFORE.map((l) => (
            <Link key={l.href} href={l.href} className="snav-m-link" onClick={() => setMobileOpen(false)} {...current(l.href)}>{l.label}</Link>
          ))}
          <button
            type="button"
            className="snav-m-link snav-m-toggle"
            aria-expanded={mobileWhoOpen}
            aria-controls={mobileGroupId}
            onClick={() => setMobileWhoOpen((v) => !v)}
          >
            Who we help
            <Caret />
          </button>
          <div id={mobileGroupId} hidden={!mobileWhoOpen} className="snav-m-group">
            {WHO_WE_HELP.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} {...current(l.href)}>{l.label}</Link>
            ))}
          </div>
          {LINKS_AFTER.map((l) => (
            <Link key={l.href} href={l.href} className="snav-m-link" onClick={() => setMobileOpen(false)} {...current(l.href)}>{l.label}</Link>
          ))}
        </nav>
        <Link href={ctaHref} prefetch={ctaPrefetch} onClick={() => setMobileOpen(false)} className="snav-cta snav-cta-block">
          {cta}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .snav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(11,10,8,0.78); border-bottom: 1px solid rgba(255,236,200,0.10); backdrop-filter: blur(16px) saturate(150%); -webkit-backdrop-filter: blur(16px) saturate(150%); font-family: var(--font-dm-sans), 'DM Sans', system-ui, sans-serif; }
        .snav-inner { max-width: 1160px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; gap: 32px; }
        .snav-links { display: flex; align-items: center; gap: 4px; margin-left: auto; }
        .snav .snav-link, .snav-toggle { position: relative; display: inline-flex; align-items: center; gap: 6px; height: 40px; padding: 0 12px; border: 0; border-radius: 8px; background: none; color: #d9d4c9; font: inherit; font-size: 14.5px; font-weight: 500; text-decoration: none; cursor: pointer; transition: color .2s ease, background-color .2s ease; }
        .snav .snav-link:hover, .snav-toggle:hover { color: #f4efe6; background: rgba(255,236,200,0.05); }
        .snav .snav-link[aria-current="page"], .snav-toggle[data-active="true"] { color: #e6b95e; }
        .snav-link[aria-current="page"]::after, .snav-toggle[data-active="true"]::after { content: ''; position: absolute; left: 12px; right: 12px; bottom: 4px; height: 2px; border-radius: 2px; background: #d7a744; }
        .snav-toggle svg { transition: transform .2s ease; }
        .snav-toggle[aria-expanded="true"] svg { transform: rotate(180deg); }
        .snav-link:focus-visible, .snav-toggle:focus-visible, .snav-cta:focus-visible, .snav-panel a:focus-visible, .snav-icon-btn:focus-visible, .snav-m-link:focus-visible, .snav-m-group a:focus-visible { outline: 2px solid #e6b854; outline-offset: 2px; }
        .snav-who { position: relative; }
        .snav-panel { position: absolute; top: calc(100% + 10px); left: 50%; transform: translateX(-50%); width: 560px; padding: 10px; background: #121516; border: 1px solid rgba(255,236,200,0.12); border-radius: 14px; box-shadow: 0 24px 60px -20px rgba(0,0,0,0.85); display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
        .snav-panel[hidden] { display: none; }
        .snav-panel a { display: block; padding: 12px 14px; border-radius: 10px; text-decoration: none; }
        .snav-panel a:hover { background: rgba(255,236,200,0.05); }
        .snav-panel strong { display: block; font-size: 14.5px; font-weight: 600; color: #f1eee7; }
        .snav-panel span { display: block; margin-top: 3px; font-size: 13px; line-height: 1.45; color: #9a968d; }
        .snav-panel a[aria-current="page"] strong { color: #e6b95e; }
        a.snav-cta { display: inline-flex; align-items: center; justify-content: center; height: 40px; padding: 0 18px; border-radius: 999px; background: linear-gradient(135deg, #f3dca3 0%, #e6b95e 45%, #c99232 100%); color: #17130b !important; font-size: 14px; font-weight: 700; text-decoration: none; white-space: nowrap; box-shadow: 0 8px 22px -12px rgba(217,168,67,0.7); transition: transform .2s ease, box-shadow .2s ease; }
        .snav-cta:hover { transform: translateY(-1px); box-shadow: 0 12px 26px -12px rgba(217,168,67,0.85); }
        .snav-cta:active { transform: none; }
        .snav-cta-block { display: flex; width: 100%; height: 48px; margin-top: 24px; font-size: 15px; }
        .snav-icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border: 0; border-radius: 10px; background: none; color: #f4efe6; cursor: pointer; }
        .snav-icon-btn:hover { background: rgba(255,236,200,0.06); }
        .snav-mobile-btn { display: none; margin-left: auto; }
        .snav-scrim { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.72); backdrop-filter: blur(4px); }
        .snav-drawer { position: absolute; top: 0; right: 0; bottom: 0; width: min(340px, 88vw); background: #121516; border-left: 1px solid rgba(255,236,200,0.12); padding: 16px 20px 28px; overflow-y: auto; font-family: var(--font-dm-sans), 'DM Sans', system-ui, sans-serif; }
        .snav-drawer-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .snav-m-link { display: flex; align-items: center; justify-content: space-between; width: 100%; min-height: 52px; padding: 0 4px; border: 0; border-bottom: 1px solid rgba(255,236,200,0.10); background: none; color: #f1eee7; font: inherit; font-size: 17px; font-weight: 500; text-align: left; text-decoration: none; cursor: pointer; }
        .snav-m-link[aria-current="page"] { color: #e6b95e; }
        .snav-m-toggle svg { transition: transform .2s ease; }
        .snav-m-toggle[aria-expanded="true"] svg { transform: rotate(180deg); }
        .snav-m-group { padding: 6px 0 10px 12px; border-bottom: 1px solid rgba(255,236,200,0.10); }
        .snav-m-group a { display: block; padding: 11px 4px; color: #c9c4b9; font-size: 15.5px; text-decoration: none; }
        .snav-m-group a[aria-current="page"] { color: #e6b95e; }
        @media (max-width: 900px) {
          .snav-links, .snav-desk-cta { display: none !important; }
          .snav-mobile-btn { display: inline-flex; }
          .snav-inner { height: 60px; padding: 0 16px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .snav-link, .snav-toggle, .snav-cta, .snav-toggle svg, .snav-m-toggle svg { transition: none; }
          .snav-cta:hover { transform: none; }
        }
      `}</style>
      <nav ref={navRef} className="snav" aria-label="Main">
        <div className="snav-inner">
          <AtlasLogo />

          <div className="snav-links">
            {LINKS_BEFORE.map((l) => (
              <Link key={l.href} href={l.href} className="snav-link" {...current(l.href)}>{l.label}</Link>
            ))}
            <div
              className="snav-who"
              onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setWhoOpen(false); }}
            >
              <button
                ref={whoBtnRef}
                type="button"
                className="snav-toggle"
                aria-expanded={whoOpen}
                aria-controls={panelId}
                data-active={whoActive}
                onClick={() => setWhoOpen((v) => !v)}
              >
                Who we help
                <Caret />
              </button>
              <div id={panelId} className="snav-panel" hidden={!whoOpen}>
                {WHO_WE_HELP.map((l) => (
                  <Link key={l.href} href={l.href} onClick={() => setWhoOpen(false)} {...current(l.href)}>
                    <strong>{l.label}</strong>
                    <span>{l.note}</span>
                  </Link>
                ))}
              </div>
            </div>
            {LINKS_AFTER.map((l) => (
              <Link key={l.href} href={l.href} className="snav-link" {...current(l.href)}>{l.label}</Link>
            ))}
          </div>

          <Link href={ctaHref} prefetch={ctaPrefetch} className="snav-cta snav-desk-cta">
            {cta}
          </Link>

          <button type="button" className="snav-icon-btn snav-mobile-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu" aria-expanded={mobileOpen}>
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
      </nav>

      {mounted && mobileOpen && createPortal(mobileDrawer, document.body)}
    </>
  );
}

function Caret() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
