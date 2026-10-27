'use client';

import { useState } from 'react';
import s from './blog.module.css';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return <p className={s.desc} role="status" style={{ fontWeight: 600, color: 'var(--b-accent)' }}>You are subscribed. Thanks for joining The Atlas Dispatch.</p>;
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Newsletter signup">
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <label htmlFor="nl-email" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Email address</label>
        <input
          id="nl-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          style={{ flex: '1 1 220px', height: 48, padding: '0 16px', borderRadius: 999, border: '1px solid var(--b-line)', background: 'var(--b-surface)', color: 'var(--b-ink)', font: 'inherit', fontSize: 16 }}
        />
        <button type="submit" className={s.btn} disabled={status === 'loading'} style={{ height: 48, opacity: status === 'loading' ? 0.7 : 1 }}>
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>
      <p style={{ fontSize: 13, color: 'var(--b-muted)', margin: '10px 0 0' }}>
        By subscribing you agree to receive travel guides by email from Atlas AI Technologies. Unsubscribe anytime.
      </p>
      {status === 'error' && (
        <p role="alert" style={{ fontSize: 14, color: '#c0392b', margin: '8px 0 0' }}>That did not work. Please check the address and try again.</p>
      )}
    </form>
  );
}
