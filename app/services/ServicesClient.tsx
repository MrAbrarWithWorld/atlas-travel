'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowsClockwise,
  BracketsCurly,
  Browser,
  CaretDown,
  ChartLineUp,
  Check,
  CheckCircle,
  ClipboardText,
  Code,
  Compass,
  Database,
  EnvelopeSimple,
  FlowArrow,
  Gauge,
  LinkSimple,
  ListChecks,
  LockKey,
  Monitor,
  Pause,
  Play,
  RocketLaunch,
  Robot,
  ShieldCheck,
  Sparkle,
  Stack,
  UserCheck,
  X,
} from '@phosphor-icons/react';
import SiteNav from '../components/SiteNav';
import styles from './ServicesClient.module.css';

const SERVICES = [
  {
    id: 'workflow-automation',
    abbrev: 'AI',
    category: 'Automation',
    title: 'AI Workflow Automation',
    shortTitle: 'Workflow automation',
    tagline: 'Turn requests, approvals, handoffs, and updates into one controlled flow.',
    overview:
      'Atlas maps the way work already moves through your team, then builds an automation around it. AI can prepare the next step while consequential actions remain behind an approval gate.',
    bestFor:
      'Service teams and operators dealing with repeated intake, routing, follow-up, and status communication.',
    problems: [
      'Requests arrive through several channels and lose context',
      'Approvals depend on manual reminders',
      'Routine follow-up is rewritten every time',
      'Ownership becomes unclear after a handoff',
    ],
    whatWeBuild: [
      'Structured intake from forms, email, webhook, or schedule',
      'Context collection and conditional routing',
      'AI-assisted drafting with output validation',
      'Human approval checkpoints for sensitive actions',
      'Task, status, and activity-history updates',
    ],
    deliverables: [
      'Documented current-state and proposed workflow',
      'Configured automation with test scenarios',
      'Approval and exception-handling design',
      'Handoff notes for operating the system',
    ],
  },
  {
    id: 'crm-lead-capture',
    abbrev: 'CRM',
    category: 'CRM',
    title: 'CRM & Lead Capture',
    shortTitle: 'Intake & CRM systems',
    tagline: 'Move an inbound request from capture to ownership without copy-and-paste work.',
    overview:
      'A connected intake system can create a clean CRM record, notify the right person, prepare a response, and keep the next action visible.',
    bestFor:
      'Businesses that rely on inbound enquiries but do not have a consistent route from first contact to follow-up.',
    problems: [
      'Leads sit in a shared inbox without clear ownership',
      'Information is copied between email and spreadsheets',
      'Duplicate or incomplete records create extra work',
      'Follow-up timing depends on someone remembering',
    ],
    whatWeBuild: [
      'Web-form or API intake endpoint',
      'Validation, routing, and deduplication',
      'CRM record creation and ownership assignment',
      'Team notification in the preferred channel',
      'Draft response queued for human review',
    ],
    deliverables: [
      'Working intake route with test records',
      'Configured CRM connection',
      'Notification and ownership rules',
      'End-to-end walkthrough and handoff notes',
    ],
  },
  {
    id: 'website-development',
    abbrev: 'WEB',
    category: 'Web',
    title: 'Web Apps & Portals',
    shortTitle: 'Web apps & portals',
    tagline: 'Useful client and internal experiences with automation designed in from the start.',
    overview:
      'Atlas builds focused web applications and portals that connect the user experience to the operational system behind it.',
    bestFor:
      'Teams that need a practical customer, resident, vendor, or internal interface instead of another disconnected form.',
    problems: [
      'The current website does not support the real workflow',
      'Users cannot see request or task status',
      'Staff re-enter information into internal tools',
      'New features are difficult to add safely',
    ],
    whatWeBuild: [
      'Next.js interfaces designed around the task',
      'Secure server-side routes and validation',
      'Database, content, or CRM connections',
      'Role-appropriate views and status states',
      'Deployment and handoff configuration',
    ],
    deliverables: [
      'Responsive application or portal',
      'Connected forms and operational routes',
      'Tested primary user journey',
      'Implementation and handoff notes',
    ],
  },
  {
    id: 'email-report-automation',
    abbrev: 'EML',
    category: 'Communication',
    title: 'AI Email & Report Automation',
    shortTitle: 'Email & reporting',
    tagline: 'Compile the context, prepare the update, and leave the final decision with your team.',
    overview:
      'Atlas can assemble information from approved sources, prepare a structured draft, and deliver it to a review surface before anything is sent.',
    bestFor:
      'Operators who repeatedly prepare status reports, summaries, follow-ups, and internal updates.',
    problems: [
      'The same report is assembled manually each cycle',
      'Context is scattered across several tools',
      'Drafting starts from a blank page every time',
      'There is no consistent review checkpoint',
    ],
    whatWeBuild: [
      'Scheduled or event-triggered collection',
      'Structured source aggregation',
      'AI-assisted summaries using defined templates',
      'Human review and edit checkpoint',
      'Approved delivery and activity recording',
    ],
    deliverables: [
      'Configured workflow with a test run',
      'Review surface and output template',
      'Source and schedule configuration',
      'Operating notes for future adjustments',
    ],
  },
  {
    id: 'process-automation',
    abbrev: 'OPS',
    category: 'Operations',
    title: 'Business Process Automation',
    shortTitle: 'Process systems',
    tagline: 'Replace fragile handoffs with a visible, testable operating path.',
    overview:
      'We identify a high-friction process, agree on the controls, and build a focused system that follows the way your team needs to work.',
    bestFor:
      'Operations leads, office managers, and founders managing repeated approvals, schedules, data sync, or notification chains.',
    problems: [
      'A spreadsheet is doing the work of a system',
      'Approvals require chasing the right person',
      'One tool contains data another tool needs',
      'The process breaks when someone is unavailable',
    ],
    whatWeBuild: [
      'Trigger-to-action workflow design',
      'Structured form or API input',
      'Conditional routing and exception handling',
      'Approval gates and ownership rules',
      'Cross-tool status and data synchronization',
    ],
    deliverables: [
      'Current and proposed process map',
      'Configured workflow with test results',
      'Exception and recovery notes',
      'Team walkthrough and handoff documentation',
    ],
  },
  {
    id: 'ai-product-integration',
    abbrev: 'SDK',
    category: 'AI Product',
    title: 'AI Product & API Integration',
    shortTitle: 'AI product integration',
    tagline: 'Add a focused AI capability without turning the whole product into an experiment.',
    overview:
      'Atlas integrates classification, summarization, drafting, or conversational assistance into an existing product with clear inputs, output validation, and fallback behavior.',
    bestFor:
      'Product teams with a specific, testable AI use case that should fit into an existing user journey.',
    problems: [
      'The right AI use case is not clearly bounded',
      'Prompts and outputs are difficult to test',
      'Model failure behavior is undefined',
      'The existing product has no safe integration path',
    ],
    whatWeBuild: [
      'Server-side model integration',
      'Prompt templates and structured output schemas',
      'Validation, fallback, and error states',
      'Context handling for the selected use case',
      'A test path for regression review',
    ],
    deliverables: [
      'Working integration in the selected experience',
      'Documented prompt and output contract',
      'Test cases and failure-state review',
      'Extension notes for future iterations',
    ],
  },
];

const PRODUCTS = [
  {
    label: 'Live product',
    title: 'Atlas AI Travel Planner',
    desc: 'A day-by-day itinerary builder with planning, chat, and shareable trip views.',
    cta: 'Try Atlas',
    href: '/travel',
    external: false,
  },
  {
    label: 'Content platform',
    title: 'Atlas Travel Blog',
    desc: 'Destination guides and travel content built on the same Atlas web foundation.',
    cta: 'Read the blog',
    href: '/blog',
    external: false,
  },
  {
    label: 'Media product',
    title: 'Atlas Travel News',
    desc: 'A focused travel-news surface with organized summaries and updates.',
    cta: 'Visit the news site',
    href: 'https://news.getatlas.ca',
    external: true,
  },
  {
    label: 'Client work',
    title: 'Atlas Product Studio',
    desc: 'Practical product development and automation shaped around one real workflow.',
    cta: 'Discuss a project',
    href: '/contact',
    external: false,
  },
];

const CAPABILITIES = [
  'Automation workflows',
  'OpenAI and Anthropic models',
  'Next.js applications',
  'Supabase data systems',
  'CRM and intake architecture',
  'Slack, WhatsApp, and email',
  'Human approval systems',
  'Vercel delivery workflows',
];

const STEPS = [
  {
    num: '01',
    title: 'Find the friction',
    desc: 'We map the repeated work, missed handoffs, and information gaps.',
    icon: Compass,
  },
  {
    num: '02',
    title: 'Design the control',
    desc: 'We define what the system prepares, what people approve, and what stays manual.',
    icon: Gauge,
  },
  {
    num: '03',
    title: 'Build one useful flow',
    desc: 'We connect, configure, and test a focused workflow against realistic scenarios.',
    icon: Code,
  },
  {
    num: '04',
    title: 'Improve from evidence',
    desc: 'Real usage and feedback guide the next improvement or expansion.',
    icon: ChartLineUp,
  },
];

const HERO_STAGES = [
  { title: 'Request received', icon: EnvelopeSimple },
  { title: 'Context', icon: Stack },
  { title: 'AI draft', icon: Sparkle },
  { title: 'Human approval', icon: UserCheck },
  { title: 'Work order', icon: ClipboardText },
  { title: 'Logged outcome', icon: CheckCircle },
];

const FEATURE_SLIDES = [
  {
    eyebrow: '01 · Workflow design',
    title: 'Built around your workflow',
    copy: 'We map how your team actually works—requests, approvals, handoffs, and updates—then build automation that follows it.',
    bullets: [
      'Capture from any approved channel',
      'Route and prioritize with context',
      'Sync status back to your systems',
    ],
  },
  {
    eyebrow: '02 · Human control',
    title: 'Approval before action',
    copy: 'AI can prepare the next step, while your team keeps control of sensitive messages, assignments, and consequential actions.',
    bullets: [
      'Place gates at the right decisions',
      'Review, edit, approve, or return',
      'Keep exceptions visible to people',
    ],
  },
  {
    eyebrow: '03 · Activity history',
    title: 'A trail your team can follow',
    copy: 'Each important transition can record what happened, what is waiting, and who owns the next step.',
    bullets: [
      'See the current workflow state',
      'Keep ownership and handoffs clear',
      'Review important activity later',
    ],
  },
];

const SERVICE_ICONS = [
  FlowArrow,
  Database,
  Browser,
  EnvelopeSimple,
  ArrowsClockwise,
  BracketsCurly,
];

type Service = (typeof SERVICES)[number];

function useMotionPreference() {
  const [motionEnabled, setMotionEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const saved = window.sessionStorage.getItem('atlas-services-motion');
    const apply = () => {
      if (saved === 'on') setMotionEnabled(true);
      else if (saved === 'off') setMotionEnabled(false);
      else setMotionEnabled(!media.matches);
    };
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  const toggle = useCallback(() => {
    setMotionEnabled((current) => {
      const next = !current;
      window.sessionStorage.setItem('atlas-services-motion', next ? 'on' : 'off');
      return next;
    });
  }, []);

  return { motionEnabled, toggle };
}

function RevealSection({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px' }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[styles.reveal, visible ? styles.revealVisible : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

function MotionToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.motionToggle}
      onClick={onToggle}
      aria-pressed={enabled}
    >
      {enabled ? <Pause size={14} weight="bold" /> : <Play size={14} weight="fill" />}
      <span>Motion {enabled ? 'on' : 'off'}</span>
    </button>
  );
}

function DrawerBullet({ children }: { children: React.ReactNode }) {
  return (
    <li className={styles.drawerBullet}>
      <Check size={14} weight="bold" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

function ServiceDrawer({
  service,
  onClose,
  contactHref,
}: {
  service: Service;
  onClose: () => void;
  contactHref: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setMounted(true);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => {
      setVisible(true);
      closeRef.current?.focus();
    });
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const close = useCallback(() => {
    if (reduceMotion.current) {
      onClose();
      return;
    }
    setVisible(false);
    window.setTimeout(onClose, 320);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [close]);

  if (!mounted) return null;

  return createPortal(
    <div className={styles.drawerLayer} data-visible={visible}>
      <button
        type="button"
        className={styles.drawerBackdrop}
        onClick={close}
        aria-label="Close service details"
      />
      <div
        ref={panelRef}
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-drawer-title"
      >
        <div className={styles.drawerHeader}>
          <div>
            <span className={styles.eyebrow}>{service.category}</span>
            <h2 id="service-drawer-title">{service.title}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className={styles.iconButton}
            onClick={close}
            aria-label="Close"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        <p className={styles.drawerLead}>{service.tagline}</p>

        <div className={styles.drawerSection}>
          <span className={styles.drawerLabel}>Overview</span>
          <p>{service.overview}</p>
        </div>
        <div className={styles.drawerSection}>
          <span className={styles.drawerLabel}>Best fit</span>
          <p>{service.bestFor}</p>
        </div>
        <div className={styles.drawerSection}>
          <span className={styles.drawerLabel}>Problems addressed</span>
          <ul>{service.problems.map((item) => <DrawerBullet key={item}>{item}</DrawerBullet>)}</ul>
        </div>
        <div className={styles.drawerSection}>
          <span className={styles.drawerLabel}>What Atlas can build</span>
          <ul>{service.whatWeBuild.map((item) => <DrawerBullet key={item}>{item}</DrawerBullet>)}</ul>
        </div>
        <div className={styles.drawerSection}>
          <span className={styles.drawerLabel}>Example deliverables</span>
          <ul>{service.deliverables.map((item) => <DrawerBullet key={item}>{item}</DrawerBullet>)}</ul>
        </div>

        <div className={styles.drawerCta}>
          <p>Final scope, delivery plan, and handoff are defined around the selected workflow.</p>
          <Link href={contactHref} className={styles.primaryButton}>
            Discuss this workflow
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}

function HeroWorkflow({
  motionEnabled,
}: {
  motionEnabled: boolean;
}) {
  const [activeStage, setActiveStage] = useState(3);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (!motionEnabled || manual) return;
    const timer = window.setInterval(() => {
      setActiveStage((current) => (current + 1) % HERO_STAGES.length);
    }, 2400);
    return () => window.clearInterval(timer);
  }, [motionEnabled, manual]);

  const activeTitle = HERO_STAGES[activeStage].title;
  const approvalActive = activeStage === 3;

  return (
    <div className={styles.heroConsole} aria-label="Example property service workflow">
      <div className={styles.consoleTexture} aria-hidden="true" />
      <div className={styles.scanLine} aria-hidden="true" />
      <div className={styles.consoleTopline}>
        <span>Example workflow</span>
        <span className={styles.consoleDivider}>Property service request</span>
        <span className={styles.exampleOnly}>
          <span className={styles.liveDot} />
          Example only
        </span>
      </div>

      <ol className={styles.stageRail}>
        {HERO_STAGES.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = index === activeStage;
          const isComplete = index < activeStage;
          return (
            <li
              key={stage.title}
              className={styles.stage}
              data-active={isActive}
              data-complete={isComplete}
            >
              <button
                type="button"
                onClick={() => {
                  setManual(true);
                  setActiveStage(index);
                }}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className={styles.stageIcon}>
                  <Icon size={18} weight={isActive ? 'duotone' : 'regular'} />
                </span>
                <span>{stage.title}</span>
              </button>
              {index < HERO_STAGES.length - 1 && (
                <span className={styles.stageConnector} aria-hidden="true">
                  <span />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className={styles.consoleBody}>
        <div className={styles.approvalPanel}>
          <span className={styles.consoleLabel}>
            Step {String(activeStage + 1).padStart(2, '0')} of 06
          </span>
          <h3>{approvalActive ? 'Human approval' : activeTitle}</h3>
          <p>
            {approvalActive
              ? 'Review the AI-prepared draft. Edit if needed, then approve the next action.'
              : 'The example is moving through the selected workflow state. Your system would reflect your team’s real controls.'}
          </p>

          <dl className={styles.summaryGrid}>
            <div>
              <dt>Request</dt>
              <dd>Leaking faucet in Unit 3B</dd>
            </div>
            <div>
              <dt>Property</dt>
              <dd>Maple Walk Apartments</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>Plumbing · Leak</dd>
            </div>
            <div>
              <dt>Priority</dt>
              <dd><span className={styles.priorityDot} /> Medium</dd>
            </div>
            <div>
              <dt>Assignee</dt>
              <dd>Turner Plumbing</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{activeTitle}</dd>
            </div>
          </dl>

          <div className={styles.aiNote}>
            <span>AI notes</span>
            <p>Detected an ongoing leak risk. Prior similar issue logged for the same unit.</p>
          </div>
        </div>

        <div className={styles.reviewPanel}>
          <span className={styles.consoleLabel}>Review controls</span>
          <button type="button" className={styles.approveButton}>
            Approve &amp; dispatch
            <ArrowRight size={15} weight="bold" />
            <span className={styles.approvalPulse} aria-hidden="true" />
          </button>
          <button type="button" className={styles.secondaryConsoleButton}>
            Request changes
          </button>

          <div className={styles.activity}>
            <span className={styles.consoleLabel}>Activity trail</span>
            <div className={styles.activityRow}>
              <span className={styles.activityTime}>8:42 AM</span>
              <span>Draft prepared by Atlas</span>
              <span className={styles.aiTag}>AI</span>
            </div>
            <div className={styles.activityRow} data-current={approvalActive}>
              <span className={styles.activityTime}>8:45 AM</span>
              <span>{approvalActive ? 'Waiting for human approval' : activeTitle}</span>
              <span className={styles.youTag}>You</span>
            </div>
            <div className={styles.activityRow} data-muted="true">
              <span className={styles.activityTime}>—</span>
              <span>Work order and update</span>
              <span className={styles.pendingTag}>Pending</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.consoleFooter}>
        <span>This is an example workflow. Yours will match how your team works.</span>
        <span className={styles.liveStatus}><span className={styles.liveDot} /> Live demo</span>
      </div>
    </div>
  );
}

function WorkflowFeature({
  motionEnabled,
}: {
  motionEnabled: boolean;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!motionEnabled || paused) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % FEATURE_SLIDES.length);
    }, 7600);
    return () => window.clearInterval(timer);
  }, [motionEnabled, paused]);

  const slide = FEATURE_SLIDES[active];

  return (
    <div
      className={styles.featurePanel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <span className={styles.cornerIndex}>{String(active + 1).padStart(2, '0')}</span>
      <div className={styles.featureVisual}>
        <Image
          src="/services/workflow-hud.webp"
          width={600}
          height={440}
          alt=""
          priority={false}
          className={styles.workflowImage}
        />
        <span className={styles.signalPacket} aria-hidden="true" />
        <span className={styles.signalPacketTwo} aria-hidden="true" />
        <span className={styles.visualCaption}>Animated workflow illustration · Example only</span>
      </div>

      <div className={styles.featureCopy} key={slide.title}>
        <span className={styles.eyebrow}>{slide.eyebrow}</span>
        <h3>{slide.title}</h3>
        <p>{slide.copy}</p>
        <ul>
          {slide.bullets.map((bullet) => (
            <li key={bullet}>
              <Check size={15} weight="bold" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.featureDots} aria-label="Featured workflow views">
        {FEATURE_SLIDES.map((item, index) => (
          <button
            type="button"
            key={item.title}
            className={styles.featureDot}
            data-active={index === active}
            aria-label={'Show ' + item.title}
            aria-current={index === active ? 'true' : undefined}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default function ServicesClient() {
  const [openService, setOpenService] = useState<Service | null>(null);
  const [contactAttribution, setContactAttribution] = useState('');
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const { motionEnabled, toggle } = useMotionPreference();

  useEffect(() => {
    const incoming = new URLSearchParams(window.location.search);
    const preserved = new URLSearchParams();
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
      const value = incoming.get(key)?.trim().slice(0, 160);
      if (value) preserved.set(key, value);
    });
    setContactAttribution(preserved.toString());
  }, []);

  const contactHref = useCallback((serviceId?: string) => {
    const params = new URLSearchParams(contactAttribution);
    if (serviceId) params.set('service', serviceId);
    const query = params.toString();
    return query ? `/contact?${query}` : '/contact';
  }, [contactAttribution]);

  const showService = (service: Service, trigger: HTMLElement) => {
    returnFocusRef.current = trigger;
    setOpenService(service);
  };

  const closeService = () => {
    setOpenService(null);
    window.requestAnimationFrame(() => returnFocusRef.current?.focus());
  };

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({
      behavior: motionEnabled ? 'smooth' : 'auto',
      block: 'start',
    });
  };

  return (
    <div
      className={[styles.page, motionEnabled ? styles.motionOn : styles.motionOff].join(' ')}
    >
      <SiteNav
        activePath="/services"
        ctaLabel="Plan my automation →"
        ctaHref={contactHref()}
      />

      <main>
        <section className={styles.hero}>
          <div className={styles.heroField} aria-hidden="true" />
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <div className={styles.heroMeta}>
                <span className={styles.eyebrow}>Atlas AI Technology · Practical automation for real operations</span>
                <MotionToggle enabled={motionEnabled} onToggle={toggle} />
              </div>
              <h1>From incoming request to handled.</h1>
              <p>
                Atlas connects messy incoming requests to clear, human-controlled
                actions—so your team stays focused and the next step stays visible.
              </p>
              <div className={styles.heroActions}>
                <Link href={contactHref()} className={styles.primaryButton}>
                  Plan my automation
                  <ArrowRight size={16} weight="bold" />
                </Link>
                <button type="button" className={styles.textButton} onClick={scrollToServices}>
                  See how it works
                  <CaretDown size={15} weight="bold" />
                </button>
              </div>
              <div className={styles.heroPrinciples}>
                <span><ShieldCheck size={18} /> Human control</span>
                <span><ListChecks size={18} /> Visible history</span>
                <span><LinkSimple size={18} /> Connected tools</span>
              </div>
            </div>
            <HeroWorkflow motionEnabled={motionEnabled} />
          </div>
        </section>

        <section className={styles.decisionStrip} aria-label="Atlas control principles">
          <div className={styles.decisionInner}>
            <ShieldCheck size={28} weight="duotone" />
            <span>You decide what runs.</span>
            <span>You decide what waits.</span>
            <span>Every action is recorded.</span>
          </div>
        </section>

        <section ref={servicesRef} className={styles.servicesSystem}>
          <RevealSection className={styles.sectionInner}>
            <span className={styles.eyebrow}>Our services</span>
            <h2>Six services. One operating system.</h2>
            <p className={styles.sectionLead}>
              Each service addresses a critical part of the workflow—and they work
              better when the handoffs are designed together.
            </p>

            <div className={styles.servicesLayout}>
              <WorkflowFeature motionEnabled={motionEnabled} />
              <div className={styles.serviceNavigator}>
                {SERVICES.map((service, index) => {
                  const Icon = SERVICE_ICONS[index];
                  return (
                    <button
                      type="button"
                      key={service.id}
                      className={styles.serviceRow}
                      onClick={(event) => showService(service, event.currentTarget)}
                    >
                      <span className={styles.serviceNumber}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <Icon size={20} weight="duotone" />
                      <span className={styles.serviceRowText}>
                        <strong>{service.shortTitle}</strong>
                        <small>{service.tagline}</small>
                      </span>
                      <ArrowRight size={17} weight="bold" className={styles.rowArrow} />
                    </button>
                  );
                })}
              </div>
            </div>
          </RevealSection>
        </section>

        <section className={styles.processSection}>
          <RevealSection className={styles.sectionInner}>
            <span className={styles.eyebrow}>How it works</span>
            <div className={styles.processHeading}>
              <h2>Start with one high-value workflow. Build from proof.</h2>
              <p>Discovery, design, build, testing, and handoff stay connected to one clear operational goal.</p>
            </div>
            <ol className={styles.processRail}>
              {STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <li key={step.num}>
                    <div className={styles.processIcon}>
                      <span>{step.num}</span>
                      <Icon size={22} weight="duotone" />
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </li>
                );
              })}
            </ol>
          </RevealSection>
        </section>

        <section className={styles.controlSection}>
          <RevealSection className={styles.sectionInner}>
            <div className={styles.splitHeading}>
              <div>
                <span className={styles.eyebrow}>Control is a feature</span>
                <h2>AI that knows where to stop.</h2>
              </div>
              <p>
                The strongest automation is not the one that removes every person.
                It is the one that makes the right work clearer and keeps the right
                decisions human.
              </p>
            </div>

            <div className={styles.controlGrid}>
              <article className={styles.controlCard}>
                <UserCheck size={30} weight="duotone" />
                <span className={styles.cardIndex}>01</span>
                <h3>Approval gates</h3>
                <p>Sensitive messages and consequential actions pause at a defined review point.</p>
              </article>
              <article className={styles.controlCard}>
                <LockKey size={30} weight="duotone" />
                <span className={styles.cardIndex}>02</span>
                <h3>Bounded access</h3>
                <p>Each workflow is designed around only the connections and permissions it needs.</p>
              </article>
              <article className={styles.controlCard}>
                <ListChecks size={30} weight="duotone" />
                <span className={styles.cardIndex}>03</span>
                <h3>Visible activity</h3>
                <p>Important transitions keep their state, owner, and next action understandable.</p>
              </article>
            </div>
          </RevealSection>
        </section>

        <section className={styles.workSection}>
          <RevealSection className={styles.sectionInner}>
            <div className={styles.splitHeading}>
              <div>
                <span className={styles.eyebrow}>Products &amp; platforms</span>
                <h2>Built by Atlas.</h2>
              </div>
              <p>Working product surfaces that show how design, engineering, content, and operations can live in one system.</p>
            </div>
            <div className={styles.productGrid}>
              {PRODUCTS.map((product, index) => {
                const Icon = [Monitor, Browser, Robot, BracketsCurly][index];
                const content = (
                  <>
                    <span className={styles.productTopline}>
                      <Icon size={21} weight="duotone" />
                      {product.label}
                    </span>
                    <h3>{product.title}</h3>
                    <p>{product.desc}</p>
                    <span className={styles.productCta}>
                      {product.cta}
                      <ArrowRight size={15} weight="bold" />
                    </span>
                  </>
                );
                return product.external ? (
                  <a
                    key={product.title}
                    className={styles.productCard}
                    href={product.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content}
                  </a>
                ) : (
                  <Link key={product.title} className={styles.productCard} href={product.href === '/contact' ? contactHref() : product.href}>
                    {content}
                  </Link>
                );
              })}
            </div>
          </RevealSection>
        </section>

        <section className={styles.capabilitySection}>
          <div className={styles.sectionInner}>
            <span className={styles.capabilityLabel}>Tools we can connect</span>
            <div className={styles.capabilityList}>
              {CAPABILITIES.map((capability) => <span key={capability}>{capability}</span>)}
            </div>
          </div>
        </section>

        <section className={styles.engagementSection}>
          <RevealSection className={styles.sectionInner}>
            <span className={styles.eyebrow}>Engagement</span>
            <h2>Choose the relationship that fits the work.</h2>
            <div className={styles.engagementGrid}>
              {[
                {
                  label: 'Focused build',
                  title: 'One workflow',
                  copy: 'Define, design, and deliver one clear operational system with an agreed handoff.',
                },
                {
                  label: 'Ongoing iteration',
                  title: 'Systems partnership',
                  copy: 'Continue improving connected workflows with a defined focus for each cycle.',
                },
                {
                  label: 'Existing system',
                  title: 'System care',
                  copy: 'Review, maintain, and refine an existing Atlas-built or compatible automation.',
                },
              ].map((item, index) => (
                <article key={item.title} className={styles.engagementCard} data-featured={index === 1}>
                  <span className={styles.eyebrow}>{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <Link href={contactHref()}>
                    Discuss the fit
                    <ArrowRight size={15} weight="bold" />
                  </Link>
                </article>
              ))}
            </div>
          </RevealSection>
        </section>

        <section className={styles.faqSection}>
          <RevealSection className={styles.sectionInner}>
            <div className={styles.faqLayout}>
              <div>
                <span className={styles.eyebrow}>FAQ</span>
                <h2>Questions before we begin.</h2>
                <p>Final scope, timing, commercial terms, and handoff are agreed after we understand the workflow.</p>
              </div>
              <div className={styles.faqList}>
                {[
                  {
                    q: 'How long does a project take?',
                    a: 'Timing depends on the workflow, connections, review needs, and testing plan. We define the delivery plan before implementation begins.',
                  },
                  {
                    q: 'What if I do not know exactly what I need?',
                    a: 'Start with the repetitive work or missed handoff. We can map the current process and identify a focused first workflow together.',
                  },
                  {
                    q: 'Do I need technical knowledge?',
                    a: 'No. You explain the operational problem in plain language; Atlas translates it into a system design you can review.',
                  },
                  {
                    q: 'How is pricing determined?',
                    a: 'Price follows the agreed scope, integrations, controls, and delivery plan. You receive the proposed scope before work begins.',
                  },
                  {
                    q: 'What happens after delivery?',
                    a: 'The agreed handoff can include documentation, a walkthrough, and operating notes appropriate to the system.',
                  },
                  {
                    q: 'Can the work be delivered remotely?',
                    a: 'Yes. Atlas is based in Canada and can collaborate remotely for discovery, reviews, testing, and handoff.',
                  },
                ].map((item) => (
                  <details key={item.q} className={styles.faqItem}>
                    <summary>
                      <span>{item.q}</span>
                      <CaretDown size={18} weight="bold" />
                    </summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </RevealSection>
        </section>

        <section className={styles.finalCta}>
          <div className={styles.ctaField} aria-hidden="true" />
          <RevealSection className={styles.ctaInner}>
            <span className={styles.eyebrow}>Start with one workflow</span>
            <h2>What should your team stop doing by hand?</h2>
            <p>Tell us about one repetitive process. We will help you find a practical place to begin, with the right controls designed in.</p>
            <div className={styles.heroActions}>
              <Link href={contactHref()} className={styles.primaryButton}>
                Start the conversation
                <ArrowRight size={16} weight="bold" />
              </Link>
              <button type="button" className={styles.textButton} onClick={scrollToServices}>
                Browse services
                <CaretDown size={15} weight="bold" />
              </button>
            </div>
          </RevealSection>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>Based in Canada · Available for remote collaboration</span>
        <nav aria-label="Footer">
          <Link href={contactHref()}>Contact</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/travel" prefetch={false}>Travel app</Link>
        </nav>
        <span>© {new Date().getFullYear()} Atlas AI Technology</span>
      </footer>

      {openService && (
        <ServiceDrawer
          service={openService}
          onClose={closeService}
          contactHref={contactHref(openService.id)}
        />
      )}
    </div>
  );
}
