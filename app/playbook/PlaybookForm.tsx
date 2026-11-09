'use client';

import { CSSProperties, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { sanitizeAttribution, type Attribution } from '../lib/lead-intake';

type Status = 'idle' | 'loading' | 'ok' | 'duplicate' | 'error';

const PROBLEM_OPTIONS = [
  { value: 'leads-go-cold', label: 'Leads go cold before I reply' },
  { value: 'follow-up-time', label: 'Follow-ups take too much of my time' },
  { value: 'writing-content', label: 'Writing listings & social posts' },
  { value: 'not-enough-leads', label: 'Not enough new leads' },
  { value: 'other', label: 'Something else' },
] as const;

type FormState = {
  name: string;
  email: string;
  company: string;
  problem: (typeof PROBLEM_OPTIONS)[number]['value'];
  consent: boolean;
};

export default function PlaybookForm() {
  const [form, setForm] = useState<FormState>({
    name: '', email: '', company: '', problem: 'leads-go-cold', consent: false,
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errMsg, setErrMsg] = useState('');
  const [requestId, setRequestId] = useState('');
  const [referrer, setReferrer] = useState('');
  const [attribution, setAttribution] = useState<Attribution>({});
  const submissionRef = useRef({ id: '', fingerprint: '' });

  useEffect(() => {
    try {
      const source = new URL(document.referrer);
      setReferrer(`${source.origin}${source.pathname}`.slice(0, 500));
    } catch {
      setReferrer('');
    }
    try {
      const params = new URLSearchParams(window.location.search);
      const raw: Record<string, string> = {};
      params.forEach((value, key) => { raw[key] = value; });
      setAttribution(sanitizeAttribution(raw));
    } catch {
      setAttribution({});
    }
  }, []);

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.name || !form.email || !form.consent) return;
    const problemLabel = PROBLEM_OPTIONS.find((o) => o.value === form.problem)?.label ?? form.problem;
    const payload = {
      name: form.name,
      email: form.email,
      company: form.company,
      phone: '',
      service: 'crm-lead-capture' as const,
      currentTools: '',
      timeline: 'not-sure' as const,
      budgetBand: 'not-sure' as const,
      message: `PLAYBOOK DOWNLOAD — "25 AI Prompts Every GTA Realtor Should Be Using" (v2, getatlas.ca/playbook). Biggest problem: ${problemLabel}.`,
      consent: true as const,
      attribution,
      referrer,
    };
    const fingerprint = JSON.stringify(payload);
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
        body: JSON.stringify({ ...payload, clientSubmissionId: submissionId }),
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
          ? 'We could not process your request right now.'
          : (data.error || 'Something went wrong. Please try again.'));
      }
    } catch {
      setStatus('error');
      setErrMsg('Network error. Please check your connection and try again.');
    }
  }

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
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ fontSize: 44, marginBottom: 16 }}>{duplicate ? '📬' : '✅'}</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 30, color: '#e8c994', margin: '0 0 12px' }}>
          {duplicate ? 'You are already on the list' : 'Your playbook is ready'}
        </h2>
        <p style={{ color: '#a09070', fontSize: 15, lineHeight: 1.6, margin: '0 0 24px' }}>
          {duplicate
            ? 'We already have your details from an earlier request — the download is yours either way.'
            : 'Download it now. Prompt #6 — the 14-day follow-up sequence — is the one most agents tell us paid for the whole playbook.'}
        </p>
        <a
          href="/realtor-playbook.pdf"
          download
          style={{ display: 'inline-block', background: '#c9a96e', color: '#1c1914', borderRadius: 8, padding: '14px 30px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}
        >
          DOWNLOAD THE PLAYBOOK (PDF) →
        </a>
        {requestId && <p style={{ color: '#6f6658', fontSize: 11, margin: '18px 0 0' }}>Request reference: {requestId}</p>}
        <p style={{ color: '#a09070', fontSize: 13, lineHeight: 1.6, margin: '24px 0 0' }}>
          Want the follow-ups to send themselves?{' '}
          <Link href="/contact" style={{ color: '#c9a96e', fontWeight: 600 }}>Book the free Missed-Lead Audit →</Link>
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .pb-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 600px) { .pb-row { grid-template-columns: 1fr; } }
        .pb-input:focus { border-color: #c9a96e !important; }
      `}</style>
      <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 26, color: '#e8c994', margin: '0 0 8px' }}>Get the free playbook</h2>
      <p style={{ color: '#a09070', fontSize: 13, lineHeight: 1.55, margin: '0 0 24px' }}>Tell us where to note your download — the PDF opens right after, no waiting for an email.</p>

      <form onSubmit={handleSubmit} aria-busy={status === 'loading'} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="pb-row">
          <div><label style={labelStyle} htmlFor="pb-name">Name *</label><input id="pb-name" className="pb-input" style={inputBase} autoComplete="name" maxLength={120} placeholder="Your name" value={form.name} onChange={(e) => set('name', e.target.value)} required /></div>
          <div><label style={labelStyle} htmlFor="pb-email">Email *</label><input id="pb-email" className="pb-input" style={inputBase} type="email" autoComplete="email" maxLength={254} placeholder="you@brokerage.ca" value={form.email} onChange={(e) => set('email', e.target.value)} required /></div>
        </div>
        <div>
          <label style={labelStyle} htmlFor="pb-company">Brokerage / Team</label>
          <input id="pb-company" className="pb-input" style={inputBase} autoComplete="organization" maxLength={160} placeholder="e.g. RE/MAX, Royal LePage, independent…" value={form.company} onChange={(e) => set('company', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="pb-problem">Your biggest problem right now *</label>
          <select id="pb-problem" className="pb-input" style={inputBase} value={form.problem} onChange={(e) => set('problem', e.target.value as FormState['problem'])} required>
            {PROBLEM_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
        <label style={{ display: 'flex', gap: 11, alignItems: 'flex-start', color: '#b7aa91', fontSize: 12, lineHeight: 1.5 }}>
          <input type="checkbox" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} required style={{ marginTop: 3, accentColor: '#c9a96e' }} />
          <span>Send me the free playbook, and occasional Atlas emails with practical lead follow-up tips. I can unsubscribe at any time. See the <Link href="/privacy" prefetch={false} style={{ color: '#c9a96e' }}>privacy policy</Link>.</span>
        </label>
        {status === 'error' && (
          <div role="alert" aria-live="polite" style={{ background: '#2a1a1a', border: '1px solid #6b2020', borderRadius: 8, padding: '12px 16px', color: '#e87070', fontSize: 13, lineHeight: 1.55 }}>
            {errMsg}{requestId ? ` Reference: ${requestId}` : ''}
            <div style={{ marginTop: 8, color: '#d8c9a8' }}>
              You can also ask for it by email:{' '}
              <a href="mailto:support@getatlas.ca?subject=Realtor%20playbook%20request" style={{ color: '#c9a96e', fontWeight: 600 }}>support@getatlas.ca</a>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button type="submit" disabled={status === 'loading'} style={{ background: status === 'loading' ? '#7a6040' : '#c9a96e', color: '#1c1914', border: 'none', borderRadius: 8, padding: '13px 28px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', cursor: status === 'loading' ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>{status === 'loading' ? 'One moment…' : 'Send me the playbook →'}</button>
          <span style={{ fontSize: 12, color: '#a09070' }}>* Required · Free · No spam</span>
        </div>
      </form>
    </>
  );
}
