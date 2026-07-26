'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
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
    return (
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <p style={{ fontSize: 15, color: '#c9a96e', fontWeight: 600 }}>✓ You&apos;re subscribed! Welcome to The Atlas Dispatch.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        gap: 12,
        maxWidth: 440,
        margin: '0 auto',
      }}
    >
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          flex: 1,
          background: '#1c1914',
          border: '1px solid #3a3228',
          borderRadius: 8,
          padding: '12px 16px',
          color: '#ede5d5',
          fontSize: 14,
          outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        style={{
          background: 'none',
          border: '1px solid #c9a96e',
          borderRadius: 8,
          padding: '12px 20px',
          color: '#c9a96e',
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '0.06em',
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap',
          opacity: status === 'loading' ? 0.7 : 1,
        }}
      >
        {status === 'loading' ? 'Subscribing...' : "Subscribe → It's Free"}
      </button>
      {status === 'error' && (
        <p style={{ fontSize: 12, color: '#e07070', marginTop: 8, textAlign: 'center', width: '100%' }}>
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
