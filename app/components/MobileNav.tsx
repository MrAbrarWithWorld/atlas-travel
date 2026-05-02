'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { MEGA_COLS } from '../lib/megaCols';

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only enable portal after hydration
  useEffect(() => { setMounted(true); }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const drawer = (
    <div
      style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,0.72)", backdropFilter:"blur(4px)" }}
      onClick={() => setOpen(false)}
    >
      <div
        style={{ position:"absolute", top:0, right:0, bottom:0, width:300, background:"#1c1914", borderLeft:"1px solid #3a3228", padding:"24px 20px", overflowY:"auto" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 }}>
          <Link href="/" onClick={() => setOpen(false)} style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/atlas-icon.png" width={22} height={22} alt="Atlas" style={{ borderRadius:3, display:"block" }} />
            <span style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:18, fontWeight:600, color:"#c9a96e", letterSpacing:"0.2em" }}>ATLAS</span>
          </Link>
          <button onClick={() => setOpen(false)} style={{ background:"none", border:"none", color:"#a09070", fontSize:22, cursor:"pointer", padding:4, lineHeight:1 }}>✕</button>
        </div>

        {/* Nav links */}
        <Link href="/blog" onClick={() => setOpen(false)} style={{ display:"block", fontSize:12, fontWeight:600, letterSpacing:"0.12em", color:"#ede5d5", textDecoration:"none", padding:"14px 0", borderBottom:"1px solid #3a3228" }}>ALL ARTICLES</Link>
        <Link href="/blog?cat=visa" onClick={() => setOpen(false)} style={{ display:"block", fontSize:12, fontWeight:600, letterSpacing:"0.12em", color:"#ede5d5", textDecoration:"none", padding:"14px 0", borderBottom:"1px solid #3a3228" }}>TIPS & VISA</Link>
        <Link href="/community" onClick={() => setOpen(false)} style={{ display:"block", fontSize:12, fontWeight:600, letterSpacing:"0.12em", color:"#c9a96e", textDecoration:"none", padding:"14px 0", borderBottom:"1px solid #3a3228" }}>COMMUNITY ✍️</Link>

        {/* Destinations */}
        <div style={{ marginTop:24 }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", color:"#a09070", textTransform:"uppercase", marginBottom:20 }}>DESTINATIONS</div>
          {MEGA_COLS.map(col => (
            <div key={col.heading} style={{ marginBottom:20 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", color:"#c9a96e", marginBottom:8, textTransform:"uppercase" }}>{col.heading}</div>
              {col.links.map(([label, slug]) => (
                <Link
                  key={slug}
                  href={`/blog?q=${encodeURIComponent(slug)}`}
                  onClick={() => setOpen(false)}
                  style={{ display:"block", fontSize:13, color:"#a09070", textDecoration:"none", padding:"3px 0 3px 8px", lineHeight:1.6 }}
                >
                  {label}
                </Link>
              ))}
              <Link
                href={`/blog?q=${encodeURIComponent(col.seeAll[1])}`}
                onClick={() => setOpen(false)}
                style={{ display:"block", fontSize:10, color:"#c9a96e", textDecoration:"none", marginTop:4, paddingLeft:8, fontWeight:600, letterSpacing:"0.08em" }}
              >
                {col.seeAll[0]} →
              </Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link href="https://app.getatlas.ca" onClick={() => setOpen(false)} style={{ display:"block", marginTop:24, background:"none", border:"1px solid #c9a96e", borderRadius:8, padding:"13px 20px", color:"#c9a96e", fontSize:12, fontWeight:600, letterSpacing:"0.08em", textDecoration:"none", textAlign:"center" }}>Plan Free →</Link>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        style={{ background:"none", border:"none", color:"#ede5d5", fontSize:22, cursor:"pointer", padding:"4px 8px", lineHeight:1 }}
        className="mobile-menu-btn"
      >
        ☰
      </button>

      {/* Render drawer as a portal on document.body to escape nav stacking context */}
      {mounted && open && createPortal(drawer, document.body)}
    </>
  );
}
