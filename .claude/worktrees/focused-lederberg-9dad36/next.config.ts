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
        { source: '/', destination: '/index.html' }
      ]
    };
  },
};

export default nextConfig;
