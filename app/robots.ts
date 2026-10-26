import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Don't block /_next/: Google needs the CSS and JS files to render pages.
      disallow: ["/api/", "/admin"],
    },
    sitemap: "https://getatlas.ca/sitemap.xml",
  };
}
