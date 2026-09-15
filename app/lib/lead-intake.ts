export const SERVICE_IDS = [
  'workflow-automation',
  'crm-lead-capture',
  'website-development',
  'email-report-automation',
  'process-automation',
  'ai-product-integration',
  'not-sure',
] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];

export const SERVICE_OPTIONS: ReadonlyArray<{ value: ServiceId; label: string }> = [
  { value: 'not-sure', label: 'Not sure yet — help me choose' },
  { value: 'workflow-automation', label: 'AI workflow automation' },
  { value: 'crm-lead-capture', label: 'CRM & lead capture' },
  { value: 'website-development', label: 'Web app or client portal' },
  { value: 'email-report-automation', label: 'Email & report automation' },
  { value: 'process-automation', label: 'Business process automation' },
  { value: 'ai-product-integration', label: 'AI product & API integration' },
];

export const TIMELINE_OPTIONS = [
  { value: 'not-sure', label: 'Not sure yet' },
  { value: 'this-month', label: 'This month' },
  { value: '1-3-months', label: 'Within 1–3 months' },
  { value: '3-plus-months', label: 'More than 3 months' },
] as const;

export const BUDGET_OPTIONS = [
  { value: 'not-sure', label: 'Not sure yet' },
  { value: 'under-500', label: 'Under CAD $500' },
  { value: '500-999', label: 'CAD $500–999' },
  { value: '1000-2499', label: 'CAD $1,000–2,499' },
  { value: '2500-plus', label: 'CAD $2,500+' },
] as const;

export const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

export type Attribution = Partial<Record<(typeof ATTRIBUTION_KEYS)[number], string>>;

export type LeadIntake = {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  service: ServiceId;
  currentTools: string;
  timeline: (typeof TIMELINE_OPTIONS)[number]['value'];
  budgetBand: (typeof BUDGET_OPTIONS)[number]['value'];
  consent: true;
  attribution: Attribution;
  referrer: string;
  clientSubmissionId: string;
};

type ParseResult =
  | { success: true; data: LeadIntake }
  | { success: false; error: string };

const LIMITS = {
  name: 120,
  email: 254,
  company: 160,
  phone: 60,
  message: 4000,
  currentTools: 800,
  referrer: 500,
  attribution: 160,
  clientSubmissionId: 100,
} as const;

function textField(
  value: unknown,
  label: string,
  max: number,
  required = false,
): { value?: string; error?: string } {
  if (value === undefined || value === null || value === '') {
    return required ? { error: `${label} is required` } : { value: '' };
  }
  if (typeof value !== 'string') return { error: `${label} must be text` };
  const normalized = value.trim();
  if (required && !normalized) return { error: `${label} is required` };
  if (normalized.length > max) return { error: `${label} is too long` };
  return { value: normalized };
}

export function isServiceId(value: unknown): value is ServiceId {
  return typeof value === 'string' && SERVICE_IDS.includes(value as ServiceId);
}

export function sanitizeAttribution(value: unknown): Attribution {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const record = value as Record<string, unknown>;
  const result: Attribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const raw = record[key];
    if (typeof raw === 'string') {
      const normalized = raw.trim().slice(0, LIMITS.attribution);
      if (normalized) result[key] = normalized;
    }
  }
  return result;
}

export function parseLeadIntake(value: unknown): ParseResult {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { success: false, error: 'Invalid request body' };
  }

  const body = value as Record<string, unknown>;
  const fields = {
    name: textField(body.name, 'Name', LIMITS.name),
    email: textField(body.email, 'Email', LIMITS.email, true),
    company: textField(body.company, 'Company', LIMITS.company),
    phone: textField(body.phone, 'Phone', LIMITS.phone),
    message: textField(body.message, 'Message', LIMITS.message),
    currentTools: textField(body.currentTools, 'Current tools', LIMITS.currentTools),
    referrer: textField(body.referrer, 'Referrer', LIMITS.referrer),
    clientSubmissionId: textField(
      body.clientSubmissionId,
      'Submission ID',
      LIMITS.clientSubmissionId,
      true,
    ),
  };

  for (const field of Object.values(fields)) {
    if (field.error) return { success: false, error: field.error };
  }

  const email = fields.email.value!;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Valid email is required' };
  }
  if (!isServiceId(body.service)) return { success: false, error: 'Select a service' };

  const timelineValues = TIMELINE_OPTIONS.map((option) => option.value);
  if (typeof body.timeline !== 'string' || !timelineValues.includes(body.timeline as never)) {
    return { success: false, error: 'Select a timeline' };
  }

  const budgetValues = BUDGET_OPTIONS.map((option) => option.value);
  if (typeof body.budgetBand !== 'string' || !budgetValues.includes(body.budgetBand as never)) {
    return { success: false, error: 'Select a budget range' };
  }

  if (body.consent !== true) {
    return { success: false, error: 'Consent is required so Atlas can respond' };
  }

  const clientSubmissionId = fields.clientSubmissionId.value!;
  if (!/^[A-Za-z0-9._:-]+$/.test(clientSubmissionId)) {
    return { success: false, error: 'Invalid submission ID' };
  }

  return {
    success: true,
    data: {
      name: fields.name.value!,
      email: email.toLowerCase(),
      company: fields.company.value!,
      phone: fields.phone.value!,
      message: fields.message.value!,
      service: body.service,
      currentTools: fields.currentTools.value!,
      timeline: body.timeline as LeadIntake['timeline'],
      budgetBand: body.budgetBand as LeadIntake['budgetBand'],
      consent: true,
      attribution: sanitizeAttribution(body.attribution),
      referrer: fields.referrer.value!,
      clientSubmissionId,
    },
  };
}
