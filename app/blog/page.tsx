import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import type { Metadata } from "next";
import NewsletterForm from "./NewsletterForm";
import BlogClient from "./BlogClient";
import AtlasLogo from "../components/AtlasLogo";
import MobileNav from "../components/MobileNav";
import WriteButton from "../components/WriteButton";
import { MEGA_COLS } from "../lib/megaCols";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Atlas Travel Blog — Destination Guides, Visa Tips & Itineraries",
  description: "Explore expert travel guides, visa tips, budget breakdowns, and hidden gems from around the world.",
  openGraph: {
    title: "Atlas Travel Blog",
    description: "Expert travel guides and destination inspiration from around the world.",
    images: [{ url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=630&fit=crop&q=80", width: 1200, height: 630 }],
    type: "website",
    url: "https://getatlas.ca/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlas Travel Blog",
    description: "Expert travel guides and destination inspiration.",
    images: ["https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=630&fit=crop&q=80"],
  },
};

interface Post {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string;
  category: string;
  read_time: string;
  date_published: string;
}

function BlogNav() {
  return (
    <>
      <style>{`
        .dest-item:hover .mega-wrap { display: grid; }
        .mega-wrap { display: none; }
        .nav-link:hover { color: #c9a96e !important; }
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
        @media (min-width: 769px) { .mobile-menu-btn { display: none !important; } }
      `}</style>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(28,25,20,0.97)", borderBottom:"1px solid #3a3228", backdropFilter:"blur(8px)" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px", height:60, display:"flex", alignItems:"center", gap:24 }}>
          <AtlasLogo />
          <div className="desktop-nav" style={{ display:"flex", alignItems:"center", gap:28, flex:1 }}>
            <Link href="/blog" className="nav-link" style={{ fontSize:12, fontWeight:600, letterSpacing:"0.1em", color:"#ede5d5", textDecoration:"none", transition:"color 0.2s" }}>ALL</Link>
            <div className="dest-item" style={{ position:"relative" }}>
              <button style={{ background:"none", border:"none", fontSize:12, fontWeight:600, letterSpacing:"0.1em", color:"#ede5d5", cursor:"pointer", display:"flex", alignItems:"center", gap:4, padding:0 }} className="nav-link">DESTINATIONS ▾</button>
              <div className="mega-wrap" style={{ position:"absolute", top:"100%", left:-200, marginTop:8, background:"#1c1914", border:"1px solid #3a3228", borderRadius:8, padding:"24px", gridTemplateColumns:"repeat(7,160px)", gap:0, boxShadow:"0 20px 60px rgba(0,0,0,0.6)", width:"max-content" }}>
                {MEGA_COLS.map((col) => (
                  <div key={col.heading} style={{ padding:"0 16px" }}>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.15em", color:"#c9a96e", marginBottom:12, borderBottom:"1px solid #3a3228", paddingBottom:8 }}>{col.heading}</div>
                    {col.links.map(([label,slug]) => (
                      <Link key={slug} href={`/destinations/${slug}`} className="nav-link" style={{ display:"block", fontSize:12, color:"#a09070", textDecoration:"none", padding:"4px 0", transition:"color 0.15s", whiteSpace:"nowrap" }}>{label}</Link>
                    ))}
                    <Link href={`/destinations/${col.seeAll[1]}`} style={{ display:"block", fontSize:10, color:"#c9a96e", textDecoration:"none", marginTop:8, fontWeight:600, letterSpacing:"0.08em" }}>{col.seeAll[0]} →</Link>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/blog?cat=visa" className="nav-link" style={{ fontSize:12, fontWeight:600, letterSpacing:"0.1em", color:"#ede5d5", textDecoration:"none" }}>TIPS & VISA</Link>
            <Link href="/community" className="nav-link" style={{ fontSize:12, fontWeight:600, letterSpacing:"0.1em", color:"#ede5d5", textDecoration:"none" }}>COMMUNITY ✍️</Link>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <WriteButton />
            <Link href="https://app.getatlas.ca" className="desktop-nav" style={{ background:"none", border:"1px solid #c9a96e", borderRadius:6, padding:"8px 18px", color:"#c9a96e", fontSize:12, fontWeight:600, letterSpacing:"0.08em", textDecoration:"none" }}>Plan Free →</Link>
            <MobileNav />
          </div>
        </div>
      </nav>
    </>
  );
}

export default async function BlogPage() {
  let allPosts: Post[] = [];
  try {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (key) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://prffhhkemxibujjjiyhg.supabase.co',
        key
      );
      const { data: posts } = await supabase
        .from("blog_posts")
        .select("id,title,slug,description,cover_image_url,category,read_time,date_published")
        .eq("is_published", true)
        .order("date_published", { ascending: false })
        .limit(50);
      allPosts = (posts ?? []) as Post[];
    }
  } catch { /* fallback to empty */ }

  return (
    <div style={{ background:"#1c1914", minHeight:"100vh", color:"#ede5d5", fontFamily:"var(--font-dm-sans),sans-serif" }}>
      <BlogNav />
      <div style={{ paddingTop:60 }}>
        <BlogClient allPosts={allPosts} />
      </div>

      {/* Newsletter */}
      <div style={{ background:"#231f18", borderTop:"1px solid #3a3228", borderBottom:"1px solid #3a3228", padding:"80px 24px" }}>
        <div style={{ maxWidth:600, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:42, fontWeight:600, color:"#ede5d5", marginBottom:16 }}>The Atlas Dispatch</h2>
          <p style={{ fontSize:15, color:"#a09070", lineHeight:1.7, marginBottom:32 }}>Hidden gems, budget routes, and destination inspiration from across the globe — delivered to your inbox every week. No spam, just stories worth reading.</p>
          <NewsletterForm />
        </div>
      </div>

      {/* CTA banner */}
      <div style={{ position:"relative", height:420, overflow:"hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&h=600&fit=crop&q=80" alt="Discover the world" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(28,25,20,0.75) 0%,rgba(28,25,20,0.3) 60%,rgba(28,25,20,0.1) 100%)" }} />
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", paddingLeft:64 }}>
          <div>
            <h2 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:"clamp(36px,5vw,64px)", fontWeight:600, color:"#ede5d5", lineHeight:1.15, marginBottom:24 }}>Discover the world<br /><em>with us.</em></h2>
            <Link href="https://app.getatlas.ca" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"none", border:"1px solid #c9a96e", borderRadius:8, padding:"12px 24px", color:"#c9a96e", fontSize:13, fontWeight:600, letterSpacing:"0.08em", textDecoration:"none" }}>Start Planning Free →</Link>
          </div>
        </div>
      </div>

      <footer style={{ background:"#1c1914", borderTop:"1px solid #3a3228", padding:"32px 24px", textAlign:"center" }}>
        <p style={{ fontSize:12, color:"#a09070" }}>© {new Date().getFullYear()} Atlas Travel · All rights reserved</p>
      </footer>
    </div>
  );
}
