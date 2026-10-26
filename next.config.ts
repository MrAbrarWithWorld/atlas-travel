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
  // /services, /pricing and /faq are real pages (app/services, app/pricing, app/faq).
  // The homepage keeps #services / #pricing / #faq anchors for old links.
  // /privacy and /terms are Next.js pages (app/privacy, app/terms) rendered from content/legal/travel.
  // The old static files moved to legal-archive/; keep their URLs working.
  async redirects() {
    return [
      { source: '/privacy.html', destination: '/privacy', permanent: true },
      { source: '/terms.html', destination: '/terms', permanent: true },
      // Android app 1.2.1 opens getatlas.ca/contact?intent=upgrade… (the business contact form since the
      // planner moved to /travel). Send those to the planner, which opens its pricing or settings.
      {
        source: '/contact',
        has: [{ type: 'query', key: 'intent', value: '(upgrade.*|manage-subscription)' }],
        destination: '/travel',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // getatlas.ca/ is the Atlas AI Technologies business homepage (app/page.tsx).
        // The travel planner lives at travel.getatlas.ca/ and at getatlas.ca/travel.
        // API routes, /privacy, /terms, /trip/*, /blog and /.well-known stay on getatlas.ca
        // because the Play Store app depends on them.
        {
          source: '/',
          has: [{ type: 'host', value: 'travel.getatlas.ca' }],
          destination: '/index.html',
        },
        { source: '/travel', destination: '/index.html' },
        // Stripe returns (?payment=…) and /plan/… buttons (?dest=…) still point at getatlas.ca/.
        { source: '/', has: [{ type: 'query', key: 'payment' }], destination: '/index.html' },
        { source: '/', has: [{ type: 'query', key: 'dest' }], destination: '/index.html' },
      ]
    };
  },
};

export default nextConfig;
