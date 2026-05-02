'use client';

export default function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = `https://getatlas.ca/blog/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <>
      <style>{`
        .share-btn:hover { border-color: #c9a96e !important; color: #c9a96e !important; }
        .share-btn { transition: all 0.2s; }
      `}</style>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 12, color: "#a09070", fontWeight: 600, letterSpacing: "0.1em" }}>
          SHARE:
        </span>
        <a
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 14px",
            border: "1px solid #3a3228",
            borderRadius: 6,
            color: "#ede5d5",
            fontSize: 12,
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          💬 WhatsApp
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 14px",
            border: "1px solid #3a3228",
            borderRadius: 6,
            color: "#ede5d5",
            fontSize: 12,
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          📘 Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 14px",
            border: "1px solid #3a3228",
            borderRadius: 6,
            color: "#ede5d5",
            fontSize: 12,
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          𝕏 Twitter
        </a>
        <button
          onClick={() => {
            navigator.clipboard.writeText(url).then(() => {
              alert('Link copied!');
            }).catch(() => {});
          }}
          className="share-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 14px",
            border: "1px solid #3a3228",
            borderRadius: 6,
            color: "#ede5d5",
            fontSize: 12,
            background: "none",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          🔗 Copy Link
        </button>
      </div>
    </>
  );
}
