'use client';

// Admin panels: Overview, Community, Schedule and Website health.
// All numbers are read-only; the only write is approving or rejecting a community story.
import React, { useCallback, useEffect, useState, type ReactNode } from 'react';
import { api, BTN, BTN_GHOST, CARD, H1, H2, KICKER, fmt, timeAgo, type Section } from './shared';

// ─── Types ───────────────────────────────────────────────────────────────────

type Err = { error: string };
type Maybe<T> = T | Err;
const isErr = (x: unknown): x is Err => !!x && typeof x === 'object' && 'error' in (x as object);
const num = (x: unknown) => (typeof x === 'number' ? x : null);

export type Overview = {
  accounts: Maybe<{ total: number; new7: number; new30: number; active7: number }>;
  subscriptions: Maybe<{ active: number; byPlan: Record<string, number>; byChannel: { website: number; googlePlay: number } }>;
  aiCost: Maybe<{ usd: number; calls: number; since: string }>;
  freeAccess: Maybe<number>;
  savedTrips: Maybe<number>;
  sharedTrips: Maybe<number>;
  newsletter: Maybe<number>;
  push: Maybe<number>;
  communityPending: Maybe<number>;
  postsLive: Maybe<number>;
  postsDraft: Maybe<number>;
  generatedAt: string;
};

type LegalDoc = { slug: string; title: string; shortTitle: string; version: string; effective: string; url: string };
export type Health = {
  checkedAt: string;
  pages: { path: string; status: number; ms: number; error?: string }[];
  legal: LegalDoc[] | null;
  termsBannerLive: boolean | null;
  keys: Record<string, boolean>;
  version: { commit: string | null; message: string | null; environment: string };
};

type CommunityPost = {
  id: string;
  user_name: string | null;
  user_email: string | null;
  title: string | null;
  destination: string | null;
  excerpt: string | null;
  content: string | null;
  cover_photo: string | null;
  status: 'pending' | 'approved' | 'rejected' | string;
  created_at: string;
};

export type Post = { slug: string; title: string; category: string; is_published: boolean; date_published: string };

const todayToronto = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });
const niceDate = (ymd: string) =>
  new Date(`${ymd}T12:00:00Z`).toLocaleDateString('en-CA', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const pageOk = (status: number) => status >= 200 && status < 400;
const VERCEL_ANALYTICS = 'https://vercel.com/mrabrarwithworlds-projects/atlas-travel/analytics';
const LIST_BOX = 'bg-[rgba(201,169,110,0.04)] border border-[rgba(201,169,110,0.12)] rounded-xl overflow-hidden';

// ─── Small pieces ────────────────────────────────────────────────────────────

function Tile({ label, value, sub, onClick, tone }: { label: string; value: ReactNode; sub?: ReactNode; onClick?: () => void; tone?: 'warn' }) {
  const cls = `${CARD} text-left ${onClick ? 'hover:border-[rgba(201,169,110,0.35)] transition-colors cursor-pointer' : ''} ${tone === 'warn' ? 'border-[rgba(230,160,60,0.45)]' : ''}`;
  const body = (
    <>
      <div className={`${KICKER} mb-1`}>{label}</div>
      <div className="font-serif text-[1.9rem] font-light text-[#e8dcc8] leading-tight">{value}</div>
      {sub ? <div className="text-[0.7rem] text-[#9a8a6a] mt-1 leading-snug">{sub}</div> : null}
    </>
  );
  return onClick ? <button type="button" onClick={onClick} className={cls}>{body}</button> : <div className={cls}>{body}</div>;
}

function shown(x: unknown) {
  if (x === undefined) return '…';
  if (isErr(x)) return '—';
  return fmt(x);
}

type Alert = { tone: 'warn' | 'info' | 'ok'; text: string; go?: Section; action?: string };

function Alerts({ alerts, onGo }: { alerts: Alert[]; onGo: (s: Section) => void }) {
  const color = { warn: 'border-[rgba(230,160,60,0.45)] text-[#f0c070]', info: 'border-[rgba(120,170,230,0.35)] text-[#a9c6ee]', ok: 'border-[rgba(90,200,140,0.35)] text-[#8fd6a8]' };
  const icon = { warn: '⚠️', info: 'ℹ️', ok: '✓' };
  return (
    <div className="space-y-2 mb-8">
      {alerts.map((a, i) => (
        <div key={i} className={`flex items-start gap-3 rounded-xl border bg-white/[0.02] px-4 py-3 text-sm ${color[a.tone]}`}>
          <span aria-hidden="true">{icon[a.tone]}</span>
          <span className="flex-1 text-[#e8dcc8]">{a.text}</span>
          {a.go && (
            <button type="button" onClick={() => onGo(a.go!)} className="text-[0.75rem] text-[#c9a96e] hover:underline whitespace-nowrap">
              {a.action || 'Open'} →
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Overview ────────────────────────────────────────────────────────────────

export function OverviewPanel({ onGo, onNewPost, legalCard, onPending }: { onGo: (s: Section) => void; onNewPost: () => void; legalCard: ReactNode; onPending?: (n: number) => void }) {
  const [data, setData] = useState<Overview | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [failed, setFailed] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setFailed('');
    api('get_overview').then(({ ok, data: d }) => {
      setLoading(false);
      if (!ok) return setFailed(d?.error || 'Could not load the numbers.');
      setData(d as Overview);
      const pending = num((d as Overview).communityPending);
      if (pending !== null) onPending?.(pending);
    });
    api('site_health').then(({ ok, data: d }) => ok && setHealth(d as Health));
  }, [onPending]);
  useEffect(() => { load(); }, [load]);

  const acc = data && !isErr(data.accounts) ? data.accounts : null;
  const subs = data && !isErr(data.subscriptions) ? data.subscriptions : null;
  const ai = data && !isErr(data.aiCost) ? data.aiCost : null;
  const pending = data ? num(data.communityPending) : null;

  const alerts: Alert[] = [];
  if (failed) alerts.push({ tone: 'warn', text: failed });
  if (pending) alerts.push({ tone: 'warn', text: `${pending} community ${pending === 1 ? 'story is' : 'stories are'} waiting for your review.`, go: 'community', action: 'Review' });
  if (health) {
    const down = health.pages.filter((p) => !pageOk(p.status));
    if (down.length) alerts.push({ tone: 'warn', text: `${down.length} page${down.length > 1 ? 's' : ''} not loading: ${down.map((p) => p.path).join(', ')}`, go: 'health' });
    const missing = Object.entries(health.keys).filter(([, v]) => !v).map(([k]) => k);
    if (missing.length) alerts.push({ tone: 'warn', text: `Not set up in Vercel: ${missing.join(', ')}`, go: 'health' });
    const today = todayToronto();
    for (const d of health.legal || []) {
      if (d.effective > today) alerts.push({ tone: 'info', text: `${d.shortTitle || d.title} take${d.slug === 'terms' ? '' : 's'} effect on ${niceDate(d.effective)}.`, go: 'health', action: 'Details' });
    }
    const terms = (health.legal || []).find((d) => d.slug === 'terms');
    if (terms && terms.effective <= today && health.termsBannerLive) {
      alerts.push({ tone: 'warn', text: 'The Terms page still says "takes effect on…". Redeploy once in Vercel to remove it.', go: 'health' });
    }
  }
  if (data) {
    for (const [name, v] of Object.entries({ accounts: data.accounts, subscriptions: data.subscriptions, 'AI cost': data.aiCost })) {
      if (isErr(v)) alerts.push({ tone: 'warn', text: `Couldn't load ${name}: ${v.error}` });
    }
  }
  if (data && health && !alerts.some((a) => a.tone === 'warn')) alerts.unshift({ tone: 'ok', text: 'Everything looks good.' });

  const plans = subs ? Object.entries(subs.byPlan).map(([k, v]) => `${k.replace(/_/g, ' ')} ${v}`).join(' · ') : '';

  return (
    <>
      <div className="flex items-end justify-between gap-3 mb-6">
        <div>
          <h1 className={H1}>Overview</h1>
          {data && <div className="text-[0.72rem] text-[#8a7a5a] mt-1">Updated {timeAgo(data.generatedAt)}</div>}
        </div>
        <button type="button" className={BTN_GHOST} onClick={load} disabled={loading}>{loading ? 'Loading…' : '↻ Refresh'}</button>
      </div>

      {alerts.length > 0 && <Alerts alerts={alerts} onGo={onGo} />}

      <h2 className={`${H2} mb-3`}>Website visitors</h2>
      <div className={`${CARD} mb-8 flex flex-col sm:flex-row sm:items-center gap-3`}>
        <div className="flex-1 text-[0.85rem] text-[#d8cfbd]">
          Visitors to the business pages are counted without cookies: how many people came, which pages they opened, which website sent them and their country.
          <div className="text-[0.75rem] text-[#f0c070] mt-1">First time only: if the Vercel page shows an <strong>Enable</strong> button, click it once. Counting starts from then.</div>
          <div className="text-[0.72rem] text-[#8a7a5a] mt-1">Travel Planner (/travel) visitors are in Google Analytics.</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a className={BTN} href={VERCEL_ANALYTICS} target="_blank" rel="noreferrer">Business site visitors ↗</a>
          <a className={BTN_GHOST} href="https://analytics.google.com" target="_blank" rel="noreferrer">Travel Planner ↗</a>
        </div>
      </div>

      <h2 className={`${H2} mb-3`}>Travel Planner</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        <Tile label="Accounts" value={shown(data?.accounts && (isErr(data.accounts) ? data.accounts : data.accounts.total))}
          sub={acc ? <>+{fmt(acc.new7)} this week · +{fmt(acc.new30)} in 30 days</> : 'Everyone who signed up'} />
        <Tile label="Active this week" value={acc ? fmt(acc.active7) : shown(data?.accounts)} sub="Signed in during the last 7 days" />
        <Tile label="Paid subscribers" value={subs ? fmt(subs.active) : shown(data?.subscriptions)}
          sub={subs ? <>Website {subs.byChannel.website} · Google Play {subs.byChannel.googlePlay}{plans ? <><br />{plans}</> : null}</> : 'Active Pro and Explorer plans'} />
        <Tile label="Free Explorer access" value={shown(data?.freeAccess)} sub="People you gave free access" />
        <Tile label="Saved trips" value={shown(data?.savedTrips)} sub={data && num(data.sharedTrips) !== null ? `${fmt(data.sharedTrips)} shared publicly` : 'Trips saved by users'} />
        <Tile label="AI cost this month" value={ai ? `$${ai.usd.toFixed(2)}` : shown(data?.aiCost)}
          sub={ai ? `${fmt(ai.calls)} logged answers since ${niceDate(ai.since)} · USD` : 'From the Planner usage log'} />
      </div>

      <h2 className={`${H2} mb-3`}>Content &amp; audience</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <Tile label="Community waiting" value={shown(data?.communityPending)} sub="Stories to review" onClick={() => onGo('community')} tone={pending ? 'warn' : undefined} />
        <Tile label="Blog posts" value={shown(data?.postsLive)} sub={data && num(data.postsDraft) !== null ? `${fmt(data.postsDraft)} drafts` : 'Live on the blog'} onClick={() => onGo('posts')} />
        <Tile label="Newsletter" value={shown(data?.newsletter)} sub="Active subscribers" />
        <Tile label="Push" value={shown(data?.push)} sub="Browser notifications on" />
      </div>

      {legalCard}

      <div className="border-t border-[rgba(201,169,110,0.1)] pt-6">
        <div className={`${H2} mb-4`}>Quick actions</div>
        <div className="flex gap-3 flex-wrap">
          <button type="button" onClick={onNewPost} className={BTN}>+ New post</button>
          <button type="button" onClick={() => onGo('community')} className={BTN_GHOST}>Review community</button>
          <button type="button" onClick={() => onGo('schedule')} className={BTN_GHOST}>Blog schedule</button>
          <button type="button" onClick={() => onGo('health')} className={BTN_GHOST}>Website health</button>
        </div>
      </div>
    </>
  );
}

// ─── Community ───────────────────────────────────────────────────────────────

export function CommunityPanel({ onPending }: { onPending?: (n: number) => void }) {
  const [posts, setPosts] = useState<CommunityPost[] | null>(null);
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmReject, setConfirmReject] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    api('community_list').then(({ ok, data }) => {
      if (!ok) return setMsg(data?.error || 'Could not load community stories.');
      setPosts(data.posts || []);
    });
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (posts) onPending?.(posts.filter((p) => p.status === 'pending').length);
  }, [posts, onPending]);

  async function decide(p: CommunityPost, decision: 'approve' | 'reject') {
    setBusy(p.id);
    setMsg('');
    const { ok, data } = await api('community_moderate', { post_id: p.id, decision });
    setBusy(null);
    setConfirmReject(null);
    if (!ok) return setMsg(data?.error || 'That did not work. Please try again.');
    setPosts((list) => (list || []).map((x) => (x.id === p.id ? { ...x, status: data.status } : x)));
    setMsg(decision === 'approve' ? `Approved: "${p.title || 'Untitled'}" is now live on the blog.` : `Rejected: "${p.title || 'Untitled'}".`);
  }

  const counts = { pending: 0, approved: 0, rejected: 0 } as Record<string, number>;
  for (const p of posts || []) counts[p.status] = (counts[p.status] || 0) + 1;
  const list = (posts || []).filter((p) => p.status === tab);

  return (
    <>
      <h1 className={`${H1} mb-2`}>Community stories</h1>
      <p className="text-[0.8rem] text-[#9a8a6a] mb-5">Stories travellers send from the blog. Approved stories go live on the blog straight away.</p>
      <div className="flex gap-2 mb-5 flex-wrap">
        {(['pending', 'approved', 'rejected'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-full text-[0.78rem] border transition-colors ${tab === t ? 'bg-[#c9a96e] text-[#1c1914] border-[#c9a96e]' : 'border-[rgba(201,169,110,0.25)] text-[#c9a96e]'}`}>
            {t === 'pending' ? 'Waiting' : t === 'approved' ? 'Approved' : 'Rejected'} ({counts[t] || 0})
          </button>
        ))}
      </div>
      {msg && <div className="mb-4 text-[0.8rem] text-[#c9a96e]" role="status">{msg}</div>}
      {posts === null ? (
        <div className="text-[#8a7a5a] text-sm py-6">Loading…</div>
      ) : list.length === 0 ? (
        <div className={`${CARD} text-sm text-[#9a8a6a]`}>{tab === 'pending' ? 'Nothing waiting. 🎉' : 'Nothing here yet.'}</div>
      ) : (
        <div className="space-y-3">
          {list.map((p) => (
            <div key={p.id} className={CARD}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="text-[0.95rem] text-[#e8dcc8] font-medium">{p.title || 'Untitled'}</div>
                <div className="text-[0.7rem] text-[#8a7a5a] whitespace-nowrap">{new Date(p.created_at).toLocaleDateString('en-CA')}</div>
              </div>
              <div className="text-[0.75rem] text-[#9a8a6a] mt-1">
                {p.user_name || 'Anonymous'}{p.user_email ? ` · ${p.user_email}` : ''}{p.destination ? ` · ${p.destination}` : ''}
              </div>
              <p className="text-[0.82rem] text-[#b8ad98] mt-2 leading-relaxed">
                {open === p.id ? null : `${(p.excerpt || p.content || '').slice(0, 220)}${(p.excerpt || p.content || '').length > 220 ? '…' : ''}`}
              </p>
              {open === p.id && (
                <div className="mt-2 text-[0.85rem] text-[#d8cfbd] leading-relaxed whitespace-pre-wrap max-h-[50vh] overflow-y-auto border-t border-[rgba(201,169,110,0.1)] pt-3">
                  {p.cover_photo && /^https:\/\//.test(p.cover_photo) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.cover_photo} alt="" className="rounded-lg mb-3 max-h-56 object-cover" />
                  )}
                  {p.content || p.excerpt || ''}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-3 items-center">
                <button type="button" className={BTN_GHOST} onClick={() => setOpen(open === p.id ? null : p.id)}>{open === p.id ? 'Hide story' : 'Read story'}</button>
                {p.status !== 'approved' && (
                  <button type="button" className={BTN} disabled={busy === p.id} onClick={() => decide(p, 'approve')}>{busy === p.id ? '…' : 'Approve'}</button>
                )}
                {p.status !== 'rejected' && confirmReject !== p.id && (
                  <button type="button" className="border border-[rgba(200,80,80,0.3)] text-[#e08070] px-4 py-2 rounded-lg text-sm hover:bg-[rgba(200,80,80,0.08)]" disabled={busy === p.id} onClick={() => setConfirmReject(p.id)}>Reject</button>
                )}
                {confirmReject === p.id && (
                  <>
                    <span className="text-[0.78rem] text-[#e8dcc8]">Reject this story?</span>
                    <button type="button" className="bg-[#c05a4a] text-white px-4 py-2 rounded-lg text-sm" onClick={() => decide(p, 'reject')}>Yes, reject</button>
                    <button type="button" className={BTN_GHOST} onClick={() => setConfirmReject(null)}>Cancel</button>
                  </>
                )}
                {p.status === 'approved' && (
                  <a className="text-[0.78rem] text-[#c9a96e] hover:underline" href={`/blog/community-${p.id.slice(0, 8)}`} target="_blank" rel="noreferrer">View on blog ↗</a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Schedule ────────────────────────────────────────────────────────────────

export function SchedulePanel({ posts, loading, onEdit, onNew }: { posts: Post[]; loading: boolean; onEdit: (slug: string) => void; onNew: () => void }) {
  const today = todayToronto();
  const drafts = posts.filter((p) => !p.is_published).sort((a, b) => (a.date_published || '').localeCompare(b.date_published || ''));
  const future = posts.filter((p) => p.is_published && p.date_published > today).sort((a, b) => a.date_published.localeCompare(b.date_published));
  const live = posts.filter((p) => p.is_published && !(p.date_published > today));
  const lastLive = live.map((p) => p.date_published).sort().at(-1);
  const daysSince = lastLive ? Math.floor((Date.parse(today) - Date.parse(lastLive)) / 86_400_000) : null;

  const Row = ({ p, badge }: { p: Post; badge: ReactNode }) => (
    <button type="button" onClick={() => onEdit(p.slug)} className="w-full text-left flex items-center gap-3 py-2.5 px-3 border-b border-[rgba(201,169,110,0.08)] hover:bg-[rgba(201,169,110,0.03)]">
      <span className="text-[0.72rem] text-[#9a8a6a] w-24 shrink-0 tabular-nums">{p.date_published ? niceDate(p.date_published) : 'No date'}</span>
      <span className="flex-1 min-w-0 text-[0.88rem] text-[#e8dcc8] truncate">{p.title || p.slug}</span>
      {badge}
    </button>
  );
  const badge = (text: string, cls: string) => <span className={`text-[0.6rem] tracking-wide uppercase px-2 py-0.5 rounded shrink-0 ${cls}`}>{text}</span>;

  return (
    <>
      <div className="flex items-end justify-between gap-3 mb-2">
        <h1 className={H1}>Blog schedule</h1>
        <button type="button" onClick={onNew} className={BTN}>+ New post</button>
      </div>
      <p className="text-[0.8rem] text-[#9a8a6a] mb-6">
        Publishing is instant: a post marked Live appears on the blog straight away, even if its date is in the future.
        {daysSince !== null && <> Last post went live <strong className="text-[#e8dcc8]">{daysSince === 0 ? 'today' : `${daysSince} day${daysSince === 1 ? '' : 's'} ago`}</strong>.</>}
      </p>
      {loading ? (
        <div className="text-[#8a7a5a] text-sm py-6">Loading…</div>
      ) : (
        <div className="space-y-6">
          <section>
            <div className={`${KICKER} mb-2`}>Drafts ({drafts.length})</div>
            <div className={LIST_BOX}>
              {drafts.length ? drafts.map((p) => <Row key={p.slug} p={p} badge={badge('Draft', 'bg-white/[0.05] text-[#9a8a6a]')} />) : <div className="px-3 py-3 text-sm text-[#9a8a6a]">No drafts.</div>}
            </div>
          </section>
          {future.length > 0 && (
            <section>
              <div className={`${KICKER} mb-2`}>Future date, already visible ({future.length})</div>
              <div className={LIST_BOX}>
                {future.map((p) => <Row key={p.slug} p={p} badge={badge('Live', 'bg-[rgba(230,160,60,0.12)] text-[#f0c070]')} />)}
              </div>
            </section>
          )}
          <section>
            <div className={`${KICKER} mb-2`}>Published ({live.length})</div>
            <div className={LIST_BOX}>
              {live.slice(0, 30).map((p) => <Row key={p.slug} p={p} badge={badge('Live', 'bg-[rgba(80,200,80,0.1)] text-[#70c070]')} />)}
              {live.length > 30 && <div className="px-3 py-2 text-[0.75rem] text-[#9a8a6a]">+ {live.length - 30} older posts in Blog posts</div>}
            </div>
          </section>
        </div>
      )}
    </>
  );
}

// ─── Website health ──────────────────────────────────────────────────────────

const LINKS: [string, string, string][] = [
  ['Vercel', 'https://vercel.com/mrabrarwithworlds-projects/atlas-travel', 'Deploys, logs, settings'],
  ['Vercel Analytics', 'https://vercel.com/mrabrarwithworlds-projects/atlas-travel/analytics', 'Business site visitors'],
  ['Supabase', 'https://supabase.com/dashboard/projects', 'Database and sign-ins'],
  ['Stripe', 'https://dashboard.stripe.com', 'Website payments'],
  ['Google Play Console', 'https://play.google.com/console', 'Android app and purchases'],
  ['Resend', 'https://resend.com/emails', 'Emails sent from noreply@'],
  ['Zoho Mail', 'https://mail.zoho.com', 'support@getatlas.ca inbox'],
  ['Search Console', 'https://search.google.com/search-console', 'Google search'],
  ['Google Analytics', 'https://analytics.google.com', 'Planner website traffic'],
];

export function HealthPanel() {
  const [h, setH] = useState<Health | null>(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<{ ok: boolean; status: number; ms: number; reply: string | null; error?: string } | null>(null);
  const [chatBusy, setChatBusy] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setErr('');
    api('site_health').then(({ ok, data }) => {
      setLoading(false);
      if (!ok) return setErr(data?.error || 'Could not run the checks.');
      setH(data as Health);
    });
  }, []);
  useEffect(() => { load(); }, [load]);

  async function testChat() {
    setChatBusy(true);
    const { data } = await api('chat_test');
    setChat(data);
    setChatBusy(false);
  }

  const today = todayToronto();
  const okCount = h ? h.pages.filter((p) => pageOk(p.status)).length : 0;

  return (
    <>
      <div className="flex items-end justify-between gap-3 mb-6">
        <div>
          <h1 className={H1}>Website health</h1>
          {h && <div className="text-[0.72rem] text-[#8a7a5a] mt-1">Checked {timeAgo(h.checkedAt)}</div>}
        </div>
        <button type="button" className={BTN_GHOST} onClick={load} disabled={loading}>{loading ? 'Checking…' : '↻ Check again'}</button>
      </div>
      {err && <div className="mb-4 text-sm text-[#e87070]">{err}</div>}

      {h && (
        <div className="space-y-8">
          <section>
            <h2 className={`${H2} mb-3`}>Pages <span className="font-sans text-sm text-[#9a8a6a]">({okCount}/{h.pages.length} OK)</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {h.pages.map((p) => (
                <a key={p.path} href={p.path} target="_blank" rel="noreferrer"
                  className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-[0.8rem] ${pageOk(p.status) ? 'border-[rgba(90,200,140,0.25)]' : 'border-[rgba(230,100,80,0.5)] bg-[rgba(230,100,80,0.06)]'}`}>
                  <span className="text-[#e8dcc8] truncate">{p.path}</span>
                  <span className={`tabular-nums whitespace-nowrap ${pageOk(p.status) ? 'text-[#8fd6a8]' : 'text-[#f08a70]'}`}>
                    {p.status || p.error || 'error'} · {p.ms} ms
                  </span>
                </a>
              ))}
            </div>
          </section>

          <section>
            <h2 className={`${H2} mb-3`}>Privacy Policy &amp; Terms (Travel Planner)</h2>
            <div className={`${CARD} space-y-2`}>
              {(h.legal || []).map((d) => (
                <div key={d.slug} className="flex flex-wrap items-baseline justify-between gap-2 text-[0.85rem]">
                  <a href={d.url} target="_blank" rel="noreferrer" className="text-[#e8dcc8] hover:underline">{d.title}</a>
                  <span className="text-[#9a8a6a]">v{d.version} · {d.effective > today ? <span className="text-[#a9c6ee]">takes effect {niceDate(d.effective)}</span> : `in effect since ${niceDate(d.effective)}`}</span>
                </div>
              ))}
              {!h.legal && <div className="text-sm text-[#9a8a6a]">Couldn&apos;t read the document list.</div>}
              {(h.legal || []).some((d) => d.slug === 'terms' && d.effective > today) && (
                <p className="text-[0.75rem] text-[#9a8a6a] pt-2 border-t border-[rgba(201,169,110,0.1)]">
                  The Terms page shows a &quot;takes effect on…&quot; note until then. It hides itself on the day; redeploying once afterwards (Vercel → Deployments → ⋯ → Redeploy) also removes it from the page code.
                </p>
              )}
              {(h.legal || []).some((d) => d.slug === 'terms' && d.effective <= today) && h.termsBannerLive && (
                <p className="text-[0.8rem] text-[#f0c070] pt-2">⚠️ The &quot;takes effect on…&quot; note is still in the Terms page code. Redeploy once in Vercel to remove it.</p>
              )}
              <p className="text-[0.72rem] text-[#8a7a5a]">Business pages: <a className="underline" href="/legal/services/privacy" target="_blank" rel="noreferrer">Privacy Notice</a> · <a className="underline" href="/legal/services/terms" target="_blank" rel="noreferrer">Terms</a></p>
            </div>
          </section>

          <section>
            <h2 className={`${H2} mb-3`}>Ask Atlas website chat</h2>
            <div className={CARD}>
              <p className="text-[0.8rem] text-[#9a8a6a] mb-3">Sends one real question to the chat (costs one AI answer, under 1 cent).</p>
              <button type="button" className={BTN} onClick={testChat} disabled={chatBusy}>{chatBusy ? 'Asking…' : 'Test the chat'}</button>
              {chat && (
                <div className={`mt-3 text-[0.82rem] ${chat.ok ? 'text-[#8fd6a8]' : 'text-[#f08a70]'}`}>
                  {chat.ok ? `✓ Working · answered in ${(chat.ms / 1000).toFixed(1)} s` : `✗ Not answering (${chat.status || chat.error || 'error'})`}
                  {chat.reply && <div className="mt-1 text-[#d8cfbd] italic">“{chat.reply}”</div>}
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className={`${H2} mb-3`}>Connected services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(h.keys).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between rounded-lg border border-[rgba(201,169,110,0.12)] px-3 py-2 text-[0.82rem]">
                  <span className="text-[#e8dcc8]">{k}</span>
                  <span className={v ? 'text-[#8fd6a8]' : 'text-[#f08a70]'}>{v ? '✓ set up' : '✗ missing'}</span>
                </div>
              ))}

            </div>
            <p className="text-[0.72rem] text-[#8a7a5a] mt-2">Only shows whether each key exists in Vercel. Key values are never shown.</p>
          </section>

          <section>
            <h2 className={`${H2} mb-3`}>Live version</h2>
            <div className={`${CARD} text-[0.82rem] text-[#d8cfbd]`}>
              {h.version.commit ? <><span className="font-mono text-[#c9a96e]">{h.version.commit}</span> · {h.version.message}</> : 'Unknown'}
              <span className="text-[#8a7a5a]"> ({h.version.environment})</span>
            </div>
          </section>
        </div>
      )}

      <section className="mt-8">
        <h2 className={`${H2} mb-3`}>Quick links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LINKS.map(([name, href, note]) => (
            <a key={name} href={href} target="_blank" rel="noreferrer" className="rounded-lg border border-[rgba(201,169,110,0.15)] px-3 py-2.5 hover:border-[rgba(201,169,110,0.4)] transition-colors">
              <div className="text-[0.88rem] text-[#e8dcc8]">{name} ↗</div>
              <div className="text-[0.72rem] text-[#8a7a5a]">{note}</div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
