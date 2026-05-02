'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MEGA_COLS } from '../lib/megaCols';

export default function MobileNav() {
  const [open, setOpen] = useState(false);

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

      {open && (
        <div
          style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(0,0,0,0.65)", backdropFilter:"blur(4px)" }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{ position:"absolute", top:0, right:0, bottom:0, width:300, background:"#1c1914", borderLeft:"1px solid #3a3228", padding:"24px 20px", overflowY:"auto" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 }}>
              <Link href="/" onClick={() => setOpen(false)} style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#c9a96e" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="3" fill="#c9a96e"/>
                  <line x1="12" y1="2" x2="12" y2="6" stroke="#c9a96e" strokeWidth="1.5"/>
                  <line x1="12" y1="18" x2="12" y2="22" stroke="#c9a96e" strokeWidth="1.5"/>
                  <line x1="2" y1="12" x2="6" y2="12" stroke="#c9a96e" strokeWidth="1.5"/>
                  <line x1="18" y1="12" x2="22" y2="12" stroke="#c9a96e" strokeWidth="1.5"/>
                </svg>
                <span style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:18, fontWeight:600, color:"#c9a96e", letterSpacing:"0.2em" }}>ATLAS</span>
              </Link>
              <button onClick={() => setOpen(false)} style={{ background:"none", border:"none", color:"#a09070", fontSize:22, cursor:"pointer", padding:4 }}>✕</button>
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
                    <Link key={slug} href={`/destinations/${slug}`} onClick={() => setOpen(false)} style={{ display:"block", fontSize:13, color:"#a09070", textDecoration:"none", padding:"3px 0 3px 8px", lineHeight:1.6 }}>{label}</Link>
                  ))}
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link href="https://app.getatlas.ca" onClick={() => setOpen(false)} style={{ display:"block", marginTop:24, background:"none", border:"1px solid #c9a96e", borderRadius:8, padding:"13px 20px", color:"#c9a96e", fontSize:12, fontWeight:600, letterSpacing:"0.08em", textDecoration:"none", textAlign:"center" }}>Plan Free →</Link>
          </div>
        </div>
      )}
    </>
  );
}
