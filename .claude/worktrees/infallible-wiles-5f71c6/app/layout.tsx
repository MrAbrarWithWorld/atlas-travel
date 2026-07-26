import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://getatlas.ca"),
  title: {
    default: "Atlas | AI Travel Planner",
    template: "%s | Atlas Travel",
  },
  description:
    "Atlas is an AI-powered travel planner that creates personalized itineraries, discovers hidden gems, and makes travel planning effortless.",
  keywords: [
    "AI travel planner",
    "travel itinerary",
    "personalized travel",
    "trip planning",
    "travel guide",
  ],
  authors: [{ name: "Atlas Travel" }],
  creator: "Atlas Travel",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://getatlas.ca",
    siteName: "Atlas Travel",
    title: "Atlas | AI Travel Planner",
    description:
      "Atlas is an AI-powered travel planner that creates personalized itineraries, discovers hidden gems, and makes travel planning effortless.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Atlas Travel Planner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlas | AI Travel Planner",
    description:
      "Atlas is an AI-powered travel planner that creates personalized itineraries and makes travel planning effortless.",
    images: ["/og-image.png"],
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
