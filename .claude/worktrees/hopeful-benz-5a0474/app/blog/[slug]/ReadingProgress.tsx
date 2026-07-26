'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, height:3, background:"transparent", pointerEvents:"none" }}>
      <div style={{ height:"100%", background:"linear-gradient(to right,#c9a96e,#e8c994)", width:`${progress}%`, transition:"width 0.1s linear" }} />
    </div>
  );
}
