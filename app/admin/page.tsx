'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api, INPUT, LABEL, BTN, BTN_GHOST, type Section } from './shared';
import { OverviewPanel, CommunityPanel, SchedulePanel, HealthPanel } from './panels';

// ─── Types ────────────────────────────────────────────────────────────────────

type Post = {
  slug: string;
  title: string;
  category: string;
  is_published: boolean;
  date_published: string;
};

type PostForm = {
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  cover_image_url: string;
  read_time: string;
  hero_emoji: string;
  date_published: string;
  is_published: boolean;
  inline_photos: string[];
};

// Shared helpers, styles and the new panels live in ./shared and ./panels.

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: '', label: 'Select category…' },
  { value: 'americas', label: 'Americas' },
  { value: 'europe', label: 'Europe' },
  { value: 'asia', label: 'Asia' },
  { value: 'southasia', label: 'South Asia' },
  { value: 'africa', label: 'Africa' },
  { value: 'middleeast', label: 'Middle East' },
  { value: 'oceania', label: 'Oceania' },
  { value: 'tips', label: 'Tips & Guides' },
  { value: 'food', label: 'Food & Drink' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'culture', label: 'Culture' },
];

function toSlug(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const EMPTY_FORM: PostForm = {
  title: '', slug: '', description: '', content: '', category: '',
  cover_image_url: '', read_time: '', hero_emoji: '✈️',
  date_published: new Date().toISOString().slice(0, 10),
  is_published: false,
  inline_photos: ['', '', '', '', ''],
};

const PHOTO_SLOTS = 5;

// ─── Login screen ────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const { ok } = await api('login', { password: pwd });
    setBusy(false);
    if (ok) onLogin();
    else setErr('Wrong password — try again.');
  };

  return (
    <div className="min-h-screen bg-[#111009] flex items-center justify-center px-4">
      <div className="w-72 text-center">
        <div className="font-serif text-[2.2rem] font-light tracking-[0.4em] text-[#d4aa6e] uppercase mb-1">
          Atlas
        </div>
        <div className="text-[0.6rem] tracking-[0.15em] uppercase text-[#7a6a4a] mb-8">
          Admin Panel
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full bg-white/[0.04] border border-[rgba(201,169,110,0.2)] rounded-lg px-4 py-3 text-[#ede5d5] text-sm text-center tracking-widest focus:outline-none focus:border-[rgba(201,169,110,0.45)] transition-colors"
          />
          <button type="submit" disabled={busy} className={BTN + ' w-full py-3'}>
            {busy ? '…' : 'Enter →'}
          </button>
          {err && <p className="text-[#c06050] text-xs">{err}</p>}
        </form>
      </div>
    </div>
  );
}

// ─── Newsletter (The Atlas Dispatch) ─────────────────────────────────────────

type NewsletterInfo = {
  status: string;
  subscribers?: number;
  posts?: { slug: string; title: string }[];
  hasResendKey?: boolean;
  hasMailingAddress?: boolean;
  sent?: number;
  total?: number;
  to?: string;
  error?: string;
};

const NL_LABELS: Record<string, string> = {
  test_sent: 'Test sent',
  sent: 'Sent',
  no_posts: 'No published posts to send',
  no_subscribers: 'No active subscribers yet',
  missing_resend_key: 'RESEND_API_KEY is missing in Vercel',
  missing_mailing_address: 'Add NEWSLETTER_MAILING_ADDRESS in Vercel first (required by Canadian anti-spam law)',
  not_confirmed: 'Type SEND to confirm',
  error: 'Error',
};

function NewsletterCard() {
  const [info, setInfo] = useState<NewsletterInfo | null>(null);
  const [msg, setMsg] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api('newsletter_status').then(({ data }) => setInfo(data as NewsletterInfo));
  }, []);
  useEffect(() => { load(); }, [load]);

  async function sendTest() {
    setMsg('Sending test…');
    const { data } = await api('newsletter_test');
    const d = data as NewsletterInfo;
    setMsg(d.status === 'test_sent' ? `Test sent to ${d.to}` : (d.error || NL_LABELS[d.status] || d.status));
  }

  async function sendAll() {
    setBusy(true);
    const { data } = await api('newsletter_send', { confirm: typed });
    const d = data as NewsletterInfo;
    setMsg(d.status === 'sent' ? `Sent to ${d.sent} of ${d.total} subscribers` : (d.error || NL_LABELS[d.status] || d.status));
    setBusy(false);
    setConfirming(false);
    setTyped('');
    load();
  }

  const n = info?.subscribers ?? 0;
  const canSend = !!info && info.hasResendKey !== false && !!info.hasMailingAddress && n > 0;
  return (
    <div className="bg-[rgba(201,169,110,0.04)] border border-[rgba(201,169,110,0.12)] rounded-xl p-4 mb-8">
      <div className="text-[0.58rem] tracking-[0.12em] uppercase text-[#8a7a5a] mb-1">Newsletter · The Atlas Dispatch</div>
      <div className="text-sm text-[#e8dcc8] mb-1">{info ? `${n} active subscriber${n === 1 ? '' : 's'}` : '…'}</div>
      {info?.posts?.length ? (
        <div className="text-[0.72rem] text-[#8a7a5a] mb-2">Next issue: {info.posts.map((p) => p.title).join(' · ')}</div>
      ) : null}
      {info && !info.hasMailingAddress && (
        <div className="text-[0.72rem] text-[#e8a070] mb-2">{NL_LABELS.missing_mailing_address}</div>
      )}
      <div className="text-[0.68rem] text-[#6a5a3a] mb-3">
        The three newest blog posts, from noreply@getatlas.ca with an unsubscribe link. Send a test to yourself first.
      </div>
      <div className="flex gap-2 items-center flex-wrap">
        <button className={BTN_GHOST} onClick={sendTest}>Send test to me</button>
        {canSend && !confirming && (
          <button className={BTN} onClick={() => setConfirming(true)}>Send to {n} subscriber{n === 1 ? '' : 's'}</button>
        )}
        {msg && <span className="text-[0.75rem] text-[#c9a96e]">{msg}</span>}
      </div>
      {confirming && (
        <div className="flex gap-2 items-center flex-wrap mt-3">
          <span className="text-[0.75rem] text-[#e8dcc8]">Type SEND to email {n} subscriber{n === 1 ? '' : 's'}:</span>
          <input value={typed} onChange={(e) => setTyped(e.target.value)} className="bg-transparent border border-[rgba(201,169,110,0.3)] rounded px-2 py-1 text-sm text-[#e8dcc8] w-24" aria-label="Type SEND to confirm" />
          <button className={BTN} disabled={busy || typed !== 'SEND'} onClick={sendAll}>{busy ? 'Sending…' : 'Send now'}</button>
          <button className={BTN_GHOST} onClick={() => { setConfirming(false); setTyped(''); }}>Cancel</button>
        </div>
      )}
    </div>
  );
}

// ─── Legal update emails ─────────────────────────────────────────────────────

type LegalStatus = {
  status: string;
  docs?: { slug: string; version: string; effective: string; shortTitle: string }[];
  total?: number | null;
  sent?: number;
  remaining?: number;
  lastRunAt?: string | null;
  lastError?: string | null;
  error?: string;
  hasResendKey?: boolean;
};

const LEGAL_LABELS: Record<string, string> = {
  not_started: 'Not sent yet',
  sending: 'Sending (paused)',
  in_progress: 'Sending…',
  done: 'Sent to everyone',
  busy: 'Another send is running',
  nothing_to_announce: 'Nothing new to announce',
  missing_resend_key: 'RESEND_API_KEY is missing in Vercel',
  error: 'Error',
  test_sent: 'Test sent to support@getatlas.ca',
};

function LegalNoticeCard() {
  const [info, setInfo] = useState<LegalStatus | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [running, setRunning] = useState(false);
  const [testMsg, setTestMsg] = useState('');

  const load = useCallback(() => {
    api('legal_notice_status').then(({ data }) => setInfo(data as LegalStatus));
  }, []);
  useEffect(() => { load(); }, [load]);

  async function sendNow() {
    setConfirming(false);
    setRunning(true);
    for (let i = 0; i < 30; i++) {
      const { data } = await api('legal_notice_send');
      const d = data as LegalStatus;
      setInfo((prev) => ({ ...(prev || { status: '' }), ...d }));
      if (d.status !== 'in_progress') break;
    }
    setRunning(false);
    load();
  }

  async function sendTest() {
    setTestMsg('Sending test…');
    const { data } = await api('legal_notice_test');
    const d = data as LegalStatus & { to?: string };
    setTestMsg(d.status === 'test_sent' ? `Test sent to ${d.to}` : (d.error || LEGAL_LABELS[d.status] || d.status));
  }

  const label = info ? (LEGAL_LABELS[info.status] || info.status) : '…';
  const canSend = info && !['done', 'nothing_to_announce'].includes(info.status) && info.hasResendKey !== false;
  return (
    <div className="bg-[rgba(201,169,110,0.04)] border border-[rgba(201,169,110,0.12)] rounded-xl p-4 mb-8">
      <div className="text-[0.58rem] tracking-[0.12em] uppercase text-[#8a7a5a] mb-1">Legal update emails</div>
      <div className="text-sm text-[#e8dcc8] mb-1">
        {label}
        {info?.total != null && <span className="text-[#c9a96e]"> · {info.sent ?? 0}/{info.total} sent</span>}
      </div>
      {info?.docs?.length ? (
        <div className="text-[0.72rem] text-[#8a7a5a] mb-2">
          {info.docs.map((d) => `${d.shortTitle} v${d.version} (effective ${d.effective})`).join(' · ')}
        </div>
      ) : null}
      {(info?.lastError || info?.error) && (
        <div className="text-[0.72rem] text-[#e87070] mb-2">{info.lastError || info.error}</div>
      )}
      <div className="text-[0.68rem] text-[#6a5a3a] mb-3">
        Sent automatically by the daily job when a Privacy Policy or Terms version changes. From noreply@getatlas.ca; replies go to support@getatlas.ca.
      </div>
      <div className="flex gap-2 items-center flex-wrap">
        {canSend && !confirming && (
          <button className={BTN} disabled={running} onClick={() => setConfirming(true)}>
            {running ? 'Sending…' : 'Send now'}
          </button>
        )}
        {info && info.status !== 'nothing_to_announce' && !confirming && (
          <button className={BTN_GHOST} onClick={sendTest}>Send test to me</button>
        )}
        {testMsg && <span className="text-[0.75rem] text-[#c9a96e]">{testMsg}</span>}
      </div>
      {canSend && confirming && (
        <div className="flex gap-2 items-center flex-wrap">
          <span className="text-[0.75rem] text-[#e8dcc8]">Email every Travel Planner account holder now?</span>
          <button className={BTN} onClick={sendNow}>Yes, send</button>
          <button className={BTN_GHOST} onClick={() => setConfirming(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

// ─── Posts table ──────────────────────────────────────────────────────────────

function PostsTable({
  posts,
  loading,
  onEdit,
  onDelete,
  onNew,
}: {
  posts: Post[];
  loading: boolean;
  onEdit: (slug: string) => void;
  onDelete: (slug: string, title: string) => void;
  onNew: () => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="font-serif text-xl font-light text-[#c9a96e]">
          Blog Posts{' '}
          {!loading && (
            <span className="font-sans text-sm text-[#8a7a5a] font-normal">
              ({posts.length})
            </span>
          )}
        </h2>
        <button onClick={onNew} className={BTN + ' text-xs px-4 py-1.5'}>
          + New Post
        </button>
      </div>

      {loading ? (
        <div className="text-[#7a6a4a] text-sm py-6">Loading posts…</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[rgba(201,169,110,0.15)]">
                {['Title', 'Category', 'Date', 'Status', ''].map((h) => (
                  <th
                    key={h}
                    className="text-left py-2 px-3 text-[0.6rem] tracking-[0.1em] uppercase text-[#7a6a50] font-normal"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr
                  key={p.slug}
                  className="border-b border-[rgba(201,169,110,0.06)] hover:bg-[rgba(201,169,110,0.02)] transition-colors group"
                >
                  <td className="py-2.5 px-3 max-w-xs">
                    <button
                      onClick={() => onEdit(p.slug)}
                      className="text-left text-[#c9a96e] hover:underline text-sm truncate block max-w-full"
                    >
                      {p.title}
                    </button>
                    <div className="text-[0.62rem] text-[#6a5a3a] font-mono mt-0.5">{p.slug}</div>
                  </td>
                  <td className="py-2.5 px-3 text-[#8a7a5a] text-xs whitespace-nowrap">
                    {p.category || '—'}
                  </td>
                  <td className="py-2.5 px-3 text-[#7a6a50] text-xs whitespace-nowrap">
                    {p.date_published || '—'}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[0.6rem] tracking-wide uppercase px-2 py-0.5 rounded ${
                        p.is_published
                          ? 'bg-[rgba(80,200,80,0.1)] text-[#70c070]'
                          : 'bg-white/[0.04] text-[#8a7a5a]'
                      }`}
                    >
                      {p.is_published ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(p.slug)}
                        className="text-[0.7rem] border border-[rgba(201,169,110,0.25)] text-[#c9a96e] px-3 py-1 rounded hover:bg-[rgba(201,169,110,0.08)] transition-colors"
                      >
                        Edit →
                      </button>
                      <button
                        onClick={() => onDelete(p.slug, p.title)}
                        className="text-[0.7rem] border border-[rgba(200,80,80,0.2)] text-[#c06050] px-3 py-1 rounded hover:bg-[rgba(200,80,80,0.06)] transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && (
            <p className="text-[#7a6a4a] text-sm text-center py-10 border border-dashed border-[rgba(201,169,110,0.12)] rounded-xl mt-2">
              No posts yet — create the first one.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Upload helper ───────────────────────────────────────────────────────────

async function uploadPhoto(
  file: File,
  onStatus: (s: string, ok: boolean) => void,
): Promise<string | null> {
  onStatus('Uploading…', false);
  try {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const res = await fetch('/api/admin?section=upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64, filename: file.name, mimeType: file.type, uploadType: 'admin' }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    onStatus('✓ Done!', true);
    setTimeout(() => onStatus('', true), 3000);
    return data.url as string;
  } catch (e) {
    onStatus(`✗ ${(e as Error).message}`, false);
    return null;
  }
}

// ─── Cover upload button ──────────────────────────────────────────────────────

function CoverUploadButton({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [status, setStatus] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadPhoto(file, (s) => setStatus(s));
    if (url) onUploaded(url);
    e.target.value = '';
  };

  return (
    <div className="flex items-center gap-2">
      <label className="cursor-pointer">
        <span className="inline-block bg-[rgba(201,169,110,0.12)] border border-[rgba(201,169,110,0.3)] text-[#c9a96e] px-3 py-1 rounded-md text-[0.72rem] hover:bg-[rgba(201,169,110,0.2)] transition-colors">
          📁 PC থেকে Upload
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFile}
        />
      </label>
      {status && (
        <span
          className={`text-[0.7rem] ${
            status.startsWith('✓') ? 'text-[#6aaa7a]' : status.startsWith('✗') ? 'text-[#e08060]' : 'text-[#8a7a5a]'
          }`}
        >
          {status}
        </span>
      )}
    </div>
  );
}

// ─── Inline photo slots ───────────────────────────────────────────────────────

function InlinePhotoSlots({
  photos,
  onChange,
}: {
  photos: string[];
  onChange: (idx: number, url: string) => void;
}) {
  const [statuses, setStatuses] = React.useState<string[]>(Array(PHOTO_SLOTS).fill(''));

  const setStatus = (idx: number, s: string) =>
    setStatuses((prev) => { const n = [...prev]; n[idx] = s; return n; });

  const handleFile = async (idx: number, file: File) => {
    const url = await uploadPhoto(file, (s, ok) => setStatus(idx, ok && s.startsWith('✓') ? s : s));
    if (url) onChange(idx, url);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-[#8a7a5a]">
        Content-এ যেখানে photo দিতে চাও সেখানে{' '}
        {Array.from({ length: PHOTO_SLOTS }, (_, i) => (
          <span key={i}>
            <code className="bg-white/[0.06] px-1 rounded text-[#c9a96e] text-[0.7rem]">
              [photo-{i + 1}]
            </code>
            {i < PHOTO_SLOTS - 1 ? ', ' : ''}
          </span>
        ))}{' '}
        লিখো — ওই জায়গায় ছবি বসবে।
      </p>

      {Array.from({ length: PHOTO_SLOTS }, (_, i) => {
        const url = photos[i] || '';
        return (
          <div
            key={i}
            className="flex gap-3 items-start bg-white/[0.025] border border-[rgba(201,169,110,0.1)] rounded-lg p-3"
          >
            {/* Thumbnail */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}
              alt=""
              className="w-[72px] h-[54px] object-cover rounded-md flex-shrink-0 bg-[#1e1a14]"
              style={{ opacity: url ? 1 : 0.15 }}
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.15'; }}
            />

            <div className="flex-1 min-w-0">
              <div className="text-[0.62rem] text-[#8a7a5a] mb-1">
                Photo {i + 1} — <code className="text-[#c9a96e]">[photo-{i + 1}]</code>
              </div>
              <input
                type="text"
                className={INPUT + ' text-xs mb-1.5'}
                value={url}
                onChange={(e) => onChange(i, e.target.value)}
                placeholder="URL paste করো অথবা নিচের বাটন দিয়ে upload করো"
              />
              <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                  <span className="inline-block bg-[rgba(201,169,110,0.12)] border border-[rgba(201,169,110,0.3)] text-[#c9a96e] px-3 py-1 rounded-md text-[0.72rem] hover:bg-[rgba(201,169,110,0.2)] transition-colors">
                    📁 Upload
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(i, file);
                      e.target.value = '';
                    }}
                  />
                </label>
                {statuses[i] && (
                  <span
                    className={`text-[0.7rem] ${
                      statuses[i].startsWith('✓') ? 'text-[#6aaa7a]' : statuses[i].startsWith('✗') ? 'text-[#e08060]' : 'text-[#8a7a5a]'
                    }`}
                  >
                    {statuses[i]}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Post editor ──────────────────────────────────────────────────────────────

function PostEditor({
  editSlug,
  onDone,
  onCancel,
}: {
  editSlug: string | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const isNew = editSlug === null;
  const [form, setForm] = useState<PostForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    if (isNew) return;
    api('get_post', { slug: editSlug }).then(({ data }) => {
      if (data.post) {
        const p = data.post;
        const savedPhotos: string[] = Array.isArray(p.inline_photos) ? p.inline_photos : [];
        const photos = Array.from({ length: PHOTO_SLOTS }, (_, i) => savedPhotos[i] || '');
        setForm({
          title: p.title || '',
          slug: p.slug || '',
          description: p.description || '',
          content: p.content || '',
          category: p.category || '',
          cover_image_url: p.cover_image_url || '',
          read_time: p.read_time || '',
          hero_emoji: p.hero_emoji || '✈️',
          date_published: p.date_published || '',
          is_published: !!p.is_published,
          inline_photos: photos,
        });
      }
      setLoading(false);
    });
  }, [isNew, editSlug]);

  function set<K extends keyof PostForm>(k: K, v: PostForm[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function setPhoto(idx: number, url: string) {
    setForm((f) => {
      const photos = [...f.inline_photos];
      photos[idx] = url;
      return { ...f, inline_photos: photos };
    });
  }

  const handleTitle = (t: string) =>
    setForm((f) => ({ ...f, title: t, ...(isNew ? { slug: toSlug(t) } : {}) }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFlash(null);
    const payload = {
      ...form,
      inline_photos: form.inline_photos.filter((u) => u.trim()),
    };
    const { ok, data } = await api(isNew ? 'create_post' : 'update_post', payload);
    setSaving(false);
    if (ok) {
      if (isNew && data.slug) {
        setFlash({ type: 'ok', text: `Created — slug: ${data.slug}` });
        setTimeout(onDone, 1200);
      } else {
        setFlash({ type: 'ok', text: 'Saved successfully.' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setFlash({ type: 'err', text: data.error || 'Save failed — try again.' });
    }
  };

  if (loading) {
    return <div className="text-[#7a6a4a] text-sm py-8">Loading post…</div>;
  }

  return (
    <div>
      <button
        onClick={onCancel}
        className="text-[0.72rem] text-[#8a7a5a] hover:text-[#c9a96e] mb-4 transition-colors block"
      >
        ← Back to posts
      </button>

      <h1 className="font-serif text-3xl font-light text-[#e8dcc8] mb-6">
        {isNew ? 'New Post' : 'Edit Post'}
      </h1>

      {flash && (
        <div
          className={`rounded-lg px-4 py-2.5 mb-5 text-sm ${
            flash.type === 'ok'
              ? 'bg-[rgba(80,200,80,0.08)] border border-[rgba(80,200,80,0.2)] text-[#70c070]'
              : 'bg-[rgba(200,80,80,0.08)] border border-[rgba(200,80,80,0.2)] text-[#c06050]'
          }`}
        >
          {flash.text}
        </div>
      )}

      <form onSubmit={save} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
          <div>
            <label className={LABEL}>Title *</label>
            <input
              className={INPUT}
              value={form.title}
              onChange={(e) => handleTitle(e.target.value)}
              placeholder="Article title"
              required
            />
          </div>
          <div>
            <label className={LABEL}>Slug (auto-generated)</label>
            <input
              className={INPUT + ' font-mono text-xs text-[#9a8a70]'}
              value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
              placeholder="url-friendly-slug"
            />
          </div>
        </div>

        <div>
          <label className={LABEL}>Description / Excerpt</label>
          <textarea
            className={INPUT}
            rows={3}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Short summary for SEO and blog cards"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={LABEL}>Category</label>
            <select
              className={INPUT + ' bg-[#0e0c08]'}
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL}>Publish Date</label>
            <input
              type="date"
              className={INPUT + ' bg-[#0e0c08]'}
              value={form.date_published}
              onChange={(e) => set('date_published', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL}>Read Time</label>
            <input
              className={INPUT}
              placeholder="8 min read"
              value={form.read_time}
              onChange={(e) => set('read_time', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL}>Hero Emoji</label>
            <input
              className={INPUT + ' text-center text-lg'}
              value={form.hero_emoji}
              onChange={(e) => set('hero_emoji', e.target.value)}
              placeholder="✈️"
              maxLength={4}
            />
          </div>
        </div>

        <div>
          <label className={LABEL}>Cover Image</label>
          <div className="flex gap-3 items-start bg-white/[0.025] border border-[rgba(201,169,110,0.1)] rounded-lg p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.cover_image_url || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}
              alt=""
              className="w-[90px] h-[67px] object-cover rounded-md flex-shrink-0 bg-[#1e1a14]"
              style={{ opacity: form.cover_image_url ? 1 : 0.15 }}
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.15'; }}
            />
            <div className="flex-1 min-w-0">
              <input
                className={INPUT + ' mb-2'}
                placeholder="https://… (URL paste করো)"
                value={form.cover_image_url}
                onChange={(e) => set('cover_image_url', e.target.value)}
              />
              <CoverUploadButton
                onUploaded={(url) => set('cover_image_url', url)}
              />
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => set('is_published', e.target.checked)}
            className="w-4 h-4 accent-[#c9a96e] rounded"
          />
          <span className="text-sm text-[#9a8a70]">
            Published{' '}
            <span className="text-[#8a7a5a] text-xs">(visible on /blog)</span>
          </span>
        </label>

        <div>
          <label className={LABEL}>Inline Photos (Article-এ ছড়িয়ে দেওয়া হবে)</label>
          <InlinePhotoSlots
            photos={form.inline_photos}
            onChange={setPhoto}
          />
        </div>

        <div>
          <label className={LABEL}>Content (HTML)</label>
          <textarea
            className={INPUT + ' font-mono text-xs leading-relaxed'}
            rows={22}
            value={form.content}
            onChange={(e) => set('content', e.target.value)}
            placeholder="<p>Article content here…</p>&#10;&#10;Use [photo-1], [photo-2] etc. to place inline photos"
          />
        </div>

        <div className="flex gap-3 pt-2 pb-8 border-t border-[rgba(201,169,110,0.1)]">
          <button type="submit" disabled={saving} className={BTN}>
            {saving ? 'Saving…' : isNew ? 'Create Draft →' : 'Save Changes'}
          </button>
          {!isNew && editSlug && (
            <a href={`/blog/${editSlug}`} target="_blank" className={BTN_GHOST}>
              View Live ↗
            </a>
          )}
          <button type="button" onClick={onCancel} className={BTN_GHOST}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

const NAV: { s: Section; label: string; short: string; icon: string; group: 'Dashboard' | 'Content' }[] = [
  { s: 'overview', label: 'Overview', short: 'Home', icon: '📊', group: 'Dashboard' },
  { s: 'health', label: 'Website health', short: 'Health', icon: '🩺', group: 'Dashboard' },
  { s: 'posts', label: 'Blog posts', short: 'Posts', icon: '📝', group: 'Content' },
  { s: 'schedule', label: 'Blog schedule', short: 'Schedule', icon: '🗓️', group: 'Content' },
  { s: 'community', label: 'Community', short: 'Community', icon: '💬', group: 'Content' },
];

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [section, setSection] = useState<Section>('overview');
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [pending, setPending] = useState<number | null>(null);

  const refresh = useCallback(() => {
    setLoadingPosts(true);
    api('list_posts').then(({ data }) => {
      setPosts(data.posts || []);
      setLoadingPosts(false);
    });
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const go = useCallback((s: Section) => {
    setSection(s);
    window.scrollTo({ top: 0 });
  }, []);
  const editPost = (slug: string | null) => { setEditSlug(slug); go('editor'); };

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"?\n\nThis cannot be undone.`)) return;
    await api('delete_post', { slug });
    refresh();
  };

  const logout = async () => {
    await api('logout');
    onLogout();
  };

  const current = section === 'editor' ? 'posts' : section;
  const badge = (s: Section) => (s === 'community' && pending ? pending : 0);

  return (
    <div className="md:flex bg-[#111009] min-h-screen text-[#ede5d5]">
      {/* Sidebar (tablet and desktop) */}
      <aside className="hidden md:flex w-56 shrink-0 bg-[#0e0c08] border-r border-[rgba(201,169,110,0.1)] flex-col sticky top-0 h-screen overflow-hidden">
        <div className="px-5 py-6 border-b border-[rgba(201,169,110,0.1)] shrink-0">
          <div className="font-serif text-xl font-light tracking-[0.35em] text-[#d4aa6e] uppercase">Atlas</div>
          <div className="text-[0.58rem] tracking-[0.15em] uppercase text-[#7a6a4a] mt-0.5">Admin Panel</div>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {(['Dashboard', 'Content'] as const).map((g) => (
            <div key={g}>
              <div className="text-[0.55rem] tracking-[0.15em] uppercase text-[#6a5a3a] px-5 pt-4 pb-1.5">{g}</div>
              {NAV.filter((n) => n.group === g).map((n) => {
                const active = current === n.s;
                return (
                  <button
                    key={n.s}
                    type="button"
                    onClick={() => go(n.s)}
                    className={`flex items-center gap-2.5 w-full px-5 py-2.5 text-left text-[0.8rem] transition-all border-l-2 ${
                      active
                        ? 'text-[#c9a96e] bg-[rgba(201,169,110,0.06)] border-l-[#c9a96e]'
                        : 'text-[#9a8a6a] hover:text-[#c9a96e] hover:bg-[rgba(201,169,110,0.03)] border-l-transparent'
                    }`}
                  >
                    <span aria-hidden="true">{n.icon}</span>
                    <span className="flex-1">{n.label}</span>
                    {badge(n.s) ? <span className="text-[0.62rem] bg-[#e0a040] text-[#1c1914] rounded-full px-1.5 min-w-[1.2rem] text-center font-semibold">{badge(n.s)}</span> : null}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-[rgba(201,169,110,0.1)] shrink-0 flex items-center justify-between">
          <a href="/" target="_blank" rel="noreferrer" className="text-[0.72rem] text-[#7a6a4a] hover:text-[#c9a96e]">getatlas.ca ↗</a>
          <button type="button" onClick={logout} className="text-[0.72rem] text-[#7a6a4a] hover:text-[#c9a96e] transition-colors">Logout</button>
        </div>
      </aside>

      {/* Top bar (phone) */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#0e0c08]/95 backdrop-blur border-b border-[rgba(201,169,110,0.12)]">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-lg font-light tracking-[0.3em] text-[#d4aa6e] uppercase">Atlas</span>
          <span className="text-[0.58rem] tracking-[0.15em] uppercase text-[#7a6a4a]">Admin</span>
        </div>
        <button type="button" onClick={logout} className="text-[0.75rem] text-[#9a8a6a] border border-[rgba(201,169,110,0.2)] rounded-full px-3 py-1">Logout</button>
      </header>

      <main className="flex-1 min-w-0 px-4 md:px-8 pt-6 md:pt-8 pb-28 md:pb-10 max-w-5xl">
        {section === 'overview' && (
          <OverviewPanel onGo={go} onNewPost={() => editPost(null)} onPending={setPending} legalCard={<><LegalNoticeCard /><NewsletterCard /></>} />
        )}

        {section === 'posts' && (
          <>
            <h1 className="font-serif text-2xl md:text-3xl font-light text-[#e8dcc8] mb-6">Blog Posts</h1>
            <PostsTable
              posts={posts}
              loading={loadingPosts}
              onEdit={(slug) => editPost(slug)}
              onDelete={handleDelete}
              onNew={() => editPost(null)}
            />
          </>
        )}

        {section === 'schedule' && (
          <SchedulePanel posts={posts} loading={loadingPosts} onEdit={(slug) => editPost(slug)} onNew={() => editPost(null)} />
        )}

        {section === 'community' && <CommunityPanel onPending={setPending} />}

        {section === 'health' && <HealthPanel />}

        {section === 'editor' && (
          <PostEditor
            editSlug={editSlug}
            onDone={() => { refresh(); go('posts'); }}
            onCancel={() => go('posts')}
          />
        )}
      </main>

      {/* Bottom tabs (phone) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 grid grid-cols-5 bg-[#0e0c08]/95 backdrop-blur border-t border-[rgba(201,169,110,0.15)] pb-[env(safe-area-inset-bottom)]" aria-label="Admin sections">
        {NAV.map((n) => {
          const active = current === n.s;
          return (
            <button key={n.s} type="button" onClick={() => go(n.s)}
              className={`relative flex flex-col items-center gap-0.5 py-2 text-[0.62rem] ${active ? 'text-[#c9a96e]' : 'text-[#8a7a5a]'}`}>
              <span className="text-[1.15rem] leading-none" aria-hidden="true">{n.icon}</span>
              {n.short}
              {badge(n.s) ? <span className="absolute top-1 right-[22%] text-[0.55rem] bg-[#e0a040] text-[#1c1914] rounded-full px-1 min-w-[1rem] text-center font-semibold">{badge(n.s)}</span> : null}
              {active && <span className="absolute top-0 inset-x-4 h-0.5 bg-[#c9a96e] rounded-full" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    api('check_auth').then(({ ok }) => setAuthed(ok));
  }, []);

  if (authed === null) {
    return (
      <div className="min-h-screen bg-[#111009] flex items-center justify-center">
        <div className="text-[#7a6a4a] text-xs tracking-widest uppercase animate-pulse">
          Loading…
        </div>
      </div>
    );
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
}
