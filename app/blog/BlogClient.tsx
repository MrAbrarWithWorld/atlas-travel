'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import s from './blog.module.css';
import { BLOG_TOPICS, blogRegion, blogTopic, type BlogRegion } from '../lib/blog-taxonomy';

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

const REGIONS: BlogRegion[] = ['Europe', 'Asia', 'Bangladesh', 'Middle East & Africa', 'Americas'];

function fmt(iso: string) {
  // UTC so the server and the browser print the same month (avoids a hydration mismatch).
  return iso ? new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }) : '';
}

function normalizeText(t: string) {
  return t.toLowerCase().replace(/['’‘`]/g, '').replace(/\s+/g, ' ').trim();
}

function Meta({ post }: { post: Post }) {
  return (
    <div className={s.meta}>
      <span className={s.topic}>{blogTopic(post.category)}</span>
      {post.read_time && <span>{post.read_time}</span>}
      {post.date_published && <span>{fmt(post.date_published)}</span>}
    </div>
  );
}

function Card({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className={s.card}>
      <div className={s.cardImg}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {post.cover_image_url ? <img src={post.cover_image_url} alt="" loading="lazy" /> : null}
      </div>
      <Meta post={post} />
      <h3 className={s.cardTitle}>{post.title}</h3>
      {post.description && <p className={s.cardDesc}>{post.description}</p>}
    </Link>
  );
}

export default function BlogClient({
  allPosts,
  initialSearch = '',
  initialCategory = '',
  initialRegion = '',
}: {
  allPosts: Post[];
  initialSearch?: string;
  initialCategory?: string;
  initialRegion?: string;
}) {
  const [topic, setTopic] = useState(initialCategory || 'ALL');
  const [region, setRegion] = useState(initialRegion || 'ALL');
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => { setSearch(initialSearch || ''); }, [initialSearch]);
  useEffect(() => { setTopic(initialCategory || 'ALL'); }, [initialCategory]);
  useEffect(() => { setRegion(initialRegion || 'ALL'); }, [initialRegion]);

  const regionCounts = useMemo(() => {
    const c: Record<string, number> = {};
    allPosts.forEach((p) => { const r = blogRegion(p.slug, p.title); c[r] = (c[r] || 0) + 1; });
    return c;
  }, [allPosts]);
  const topicCounts = useMemo(() => {
    const c: Record<string, number> = {};
    allPosts.forEach((p) => { const t = blogTopic(p.category); c[t] = (c[t] || 0) + 1; });
    return c;
  }, [allPosts]);

  const filtered = useMemo(() => {
    let posts = allPosts;
    if (topic !== 'ALL') {
      const isTopic = (BLOG_TOPICS as readonly string[]).includes(topic);
      const lower = topic.toLowerCase();
      posts = posts.filter((p) => {
        if (isTopic) return blogTopic(p.category) === topic;
        // Old links like ?cat=visa still work.
        const cat = (p.category ?? '').toLowerCase();
        return cat === lower || cat.includes(lower) || lower.includes(cat);
      });
    }
    if (region !== 'ALL') posts = posts.filter((p) => blogRegion(p.slug, p.title) === region);
    if (search.trim()) {
      const q = normalizeText(search);
      posts = posts.filter((p) =>
        normalizeText(p.title).includes(q) ||
        normalizeText(p.description ?? '').includes(q) ||
        normalizeText(p.category ?? '').includes(q) ||
        normalizeText(blogRegion(p.slug, p.title)).includes(q));
    }
    return posts;
  }, [allPosts, topic, region, search]);

  const isDefault = topic === 'ALL' && region === 'ALL' && !search.trim();
  const featured = isDefault ? filtered[0] : null;
  const rest = isDefault ? filtered.slice(1) : filtered;
  const clearAll = () => { setTopic('ALL'); setRegion('ALL'); setSearch(''); };
  const topicLabel = (t: string) => ((BLOG_TOPICS as readonly string[]).includes(t) ? t : blogTopic(t));

  return (
    <>
      <div className={s.search}>
        <svg className={s.searchIcon} width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="9" cy="9" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search a city, country or tip"
          aria-label="Search the travel guides"
          type="search"
        />
        {search && <button className={s.searchClear} onClick={() => setSearch('')} aria-label="Clear search">×</button>}
      </div>

      <div className={s.filters} style={{ marginTop: 24 }}>
        <div className={s.filterRow} role="group" aria-label="Filter by region">
          <span className={s.filterLabel}>Where</span>
          <button className={s.chip} aria-pressed={region === 'ALL'} onClick={() => setRegion('ALL')}>Everywhere</button>
          {REGIONS.filter((r) => regionCounts[r]).map((r) => (
            <button key={r} className={s.chip} aria-pressed={region === r} onClick={() => setRegion(r)}>
              {r}<small>{regionCounts[r]}</small>
            </button>
          ))}
        </div>
        <div className={s.filterRow} role="group" aria-label="Filter by topic">
          <span className={s.filterLabel}>Topic</span>
          <button className={s.chip} aria-pressed={topic === 'ALL'} onClick={() => setTopic('ALL')}>All</button>
          {BLOG_TOPICS.filter((t) => topicCounts[t]).map((t) => (
            <button key={t} className={s.chip} aria-pressed={topic === t} onClick={() => setTopic(t)}>
              {t}<small>{topicCounts[t]}</small>
            </button>
          ))}
        </div>
        {!isDefault && (
          <div className={s.resultLine} aria-live="polite">
            <span>
              {filtered.length} guide{filtered.length === 1 ? '' : 's'}
              {region !== 'ALL' && ` in ${region}`}
              {topic !== 'ALL' && ` · ${topicLabel(topic)}`}
              {search && ` matching “${search}”`}
            </span>
            <button className={s.linkBtn} onClick={clearAll}>Clear filters</button>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className={s.empty}>
          <h2>No guides match that yet</h2>
          <p className={s.desc}>Try another place or clear the filters.</p>
          <p><button className={s.btnGhost} onClick={clearAll} style={{ marginTop: 16 }}>Show all guides</button></p>
        </div>
      ) : (
        <>
          {featured && (
            <Link href={`/blog/${featured.slug}`} className={s.featured}>
              <div className={s.featuredImg}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {featured.cover_image_url ? <img src={featured.cover_image_url} alt="" /> : null}
              </div>
              <div className={s.featuredBody}>
                <Meta post={featured} />
                <h2 className={s.featuredTitle}>{featured.title}</h2>
                {featured.description && <p className={s.desc}>{featured.description}</p>}
                <span className={s.readLink}>Read the guide</span>
              </div>
            </Link>
          )}

          <div className={s.sectionHead}>
            <h2 className={s.h2}>{isDefault ? 'All travel guides' : 'Results'}</h2>
            <span className={s.count}>{filtered.length} guides</span>
          </div>
          <div className={s.grid}>
            {rest.map((p) => <Card key={p.id} post={p} />)}
          </div>
        </>
      )}
    </>
  );
}
