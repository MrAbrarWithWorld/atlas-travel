'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import AtlasLogo from './AtlasLogo';

export default function SiteNav({ activePath }: { activePath?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const gold = '#c9a96e';
  const text = '#ede5d5';
  const muted = '#a09070';
  const border = '#3a3228';
  const bg = '#1c1914';

  function linkColor(href: string) {
    return activePath === href ? gold : text;
  }

  const navLinks = [
    { href: '/services', label: 'SERVICES' },
    { href: '/blog', label: 'BLOG' },
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
        <Link href="/" onClick={() => setMobileOpen(false)} style={{ display: 'block', marginTop: 24, border: `1px solid ${gold}`, borderRadius: 8, padding: '13px 20px', color: gold, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textDecoration: 'none', textAlign: 'center' }}>
          Try Atlas Travel →
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .snav-link:hover { color: #c9a96e !important; }
        @media (max-width: 768px) { .snav-desktop { display: none !important; } }
        @media (min-width: 769px) { .snav-mobile-btn { display: none !important; } }
      `}</style>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(28,25,20,0.97)', borderBottom: `1px solid ${border}`, backdropFilter: 'blur(8px)' }}>
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
            <Link href="/" className="snav-desktop" style={{ background: 'none', border: `1px solid ${gold}`, borderRadius: 6, padding: '8px 18px', color: gold, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Try Atlas →
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
