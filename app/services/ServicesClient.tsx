'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import SiteNav from '../components/SiteNav';

// ─── Types ────────────────────────────────────────────────────────────────────

type Service = {
  id: string;
  category: string;
  title: string;
  tagline: string;
  desc: string;
  whoFor: string;
  problems: string[];
  whatWeBuild: string[];
  deliverables: string[];
  scope: string;
};

type Product = {
  label: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  external?: boolean;
};

// ─── Data ────────────────────────────────────────────────────────────────────

const SERVICES: Service[] = [
  {
    id: 'ai-workflow',
    category: 'Automation',
    title: 'AI Workflow Automation',
    tagline: 'Eliminate manual work with intelligent automation',
    desc: 'Automate repetitive business processes using n8n, AI agents, and smart triggers — so your team focuses only on work that matters.',
    whoFor: 'Business owners, operations teams, and solo founders spending hours on repetitive tasks: data entry, email replies, CRM updates, or report generation.',
    problems: [
      'Hours lost copying data between tools every week',
      'Leads going cold because follow-up was manually forgotten',
      'Reports that take half a day to compile from scratch',
      'Human error accumulating in repeated processes',
    ],
    whatWeBuild: [
      'n8n automation workflows connecting your existing tools',
      'AI agent pipelines for complex multi-step decision tasks',
      'Trigger-based automations (form submit, new email, new row)',
      'Slack and email notifications for critical business events',
      'Scheduled automations and batch processing jobs',
    ],
    deliverables: [
      'Deployed n8n workflow (self-hosted or n8n cloud)',
      'Written documentation and video walkthrough',
      'Full ownership — all credentials and source delivered to you',
    ],
    scope: 'Typically 2–4 weeks per workflow. Scope and milestones agreed before work begins.',
  },
  {
    id: 'crm-lead',
    category: 'CRM',
    title: 'CRM & Lead Capture Systems',
    tagline: 'Never miss a lead. Follow up automatically.',
    desc: 'Custom CRM pipelines built on Supabase and n8n. Capture leads, qualify them automatically, and get approval-gated email drafts ready to send.',
    whoFor: 'Agencies, consultants, freelancers, and sales teams receiving leads from websites or ads who need a structured pipeline without paying for bloated CRM software.',
    problems: [
      'Leads fall through the cracks after initial contact',
      'No clear view of where each lead sits in the pipeline',
      'Manual CRM data entry eating up sales time daily',
      'Follow-up emails written from scratch every single time',
    ],
    whatWeBuild: [
      'Lead capture form integrated with Supabase database',
      'Automatic lead scoring, tagging, and qualification',
      'n8n pipeline: capture → notify → draft follow-up → await approval',
      'Admin dashboard to view, filter, and manage leads',
      'Duplicate detection and deduplication logic built in',
    ],
    deliverables: [
      'Working lead capture form embedded on your website',
      'Supabase database with structured lead records',
      'n8n workflow with approval-gated email drafts',
      'Admin view for pipeline management',
    ],
    scope: 'Typically 2–4 weeks. Milestones defined upfront. Multi-stage pipelines scoped separately.',
  },
  {
    id: 'website-dev',
    category: 'Web',
    title: 'Website & Landing Page Development',
    tagline: 'Fast, modern websites that convert visitors into clients.',
    desc: 'Professional Next.js websites and landing pages hosted on Vercel. SEO-optimized, mobile-first, and built to convert.',
    whoFor: 'Businesses that need a professional online presence, startups launching a product, or companies with an outdated website that is not converting.',
    problems: [
      'Slow website losing visitors before they read a single word',
      'No clear value proposition or call-to-action above the fold',
      'Looks unprofessional to international or enterprise clients',
      'No integration between the website and any CRM or email tool',
    ],
    whatWeBuild: [
      'Company sites, product sites, and portfolio sites',
      'High-converting landing pages for ad campaigns or launches',
      'Blog systems with CMS (Supabase or headless CMS)',
      'Contact forms connected to CRM and email automation',
      'Multi-language support and internationalization',
    ],
    deliverables: [
      'Production-ready Next.js site deployed on Vercel',
      'Connected domain, SSL, and performance optimization',
      'Full source code with complete access',
      'SEO setup — metadata, sitemap, structured data, robots',
    ],
    scope: 'Landing pages: 1–2 weeks. Full company sites: 3–5 weeks. Plan agreed before start.',
  },
  {
    id: 'email-report',
    category: 'Email',
    title: 'Email & Report Automation',
    tagline: 'Reports and emails that send themselves.',
    desc: 'Automated email sequences, scheduled business reports, and event-triggered notifications — sent from your domain, on your schedule, always under your control.',
    whoFor: 'Teams that compile recurring reports manually, managers who send status updates by hand, or businesses that need automated sequences for onboarding or retention.',
    problems: [
      'Weekly reports that take hours to pull together manually',
      'Onboarding emails written and sent one by one',
      'No follow-up system for inactive users or missed payments',
      'Inconsistent outreach with no tracking or visibility',
    ],
    whatWeBuild: [
      'Scheduled digest emails (daily, weekly, or monthly)',
      'Event-triggered sequences (signup, purchase, inactivity)',
      'Automated invoice and payment reminder emails',
      'Business KPI reports delivered to email or Slack',
      'Custom branded email templates matching your identity',
    ],
    deliverables: [
      'Configured n8n or email automation workflow',
      'Branded email templates tested across clients',
      'Sending domain setup — SPF, DKIM, and DMARC',
      'Test results, monitoring setup, and error alerting',
    ],
    scope: 'Single sequences: 1–2 weeks. Full email systems with branching: 3–4 weeks.',
  },
  {
    id: 'biz-process',
    category: 'Operations',
    title: 'Business Process Automation',
    tagline: 'Connect your tools. Cut the manual handoffs.',
    desc: 'Map and automate your core operational workflows — invoicing, onboarding, approvals, data sync. Reduce errors and free your team from repetitive coordination.',
    whoFor: 'Operations managers, founders scaling past 5 employees, and teams where manual coordination is a real bottleneck slowing down growth.',
    problems: [
      'Data living in too many tools that do not communicate',
      'Approval chains that depend on someone remembering to check',
      'Employee or client onboarding done from memory every time',
      'Invoices and payments tracked in a shared spreadsheet',
    ],
    whatWeBuild: [
      'Cross-app integrations: Stripe, Notion, Sheets, Slack, Gmail, and more',
      'Multi-step approval workflows with full audit trails',
      'Employee and client onboarding automations',
      'Invoice generation, payment sync, and accounting integration',
      'Bi-directional data sync between databases and SaaS tools',
    ],
    deliverables: [
      'Fully deployed automation for each agreed workflow',
      'Process documentation and a walkthrough recording',
      'Error handling, failure alerts, and retry logic',
    ],
    scope: 'Typically 2–4 weeks per major workflow. Scope and milestones defined before start.',
  },
  {
    id: 'travel-tech',
    category: 'AI Product',
    title: 'Travel-Tech & AI Product Development',
    tagline: 'We build AI products for the travel industry.',
    desc: 'End-to-end AI product development for travel and hospitality — from itinerary engines and booking assistants to full-stack SaaS platforms deployed at scale.',
    whoFor: 'Tour operators, travel agencies, hospitality companies, and travel startups that need to build a digital product without maintaining a full in-house engineering team.',
    problems: [
      'Generic travel tools do not fit your specific workflows',
      'Building in-house requires hiring and managing a full dev team',
      'AI integrations are complex to build, test, and maintain',
      'No time to ship a product while also running the business',
    ],
    whatWeBuild: [
      'AI-powered itinerary generators with real-time destination data',
      'Booking assistants and intelligent recommendation engines',
      'Travel chatbots for customer support and trip planning',
      'Visa and travel requirement databases with AI-powered lookup',
      'Full SaaS platforms with auth, billing, admin, and mobile apps',
    ],
    deliverables: [
      'MVP or full product deployed to production',
      'Web app (Next.js) and/or mobile app (React Native / Expo)',
      'Full source code, database, and infrastructure ownership',
      'Post-launch support, iteration, and performance monitoring',
    ],
    scope: 'MVP: 4–8 weeks. Full product: 8–16 weeks. Ongoing retainers available.',
  },
];

const PRODUCTS: Product[] = [
  {
    label: 'Travel App',
    title: 'Atlas AI Travel Planner',
    desc: 'AI-powered travel planning web and mobile app. Instant itineraries, visa info, hotel suggestions, interactive maps, and trip planning for any destination worldwide.',
    cta: 'Try Atlas',
    href: '/',
  },
  {
    label: 'Content',
    title: 'Atlas Blog',
    desc: 'Travel guides, destination inspiration, AI travel updates, and product notes from the Atlas team.',
    cta: 'Read Blog',
    href: '/blog',
  },
  {
    label: 'Media',
    title: 'Atlas News',
    desc: 'AI and travel industry updates, ecosystem news, and content from the Atlas network.',
    cta: 'Visit News',
    href: 'https://news.getatlas.ca',
    external: true,
  },
  {
    label: 'Studio',
    title: 'Atlas Product Studio',
    desc: 'Future AI tools, travel-tech experiments, and automation products built and incubated under the Atlas brand.',
    cta: 'Request a project',
    href: '/contact',
  },
];

const CAPABILITIES = [
  'Lead capture websites and landing pages',
  'CRM dashboards and pipeline systems',
  'AI email drafting and approval workflows',
  'Multi-step approval and review systems',
  'Automated business reporting and digests',
  'Booking, intake, and onboarding forms',
  'Internal admin tools and dashboards',
  'AI-powered product MVPs',
];

const STEPS = [
  { num: '01', title: 'Free Audit', desc: 'We map your current workflow and identify exactly where automation saves the most time.' },
  { num: '02', title: 'Scoped Plan', desc: 'You receive a clear project plan — milestones, deliverables, and timeline. No surprises.' },
  { num: '03', title: 'We Build It', desc: 'We build, test, and deploy. You get full access and ownership of everything we create.' },
  { num: '04', title: 'Automate', desc: 'Systems go live. Your business starts running on automation from day one.' },
  { num: '05', title: 'Improve', desc: 'We monitor, refine, and expand. Automation compounds — the value keeps growing.' },
];

// ─── Shared styles ────────────────────────────────────────────────────────────

const GLOBAL_STYLES = `
  .svc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; }
  @media (max-width: 860px) { .svc-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 520px) { .svc-grid { grid-template-columns: 1fr; } }

  .prod-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; }
  @media (max-width: 620px) { .prod-grid { grid-template-columns: 1fr; } }

  .cap-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0; }
  @media (max-width: 520px) { .cap-grid { grid-template-columns: 1fr; } }

  .steps-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0; }
  @media (max-width: 860px) { .steps-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 480px) { .steps-grid { grid-template-columns: repeat(2, 1fr); } }

  .why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; }
  @media (max-width: 640px) { .why-grid { grid-template-columns: 1fr; } }

  .hero-grid-bg {
    background-image:
      linear-gradient(rgba(201,169,110,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,169,110,0.04) 1px, transparent 1px);
    background-size: 52px 52px;
  }
  .svc-card-btn { transition: background 0.18s; }
  .svc-card-btn:hover { background: rgba(201,169,110,0.06) !important; }
  .svc-card-btn:hover .svc-arrow { color: #c9a96e !important; }
  .svc-arrow { transition: color 0.18s; }

  .prod-card { transition: background 0.18s; }
  .prod-card:hover { background: rgba(201,169,110,0.04) !important; }

  .atlas-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(8,6,4,0.85);
    backdrop-filter: blur(8px);
    animation: atlasOverlayIn 0.2s ease forwards;
  }
  .atlas-drawer {
    position: fixed; top: 0; right: 0; bottom: 0; z-index: 1001;
    width: min(520px, 100vw);
    background: #1a1714;
    border-left: 1px solid #3a3228;
    overflow-y: auto;
    display: flex; flex-direction: column;
    animation: atlasDrawerIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
  @media (max-width: 767px) {
    .atlas-drawer {
      top: auto; left: 0; right: 0; bottom: 0; width: 100%;
      max-height: 90vh;
      border-left: none; border-top: 1px solid #3a3228;
      border-radius: 18px 18px 0 0;
      animation: atlasSheetIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
  }
  @keyframes atlasOverlayIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes atlasDrawerIn  { from { transform: translateX(100%); } to { transform: translateX(0); } }
  @keyframes atlasSheetIn   { from { transform: translateY(100%); } to { transform: translateY(0); } }
  @media (prefers-reduced-motion: reduce) {
    .atlas-overlay, .atlas-drawer { animation: none; }
  }
  .drawer-close:hover { border-color: #c9a96e !important; color: #c9a96e !important; }
  .drawer-cta:hover { background: #b8943d !important; }
  .sec-divider { height: 1px; background: linear-gradient(90deg, transparent, #3a3228 20%, #3a3228 80%, transparent); }
`;

// ─── Service Drawer ───────────────────────────────────────────────────────────

function Bullet({ text, color = '#c9a96e' }: { text: string; color?: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
      <span style={{ fontSize: 10, color, marginTop: 5, flexShrink: 0, fontFamily: 'monospace' }}>▸</span>
      <span style={{ fontSize: 13, color: '#c5b99a', lineHeight: 1.65 }}>{text}</span>
    </div>
  );
}

function DrawerSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '20px 28px', borderBottom: '1px solid #2a2520' }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', color: '#6b6050', textTransform: 'uppercase', marginBottom: 14, fontFamily: 'monospace' }}>{label}</div>
      {children}
    </div>
  );
}

function ServiceDrawer({ service, onClose }: { service: Service; onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <>
      <div className="atlas-overlay" onClick={onClose} aria-hidden="true" />
      <div className="atlas-drawer" role="dialog" aria-modal="true" aria-label={service.title}>

        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #2a2520', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', color: '#6b6050', textTransform: 'uppercase', marginBottom: 5, fontFamily: 'monospace' }}>{service.category}</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 22, fontWeight: 600, color: '#e8c994', margin: 0, lineHeight: 1.2 }}>{service.title}</h2>
          </div>
          <button
            className="drawer-close"
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'none', border: '1px solid #3a3228', borderRadius: 6, color: '#a09070', fontSize: 16, cursor: 'pointer', padding: '5px 10px', lineHeight: 1, transition: 'border-color 0.15s, color 0.15s', flexShrink: 0, fontFamily: 'monospace' }}
          >✕</button>
        </div>

        {/* Tagline bar */}
        <div style={{ padding: '14px 24px', background: 'rgba(201,169,110,0.04)', borderBottom: '1px solid #2a2520' }}>
          <span style={{ fontSize: 14, fontStyle: 'italic', color: '#c9a96e', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>{service.tagline}</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <DrawerSection label="Overview">
            <p style={{ fontSize: 13, color: '#c5b99a', lineHeight: 1.75, margin: 0 }}>{service.desc}</p>
          </DrawerSection>

          <DrawerSection label="Who this is for">
            <p style={{ fontSize: 13, color: '#c5b99a', lineHeight: 1.7, margin: 0 }}>{service.whoFor}</p>
          </DrawerSection>

          <DrawerSection label="Problems it solves">
            {service.problems.map(p => <Bullet key={p} text={p} color='#8a7060' />)}
          </DrawerSection>

          <DrawerSection label="What Atlas builds">
            {service.whatWeBuild.map(w => <Bullet key={w} text={w} color='#c9a96e' />)}
          </DrawerSection>

          <DrawerSection label="Deliverables">
            {service.deliverables.map(d => (
              <div key={d} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: '#6b9e6b', marginTop: 3, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 13, color: '#c5b99a', lineHeight: 1.65 }}>{d}</span>
              </div>
            ))}
          </DrawerSection>

          <DrawerSection label="Estimated scope">
            <div style={{ background: '#231f18', border: '1px solid #3a3228', borderRadius: 8, padding: '12px 16px' }}>
              <span style={{ fontSize: 13, color: '#c5b99a', lineHeight: 1.65, fontFamily: 'monospace' }}>{service.scope}</span>
            </div>
            <div style={{ fontSize: 11, color: '#4a4038', marginTop: 8 }}>Exact scope and milestones confirmed after audit. No commitment required.</div>
          </DrawerSection>

          <div style={{ padding: '24px 24px 36px' }}>
            <Link
              href="/contact"
              className="drawer-cta"
              style={{ display: 'block', textAlign: 'center', background: '#c9a96e', color: '#1c1914', borderRadius: 8, padding: '14px 24px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none', transition: 'background 0.2s' }}
            >
              Get a free automation audit →
            </Link>
            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: '#4a4038', fontFamily: 'monospace' }}>No commitment · Response within 24h</div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────

function ServiceCard({ service, onClick }: { service: Service; onClick: () => void }) {
  return (
    <button
      className="svc-card-btn"
      onClick={onClick}
      style={{ background: '#231f18', border: 'none', borderRadius: 0, padding: '28px 24px', textAlign: 'left', width: '100%', cursor: 'pointer', display: 'flex', flexDirection: 'column', minHeight: 200 }}
    >
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: '#6b6050', textTransform: 'uppercase', marginBottom: 14, fontFamily: 'monospace' }}>{service.category}</div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#ede5d5', margin: '0 0 10px', fontFamily: 'Cormorant Garamond, Georgia, serif', lineHeight: 1.25 }}>{service.title}</h3>
      <p style={{ fontSize: 13, color: '#a09070', lineHeight: 1.65, margin: '0 0 auto', flex: 1 }}>{service.tagline}</p>
      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#4a4038', fontFamily: 'monospace' }}>
        <span>VIEW DETAILS</span>
        <span className="svc-arrow" style={{ color: '#4a4038' }}>→</span>
      </div>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ServicesClient() {
  const [active, setActive] = useState<Service | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  const close = useCallback(() => setActive(null), []);

  const gold = '#c9a96e';
  const border = '#3a3228';
  const muted = '#a09070';

  return (
    <div style={{ background: '#1c1914', minHeight: '100vh', color: '#ede5d5', fontFamily: 'DM Sans, sans-serif' }}>
      <SiteNav activePath="/services" />
      <style>{GLOBAL_STYLES}</style>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="hero-grid-bg" style={{ paddingTop: 100, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 900, height: 500, background: 'radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.09) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '64px 24px 80px', textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.26em', color: gold, textTransform: 'uppercase', marginBottom: 20, fontFamily: 'monospace' }}>
            Atlas Technology &nbsp;/&nbsp; AI &amp; Automation
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(38px,5.5vw,70px)', fontWeight: 600, color: '#e8c994', lineHeight: 1.08, margin: '0 0 26px' }}>
            Turn manual workflows<br />into automated systems.
          </h1>
          <p style={{ fontSize: 17, color: '#c5b99a', lineHeight: 1.78, maxWidth: 560, margin: '0 auto 14px' }}>
            Atlas helps online businesses worldwide automate workflows, capture leads, build websites, and save time with AI.
          </p>
          <p style={{ fontSize: 14, color: muted, maxWidth: 440, margin: '0 auto 40px' }}>
            Transparent project plans. Milestone-based delivery. You own everything we build.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" style={{ display: 'inline-block', background: gold, color: '#1c1914', borderRadius: 7, padding: '13px 30px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none' }}>
              Get Free Automation Audit →
            </Link>
            <a href="#services" style={{ display: 'inline-block', background: 'none', border: `1px solid ${border}`, color: muted, borderRadius: 7, padding: '13px 22px', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
              See Services ↓
            </a>
          </div>
          <div style={{ marginTop: 16, fontSize: 11, color: '#4a4038', fontFamily: 'monospace' }}>Free consultation · No commitment · Reply within 24h</div>
        </div>

        {/* Flow connector nodes */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, padding: '0 24px 0', maxWidth: 600, margin: '0 auto', opacity: 0.5 }}>
          {['Capture', 'Process', 'Route', 'Notify', 'Deliver'].map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < 4 ? 1 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', border: `1px solid ${gold}`, background: 'rgba(201,169,110,0.2)' }} />
                <div style={{ fontSize: 8, color: '#6b6050', letterSpacing: '0.1em', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{label}</div>
              </div>
              {i < 4 && <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, rgba(201,169,110,0.3), rgba(201,169,110,0.05))`, margin: '0 6px', marginBottom: 14 }} />}
            </div>
          ))}
        </div>
        <div style={{ height: 48 }} />
      </section>

      {/* ── Services ──────────────────────────────────────────────────────── */}
      <section id="services">
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ padding: '56px 0 32px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.24em', color: muted, textTransform: 'uppercase', marginBottom: 10, fontFamily: 'monospace' }}>Services</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px,3vw,40px)', fontWeight: 600, color: '#e8c994', margin: 0 }}>What we build for clients</h2>
            </div>
            <div style={{ fontSize: 12, color: '#4a4038', fontFamily: 'monospace' }}>Click any service for full details</div>
          </div>
        </div>

        {/* Grid with 1px-gap panel look */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 0' }}>
          <div style={{ border: `1px solid ${border}`, borderRadius: 12, overflow: 'hidden' }}>
            <div className="svc-grid" style={{ gap: 0 }}>
              {SERVICES.map((s, i) => (
                <div key={s.id} style={{ borderRight: (i + 1) % 3 !== 0 ? `1px solid ${border}` : 'none', borderBottom: i < 3 ? `1px solid ${border}` : 'none' }}>
                  <ServiceCard service={s} onClick={() => setActive(s)} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ height: 80 }} />
      </section>

      {/* ── Our Products ──────────────────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${border}`, padding: '72px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.24em', color: muted, textTransform: 'uppercase', marginBottom: 10, fontFamily: 'monospace' }}>Products &amp; Platforms</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px,3vw,40px)', fontWeight: 600, color: '#e8c994', margin: 0 }}>Our products</h2>
          </div>
          <div style={{ border: `1px solid ${border}`, borderRadius: 12, overflow: 'hidden' }}>
            <div className="prod-grid">
              {PRODUCTS.map((p, i) => (
                <div key={p.title} style={{ borderRight: i % 2 === 0 ? `1px solid ${border}` : 'none', borderBottom: i < 2 ? `1px solid ${border}` : 'none' }}>
                  <div className="prod-card" style={{ padding: '28px 26px', background: '#231f18', height: '100%', boxSizing: 'border-box', transition: 'background 0.18s' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: '#6b6050', textTransform: 'uppercase', marginBottom: 10, fontFamily: 'monospace' }}>{p.label}</div>
                    <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 20, fontWeight: 600, color: '#e8c994', margin: '0 0 10px', lineHeight: 1.25 }}>{p.title}</h3>
                    <p style={{ fontSize: 13, color: muted, lineHeight: 1.68, margin: '0 0 20px' }}>{p.desc}</p>
                    {p.external ? (
                      <a href={p.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 600, color: gold, textDecoration: 'none', letterSpacing: '0.06em' }}>{p.cta} →</a>
                    ) : (
                      <Link href={p.href} style={{ fontSize: 12, fontWeight: 600, color: gold, textDecoration: 'none', letterSpacing: '0.06em' }}>{p.cta} →</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What we can build ─────────────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${border}`, padding: '72px 24px', background: '#1a1714' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.24em', color: muted, textTransform: 'uppercase', marginBottom: 10, fontFamily: 'monospace' }}>Capabilities</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px,3vw,40px)', fontWeight: 600, color: '#e8c994', margin: 0 }}>What we can build for your business</h2>
          </div>
          <div style={{ border: `1px solid ${border}`, borderRadius: 12, overflow: 'hidden' }}>
            <div className="cap-grid">
              {CAPABILITIES.map((cap, i) => (
                <div key={cap} style={{ padding: '18px 24px', borderRight: i % 2 === 0 ? `1px solid ${border}` : 'none', borderBottom: i < CAPABILITIES.length - 2 ? `1px solid ${border}` : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 9, color: gold, fontFamily: 'monospace', flexShrink: 0 }}>▸</span>
                  <span style={{ fontSize: 13, color: '#c5b99a', lineHeight: 1.55 }}>{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How Atlas works ───────────────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${border}`, padding: '72px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.24em', color: muted, textTransform: 'uppercase', marginBottom: 10, fontFamily: 'monospace' }}>Process</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px,3vw,40px)', fontWeight: 600, color: '#e8c994', margin: 0 }}>How Atlas works</h2>
          </div>
          <div style={{ border: `1px solid ${border}`, borderRadius: 12, overflow: 'hidden' }}>
            <div className="steps-grid">
              {STEPS.map((step, i) => (
                <div key={step.num} style={{ padding: '28px 22px', borderRight: i < STEPS.length - 1 ? `1px solid ${border}` : 'none' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: gold, marginBottom: 12, letterSpacing: '0.1em' }}>{step.num}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: '#ede5d5', margin: '0 0 10px', letterSpacing: '0.02em' }}>{step.title}</h3>
                  <p style={{ fontSize: 12, color: muted, lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Atlas ─────────────────────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${border}`, padding: '72px 24px', background: '#1a1714' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.24em', color: muted, textTransform: 'uppercase', marginBottom: 10, fontFamily: 'monospace' }}>Why Atlas</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px,3vw,40px)', fontWeight: 600, color: '#e8c994', margin: 0 }}>Built for remote-first businesses</h2>
          </div>
          <div style={{ border: `1px solid ${border}`, borderRadius: 12, overflow: 'hidden' }}>
            <div className="why-grid">
              {[
                { label: 'Reach', title: 'Fully Remote', desc: 'We work with clients across North America, Europe, Asia, and beyond. Timezone is never a barrier — all communication is async-friendly.' },
                { label: 'Clarity', title: 'Clear Scope & Plan', desc: 'Every project starts with a transparent project plan — agreed milestones, deliverables, and timeline. No scope creep, no surprise changes.' },
                { label: 'Ownership', title: 'You Own Everything', desc: 'Full source code, database access, and all credentials are delivered to you at project close. No vendor lock-in, ever.' },
              ].map((item, i) => (
                <div key={item.title} style={{ padding: '28px 24px', borderRight: i < 2 ? `1px solid ${border}` : 'none' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: '#6b6050', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'monospace' }}>{item.label}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#ede5d5', margin: '0 0 10px', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: muted, lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${border}`, padding: '88px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 100% at 50% 100%, rgba(201,169,110,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 560, margin: '0 auto', position: 'relative' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.24em', color: muted, textTransform: 'uppercase', marginBottom: 18, fontFamily: 'monospace' }}>Get started</div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(30px,4vw,52px)', fontWeight: 600, color: '#e8c994', margin: '0 0 18px', lineHeight: 1.1 }}>
            Ready to turn manual work into an automated system?
          </h2>
          <p style={{ fontSize: 15, color: muted, lineHeight: 1.75, margin: '0 0 36px' }}>
            Request a free automation audit. We map your workflow, identify the highest-impact automations, and give you a clear build plan — no commitment required.
          </p>
          <Link href="/contact" style={{ display: 'inline-block', background: gold, color: '#1c1914', borderRadius: 7, padding: '15px 40px', fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none' }}>
            Get a free automation audit →
          </Link>
          <div style={{ marginTop: 18, fontSize: 11, color: '#4a4038', fontFamily: 'monospace' }}>No commitment &nbsp;·&nbsp; Response within 24h &nbsp;·&nbsp; Worldwide</div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${border}`, padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: '#4a4038', fontFamily: 'monospace', marginBottom: 8 }}>
          Operated from Canada. Serving clients remotely worldwide.
        </div>
        <div style={{ fontSize: 12, color: '#4a4038' }}>
          © {new Date().getFullYear()} Atlas Technology &nbsp;·&nbsp;
          <Link href="/blog" style={{ color: '#4a4038', textDecoration: 'none' }}>Blog</Link>
          &nbsp;·&nbsp;
          <Link href="/contact" style={{ color: '#4a4038', textDecoration: 'none' }}>Contact</Link>
          &nbsp;·&nbsp;
          <Link href="/" style={{ color: '#4a4038', textDecoration: 'none' }}>Travel Planner</Link>
        </div>
      </footer>

      {/* ── Drawer portal ─────────────────────────────────────────────────── */}
      {mounted && active && createPortal(
        <ServiceDrawer service={active} onClose={close} />,
        document.body
      )}
    </div>
  );
}
