'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://prffhhkemxibujjjiyhg.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_gDzH6bF1tOYuKmx4uIGaLw_On9AG90E';

function getSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
}

type ModalState = 'auth' | 'magic_sent' | 'no_subscription' | 'loading';

export default function WriteButton() {
  const [open, setOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalState>('auth');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [busy, setBusy] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // On open, check if already signed in
  async function handleOpenWrite() {
    setModalState('loading');
    setOpen(true);
    try {
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setModalState('auth'); return; }
      // Already signed in — check subscription
      await checkSubscriptionAndRedirect(supabase, session.user.id);
    } catch {
      setModalState('auth');
    }
  }

  async function checkSubscriptionAndRedirect(supabase: ReturnType<typeof getSupabase>, userId: string) {
    try {
      const { data } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();
      if (data) {
        setOpen(false);
        window.location.href = '/community';
      } else {
        setModalState('no_subscription');
      }
    } catch {
      setModalState('no_subscription');
    }
  }

  async function handleGoogle() {
    setBusy(true);
    try {
      const supabase = getSupabase();
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/community`,
          queryParams: { prompt: 'select_account' },
        },
      });
    } catch {
      setBusy(false);
    }
  }

  async function handleMagicLink() {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setBusy(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/community` },
      });
      if (error) { setEmailError(error.message); setBusy(false); return; }
      setModalState('magic_sent');
    } catch {
      setEmailError('Something went wrong. Try again.');
    }
    setBusy(false);
  }

  return (
    <>
      {/* Write button in nav */}
      <button
        onClick={handleOpenWrite}
        style={{
          background: "none", border: "1px solid #c9a96e", borderRadius: 6,
          padding: "7px 16px", color: "#c9a96e", fontSize: 12, fontWeight: 600,
          letterSpacing: "0.08em", cursor: "pointer", display: "flex",
          alignItems: "center", gap: 6, whiteSpace: "nowrap",
        }}
      >
        ✍️ Write
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24,
          }}
        >
          <div style={{
            background: "#1c1914", border: "1px solid #3a3228", borderRadius: 16,
            padding: "40px 36px", maxWidth: 480, width: "100%", position: "relative",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          }}>
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute", top: 16, right: 16, background: "none",
                border: "none", color: "#a09070", fontSize: 20, cursor: "pointer",
                lineHeight: 1, padding: 4,
              }}
              aria-label="Close"
            >×</button>

            {/* Loading state */}
            {modalState === 'loading' && (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
                <p style={{ color: "#a09070", fontSize: 14 }}>Checking your account…</p>
              </div>
            )}

            {/* Auth state */}
            {modalState === 'auth' && (
              <>
                <h2 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: 28, fontWeight: 600, color: "#ede5d5", marginBottom: 12, lineHeight: 1.2 }}>
                  Share Your Story
                </h2>
                <p style={{ fontSize: 14, color: "#a09070", lineHeight: 1.65, marginBottom: 28 }}>
                  Sign in to share your travel story with the Atlas community — tips, itineraries, visa experiences, hidden gems.
                </p>

                {/* Google */}
                <button
                  onClick={handleGoogle}
                  disabled={busy}
                  style={{
                    width: "100%", padding: "13px 20px", borderRadius: 8,
                    background: "#fff", border: "none", cursor: busy ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 10, fontSize: 14, fontWeight: 600, color: "#1c1914",
                    marginBottom: 20, opacity: busy ? 0.7 : 1, transition: "opacity 0.15s",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: "#3a3228" }} />
                  <span style={{ fontSize: 11, color: "#a09070", letterSpacing: "0.08em" }}>OR</span>
                  <div style={{ flex: 1, height: 1, background: "#3a3228" }} />
                </div>

                {/* Magic link */}
                <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#a09070", marginBottom: 8 }}>
                  SIGN IN WITH EMAIL
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                  onKeyDown={e => { if (e.key === 'Enter') handleMagicLink(); }}
                  disabled={busy}
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: 8,
                    background: "#231f18", border: `1px solid ${emailError ? '#e05555' : '#3a3228'}`,
                    color: "#ede5d5", fontSize: 14, marginBottom: emailError ? 6 : 12,
                    boxSizing: "border-box", outline: "none",
                  }}
                />
                {emailError && <p style={{ fontSize: 12, color: "#e05555", marginBottom: 12 }}>{emailError}</p>}
                <button
                  onClick={handleMagicLink}
                  disabled={busy}
                  style={{
                    width: "100%", padding: "13px 20px", borderRadius: 8,
                    background: "#c9a96e", border: "none", cursor: busy ? "not-allowed" : "pointer",
                    color: "#1c1914", fontSize: 14, fontWeight: 700, letterSpacing: "0.05em",
                    opacity: busy ? 0.7 : 1, transition: "opacity 0.15s",
                  }}
                >
                  {busy ? "Sending…" : "Send Magic Link →"}
                </button>
              </>
            )}

            {/* Magic link sent */}
            {modalState === 'magic_sent' && (
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
                <h2 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: 26, color: "#ede5d5", marginBottom: 12 }}>
                  Check your inbox
                </h2>
                <p style={{ fontSize: 14, color: "#a09070", lineHeight: 1.65 }}>
                  We sent a magic link to <strong style={{ color: "#ede5d5" }}>{email}</strong>.<br />
                  Click the link to sign in and start writing.
                </p>
              </div>
            )}

            {/* No subscription */}
            {modalState === 'no_subscription' && (
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
                <h2 style={{ fontFamily: "var(--font-cormorant-garamond),serif", fontSize: 26, color: "#ede5d5", marginBottom: 12 }}>
                  Subscribe to Write
                </h2>
                <p style={{ fontSize: 14, color: "#a09070", lineHeight: 1.65, marginBottom: 28 }}>
                  Sharing stories with the Atlas community is a perk for subscribers. Upgrade your plan to start writing.
                </p>
                <a
                  href="https://app.getatlas.ca/pricing"
                  style={{
                    display: "inline-block", padding: "13px 28px", borderRadius: 8,
                    background: "#c9a96e", color: "#1c1914", fontSize: 14,
                    fontWeight: 700, textDecoration: "none", letterSpacing: "0.05em",
                  }}
                >
                  See Plans →
                </a>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    display: "block", margin: "16px auto 0", background: "none",
                    border: "none", color: "#a09070", fontSize: 13, cursor: "pointer",
                  }}
                >
                  Maybe later
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
