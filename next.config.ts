import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prffhhkemxibujjjiyhg.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    // Enable PPR when stable
  },
  async rewrites() {
    return {
      beforeFiles: [
        // getatlas.ca/ is the Atlas AI Technology business homepage (app/page.tsx).
        // The travel planner lives at travel.getatlas.ca/ and at getatlas.ca/travel.
        // API routes, /privacy, /terms, /trip/*, /blog and /.well-known stay on getatlas.ca
        // because the Play Store app depends on them.
        {
          source: '/',
          has: [{ type: 'host', value: 'travel.getatlas.ca' }],
          destination: '/index.html',
        },
        { source: '/travel', destination: '/index.html' },
      ]
    };
  },
};

export default nextConfig;
