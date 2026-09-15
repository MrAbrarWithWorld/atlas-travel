'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient, type Session } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://prffhhkemxibujjjiyhg.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_gDzH6bF1tOYuKmx4uIGaLw_On9AG90E';

const MIN_STORY = 100;
const MAX_STORY = 15000;

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function WriteStoryForm() {
  const supabase = useMemo(
    () => createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true } }),
    [],
  );
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', destination: '', content: '' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
      // Returning from Google sign-in started here: reopen the form.
      if (data.session && window.location.hash.includes('write')) setOpen(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/community#write`, queryParams: { prompt: 'select_account' } },
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    if (!session) return signIn();
    if (form.content.trim().length < MIN_STORY) {
      setError(`Your story needs at least ${MIN_STORY} characters.`);
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/blog?action=submit_post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ title: form.title, destination: form.destination, content: form.content }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setError(data.error || 'Submission failed. Please try again later.');
        return;
      }
      setStatus('sent');
    } catch {
      setStatus('error');
      setError('Could not reach the server. Please check your connection and try again.');
    }
  }

  const card = { background: '#231f18', border: '1px solid #3a3228', borderRadius: 12, padding: '32px', marginBottom: 48 } as const;
  const inputStyle = {
    width: '100%', background: '#1c1914', border: '1px solid #3a3228', borderRadius: 8, padding: '12px 16px',
    color: '#ede5d5', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit',
  };
  const labelStyle = {
    display: 'block' as const, fontSize: 10, fontWeight: 700 as const, letterSpacing: '0.14em', color: '#a09070',
    textTransform: 'uppercase' as const, marginBottom: 8,
  };
  const outlineButton = {
    background: 'none', border: '1px solid #c9a96e', borderRadius: 8, padding: '12px 28px', color: '#c9a96e',
    fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', cursor: 'pointer',
  } as const;

  if (status === 'sent') {
    return (
      <div style={{ ...card, textAlign: 'center' }} role="status">
        <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
        <h3 style={{ fontFamily: 'var(--font-cormorant-garamond),serif', fontSize: 24, color: '#ede5d5', marginBottom: 8 }}>Story submitted!</h3>
        <p style={{ fontSize: 14, color: '#a09070' }}>Thank you for sharing. It will appear here after a quick review.</p>
        <button
          onClick={() => { setStatus('idle'); setOpen(false); setForm({ title: '', destination: '', content: '' }); }}
          style={{ ...outlineButton, marginTop: 20 }}
        >
          Done
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <button onClick={() => setOpen(true)} style={{ ...outlineButton, padding: '14px 32px', fontSize: 14 }}>
          ✍️ Write your story →
        </button>
      </div>
    );
  }

  return (
    <div id="write" style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-cormorant-garamond),serif', fontSize: 26, fontWeight: 600, color: '#ede5d5', margin: 0 }}>
          Share your travel story
        </h3>
        <button onClick={() => setOpen(false)} aria-label="Close" style={{ background: 'none', border: 'none', color: '#a09070', fontSize: 20, cursor: 'pointer' }}>✕</button>
      </div>

      {!checkingSession && !session ? (
        <div style={{ textAlign: 'center', padding: '12px 0 4px' }}>
          <p style={{ fontSize: 14, color: '#a09070', lineHeight: 1.6, margin: '0 0 20px' }}>
            Sign in with Google so we can credit your story and let you know when it is published.
          </p>
          <button onClick={signIn} style={outlineButton}>Continue with Google</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {session?.user?.email && (
            <p style={{ fontSize: 12, color: '#a09070', margin: 0 }}>
              Posting as <strong style={{ color: '#ede5d5' }}>{session.user.user_metadata?.full_name || session.user.email}</strong>
            </p>
          )}
          <div>
            <label style={labelStyle} htmlFor="story-title">Story title *</label>
            <input id="story-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={200} placeholder="My 10 Days in Cox's Bazar on a Budget" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="story-destination">Destination</label>
            <input id="story-destination" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} maxLength={120} placeholder="Cox's Bazar, Bangladesh" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="story-content">Your full story *</label>
            <textarea id="story-content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={10} maxLength={MAX_STORY} placeholder="Where did you go, what did it cost, what would you do differently?" style={{ ...inputStyle, resize: 'vertical' }} />
            <div style={{ fontSize: 11, color: '#a09070', marginTop: 6, textAlign: 'right' }}>
              {form.content.trim().length} / {MIN_STORY}+ characters
            </div>
          </div>
          {error && <p role="alert" style={{ fontSize: 13, color: '#e07070', margin: 0 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => setOpen(false)} style={{ ...outlineButton, borderColor: '#3a3228', color: '#a09070' }}>Cancel</button>
            <button type="submit" disabled={status === 'sending'} style={{ ...outlineButton, opacity: status === 'sending' ? 0.6 : 1 }}>
              {status === 'sending' ? 'Submitting…' : 'Submit for review'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
