import Link from 'next/link';
import s from '../blog.module.css';
import NewsletterForm from '../NewsletterForm';

/** Newsletter band + footer shared by the blog index and articles. */
export default function BlogFooter() {
  return (
    <>
      <section className={s.band} aria-labelledby="dispatch-title">
        <div className={`${s.wrap} ${s.bandInner}`}>
          <div>
            <h2 id="dispatch-title" className={s.bandTitle}>The Atlas Dispatch</h2>
            <p className={s.desc}>New destination guides, visa notes and budget routes by email. No spam.</p>
          </div>
          <NewsletterForm />
        </div>
      </section>
      <footer className={s.footer}>
        <div className={`${s.wrap} ${s.footerInner}`}>
          <span>© {new Date().getFullYear()} Atlas AI Technologies · Toronto, Canada</span>
          <nav aria-label="Travel journal">
            <Link href="/travel" prefetch={false}>Trip planner</Link>
            <Link href="/blog">Guides</Link>
            <Link href="/community">Community</Link>
            <Link href="/blog/advertise">Advertise</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
