import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export const revalidate = 60;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://prffhhkemxibujjjiyhg.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || ''
);

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  category: string;
  read_time_minutes: number;
  published_at: string;
  language: string;
}

const MEGA_COLS = [
  { heading: "SOUTH ASIA", links: [["ð§ð© Bangladesh","bangladesh"],["ð Cox's Bazar","coxs-bazar"],["ð²ð» Maldives","maldives"],["ð³ðµ Nepal","nepal"],["ð®ð³ India","india"],["ð®ð© Bali","bali"],["ð±ð° Sri Lanka","sri-lanka"]], seeAll: ["ALL SOUTH ASIA","south-asia"] },
  { heading: "EAST ASIA", links: [["ð¯ðµ Japan","japan"],["ð¸ð¬ Singapore","singapore"],["ð¹ð­ Thailand","thailand"],["ð°ð· South Korea","south-korea"],["ð»ð³ Vietnam","vietnam"]], seeAll: ["ALL EAST ASIA","east-asia"] },
  { heading: "EUROPE", links: [["ð«ð· France","france"],["ð®ð¹ Italy","italy"],["ðªð¸ Spain","spain"],["ð¬ð§ UK","uk"],["ð³ð± Netherlands","netherlands"]], seeAll: ["ALL EUROPE","europe"] },
  { heading: "MIDDLE EAST", links: [["ð¦ðª Dubai","dubai"],["ð¹ð· Turkey","turkey"],["ð¯ð´ Jordan","jordan"],["ð¶ð¦ Qatar","qatar"],["ð¸ð¦ Saudi Arabia","saudi-arabia"]], seeAll: ["ALL MIDDLE EAST","middle-east"] },
  { heading: "AMERICAS", links: [["ð¨ð¦ Canada / Banff","canada"],["ð½ New York","new-york"],["ð Los Angeles","los-angeles"],["ð²ð½ Mexico","mexico"],["ð§ð· Brazil","brazil"],["ð¨ð´ Colombia","colombia"]], seeAll: ["ALL AMERICAS","americas"] },
  { heading: "AFRICA", links: [["ð²ð¦ Morocco","morocco"],["ðªð¬ Egypt","egypt"],["ð¿ð¦ South Africa","south-africa"],["ð¹ð¿ Tanzania","tanzania"],["ð°ðª Kenya","kenya"]], seeAll: ["ALL AFRICA","africa"] },
  { heading: "OCEANIA", links: [["ð¦ðº Australia","australia"],["ð³ð¿ New Zealand","new-zealand"],["ð«ð¯ Fiji","fiji"]], seeAll: ["ALL OCEANIA","oceania"] },
];

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function BlogNav() {
  return (
    <>
      <style>{`
        .dest-item:hover .mega-wrap { display: grid; }
        .mega-wrap { display: none; }
        .nav-link:hover { color: #c9a96e !important; }
      `}</style>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(28,25,20,0.97)", borderBottom:"1px solid #3a3228", backdropFilter:"blur(8px)" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px", height:60, display:"flex", alignItems:"center", gap:36 }}>
          <Link href="/" style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:22, fontWeight:600, color:"#c9a96e", textDecoration:"none", letterSpacing:"0.04em", marginRight:8 }}>Atlas</Link>
          <div style={{ display:"flex", alignItems:"center", gap:28, flex:1 }}>
            <Link href="/blog" className="nav-link" style={{ fontSize:12, fontWeight:600, letterSpacing:"0.1em", color:"#ede5d5", textDecoration:"none", transition:"color 0.2s" }}>ALL</Link>
            <div className="dest-item" style={{ position:"relative" }}>
              <button style={{ background:"none", border:"none", fontSize:12, fontWeight:600, letterSpacing:"0.1em", color:"#ede5d5", cursor:"pointer", display:"flex", alignItems:"center", gap:4, padding:0 }} className="nav-link">DESTINATIONS â¾</button>
              <div className="mega-wrap" style={{ position:"absolute", top:"100%", left:-200, marginTop:8, background:"#1c1914", border:"1px solid #3a3228", borderRadius:8, padding:"24px", gridTemplateColumns:"repeat(7,160px)", gap:0, boxShadow:"0 20px 60px rgba(0,0,0,0.6)", width:"max-content" }}>
                {MEGA_COLS.map((col) => (
                  <div key={col.heading} style={{ padding:"0 16px" }}>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.15em", color:"#c9a96e", marginBottom:12, borderBottom:"1px solid #3a3228", paddingBottom:8 }}>{col.heading}</div>
                    {col.links.map(([label,slug]) => (
                      <Link key={slug} href={`/destinations/${slug}`} className="nav-link" style={{ display:"block", fontSize:12, color:"#a09070", textDecoration:"none", padding:"4px 0", transition:"color 0.15s", whiteSpace:"nowrap" }}>{label}</Link>
                    ))}
                    <Link href={`/destinations/${col.seeAll[1]}`} style={{ display:"block", fontSize:10, color:"#c9a96e", textDecoration:"none", marginTop:8, fontWeight:600, letterSpacing:"0.08em" }}>{col.seeAll[0]} â</Link>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/blog?cat=visa" className="nav-link" style={{ fontSize:12, fontWeight:600, letterSpacing:"0.1em", color:"#ede5d5", textDecoration:"none" }}>TIPS & VISA</Link>
            <Link href="/community" className="nav-link" style={{ fontSize:12, fontWeight:600, letterSpacing:"0.1em", color:"#ede5d5", textDecoration:"none" }}>COMMUNITY âï¸</Link>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <button style={{ background:"none", border:"1px solid #3a3228", borderRadius:6, padding:"6px 12px", color:"#a09070", fontSize:12, cursor:"pointer" }}>ð EN</button>
            <Link href="https://app.getatlas.ca" style={{ background:"none", border:"1px solid #c9a96e", borderRadius:6, padding:"8px 18px", color:"#c9a96e", fontSize:12, fontWeight:600, letterSpacing:"0.08em", textDecoration:"none" }}>Plan Free â</Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id,title,slug,excerpt,cover_image_url,category,read_time_minutes,published_at,language")
    .eq("is_published", true)
    .eq("language", "en")
    .order("published_at", { ascending: false })
    .limit(30);

  const allPosts: Post[] = posts ?? [];
  const featured = allPosts[0];
  const topPosts = allPosts.slice(1, 5);
  const restPosts = allPosts.slice(5);

  return (
    <div style={{ background:"#1c1914", minHeight:"100vh", color:"#ede5d5", fontFamily:"var(--font-dm-sans),sans-serif" }}>
      <BlogNav />
      {featured && (
        <div style={{ position:"relative", height:"100vh", overflow:"hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={featured.cover_image_url} alt={featured.title} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(28,25,20,0.95) 0%,rgba(28,25,20,0.4) 50%,rgba(28,25,20,0.15) 100%)" }} />
          <div style={{ position:"absolute", bottom:64, left:48, right:48, maxWidth:780 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.18em", color:"#c9a96e", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ display:"inline-block", width:32, height:1, background:"#c9a96e" }} />
              FEATURED STORY Â· {featured.category?.toUpperCase()}
            </div>
            <h1 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:"clamp(36px,5vw,68px)", fontWeight:600, lineHeight:1.1, color:"#ede5d5", marginBottom:18 }}>{featured.title}</h1>
            {featured.excerpt && <p style={{ fontSize:16, color:"#a09070", lineHeight:1.6, marginBottom:24, maxWidth:600 }}>{featured.excerpt}</p>}
            <Link href={`/blog/${featured.slug}`} style={{ fontSize:13, fontWeight:600, letterSpacing:"0.1em", color:"#c9a96e", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:8, borderBottom:"1px solid #c9a96e", paddingBottom:2 }}>READ THE STORY â</Link>
          </div>
        </div>
      )}
      {topPosts.length > 0 && (
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"64px 24px 40px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:24 }}>
            {topPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration:"none" }}>
                <article style={{ background:"#231f18", borderRadius:12, overflow:"hidden", border:"1px solid #3a3228" }}>
                  {post.cover_image_url && <div style={{ height:180 }}><img src={post.cover_image_url} alt={post.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} /></div>}
                  <div style={{ padding:"20px" }}>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.15em", color:"#c9a96e", marginBottom:8, textTransform:"uppercase" }}>{post.category}</div>
                    <h3 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:20, fontWeight:600, color:"#ede5d5", lineHeight:1.3, marginBottom:8 }}>{post.title}</h3>
                    <div style={{ fontSize:11, color:"#a09070", display:"flex", gap:12 }}><span>{post.read_time_minutes} min read</span><span>Â·</span><span>{fmt(post.published_at)}</span></div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}
      {restPosts.length > 0 && (
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px 64px" }}>
          <h2 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:32, fontWeight:600, color:"#ede5d5", marginBottom:32, borderBottom:"1px solid #3a3228", paddingBottom:16 }}>
            All Articles <span style={{ fontSize:18, color:"#a09070", fontWeight:400 }}>{allPosts.length} total</span>
          </h2>
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {restPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration:"none" }}>
                <article style={{ display:"flex", gap:20, padding:"20px 0", borderBottom:"1px solid #3a3228", alignItems:"center" }}>
                  {post.cover_image_url && <div style={{ width:100, height:72, flexShrink:0, borderRadius:8, overflow:"hidden" }}><img src={post.cover_image_url} alt={post.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} /></div>}
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.15em", color:"#c9a96e", marginBottom:4, textTransform:"uppercase" }}>{post.category}</div>
                    <h3 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:18, fontWeight:600, color:"#ede5d5", lineHeight:1.3, marginBottom:4 }}>{post.title}</h3>
                    <div style={{ fontSize:11, color:"#a09070", display:"flex", gap:12 }}><span>{post.read_time_minutes} min read</span><span>Â·</span><span>{fmt(post.published_at)}</span></div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}
      <div style={{ background:"#231f18", borderTop:"1px solid #3a3228", borderBottom:"1px solid #3a3228", padding:"80px 24px" }}>
        <div style={{ maxWidth:600, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:42, fontWeight:600, color:"#ede5d5", marginBottom:16 }}>The Atlas Dispatch</h2>
          <p style={{ fontSize:15, color:"#a09070", lineHeight:1.7, marginBottom:32 }}>Hidden gems, budget routes, and destination inspiration from across the globe â delivered to your inbox every week. No spam, just stories worth reading.</p>
          <form style={{ display:"flex", gap:12, maxWidth:440, margin:"0 auto" }} onSubmit={(e)=>e.preventDefault()}>
            <input type="email" placeholder="your@email.com" style={{ flex:1, background:"#1c1914", border:"1px solid #3a3228", borderRadius:8, padding:"12px 16px", color:"#ede5d5", fontSize:14, outline:"none" }} />
            <button type="submit" style={{ background:"none", border:"1px solid #c9a96e", borderRadius:8, padding:"12px 20px", color:"#c9a96e", fontSize:13, fontWeight:600, letterSpacing:"0.06em", cursor:"pointer", whiteSpace:"nowrap" }}>Subscribe â It&apos;s Free</button>
          </form>
        </div>
      </div>
      <div style={{ position:"relative", height:420, overflow:"hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&h=600&fit=crop&q=80" alt="Discover the world" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(28,25,20,0.75) 0%,rgba(28,25,20,0.3) 60%,rgba(28,25,20,0.1) 100%)" }} />
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", paddingLeft:64 }}>
          <div>
            <h2 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:"clamp(36px,5vw,64px)", fontWeight:600, color:"#ede5d5", lineHeight:1.15, marginBottom:24 }}>Discover the world<br /><em>with us.</em></h2>
            <Link href="https://app.getatlas.ca" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"none", border:"1px solid #c9a96e", borderRadius:8, padding:"12px 24px", color:"#c9a96e", fontSize:13, fontWeight:600, letterSpacing:"0.08em", textDecoration:"none" }}>Start Planning Free â</Link>
          </div>
        </div>
      </div>
      <footer style={{ background:"#1c1914", borderTop:"1px solid #3a3228", padding:"32px 24px", textAlign:"center" }}>
        <p style={{ fontSize:12, color:"#a09070" }}>Â© {new Date().getFullYear()} Atlas Travel Â· All rights reserved</p>
      </footer>
    </div>
  );
}