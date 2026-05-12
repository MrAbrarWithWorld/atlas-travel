import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AtlasLogo from "../../components/AtlasLogo";
import MobileNav from "../../components/MobileNav";
import WriteButton from "../../components/WriteButton";
import { MEGA_COLS } from "../../lib/megaCols";

export const revalidate = 60;

interface UserPost {
  id: string;
  user_name: string;
  title: string;
  excerpt: string;
  content: string;
  cover_photo: string | null;
  destination: string | null;
  slug: string;
  created_at: string;
  photos: { url: string; caption?: string }[] | null;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
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
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(28,25,20,0.97)", borderBottom: "1px solid #3a3228", backdropFilter: "blur(8px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 24 }}>
          <AtlasLogo />
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 28, flex: 1 }}>
            <Link href="/blog" className="nav-link" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#ede5d5", textDecoration: "none" }}>ALL</Link>
            <div className="dest-item" style={{ position: "relative" }}>
              <button style={{ background: "none", border: "none", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#ede5d5", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: 0 }} className="nav-link">DESTINATIONS ▾</button>
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
            <Link href="/blog?q=visa" className="nav-link" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#ede5d5", textDecoration: "none" }}>TIPS & VISA</Link>
            <Link href="/community" className="nav-link" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#c9a96e", textDecoration: "none" }}>COMMUNITY ✍️</Link>
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!key) return { title: "Community Story | Atlas Travel" };

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://prffhhkemxibujjjiyhg.supabase.co",
    key
  );
  const { data: post } = await supabase
    .from("user_posts")
    .select("title,excerpt,cover_photo")
    .eq("slug", slug)
    .eq("status", "approved")
    .single();

  if (!post) return { title: "Community Story | Atlas Travel" };

  return {
    title: post.title + " | Atlas Community",
    description: post.excerpt || "A community travel story on Atlas.",
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      ...(post.cover_photo ? { images: [{ url: post.cover_photo }] } : {}),
    },
  };
}

export default async function CommunityStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!key) notFound();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://prffhhkemxibujjjiyhg.supabase.co",
    key!
  );

  const { data: post } = await supabase
    .from("user_posts")
    .select("id,user_name,title,excerpt,content,cover_photo,destination,slug,created_at,photos")
    .eq("slug", slug)
    .eq("status", "approved")
    .single();

  if (!post) notFound();

  const story = post as UserPost;

  return (
    <div style={{ background: "#1c1914", minHeight: "100vh", color: "#ede5d5", fontFamily: "var(--font-dm-sans),sans-serif" }}>
      <CommunityNav />

      {/* Cover image */}
      {story.cover_photo && (
        <div style={{ position: "relative", height: "50vh", minHeight: 320, overflow: "hidden", marginTop: 60 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={story.cover_photo} alt={story.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(28,25,20,0.9) 0%,rgba(28,25,20,0.2) 100%)" }} />
        </div>
      )}

      <div style={{ maxWidth: 780, margin: "0 auto", padding: story.cover_photo ? "48px 24px" : "120px 24px 48px" }}>
        {/* Meta */}
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          {story.destination && (
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "#c9a96e", textTransform: "uppercase" }}>{story.destination}</span>
          )}
          <span style={{ color: "#3a3228" }}>·</span>
          <span style={{ fontSize: 12, color: "#a09070" }}>by {story.user_name || "Anonymous"}</span>
          <span style={{ color: "#3a3228" }}>·</span>
          <span style={{ fontSize: 12, color: "#a09070" }}>{fmt(story.created_at)}</span>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 600, lineHeight: 1.15, color: "#ede5d5", marginBottom: 20 }}>
          {story.title}
        </h1>

        {/* Excerpt */}
        {story.excerpt && (
          <p style={{ fontSize: 18, color: "#a09070", lineHeight: 1.7, marginBottom: 32, borderLeft: "3px solid #c9a96e", paddingLeft: 16 }}>
            {story.excerpt}
          </p>
        )}

        {/* Photo gallery */}
        {story.photos && story.photos.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
            {story.photos.map((photo, i) => (
              <div key={i} style={{ width: 120, height: 90, borderRadius: 8, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.caption || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        )}

        {/* Article content */}
        <div style={{ borderTop: "1px solid #3a3228", paddingTop: 32, marginBottom: 48 }}>
          {story.content ? (
            <div
              style={{ lineHeight: 1.8, fontSize: 16, color: "#ede5d5" }}
              className="article-body"
              dangerouslySetInnerHTML={{ __html: story.content }}
            />
          ) : (
            <p style={{ color: "#a09070", fontStyle: "italic" }}>No content available.</p>
          )}
        </div>

        {/* Back button */}
        <div style={{ marginBottom: 32 }}>
          <Link
            href="/community"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", color: "#a09070", textDecoration: "none" }}
          >
            ← BACK TO COMMUNITY
          </Link>
        </div>
      </div>

      {/* Plan with Atlas CTA */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 56px" }}>
        <div style={{ background: "#231f18", border: "1px solid #3a3228", borderRadius: 12, padding: "32px", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#c9a96e", marginBottom: 12, textTransform: "uppercase" }}>✈️ Inspired by this story?</p>
          <h3 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: 28, fontWeight: 600, color: "#ede5d5", marginBottom: 12 }}>
            Plan this trip with Atlas
          </h3>
          <p style={{ fontSize: 14, color: "#a09070", lineHeight: 1.7, marginBottom: 24 }}>
            Atlas builds your full itinerary in seconds — day-by-day schedule, visa info, hotel picks, and budget estimate. Free to use.
          </p>
          <Link
            href="https://app.getatlas.ca"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "1px solid #c9a96e", borderRadius: 8, padding: "12px 28px", color: "#c9a96e", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textDecoration: "none" }}
          >
            PLAN WITH ATLAS — IT&apos;S FREE →
          </Link>
        </div>
      </div>

      <footer style={{ background: "#1c1914", borderTop: "1px solid #3a3228", padding: "32px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#a09070" }}>© {new Date().getFullYear()} Atlas Travel · All rights reserved</p>
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
        .article-body strong { color:#c9a96e; }
      `}</style>
    </div>
  );
}
