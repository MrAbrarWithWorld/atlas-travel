'use client';

import { useState, CSSProperties } from 'react';
import Link from 'next/link';

type Status = 'idle' | 'loading' | 'ok' | 'duplicate' | 'error';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errMsg, setErrMsg] = useState('');

  function set(field: string, val: string) {
    setForm(f => ({ ...f, [field]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email) return;
    setStatus('loading');
    setErrMsg('');
    try {
      const res = await fetch('/api/lead-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'getatlas.ca/contact' }),
      });
      const data = await res.json();
      if (data.status === 'ok') setStatus('ok');
      else if (data.status === 'duplicate') setStatus('duplicate');
      else {
        setStatus('error');
        setErrMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrMsg('Network error. Please check your connection and try again.');
    }
  }

  const inputBase: CSSProperties = {
    width: '100%',
    background: '#1c1914',
    border: '1px solid #3a3228',
    borderRadius: 8,
    padding: '12px 16px',
    color: '#ede5d5',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'border-color 0.15s',
  };

  const labelStyle: CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#a09070',
    display: 'block',
    marginBottom: 6,
    textTransform: 'uppercase',
  };

  // Success state
  if (status === 'ok') {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>✅</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 30, color: '#e8c994', marginBottom: 12, margin: '0 0 12px' }}>
          Request received!
        </h2>
        <p style={{ color: '#a09070', fontSize: 15, lineHeight: 1.6, marginBottom: 28, margin: '0 0 28px' }}>
          We&apos;ll review your workflow and get back to you within 24 hours to schedule the call.
        </p>
        <Link href="/services" style={{ color: '#c9a96e', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          ← Back to Services
        </Link>
      </div>
    );
  }

  // Duplicate state
  if (status === 'duplicate') {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>📬</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 30, color: '#e8c994', marginBottom: 12, margin: '0 0 12px' }}>
          Already received!
        </h2>
        <p style={{ color: '#a09070', fontSize: 15, lineHeight: 1.6, marginBottom: 28, margin: '0 0 28px' }}>
          We already have your contact on file. We&apos;ll be in touch soon.
        </p>
        <Link href="/services" style={{ color: '#c9a96e', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          ← Back to Services
        </Link>
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

      <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 26, color: '#e8c994', marginBottom: 24, margin: '0 0 24px' }}>
        Book a Discovery Call
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Name + Email */}
        <div className="cf-row">
          <div>
            <label style={labelStyle}>Name</label>
            <input className="cf-input" style={inputBase} type="text" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input className="cf-input" style={inputBase} type="email" placeholder="you@company.com" value={form.email} onChange={e => set('email', e.target.value)} required />
          </div>
        </div>

        {/* Company + Phone */}
        <div className="cf-row">
          <div>
            <label style={labelStyle}>Company</label>
            <input className="cf-input" style={inputBase} type="text" placeholder="Company name" value={form.company} onChange={e => set('company', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Phone / WhatsApp</label>
            <input className="cf-input" style={inputBase} type="tel" placeholder="+1 416 555 1234 or +880 17 0000 0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
            <div style={{ fontSize: 11, color: '#6b6050', marginTop: 5 }}>Include country code for international numbers.</div>
          </div>
        </div>

        {/* Message */}
        <div>
          <label style={labelStyle}>What do you need help with?</label>
          <textarea
            className="cf-input"
            style={{ ...inputBase, minHeight: 120, resize: 'vertical' }}
            placeholder="Describe your business challenge or what you'd like to automate..."
            value={form.message}
            onChange={e => set('message', e.target.value)}
          />
        </div>

        {/* Error message */}
        {status === 'error' && (
          <div style={{ background: '#2a1a1a', border: '1px solid #6b2020', borderRadius: 8, padding: '12px 16px', color: '#e87070', fontSize: 13 }}>
            {errMsg}
          </div>
        )}

        {/* Submit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              background: status === 'loading' ? '#7a6040' : '#c9a96e',
              color: '#1c1914',
              border: 'none',
              borderRadius: 8,
              padding: '13px 28px',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.08em',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            {status === 'loading' ? 'Sending...' : 'Book a Discovery Call →'}
          </button>
          <span style={{ fontSize: 12, color: '#a09070' }}>* Required · Response within 24h</span>
        </div>
      </form>
    </>
  );
}
