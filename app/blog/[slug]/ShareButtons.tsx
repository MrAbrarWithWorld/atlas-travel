'use client';

import { useState } from 'react';

const btn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', height: 36, padding: '0 14px',
  border: '1px solid var(--b-line)', borderRadius: 999, color: 'var(--b-ink)',
  background: 'var(--b-surface)', fontSize: 14, fontWeight: 500, textDecoration: 'none',
  font: 'inherit', cursor: 'pointer',
};

export default function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://getatlas.ca/blog/${slug}`;
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  return (
    <>
      <style>{`.share-btn:hover { border-color: var(--b-accent) !important; color: var(--b-accent) !important; }`}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 14, color: 'var(--b-muted)', marginRight: 4 }}>Share</span>
        <a className="share-btn" style={btn} href={`https://wa.me/?text=${t}%20${u}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a className="share-btn" style={btn} href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener noreferrer">Facebook</a>
        <a className="share-btn" style={btn} href={`https://twitter.com/intent/tweet?text=${t}&url=${u}`} target="_blank" rel="noopener noreferrer">X</a>
        <button
          type="button"
          className="share-btn"
          style={btn}
          onClick={() => {
            navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {});
          }}
        >
          {copied ? 'Link copied' : 'Copy link'}
        </button>
      </div>
    </>
  );
}
