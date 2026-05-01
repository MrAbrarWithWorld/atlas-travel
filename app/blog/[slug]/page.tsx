import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/lib/types";
import ReadingProgress from "./ReadingProgress";
import TableOfContents from "./TableOfContents";
import BackToTop from "./BackToTop";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !data) return null;
  return data as BlogPost;
}

async function getAllPublishedSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true);
  return (data ?? []).map((r) => r.slug);
}

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const url = `https://getatlas.ca/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: [
      post.category,
      ...(post.related_destinations ?? []),
      "travel guide",
      "Atlas travel",
    ],
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date_published,
      images: post.cover_image_url
        ? [{ url: post.cover_image_url, width: 1200, height: 630, alt: post.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
  return CATEGORY_COLORS[category?.toLowerCase()] ?? CATEGORY_COLORS.default;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.cover_image_url ?? undefined,
    datePublished: post.date_published,
    publisher: {
      "@type": "Organization",
      name: "Atlas Travel",
      url: "https://getatlas.ca",
    },
    url: `https://getatlas.ca/blog/${post.slug}`,
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Reading progress bar */}
      <ReadingProgress />

      <div className="min-h-screen bg-atlas-bg">
        {/* Navigation */}
        <nav className="border-b border-atlas-border/50 px-6 py-4 sticky top-0 z-40 bg-atlas-bg/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-serif text-atlas-gold-light font-semibold tracking-wide">
                Atlas
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/blog"
                className="text-atlas-text-muted hover:text-atlas-text transition-colors text-sm font-medium"
              >
                ← All Articles
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

        {/* Hero */}
        <header className="relative">
          {post.cover_image_url ? (
            <div className="relative h-[500px] md:h-[600px]">
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-atlas-bg via-atlas-bg/50 to-atlas-bg/10" />
            </div>
          ) : (
            <div className="h-64 md:h-80 flex items-center justify-center bg-gradient-to-br from-atlas-bg-card to-atlas-bg text-9xl">
              {post.hero_emoji || "✈️"}
            </div>
          )}

          {/* Hero content overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${getCategoryColor(post.category)}`}
                >
                  {post.category}
                </span>
                <span className="text-atlas-text-muted text-sm">
                  {formatDate(post.date_published)}
                </span>
                <span className="text-atlas-text-muted text-sm">· {post.read_time}</span>
              </div>

              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-atlas-text font-semibold leading-tight">
                {post.hero_emoji && (
                  <span className="mr-3">{post.hero_emoji}</span>
                )}
                {post.title}
              </h1>

              {post.description && (
                <p className="mt-4 text-atlas-text-muted text-lg max-w-2xl leading-relaxed">
                  {post.description}
                </p>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex gap-12 relative">
            {/* Main content */}
            <article className="flex-1 min-w-0 max-w-3xl" id="article-content">

              {/* Key facts */}
              {post.key_facts && post.key_facts.length > 0 && (
                <div className="mb-10 p-6 rounded-2xl border border-atlas-border bg-atlas-bg-card">
                  <h2 className="font-serif text-xl text-atlas-gold-light font-semibold mb-4">
                    Quick Facts
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {post.key_facts.map((fact, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <span className="text-atlas-text-muted text-xs uppercase tracking-wider font-semibold">
                          {fact.icon && <span className="mr-1">{fact.icon}</span>}
                          {fact.label}
                        </span>
                        <span className="text-atlas-text font-medium text-sm">
                          {fact.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights */}
              {post.highlights && post.highlights.length > 0 && (
                <div className="mb-10 p-6 rounded-2xl border border-atlas-gold/20 bg-gradient-to-br from-atlas-gold/5 to-transparent">
                  <h2 className="font-serif text-xl text-atlas-gold-light font-semibold mb-4">
                    ✨ Highlights
                  </h2>
                  <ul className="space-y-2">
                    {post.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-3 text-atlas-text text-sm">
                        <span className="text-atlas-gold mt-0.5 flex-shrink-0">◆</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Blog content */}
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Related destinations */}
              {post.related_destinations && post.related_destinations.length > 0 && (
                <div className="mt-12 pt-8 border-t border-atlas-border">
                  <h3 className="font-serif text-xl text-atlas-gold-light font-semibold mb-4">
                    Related Destinations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.related_destinations.map((dest) => (
                      <span
                        key={dest}
                        className="px-4 py-2 rounded-full border border-atlas-border bg-atlas-bg-card text-atlas-text-muted text-sm hover:border-atlas-gold/40 hover:text-atlas-gold transition-colors cursor-default"
                      >
                        📍 {dest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="mt-12 p-8 rounded-2xl border border-atlas-gold/30 bg-gradient-to-br from-atlas-gold/10 to-atlas-bg-card text-center">
                <p className="font-serif text-2xl text-atlas-gold-light font-semibold mb-2">
                  Ready to plan your trip?
                </p>
                <p className="text-atlas-text-muted text-sm mb-6">
                  Let Atlas AI build you a personalized itinerary in minutes.
                </p>
                <Link
                  href="https://app.getatlas.ca"
                  className="inline-block px-8 py-3 rounded-full bg-atlas-gold text-atlas-bg font-semibold hover:bg-atlas-gold-light transition-colors"
                >
                  Start Planning →
                </Link>
              </div>

              {/* Back to blog */}
              <div className="mt-10 text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-atlas-text-muted hover:text-atlas-gold transition-colors text-sm"
                >
                  ← Back to all articles
                </Link>
              </div>
            </article>

            {/* Desktop TOC Sidebar */}
            <aside className="hidden xl:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <TableOfContents content={post.content} />
              </div>
            </aside>
          </div>
        </div>

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

        {/* Back to top button */}
        <BackToTop />
      </div>
    </>
  );
}
