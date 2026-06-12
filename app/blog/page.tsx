import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import type { Metadata } from "next";
import NewsletterForm from "./NewsletterForm";
import BlogClient from "./BlogClient";
import BlogNav from "./components/BlogNav";

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

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ cat?: string; q?: string }> }) {
  const sp = await searchParams;
  const initialSearch = sp.q ? sp.q.replace(/-/g, ' ') : '';
  const initialCategory = sp.cat ? decodeURIComponent(sp.cat) : '';

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
    <div style={{ background: "#1c1914", minHeight: "100vh", color: "#ede5d5", fontFamily: "var(--font-dm-sans),sans-serif" }}>
      <BlogNav activePath="/blog" />
      <div style={{ paddingTop: 60 }}>
        {/* Blog Hero */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 0", borderBottom: "1px solid #3a3228", paddingBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: "#c9a96e", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ display: "inline-block", width: 24, height: 1, background: "#c9a96e" }} />
                Atlas Travel
              </div>
              <h1 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: "clamp(40px,6vw,80px)", fontWeight: 300, color: "#ede5d5", lineHeight: 0.95, letterSpacing: "-0.02em" }}>
                The<br /><em style={{ fontStyle: "italic", color: "#c9a96e" }}>Journal</em>
              </h1>
            </div>
            <p style={{ fontSize: 13, color: "#8a8070", lineHeight: 1.8, maxWidth: 340, marginBottom: 8 }}>
              Destination guides, visa deep-dives, budget routes, and stories from every corner of the world.
            </p>
          </div>
        </div>
        <BlogClient allPosts={allPosts} initialSearch={initialSearch} initialCategory={initialCategory} />
      </div>

      {/* Newsletter */}
      <div style={{ background: "linear-gradient(135deg, #231f18 0%, #1c1914 50%, #231f18 100%)", borderTop: "1px solid #3a3228", borderBottom: "1px solid #3a3228", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
        {/* Decorative background text */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "clamp(80px,18vw,220px)", fontFamily: "var(--font-cormorant-garamond),serif", fontWeight: 600, color: "rgba(201,169,110,0.04)", letterSpacing: "-0.04em", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none" }}>
          DISPATCH
        </div>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: "#c9a96e", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <span style={{ display: "inline-block", width: 32, height: 1, background: "rgba(201,169,110,0.4)" }} />
            Weekly Newsletter
            <span style={{ display: "inline-block", width: 32, height: 1, background: "rgba(201,169,110,0.4)" }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: "clamp(36px,5vw,56px)", fontWeight: 300, color: "#ede5d5", marginBottom: 8, lineHeight: 1.1 }}>
            The Atlas <em style={{ fontStyle: "italic", color: "#c9a96e" }}>Dispatch</em>
          </h2>
          <p style={{ fontSize: 14, color: "#8a8070", lineHeight: 1.8, marginBottom: 40, maxWidth: 460, margin: "16px auto 40px" }}>
            Hidden gems, budget routes, and destination inspiration — delivered to your inbox every week. No spam, just stories worth reading.
          </p>
          <NewsletterForm />
          <p style={{ fontSize: 11, color: "#5a5248", marginTop: 16 }}>Join 2,000+ travellers already subscribed · Unsubscribe anytime</p>
        </div>
      </div>

      {/* CTA banner */}
      <div style={{ position: "relative", height: 420, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&h=600&fit=crop&q=80" alt="Discover the world" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,rgba(28,25,20,0.75) 0%,rgba(28,25,20,0.3) 60%,rgba(28,25,20,0.1) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", paddingLeft: 64 }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 600, color: "#ede5d5", lineHeight: 1.15, marginBottom: 24 }}>Discover the world<br /><em>with us.</em></h2>
            <Link href="https://app.getatlas.ca" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "1px solid #c9a96e", borderRadius: 8, padding: "12px 24px", color: "#c9a96e", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textDecoration: "none" }}>Start Planning Free →</Link>
          </div>
        </div>
      </div>

      <footer style={{ background: "#17140f", borderTop: "1px solid #2a2520", padding: "48px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid #2a2520" }}>
            <div>
              <div style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: 24, fontWeight: 300, color: "#c9a96e", letterSpacing: "0.1em" }}>ATLAS</div>
              <div style={{ fontSize: 10, color: "#5a5248", letterSpacing: "0.14em", marginTop: 2 }}>AI TRAVEL PLANNER</div>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <Link href="/" style={{ fontSize: 12, color: "#8a8070", textDecoration: "none", letterSpacing: "0.06em" }}>Home</Link>
              <Link href="/blog" style={{ fontSize: 12, color: "#c9a96e", textDecoration: "none", letterSpacing: "0.06em" }}>Blog</Link>
              <Link href="/privacy" style={{ fontSize: 12, color: "#8a8070", textDecoration: "none", letterSpacing: "0.06em" }}>Privacy</Link>
              <Link href="/terms" style={{ fontSize: 12, color: "#8a8070", textDecoration: "none", letterSpacing: "0.06em" }}>Terms</Link>
              <a href="https://app.getatlas.ca" style={{ fontSize: 12, color: "#8a8070", textDecoration: "none", letterSpacing: "0.06em" }}>App</a>
            </div>
          </div>
          <p style={{ fontSize: 11, color: "#3a3228", textAlign: "center" }}>© {new Date().getFullYear()} Atlas Travel Inc. · All rights reserved · getatlas.ca</p>
        </div>
      </footer>
    </div>
  );
}
