'use client';

import { useState, useEffect, useCallback } from 'react';

const ADMIN_HASH = '621aad9d761eb91c182b6e3ae030df560a38e806a43e7308ffe11564422b7c1a';
const LS_KEY = 'atlas_admin_auth';
const API = '/api/admin-crud';

// ─── Types ─────────────────────────────────────────────────────────────────────

type Post = {
  id: string;
  slug: string;
  title: string;
  category: string;
  is_published: boolean;
  date_published: string;
  description: string;
  cover_image_url: string;
  read_time: string;
  hero_emoji: string;
  content?: string;
};

type Stats = {
  newsletter: number;
  push: number;
  total_posts: number;
  published_posts: number;
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
};

type View =
  | { type: 'overview' }
  | { type: 'posts' }
  | { type: 'edit'; slug: string }
  | { type: 'create' };

// ─── Helpers ───────────────────────────────────────────────────────────────────

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function apiFetch(token: string, url: string, opts?: RequestInit) {
  return fetch(url, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(opts?.headers ?? {}),
    },
  });
}

function toSlug(t: string) {
  return t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const EMPTY_FORM: PostForm = {
  title: '',
  slug: '',
  description: '',
  content: '',
  category: '',
  cover_image_url: '',
  read_time: '',
  hero_emoji: '✈️',
  date_published: new Date().toISOString().slice(0, 10),
  is_published: false,
};

const CATEGORIES = [
  { value: '', label: 'Select category...' },
  { value: 'americas', label: 'Americas' },
  { value: 'europe', label: 'Europe' },
  { value: 'asia', label: 'Asia' },
  { value: 'southasia', label: 'South Asia' },
  { value: 'africa', label: 'Africa' },
  { value: 'middleeast', label: 'Middle East' },
  { value: 'oceania', label: 'Oceania' },
  { value: 'tips', label: 'Tips & Guides' },
  { value: 'culture', label: 'Culture' },
  { value: 'food', label: 'Food & Drink' },
];

// ─── Shared UI atoms ───────────────────────────────────────────────────────────

const INPUT =
  'w-full bg-white/[0.04] border border-[rgba(201,169,110,0.18)] rounded-lg px-3 py-2 text-[#ede5d5] text-sm focus:outline-none focus:border-[rgba(201,169,110,0.45)] transition-colors';
const LABEL =
  'block text-[0.62rem] tracking-[0.1em] uppercase text-[#5a4a2a] mb-1.5';
const BTN_PRIMARY =
  'bg-[#c9a96e] text-[#1c1914] px-5 py-2 rounded-lg text-sm font-semibold tracking-wide hover:bg-[#e0c080] transition-colors disabled:opacity-50 cursor-pointer';
const BTN_GHOST =
  'border border-[rgba(201,169,110,0.25)] text-[#c9a96e] px-4 py-2 rounded-lg text-sm hover:bg-[rgba(201,169,110,0.08)] transition-colors cursor-pointer';
const BTN_DANGER =
  'border border-[rgba(200,80,80,0.25)] text-[#c06050] px-3 py-1.5 rounded-md text-[0.7rem] hover:bg-[rgba(200,80,80,0.08)] transition-colors cursor-pointer';

// ─── Login ─────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (t: string) => void }) {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      const h = await sha256(pwd);
      if (h === ADMIN_HASH) {
        localStorage.setItem(LS_KEY, h);
        onLogin(h);
      } else {
        setErr('Wrong password — try again.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111009] flex items-center justify-center px-4">
      <div className="w-72 text-center">
        <div className="font-[Cormorant_Garamond,serif] text-[2.2rem] font-light tracking-[0.4em] text-[#d4aa6e] uppercase mb-1">
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
          <button type="submit" disabled={busy} className={BTN_PRIMARY + ' w-full py-3'}>
            {busy ? '...' : 'Enter →'}
          </button>
          {err && <p className="text-[#c06050] text-xs">{err}</p>}
        </form>
      </div>
    </div>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({
  view,
  onNav,
  onLogout,
}: {
  view: View;
  onNav: (v: View) => void;
  onLogout: () => void;
}) {
  type NavItem = { v: View; icon: string; label: string; activeOn: View['type'][] };
  const items: NavItem[] = [
    { v: { type: 'overview' }, icon: '◈', label: 'Overview', activeOn: ['overview'] },
    { v: { type: 'posts' }, icon: '◻', label: 'Blog Posts', activeOn: ['posts', 'edit'] },
    { v: { type: 'create' }, icon: '+', label: 'New Post', activeOn: ['create'] },
  ];

  return (
    <aside className="w-52 min-h-screen bg-[#0e0c08] border-r border-[rgba(201,169,110,0.1)] flex flex-col flex-shrink-0 sticky top-0 h-screen">
      <div className="px-5 py-6 border-b border-[rgba(201,169,110,0.1)]">
        <div className="font-[Cormorant_Garamond,serif] text-xl font-light tracking-[0.35em] text-[#d4aa6e] uppercase">
          Atlas
        </div>
        <div className="text-[0.58rem] tracking-[0.15em] uppercase text-[#4a3a1a] mt-0.5">
          Admin Panel
        </div>
      </div>

      <nav className="flex-1 py-3">
        <div className="text-[0.58rem] tracking-[0.15em] uppercase text-[#3a2a0a] px-5 py-2">
          Dashboard
        </div>
        {items.map((item) => {
          const isActive = item.activeOn.includes(view.type);
          return (
            <button
              key={item.label}
              onClick={() => onNav(item.v)}
              className={`flex items-center gap-2.5 w-full px-5 py-2.5 text-left text-[0.78rem] transition-all border-l-2 ${
                isActive
                  ? 'text-[#c9a96e] bg-[rgba(201,169,110,0.06)] border-l-[#c9a96e]'
                  : 'text-[#6a5a3a] hover:text-[#c9a96e] hover:bg-[rgba(201,169,110,0.04)] border-l-transparent'
              }`}
            >
              <span className="text-xs w-4 text-center font-mono">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-[rgba(201,169,110,0.1)]">
        <button
          onClick={onLogout}
          className="text-[0.7rem] text-[#4a3a1a] hover:text-[#c9a96e] transition-colors"
        >
          ← Logout
        </button>
      </div>
    </aside>
  );
}

// ─── Overview ──────────────────────────────────────────────────────────────────

function Overview({ token }: { token: string }) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    apiFetch(token, `${API}?action=get_stats`)
      .then((r) => r.json())
      .then((d) => setStats(d));
  }, [token]);

  return (
    <div>
      <h1 className="font-[Cormorant_Garamond,serif] text-3xl font-light text-[#e8dcc8] mb-6">
        Overview
      </h1>

      {stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(
            [
              ['Total Posts', stats.total_posts],
              ['Published', stats.published_posts],
              ['Newsletter Subs', stats.newsletter ?? '—'],
              ['Push Subs', stats.push ?? '—'],
            ] as [string, number | string][]
          ).map(([label, value]) => (
            <div
              key={label}
              className="bg-[rgba(201,169,110,0.04)] border border-[rgba(201,169,110,0.12)] rounded-xl p-5"
            >
              <div className="text-[0.6rem] tracking-[0.12em] uppercase text-[#5a4a2a] mb-1">
                {label}
              </div>
              <div className="font-[Cormorant_Garamond,serif] text-4xl font-light text-[#e8dcc8]">
                {value}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-[#4a3a1a] text-sm mb-8">Loading stats...</div>
      )}

      <div className="border border-[rgba(201,169,110,0.1)] rounded-xl p-5 text-sm text-[#6a5a3a] space-y-2">
        <p className="font-[Cormorant_Garamond,serif] text-[#c9a96e] text-base font-light mb-3">
          Quick links
        </p>
        <a href="/blog" target="_blank" className="block hover:text-[#c9a96e] transition-colors">
          → getatlas.ca/blog
        </a>
        <a href="/api/admin" target="_blank" className="block hover:text-[#c9a96e] transition-colors">
          → Legacy admin panel (/api/admin)
        </a>
      </div>
    </div>
  );
}

// ─── Posts List ────────────────────────────────────────────────────────────────

function PostsList({
  token,
  onEdit,
  onCreate,
}: {
  token: string;
  onEdit: (slug: string) => void;
  onCreate: () => void;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    apiFetch(token, `${API}?action=list_posts`)
      .then((r) => r.json())
      .then((d) => {
        setPosts(d.posts || []);
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const del = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"?\n\nThis cannot be undone.`)) return;
    setDeleting(slug);
    await apiFetch(token, API, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete_post', slug }),
    });
    setDeleting(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[Cormorant_Garamond,serif] text-3xl font-light text-[#e8dcc8]">
          Blog Posts
        </h1>
        <button onClick={onCreate} className={BTN_PRIMARY}>
          + New Post
        </button>
      </div>

      {loading ? (
        <div className="text-[#4a3a1a] text-sm py-4">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[rgba(201,169,110,0.15)]">
                {['Title', 'Category', 'Date', 'Status', ''].map((h) => (
                  <th
                    key={h}
                    className="text-left py-2 px-3 text-[0.62rem] tracking-[0.1em] uppercase text-[#7a6a50] font-normal"
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
                  className="border-b border-[rgba(201,169,110,0.06)] hover:bg-[rgba(201,169,110,0.02)] transition-colors"
                >
                  <td className="py-2.5 px-3 max-w-xs">
                    <button
                      onClick={() => onEdit(p.slug)}
                      className="text-left text-[#c9a96e] hover:underline text-sm truncate block max-w-full"
                    >
                      {p.title}
                    </button>
                  </td>
                  <td className="py-2.5 px-3 text-[#5a4a2a] text-xs whitespace-nowrap">
                    {p.category || '—'}
                  </td>
                  <td className="py-2.5 px-3 text-[#9a8a70] text-xs whitespace-nowrap">
                    {p.date_published || '—'}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[0.6rem] tracking-[0.06em] uppercase px-2 py-0.5 rounded ${
                        p.is_published
                          ? 'bg-[rgba(80,200,80,0.1)] text-[#70c070]'
                          : 'bg-white/[0.04] text-[#5a4a2a]'
                      }`}
                    >
                      {p.is_published ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => onEdit(p.slug)}
                        className={BTN_GHOST + ' text-[0.7rem] px-3 py-1.5'}
                      >
                        Edit →
                      </button>
                      <button
                        onClick={() => del(p.slug, p.title)}
                        disabled={deleting === p.slug}
                        className={BTN_DANGER}
                      >
                        {deleting === p.slug ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && (
            <p className="text-[#4a3a1a] text-sm mt-6 text-center py-8 border border-dashed border-[rgba(201,169,110,0.12)] rounded-xl">
              No posts yet — create your first one.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Post Editor ───────────────────────────────────────────────────────────────

function PostEditor({
  token,
  slug,
  isNew,
  onBack,
  onCreated,
}: {
  token: string;
  slug?: string;
  isNew: boolean;
  onBack: () => void;
  onCreated: (newSlug: string) => void;
}) {
  const [form, setForm] = useState<PostForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (isNew || !slug) return;
    apiFetch(token, `${API}?action=get_post&slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.post) {
          const p = d.post;
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
            is_published: p.is_published || false,
          });
        }
        setLoading(false);
      });
  }, [token, slug, isNew]);

  const set = <K extends keyof PostForm>(k: K, v: PostForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleTitle = (t: string) => {
    setForm((f) => ({ ...f, title: t, ...(isNew ? { slug: toSlug(t) } : {}) }));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setErr('');
    try {
      const action = isNew ? 'create_post' : 'update_post';
      const payload = { action, ...form };
      const res = await apiFetch(token, API, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (!res.ok || d.error) throw new Error(d.error || 'Save failed');
      if (isNew && d.slug) {
        onCreated(d.slug);
      } else {
        setMsg('Saved ✓');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-[#4a3a1a] text-sm py-4">Loading post...</div>;

  return (
    <div>
      <button onClick={onBack} className="text-[0.72rem] text-[#5a4a2a] hover:text-[#c9a96e] mb-4 transition-colors block">
        ← Back to posts
      </button>

      <h1 className="font-[Cormorant_Garamond,serif] text-3xl font-light text-[#e8dcc8] mb-6">
        {isNew ? 'New Post' : 'Edit Post'}
      </h1>

      {msg && (
        <div className="bg-[rgba(80,200,80,0.08)] border border-[rgba(80,200,80,0.2)] rounded-lg px-4 py-2.5 mb-5 text-[#70c070] text-sm">
          {msg}
        </div>
      )}
      {err && (
        <div className="bg-[rgba(200,80,80,0.08)] border border-[rgba(200,80,80,0.2)] rounded-lg px-4 py-2.5 mb-5 text-[#c06050] text-sm">
          Error: {err}
        </div>
      )}

      <form onSubmit={save} className="space-y-5">
        {/* Title */}
        <div>
          <label className={LABEL}>Title</label>
          <input
            className={INPUT}
            value={form.title}
            onChange={(e) => handleTitle(e.target.value)}
            placeholder="Article title"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className={LABEL}>Slug</label>
          <input
            className={INPUT + ' font-mono text-xs text-[#9a8a70]'}
            value={form.slug}
            onChange={(e) => set('slug', e.target.value)}
            placeholder="url-friendly-slug"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className={LABEL}>Description / Excerpt</label>
          <textarea
            className={INPUT}
            rows={3}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Short summary for SEO and cards"
          />
        </div>

        {/* Meta grid */}
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
              placeholder="e.g. 8 min read"
              value={form.read_time}
              onChange={(e) => set('read_time', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL}>Hero Emoji</label>
            <input
              className={INPUT}
              value={form.hero_emoji}
              onChange={(e) => set('hero_emoji', e.target.value)}
              placeholder="✈️"
            />
          </div>
        </div>

        {/* Cover image */}
        <div>
          <label className={LABEL}>Cover Image URL</label>
          <input
            className={INPUT}
            placeholder="https://..."
            value={form.cover_image_url}
            onChange={(e) => set('cover_image_url', e.target.value)}
          />
          {form.cover_image_url && (
            <img
              src={form.cover_image_url}
              alt=""
              className="mt-2 h-28 rounded-lg object-cover opacity-80"
              onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
            />
          )}
        </div>

        {/* Publish toggle */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => set('is_published', e.target.checked)}
            className="w-4 h-4 accent-[#c9a96e] rounded"
          />
          <span className="text-[#9a8a70] text-sm">
            Published{' '}
            <span className="text-[#5a4a2a] text-xs">(visible on /blog)</span>
          </span>
        </label>

        {/* Content */}
        <div>
          <label className={LABEL}>Content (HTML)</label>
          <textarea
            className={INPUT + ' font-mono text-xs leading-relaxed'}
            rows={22}
            value={form.content}
            onChange={(e) => set('content', e.target.value)}
            placeholder="<p>Article content here...</p>"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1 pb-8">
          <button type="submit" disabled={saving} className={BTN_PRIMARY}>
            {saving ? 'Saving...' : isNew ? 'Create Draft →' : 'Save Changes'}
          </button>
          {!isNew && slug && (
            <a
              href={`/blog/${slug}`}
              target="_blank"
              className={BTN_GHOST}
            >
              View Live ↗
            </a>
          )}
        </div>
      </form>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [view, setView] = useState<View>({ type: 'overview' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = localStorage.getItem(LS_KEY);
    if (t === ADMIN_HASH) setToken(t);
  }, []);

  if (!mounted) return null;
  if (!token) return <LoginScreen onLogin={setToken} />;

  const logout = () => {
    localStorage.removeItem(LS_KEY);
    setToken(null);
  };

  const renderContent = () => {
    if (view.type === 'overview') return <Overview token={token} />;
    if (view.type === 'posts')
      return (
        <PostsList
          token={token}
          onEdit={(slug) => setView({ type: 'edit', slug })}
          onCreate={() => setView({ type: 'create' })}
        />
      );
    if (view.type === 'edit')
      return (
        <PostEditor
          token={token}
          slug={view.slug}
          isNew={false}
          onBack={() => setView({ type: 'posts' })}
          onCreated={() => setView({ type: 'posts' })}
        />
      );
    if (view.type === 'create')
      return (
        <PostEditor
          token={token}
          isNew
          onBack={() => setView({ type: 'posts' })}
          onCreated={(slug) => setView({ type: 'edit', slug })}
        />
      );
  };

  return (
    <div className="flex bg-[#111009] min-h-screen text-[#ede5d5]">
      <Sidebar view={view} onNav={setView} onLogout={logout} />
      <main className="flex-1 px-8 py-8 max-w-4xl overflow-y-auto">{renderContent()}</main>
    </div>
  );
}
