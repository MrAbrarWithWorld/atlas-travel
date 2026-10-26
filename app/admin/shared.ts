// Shared helpers and styles for the admin panel (/admin).

export async function api(action: string, data: Record<string, unknown> = {}) {
  const res = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ action, ...data }),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data: json };
}

export const INPUT =
  'w-full bg-white/[0.04] border border-[rgba(201,169,110,0.18)] rounded-lg px-3 py-2 text-[#ede5d5] text-sm focus:outline-none focus:border-[rgba(201,169,110,0.45)] transition-colors';
export const LABEL =
  'block text-[0.62rem] tracking-[0.1em] uppercase text-[#8a7a5a] mb-1.5';
export const BTN =
  'bg-[#c9a96e] text-[#1c1914] px-5 py-2 rounded-lg text-sm font-semibold tracking-wide hover:bg-[#e0c080] transition-colors disabled:opacity-50 cursor-pointer';
export const BTN_GHOST =
  'border border-[rgba(201,169,110,0.25)] text-[#c9a96e] px-4 py-2 rounded-lg text-sm hover:bg-[rgba(201,169,110,0.08)] transition-colors cursor-pointer disabled:opacity-50';
export const CARD = 'bg-[rgba(201,169,110,0.04)] border border-[rgba(201,169,110,0.12)] rounded-xl p-4';
export const KICKER = 'text-[0.6rem] tracking-[0.12em] uppercase text-[#8a7a5a]';
export const H1 = 'font-serif text-2xl md:text-3xl font-light text-[#e8dcc8]';
export const H2 = 'font-serif text-lg font-light text-[#c9a96e]';

export type Section = 'overview' | 'posts' | 'schedule' | 'community' | 'health' | 'editor';

export const fmt = (n: unknown) => (typeof n === 'number' ? n.toLocaleString('en-CA') : '—');

export function timeAgo(iso?: string | null) {
  if (!iso) return '';
  const s = Math.round((Date.now() - Date.parse(iso)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return new Date(iso).toLocaleDateString('en-CA');
}
