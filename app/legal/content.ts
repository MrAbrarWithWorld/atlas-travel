// Legal documents live as Markdown in /content/legal/<set>/<slug>.md with simple front-matter.
// Read at build time (pages are statically generated). No new dependencies.
//
// URLs:
//   Travel Planner  → /privacy and /terms (unchanged URLs used by the Android app and Google Play)
//   Business services → /legal/services/privacy and /legal/services/terms
//
// Business details (legal name, address, phone…) come from content/legal/business.json and are
// inserted where a document uses {{key}}. A line that uses an empty value is left out.
//
// Release gate: a production build fails while any document is not approved: status must be
// `in-effect`, an effective date must be set, no [[...]] markers may remain, and every value the
// document lists under `requires:` must be filled in business.json.
import fs from 'node:fs';
import path from 'node:path';

export type LegalSet = 'services' | 'travel';
export type LegalSlug = 'privacy' | 'terms';
export type LegalStatus = 'pending-approval' | 'in-effect';

export type LegalDoc = {
  set: LegalSet;
  slug: LegalSlug;
  title: string;
  shortTitle: string;
  version: string;
  effective: string;
  status: LegalStatus;
  summary: string;
  body: string;
  url: string;
  missing: string[]; // required business details that are still empty
  previous: string; // URL of the version that applies until `effective` (optional)
  notice: string; // one-line summary of the changes, used in the automatic email to users (optional)
  noticeVersion: string; // version users are notified about; set lower than `version` for wording-only edits
};

const ROOT = path.join(process.cwd(), 'content', 'legal');

export const SLUGS: LegalSlug[] = ['privacy', 'terms'];

export const SET_LABELS: Record<LegalSet, { title: string; intro: string }> = {
  services: {
    title: 'Atlas AI Technology — business services',
    intro: 'For businesses that contact us about, or buy, our automation, CRM, website and AI-assistant services.',
  },
  travel: {
    title: 'Atlas AI Travel Planner',
    intro: 'For people who use the Atlas AI Travel Planner website and Android app.',
  },
};

export function legalUrl(set: LegalSet, slug: LegalSlug): string {
  return set === 'travel' ? `/${slug}` : `/legal/services/${slug}`;
}

function parseFrontMatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const i = line.indexOf(':');
    if (i < 1) continue;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    meta[key] = value;
  }
  return { meta, body: match[2] };
}

type BusinessDetails = Record<string, string>;

function loadBusiness(): BusinessDetails {
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'business.json'), 'utf8')) as Record<string, unknown>;
  const out: BusinessDetails = {};
  for (const [k, v] of Object.entries(raw)) if (!k.startsWith('_') && typeof v === 'string') out[k] = v.trim();
  return out;
}

const TOKEN = /\{\{(\w+)\}\}/g;

/** Insert business details; leave out any line that uses a value that is not filled in yet. */
function fillDetails(body: string, details: BusinessDetails): string {
  return body
    .split('\n')
    .filter((line) => [...line.matchAll(TOKEN)].every((m) => Boolean(details[m[1]])))
    .map((line) => line.replace(TOKEN, (_, key: string) => details[key]))
    .join('\n');
}

function assertReleasable(doc: LegalDoc) {
  if (process.env.VERCEL_ENV !== 'production') return;
  const problems: string[] = [];
  if (doc.status !== 'in-effect') problems.push(`status is "${doc.status}"`);
  if (!doc.effective) problems.push('no effective date');
  if (/\[\[[^\]]+\]\]/.test(doc.body)) problems.push('unresolved [[...]] markers');
  if (doc.missing.length) problems.push(`missing business details in content/legal/business.json: ${doc.missing.join(', ')}`);
  if (problems.length) {
    throw new Error(
      `Legal document ${doc.url} is not approved for production (${problems.join('; ')}). ` +
        'Resolve the owner decisions and set status: in-effect with an effective date before deploying.',
    );
  }
}

export function getLegalDoc(set: LegalSet, slug: string): LegalDoc | null {
  if (!SLUGS.includes(slug as LegalSlug)) return null;
  const file = path.join(ROOT, set, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { meta, body } = parseFrontMatter(fs.readFileSync(file, 'utf8'));
  const details = loadBusiness();
  const required = (meta.requires || '').split(',').map((k) => k.trim()).filter(Boolean);
  const used = [...body.matchAll(TOKEN)].map((m) => m[1]);
  const missing = [...new Set([...required, ...used.filter((k) => !(k in details))])].filter((k) => !details[k]);
  const title = meta.title || slug;
  const doc: LegalDoc = {
    set,
    slug: slug as LegalSlug,
    title,
    shortTitle: title.replace(/^Atlas AI Travel Planner — /, ''),
    version: meta.version || '',
    effective: meta.effective || '',
    status: meta.status === 'in-effect' ? 'in-effect' : 'pending-approval',
    summary: meta.summary || '',
    body: fillDetails(body, details),
    url: legalUrl(set, slug as LegalSlug),
    missing,
    previous: meta.previous || '',
    notice: meta.notice || '',
    noticeVersion: meta.noticeVersion || meta.version || '',
  };
  assertReleasable(doc);
  return doc;
}

export function listLegalDocs(set: LegalSet): LegalDoc[] {
  return SLUGS.map((slug) => getLegalDoc(set, slug)).filter((d): d is LegalDoc => d !== null);
}

export function formatEffective(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
}
