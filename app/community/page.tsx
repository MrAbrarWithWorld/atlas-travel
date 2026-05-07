import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import WriteStoryForm from "./WriteStoryForm";
import AtlasLogo from "../components/AtlasLogo";
import MobileNav from "../components/MobileNav";
import WriteButton from "../components/WriteButton";
import { MEGA_COLS } from "../lib/megaCols";

export const revalidate = 60;

interface UserPost {
  id: string;
  user_name: string;
  title: string;
  excerpt: string;
  content: string;
  cover_photo: string;
  destination: string;
  slug: string;
  created_at: string;
  photos: { url: string; caption?: string }[] | null;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" });
}

function CommunityNav() {
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
            <Link href="/blog" className="nav-link" style={{ fontSize:12, fontWeight:600, letterSpacing:"0.1em", color:"#ede5d5", textDecoration:"none" }}>ALL</Link>
            <div className="dest-item" style={{ position:"relative" }}>
              <button style={{ background:"none", border:"none", fontSize:12, fontWeight:600, letterSpacing:"0.1em", color:"#ede5d5", cursor:"pointer", display:"flex", alignItems:"center", gap:4, padding:0 }} className="nav-link">DESTINATIONS ▾</button>
              <div className="mega-wrap" style={{ position:"absolute", top:"100%", left:-200, marginTop:8, background:"#1c1914", border:"1px solid #3a3228", borderRadius:8, padding:"24px", gridTemplateColumns:"repeat(7,160px)", gap:0, boxShadow:"0 20px 60px rgba(0,0,0,0.6)", width:"max-content" }}>
                {MEGA_COLS.map((col) => (
                  <div key={col.heading} style={{ padding:"0 16px" }}>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.15em", color:"#c9a96e", marginBottom:12, borderBottom:"1px solid #3a3228", paddingBottom:8 }}>{col.heading}</div>
                    {col.links.map(([label,slug]) => (
                      <Link key={slug} href={`/blog?q=${encodeURIComponent(slug)}`} className="nav-link" style={{ display:"block", fontSize:12, color:"#a09070", textDecoration:"none", padding:"4px 0", transition:"color 0.15s", whiteSpace:"nowrap" }}>{label}</Link>
                    ))}
                    <Link href={`/blog?q=${encodeURIComponent(col.seeAll[1])}`} style={{ display:"block", fontSize:10, color:"#c9a96e", textDecoration:"none", marginTop:8, fontWeight:600, letterSpacing:"0.08em" }}>{col.seeAll[0]} →</Link>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/blog?q=visa" className="nav-link" style={{ fontSize:12, fontWeight:600, letterSpacing:"0.1em", color:"#ede5d5", textDecoration:"none" }}>TIPS & VISA</Link>
            <Link href="/community" className="nav-link" style={{ fontSize:12, fontWeight:600, letterSpacing:"0.1em", color:"#c9a96e", textDecoration:"none" }}>COMMUNITY ✍️</Link>
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

export default async function CommunityPage() {
  let userPosts: UserPost[] = [];
  try {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (key) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://prffhhkemxibujjjiyhg.supabase.co',
        key
      );
      const { data: posts } = await supabase
        .from("user_posts")
        .select("id,user_name,title,excerpt,cover_photo,destination,slug,created_at,photos")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(20);
      userPosts = (posts ?? []) as UserPost[];
    }
  } catch { /* fallback to empty */ }

  return (
    <div style={{ background:"#1c1914", minHeight:"100vh", color:"#ede5d5", fontFamily:"var(--font-dm-sans),sans-serif" }}>
      <CommunityNav />

      {/* Hero header */}
      <div style={{ marginTop:60, padding:"80px 24px 56px", textAlign:"center", borderBottom:"1px solid #3a3228" }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.2em", color:"#c9a96e", marginBottom:16, textTransform:"uppercase" }}>Traveller-Written</p>
        <h1 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:"clamp(40px,6vw,72px)", fontWeight:600, color:"#ede5d5", lineHeight:1.1, marginBottom:20 }}>
          Community <em style={{ fontStyle:"italic" }}>Stories</em>
        </h1>
        <p style={{ fontSize:15, color:"#a09070", lineHeight:1.7, maxWidth:560, margin:"0 auto 0" }}>
          Real experiences from fellow travellers — itineraries, visa tips, budget breakdowns, and hidden gems.
        </p>
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"56px 24px" }}>

        {/* Write story form */}
        <WriteStoryForm />

        {/* Stories grid */}
        {userPosts.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 24px" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>✍️</div>
            <h3 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:28, color:"#ede5d5", marginBottom:12 }}>No community stories yet</h3>
            <p style={{ fontSize:15, color:"#a09070" }}>Be the first to share yours!</p>
          </div>
        ) : (
          <>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32 }}>
              <h2 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:28, fontWeight:600, color:"#ede5d5", margin:0 }}>Latest stories</h2>
              <span style={{ fontSize:12, color:"#a09070" }}>{userPosts.length} stories</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {userPosts.map((post) => (
                <article key={post.id} style={{ display:"flex", gap:24, padding:"28px 0", borderBottom:"1px solid #3a3228" }}>
                  {post.cover_photo ? (
                    <div style={{ width:120, height:90, flexShrink:0, borderRadius:10, overflow:"hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.cover_photo} alt={post.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    </div>
                  ) : (
                    <div style={{ width:120, height:90, flexShrink:0, borderRadius:10, background:"#231f18", border:"1px solid #3a3228", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>✈️</div>
                  )}
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                      {post.destination && (
                        <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em", color:"#c9a96e", textTransform:"uppercase" }}>{post.destination}</span>
                      )}
                      <span style={{ fontSize:11, color:"#3a3228" }}>·</span>
                      <span style={{ fontSize:11, color:"#a09070" }}>by {post.user_name || "Anonymous"}</span>
                      <span style={{ fontSize:11, color:"#3a3228" }}>·</span>
                      <span style={{ fontSize:11, color:"#a09070" }}>{fmt(post.created_at)}</span>
                    </div>
                    <h3 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:22, fontWeight:600, color:"#ede5d5", lineHeight:1.3, marginBottom:8 }}>{post.title}</h3>
                    {post.excerpt && <p style={{ fontSize:14, color:"#a09070", lineHeight:1.6, marginBottom:12 }}>{post.excerpt}</p>}
                    {/* Photo gallery preview */}
                    {post.photos && post.photos.length > 0 && (
                      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                        {post.photos.slice(0,4).map((photo, i) => (
                          <div key={i} style={{ width:56, height:42, borderRadius:6, overflow:"hidden", flexShrink:0 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={photo.url} alt={photo.caption || ''} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                          </div>
                        ))}
                        {post.photos.length > 4 && (
                          <div style={{ width:56, height:42, borderRadius:6, background:"#231f18", border:"1px solid #3a3228", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#a09070" }}>+{post.photos.length - 4}</div>
                        )}
                      </div>
                    )}
                    <Link href={post.slug ? `/community/${post.slug}` : "#"} style={{ fontSize:12, fontWeight:600, letterSpacing:"0.08em", color:"#c9a96e", textDecoration:"none" }}>Read story →</Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      <footer style={{ background:"#1c1914", borderTop:"1px solid #3a3228", padding:"32px 24px", textAlign:"center" }}>
        <p style={{ fontSize:12, color:"#a09070" }}>© {new Date().getFullYear()} Atlas Travel · All rights reserved</p>
      </footer>
    </div>
  );
}
