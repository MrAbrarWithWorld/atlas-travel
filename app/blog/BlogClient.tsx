'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

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

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

const DEST_CARDS = [
  {
    label: "South Asia",
    desc: "Bangladesh · Maldives · Nepal · India · Sri Lanka · Bali",
    query: "south asia",
    img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
  },
  {
    label: "East & Southeast Asia",
    desc: "Japan · Singapore · Thailand · Vietnam · South Korea",
    query: "asia",
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
  },
  {
    label: "Europe & Middle East",
    desc: "France · Italy · Spain · Dubai · Turkey · UK",
    query: "europe",
    img: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80",
  },
  {
    label: "Visa & Budget Tips",
    desc: "Visa guides · Budget routes · Travel hacks",
    query: "visa",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
  },
];

export default function BlogClient({
  allPosts,
  initialSearch = '',
  initialCategory = '',
}: {
  allPosts: Post[];
  initialSearch?: string;
  initialCategory?: string;
}) {
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'ALL');
  const [search, setSearch] = useState(initialSearch);

  // Sync state when server re-renders with new searchParams (client-side navigation)
  // useState only reads the initial value on mount — useEffect handles subsequent prop changes
  useEffect(() => {
    setSearch(initialSearch || '');
  }, [initialSearch]);

  useEffect(() => {
    setActiveCategory(initialCategory || 'ALL');
  }, [initialCategory]);

  // Strip apostrophes/special chars so "coxs-bazar" matches "Cox's Bazar", etc.
  function normalizeText(s: string) {
    return s.toLowerCase().replace(/[''''`]/g, '').replace(/\s+/g, ' ').trim();
  }

  function formatCat(cat: string) {
    if (cat === 'ALL') return 'All Articles';
    return cat.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  }

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allPosts.map(p => p.category).filter(Boolean)));
    return ['ALL', ...cats];
  }, [allPosts]);

  const filtered = useMemo(() => {
    let posts = allPosts;
    if (activeCategory !== 'ALL') {
      // Partial match: ?cat=visa matches "visa-tips", "budget-visa", etc.
      const filterLower = activeCategory.toLowerCase();
      posts = posts.filter(p => {
        const cat = (p.category ?? '').toLowerCase();
        return cat === filterLower || cat.includes(filterLower) || filterLower.includes(cat);
      });
    }
    if (search.trim()) {
      const q = normalizeText(search);
      posts = posts.filter(p =>
        normalizeText(p.title).includes(q) ||
        normalizeText(p.description ?? '').includes(q) ||
        normalizeText(p.category ?? '').includes(q)
      );
    }
    return posts;
  }, [allPosts, activeCategory, search]);

  const isDefaultView = activeCategory === 'ALL' && !search.trim();
  const featured = isDefaultView && filtered.length > 0 ? filtered[0] : null;
  const editorialPosts = isDefaultView && filtered.length > 1 ? filtered.slice(1, 5) : [];
  const gridPosts = isDefaultView ? filtered.slice(5) : filtered;
  const allFiltered = !isDefaultView ? filtered : [];

  return (
    <>
      <style>{`
        .dest-card { transition: transform 0.3s ease; }
        .dest-card:hover { transform: translateY(-4px); }
        .dest-card:hover img { transform: scale(1.06); }
        .dest-card img { transition: transform 0.5s ease; }
        .edit-row:hover .edit-img img { transform: scale(1.04); }
        .edit-img img { transition: transform 0.5s ease; }
        .edit-row:hover .edit-content { background: #252019 !important; }
        .article-card:hover { border-color: #c9a96e !important; }
        .article-card { transition: border-color 0.2s; }
        @media (max-width: 768px) {
          .dest-grid { grid-template-columns: 1fr 1fr !important; }
          .dest-card { height: 160px !important; }
          .edit-row { grid-template-columns: 1fr !important; direction: ltr !important; min-height: auto !important; }
          .edit-img { height: 240px !important; position: relative !important; }
          .edit-content { padding: 32px 24px !important; }
          .grid-3col { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Search + Filter bar */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 0" }}>
        <div style={{ position: "relative", maxWidth: 440, marginBottom: 20 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#a09070", fontSize: 14, pointerEvents: "none" }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search destinations, tips, countries..."
            style={{ width: "100%", background: "#231f18", border: "1px solid #3a3228", borderRadius: 8, padding: "10px 16px 10px 40px", color: "#ede5d5", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans),sans-serif" }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#a09070", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>✕</button>
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? "rgba(201,169,110,0.1)" : "none",
                border: activeCategory === cat ? "1px solid #c9a96e" : "1px solid #3a3228",
                borderRadius: 20,
                padding: "6px 16px",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: activeCategory === cat ? "#c9a96e" : "#a09070",
                cursor: "pointer",
                textTransform: "uppercase",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {formatCat(cat)}
            </button>
          ))}
        </div>
        {(search || activeCategory !== 'ALL') && (
          <div style={{ marginTop: 8, marginBottom: 4, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: "#a09070" }}>
              {filtered.length} article{filtered.length !== 1 ? 's' : ''} found
              {activeCategory !== 'ALL' && ` in ${formatCat(activeCategory)}`}
              {search && ` matching "${search}"`}
            </span>
            <button onClick={() => { setSearch(''); setActiveCategory('ALL'); }} style={{ background: "none", border: "none", color: "#c9a96e", fontSize: 11, cursor: "pointer", fontWeight: 600, letterSpacing: "0.06em" }}>CLEAR ✕</button>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h3 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: 28, color: "#ede5d5", marginBottom: 12 }}>No articles found</h3>
          <p style={{ fontSize: 14, color: "#a09070" }}>Try a different search term or category.</p>
          <button onClick={() => { setSearch(''); setActiveCategory('ALL'); }} style={{ marginTop: 20, background: "none", border: "1px solid #3a3228", borderRadius: 8, padding: "10px 20px", color: "#a09070", fontSize: 13, cursor: "pointer" }}>Clear filters →</button>
        </div>
      ) : isDefaultView ? (
        <>
          {/* Browse by Destination */}
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 0" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 28 }}>
              <h2 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: 32, fontWeight: 600, color: "#ede5d5" }}>
                Browse by <em style={{ fontStyle: "italic", color: "#c9a96e" }}>Destination</em>
              </h2>
            </div>
            <div className="dest-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
              {DEST_CARDS.map(card => (
                <div
                  key={card.query}
                  className="dest-card"
                  onClick={() => { setSearch(card.query); setActiveCategory('ALL'); }}
                  style={{ cursor: "pointer", position: "relative", height: 220, borderRadius: 12, overflow: "hidden" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.img} alt={card.label} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,25,20,0.92) 0%, rgba(28,25,20,0.35) 55%, rgba(28,25,20,0.1) 100%)" }} />
                  <div style={{ position: "absolute", bottom: 18, left: 18, right: 18 }}>
                    <h3 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: 20, fontWeight: 600, color: "#ede5d5", lineHeight: 1.2, marginBottom: 6 }}>{card.label}</h3>
                    <p style={{ fontSize: 10, color: "rgba(237,229,213,0.6)", lineHeight: 1.4, letterSpacing: "0.02em" }}>{card.desc}</p>
                  </div>
                  <div style={{ position: "absolute", top: 14, right: 14, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#c9a96e", textTransform: "uppercase" }}>Explore →</div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Hero */}
          {featured && (
            <div style={{ marginTop: 56 }}>
              <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ display: "inline-block", width: 32, height: 1, background: "#c9a96e" }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#c9a96e", textTransform: "uppercase" }}>Featured Story</span>
                </div>
              </div>
              <Link href={`/blog/${featured.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ position: "relative", height: "70vh", minHeight: 420, maxHeight: 680, overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={featured.cover_image_url} alt={featured.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(28,25,20,0.88) 0%, rgba(28,25,20,0.4) 55%, rgba(28,25,20,0.15) 100%)" }} />
                  <div style={{ position: "absolute", bottom: 64, left: 64, right: 64, maxWidth: 720 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "#c9a96e", marginBottom: 18, textTransform: "uppercase" }}>{featured.category}</div>
                    <h1 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: "clamp(32px,4.5vw,64px)", fontWeight: 600, lineHeight: 1.1, color: "#ede5d5", marginBottom: 18 }}>{featured.title}</h1>
                    {featured.description && <p style={{ fontSize: 15, color: "rgba(237,229,213,0.75)", lineHeight: 1.65, marginBottom: 28, maxWidth: 560 }}>{featured.description}</p>}
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "#c9a96e", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(201,169,110,0.4)", paddingBottom: 2 }}>
                      Read the story
                      <span style={{ display: "inline-block", width: 32, height: 1, background: "#c9a96e" }} />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Latest Stories — editorial alternating rows */}
          {editorialPosts.length > 0 && (
            <div>
              <div style={{ maxWidth: 1280, margin: "48px auto 0", padding: "0 24px 28px", display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: "1px solid #3a3228" }}>
                <h2 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: 32, fontWeight: 600, color: "#ede5d5" }}>
                  Latest <em style={{ fontStyle: "italic", color: "#c9a96e" }}>Stories</em>
                </h2>
                <span style={{ fontSize: 11, color: "#a09070", letterSpacing: "0.08em" }}>{allPosts.length} articles total</span>
              </div>
              {editorialPosts.map((post, i) => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
                  <article
                    className="edit-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      direction: i % 2 === 1 ? "rtl" : "ltr",
                      minHeight: 420,
                      borderBottom: "1px solid #3a3228",
                      overflow: "hidden",
                    }}
                  >
                    <div className="edit-img" style={{ position: "relative", overflow: "hidden", background: "#231f18", direction: "ltr" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.cover_image_url} alt={post.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div className="edit-content" style={{ direction: "ltr", background: "#1e1a12", padding: "56px 64px", display: "flex", flexDirection: "column", justifyContent: "center", transition: "background 0.25s" }}>
                      <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a96e", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, fontWeight: 600 }}>
                        <span style={{ display: "inline-block", width: 20, height: 1, background: "#c9a96e" }} />
                        {formatCat(post.category)}
                      </div>
                      <h2 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: "clamp(22px,2.8vw,38px)", fontWeight: 600, color: "#ede5d5", lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 16 }}>{post.title}</h2>
                      {post.description && (
                        <p style={{ fontSize: 13, color: "#a09070", lineHeight: 1.8, marginBottom: 28, maxWidth: 380 }}>{post.description}</p>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, color: "#a09070", marginBottom: 28 }}>
                        <span>{fmt(post.date_published)}</span>
                        <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#3a3228", display: "inline-block" }} />
                        <span>{post.read_time}</span>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: "#c9a96e", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 10 }}>
                        Read the story
                        <span style={{ display: "inline-block", width: 28, height: 1, background: "#c9a96e" }} />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* More Stories — card grid */}
          {gridPosts.length > 0 && (
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px 72px" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 32, paddingBottom: 20, borderBottom: "1px solid #3a3228" }}>
                <h2 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: 28, fontWeight: 600, color: "#ede5d5" }}>
                  More to <em style={{ fontStyle: "italic", color: "#c9a96e" }}>Explore</em>
                </h2>
                <span style={{ fontSize: 11, color: "#a09070" }}>{gridPosts.length} more articles</span>
              </div>
              <div className="grid-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
                {gridPosts.map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                    <article className="article-card" style={{ background: "#1e1a12", borderRadius: 10, overflow: "hidden", border: "1px solid #3a3228", height: "100%" }}>
                      {post.cover_image_url && (
                        <div style={{ height: 180, overflow: "hidden" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={post.cover_image_url} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      )}
                      <div style={{ padding: "20px 20px 24px" }}>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: "#c9a96e", marginBottom: 10, textTransform: "uppercase" }}>{formatCat(post.category)}</div>
                        <h3 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: 19, fontWeight: 600, color: "#ede5d5", lineHeight: 1.3, marginBottom: 12 }}>{post.title}</h3>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: "#a09070" }}>
                          <span>{post.read_time}</span>
                          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#3a3228", display: "inline-block" }} />
                          <span>{fmt(post.date_published)}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Filtered view */
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 72px" }}>
          <div className="grid-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {allFiltered.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                <article className="article-card" style={{ background: "#1e1a12", borderRadius: 10, overflow: "hidden", border: "1px solid #3a3228", height: "100%" }}>
                  {post.cover_image_url && (
                    <div style={{ height: 180, overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.cover_image_url} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div style={{ padding: "20px 20px 24px" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: "#c9a96e", marginBottom: 10, textTransform: "uppercase" }}>{formatCat(post.category)}</div>
                    <h3 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: 19, fontWeight: 600, color: "#ede5d5", lineHeight: 1.3, marginBottom: 12 }}>{post.title}</h3>
                    {post.description && <p style={{ fontSize: 12, color: "#a09070", lineHeight: 1.6, marginBottom: 12 }}>{post.description}</p>}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: "#a09070" }}>
                      <span>{post.read_time}</span>
                      <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#3a3228", display: "inline-block" }} />
                      <span>{fmt(post.date_published)}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
