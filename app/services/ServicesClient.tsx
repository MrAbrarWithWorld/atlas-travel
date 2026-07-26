'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import SiteNav from '../components/SiteNav';

/* ─── DATA ─────────────────────────────────────────────────────────────────── */

const SERVICES = [
  {
    id: 'workflow-automation',
    abbrev: 'AI',
    category: 'Automation',
    title: 'AI Workflow Automation',
    tagline: 'Trigger-based pipelines with human approval gates',
    scope: '2–4 weeks',
    overview: 'Replace manual back-and-forth with automated pipelines — lead intake → CRM log → AI-drafted reply → human approval → delivery. Built on n8n with configurable approval checkpoints so nothing sensitive goes out unsupervised.',
    bestFor: 'Service businesses, agencies, and operators managing high-volume inbound — especially those losing leads to inbox delays or timezone gaps.',
    problems: [
      'Leads fall through the cracks during off-hours',
      'Hours spent drafting the same follow-up emails',
      'No consistent handoff process between intake and response',
      'Manual steps that break when someone is unavailable',
    ],
    whatWeBuild: [
      'n8n trigger workflows (form, webhook, or schedule)',
      'AI drafting nodes using Claude or GPT-4o',
      'Human approval gate via Slack message or email',
      'CRM write step (HubSpot, Notion, or Supabase)',
      'Notification delivery to Slack, email, or WhatsApp',
    ],
    deliverables: [
      'Live n8n workflow (exported + documented)',
      'Approval interface configured in your Slack or inbox',
      'Test suite with sample data walkthroughs',
      'Written runbook for making changes yourself',
    ],
  },
  {
    id: 'crm-lead-capture',
    abbrev: 'CRM',
    category: 'CRM',
    title: 'CRM & Lead Capture',
    tagline: 'Full inbound pipeline from form to CRM to notification',
    scope: '1–2 weeks',
    overview: 'A complete inbound system: form submission or API call → webhook route → CRM record creation → team notification → AI-drafted first reply ready for approval. No more manually copying leads from email into a spreadsheet.',
    bestFor: 'Businesses relying on inbound leads with no dedicated ops or sales team — consultants, agencies, B2B service providers.',
    problems: [
      'No visibility into lead volume or source',
      'Leads arrive via email and get buried',
      'No system for routing or follow-up assignment',
      'CRM feels too complex to actually maintain',
    ],
    whatWeBuild: [
      'Web form or API intake endpoint',
      'n8n webhook routing and deduplication',
      'HubSpot, Notion, or custom CRM integration',
      'Slack and email notification on new lead',
      'AI-drafted reply queued for human approval',
    ],
    deliverables: [
      'Live intake form (embed-ready or standalone)',
      'Working CRM connection with test records',
      'Notification setup in your preferred channel',
      'Lead demo walkthrough showing full journey',
    ],
  },
  {
    id: 'website-development',
    abbrev: 'WEB',
    category: 'Web',
    title: 'Website Development',
    tagline: 'Next.js sites with automation hooks built in from the start',
    scope: '3–6 weeks',
    overview: 'Production-grade Next.js websites with fast load times, clean design, and automation infrastructure built in — not bolted on later. Lead capture routes to your CRM on day one. Content is yours to manage without a developer.',
    bestFor: 'Startups, service businesses, and product studios outgrowing Wix or WordPress and needing a site that can scale with them.',
    problems: [
      'Slow or outdated site hurting credibility',
      'No content control without a developer',
      "Lead capture goes to email — no system behind it",
      "Can't add features without starting over",
    ],
    whatWeBuild: [
      'Next.js App Router site (TypeScript, Tailwind)',
      'Supabase or headless CMS for content management',
      'Lead capture connected to CRM via API route',
      'SEO structure, sitemap, metadata',
      'Vercel deployment with CI/CD pipeline',
    ],
    deliverables: [
      'Deployed site on your domain',
      'Admin content panel (no-code edits)',
      'CI/CD pipeline for future updates',
      'Handoff guide for making changes yourself',
    ],
  },
  {
    id: 'email-report-automation',
    abbrev: 'EML',
    category: 'Email',
    title: 'AI Email & Report Automation',
    tagline: 'Scheduled AI-generated summaries with human review checkpoint',
    scope: '1–3 weeks',
    overview: 'Replace manually-written weekly reports and repetitive email drafting with scheduled AI pipelines. Atlas builds a system that compiles the relevant data, runs it through an AI summarization step, and delivers it for your review before sending.',
    bestFor: 'Operators who write the same weekly digest, status update, or follow-up email on repeat — and want to reclaim those hours without losing control of what goes out.',
    problems: [
      'Hours spent writing reports no one reads in full',
      'Inconsistent follow-up cadence losing deals',
      'Context lost between messages and meetings',
      'Manually compiling data from multiple sources',
    ],
    whatWeBuild: [
      'Scheduled n8n workflow (daily, weekly, or triggered)',
      'Data aggregation from your sources (CRM, sheets, API)',
      'AI summarization node with structured output',
      'Human review + edit interface before delivery',
      'Email delivery via SMTP, Gmail API, or Resend',
    ],
    deliverables: [
      'Live scheduled workflow with test run',
      'Review interface (Slack thread or email draft)',
      'Template for editing output format',
      'Schedule and delivery configuration',
    ],
  },
  {
    id: 'process-automation',
    abbrev: 'OPS',
    category: 'Operations',
    title: 'Business Process Automation',
    tagline: 'Map, eliminate, and systematize your most painful manual work',
    scope: '2–4 weeks',
    overview: 'Atlas maps your most time-consuming manual process — approvals, scheduling, data sync, notification chains — and builds an automated system to replace it. Starts with a discovery session to understand the actual pain, not the assumed solution.',
    bestFor: 'Operations leads, office managers, and solo founders spending more than 3 hours per week on the same repetitive admin tasks.',
    problems: [
      'Spreadsheets passed between people as a database',
      'Approvals that require hunting someone down',
      'Data in one tool that needs to be in another',
      'Processes that break whenever someone is out',
    ],
    whatWeBuild: [
      'Trigger-to-action automation chains (n8n)',
      'Form or API input layer for structured data entry',
      'Conditional routing and error handling',
      'Human-in-loop approval gates for sensitive steps',
      'Cross-tool data sync (CRM, sheets, Slack, email)',
    ],
    deliverables: [
      'Process map document (current vs. automated)',
      'Live workflow with test results',
      'Runbook for operating and modifying the system',
      'Handoff session walking through every step',
    ],
  },
  {
    id: 'ai-product-integration',
    abbrev: 'SDK',
    category: 'AI Product',
    title: 'AI Product & API Integration',
    tagline: 'Add AI capabilities to existing products without a full ML stack',
    scope: '2–5 weeks',
    overview: 'Add chat, classification, summarization, or generation to an existing product or internal tool via Claude or GPT-4o API. Atlas handles prompt architecture, output validation, streaming, fallback logic, and integration into your existing codebase.',
    bestFor: 'Technical founders or product teams with working apps that need intelligent features — without hiring an ML engineer or starting from scratch.',
    problems: [
      'AI feels too complex to integrate correctly',
      'Unclear which model or API fits the use case',
      'No structure for prompts, context, or output validation',
      "Existing codebase doesn't know where AI fits in",
    ],
    whatWeBuild: [
      'API integration layer (server-side, no keys in browser)',
      'Prompt template system with structured output schemas',
      'Streaming response support if needed',
      'Fallback and error handling logic',
      'Context management for multi-turn conversations',
    ],
    deliverables: [
      'Working integration in your codebase',
      'Documented prompt system with examples',
      'Test harness for regression testing',
      'Usage guide for extending the integration',
    ],
  },
];

const PRODUCTS = [
  {
    id: 'atlas-travel',
    label: 'Live Product',
    title: 'Atlas AI Travel Planner',
    desc: 'AI-powered itinerary builder for travellers. Plan entire trips in minutes with day-by-day schedules, AI chat, and shareable plans.',
    cta: 'Try Atlas',
    href: '/',
    external: false,
  },
  {
    id: 'atlas-blog',
    label: 'Content Platform',
    title: 'Atlas Travel Blog',
    desc: 'Editorial and community platform for travel content. Destination guides, community posts, and SEO-optimised articles.',
    cta: 'Read Blog',
    href: '/blog',
    external: false,
  },
  {
    id: 'atlas-news',
    label: 'Media Product',
    title: 'Atlas Travel News',
    desc: 'Curated travel news aggregator. Automated summaries and updates from sources across the industry.',
    cta: 'Visit News',
    href: 'https://news.getatlas.ca',
    external: true,
  },
  {
    id: 'atlas-studio',
    label: 'For Clients',
    title: 'Atlas Product Studio',
    desc: 'Custom product development and automation for external clients. Request a free consultation to discuss your system.',
    cta: 'Request a project',
    href: '/contact',
    external: false,
  },
];

const CAPABILITIES = [
  'n8n automation workflows (self-hosted or cloud)',
  'Claude / GPT-4o API integration',
  'Next.js full-stack web applications',
  'Supabase database and authentication',
  'Lead capture → CRM pipeline architecture',
  'Slack / WhatsApp / email notifications',
  'Human-in-loop approval systems',
  'Vercel deployment and CI/CD pipelines',
];

const FLOW_NODES = [
  { label: 'Website\n/ Form', sub: 'intake' },
  { label: 'Lead\nCapture', sub: 'webhook' },
  { label: 'CRM\nLog', sub: 'storage' },
  { label: 'AI\nDraft', sub: 'claude / gpt' },
  { label: 'Human\nApproval', sub: 'slack / email' },
  { label: 'Notification\nSent', sub: 'delivery' },
  { label: 'Follow-up\nQueued', sub: 'sequence' },
];

const STEPS = [
  { num: '01', title: 'Free audit call', desc: 'We review your current workflow, identify the highest-value automation opportunities, and come back with a written scope.' },
  { num: '02', title: 'Scope & timeline', desc: 'We agree on exactly what gets built, what it connects to, and when it ships — before any work begins.' },
  { num: '03', title: 'System build', desc: 'Atlas builds and tests your system. You receive updates as each component goes live.' },
  { num: '04', title: 'Human approval gates', desc: 'Any sensitive action — outbound emails, CRM writes, notifications — requires your explicit approval before executing.' },
  { num: '05', title: 'Handoff + you own it', desc: 'Full documentation, credentials, and a walkthrough session. You own everything we build — no lock-in.' },
];

/* ─── SMALL COMPONENTS ──────────────────────────────────────────────────────── */

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
      <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#c9a96e', lineHeight: '22px', flexShrink: 0 }}>▸</span>
      <span style={{ fontSize: 13, color: '#c5b99a', lineHeight: 1.6 }}>{children}</span>
    </div>
  );
}

function DrawerSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.2em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #2e2820' }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function ServiceIcon({ abbrev }: { abbrev: string }) {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 6,
      border: '1px solid rgba(201,169,110,0.25)',
      background: 'rgba(201,169,110,0.05)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 9, fontWeight: 800, letterSpacing: '0.06em',
      color: '#c9a96e', fontFamily: 'monospace', flexShrink: 0,
    }}>
      {abbrev}
    </div>
  );
}

function RevealSection({ children, style: s, delay = 0 }: { children: React.ReactNode; style?: React.CSSProperties; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTimeout(() => el.classList.add('in'), delay); obs.disconnect(); } },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref} className="reveal-item" style={s}>{children}</div>;
}

/* ─── DRAWER ────────────────────────────────────────────────────────────────── */

type Service = typeof SERVICES[number];

function ServiceDrawer({ svc, onClose }: { svc: Service; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => setVisible(true));
    return () => { document.body.style.overflow = orig; };
  }, []);

  const handleClose = useCallback(() => {
    if (!reduced) {
      setVisible(false);
      setTimeout(onClose, 280);
    } else {
      onClose();
    }
  }, [reduced, onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleClose]);

  if (!mounted) return null;

  const transitionStyle = reduced ? {} : {
    transition: 'opacity 0.28s ease, transform 0.28s cubic-bezier(0.22,1,0.36,1)',
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '90dvh', background: '#1e1a14',
        border: '1px solid #3a3228', borderRadius: '16px 16px 0 0',
        overflowY: 'auto', zIndex: 1001, padding: '28px 22px 40px',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        opacity: visible ? 1 : 0, ...transitionStyle,
      }
    : {
        position: 'fixed', top: 0, right: 0,
        width: 520, maxWidth: '92vw', height: '100dvh',
        background: '#1e1a14', border: '1px solid #3a3228',
        overflowY: 'auto', zIndex: 1001, padding: '36px 36px 60px',
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        opacity: visible ? 1 : 0, ...transitionStyle,
      };

  return createPortal(
    <>
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(10,9,7,0.72)',
          backdropFilter: 'blur(4px)', zIndex: 1000,
          opacity: visible ? 1 : 0, ...transitionStyle,
        }}
        aria-hidden="true"
      />
      <div style={panelStyle} role="dialog" aria-modal="true" aria-label={svc.title}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <ServiceIcon abbrev={svc.abbrev} />
            <div>
              <div style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.18em', color: '#a09070', textTransform: 'uppercase', marginBottom: 4 }}>
                {svc.category}
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 22, fontWeight: 600, color: '#e8c994', lineHeight: 1.15 }}>
                {svc.title}
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            style={{ background: 'none', border: '1px solid #3a3228', borderRadius: 6, color: '#a09070', cursor: 'pointer', padding: '6px 10px', fontSize: 14, flexShrink: 0, marginLeft: 12 }}
          >
            ✕
          </button>
        </div>

        {/* Scope badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 100, padding: '4px 14px', marginBottom: 28 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: '#c9a96e', textTransform: 'uppercase' }}>Starting scope</span>
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#ede5d5', fontWeight: 600 }}>{svc.scope}</span>
        </div>

        <DrawerSection label="Overview">
          <p style={{ fontSize: 14, color: '#c5b99a', lineHeight: 1.7, margin: 0 }}>{svc.overview}</p>
        </DrawerSection>

        <DrawerSection label="Best for">
          <p style={{ fontSize: 13, color: '#c5b99a', lineHeight: 1.7, margin: 0 }}>{svc.bestFor}</p>
        </DrawerSection>

        <DrawerSection label="Problems solved">
          {svc.problems.map((p, i) => <Bullet key={i}>{p}</Bullet>)}
        </DrawerSection>

        <DrawerSection label="What Atlas builds">
          {svc.whatWeBuild.map((w, i) => <Bullet key={i}>{w}</Bullet>)}
        </DrawerSection>

        <DrawerSection label="Example deliverables">
          {svc.deliverables.map((d, i) => <Bullet key={i}>{d}</Bullet>)}
        </DrawerSection>

        {/* CTA */}
        <div style={{ paddingTop: 20, borderTop: '1px solid #2e2820' }}>
          <p style={{ fontSize: 13, color: '#a09070', lineHeight: 1.6, margin: '0 0 20px' }}>
            Every engagement starts with a free audit call — no commitment required.
          </p>
          <Link
            href="/contact"
            style={{
              display: 'inline-block',
              background: '#c9a96e', color: '#1c1914',
              borderRadius: 8, padding: '13px 28px',
              fontSize: 13, fontWeight: 700, letterSpacing: '0.08em',
              textDecoration: 'none', fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Book a Discovery Call →
          </Link>
        </div>
      </div>
    </>,
    document.body
  );
}

/* ─── SERVICE CARD ──────────────────────────────────────────────────────────── */

function ServiceCard({ svc, onOpen }: { svc: Service; onOpen: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? '#231f18' : '#1e1a14',
        border: `1px solid ${hov ? 'rgba(201,169,110,0.3)' : '#2e2820'}`,
        borderRadius: 10, padding: '22px 20px', cursor: 'pointer',
        transition: 'background 0.18s, border-color 0.18s, box-shadow 0.18s',
        boxShadow: hov ? '0 0 24px rgba(201,169,110,0.06)' : 'none',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onOpen(); }}
      aria-label={`Open details for ${svc.title}`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <ServiceIcon abbrev={svc.abbrev} />
          <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: '#a09070', textTransform: 'uppercase' }}>
            {svc.category}
          </span>
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#6b6050', letterSpacing: '0.1em' }}>
          {svc.scope}
        </span>
      </div>

      <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 20, fontWeight: 600, color: '#e8c994', lineHeight: 1.2 }}>
        {svc.title}
      </div>

      <div style={{ fontSize: 12, color: '#a09070', lineHeight: 1.55, flex: 1 }}>
        {svc.tagline}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: hov ? '#c9a96e' : '#7a6a50', textTransform: 'uppercase', transition: 'color 0.15s' }}>
          View system details
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: hov ? '#c9a96e' : '#7a6a50', transition: 'color 0.15s, transform 0.15s', display: 'inline-block', transform: hov ? 'translateX(3px)' : 'none' }}>
          →
        </span>
      </div>
    </div>
  );
}

/* ─── AUTOMATION FLOW DIAGRAM ───────────────────────────────────────────────── */

function AutoFlowDiagram() {
  return (
    <div style={{ position: 'relative', overflowX: 'auto', paddingBottom: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, minWidth: 680 }}>
        {FLOW_NODES.map((node, i) => {
          const isApproval = node.sub === 'slack / email';
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i === FLOW_NODES.length - 1 ? 'none' : 1 }}>
              <div style={{
                background: isApproval ? 'rgba(201,169,110,0.08)' : '#1e1a14',
                border: isApproval ? '1px solid rgba(201,169,110,0.35)' : '1px solid #2e2820',
                borderRadius: 8, padding: '10px 12px', minWidth: 76, flexShrink: 0,
                textAlign: 'center',
              }}>
                {node.label.split('\n').map((line, j) => (
                  <div key={j} style={{
                    fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.04em', color: isApproval ? '#c9a96e' : '#ede5d5',
                    lineHeight: 1.3, whiteSpace: 'nowrap',
                  }}>
                    {line}
                  </div>
                ))}
                <div style={{ fontFamily: 'monospace', fontSize: 8, color: '#6b6050', marginTop: 5, letterSpacing: '0.06em' }}>
                  {node.sub}
                </div>
              </div>
              {i < FLOW_NODES.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, height: 1, position: 'relative', minWidth: 16 }}>
                  <div style={{ flex: 1, height: 1, background: '#3a3228' }} />
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#4a4035', flexShrink: 0, lineHeight: 1 }}>›</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ────────────────────────────────────────────────────────── */

export default function ServicesClient() {
  const [openSvc, setOpenSvc] = useState<Service | null>(null);
  const svcRef = useRef<HTMLDivElement>(null);

  const scrollToServices = () => {
    svcRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ background: '#1c1914', minHeight: '100vh', color: '#ede5d5', fontFamily: 'DM Sans, sans-serif' }}>
      <SiteNav activePath="/services" />

      <style>{`
        * { box-sizing: border-box; }
        .svc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        @media (max-width: 960px) { .svc-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px) { .svc-grid { grid-template-columns: 1fr; } }
        .svc-scroll-wrap { position: relative; }
        @media (max-width: 700px) {
          .svc-grid { display: flex !important; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; gap: 12px; padding-bottom: 4px; }
          .svc-grid::-webkit-scrollbar { display: none; }
          .svc-grid > div { flex-shrink: 0 !important; width: 78vw; max-width: 300px; height: auto !important; scroll-snap-align: start; }
          .svc-scroll-wrap::before, .svc-scroll-wrap::after { content: ''; position: absolute; top: 0; bottom: 0; width: 44px; z-index: 2; pointer-events: none; }
          .svc-scroll-wrap::before { left: 0; background: linear-gradient(to right, #1c1914, transparent); }
          .svc-scroll-wrap::after { right: 0; background: linear-gradient(to left, #1c1914, transparent); }
        }
        .prod-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (max-width: 580px) { .prod-grid { grid-template-columns: 1fr; } }
        .cap-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0; }
        @media (max-width: 500px) { .cap-grid { grid-template-columns: 1fr; } }
        .steps-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        @media (max-width: 900px) { .steps-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 580px) { .steps-grid { grid-template-columns: repeat(2, 1fr); } }
        .why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        @media (max-width: 760px) { .why-grid { grid-template-columns: 1fr; } }
        .tier-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        @media (max-width: 760px) { .tier-grid { grid-template-columns: 1fr; } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .logo-marquee-track { display: flex; gap: 10px; animation: marquee 22s linear infinite; will-change: transform; }
        .logo-marquee-wrap { overflow: hidden; position: relative; }
        .logo-marquee-wrap::before, .logo-marquee-wrap::after { content: ''; position: absolute; top: 0; bottom: 0; width: 60px; z-index: 1; pointer-events: none; }
        .logo-marquee-wrap::before { left: 0; background: linear-gradient(to right, #1c1914, transparent); }
        .logo-marquee-wrap::after { right: 0; background: linear-gradient(to left, #1c1914, transparent); }
        .reveal-item { opacity: 0; transform: translateY(24px); }
        .reveal-item.in { opacity: 1; transform: translateY(0); transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1); }
        :focus-visible { outline: 2px solid #c9a96e; outline-offset: 3px; }
      `}</style>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section style={{ paddingTop: 120, paddingBottom: 80, position: 'relative' }}>
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
            backgroundImage: 'linear-gradient(rgba(201,169,110,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.04) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
          }} />
          <div aria-hidden="true" style={{
            position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
            width: 640, height: 320, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(201,169,110,0.09) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', maxWidth: 780 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 28 }}>
              Atlas Technology · AI Automation & Web Solutions
            </div>

            <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(38px,5.5vw,72px)', fontWeight: 600, color: '#e8c994', lineHeight: 1.02, margin: '0 0 10px', letterSpacing: '-0.01em' }}>
              Your workflows automated.
            </h1>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px,3.8vw,52px)', fontWeight: 400, color: '#7a6a4a', lineHeight: 1.1, margin: '0 0 32px', letterSpacing: '-0.01em', fontStyle: 'italic' }}>
              In weeks, not months.
            </h2>

            <p style={{ fontSize: 'clamp(14px,1.6vw,17px)', color: '#c5b99a', lineHeight: 1.75, margin: '0 0 40px', maxWidth: 580 }}>
              We design and build automation systems, AI integrations, and Next.js products for businesses done doing things manually. Fixed scope. Human approval for every sensitive action. You own everything we build.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link
                href="/contact"
                style={{
                  background: '#c9a96e', color: '#1c1914',
                  borderRadius: 8, padding: '14px 32px',
                  fontSize: 13, fontWeight: 700, letterSpacing: '0.08em',
                  textDecoration: 'none', fontFamily: 'DM Sans, sans-serif',
                  whiteSpace: 'nowrap',
                }}
              >
                Book a Discovery Call →
              </Link>
              <button
                onClick={scrollToServices}
                style={{
                  background: 'transparent', border: '1px solid #3a3228',
                  borderRadius: 8, padding: '13px 24px',
                  fontSize: 13, fontWeight: 600, color: '#a09070',
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                  letterSpacing: '0.04em', whiteSpace: 'nowrap',
                }}
              >
                See what we build ↓
              </button>
            </div>
          </div>
        </section>

        {/* ── TRUST BAR ────────────────────────────────────────────────────── */}
        <RevealSection>
          <section style={{ paddingBottom: 52 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 40px', alignItems: 'center', padding: '22px 0', borderTop: '1px solid #2e2820', borderBottom: '1px solid #2e2820' }}>
              {([
                ['12+', 'systems delivered'],
                ['~3 wk', 'avg. delivery'],
                ['4 continents', 'served remotely'],
                ['100%', 'you own it forever'],
              ] as [string, string][]).map(([num, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 28, fontWeight: 600, color: '#c9a96e', lineHeight: 1 }}>{num}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: '#6b6050', textTransform: 'uppercase' }}>{label}</span>
                </div>
              ))}
            </div>
          </section>
        </RevealSection>

        {/* ── TOOL LOGOS ───────────────────────────────────────────────────── */}
        <RevealSection>
          <section style={{ paddingBottom: 68 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', color: '#6b6050', textTransform: 'uppercase', marginBottom: 16 }}>
              Built with
            </div>
            <div className="logo-marquee-wrap">
              <div className="logo-marquee-track">
                {['n8n', 'Claude', 'GPT-4o', 'Next.js', 'Supabase', 'Vercel', 'Stripe', 'Slack', 'WhatsApp', 'HubSpot', 'Resend', 'PostgreSQL',
                  'n8n', 'Claude', 'GPT-4o', 'Next.js', 'Supabase', 'Vercel', 'Stripe', 'Slack', 'WhatsApp', 'HubSpot', 'Resend', 'PostgreSQL'].map((tool, i) => (
                  <div key={i} style={{ flexShrink: 0, background: '#1e1a14', border: '1px solid #2e2820', borderRadius: 6, padding: '7px 16px', fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: '#a09070', whiteSpace: 'nowrap' }}>
                    {tool}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </RevealSection>

        {/* ── AUTOMATION FLOW ───────────────────────────────────────────────── */}
        <section style={{ paddingBottom: 80 }}>
          <div style={{ background: '#1a1710', border: '1px solid #2e2820', borderRadius: 12, padding: '28px 28px 24px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', color: '#6b6050', textTransform: 'uppercase', marginBottom: 18 }}>
              System architecture · Example automation pipeline
            </div>
            <AutoFlowDiagram />
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#4a4035', marginTop: 18, letterSpacing: '0.08em' }}>
              Every sensitive action — AI draft, outbound notification — routes through a human approval gate before executing.
            </div>
          </div>
        </section>

        {/* ── SERVICES ─────────────────────────────────────────────────────── */}
        <section ref={svcRef} style={{ paddingBottom: 80, scrollMarginTop: 80 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 10 }}>
                Services
              </div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 600, color: '#e8c994', margin: 0, lineHeight: 1.2 }}>
                What we build
              </h2>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6b6050', letterSpacing: '0.08em' }}>
              Select a card for full system details
            </div>
          </div>

          <div className="svc-scroll-wrap">
            <div className="svc-grid">
              {SERVICES.map((svc, i) => (
                <RevealSection key={svc.id} delay={i * 70} style={{ height: '100%' }}>
                  <ServiceCard svc={svc} onOpen={() => setOpenSvc(svc)} />
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCTS ─────────────────────────────────────────────────────── */}
        <section style={{ paddingBottom: 80 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 10 }}>
            Products & Platforms
          </div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 600, color: '#e8c994', margin: '0 0 20px', lineHeight: 1.2 }}>
            Built by Atlas
          </h2>
          <div className="prod-grid">
            {PRODUCTS.map(p => (
              <div key={p.id} style={{ background: '#1e1a14', border: '1px solid #2e2820', borderRadius: 10, padding: '20px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: '#6b6050', textTransform: 'uppercase', marginBottom: 10 }}>
                  {p.label}
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 18, fontWeight: 600, color: '#e8c994', marginBottom: 8, lineHeight: 1.2 }}>
                  {p.title}
                </div>
                <p style={{ fontSize: 12, color: '#a09070', lineHeight: 1.6, margin: '0 0 16px' }}>
                  {p.desc}
                </p>
                {p.external ? (
                  <a href={p.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#c9a96e', textDecoration: 'none', textTransform: 'uppercase' }}>
                    {p.cta} →
                  </a>
                ) : (
                  <Link href={p.href} style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#c9a96e', textDecoration: 'none', textTransform: 'uppercase' }}>
                    {p.cta} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── CAPABILITIES ─────────────────────────────────────────────────── */}
        <section style={{ paddingBottom: 80 }}>
          <div style={{ background: '#1a1710', border: '1px solid #2e2820', borderRadius: 12, padding: '28px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 8 }}>
              Technical Stack
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 22, fontWeight: 600, color: '#e8c994', marginBottom: 20, lineHeight: 1.2 }}>
              What we work with
            </div>
            <div className="cap-grid">
              {CAPABILITIES.map((cap, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid #231f18' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#c9a96e', lineHeight: '20px', flexShrink: 0 }}>▸</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#a09070', letterSpacing: '0.03em', lineHeight: 1.5 }}>{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ENGAGEMENT TIERS ─────────────────────────────────────────────── */}
        <RevealSection>
          <section style={{ paddingBottom: 80 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 10 }}>
              Engagement
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 600, color: '#e8c994', margin: '0 0 24px', lineHeight: 1.2 }}>
              How we work together
            </h2>
            <div className="tier-grid">
              {([
                {
                  label: 'Project',
                  title: 'One-Time Build',
                  desc: 'Best for teams with a clear problem and a defined scope. We agree on exactly what gets built, build it, and hand it off. Fixed price, fixed timeline.',
                  items: ['Scoped before we start', 'Fixed price · no surprises', 'Full handoff with docs', 'You own the system forever'],
                  highlight: false,
                },
                {
                  label: 'Retainer',
                  title: 'Ongoing Partnership',
                  desc: 'Best for operators who want systems that grow with their business. Monthly engagement with a defined focus area and continuous iteration.',
                  items: ['Monthly automation focus', 'Evolving system design', 'Priority turnaround', 'Slack-based async comms'],
                  highlight: true,
                },
                {
                  label: 'Support',
                  title: 'System Care',
                  desc: 'Best for businesses with an existing Atlas-built or custom automation stack that needs monitoring, fixes, or minor changes on an ongoing basis.',
                  items: ['Bug fixes and edge cases', 'Minor workflow changes', 'Health monitoring', 'Response within 48h'],
                  highlight: false,
                },
              ] as { label: string; title: string; desc: string; items: string[]; highlight: boolean }[]).map(tier => (
                <div key={tier.label} style={{
                  background: tier.highlight ? '#1e1b12' : '#1e1a14',
                  border: `1px solid ${tier.highlight ? 'rgba(201,169,110,0.35)' : '#2e2820'}`,
                  borderRadius: 10, padding: '28px 24px',
                  display: 'flex', flexDirection: 'column', gap: 16,
                  boxShadow: tier.highlight ? '0 0 32px rgba(201,169,110,0.06)' : 'none',
                }}>
                  <div>
                    <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: tier.highlight ? '#c9a96e' : '#6b6050', textTransform: 'uppercase', marginBottom: 10 }}>
                      {tier.label}
                    </div>
                    <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 22, fontWeight: 600, color: '#e8c994', lineHeight: 1.2, marginBottom: 12 }}>
                      {tier.title}
                    </div>
                    <p style={{ fontSize: 13, color: '#a09070', lineHeight: 1.65, margin: 0 }}>
                      {tier.desc}
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid #2e2820', paddingTop: 16, flex: 1 }}>
                    {tier.items.map(item => (
                      <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#c9a96e', lineHeight: '20px', flexShrink: 0 }}>▸</span>
                        <span style={{ fontSize: 12, color: '#c5b99a', lineHeight: 1.55 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/contact"
                    style={{
                      display: 'block',
                      background: tier.highlight ? '#c9a96e' : 'transparent',
                      color: tier.highlight ? '#1c1914' : '#a09070',
                      border: tier.highlight ? 'none' : '1px solid #3a3228',
                      borderRadius: 8, padding: '11px 20px',
                      fontSize: 12, fontWeight: 700, letterSpacing: '0.06em',
                      textDecoration: 'none', fontFamily: 'DM Sans, sans-serif',
                      textAlign: 'center',
                    }}
                  >
                    Book a Discovery Call →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </RevealSection>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
        <section style={{ paddingBottom: 80 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 10 }}>
            Process
          </div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 600, color: '#e8c994', margin: '0 0 20px', lineHeight: 1.2 }}>
            How Atlas works
          </h2>
          <div className="steps-grid">
            {STEPS.map(s => (
              <div key={s.num} style={{ background: '#1e1a14', border: '1px solid #2e2820', borderRadius: 10, padding: '20px 18px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: 'rgba(201,169,110,0.25)', marginBottom: 12, lineHeight: 1 }}>
                  {s.num}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#ede5d5', marginBottom: 8, lineHeight: 1.35 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 12, color: '#a09070', lineHeight: 1.6 }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHY ATLAS ────────────────────────────────────────────────────── */}
        <section style={{ paddingBottom: 80 }}>
          <div className="why-grid">
            {[
              { label: 'Remote-first', title: 'Fully remote delivery', desc: 'We work asynchronously across timezones. No on-site visits required — clear scope document, async updates, delivery on schedule.' },
              { label: 'Clear scope', title: 'Scope before we build', desc: 'Every engagement starts with a written scope: what gets built, what connects to what, and what done looks like. No surprises.' },
              { label: 'You own it', title: 'Zero vendor lock-in', desc: 'You own the workflow, the credentials, the code, and the infrastructure. Full handoff documentation. Cancel whenever you want.' },
            ].map(item => (
              <div key={item.label} style={{ background: '#1e1a14', border: '1px solid #2e2820', borderRadius: 10, padding: '24px 22px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 12 }}>
                  {item.label}
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 18, fontWeight: 600, color: '#e8c994', marginBottom: 10, lineHeight: 1.2 }}>
                  {item.title}
                </div>
                <p style={{ fontSize: 13, color: '#a09070', lineHeight: 1.65, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <RevealSection>
          <section style={{ paddingBottom: 80 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 10 }}>
              FAQ
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 600, color: '#e8c994', margin: '0 0 28px', lineHeight: 1.2 }}>
              Common questions
            </h2>
            <div style={{ maxWidth: 760, borderBottom: '1px solid #2e2820' }}>
              {([
                { q: 'How long does a project actually take?', a: 'Most automation projects ship in 2–4 weeks from scope sign-off. Websites take 3–6 weeks depending on complexity. Everything starts with a written scope document so you know the timeline before any work begins.' },
                { q: "What if I don't know exactly what I need?", a: "That's the point of the discovery call. We review your current workflow, find the highest-value automation opportunities, and write up a clear plan — no commitment needed. Most clients come in saying the same thing." },
                { q: 'Do I need technical knowledge to work with you?', a: 'Not at all. You describe the problem in plain language — what takes too long, what breaks, what you do manually every week — and we translate that into a system.' },
                { q: 'How much does it cost?', a: 'Scope determines price, so we give you an exact number before work begins. Simple automation pipelines start small. Full web products or complex multi-system builds are scoped individually. The discovery call is always free.' },
                { q: 'What happens after the project is delivered?', a: 'You get full documentation, credentials, and a walkthrough session. You own the system — the code, the workflows, the infrastructure. Nothing is locked to us.' },
                { q: 'Do you work with businesses outside Canada?', a: 'Yes. Remote-first by design. Current and past clients span North America, Europe, South Asia, and Southeast Asia. Timezone has never been a blocker.' },
              ] as { q: string; a: string }[]).map((item, i) => (
                <div key={i} style={{ padding: '22px 0', borderTop: '1px solid #2e2820' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 19, fontWeight: 600, color: '#e8c994', marginBottom: 10, lineHeight: 1.25 }}>
                    {item.q}
                  </div>
                  <p style={{ fontSize: 13, color: '#a09070', lineHeight: 1.7, margin: 0 }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </RevealSection>

        {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
        <section style={{ paddingBottom: 100 }}>
          <div style={{ position: 'relative', background: '#1a1710', border: '1px solid #3a3228', borderRadius: 16, padding: 'clamp(40px,5vw,64px)', textAlign: 'center', overflow: 'hidden' }}>
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 70% at 50% 0%, rgba(201,169,110,0.06), transparent)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 20 }}>
                Free Consultation · No Commitment
              </div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 600, color: '#e8c994', margin: '0 0 20px', lineHeight: 1.15 }}>
                Ready to stop doing it manually?
              </h2>
              <p style={{ fontSize: 15, color: '#a09070', lineHeight: 1.7, margin: '0 auto 36px', maxWidth: 520 }}>
                Book a free 30-minute discovery call. We&apos;ll review your workflow and come back with a clear plan — no sales pitch, no commitment.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                  href="/contact"
                  style={{
                    background: '#c9a96e', color: '#1c1914',
                    borderRadius: 8, padding: '14px 32px',
                    fontSize: 13, fontWeight: 700, letterSpacing: '0.08em',
                    textDecoration: 'none', fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  Book a Discovery Call →
                </Link>
                <button
                  onClick={scrollToServices}
                  style={{
                    background: 'transparent', border: '1px solid #3a3228',
                    borderRadius: 8, padding: '13px 24px',
                    fontSize: 13, fontWeight: 600, color: '#a09070',
                    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                    letterSpacing: '0.04em',
                  }}
                >
                  Browse services
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #2e2820', padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: '#6b6050', marginBottom: 12, fontFamily: 'monospace', letterSpacing: '0.06em' }}>
          Operated from Canada · Serving clients remotely worldwide
        </div>
        <div style={{ fontSize: 12, color: '#6b6050' }}>
          © {new Date().getFullYear()} Atlas Technology &nbsp;·&nbsp;
          <Link href="/contact" style={{ color: '#6b6050', textDecoration: 'none' }}>Contact</Link>
          &nbsp;·&nbsp;
          <Link href="/blog" style={{ color: '#6b6050', textDecoration: 'none' }}>Blog</Link>
          &nbsp;·&nbsp;
          <Link href="/" style={{ color: '#6b6050', textDecoration: 'none' }}>Travel App</Link>
        </div>
      </footer>

      {openSvc && <ServiceDrawer svc={openSvc} onClose={() => setOpenSvc(null)} />}
    </div>
  );
}
