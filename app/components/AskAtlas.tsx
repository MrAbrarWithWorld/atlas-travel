'use client';

// "Ask Atlas": floating AI assistant on the Atlas AI Technology pages (mounted by BusinessFooter).
// The conversation lives in this browser tab only (sessionStorage) and is sent to
// /api/lead-intake?mode=ask (app/lib/ask-handler.ts).
import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, ChatCircleDots, PaperPlaneRight, X } from '@phosphor-icons/react';
import { SERVICE_OPTIONS } from '../lib/lead-intake';
import css from './AskAtlas.module.css';

type Msg = { role: 'user' | 'assistant'; content: string; cta?: string | null };

const STORE_KEY = 'ask-atlas-v1';
const MAX_CHARS = 1000;
const SUGGESTIONS = [
  'What can you automate for my business?',
  'How much does it cost?',
  'How does the free audit work?',
  'What can the AI assistant connect to?',
];
const GREETING =
  "Hi! I'm Atlas's AI assistant. Ask me about our services, prices, or how we could help your business.";

function ctaLabel(service: string) {
  if (service === 'free-audit') return 'Get my free audit';
  if (service === 'not-sure') return 'Contact the team';
  const label = SERVICE_OPTIONS.find((o) => o.value === service)?.label.replace(/\s*\(.*\)$/, '');
  return label ? `Ask about ${label}` : 'Contact the team';
}

function safeHref(href: string) {
  if (/^\/(?!\/)[\w\-/#?=&.%]*$/.test(href)) return href;
  if (/^mailto:support@getatlas\.ca$/i.test(href)) return href;
  const m = href.match(/^https:\/\/getatlas\.ca(\/[\w\-/#?=&.%]*)?$/i);
  if (m) return m[1] || '/';
  return null;
}

// Tiny, safe formatter: **bold**, [text](/link), support@getatlas.ca. No raw HTML.
function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|(support@getatlas\.ca)/gi;
  let last = 0;
  let i = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${i++}`;
    if (m[1]) out.push(<strong key={k}>{m[1]}</strong>);
    else if (m[2]) {
      const href = safeHref(m[3]);
      if (!href) out.push(m[2]);
      else if (href.startsWith('mailto:')) out.push(<a key={k} href={href}>{m[2]}</a>);
      else out.push(<Link key={k} href={href} prefetch={false}>{m[2]}</Link>);
    } else if (m[4]) out.push(<a key={k} href="mailto:support@getatlas.ca">{m[4]}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Formatted({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  const flush = () => {
    if (!list) return;
    const items = list.items.map((it, j) => <li key={j}>{inline(it, `li${blocks.length}-${j}`)}</li>);
    blocks.push(list.ordered ? <ol key={blocks.length}>{items}</ol> : <ul key={blocks.length}>{items}</ul>);
    list = null;
  };
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    const num = line.match(/^\d+[.)]\s+(.*)$/);
    if (bullet || num) {
      const ordered = Boolean(num);
      if (!list || list.ordered !== ordered) {
        flush();
        list = { ordered, items: [] };
      }
      list.items.push((bullet || num)![1]);
      continue;
    }
    flush();
    if (!line) continue;
    const heading = line.replace(/^#{1,4}\s+/, '');
    blocks.push(<p key={blocks.length}>{inline(heading, `p${blocks.length}`)}</p>);
  }
  flush();
  return <>{blocks}</>;
}

export default function AskAtlas() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null');
      if (Array.isArray(saved?.msgs)) setMsgs(saved.msgs.slice(-40));
      if (saved?.open) setOpen(true);
    } catch {
      /* storage unavailable: start fresh */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify({ msgs: msgs.slice(-40), open }));
    } catch {
      /* ignore */
    }
  }, [msgs, open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, busy, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || busy) return;
      if (content.length > MAX_CHARS) {
        setError(`Please keep your message under ${MAX_CHARS} characters.`);
        return;
      }
      setError('');
      setDraft('');
      const next: Msg[] = [...msgs, { role: 'user', content }];
      setMsgs(next);
      setBusy(true);
      try {
        const res = await fetch('/api/lead-intake?mode=ask', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ messages: next.map(({ role, content: c }) => ({ role, content: c })) }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.reply) {
          setError(data.error || 'Something went wrong. Please try again, or email support@getatlas.ca.');
          setMsgs(msgs);
          setDraft(content);
        } else {
          setMsgs([...next, { role: 'assistant', content: data.reply, cta: data.cta || null }]);
        }
      } catch {
        setError('No connection. Please check your internet and try again.');
        setMsgs(msgs);
        setDraft(content);
      } finally {
        setBusy(false);
      }
    },
    [busy, msgs],
  );

  const reset = () => {
    setMsgs([]);
    setError('');
    inputRef.current?.focus();
  };

  return (
    <div className={css.root}>
      {open && (
        <section className={css.panel} role="dialog" aria-modal="false" aria-label="Ask Atlas, AI assistant">
          <header className={css.head}>
            <span className={css.mark} aria-hidden="true"><span /></span>
            <div className={css.headText}>
              <strong>Ask Atlas</strong>
              <span>AI assistant · instant answers</span>
            </div>
            {msgs.length > 0 && (
              <button type="button" className={css.textBtn} onClick={reset}>New chat</button>
            )}
            <button
              type="button"
              className={css.iconBtn}
              aria-label="Close chat"
              onClick={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
            >
              <X size={18} weight="bold" />
            </button>
          </header>

          <div className={css.list} ref={listRef} aria-live="polite">
            <div className={`${css.msg} ${css.bot}`}>
              <p>{GREETING}</p>
            </div>
            {msgs.length === 0 && (
              <div className={css.suggest}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            )}
            {msgs.map((m, i) => (
              <Fragment key={i}>
                <div className={`${css.msg} ${m.role === 'user' ? css.me : css.bot}`}>
                  {m.role === 'user' ? <p>{m.content}</p> : <Formatted text={m.content} />}
                </div>
                {m.role === 'assistant' && m.cta && (
                  <Link className={css.cta} href={`/contact?service=${encodeURIComponent(m.cta)}`} prefetch={false}>
                    {ctaLabel(m.cta)} <ArrowRight size={14} weight="bold" aria-hidden="true" />
                  </Link>
                )}
              </Fragment>
            ))}
            {busy && (
              <div className={`${css.msg} ${css.bot} ${css.typing}`} aria-label="Assistant is typing">
                <span /><span /><span />
              </div>
            )}
            {error && <p className={css.error} role="alert">{error}</p>}
          </div>

          <form
            className={css.form}
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={draft}
              maxLength={MAX_CHARS}
              placeholder="Ask about our services…"
              aria-label="Your message"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send(draft);
                }
              }}
            />
            <button type="submit" className={css.send} aria-label="Send" disabled={busy || !draft.trim()}>
              <PaperPlaneRight size={18} weight="fill" />
            </button>
          </form>
          <p className={css.note}>
            AI answers can be wrong, and they aren&apos;t a quote. Please don&apos;t share sensitive information.{' '}
            <Link href="/legal/services/privacy#our-website-assistant-ask-atlas" prefetch={false}>Privacy</Link>
          </p>
        </section>
      )}

      <button
        ref={launcherRef}
        type="button"
        className={`${css.launcher} ${open ? css.launcherOpen : ''}`}
        aria-expanded={open}
        aria-label={open ? 'Close Ask Atlas' : 'Open Ask Atlas, AI assistant'}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={20} weight="bold" /> : <ChatCircleDots size={22} weight="fill" />}
        <span className={css.launcherLabel}>Ask Atlas</span>
      </button>
    </div>
  );
}
