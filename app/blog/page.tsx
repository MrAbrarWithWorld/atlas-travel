import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import BlogFooter from "./components/BlogFooter";
import s from "./blog.module.css";
import BlogClient from "./BlogClient";
import BlogNav from "./components/BlogNav";

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: "Atlas Travel Blog — Destination Guides, Visa Tips & Itineraries" },
  description: "Explore expert travel guides, visa tips, budget breakdowns, and hidden gems from around the world.",
  alternates: {
    canonical: "https://getatlas.ca/blog",
  },
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

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ cat?: string; q?: string; region?: string }> }) {
  const sp = await searchParams;
  const initialSearch = sp.q ? sp.q.replace(/-/g, ' ') : '';
  const initialCategory = sp.cat ? decodeURIComponent(sp.cat) : '';
  const initialRegion = sp.region ? decodeURIComponent(sp.region) : '';

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
    <div className={`${s.theme} ${s.page}`}>
      <BlogNav activePath="/blog" />
      <main>
        <header className={`${s.wrap} ${s.head}`}>
          <p className={s.kicker}>Atlas Travel Journal</p>
          <h1 className={s.title}>Travel guides you can plan with.</h1>
          <p className={s.intro}>
            Destination guides, visa notes and budget routes, written to help you decide where to go and how to plan it.
          </p>
        </header>
        <div className={s.wrap}>
          <BlogClient allPosts={allPosts} initialSearch={initialSearch} initialCategory={initialCategory} initialRegion={initialRegion} />
        </div>
      </main>
      <BlogFooter />
    </div>
  );
}
