import Link from 'next/link';

export default function AtlasLogo() {
  return (
    <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none", flexShrink:0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#c9a96e" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="3" fill="#c9a96e"/>
        <line x1="12" y1="2" x2="12" y2="6" stroke="#c9a96e" strokeWidth="1.5"/>
        <line x1="12" y1="18" x2="12" y2="22" stroke="#c9a96e" strokeWidth="1.5"/>
        <line x1="2" y1="12" x2="6" y2="12" stroke="#c9a96e" strokeWidth="1.5"/>
        <line x1="18" y1="12" x2="22" y2="12" stroke="#c9a96e" strokeWidth="1.5"/>
      </svg>
      <span style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:18, fontWeight:600, color:"#c9a96e", letterSpacing:"0.2em" }}>ATLAS</span>
    </Link>
  );
}
