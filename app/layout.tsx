import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://getatlas.ca"),
  title: {
    default: "Atlas AI Technology | Lead follow-up automation for small businesses",
    template: "%s | Atlas",
  },
  description:
    "Atlas AI Technology builds lead follow-up and workflow automation for small businesses in Toronto and across Canada. Free missed-lead audit, founding prices from $29/month.",
  authors: [{ name: "Atlas AI Technology" }],
  creator: "Atlas AI Technology",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://getatlas.ca",
    siteName: "Atlas AI Technology",
    title: "Atlas AI Technology | Every lead answered in seconds",
    description:
      "Missed-call text-back, instant replies and follow-ups you approve. Free missed-lead audit. Founding prices from $29/month.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlas AI Technology | Every lead answered in seconds",
    description:
      "Missed-call text-back, instant replies and follow-ups you approve. Free audit. Founding prices from $29/month.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Atlas AI Technology",
                "url": "https://getatlas.ca",
                "logo": "https://getatlas.ca/icon-512.png",
                "email": "support@getatlas.ca",
                "sameAs": [
                  "https://play.google.com/store/apps/details?id=ca.getatlas.app"
                ],
                "description": "Lead follow-up and workflow automation for small businesses in Toronto and across Canada. Also the maker of the Atlas AI Travel Planner app."
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Atlas AI Technology",
                "url": "https://getatlas.ca"
              }
            ])
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-atlas-bg text-atlas-text antialiased">
        {children}
      </body>
    </html>
  );
}
