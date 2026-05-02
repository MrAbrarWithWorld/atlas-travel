import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareButtons from "./ShareButtons";

export const revalidate = 60;

interface RelatedPost {
  id: string; title: string; slug: string; excerpt: string;
  cover_image_url: string; category: string; read_time_minutes: number; published_at: string;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" });
}

function BlogNav() {
  return (
    <>
      <style>{`
        .nav-link:hover { color: #c9a96e !important; }
        .share-btn:hover { border-color: #c9a96e !important; color: #c9a96e !important; }
        .share-btn { transition: all 0.2s; }
      `}</style>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(28,25,20,0.97)", borderBottom:"1px solid #3a3228", backdropFilter:"blur(8px)" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px", height:60, display:"flex", alignItems:"center", gap:36 }}>
          <Link href="/" style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:22, fontWeight:600, color:"#c9a96e", textDecoration:"none", letterSpacing:"0.04em" }}>Atlas</Link>
          <div style={{ display:"flex", alignItems:"center", gap:28, flex:1 }}>
            <Link href="/blog" className="nav-link" style={{ fontSize:12, fontWeight:600, letterSpacing:"0.1em", color:"#ede5d5", textDecoration:"none" }}>ALL</Link>
            <Link href="/blog" className="nav-link" style={{ fontSize:12, fontWeight:600, letterSpacing:"0.1em", color:"#ede5d5", textDecoration:"none" }}>DESTINATIONS ▾</Link>
            <Link href="/blog?cat=visa" className="nav-link" style={{ fontSize:12, fontWeight:600, letterSpacing:"0.1em", color:"#ede5d5", textDecoration:"none" }}>TIPS & VISA</Link>
            <Link href="/community" className="nav-link" style={{ fontSize:12, fontWeight:600, letterSpacing:"0.1em", color:"#ede5d5", textDecoration:"none" }}>COMMUNITY ✍️</Link>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <button style={{ background:"none", border:"1px solid #3a3228", borderRadius:6, padding:"6px 12px", color:"#a09070", fontSize:12, cursor:"pointer" }}>🌐 EN</button>
            <Link href="https://app.getatlas.ca" style={{ background:"none", border:"1px solid #c9a96e", borderRadius:6, padding:"8px 18px", color:"#c9a96e", fontSize:12, fontWeight:600, letterSpacing:"0.08em", textDecoration:"none" }}>Plan Free →</Link>
          </div>
        </div>
      </nav>
    </>
  );
}


export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://prffhhkemxibujjjiyhg.supabase.co',
    process.env.SUPABASE_SERVICE_KEY || ''
  );

  const { data: post } = await supabase
    .from("blog_posts").select("*").eq("slug", slug).eq("is_published", true).single();

  if (!post) notFound();

  const { data: related } = await supabase
    .from("blog_posts")
    .select("id,title,slug,excerpt,cover_image_url,category,read_time_minutes,published_at")
    .eq("is_published", true).eq("language", post.language || "en")
    .neq("slug", slug).order("published_at", { ascending: false }).limit(4);

  const relatedPosts: RelatedPost[] = related ?? [];

  return (
    <div style={{ background:"#1c1914", minHeight:"100vh", color:"#ede5d5", fontFamily:"var(--font-dm-sans),sans-serif" }}>
      <BlogNav />
      {post.cover_image_url && (
        <div style={{ position:"relative", height:"60vh", minHeight:380, overflow:"hidden", marginTop:60 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover_image_url} alt={post.title} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(28,25,20,0.9) 0%,rgba(28,25,20,0.2) 100%)" }} />
        </div>
      )}
      <div style={{ maxWidth:780, margin:"0 auto", padding:"48px 24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.18em", color:"#c9a96e", textTransform:"uppercase" }}>{post.category}</span>
          <span style={{ color:"#3a3228" }}>·</span>
          <span style={{ fontSize:12, color:"#a09070" }}>{post.read_time_minutes} min read</span>
          <span style={{ color:"#3a3228" }}>·</span>
          <span style={{ fontSize:12, color:"#a09070" }}>{fmt(post.published_at)}</span>
        </div>
        <h1 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:"clamp(32px,5vw,52px)", fontWeight:600, lineHeight:1.15, color:"#ede5d5", marginBottom:20 }}>{post.title}</h1>
        {post.excerpt && <p style={{ fontSize:18, color:"#a09070", lineHeight:1.7, marginBottom:24, borderLeft:"3px solid #c9a96e", paddingLeft:16 }}>{post.excerpt}</p>}
        <div style={{ marginBottom:40, paddingBottom:32, borderBottom:"1px solid #3a3228" }}>
          <ShareButtons title={post.title} slug={post.slug} />
        </div>
        {post.content_html ? (
          <div style={{ lineHeight:1.8, fontSize:16, color:"#ede5d5" }} className="article-body" dangerouslySetInnerHTML={{ __html: post.content_html }} />
        ) : (
          <p style={{ color:"#a09070", fontStyle:"italic" }}>Content coming soon.</p>
        )}
        <div style={{ marginTop:48, paddingTop:32, borderTop:"1px solid #3a3228" }}>
          <p style={{ fontSize:13, color:"#a09070", marginBottom:16 }}>Enjoyed this guide? Share it with a fellow traveller:</p>
          <ShareButtons title={post.title} slug={post.slug} />
        </div>
        <div style={{ marginTop:40, paddingTop:24, borderTop:"1px solid #3a3228" }}>
          <Link href="/blog" className="nav-link" style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:13, fontWeight:600, letterSpacing:"0.1em", color:"#a09070", textDecoration:"none" }}>← BACK TO ALL ARTICLES</Link>
        </div>
      </div>
      <div style={{ background:"#231f18", borderTop:"1px solid #3a3228", borderBottom:"1px solid #3a3228", padding:"56px 24px" }}>
        <div style={{ maxWidth:780, margin:"0 auto" }}>
          <h3 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:28, fontWeight:600, color:"#ede5d5", marginBottom:8 }}>Join the conversation</h3>
          <p style={{ fontSize:14, color:"#a09070", marginBottom:28 }}>Have a tip, a question, or visited this destination? Share your experience below.</p>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <input type="text" placeholder="Your name" style={{ background:"#1c1914", border:"1px solid #3a3228", borderRadius:8, padding:"12px 16px", color:"#ede5d5", fontSize:14, outline:"none", fontFamily:"var(--font-dm-sans),sans-serif" }} />
              <input type="email" placeholder="Email (not published)" style={{ background:"#1c1914", border:"1px solid #3a3228", borderRadius:8, padding:"12px 16px", color:"#ede5d5", fontSize:14, outline:"none", fontFamily:"var(--font-dm-sans),sans-serif" }} />
            </div>
            <textarea placeholder="Your comment or tip..." rows={4} style={{ background:"#1c1914", border:"1px solid #3a3228", borderRadius:8, padding:"12px 16px", color:"#ede5d5", fontSize:14, outline:"none", resize:"vertical", fontFamily:"var(--font-dm-sans),sans-serif" }} />
            <div>
              <button style={{ background:"none", border:"1px solid #c9a96e", borderRadius:8, padding:"12px 24px", color:"#c9a96e", fontSize:13, fontWeight:600, letterSpacing:"0.08em", cursor:"pointer" }}>Post Comment →</button>
            </div>
          </div>
        </div>
      </div>
      {relatedPosts.length > 0 && (
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"64px 24px" }}>
          <h2 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:32, fontWeight:600, color:"#ede5d5", marginBottom:32 }}>More from Atlas</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:24 }}>
            {relatedPosts.map((rp) => (
              <Link key={rp.id} href={`/blog/${rp.slug}`} style={{ textDecoration:"none" }}>
                <article style={{ background:"#231f18", borderRadius:12, overflow:"hidden", border:"1px solid #3a3228" }}>
                  {rp.cover_image_url && <div style={{ height:160, overflow:"hidden" }}><img src={rp.cover_image_url} alt={rp.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} /></div>}
                  <div style={{ padding:"18px" }}>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.15em", color:"#c9a96e", marginBottom:6, textTransform:"uppercase" }}>{rp.category}</div>
                    <h3 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:18, fontWeight:600, color:"#ede5d5", lineHeight:1.3, marginBottom:6 }}>{rp.title}</h3>
                    <div style={{ fontSize:11, color:"#a09070" }}>{rp.read_time_minutes} min read</div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}
      <footer style={{ background:"#1c1914", borderTop:"1px solid #3a3228", padding:"32px 24px", textAlign:"center" }}>
        <p style={{ fontSize:12, color:"#a09070" }}>© {new Date().getFullYear()} Atlas Travel · All rights reserved</p>
      </footer>
      <style>{`
        .article-body h1,.article-body h2,.article-body h3 { font-family:var(--font-cormorant-garamond),serif; color:#ede5d5; margin-top:2em; margin-bottom:0.6em; }
        .article-body h2 { font-size:30px; font-weight:600; border-bottom:1px solid #3a3228; padding-bottom:8px; }
        .article-body h3 { font-size:22px; font-weight:600; }
        .article-body p { margin-bottom:1.4em; }
        .article-body a { color:#c9a96e; text-decoration:underline; text-underline-offset:3px; }
        .article-body ul,.article-body ol { margin-bottom:1.4em; padding-left:24px; }
        .article-body li { margin-bottom:0.4em; }
        .article-body img { width:100%; border-radius:12px; margin:24px 0; }
        .article-body blockquote { border-left:3px solid #c9a96e; padding-left:20px; margin:24px 0; font-style:italic; color:#a09070; }
        .article-body table { width:100%; border-collapse:collapse; margin-bottom:1.4em; }
        .article-body th,.article-body td { padding:10px 14px; border:1px solid #3a3228; text-align:left; }
        .article-body th { background:#231f18; color:#c9a96e; font-size:12px; letter-spacing:0.1em; }
        .article-body strong { color:#c9a96e; }
        .article-body code { background:#231f18; padding:2px 8px; border-radius:4px; font-size:14px; color:#c9a96e; }
      `}</style>
    </div>
  );
}