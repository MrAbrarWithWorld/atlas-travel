import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://getatlas.ca";

export const revalidate = 3600; // revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Blog posts
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, date_published")
    .eq("is_published", true)
    .order("date_published", { ascending: false });

  const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date_published
      ? new Date(post.date_published)
      : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Public trips (if table exists)
  let tripRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: trips } = await supabase
      .from("trips")
      .select("id, updated_at")
      .eq("is_public", true)
      .order("updated_at", { ascending: false })
      .limit(500);

    tripRoutes = (trips ?? []).map((trip) => ({
      url: `${BASE_URL}/trips/${trip.id}`,
      lastModified: trip.updated_at ? new Date(trip.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // trips table may not exist yet
  }

  return [...staticRoutes, ...blogRoutes, ...tripRoutes];
}
