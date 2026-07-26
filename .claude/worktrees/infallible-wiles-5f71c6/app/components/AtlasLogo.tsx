import Link from 'next/link';

export default function AtlasLogo() {
  return (
    <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none", flexShrink:0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/atlas-icon.png" width={28} height={28} alt="Atlas" style={{ borderRadius:4, display:"block" }} />
      <span style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:18, fontWeight:600, color:"#c9a96e", letterSpacing:"0.2em" }}>ATLAS</span>
    </Link>
  );
}
