import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { DESTINATION_SLUGS } from "./lib/destination-slugs";
import { AREAS } from "./lib/areas";

const BASE_URL = "https://getatlas.ca";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Real "last changed" dates (not "now") so Google can tell what actually changed.
  // Update the matching date when the page content changes.
  const d = (iso: string) => new Date(`${iso}T00:00:00Z`);
  const BUSINESS = d("2026-10-26");
  const NEW_PAGES = d("2026-10-27");
  const LEGAL = d("2026-10-25");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: NEW_PAGES, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/services`, lastModified: BUSINESS, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified: BUSINESS, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/faq`, lastModified: BUSINESS, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: BUSINESS, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/for/trades`, lastModified: BUSINESS, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/for/realtors`, lastModified: BUSINESS, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/for/bookkeepers`, lastModified: BUSINESS, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/for/salons`, lastModified: NEW_PAGES, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/for/restaurants`, lastModified: NEW_PAGES, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/for/agencies`, lastModified: NEW_PAGES, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/guides/how-to-choose-an-automation-partner`, lastModified: NEW_PAGES, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/guides/diy-automation-vs-hiring-help`, lastModified: NEW_PAGES, changeFrequency: "monthly", priority: 0.7 },
    ...AREAS.map((area) => ({
      url: `${BASE_URL}/areas/${area.slug}`,
      lastModified: NEW_PAGES,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${BASE_URL}/travel`, lastModified: BUSINESS, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: BUSINESS, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/community`, lastModified: BUSINESS, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/privacy`, lastModified: LEGAL, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: LEGAL, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/legal`, lastModified: LEGAL, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/legal/services/privacy`, lastModified: LEGAL, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/legal/services/terms`, lastModified: LEGAL, changeFrequency: "monthly", priority: 0.3 },
    // Travel destination guides served by api/plan.js (/plan/:dest). Slug list is drift-checked by scripts/check-destination-slugs.mjs.
    ...DESTINATION_SLUGS.map((slug) => ({
      url: `${BASE_URL}/plan/${slug}`,
      lastModified: NEW_PAGES,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return staticRoutes;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const [{ data: posts }, { data: trips }, { data: communityPosts }] = await Promise.all([
      supabase
        .from("blog_posts")
        .select("slug, date_published")
        .eq("is_published", true)
        .order("date_published", { ascending: false }),
      supabase
        .from("saved_plans")
        .select("share_id, created_at")
        .not("share_id", "is", null)
        .eq("is_public", true)
        .limit(1000),
      supabase
        .from("user_posts")
        .select("slug, created_at")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.date_published ? new Date(post.date_published) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    const tripRoutes: MetadataRoute.Sitemap = (trips ?? []).map((trip) => ({
      url: `${BASE_URL}/trip/${trip.share_id}`,
      lastModified: trip.created_at ? new Date(trip.created_at) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    const communityRoutes: MetadataRoute.Sitemap = (communityPosts ?? [])
      .filter((p) => p.slug)
      .map((post) => ({
        url: `${BASE_URL}/community/${post.slug}`,
        lastModified: post.created_at ? new Date(post.created_at) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));

    return [...staticRoutes, ...blogRoutes, ...tripRoutes, ...communityRoutes];
  } catch {
    return staticRoutes;
  }
}
