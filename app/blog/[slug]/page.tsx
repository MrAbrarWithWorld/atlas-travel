import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ShareButtons from "./ShareButtons";
import ReadingProgress from "./ReadingProgress";
import BackToTop from "./BackToTop";
import TableOfContents from "./TableOfContents";
import BlogNav from "../components/BlogNav";
import NewsletterForm from "../NewsletterForm";

export const revalidate = 60;

interface RelatedPost {
  id: string; title: string; slug: string; description: string;
  cover_image_url: string; category: string; read_time: string; date_published: string;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function extractDestination(title: string): string {
  const m = title.match(/^(.+?)\s+(?:Travel Guide|Guide)/i);
  return m ? m[1].replace(/[:\-()"]/g, '').trim() : title.split(' ')[0];
}

function injectInlinePhotos(html: string, photos: string[] | null | undefined): string {
  if (!html) return html;
  const validPhotos = Array.isArray(photos)
    ? photos.filter((url) => typeof url === "string" && url.trim() !== "")
    : [];
  if (validPhotos.length === 0) return html;

  const makeImgTag = (url: string) =>
    `<div style="margin:24px 0;"><img src="${url}" alt="" style="width:100%;border-radius:10px;margin:0;" /></div>`;

  // Mode 1: marker mode — replace [photo-1], [photo-2], ... [photo-5]
  const hasMarkers = /\[photo-[1-5]\]/.test(html);
  if (hasMarkers) {
    return html.replace(/\[photo-([1-5])\]/g, (_match: string, num: string) => {
      const idx = parseInt(num, 10) - 1;
      if (idx >= 0 && idx < validPhotos.length) {
        return makeImgTag(validPhotos[idx]);
      }
      return "";
    });
  }

  // Mode 2: auto-distribute after every Nth </h2>
  const h2Matches = html.match(/<\/h2>/gi);
  const h2Count = h2Matches ? h2Matches.length : 0;

  if (h2Count === 0) {
    // No H2s — prepend all photos at the top
    return validPhotos.map(makeImgTag).join("") + html;
  }

  const photoCount = validPhotos.length;
  const n = Math.floor(h2Count / photoCount) || 1;

  let photoIndex = 0;
  let h2Seen = 0;
  return html.replace(/<\/h2>/gi, (match: string) => {
    h2Seen++;
    if (photoIndex < photoCount && h2Seen % n === 0) {
      const imgTag = makeImgTag(validPhotos[photoIndex]);
      photoIndex++;
      return match + imgTag;
    }
    return match;
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!key) return { title: "Article | Atlas Travel" };
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://prffhhkemxibujjjiyhg.supabase.co',
    key
  );
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title,description,cover_image_url,slug")
    .eq("slug", slug)
    .single();

  if (!post) return { title: "Article | Atlas Travel" };

  return {
    title: post.title + " | Atlas Travel",
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [{ url: post.cover_image_url, width: 1200, height: 630 }],
      type: "article",
      url: "https://getatlas.ca/blog/" + post.slug,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.cover_image_url],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) {
    notFound();
  }
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);

  const { data: post } = await supabase
    .from("blog_posts").select("*").eq("slug", slug).eq("is_published", true).single();

  if (!post) notFound();

  const { data: related } = await supabase
    .from("blog_posts")
    .select("id,title,slug,description,cover_image_url,category,read_time,date_published")
    .eq("is_published", true)
    .neq("slug", slug).order("date_published", { ascending: false }).limit(4);

  const relatedPosts: RelatedPost[] = related ?? [];
  const highlights: string[] = post.highlights ?? [];
  const keyFactsRaw = post.key_facts ?? {};
  const keyFactsEntries: [string, string][] = Array.isArray(keyFactsRaw)
    ? keyFactsRaw.map((f: any) => [f.label || f.key || '', f.value || ''])
    : Object.entries(keyFactsRaw);
  const destination = extractDestination(post.title);

  return (
    <div style={{ background: "#1c1914", minHeight: "100vh", color: "#ede5d5", fontFamily: "var(--font-dm-sans),sans-serif" }}>
      <ReadingProgress />
      <BlogNav extraStyles=".share-btn:hover { border-color: #c9a96e !important; color: #c9a96e !important; } .share-btn { transition: all 0.2s; } @media (min-width: 1100px) { .toc-sidebar { display: block !important; } }" />

      {/* Hero */}
      {post.cover_image_url && (
        <div style={{ position: "relative", height: "60vh", minHeight: 380, overflow: "hidden", marginTop: 60 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover_image_url} alt={post.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(28,25,20,0.9) 0%,rgba(28,25,20,0.2) 100%)" }} />
        </div>
      )}

      {/* Article layout: TOC sidebar + content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px", display: "flex", gap: 56, alignItems: "flex-start" }}>

        {/* TOC sidebar — hidden on mobile, shown on wide screens via CSS */}
        <div className="toc-sidebar" style={{ width: 200, flexShrink: 0, display: "none" }}>
          <TableOfContents content={post.content ?? ''} />
        </div>

        {/* Main article content */}
        <div style={{ flex: 1, minWidth: 0, maxWidth: 780 }}>
          {/* Meta */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "#c9a96e", textTransform: "uppercase" }}>{post.category}</span>
            <span style={{ color: "#3a3228" }}>·</span>
            <span style={{ fontSize: 12, color: "#a09070" }}>{post.read_time}</span>
            <span style={{ color: "#3a3228" }}>·</span>
            <span style={{ fontSize: 12, color: "#a09070" }}>{fmt(post.date_published)}</span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 600, lineHeight: 1.15, color: "#ede5d5", marginBottom: 20 }}>{post.title}</h1>

          {/* Highlights pills */}
          {highlights.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
              {highlights.map((tag: string, i: number) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 14px", background: "#231f18", border: "1px solid #3a3228", borderRadius: 20, fontSize: 12, color: "#a09070", fontWeight: 500 }}>{tag}</span>
              ))}
            </div>
          )}

          {/* Key facts card */}
          {keyFactsEntries.length > 0 && (
            <div style={{ background: "#231f18", border: "1px solid #3a3228", borderRadius: 12, padding: "24px", marginBottom: 28 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "18px 24px" }}>
                {keyFactsEntries.map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#a09070", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 14, color: "#ede5d5", fontWeight: 500 }}>{String(value)}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #3a3228", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <p style={{ fontSize: 12, color: "#a09070", margin: 0, lineHeight: 1.6 }}>
                  Visa rules vary by passport. The info above is a general overview — requirements differ by nationality.
                  Use{" "}<Link href="https://app.getatlas.ca" style={{ color: "#c9a96e", textDecoration: "underline" }}>Atlas AI</Link>{" "}to get accurate visa rules for your specific passport.
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          {post.description && (
            <p style={{ fontSize: 18, color: "#a09070", lineHeight: 1.7, marginBottom: 24, borderLeft: "3px solid #c9a96e", paddingLeft: 16 }}>{post.description}</p>
          )}

          {/* Share (top) */}
          <div style={{ marginBottom: 40, paddingBottom: 32, borderBottom: "1px solid #3a3228" }}>
            <ShareButtons title={post.title} slug={post.slug} />
          </div>

          {/* Article body */}
          {post.content ? (
            <div style={{ lineHeight: 1.8, fontSize: 16, color: "#ede5d5" }} className="article-body" dangerouslySetInnerHTML={{ __html: injectInlinePhotos(post.content, post.inline_photos) }} />
          ) : (
            <p style={{ color: "#a09070", fontStyle: "italic" }}>Content coming soon.</p>
          )}

          {/* Share (bottom) */}
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid #3a3228" }}>
            <p style={{ fontSize: 13, color: "#a09070", marginBottom: 16 }}>Enjoyed this guide? Share it with a fellow traveller:</p>
            <ShareButtons title={post.title} slug={post.slug} />
          </div>

          {/* Back link */}
          <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #3a3228" }}>
            <Link href="/blog" className="nav-link" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", color: "#a09070", textDecoration: "none" }}>← BACK TO ALL ARTICLES</Link>
          </div>
        </div>
      </div>

      {/* Plan with Atlas CTA */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 28px" }}>
        <div style={{ background: "#231f18", border: "1px solid #3a3228", borderRadius: 12, padding: "32px", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#c9a96e", marginBottom: 12, textTransform: "uppercase" }}>✈️ Plan your trip</p>
          <h3 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: 28, fontWeight: 600, color: "#ede5d5", marginBottom: 12 }}>Ready to plan your trip to {destination}?</h3>
          <p style={{ fontSize: 14, color: "#a09070", lineHeight: 1.7, marginBottom: 24 }}>Atlas builds your full itinerary in seconds — day-by-day schedule, visa info, hotel picks, and budget estimate. Free to use.</p>
          <Link href="https://app.getatlas.ca" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "1px solid #c9a96e", borderRadius: 8, padding: "12px 28px", color: "#c9a96e", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textDecoration: "none" }}>PLAN WITH ATLAS — IT&apos;S FREE →</Link>
        </div>
      </div>

      {/* GetYourGuide */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 28px" }}>
        <div style={{ background: "#231f18", border: "1px solid #3a3228", borderRadius: 12, padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 18 }}>📍</span>
            <h3 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: 22, fontWeight: 600, color: "#ede5d5", margin: 0 }}>Book Tours & Activities</h3>
          </div>
          <p style={{ fontSize: 14, color: "#a09070", lineHeight: 1.7, marginBottom: 20 }}>Skip the queue and book the best experiences in {destination} — guided tours, day trips, transfers, and more.</p>
          <a href={"https://www.getyourguide.com/s/?q=" + encodeURIComponent(destination)} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", padding: "10px 20px", background: "none", border: "1px solid #3a3228", borderRadius: 8, color: "#ede5d5", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textDecoration: "none" }}>BROWSE ACTIVITIES ON GETYOURGUIDE →</a>
        </div>
      </div>

      {/* Newsletter */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 48px" }}>
        <div style={{ background: "#231f18", border: "1px solid #3a3228", borderRadius: 12, padding: "32px", textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 12 }}>✉️</div>
          <h3 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: 24, fontWeight: 600, color: "#ede5d5", marginBottom: 10 }}>Discover the world — one destination at a time</h3>
          <p style={{ fontSize: 14, color: "#a09070", lineHeight: 1.7, marginBottom: 24 }}>Hidden gems, budget routes, and travel inspiration from across the globe — straight to your inbox. No spam, unsubscribe anytime.</p>
          <NewsletterForm />
        </div>
      </div>

      {/* PLAN A TRIP quick links */}
      {relatedPosts.length > 0 && (
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 56px" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", color: "#a09070", textTransform: "uppercase", marginBottom: 12 }}>PLAN A TRIP</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {relatedPosts.map(rp => {
              const dest = extractDestination( rp.title);
              return (
                <Link key={rp.slug} href="https://app.getatlas.ca" style={{ display: "inline-flex", alignItems: "center", padding: "8px 16px", background: "#231f18", border: "1px solid #3a3228", borderRadius: 20, fontSize: 12, color: "#a09070", textDecoration: "none", fontWeight: 500 }}>Plan trip to {dest}</Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Comment form */}
      <div style={{ background: "#231f18", borderTop: "1px solid #3a3228", borderBottom: "1px solid #3a3228", padding: "56px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <h3 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: 28, fontWeight: 600, color: "#ede5d5", marginBottom: 8 }}>Join the conversation</h3>
          <p style={{ fontSize: 14, color: "#a09070", marginBottom: 28 }}>Have a tip, a question, or visited this destination? Share your experience below.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <input type="text" placeholder="Your name" style={{ background: "#1c1914", border: "1px solid #3a3228", borderRadius: 8, padding: "12px 16px", color: "#ede5d5", fontSize: 14, outline: "none", fontFamily: "var(--font-dm-sans),sans-serif" }} />
              <input type="email" placeholder="Email (not published)" style={{ background: "#1c1914", border: "1px solid #3a3228", borderRadius: 8, padding: "12px 16px", color: "#ede5d5", fontSize: 14, outline: "none", fontFamily: "var(--font-dm-sans),sans-serif" }} />
            </div>
            <textarea placeholder="Your comment or tip..." rows={4} style={{ background: "#1c1914", border: "1px solid #3a3228", borderRadius: 8, padding: "12px 16px", color: "#ede5d5", fontSize: 14, outline: "none", resize: "vertical", fontFamily: "var(--font-dm-sans),sans-serif" }} />
            <div>
              <button style={{ background: "none", border: "1px solid #c9a96e", borderRadius: 8, padding: "12px 24px", color: "#c9a96e", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", cursor: "pointer" }}>Post Comment →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px" }}>
          <h2 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: 32, fontWeight: 600, color: "#ede5d5", marginBottom: 32 }}>More from Atlas</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 24 }}>
            {relatedPosts.map((rp) => (
              <Link key={rp.id} href={"/blog/" + rp.slug} style={{ textDecoration: "none" }}>
                <article style={{ background: "#231f18", borderRadius: 12, overflow: "hidden", border: "1px solid #3a3228" }}>
                  {rp.cover_image_url && (
                    <div style={{ height: 160, overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={rp.cover_image_url} alt={rp.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div style={{ padding: "18px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#c9a96e", marginBottom: 6, textTransform: "uppercase" }}>{rp.category}</div>
                    <h3 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: 18, fontWeight: 600, color: "#ede5d5", lineHeight: 1.3, marginBottom: 6 }}>{rp.title}</h3>
                    <div style={{ fontSize: 11, color: "#a09070" }}>{rp.read_time}</div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}

      <footer style={{ background: "#1c1914", borderTop: "1px solid #3a3228", padding: "32px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#a09070" }}>© {new Date().getFullYear()} Atlas Travel · All rights reserved</p>
      </footer>

      <style>{`
        .article-body h1,.article-body h2,.article-body h3 { font-family:var(--font-cormorant-garamond),serif; color:#ede5d5; margin-top:2rem; margin-bottom:0.6em; }
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

      <BackToTop />
    </div>
  );
}
