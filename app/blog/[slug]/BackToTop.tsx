'use client';

import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 800);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      style={{ position:"fixed", bottom:32, right:32, zIndex:150, width:44, height:44, borderRadius:"50%", background:"#231f18", border:"1px solid #c9a96e", color:"#c9a96e", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(0,0,0,0.5)", transition:"all 0.2s" }}
    >
      ↑
    </button>
  );
}
