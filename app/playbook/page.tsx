import type { Metadata } from 'next';
import Link from 'next/link';
import PlaybookForm from './PlaybookForm';

export const metadata: Metadata = {
  title: 'Free Playbook: 25 AI Prompts Every GTA Realtor Should Be Using | Atlas AI Technologies',
  description:
    'A free playbook for GTA realtors: 25 copy-paste AI prompts for speed-to-lead replies, follow-up sequences, listings and content — plus the research on why the first 5 minutes decide the deal.',
};

const STATS = [
  { value: '21×', label: 'more likely to qualify a lead contacted within 5 minutes vs 30 (MIT / InsideSales)' },
  { value: '78%', label: 'of buyers work with the first agent who responds (NAR)' },
  { value: '15 hrs', label: 'average time an agent takes to answer a new lead (Inman, 2025)' },
  { value: '48%', label: 'of agents never follow up at all (Inman / AgentZap)' },
];

const PARTS = [
  { title: 'Part 1 — Speed-to-Lead', text: 'First replies that go out in minutes: new leads, 9 PM website inquiries, the 60-second "is this still available?" answer.' },
  { title: 'Part 2 — Follow-Up', text: 'Where the money actually is — including the 14-day, 5-touch follow-up sequence builder most agents say is worth the whole download.' },
  { title: 'Part 3 — Listings That Get Clicks', text: 'Descriptions from raw facts (never invented features), one listing written three ways, just-sold and price-improvement posts.' },
  { title: 'Part 4 — Content in One Hour a Week', text: 'Plain-English market updates, neighbourhood spotlights, myth-busting posts and referral-earning check-ins.' },
  { title: 'Part 5 — Hard Moments', text: 'Lost bidding wars, unrealistic sellers, expired listings — worded to keep trust intact.' },
];

export default function PlaybookPage() {
  return (
    <div style={{ maxWidth: 1060, margin: '0 auto', padding: '100px 24px 80px' }}>
      {/* Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#231f18', border: '1px solid #3a3228', borderRadius: 100, padding: '5px 14px', marginBottom: 24 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#e8c994' }}>FREE PLAYBOOK · FOR GTA REALTORS</span>
      </div>

      <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 44, lineHeight: 1.15, color: '#ede5d5', margin: '0 0 16px', maxWidth: 720 }}>
        25 AI Prompts Every GTA Realtor Should Be Using
      </h1>
      <p style={{ color: '#a09070', fontSize: 16, lineHeight: 1.65, margin: '0 0 36px', maxWidth: 640 }}>
        Copy-paste prompts for the moments deals are actually won and lost — the first reply, the
        follow-up, the listing post. Built for how GTA agents really work, with an Ontario
        compliance box so nothing you send comes back to bite you.
      </p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14, marginBottom: 48 }}>
        {STATS.map((stat) => (
          <div key={stat.value} style={{ background: '#1c1914', border: '1px solid #3a3228', borderRadius: 12, padding: '20px 18px' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 36, color: '#e8c994', lineHeight: 1, marginBottom: 8 }}>{stat.value}</div>
            <div style={{ color: '#a09070', fontSize: 12.5, lineHeight: 1.55 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'start' }}>
        {/* What's inside */}
        <div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 28, color: '#e8c994', margin: '0 0 20px' }}>Inside the playbook</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {PARTS.map((part) => (
              <div key={part.title} style={{ borderLeft: '3px solid #c9a96e', paddingLeft: 16 }}>
                <div style={{ color: '#ede5d5', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{part.title}</div>
                <div style={{ color: '#a09070', fontSize: 13.5, lineHeight: 1.6 }}>{part.text}</div>
              </div>
            ))}
          </div>
          <p style={{ color: '#a09070', fontSize: 13.5, lineHeight: 1.65, margin: '24px 0 0' }}>
            Plus: a one-page cheat sheet (which prompt for which situation), a 4-step formula for
            getting output you can actually send, and an honest final page on the one thing prompts
            can&apos;t fix — timing.
          </p>
        </div>

        {/* Form card */}
        <div style={{ background: '#171410', border: '1px solid #3a3228', borderRadius: 16, padding: '28px 26px' }}>
          <PlaybookForm />
        </div>
      </div>

      {/* Done-for-you strip */}
      <div style={{ marginTop: 56, background: '#231f18', border: '1px solid #3a3228', borderRadius: 16, padding: '28px 26px', display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ maxWidth: 620 }}>
          <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 24, color: '#e8c994', marginBottom: 6 }}>Prefer it done for you?</div>
          <p style={{ color: '#a09070', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            Prompts fix the writing. <strong style={{ color: '#ede5d5' }}>Lead Rescue</strong> fixes the timing — every lead answered in
            under 5 minutes, follow-ups that keep going until they reply. Start with the free
            Missed-Lead Audit: we count how many of last month&apos;s leads waited too long.
          </p>
        </div>
        <Link href="/contact" style={{ background: '#c9a96e', color: '#1c1914', borderRadius: 8, padding: '13px 26px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>
          BOOK THE FREE AUDIT →
        </Link>
      </div>

      <p style={{ color: '#6f6658', fontSize: 11.5, lineHeight: 1.6, margin: '28px 0 0' }}>
        Statistics: MIT / InsideSales Lead Response Management study; National Association of Realtors; Inman 2025; Inman / AgentZap.
        Atlas AI Technologies (ATLAS AI TECHNOLOGIES, Ontario) — outcomes only, no hype: if the audit finds nothing, we&apos;ll tell you.
      </p>
    </div>
  );
}
