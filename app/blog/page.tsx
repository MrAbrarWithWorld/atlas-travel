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
  const initialSearch = sp.q ? decodeURIComponent(sp.q.replace(/-/g, ' ')) : '';
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
        <BlogClient allPosts={allPosts} initialSearch={initialSearch} initialCategory={initialCategory} />
      </div>

      {/* Newsletter */}
      <div style={{ background: "#231f18", borderTop: "1px solid #3a3228", borderBottom: "1px solid #3a3228", padding: "80px 24px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: 42, fontWeight: 600, color: "#ede5d5", marginBottom: 16 }}>The Atlas Dispatch</h2>
          <p style={{ fontSize: 15, color: "#a09070", lineHeight: 1.7, marginBottom: 32 }}>Hidden gems, budget routes, and destination inspiration from across the globe — delivered to your inbox every week. No spam, just stories worth reading.</p>
          <NewsletterForm />
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

      <footer style={{ background: "#1c1914", borderTop: "1px solid #3a3228", padding: "32px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#a09070" }}>© {new Date().getFullYear()} Atlas Travel · All rights reserved</p>
      </footer>
    </div>
  );
}
