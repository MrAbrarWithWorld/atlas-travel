'use client';

import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import WriteButton from '../../components/WriteButton';
import s from '../blog.module.css';

interface BlogNavProps {
  /** Highlight a nav link by its href, e.g. "/community". */
  activePath?: string;
  /** Extra CSS injected via <style> (kept for pages that still pass it). */
  extraStyles?: string;
  /** Force the dark palette (for pages that are not themed yet). */
  dark?: boolean;
}

const LINKS = [
  { href: '/blog', label: 'Guides' },
  { href: '/blog?cat=Visa%20%26%20budget', label: 'Visa & budget' },
  { href: '/community', label: 'Community' },
];

export default function BlogNav({ activePath, extraStyles, dark = false }: BlogNavProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const current = (href: string) => (activePath === href ? { 'aria-current': 'page' as const } : {});

  return (
    <>
      {extraStyles ? <style>{extraStyles}</style> : null}
      <nav className={`${s.theme} ${dark ? s.dark : ''} ${s.nav}`} aria-label="Atlas Travel">
        <div className={s.navInner}>
          <Link href="/blog" className={s.brand}>
            <span className={s.brandName}>ATLAS</span>
            <span className={s.brandSub}>Travel Journal</span>
          </Link>
          <div className={s.navLinks}>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={s.navLink} {...current(l.href)}>{l.label}</Link>
            ))}
          </div>
          <div className={`${s.navActions} ${s.hideMobile}`}>
            <WriteButton />
            <Link href="/travel" prefetch={false} className={s.btn}>Plan a trip</Link>
          </div>
          <button
            type="button"
            className={s.menuBtn}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              {open
                ? <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                : <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
        <div id={panelId} className={s.menuPanel} hidden={!open}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} {...current(l.href)}>{l.label}</Link>
          ))}
          <div style={{ paddingTop: 12 }}><WriteButton /></div>
          <Link href="/travel" prefetch={false} className={s.btn} onClick={() => setOpen(false)}>Plan a trip with Atlas</Link>
        </div>
      </nav>
    </>
  );
}
