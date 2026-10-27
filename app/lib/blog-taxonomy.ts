// Blog posts were saved with many spellings of the same category ("Destination Guide",
// "destination-guide", "Destinations", "Europe"...). These helpers group them for display,
// filtering and "related posts" without changing the stored data.

export const BLOG_TOPICS = ['Destination guides', 'Visa & budget', 'Tips & planning'] as const;
export type BlogTopic = (typeof BLOG_TOPICS)[number];

export function blogTopic(rawCategory: string | null | undefined): BlogTopic {
  const c = (rawCategory ?? '').toLowerCase();
  if (/visa|budget/.test(c)) return 'Visa & budget';
  if (/tip|planning|adventure|packing|safety/.test(c)) return 'Tips & planning';
  return 'Destination guides';
}

export type BlogRegion = 'Europe' | 'Asia' | 'Middle East & Africa' | 'Americas' | 'Bangladesh' | 'General';

const REGION_WORDS: [BlogRegion, RegExp][] = [
  ['Bangladesh', /dhaka|cox|sundarbans|bangladesh/],
  ['Europe', /iceland|budapest|lisbon|prague|amsterdam|rome|santorini|paris|barcelona|istanbul|europe/],
  ['Asia', /singapore|seoul|tokyo|bali|kyoto|thailand|southeast|asia|maldives|nepal|everest/],
  ['Middle East & Africa', /dubai|morocco|cape-town|cape town|africa|middle east/],
  ['Americas', /banff|canada|america/],
];

export function blogRegion(slug: string, title = ''): BlogRegion {
  const s = `${slug} ${title}`.toLowerCase();
  for (const [region, re] of REGION_WORDS) if (re.test(s)) return region;
  return 'General';
}

type Rankable = { slug: string; title: string; category?: string | null; date_published?: string | null };

/** Pick related posts: same region first, then same topic, then newest. */
export function pickRelated<T extends Rankable>(current: Rankable, candidates: T[], count = 4): T[] {
  const region = blogRegion(current.slug, current.title);
  const topic = blogTopic(current.category);
  return candidates
    .filter((p) => p.slug !== current.slug)
    .map((p) => ({
      p,
      score: (blogRegion(p.slug, p.title) === region && region !== 'General' ? 2 : 0) + (blogTopic(p.category) === topic ? 1 : 0),
      t: p.date_published ? Date.parse(p.date_published) : 0,
    }))
    .sort((a, b) => b.score - a.score || b.t - a.t)
    .slice(0, count)
    .map((x) => x.p);
}
