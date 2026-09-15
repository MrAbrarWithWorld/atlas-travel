'use client';

import { CSSProperties, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  BUDGET_OPTIONS,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
  type Attribution,
  type ServiceId,
} from '../lib/lead-intake';

type Status = 'idle' | 'loading' | 'ok' | 'duplicate' | 'error';

type ContactFormProps = {
  initialService: ServiceId;
  attribution: Attribution;
};

type FormState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: ServiceId;
  currentTools: string;
  timeline: (typeof TIMELINE_OPTIONS)[number]['value'];
  budgetBand: (typeof BUDGET_OPTIONS)[number]['value'];
  message: string;
  consent: boolean;
};

export default function ContactForm({ initialService, attribution }: ContactFormProps) {
  const [form, setForm] = useState<FormState>({
    name: '', email: '', company: '', phone: '', service: initialService,
    currentTools: '', timeline: 'not-sure', budgetBand: 'not-sure', message: '', consent: false,
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errMsg, setErrMsg] = useState('');
  const [requestId, setRequestId] = useState('');
  const [referrer, setReferrer] = useState('');
  const submissionRef = useRef({ id: '', fingerprint: '' });

  useEffect(() => {
    try {
      const source = new URL(document.referrer);
      setReferrer(`${source.origin}${source.pathname}`.slice(0, 500));
    } catch {
      setReferrer('');
    }
  }, []);

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.email || !form.consent) return;
    const submissionDraft = { ...form, attribution, referrer };
    const fingerprint = JSON.stringify(submissionDraft);
    if (submissionRef.current.fingerprint !== fingerprint) {
      submissionRef.current = { id: crypto.randomUUID(), fingerprint };
    }
    const submissionId = submissionRef.current.id;
    setStatus('loading');
    setErrMsg('');
    setRequestId('');

    try {
      const res = await fetch('/api/lead-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': submissionId },
        body: JSON.stringify({
          ...submissionDraft, clientSubmissionId: submissionId,
        }),
      });
      const responseText = await res.text();
      let data: { status?: string; error?: string; requestId?: string } = {};
      try { data = responseText ? JSON.parse(responseText) : {}; } catch { data = {}; }
      if (data.requestId) setRequestId(data.requestId);
      if (res.ok && data.status === 'ok') setStatus('ok');
      else if (res.ok && data.status === 'duplicate') setStatus('duplicate');
      else {
        setStatus('error');
        setErrMsg(res.status >= 500
          ? 'We could not send your request right now.'
          : (data.error || 'Something went wrong. Please try again.'));
      }
    } catch {
      setStatus('error');
      setErrMsg('Network error. Please check your connection and try again.');
    }
  }

  const serviceLabel = SERVICE_OPTIONS.find((option) => option.value === form.service)?.label || form.service;
  const mailtoFallback = `mailto:support@getatlas.ca?subject=${encodeURIComponent('Discovery call request' + (form.company ? ` — ${form.company}` : ''))}&body=${encodeURIComponent(
    [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.company ? `Company: ${form.company}` : null,
      form.phone ? `Phone: ${form.phone}` : null,
      `Service: ${serviceLabel}`,
      form.currentTools ? `Current tools: ${form.currentTools}` : null,
      '',
      form.message,
    ].filter((line): line is string => line !== null).join('\n').slice(0, 1800),
  )}`;

  const inputBase: CSSProperties = {
    width: '100%', background: '#1c1914', border: '1px solid #3a3228', borderRadius: 8,
    padding: '12px 16px', color: '#ede5d5', fontSize: 14, outline: 'none',
    boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.15s',
  };
  const labelStyle: CSSProperties = {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#a09070',
    display: 'block', marginBottom: 6, textTransform: 'uppercase',
  };

  if (status === 'ok' || status === 'duplicate') {
    const duplicate = status === 'duplicate';
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>{duplicate ? '📬' : '✅'}</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 30, color: '#e8c994', margin: '0 0 12px' }}>
          {duplicate ? 'We already have your details' : 'Request received'}
        </h2>
        <p style={{ color: '#a09070', fontSize: 15, lineHeight: 1.6, margin: '0 0 18px' }}>
          {duplicate ? 'Your contact is already on file. Atlas will review the latest request and follow up personally.' : 'Atlas will review the workflow and contact you with the clearest next step.'}
        </p>
        {requestId && <p style={{ color: '#6f6658', fontSize: 11, margin: '0 0 28px' }}>Request reference: {requestId}</p>}
        <Link href="/services" style={{ color: '#c9a96e', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>← Back to Services</Link>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .cf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 600px) { .cf-row { grid-template-columns: 1fr; } }
        .cf-input:focus { border-color: #c9a96e !important; }
      `}</style>
      <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 26, color: '#e8c994', margin: '0 0 8px' }}>Tell us about the workflow</h2>
      <p style={{ color: '#a09070', fontSize: 13, lineHeight: 1.55, margin: '0 0 24px' }}>A few practical details help us recommend the smallest useful starting point.</p>

      <form onSubmit={handleSubmit} aria-busy={status === 'loading'} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="cf-row">
          <div><label style={labelStyle} htmlFor="contact-name">Name</label><input id="contact-name" className="cf-input" style={inputBase} autoComplete="name" maxLength={120} placeholder="Your name" value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
          <div><label style={labelStyle} htmlFor="contact-email">Email *</label><input id="contact-email" className="cf-input" style={inputBase} type="email" autoComplete="email" maxLength={254} placeholder="you@company.com" value={form.email} onChange={(e) => set('email', e.target.value)} required /></div>
        </div>
        <div className="cf-row">
          <div><label style={labelStyle} htmlFor="contact-company">Company</label><input id="contact-company" className="cf-input" style={inputBase} autoComplete="organization" maxLength={160} placeholder="Company name" value={form.company} onChange={(e) => set('company', e.target.value)} /></div>
          <div><label style={labelStyle} htmlFor="contact-phone">Phone / WhatsApp</label><input id="contact-phone" className="cf-input" style={inputBase} type="tel" autoComplete="tel" maxLength={60} placeholder="Include country code" value={form.phone} onChange={(e) => set('phone', e.target.value)} /></div>
        </div>
        <div>
          <label style={labelStyle} htmlFor="contact-service">Service *</label>
          <select id="contact-service" className="cf-input" style={inputBase} value={form.service} onChange={(e) => set('service', e.target.value as ServiceId)} required>
            {SERVICE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle} htmlFor="contact-tools">Current tools or process</label>
          <textarea id="contact-tools" className="cf-input" style={{ ...inputBase, minHeight: 82, resize: 'vertical' }} maxLength={800} placeholder="For example: email → spreadsheet → HubSpot" value={form.currentTools} onChange={(e) => set('currentTools', e.target.value)} />
        </div>
        <div className="cf-row">
          <div><label style={labelStyle} htmlFor="contact-timeline">Ideal timing *</label><select id="contact-timeline" className="cf-input" style={inputBase} value={form.timeline} onChange={(e) => set('timeline', e.target.value as FormState['timeline'])} required>{TIMELINE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
          <div><label style={labelStyle} htmlFor="contact-budget">Budget range *</label><select id="contact-budget" className="cf-input" style={inputBase} value={form.budgetBand} onChange={(e) => set('budgetBand', e.target.value as FormState['budgetBand'])} required>{BUDGET_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
        </div>
        <div>
          <label style={labelStyle} htmlFor="contact-message">Outcome or challenge</label>
          <textarea id="contact-message" className="cf-input" style={{ ...inputBase, minHeight: 116, resize: 'vertical' }} maxLength={4000} placeholder="What should become faster, clearer, or easier to manage?" value={form.message} onChange={(e) => set('message', e.target.value)} />
        </div>
        <label style={{ display: 'flex', gap: 11, alignItems: 'flex-start', color: '#b7aa91', fontSize: 12, lineHeight: 1.5 }}>
          <input type="checkbox" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} required style={{ marginTop: 3, accentColor: '#c9a96e' }} />
          <span>I agree that Atlas may use this information, together with its CRM, automation and service providers, to review and respond to this request. See the <Link href="/privacy" style={{ color: '#c9a96e' }}>privacy policy</Link>.</span>
        </label>
        {status === 'error' && (
          <div role="alert" aria-live="polite" style={{ background: '#2a1a1a', border: '1px solid #6b2020', borderRadius: 8, padding: '12px 16px', color: '#e87070', fontSize: 13, lineHeight: 1.55 }}>
            {errMsg}{requestId ? ` Reference: ${requestId}` : ''}
            <div style={{ marginTop: 8, color: '#d8c9a8' }}>
              You can also send it by email:{' '}
              <a href={mailtoFallback} style={{ color: '#c9a96e', fontWeight: 600 }}>support@getatlas.ca</a>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button type="submit" disabled={status === 'loading'} style={{ background: status === 'loading' ? '#7a6040' : '#c9a96e', color: '#1c1914', border: 'none', borderRadius: 8, padding: '13px 28px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', cursor: status === 'loading' ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>{status === 'loading' ? 'Sending…' : 'Send my request →'}</button>
          <span style={{ fontSize: 12, color: '#a09070' }}>* Required · You can choose “Not sure”</span>
        </div>
      </form>
    </>
  );
}
