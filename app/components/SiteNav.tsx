'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import AtlasLogo from './AtlasLogo';

export default function SiteNav({
  activePath,
  ctaLabel = 'Try Atlas →',
  ctaHref = '/travel',
}: {
  activePath?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const gold = '#e6b95e';
  const text = '#f4efe6';
  const muted = '#b2ab9e';
  const border = 'rgba(255,236,200,0.12)';
  const bg = '#14120f';

  // /travel is the static travel app (public/index.html), not a Next.js page: don't prefetch it.
  const ctaPrefetch = ctaHref.startsWith('/travel') ? false : undefined;

  function linkColor(href: string) {
    return activePath === href ? gold : text;
  }

  const navLinks = [
    { href: '/services', label: 'SERVICES' },
    { href: '/pricing', label: 'PRICING' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'CONTACT' },
  ];

  const mobileDrawer = (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }}
      onClick={() => setMobileOpen(false)}
    >
      <div
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 280, background: bg, borderLeft: `1px solid ${border}`, padding: '24px 20px', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <AtlasLogo />
          <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', color: muted, fontSize: 22, cursor: 'pointer', padding: 4 }}>✕</button>
        </div>
        {navLinks.map(l => (
          <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', color: linkColor(l.href), textDecoration: 'none', padding: '14px 0', borderBottom: `1px solid ${border}` }}>
            {l.label}
          </Link>
        ))}
        <Link href={ctaHref} prefetch={ctaPrefetch} onClick={() => setMobileOpen(false)} className="snav-cta" style={{ display: 'block', marginTop: 24, border: `1px solid ${gold}`, borderRadius: 999, padding: '13px 20px', color: gold, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textDecoration: 'none', textAlign: 'center' }}>
          {ctaLabel}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .snav-link { transition: color .25s ease; }
        .snav-link:hover { color: #ecc067 !important; }
        .snav-cta { transition: transform .5s cubic-bezier(.34,1.56,.64,1), background-color .3s ease, box-shadow .3s ease; }
        .snav-cta:hover { background: rgba(217,168,67,0.12) !important; box-shadow: 0 10px 26px -14px rgba(217,168,67,0.6); transform: translateY(-1px); }
        .snav-cta:active { transform: scale(0.97); transition-duration: .12s; }
        @media (prefers-reduced-motion: reduce) { .snav-cta, .snav-link { transition: none; } .snav-cta:hover, .snav-cta:active { transform: none; } }
        @media (max-width: 768px) { .snav-desktop { display: none !important; } }
        @media (min-width: 769px) { .snav-mobile-btn { display: none !important; } }
      `}</style>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(11,10,8,0.72)', borderBottom: `1px solid ${border}`, backdropFilter: 'blur(16px) saturate(150%)', WebkitBackdropFilter: 'blur(16px) saturate(150%)', boxShadow: 'inset 0 -1px 0 rgba(255,244,222,0.03), 0 10px 30px -20px rgba(0,0,0,0.8)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', gap: 24 }}>
          <AtlasLogo />

          {/* Desktop links */}
          <div className="snav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 28, flex: 1 }}>
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className="snav-link" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: linkColor(l.href), textDecoration: 'none' }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href={ctaHref} prefetch={ctaPrefetch} className="snav-desktop snav-cta" style={{ background: 'rgba(217,168,67,0.04)', border: `1px solid ${gold}`, borderRadius: 999, padding: '8px 18px', color: gold, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              {ctaLabel}
            </Link>
            {/* Mobile hamburger */}
            <button className="snav-mobile-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu" style={{ background: 'none', border: 'none', color: text, fontSize: 22, cursor: 'pointer', padding: '4px 8px' }}>☰</button>
          </div>
        </div>
      </nav>

      {mounted && mobileOpen && createPortal(mobileDrawer, document.body)}
    </>
  );
}
