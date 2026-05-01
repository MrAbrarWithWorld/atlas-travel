import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/lib/types";

export const metadata: Metadata = {
  title: "Travel Blog",
  description:
    "Discover travel guides, destination insights, and expert tips from Atlas — your AI-powered travel companion.",
  openGraph: {
    title: "Travel Blog | Atlas",
    description:
      "Discover travel guides, destination insights, and expert tips from Atlas.",
    url: "https://getatlas.ca/blog",
  },
};

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "slug, title, description, category, date_published, read_time, hero_emoji, cover_image_url, highlights, related_destinations, is_published"
    )
    .eq("is_published", true)
    .order("date_published", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }

  return data as BlogPost[];
}

const CATEGORY_COLORS: Record<string, string> = {
  "destination guide": "bg-blue-900/40 text-blue-300 border-blue-700/40",
  "travel tips": "bg-green-900/40 text-green-300 border-green-700/40",
  "food & culture": "bg-orange-900/40 text-orange-300 border-orange-700/40",
  adventure: "bg-purple-900/40 text-purple-300 border-purple-700/40",
  budget: "bg-yellow-900/40 text-yellow-300 border-yellow-700/40",
  default: "bg-atlas-bg-card text-atlas-text-muted border-atlas-border",
};

function getCategoryColor(category: string): string {
  const key = category?.toLowerCase() ?? "";
  return CATEGORY_COLORS[key] ?? CATEGORY_COLORS.default;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogListingPage() {
  const posts = await getBlogPosts();

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen bg-atlas-bg">
      {/* Navigation */}
      <nav className="border-b border-atlas-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-serif text-atlas-gold-light font-semibold tracking-wide">
              Atlas
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/blog"
              className="text-atlas-text-muted hover:text-atlas-text transition-colors text-sm font-medium"
            >
              Blog
            </Link>
            <Link
              href="https://app.getatlas.ca"
              className="px-4 py-2 rounded-full bg-atlas-gold text-atlas-bg text-sm font-semibold hover:bg-atlas-gold-light transition-colors"
            >
              Plan a Trip
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-atlas-gold text-sm font-semibold tracking-widest uppercase mb-4">
            Atlas Travel Blog
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-atlas-text font-light leading-tight mb-6">
            Stories from the Road
          </h1>
          <p className="text-atlas-text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Destination guides, travel tips, and inspiration to fuel your next
            adventure — crafted by our AI travel experts.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-24 text-atlas-text-muted">
            <div className="text-6xl mb-4">✈️</div>
            <p className="text-xl">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="group block mb-16">
                <article className="relative rounded-2xl overflow-hidden border border-atlas-border bg-atlas-bg-card hover:border-atlas-gold/40 transition-all duration-300 hover:shadow-2xl hover:shadow-atlas-gold/5">
                  {featured.cover_image_url ? (
                    <div className="relative h-[420px] w-full">
                      <Image
                        src={featured.cover_image_url}
                        alt={featured.title}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-atlas-bg via-atlas-bg/60 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center bg-gradient-to-br from-atlas-bg-card to-atlas-bg text-8xl">
                      {featured.hero_emoji || "✈️"}
                    </div>
                  )}

                  <div className="p-8 md:p-10">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${getCategoryColor(featured.category)}`}
                      >
                        {featured.category}
                      </span>
                      <span className="text-atlas-text-muted text-sm">
                        {formatDate(featured.date_published)}
                      </span>
                      <span className="text-atlas-text-muted text-sm">
                        · {featured.read_time}
                      </span>
                      <span className="ml-auto px-3 py-1 rounded-full bg-atlas-gold/10 text-atlas-gold text-xs font-semibold border border-atlas-gold/20">
                        Featured
                      </span>
                    </div>

                    <h2 className="font-serif text-3xl md:text-4xl text-atlas-text font-semibold mb-4 group-hover:text-atlas-gold-light transition-colors leading-tight">
                      {featured.hero_emoji && (
                        <span className="mr-2">{featured.hero_emoji}</span>
                      )}
                      {featured.title}
                    </h2>

                    <p className="text-atlas-text-muted text-base leading-relaxed max-w-3xl mb-6">
                      {featured.description}
                    </p>

                    <span className="inline-flex items-center gap-2 text-atlas-gold text-sm font-semibold group-hover:gap-3 transition-all">
                      Read Article
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </article>
              </Link>
            )}

            {/* Grid of remaining posts */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block"
                  >
                    <article className="h-full rounded-2xl overflow-hidden border border-atlas-border bg-atlas-bg-card hover:border-atlas-gold/40 transition-all duration-300 hover:shadow-xl hover:shadow-atlas-gold/5 hover:-translate-y-1 flex flex-col">
                      {/* Card image or emoji header */}
                      {post.cover_image_url ? (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={post.cover_image_url}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-atlas-bg-card/80 to-transparent" />
                        </div>
                      ) : (
                        <div className="h-32 flex items-center justify-center bg-gradient-to-br from-atlas-bg-hover to-atlas-bg-card text-5xl">
                          {post.hero_emoji || "✈️"}
                        </div>
                      )}

                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider ${getCategoryColor(post.category)}`}
                          >
                            {post.category}
                          </span>
                          <span className="text-atlas-text-muted text-xs ml-auto">
                            {post.read_time}
                          </span>
                        </div>

                        <h2 className="font-serif text-xl text-atlas-text font-semibold mb-2 group-hover:text-atlas-gold-light transition-colors leading-snug">
                          {post.title}
                        </h2>

                        <p className="text-atlas-text-muted text-sm leading-relaxed flex-1 mb-4">
                          {post.description?.slice(0, 120)}
                          {(post.description?.length ?? 0) > 120 ? "…" : ""}
                        </p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-atlas-border/50">
                          <span className="text-atlas-text-muted text-xs">
                            {formatDate(post.date_published)}
                          </span>
                          <span className="text-atlas-gold text-xs font-semibold group-hover:translate-x-1 transition-transform inline-block">
                            Read →
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-atlas-border/50 mt-24 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-serif text-xl text-atlas-gold-light">Atlas</span>
          <p className="text-atlas-text-muted text-sm">
            © {new Date().getFullYear()} Atlas Travel. All rights reserved.
          </p>
          <Link
            href="https://app.getatlas.ca"
            className="text-atlas-gold text-sm hover:text-atlas-gold-light transition-colors font-medium"
          >
            Plan your trip →
          </Link>
        </div>
      </footer>
    </div>
  );
}
