import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ShareButtons from "./ShareButtons";
import ReadingProgress from "./ReadingProgress";
import BackToTop from "./BackToTop";
import TableOfContents from "./TableOfContents";
import BlogNav from "../components/BlogNav";
import BlogFooter from "../components/BlogFooter";
import s from "../blog.module.css";
import { blogTopic, pickRelated } from '../../lib/blog-taxonomy';

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
    `<img src="${url}" alt="" loading="lazy" />`;

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
  if (!key) return { title: "Article" };
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://prffhhkemxibujjjiyhg.supabase.co',
    key
  );
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title,description,cover_image_url,slug")
    .eq("slug", slug)
    .single();

  if (!post) return { title: "Article not found", robots: { index: false } };

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: "https://getatlas.ca/blog/" + post.slug,
    },
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

  // Related posts: same region, then same topic, then newest (was: always the 4 newest posts).
  const { data: candidates } = await supabase
    .from("blog_posts")
    .select("id,title,slug,description,cover_image_url,category,read_time,date_published")
    .eq("is_published", true)
    .neq("slug", slug).order("date_published", { ascending: false }).limit(60);

  const relatedPosts: RelatedPost[] = pickRelated(post, (candidates ?? []) as RelatedPost[], 4);
  const highlights: string[] = post.highlights ?? [];
  const keyFactsRaw = post.key_facts ?? {};
  const keyFactsEntries: [string, string][] = Array.isArray(keyFactsRaw)
    ? keyFactsRaw.map((f: any) => [f.label || f.key || '', f.value || ''])
    : Object.entries(keyFactsRaw);
  const destination = extractDestination(post.title);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description ?? "",
    "image": post.cover_image_url ? [post.cover_image_url] : [],
    "datePublished": post.date_published ?? post.created_at ?? new Date().toISOString(),
    "dateModified": post.updated_at ?? post.date_published ?? new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Atlas Travel",
      "url": "https://getatlas.ca/blog"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Atlas Travel",
      "url": "https://getatlas.ca",
      "logo": {
        "@type": "ImageObject",
        "url": "https://getatlas.ca/icon.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://getatlas.ca/blog/${post.slug}`
    }
  };

  const topic = blogTopic(post.category);
  const dateLabel = post.date_published ? fmt(post.date_published) : '';

  return (
    <div className={`${s.theme} ${s.page}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <BlogNav />

      {post.cover_image_url && (
        <div className={s.hero}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover_image_url} alt="" />
        </div>
      )}

      <div className={s.articleLayout} style={post.cover_image_url ? undefined : { paddingTop: 104 }}>
        <aside className={s.toc} aria-label="Table of contents">
          <TableOfContents content={post.content ?? ''} />
        </aside>

        <article className={s.articleMain}>
          <p className={s.crumbs}>
            <Link href="/blog">Guides</Link> / <Link href={`/blog?cat=${encodeURIComponent(topic)}`}>{topic}</Link>
          </p>
          <h1 className={s.articleTitle}>{post.title}</h1>
          <div className={s.meta} style={{ marginBottom: 20 }}>
            {post.read_time && <span>{post.read_time}</span>}
            {dateLabel && <span>Updated {dateLabel}</span>}
            <span>By Atlas Travel</span>
          </div>

          {post.description && <p className={s.lede}>{post.description}</p>}

          {highlights.length > 0 && (
            <div className={s.pills}>
              {highlights.map((tag: string, i: number) => <span key={i} className={s.pill}>{tag}</span>)}
            </div>
          )}

          {keyFactsEntries.length > 0 && (
            <section className={s.facts} aria-label="Key facts">
              <dl className={s.factsGrid}>
                {keyFactsEntries.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{String(value)}</dd>
                  </div>
                ))}
              </dl>
              <p className={s.factsNote}>
                Visa rules depend on your passport. Check the official government website before you travel, or ask the{' '}
                <Link href="/travel" prefetch={false}>Atlas trip planner</Link> for your passport.
              </p>
            </section>
          )}

          <div className={s.shareRow}>
            <ShareButtons title={post.title} slug={post.slug} />
          </div>

          {post.content ? (
            <div className={`${s.body} article-body`} dangerouslySetInnerHTML={{ __html: injectInlinePhotos(post.content, post.inline_photos) }} />
          ) : (
            <p className={s.desc}>This guide is being written.</p>
          )}

          <section className={s.ctaBox} aria-labelledby="plan-title">
            <h2 id="plan-title">Planning a trip to {destination}?</h2>
            <p>Atlas builds a day-by-day itinerary with visa notes, places to stay and a budget estimate. Free to start.</p>
            <div className={s.ctaRow}>
              <Link href="/travel" prefetch={false} className={s.btn}>Plan my trip</Link>
              <a
                href={"https://www.getyourguide.com/s/?q=" + encodeURIComponent(destination)}
                target="_blank"
                rel="noopener noreferrer"
                className={s.btnGhost}
              >
                Find tours on GetYourGuide
              </a>
            </div>
          </section>

          <div className={s.shareRow} style={{ marginTop: 40 }}>
            <ShareButtons title={post.title} slug={post.slug} />
          </div>
        </article>
      </div>

      {relatedPosts.length > 0 && (
        <section className={`${s.wrap} ${s.related}`} aria-labelledby="more-title">
          <div className={s.sectionHead}>
            <h2 id="more-title" className={s.h2}>More guides like this</h2>
            <Link href="/blog" className={s.linkBtn}>All guides</Link>
          </div>
          <div className={s.grid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {relatedPosts.map((rp) => (
              <Link key={rp.id} href={"/blog/" + rp.slug} className={s.card}>
                <div className={s.cardImg}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {rp.cover_image_url ? <img src={rp.cover_image_url} alt="" loading="lazy" /> : null}
                </div>
                <div className={s.meta}><span className={s.topic}>{blogTopic(rp.category)}</span>{rp.read_time && <span>{rp.read_time}</span>}</div>
                <h3 className={s.cardTitle}>{rp.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      <BlogFooter />
      <BackToTop />
    </div>
  );
}
