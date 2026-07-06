'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import SiteNav from '../components/SiteNav';

// ─── Types ────────────────────────────────────────────────────────────────────

type Service = {
  id: string;
  icon: string;
  title: string;
  tagline: string;
  desc: string;
  whoFor: string;
  problems: string[];
  whatWeBuild: string[];
  deliverables: string[];
  scope: string;
};

// ─── Service Data ─────────────────────────────────────────────────────────────

const SERVICES: Service[] = [
  {
    id: 'ai-workflow',
    icon: '🤖',
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
    scope: 'Typically 2–4 weeks per workflow. Scope depends on number of tool integrations.',
  },
  {
    id: 'crm-lead',
    icon: '📋',
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
    scope: 'Typically 2–4 weeks. Multi-stage pipelines with complex routing take longer.',
  },
  {
    id: 'website-dev',
    icon: '🌐',
    title: 'Website & Landing Page Development',
    tagline: 'Fast, modern websites that convert visitors into clients.',
    desc: 'Professional Next.js websites and landing pages hosted on Vercel. SEO-optimized, mobile-first, and built to convert.',
    whoFor: 'Businesses that need a professional online presence, startups launching a product, or companies with an outdated website that isn\'t converting.',
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
    scope: 'Landing pages: 1–2 weeks. Full company sites: 3–5 weeks.',
  },
  {
    id: 'email-report',
    icon: '📧',
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
    icon: '⚙️',
    title: 'Business Process Automation',
    tagline: 'Connect your tools. Cut the manual handoffs.',
    desc: 'Map and automate your core operational workflows — invoicing, onboarding, approvals, data sync. Reduce errors and free your team from repetitive coordination.',
    whoFor: 'Operations managers, founders scaling past 5 employees, and teams where "we do it manually for now" is a real bottleneck slowing down growth.',
    problems: [
      'Data living in too many tools that don\'t communicate',
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
    scope: 'Typically 2–4 weeks per major workflow. Multi-workflow packages available.',
  },
  {
    id: 'travel-tech',
    icon: '✈️',
    title: 'Travel-Tech & AI Product Development',
    tagline: 'We build AI products for the travel industry.',
    desc: 'End-to-end AI product development for travel and hospitality — from itinerary engines and booking assistants to full-stack SaaS platforms deployed at scale.',
    whoFor: 'Tour operators, travel agencies, hospitality companies, and travel startups that need to build a digital product but don\'t have an in-house engineering team.',
    problems: [
      'Generic travel tools don\'t fit your specific workflows',
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
    scope: 'MVP: 4–8 weeks. Full product build: 8–16 weeks. Ongoing retainers available.',
  },
];

const STEPS = [
  { num: '01', title: 'Free Audit', desc: 'We map your current workflow and pinpoint exactly where automation saves the most time and money.' },
  { num: '02', title: 'Custom Plan', desc: 'You receive a clear proposal — what we build, the timeline, and a fixed price. No surprises.' },
  { num: '03', title: 'We Build It', desc: 'We build, test, and deploy. You get full access and complete ownership of everything we create.' },
  { num: '04', title: 'Automate', desc: 'Systems go live. Your business starts running on automation from day one of deployment.' },
  { num: '05', title: 'Improve', desc: 'We monitor, refine, and expand. Automation compounds over time — the value keeps growing.' },
];

// ─── Service Drawer ───────────────────────────────────────────────────────────

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

  const gold = '#c9a96e';
  const bg = '#1c1914';
  const card = '#231f18';
  const border = '#3a3228';
  const text = '#ede5d5';
  const muted = '#a09070';

  return (
    <>
      <style>{`
        .atlas-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(10, 8, 6, 0.82);
          backdrop-filter: blur(6px);
          animation: atlasOverlayIn 0.22s ease forwards;
        }
        .atlas-drawer {
          position: fixed; top: 0; right: 0; bottom: 0; z-index: 1001;
          width: min(500px, 100vw);
          background: ${bg};
          border-left: 1px solid ${border};
          overflow-y: auto;
          display: flex; flex-direction: column;
          animation: atlasDrawerIn 0.28s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @media (max-width: 767px) {
          .atlas-drawer {
            top: auto; left: 0; right: 0; bottom: 0; width: 100%;
            max-height: 88vh;
            border-left: none; border-top: 1px solid ${border};
            border-radius: 20px 20px 0 0;
            animation: atlasSheetIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
        }
        @keyframes atlasOverlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes atlasDrawerIn  { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes atlasSheetIn   { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) {
          .atlas-overlay, .atlas-drawer { animation: none; }
        }
        .atlas-drawer-section { border-bottom: 1px solid ${border}; padding: 20px 28px; }
        .atlas-pill-list { display: flex; flex-direction: column; gap: 8px; }
        .atlas-pill { display: flex; align-items: flex-start; gap: 10px; }
        .atlas-pill-dot { width: 5px; height: 5px; border-radius: 50%; background: ${gold}; flex-shrink: 0; margin-top: 7px; }
        .atlas-close-btn:hover { background: rgba(201,169,110,0.12) !important; color: ${gold} !important; }
        .atlas-cta-btn:hover { background: #b8943d !important; }
      `}</style>

      {/* Overlay */}
      <div className="atlas-overlay" onClick={onClose} aria-hidden="true" />

      {/* Drawer panel */}
      <div className="atlas-drawer" role="dialog" aria-modal="true" aria-label={service.title}>

        {/* Header */}
        <div style={{ padding: '20px 28px 20px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: card, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{service.icon}</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: gold, textTransform: 'uppercase', marginBottom: 4 }}>Service</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 22, fontWeight: 600, color: text, margin: 0, lineHeight: 1.2 }}>{service.title}</h2>
            </div>
          </div>
          <button
            className="atlas-close-btn"
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'none', border: `1px solid ${border}`, borderRadius: 8, color: muted, fontSize: 18, cursor: 'pointer', padding: '6px 10px', lineHeight: 1, transition: 'background 0.15s, color 0.15s', flexShrink: 0 }}
          >✕</button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* Tagline + desc */}
          <div className="atlas-drawer-section">
            <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 18, fontWeight: 600, color: '#e8c994', marginBottom: 10 }}>{service.tagline}</div>
            <p style={{ fontSize: 14, color: '#c5b99a', lineHeight: 1.75, margin: 0 }}>{service.desc}</p>
          </div>

          {/* Who it's for */}
          <div className="atlas-drawer-section">
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: muted, textTransform: 'uppercase', marginBottom: 10 }}>Who it&apos;s for</div>
            <p style={{ fontSize: 13, color: '#c5b99a', lineHeight: 1.7, margin: 0 }}>{service.whoFor}</p>
          </div>

          {/* Problems it solves */}
          <div className="atlas-drawer-section">
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: muted, textTransform: 'uppercase', marginBottom: 12 }}>Problems it solves</div>
            <div className="atlas-pill-list">
              {service.problems.map(p => (
                <div key={p} className="atlas-pill">
                  <div className="atlas-pill-dot" />
                  <span style={{ fontSize: 13, color: '#c5b99a', lineHeight: 1.6 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What Atlas builds */}
          <div className="atlas-drawer-section">
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: muted, textTransform: 'uppercase', marginBottom: 12 }}>What Atlas builds</div>
            <div className="atlas-pill-list">
              {service.whatWeBuild.map(w => (
                <div key={w} className="atlas-pill">
                  <div className="atlas-pill-dot" style={{ background: '#6b9e6b' }} />
                  <span style={{ fontSize: 13, color: '#c5b99a', lineHeight: 1.6 }}>{w}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div className="atlas-drawer-section">
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: muted, textTransform: 'uppercase', marginBottom: 12 }}>Example deliverables</div>
            <div className="atlas-pill-list">
              {service.deliverables.map(d => (
                <div key={d} className="atlas-pill">
                  <span style={{ fontSize: 13, color: '#c9a96e', lineHeight: 1, marginTop: 2, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 13, color: '#c5b99a', lineHeight: 1.6 }}>{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scope */}
          <div className="atlas-drawer-section">
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: muted, textTransform: 'uppercase', marginBottom: 10 }}>Estimated scope</div>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 10, padding: '14px 16px' }}>
              <span style={{ fontSize: 13, color: '#c5b99a', lineHeight: 1.65 }}>{service.scope}</span>
            </div>
            <div style={{ fontSize: 11, color: '#6b6050', marginTop: 8 }}>Exact timeline confirmed after free audit. No commitment required.</div>
          </div>

          {/* CTA */}
          <div style={{ padding: '24px 28px 32px' }}>
            <Link
              href="/contact"
              className="atlas-cta-btn"
              style={{ display: 'block', textAlign: 'center', background: gold, color: '#1c1914', borderRadius: 10, padding: '14px 24px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none', transition: 'background 0.2s' }}
            >
              Get a free automation audit →
            </Link>
            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: muted }}>Free consultation · No commitment · Response within 24h</div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────

function ServiceCard({ service, onClick }: { service: Service; onClick: () => void }) {
  return (
    <>
      <style>{`
        .svc-card { cursor: pointer; transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; }
        .svc-card:hover { border-color: rgba(201,169,110,0.5) !important; transform: translateY(-3px); box-shadow: 0 8px 32px rgba(201,169,110,0.08); }
        .svc-card:hover .svc-card-arrow { color: #c9a96e !important; transform: translateX(4px); }
        .svc-card-arrow { transition: color 0.2s, transform 0.2s; }
      `}</style>
      <button
        className="svc-card"
        onClick={onClick}
        style={{
          background: 'rgba(35, 31, 24, 0.92)',
          border: '1px solid #3a3228',
          borderRadius: 14,
          padding: '28px 24px',
          textAlign: 'left',
          width: '100%',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 14, lineHeight: 1 }}>{service.icon}</div>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#ede5d5', margin: '0 0 8px', fontFamily: 'inherit' }}>{service.title}</h3>
        <p style={{ fontSize: 13, color: '#a09070', lineHeight: 1.65, margin: '0 0 16px', flex: 1 }}>{service.tagline}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: '#6b6050' }}>
          <span>VIEW DETAILS</span>
          <span className="svc-card-arrow" style={{ color: '#6b6050' }}>→</span>
        </div>
      </button>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ServicesClient() {
  const [active, setActive] = useState<Service | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const close = useCallback(() => setActive(null), []);

  return (
    <div style={{ background: '#1c1914', minHeight: '100vh', color: '#ede5d5', fontFamily: 'DM Sans, sans-serif' }}>
      <SiteNav activePath="/services" />

      <style>{`
        .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 900px) { .services-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .services-grid { grid-template-columns: 1fr; } }
        .steps-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 24px; }
        @media (max-width: 860px) { .steps-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 520px) { .steps-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; } }
        .why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        @media (max-width: 680px) { .why-grid { grid-template-columns: 1fr; gap: 20px; } }
        .hero-grid-bg {
          background-image:
            linear-gradient(rgba(201,169,110,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,169,110,0.05) 1px, transparent 1px);
          background-size: 48px 48px;
        }
      `}</style>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="hero-grid-bg" style={{ paddingTop: 100, position: 'relative', overflow: 'hidden' }}>
        {/* Glow */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', textAlign: 'center', position: 'relative' }}>
          {/* Canada badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(35,31,24,0.9)', border: '1px solid #3a3228', borderRadius: 100, padding: '6px 18px', marginBottom: 28 }}>
            <span style={{ fontSize: 14 }}>🍁</span>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#a09070', textTransform: 'uppercase' }}>Based in Canada · Serving clients worldwide</span>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 18 }}>
            Atlas Technology · AI &amp; Automation
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(38px,5.5vw,68px)', fontWeight: 600, color: '#e8c994', lineHeight: 1.1, margin: '0 0 24px' }}>
            Automate your business.<br />Ship faster. Grow smarter.
          </h1>
          <p style={{ fontSize: 17, color: '#c5b99a', lineHeight: 1.78, maxWidth: 560, margin: '0 auto 14px' }}>
            Atlas helps online businesses worldwide automate workflows, capture leads, build websites, and save time with AI.
          </p>
          <p style={{ fontSize: 14, color: '#a09070', maxWidth: 440, margin: '0 auto 40px' }}>
            Fully remote. Fixed price. You own everything we build.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" style={{ display: 'inline-block', background: '#c9a96e', color: '#1c1914', borderRadius: 8, padding: '13px 30px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none' }}>
              Get Free Automation Audit →
            </Link>
            <a href="#services" style={{ display: 'inline-block', background: 'none', border: '1px solid #3a3228', color: '#a09070', borderRadius: 8, padding: '13px 24px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              See Services ↓
            </a>
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: '#6b6050' }}>Free consultation · No commitment · Response within 24h</div>
        </div>
      </section>

      {/* ── Services Grid ─────────────────────────────────────────────────── */}
      <section id="services" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#a09070', textTransform: 'uppercase', marginBottom: 12 }}>What We Build</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 600, color: '#e8c994', margin: '0 0 12px' }}>Our Services</h2>
            <p style={{ fontSize: 14, color: '#6b6050', margin: 0 }}>Click any service to see full details, deliverables, and estimated scope.</p>
          </div>
          <div className="services-grid">
            {SERVICES.map(s => (
              <ServiceCard key={s.id} service={s} onClick={() => setActive(s)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: '#231f18', borderTop: '1px solid #3a3228', borderBottom: '1px solid #3a3228' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#a09070', textTransform: 'uppercase', marginBottom: 12 }}>Simple Process</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px,3vw,40px)', fontWeight: 600, color: '#e8c994', margin: 0 }}>How Atlas works</h2>
          </div>
          <div className="steps-grid">
            {STEPS.map((step, i) => (
              <div key={step.num} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 42, fontWeight: 600, color: '#c9a96e', marginBottom: 10, lineHeight: 1 }}>{step.num}</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#ede5d5', margin: '0 0 8px', letterSpacing: '0.04em' }}>{step.title}</h3>
                <p style={{ fontSize: 12, color: '#a09070', lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', top: 20, right: -12, color: '#3a3228', fontSize: 18, display: 'none' }} className="step-arrow">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Atlas ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#a09070', textTransform: 'uppercase', marginBottom: 12 }}>Why Atlas</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px,3vw,40px)', fontWeight: 600, color: '#e8c994', margin: 0 }}>Built for remote-first businesses</h2>
          </div>
          <div className="why-grid">
            {[
              { icon: '🌍', title: 'Fully Remote', desc: 'We work with clients across North America, Europe, Asia, and beyond. Timezone is never a barrier.' },
              { icon: '💰', title: 'Fixed Price', desc: 'Every project comes with a clear scope and fixed cost. No hourly billing, no surprise invoices.' },
              { icon: '🔑', title: 'You Own Everything', desc: 'Full source code, database access, and credentials delivered to you. No vendor lock-in, ever.' },
            ].map(item => (
              <div key={item.title} style={{ background: '#231f18', border: '1px solid #3a3228', borderRadius: 14, padding: '28px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ede5d5', margin: '0 0 10px' }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: '#a09070', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#231f18', borderTop: '1px solid #3a3228', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(201,169,110,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 560, margin: '0 auto', position: 'relative' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(30px,4vw,48px)', fontWeight: 600, color: '#e8c994', margin: '0 0 16px' }}>
            Ready to automate your business?
          </h2>
          <p style={{ fontSize: 15, color: '#a09070', lineHeight: 1.75, margin: '0 0 36px' }}>
            Request a free automation audit. We&apos;ll review your workflow and show you exactly what we&apos;d build — no sales pitch, no commitment.
          </p>
          <Link href="/contact" style={{ display: 'inline-block', background: '#c9a96e', color: '#1c1914', borderRadius: 8, padding: '15px 40px', fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none' }}>
            Get Free Automation Audit →
          </Link>
          <div style={{ marginTop: 16, fontSize: 12, color: '#6b6050' }}>🍁 Based in Canada &nbsp;·&nbsp; Remote worldwide &nbsp;·&nbsp; Response within 24h</div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #3a3228', padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: '#a09070' }}>
          © {new Date().getFullYear()} Atlas Technology &nbsp;·&nbsp;
          <Link href="/blog" style={{ color: '#a09070', textDecoration: 'none' }}>Blog</Link>
          &nbsp;·&nbsp;
          <Link href="/contact" style={{ color: '#a09070', textDecoration: 'none' }}>Contact</Link>
          &nbsp;·&nbsp;
          <Link href="/" style={{ color: '#a09070', textDecoration: 'none' }}>Atlas Travel Planner</Link>
        </div>
      </footer>

      {/* ── Service Drawer Portal ──────────────────────────────────────────── */}
      {mounted && active && createPortal(
        <ServiceDrawer service={active} onClose={close} />,
        document.body
      )}
    </div>
  );
}
