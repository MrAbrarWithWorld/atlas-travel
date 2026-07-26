'use client';

import React, { useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Post = {
  slug: string;
  title: string;
  category: string;
  is_published: boolean;
  date_published: string;
};

type Stats = {
  newsletter: number | null;
  push: number | null;
  users: number | null;
  posts: number | null;
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

// ─── API helper ───────────────────────────────────────────────────────────────

async function api(action: string, data: Record<string, unknown> = {}) {
  const res = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ action, ...data }),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data: json };
}

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

// ─── Shared styles ────────────────────────────────────────────────────────────

const INPUT =
  'w-full bg-white/[0.04] border border-[rgba(201,169,110,0.18)] rounded-lg px-3 py-2 text-[#ede5d5] text-sm focus:outline-none focus:border-[rgba(201,169,110,0.45)] transition-colors';
const LABEL =
  'block text-[0.62rem] tracking-[0.1em] uppercase text-[#5a4a2a] mb-1.5';
const BTN =
  'bg-[#c9a96e] text-[#1c1914] px-5 py-2 rounded-lg text-sm font-semibold tracking-wide hover:bg-[#e0c080] transition-colors disabled:opacity-50 cursor-pointer';
const BTN_GHOST =
  'border border-[rgba(201,169,110,0.25)] text-[#c9a96e] px-4 py-2 rounded-lg text-sm hover:bg-[rgba(201,169,110,0.08)] transition-colors cursor-pointer';

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
        <div className="text-[0.6rem] tracking-[0.15em] uppercase text-[#4a3a1a] mb-8">
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

// ─── Stats cards ─────────────────────────────────────────────────────────────

function StatCards({ stats }: { stats: Stats | null }) {
  const items: [string, number | null | undefined, string][] = [
    ['Newsletter Subs', stats?.newsletter, 'active'],
    ['Push Subs', stats?.push, 'subscribed'],
    ['Registered Users', stats?.users, 'total'],
    ['Published Posts', stats?.posts, 'live'],
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      {items.map(([label, value, sub]) => (
        <div
          key={label}
          className="bg-[rgba(201,169,110,0.04)] border border-[rgba(201,169,110,0.12)] rounded-xl p-4"
        >
          <div className="text-[0.58rem] tracking-[0.12em] uppercase text-[#5a4a2a] mb-1">{label}</div>
          <div className="font-serif text-[2rem] font-light text-[#e8dcc8] leading-tight">
            {stats === null ? '…' : (value ?? '—')}
          </div>
          <div className="text-[0.65rem] text-[#6a5a3a] mt-1">{sub}</div>
        </div>
      ))}
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
            <span className="font-sans text-sm text-[#5a4a2a] font-normal">
              ({posts.length})
            </span>
          )}
        </h2>
        <button onClick={onNew} className={BTN + ' text-xs px-4 py-1.5'}>
          + New Post
        </button>
      </div>

      {loading ? (
        <div className="text-[#4a3a1a] text-sm py-6">Loading posts…</div>
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
                    <div className="text-[0.62rem] text-[#3a2a0a] font-mono mt-0.5">{p.slug}</div>
                  </td>
                  <td className="py-2.5 px-3 text-[#5a4a2a] text-xs whitespace-nowrap">
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
                          : 'bg-white/[0.04] text-[#5a4a2a]'
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
            <p className="text-[#4a3a1a] text-sm text-center py-10 border border-dashed border-[rgba(201,169,110,0.12)] rounded-xl mt-2">
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
      <p className="text-xs text-[#5a4a2a]">
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
              <div className="text-[0.62rem] text-[#5a4a2a] mb-1">
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
    return <div className="text-[#4a3a1a] text-sm py-8">Loading post…</div>;
  }

  return (
    <div>
      <button
        onClick={onCancel}
        className="text-[0.72rem] text-[#5a4a2a] hover:text-[#c9a96e] mb-4 transition-colors block"
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
            <span className="text-[#5a4a2a] text-xs">(visible on /blog)</span>
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

type Section = 'overview' | 'posts' | 'editor';

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [section, setSection] = useState<Section>('overview');
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const refresh = useCallback(() => {
    setLoadingPosts(true);
    api('list_posts').then(({ data }) => {
      setPosts(data.posts || []);
      setLoadingPosts(false);
    });
    api('get_stats').then(({ data }) => setStats(data));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"?\n\nThis cannot be undone.`)) return;
    await api('delete_post', { slug });
    refresh();
  };

  const navBtn = (label: string, s: Section) => {
    const active = section === s;
    return (
      <button
        onClick={() => setSection(s)}
        className={`flex items-center gap-2.5 w-full px-5 py-2.5 text-left text-[0.78rem] transition-all border-l-2 ${
          active
            ? 'text-[#c9a96e] bg-[rgba(201,169,110,0.06)] border-l-[#c9a96e]'
            : 'text-[#6a5a3a] hover:text-[#c9a96e] hover:bg-[rgba(201,169,110,0.03)] border-l-transparent'
        }`}
      >
        {label}
      </button>
    );
  };

  const logout = async () => {
    await api('logout');
    onLogout();
  };

  return (
    <div className="flex bg-[#111009] min-h-screen text-[#ede5d5]">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 bg-[#0e0c08] border-r border-[rgba(201,169,110,0.1)] flex flex-col sticky top-0 h-screen overflow-hidden">
        <div className="px-5 py-6 border-b border-[rgba(201,169,110,0.1)] shrink-0">
          <div className="font-serif text-xl font-light tracking-[0.35em] text-[#d4aa6e] uppercase">
            Atlas
          </div>
          <div className="text-[0.58rem] tracking-[0.15em] uppercase text-[#4a3a1a] mt-0.5">
            Admin Panel
          </div>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          <div className="text-[0.55rem] tracking-[0.15em] uppercase text-[#3a2a0a] px-5 pt-3 pb-1.5">
            Dashboard
          </div>
          {navBtn('📊 Overview', 'overview')}
          <div className="text-[0.55rem] tracking-[0.15em] uppercase text-[#3a2a0a] px-5 pt-4 pb-1.5">
            Content
          </div>
          {navBtn('📝 Blog Posts', 'posts')}
        </nav>

        <div className="px-5 py-4 border-t border-[rgba(201,169,110,0.1)] shrink-0">
          <button
            onClick={logout}
            className="text-[0.72rem] text-[#4a3a1a] hover:text-[#c9a96e] transition-colors"
          >
            ← Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 px-8 py-8 max-w-4xl overflow-y-auto">
        {section === 'overview' && (
          <>
            <h1 className="font-serif text-3xl font-light text-[#e8dcc8] mb-6">Overview</h1>
            <StatCards stats={stats} />
            <div className="border-t border-[rgba(201,169,110,0.1)] pt-6">
              <div className="font-serif text-lg font-light text-[#c9a96e] mb-4">Quick Actions</div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => { setEditSlug(null); setSection('editor'); }}
                  className={BTN}
                >
                  + New Post
                </button>
                <button onClick={() => setSection('posts')} className={BTN_GHOST}>
                  View All Posts
                </button>
              </div>
            </div>
          </>
        )}

        {section === 'posts' && (
          <>
            <h1 className="font-serif text-3xl font-light text-[#e8dcc8] mb-6">Blog Posts</h1>
            <PostsTable
              posts={posts}
              loading={loadingPosts}
              onEdit={(slug) => { setEditSlug(slug); setSection('editor'); }}
              onDelete={handleDelete}
              onNew={() => { setEditSlug(null); setSection('editor'); }}
            />
          </>
        )}

        {section === 'editor' && (
          <PostEditor
            editSlug={editSlug}
            onDone={() => { refresh(); setSection('posts'); }}
            onCancel={() => setSection('posts')}
          />
        )}
      </main>
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
        <div className="text-[#4a3a1a] text-xs tracking-widest uppercase animate-pulse">
          Loading…
        </div>
      </div>
    );
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
}
