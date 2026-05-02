'use client';

import { useState, useMemo } from 'react';
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

export default function BlogClient({ allPosts }: { allPosts: Post[] }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [search, setSearch] = useState('');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allPosts.map(p => p.category).filter(Boolean)));
    return ['ALL', ...cats];
  }, [allPosts]);

  const filtered = useMemo(() => {
    let posts = allPosts;
    if (activeCategory !== 'ALL') {
      posts = posts.filter(p => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q) ||
        (p.category ?? '').toLowerCase().includes(q)
      );
    }
    return posts;
  }, [allPosts, activeCategory, search]);

  const featured = activeCategory === 'ALL' && !search ? filtered[0] : null;
  const topPosts = featured ? filtered.slice(1, 5) : filtered.slice(0, 4);
  const restPosts = featured ? filtered.slice(5) : filtered.slice(4);

  return (
    <>
      {/* Search + Filter bar */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px 0" }}>
        {/* Search */}
        <div style={{ position:"relative", maxWidth:440, marginBottom:20 }}>
          <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#a09070", fontSize:14, pointerEvents:"none" }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search destinations, tips, countries..."
            style={{ width:"100%", background:"#231f18", border:"1px solid #3a3228", borderRadius:8, padding:"10px 16px 10px 40px", color:"#ede5d5", fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"var(--font-dm-sans),sans-serif" }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#a09070", cursor:"pointer", fontSize:16, lineHeight:1 }}>✕</button>
          )}
        </div>

        {/* Category chips */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:8 }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? "none" : "none",
                border: activeCategory === cat ? "1px solid #c9a96e" : "1px solid #3a3228",
                borderRadius:20,
                padding:"6px 16px",
                fontSize:11,
                fontWeight:600,
                letterSpacing:"0.1em",
                color: activeCategory === cat ? "#c9a96e" : "#a09070",
                cursor:"pointer",
                textTransform:"uppercase",
                transition:"all 0.15s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {(search || activeCategory !== 'ALL') && (
          <div style={{ marginTop:8, marginBottom:4, fontSize:12, color:"#a09070" }}>
            {filtered.length} article{filtered.length !== 1 ? 's' : ''} found
            {activeCategory !== 'ALL' && ` in ${activeCategory}`}
            {search && ` matching "${search}"`}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"80px 24px", textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
          <h3 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:28, color:"#ede5d5", marginBottom:12 }}>No articles found</h3>
          <p style={{ fontSize:14, color:"#a09070" }}>Try a different search term or category.</p>
          <button onClick={() => { setSearch(''); setActiveCategory('ALL'); }} style={{ marginTop:20, background:"none", border:"1px solid #3a3228", borderRadius:8, padding:"10px 20px", color:"#a09070", fontSize:13, cursor:"pointer" }}>Clear filters →</button>
        </div>
      ) : (
        <>
          {/* Featured hero */}
          {featured && (
            <div style={{ position:"relative", height:"80vh", overflow:"hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featured.cover_image_url} alt={featured.title} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(28,25,20,0.95) 0%,rgba(28,25,20,0.4) 50%,rgba(28,25,20,0.15) 100%)" }} />
              <div style={{ position:"absolute", bottom:64, left:48, right:48, maxWidth:780 }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.18em", color:"#c9a96e", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ display:"inline-block", width:32, height:1, background:"#c9a96e" }} />
                  FEATURED STORY · {featured.category?.toUpperCase()}
                </div>
                <h1 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:"clamp(36px,5vw,68px)", fontWeight:600, lineHeight:1.1, color:"#ede5d5", marginBottom:18 }}>{featured.title}</h1>
                {featured.description && <p style={{ fontSize:16, color:"#a09070", lineHeight:1.6, marginBottom:24, maxWidth:600 }}>{featured.description}</p>}
                <Link href={`/blog/${featured.slug}`} style={{ fontSize:13, fontWeight:600, letterSpacing:"0.1em", color:"#c9a96e", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:8, borderBottom:"1px solid #c9a96e", paddingBottom:2 }}>READ THE STORY →</Link>
              </div>
            </div>
          )}

          {/* Top grid */}
          {topPosts.length > 0 && (
            <div style={{ maxWidth:1280, margin:"0 auto", padding:"64px 24px 40px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:24 }}>
                {topPosts.map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration:"none" }}>
                    <article style={{ background:"#231f18", borderRadius:12, overflow:"hidden", border:"1px solid #3a3228", height:"100%" }}>
                      {post.cover_image_url && (
                        <div style={{ height:180, overflow:"hidden" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={post.cover_image_url} alt={post.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        </div>
                      )}
                      <div style={{ padding:"20px" }}>
                        <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.15em", color:"#c9a96e", marginBottom:8, textTransform:"uppercase" }}>{post.category}</div>
                        <h3 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:20, fontWeight:600, color:"#ede5d5", lineHeight:1.3, marginBottom:8 }}>{post.title}</h3>
                        <div style={{ fontSize:11, color:"#a09070", display:"flex", gap:12 }}><span>{post.read_time}</span><span>·</span><span>{fmt(post.date_published)}</span></div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Rest list */}
          {restPosts.length > 0 && (
            <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px 64px" }}>
              <h2 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:32, fontWeight:600, color:"#ede5d5", marginBottom:32, borderBottom:"1px solid #3a3228", paddingBottom:16 }}>
                All Articles <span style={{ fontSize:18, color:"#a09070", fontWeight:400 }}>{filtered.length} total</span>
              </h2>
              <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                {restPosts.map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration:"none" }}>
                    <article style={{ display:"flex", gap:20, padding:"20px 0", borderBottom:"1px solid #3a3228", alignItems:"center" }}>
                      {post.cover_image_url && (
                        <div style={{ width:100, height:72, flexShrink:0, borderRadius:8, overflow:"hidden" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={post.cover_image_url} alt={post.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        </div>
                      )}
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.15em", color:"#c9a96e", marginBottom:4, textTransform:"uppercase" }}>{post.category}</div>
                        <h3 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:18, fontWeight:600, color:"#ede5d5", lineHeight:1.3, marginBottom:4 }}>{post.title}</h3>
                        <div style={{ fontSize:11, color:"#a09070", display:"flex", gap:12 }}><span>{post.read_time}</span><span>·</span><span>{fmt(post.date_published)}</span></div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
