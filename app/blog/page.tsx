import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/lib/types";

export const metadata: Metadata = {
  title: "Travel Blog — Guides, Visa Tips & Destination Deep-Dives | ATLAS",
  description: "Destination guides, visa tips, budget breakdowns, and destination deep-dives.",
  openGraph: {
    title: "Travel Blog | Atlas",
    description: "Discover travel guides, destination insights, and expert tips.",
    url: "https://getatlas.ca/blog",
  },
};

export const revalidate = 60;

async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, title, description, category, date_published, read_time, hero_emoji, cover_image_url, is_published")
    .eq("is_published", true)
    .order("date_published", { ascending: false });
  if (error) { console.error("Error fetching blog posts:", error); return []; }
  return data as BlogPost[];
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-CA", { month: "long", year: "numeric" });
}

function catLabel(cat: string): string {
  const map: Record<string, string> = {
    "destination guides": "Destination Guides",
    "destination guide": "Destination Guide",
    "travel tips": "Travel Tips",
    "visa guides": "Visa Guides",
    "budget travel": "Budget Travel",
    "food & culture": "Food & Culture",
    "adventure travel": "Adventure Travel",
    "travel planning": "Travel Planning",
    "community stories": "Community Stories",
    "americas": "Americas",
    "europe": "Europe",
    "asia": "Asia",
    "middle east": "Middle East",
    "africa": "Africa",
    "oceania": "Oceania",
  };
  return map[cat?.toLowerCase()] ?? cat ?? "Article";
}

const MEGA_COLS = [
  { icon: "🌏", name: "Asia", links: [["🇧🇩 Bangladesh","bangladesh"],["🇲🇻 Maldives","maldives"],["🇳🇵 Nepal","nepal"],["🇯🇵 Japan","japan"],["🇮🇩 Bali","bali"],["🇸🇬 Singapore","singapore"],["🇹🇭 Thailand","thailand"]] },
  { icon: "🌍", name: "Europe", links: [["🇫🇷 France","france"],["🇮🇹 Italy","italy"],["🇪🇸 Spain","spain"],["🇬🇧 UK","uk"],["🇳🇱 Netherlands","netherlands"]] },
  { icon: "🌙", name: "Middle East", links: [["🇦🇪 Dubai","dubai"],["🇹🇷 Turkey","turkey"],["🇯🇴 Jordan","jordan"],["🇶🇦 Qatar","qatar"]] },
  { icon: "🌎", name: "Americas", links: [["🇨🇦 Canada","canada"],["🇺🇸 New York","new-york"],["🇲🇽 Mexico","mexico"],["🇧🇷 Brazil","brazil"]] },
  { icon: "🌍", name: "Africa", links: [["🇲🇦 Morocco","morocco"],["🇪🇬 Egypt","egypt"],["🇿🇦 South Africa","south-africa"],["🇰🇪 Kenya","kenya"]] },
  { icon: "🌏", name: "Oceania", links: [["🇦🇺 Australia","australia"],["🇳🇿 New Zealand","new-zealand"],["🇫🇯 Fiji","fiji"]] },
];

export default async function BlogListingPage() {
  const posts = await getBlogPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div style={{ minHeight: "100vh", background: "#1c1914", color: "#ede5d5", fontFamily: "DM Sans, sans-serif" }}>
      <style>{`
        .mega-wrap { display: none; }
        .dest-item:hover .mega-wrap { display: grid; }
        .blog-card:hover { border-color: rgba(201,169,110,0.4) !important; }
        @media (max-width: 900px) { .nav-center { display: none !important; } }
        @media (max-width: 900px) { .hero-text { padding: 2rem !important; } }
        @media (max-width: 768px) { .grid-2col { grid-template-columns: 1fr !important; } }
        @media (max-width: 768px) { .grid-4col { grid-template-columns: 1fr 1fr !important; } }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "#1c1914", borderBottom: "1px solid #3a3228", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "5px", textDecoration: "none" }}>
          <span style={{ color: "#c9a96e", fontSize: "8px" }}>●</span>
          <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.3rem", color: "#e8c994", fontWeight: 500, letterSpacing: "0.05em" }}>Atlas</span>
        </Link>

        <div className="nav-center" style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Link href="/blog" style={{ padding: "0 1rem", height: "56px", display: "flex", alignItems: "center", color: "#ede5d5", textDecoration: "none", fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>All</Link>

          <div className="dest-item" style={{ position: "relative", height: "56px", display: "flex", alignItems: "center" }}>
            <button style={{ padding: "0 1rem", height: "56px", background: "none", border: "none", color: "#ede5d5", cursor: "pointer", fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}>
              Destinations <span style={{ fontSize: "0.55rem", opacity: 0.7 }}>▾</span>
            </button>
            <div className="mega-wrap" style={{ position: "absolute", top: "56px", left: "50%", transform: "translateX(-50%)", background: "#231f18", border: "1px solid #3a3228", borderRadius: "8px", padding: "1.5rem", gridTemplateColumns: "repeat(6, 1fr)", gap: "0 1.5rem", minWidth: "780px", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", zIndex: 200 }}>
              {MEGA_COLS.map(col => (
                <div key={col.name}>
                  <div style={{ color: "#c9a96e", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.6rem", whiteSpace: "nowrap" }}>{col.icon} {col.name}</div>
                  {col.links.map(([label, slug]) => (
                    <Link key={slug} href={`/blog?destination=${slug}`} style={{ display: "block", color: "#a09070", fontSize: "0.75rem", padding: "0.15rem 0", textDecoration: "none", whiteSpace: "nowrap" }}>{label}</Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <Link href="/blog?category=tips-visa" style={{ padding: "0 1rem", height: "56px", display: "flex", alignItems: "center", color: "#ede5d5", textDecoration: "none", fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>Tips & Visa</Link>
          <Link href="/blog?category=community" style={{ padding: "0 1rem", height: "56px", display: "flex", alignItems: "center", gap: "4px", color: "#ede5d5", textDecoration: "none", fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>Community <span>✍️</span></Link>
        </div>

        <Link href="https://getatlas.ca" style={{ padding: "0.4rem 1.1rem", border: "1px solid #c9a96e", borderRadius: "20px", color: "#c9a96e", textDecoration: "none", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.03em", whiteSpace: "nowrap" }}>Plan Free →</Link>
      </nav>

      {/* FEATURED HERO */}
      {featured ? (
        <Link href={`/blog/${featured.slug}`} style={{ display: "block", textDecoration: "none" }}>
          <section style={{ position: "relative", height: "100vh", minHeight: "600px", overflow: "hidden" }}>
            {featured.cover_image_url ? (
              <Image src={featured.cover_image_url} alt={featured.title} fill priority style={{ objectFit: "cover" }} />
            ) : (
              <div style={{ position: "absolute", inset: 0, background: "#231f18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8rem" }}>{featured.hero_emoji ?? "✈️"}</div>
            )}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.06) 100%)" }} />
            <div className="hero-text" style={{ position: "absolute", bottom: 0, left: 0, padding: "3.5rem 4rem", maxWidth: "820px" }}>
              <p style={{ color: "#c9a96e", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.1rem" }}>
                <span style={{ display: "inline-block", width: "2rem", height: "1px", background: "#c9a96e" }} />
                Featured Story · {catLabel(featured.category)}
              </p>
              <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2.4rem, 5vw, 4.2rem)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: "1rem" }}>{featured.title}</h1>
              <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "1rem", lineHeight: 1.65, marginBottom: "1.5rem" }}>{featured.description}</p>
              <span style={{ color: "#c9a96e", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "1rem" }}>
                Read the story <span style={{ display: "inline-block", width: "3rem", height: "1px", background: "#c9a96e" }} />
              </span>
            </div>
          </section>
        </Link>
      ) : (
        <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#a09070", fontSize: "1.2rem" }}>No posts yet ✈️</div>
      )}

      {/* LATEST STORIES */}
      {rest.length > 0 && (
        <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "5rem 2rem 4rem" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2rem", fontWeight: 400, color: "#e8c994", marginBottom: "2.5rem" }}>Latest Stories</h2>

          <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            {rest.slice(0, 2).map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                <article className="blog-card" style={{ background: "#231f18", border: "1px solid #3a3228", borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s" }}>
                  {post.cover_image_url ? (
                    <div style={{ position: "relative", height: "220px" }}>
                      <Image src={post.cover_image_url} alt={post.title} fill style={{ objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.5))" }} />
                    </div>
                  ) : (
                    <div style={{ height: "140px", background: "#2a251d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>{post.hero_emoji ?? "✈️"}</div>
                  )}
                  <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.6rem" }}>
                      <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a96e", background: "rgba(201,169,110,0.12)", padding: "0.15rem 0.55rem", borderRadius: "20px", border: "1px solid rgba(201,169,110,0.2)" }}>New</span>
                      <span style={{ fontSize: "0.65rem", color: "#a09070", textTransform: "uppercase", letterSpacing: "0.08em" }}>{catLabel(post.category)}</span>
                    </div>
                    <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.4rem", fontWeight: 600, color: "#ede5d5", lineHeight: 1.25, marginBottom: "0.5rem" }}>{post.hero_emoji} {post.title}</h3>
                    <p style={{ color: "#a09070", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "0.75rem" }}>{post.description?.slice(0, 110)}{(post.description?.length ?? 0) > 110 ? "…" : ""}</p>
                    <div style={{ fontSize: "0.72rem", color: "#a09070" }}>{post.read_time} · {formatDate(post.date_published)}</div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {rest.slice(2, 6).length > 0 && (
            <div className="grid-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "4rem" }}>
              {rest.slice(2, 6).map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                  <article className="blog-card" style={{ background: "#231f18", border: "1px solid #3a3228", borderRadius: "10px", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column", transition: "border-color 0.2s" }}>
                    {post.cover_image_url ? (
                      <div style={{ position: "relative", height: "130px" }}>
                        <Image src={post.cover_image_url} alt={post.title} fill style={{ objectFit: "cover" }} />
                      </div>
                    ) : (
                      <div style={{ height: "90px", background: "#2a251d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>{post.hero_emoji ?? "✈️"}</div>
                    )}
                    <div style={{ padding: "0.9rem 1rem 1rem", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ fontSize: "0.6rem", color: "#c9a96e", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>{catLabel(post.category)}</div>
                      <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem", fontWeight: 600, color: "#ede5d5", lineHeight: 1.3, flex: 1, marginBottom: "0.5rem" }}>{post.hero_emoji} {post.title}</h3>
                      <div style={{ fontSize: "0.7rem", color: "#a09070" }}>{post.read_time} · {formatDate(post.date_published)}</div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {rest.slice(6).length > 0 && (
            <>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.6rem", fontWeight: 400, color: "#e8c994", marginBottom: "1.5rem" }}>
                All Articles <span style={{ color: "#a09070", fontSize: "1rem", fontFamily: "DM Sans, sans-serif" }}>{posts.length} total</span>
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "0.75rem" }}>
                {rest.slice(6).map(post => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                    <article className="blog-card" style={{ display: "flex", gap: "0.75rem", padding: "0.75rem", borderRadius: "8px", background: "#231f18", border: "1px solid #3a3228", transition: "border-color 0.2s" }}>
                      {post.cover_image_url ? (
                        <div style={{ position: "relative", width: "64px", height: "64px", flexShrink: 0, borderRadius: "6px", overflow: "hidden" }}>
                          <Image src={post.cover_image_url} alt={post.title} fill style={{ objectFit: "cover" }} />
                        </div>
                      ) : (
                        <div style={{ width: "64px", height: "64px", flexShrink: 0, borderRadius: "6px", background: "#2a251d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>{post.hero_emoji ?? "✈️"}</div>
                      )}
                      <div>
                        <div style={{ fontSize: "0.6rem", color: "#a09070", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.2rem" }}>{catLabel(post.category)}</div>
                        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.92rem", fontWeight: 600, color: "#ede5d5", lineHeight: 1.3, marginBottom: "0.2rem" }}>{post.hero_emoji} {post.title}</h3>
                        <div style={{ fontSize: "0.68rem", color: "#a09070" }}>{post.read_time} · {formatDate(post.date_published)}</div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </>
          )}
        </main>
      )}

      <footer style={{ borderTop: "1px solid #3a3228", marginTop: "3rem", padding: "3rem 2rem", textAlign: "center" }}>
        <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.3rem", color: "#e8c994", marginBottom: "0.5rem" }}>Discover the world with us.</p>
        <p style={{ color: "#a09070", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Hidden gems, budget routes, and destination inspiration — delivered to your inbox every week.</p>
        <Link href="https://getatlas.ca" style={{ display: "inline-block", padding: "0.6rem 1.5rem", background: "#c9a96e", color: "#1c1914", borderRadius: "20px", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700 }}>Plan Free →</Link>
        <p style={{ marginTop: "2rem", color: "#3a3228", fontSize: "0.72rem" }}>© {new Date().getFullYear()} Atlas Travel. All rights reserved.</p>
      </footer>
    </div>
  );
}
