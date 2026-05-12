import Link from "next/link";
import AtlasLogo from "../../components/AtlasLogo";
import MobileNav from "../../components/MobileNav";
import WriteButton from "../../components/WriteButton";
import { MEGA_COLS } from "../../lib/megaCols";

interface BlogNavProps {
  /** Highlight a specific nav link. Pass the href value, e.g. "/community" */
  activePath?: string;
  /** Extra CSS injected via <style> — used by blog post page for .share-btn and .toc-sidebar rules */
  extraStyles?: string;
}

export default function BlogNav({ activePath, extraStyles }: BlogNavProps) {
  const activeColor = "#c9a96e";
  const defaultColor = "#ede5d5";

  function linkColor(href: string) {
    return activePath === href ? activeColor : defaultColor;
  }

  return (
    <>
      <style>{`
        .dest-item:hover .mega-wrap { display: grid; }
        .mega-wrap { display: none; }
        .nav-link:hover { color: #c9a96e !important; }
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
        @media (min-width: 769px) { .mobile-menu-btn { display: none !important; } }
        ${extraStyles || ""}
      `}</style>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(28,25,20,0.97)", borderBottom: "1px solid #3a3228", backdropFilter: "blur(8px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 24 }}>
          <AtlasLogo />
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 28, flex: 1 }}>
            <Link href="/blog" className="nav-link" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: linkColor("/blog"), textDecoration: "none" }}>ALL</Link>
            <div className="dest-item" style={{ position: "relative" }}>
              <button style={{ background: "none", border: "none", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: defaultColor, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: 0 }} className="nav-link">
                DESTINATIONS ▾
              </button>
              <div className="mega-wrap" style={{ position: "absolute", top: "100%", left: -200, marginTop: 8, background: "#1c1914", border: "1px solid #3a3228", borderRadius: 8, padding: "24px", gridTemplateColumns: "repeat(7,160px)", gap: 0, boxShadow: "0 20px 60px rgba(0,0,0,0.6)", width: "max-content" }}>
                {MEGA_COLS.map((col) => (
                  <div key={col.heading} style={{ padding: "0 16px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#c9a96e", marginBottom: 12, borderBottom: "1px solid #3a3228", paddingBottom: 8 }}>{col.heading}</div>
                    {col.links.map(([label, slug]) => (
                      <Link key={slug} href={"/blog?q=" + encodeURIComponent(slug)} className="nav-link" style={{ display: "block", fontSize: 12, color: "#a09070", textDecoration: "none", padding: "4px 0", transition: "color 0.15s", whiteSpace: "nowrap" }}>{label}</Link>
                    ))}
                    <Link href={"/blog?q=" + encodeURIComponent(col.seeAll[1])} style={{ display: "block", fontSize: 10, color: "#c9a96e", textDecoration: "none", marginTop: 8, fontWeight: 600, letterSpacing: "0.08em" }}>{col.seeAll[0]} →</Link>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/blog?q=visa" className="nav-link" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: defaultColor, textDecoration: "none" }}>TIPS & VISA</Link>
            <Link href="/community" className="nav-link" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: linkColor("/community"), textDecoration: "none" }}>COMMUNITY ✍️</Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <WriteButton />
            <Link href="https://app.getatlas.ca" className="desktop-nav" style={{ background: "none", border: "1px solid #c9a96e", borderRadius: 6, padding: "8px 18px", color: "#c9a96e", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textDecoration: "none" }}>Plan Free →</Link>
            <MobileNav />
          </div>
        </div>
      </nav>
    </>
  );
}
