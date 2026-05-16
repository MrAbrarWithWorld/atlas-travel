import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://getatlas.ca";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/community`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return staticRoutes;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, date_published")
      .eq("is_published", true)
      .order("date_published", { ascending: false });

    const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.date_published ? new Date(post.date_published) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    const { data: trips } = await supabase
      .from("saved_plans")
      .select("share_id, updated_at")
      .eq("is_public", true)
      .not("share_id", "is", null)
      .limit(1000);

    const tripRoutes: MetadataRoute.Sitemap = (trips ?? []).map((trip) => ({
      url: `${BASE_URL}/trip/${trip.share_id}`,
      lastModified: trip.updated_at ? new Date(trip.updated_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...blogRoutes, ...tripRoutes];
  } catch {
    return staticRoutes;
  }
}
