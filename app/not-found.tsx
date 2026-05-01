import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-atlas-bg flex flex-col items-center justify-center px-6 text-center">
      <div className="text-7xl mb-6">🗺️</div>
      <h1 className="font-serif text-5xl text-atlas-gold-light font-semibold mb-4">
        Lost in Transit
      </h1>
      <p className="text-atlas-text-muted text-lg mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist. Maybe the route changed?
      </p>
      <div className="flex gap-4">
        <Link
          href="/blog"
          className="px-6 py-3 rounded-full bg-atlas-gold text-atlas-bg font-semibold hover:bg-atlas-gold-light transition-colors"
        >
          Read Our Blog
        </Link>
        <Link
          href="/"
          className="px-6 py-3 rounded-full border border-atlas-border text-atlas-text-muted hover:border-atlas-gold/40 hover:text-atlas-text transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
