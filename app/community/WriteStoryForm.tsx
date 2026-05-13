'use client';

import { useState } from 'react';

export default function WriteStoryForm() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', title: '', destination: '', excerpt: '', content: '' });

  if (submitted) {
    return (
      <div style={{ background:"#231f18", border:"1px solid #3a3228", borderRadius:12, padding:"32px", textAlign:"center", marginBottom:48 }}>
        <div style={{ fontSize:32, marginBottom:12 }}>✅</div>
        <h3 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:24, color:"#ede5d5", marginBottom:8 }}>Story submitted!</h3>
        <p style={{ fontSize:14, color:"#a09070" }}>Your story is under review and will appear shortly. Thank you for sharing.</p>
        <button onClick={() => { setSubmitted(false); setOpen(false); setForm({ name:'', email:'', title:'', destination:'', excerpt:'', content:'' }); }} style={{ marginTop:20, background:"none", border:"1px solid #3a3228", borderRadius:8, padding:"10px 20px", color:"#a09070", fontSize:13, cursor:"pointer" }}>Submit another →</button>
      </div>
    );
  }

  if (!open) {
    return (
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <button onClick={() => setOpen(true)} style={{ background:"none", border:"1px solid #c9a96e", borderRadius:8, padding:"14px 32px", color:"#c9a96e", fontSize:14, fontWeight:600, letterSpacing:"0.08em", cursor:"pointer" }}>✍️ Write your story →</button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/community/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError('Submission failed. Please try again later.');
      }
    } catch {
      setError('Could not reach the server. Please check your connection and try again.');
    }
  };

  const inputStyle = { width:"100%", background:"#1c1914", border:"1px solid #3a3228", borderRadius:8, padding:"12px 16px", color:"#ede5d5", fontSize:14, outline:"none", boxSizing:"border-box" as const, fontFamily:"var(--font-dm-sans),sans-serif" };
  const labelStyle = { display:"block" as const, fontSize:10, fontWeight:700 as const, letterSpacing:"0.14em", color:"#a09070", textTransform:"uppercase" as const, marginBottom:6 };

  return (
    <div style={{ background:"#231f18", border:"1px solid #3a3228", borderRadius:12, padding:"32px", marginBottom:48 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <h3 style={{ fontFamily:"var(--font-cormorant-garamond),serif", fontSize:26, fontWeight:600, color:"#ede5d5", margin:0 }}>Share your travel story</h3>
        <button onClick={() => setOpen(false)} style={{ background:"none", border:"none", color:"#a09070", fontSize:20, cursor:"pointer" }}>✕</button>
      </div>
      <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:20 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div>
            <label style={labelStyle}>Your name *</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Ahmed Karim" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email (not published)</label>
            <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="you@example.com" style={inputStyle} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Story title *</label>
          <input name="title" value={form.title} onChange={handleChange} required placeholder="My 10 Days in Cox's Bazar on a Budget" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Destination</label>
          <input name="destination" value={form.destination} onChange={handleChange} placeholder="Cox's Bazar, Bangladesh" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Short intro (1–2 sentences) *</label>
          <textarea name="excerpt" value={form.excerpt} onChange={handleChange} required rows={2} placeholder="A quick summary of what readers will discover in your story..." style={{ ...inputStyle, resize:"vertical" }} />
        </div>
        <div>
          <label style={labelStyle}>Your full story *</label>
          <textarea name="content" value={form.content} onChange={handleChange} required rows={10} placeholder="Write your travel experience here — tips, places you loved, hidden gems, budget breakdown, what to avoid..." style={{ ...inputStyle, resize:"vertical" }} />
        </div>
        {error && (
          <p style={{ fontSize:13, color:"#e07070", margin:0 }}>{error}</p>
        )}
        <div style={{ display:"flex", gap:12, justifyContent:"flex-end" }}>
          <button type="button" onClick={() => setOpen(false)} style={{ background:"none", border:"1px solid #3a3228", borderRadius:8, padding:"12px 24px", color:"#a09070", fontSize:13, cursor:"pointer" }}>Cancel</button>
          <button type="submit" style={{ background:"none", border:"1px solid #c9a96e", borderRadius:8, padding:"12px 28px", color:"#c9a96e", fontSize:13, fontWeight:600, letterSpacing:"0.08em", cursor:"pointer" }}>Submit story →</button>
        </div>
      </form>
    </div>
  );
}
