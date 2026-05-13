'use client';

import { useEffect, useRef, useState } from 'react';

interface TocItem { id: string; text: string; level: number; }

function slugify(text: string, index: number) {
  return `h-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
}

export default function TableOfContents({ content }: { content: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = Array.from(doc.querySelectorAll('h2, h3'));
    const parsed = headings.map((h, i) => ({
      id: slugify(h.textContent ?? '', i),
      text: h.textContent ?? '',
      level: parseInt(h.tagName[1]),
    }));
    setItems(parsed);

    // Inject IDs into actual DOM h2/h3 elements
    const domHeadings = document.querySelectorAll('.article-body h2, .article-body h3');
    domHeadings.forEach((el, i) => {
      if (parsed[i]) el.id = parsed[i].id;
    });
  }, [content]);

  useEffect(() => {
    if (items.length === 0) return;
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '0px 0px -65% 0px', threshold: 0 }
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  return (
    <nav aria-label="Table of contents" style={{ position:"sticky", top:80, maxHeight:"calc(100vh - 100px)", overflowY:"auto", paddingBottom:24 }}>
      <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", color:"#a09070", textTransform:"uppercase", marginBottom:14 }}>IN THIS GUIDE</div>
      {items.map(item => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={e => {
            e.preventDefault();
            document.getElementById(item.id)?.scrollIntoView({ behavior:'smooth', block:'start' });
          }}
          style={{
            display:"block",
            fontSize:13,
            color: activeId === item.id ? "#c9a96e" : "#a09070",
            textDecoration:"none",
            padding:"5px 0 5px 12px",
            paddingLeft: item.level === 3 ? 24 : 12,
            borderLeft: activeId === item.id ? "2px solid #c9a96e" : "2px solid #3a3228",
            marginBottom:2,
            lineHeight:1.4,
            transition:"all 0.15s",
            fontWeight: activeId === item.id ? 500 : 400,
          }}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}
