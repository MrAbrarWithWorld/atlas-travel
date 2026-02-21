import { useState, useRef, useEffect } from "react";

// ─── CHANGE THIS after Vercel deploy ───────────────────────────
// Local test এর সময়: "http://localhost:3000/api/chat"
// Vercel deploy এর পর: "https://your-app-name.vercel.app/api/chat"
const API_URL = "/api/chat";
// ───────────────────────────────────────────────────────────────

const PERSONA = `You are ATLAS — the world's most sophisticated AI travel intelligence. You are a private concierge for the modern traveler.

LANGUAGE: Detect user's language instantly. Respond entirely in that language throughout.
CURRENCY: Use exactly the currency the user mentions.
INPUT: Users write however they want — casual, messy, mixed languages. Understand everything.

For every journey request, deliver a complete, detailed plan. Never cut short. Finish every single day.

Structure your response:

## ✈️ FLIGHTS
Airlines, routes with airport codes, estimated price in their currency, best booking site, how far in advance to book.

## 🏨 STAY — [City]
Specific hostel or hotel, neighborhood, price per night, booking platform. Repeat for each city.

## 🍽️ EAT — [City]
Daily food budget. Each dish: name → specific restaurant → exact location → price. Repeat per city.

## 🚇 MOVE — [City]
Airport to center: transport type, cost, time. City pass name and cost. Metro line or bus numbers between attractions. Navigation app. Daily cost. Repeat per city.

## 🗓️ DAY BY DAY
Complete every single day. Never stop early.
**Day 1 — [City]**
Morning: [Activity] at [Venue], [Area] · [cost] · [how to get there]
Afternoon: [Activity] at [Venue] · [cost] · [transport]
Evening: [Restaurant], [Street] · order [dish] · [cost]

## 💰 COST
Flights: [X]
Hotels [X nights]: [X]
Food [X days]: [X]
Local transport: [X]
Inter-city travel: [X]
Activities: [X]
Buffer 10%: [X]
──────────────
Total: [X]
Budget: [X]
[Saved X] or [Over by X]

## 🎬 CREATOR NOTES
Per city: top 3 filming spots with exact location, golden hour times for their month, hidden gem, best street for B-roll.

## 🔄 ALTERNATIVES
Two other routes same budget, explained for visual/content potential.

## 📋 ESSENTIALS
Visa, SIM card, ATM tips, safety, weather.

End by asking which part they want to explore further.
CRITICAL: Never truncate. Complete every day fully.`;

function Prose({ text }) {
  return (
    <div>
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: "0.45rem" }} />;
        if (line.startsWith("# "))
          return <div key={i} style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"1.1rem", fontWeight:600, color:"#f0ebe0", margin:"0.2rem 0 0.6rem" }}>{rb(line.slice(2))}</div>;
        if (line.startsWith("## "))
          return <div key={i} style={{ fontSize:"0.7rem", fontWeight:600, color:"#c9a96e", letterSpacing:"0.15em", textTransform:"uppercase", margin:"1.1rem 0 0.4rem", paddingBottom:"0.3rem", borderBottom:"1px solid rgba(201,169,110,0.15)" }}>{rb(line.slice(3))}</div>;
        if (/^\*\*Day\s+\d+/.test(line) || line.startsWith("### "))
          return <div key={i} style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"0.88rem", fontWeight:700, color:"#e8e0d0", margin:"0.7rem 0 0.15rem" }}>{rb(line.replace(/^###\s*/,"").replace(/\*\*/g,""))}</div>;
        if (line.trim().startsWith("──") || line.trim()==="---")
          return <div key={i} style={{ height:1, background:"rgba(201,169,110,0.12)", margin:"0.4rem 0" }} />;
        if (line.startsWith("- ")||line.startsWith("* "))
          return <div key={i} style={{ display:"flex", gap:"0.45rem", margin:"0.15rem 0", fontSize:"0.82rem", color:"#9a9080" }}><span style={{ color:"#c9a96e", fontSize:"0.55rem", marginTop:"4px", flexShrink:0 }}>◆</span><span>{rb(line.slice(2))}</span></div>;
        if (/^\d+\./.test(line)) {
          const n=line.match(/^(\d+)\./)[1];
          return <div key={i} style={{ display:"flex", gap:"0.45rem", margin:"0.15rem 0", fontSize:"0.82rem", color:"#9a9080", alignItems:"flex-start" }}><span style={{ color:"#c9a96e", fontWeight:600, fontSize:"0.7rem", minWidth:14, flexShrink:0 }}>{n}.</span><span>{rb(line.replace(/^\d+\.\s*/,""))}</span></div>;
        }
        return <p key={i} style={{ margin:"0.1rem 0", fontSize:"0.82rem", color:"#9a9080", lineHeight:1.85 }}>{rb(line)}</p>;
      })}
    </div>
  );
}

function rb(t) {
  const o=[]; let r=t,k=0;
  while(r){
    const m=r.match(/\*\*(.+?)\*\*/);
    if(!m){o.push(<span key={k++}>{r}</span>);break;}
    const i=r.indexOf(m[0]);
    if(i>0)o.push(<span key={k++}>{r.slice(0,i)}</span>);
    o.push(<span key={k++} style={{color:"#d8d0c0",fontWeight:600}}>{m[1]}</span>);
    r=r.slice(i+m[0].length);
  }
  return o;
}

function Dots() {
  return (
    <div style={{ display:"flex", gap:5 }}>
      {[0,1,2].map(i=><span key={i} style={{ width:4,height:4,borderRadius:"50%",background:"#c9a96e",display:"inline-block",animation:`p 1.4s ${i*0.2}s ease-in-out infinite` }}/>)}
    </div>
  );
}

export default function App() {
  const [msgs, setMsgs] = useState([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const history = useRef([
    { role:"user", content:"Who are you?" },
    { role:"assistant", content: PERSONA+"\n\nI am ATLAS. Tell me where you want to go." }
  ]);
  const endRef = useRef(null);
  const taRef = useRef(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,busy]);

  async function send(txt) {
    const t=(txt??draft).trim();
    if(!t||busy) return;
    setDraft(""); setError("");
    if(taRef.current) taRef.current.style.height="auto";
    setMsgs(m=>[...m,{id:Date.now(),from:"user",text:t}]);
    setBusy(true);
    history.current=[...history.current,{role:"user",content:t}];

    try {
      const res = await fetch(API_URL, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ messages: history.current.slice(-14) }),
      });

      if(!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      if(data.error) throw new Error(data.error.message || data.error);
      const reply = data.content?.[0]?.text;
      if(!reply) throw new Error("No response received");

      history.current=[...history.current,{role:"assistant",content:reply}];
      setMsgs(m=>[...m,{id:Date.now()+1,from:"ai",text:reply}]);
    } catch(e) {
      setError(e.message);
    }
    setBusy(false);
  }

  function reset() {
    setMsgs([]); setError(""); setDraft("");
    history.current=[
      {role:"user",content:"Who are you?"},
      {role:"assistant",content:PERSONA+"\n\nI am ATLAS."}
    ];
  }

  return (
    <div style={{ height:"100vh",display:"flex",flexDirection:"column",background:"#0a0906",color:"#e8e0d0",overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:2px;}
        ::-webkit-scrollbar-thumb{background:rgba(201,169,110,0.15);}
        @keyframes p{0%,80%,100%{opacity:.2;transform:scale(.6)}40%{opacity:1;transform:scale(1)}}
        @keyframes up{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        .msg{animation:up 0.28s ease;}
        textarea::placeholder{color:#2e2820;}
        textarea:focus{outline:none;}
      `}</style>

      {/* Header */}
      <div style={{ padding:"1.1rem 1.75rem 1rem", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"1.25rem", fontWeight:300, letterSpacing:"0.3em", color:"#c9a96e", textTransform:"uppercase" }}>
          Atlas
        </div>
        {msgs.length > 0 && (
          <button onClick={reset} style={{ background:"none",border:"none",color:"#3a3025",cursor:"pointer",fontSize:"0.65rem",letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif" }}>
            New journey
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
        {msgs.length === 0 && (
          <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem",textAlign:"center" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"2.5rem",fontWeight:300,color:"rgba(201,169,110,0.1)",letterSpacing:"0.25em",textTransform:"uppercase",marginBottom:"2rem" }}>
              ATLAS
            </div>
            <p style={{ fontSize:"0.82rem",color:"#4a4035",fontFamily:"'DM Sans',sans-serif",lineHeight:1.9,maxWidth:"260px" }}>
              Tell me where you want to go.<br/>
              Any language. Any budget. Any dream.
            </p>
          </div>
        )}

        {msgs.length > 0 && (
          <div style={{ padding:"1rem 1.75rem",display:"flex",flexDirection:"column",gap:"1.5rem" }}>
            {msgs.map(msg=>(
              <div key={msg.id} className="msg" style={{ display:"flex",flexDirection:msg.from==="user"?"row-reverse":"row",gap:"0.875rem",alignItems:"flex-start" }}>
                <div style={{ flexShrink:0,width:22,height:22,borderRadius:"50%",border:`1px solid ${msg.from==="user"?"rgba(201,169,110,0.2)":"rgba(201,169,110,0.4)"}`,display:"flex",alignItems:"center",justifyContent:"center",marginTop:2 }}>
                  <span style={{ fontSize:"0.52rem",color:"#c9a96e",fontFamily:"'DM Sans',sans-serif" }}>{msg.from==="user"?"U":"A"}</span>
                </div>
                <div style={{ maxWidth:"88%",padding:msg.from==="user"?"0.6rem 0.875rem":"0.1rem 0",background:msg.from==="user"?"rgba(201,169,110,0.04)":"transparent",border:msg.from==="user"?"1px solid rgba(201,169,110,0.1)":"none",borderRadius:6 }}>
                  {msg.from==="user"
                    ? <p style={{ fontSize:"0.84rem",color:"#c8bfaf",lineHeight:1.75,fontFamily:"'DM Sans',sans-serif" }}>{msg.text}</p>
                    : <Prose text={msg.text}/>}
                </div>
              </div>
            ))}
            {busy&&(
              <div className="msg" style={{ display:"flex",gap:"0.875rem",alignItems:"center" }}>
                <div style={{ width:22,height:22,borderRadius:"50%",border:"1px solid rgba(201,169,110,0.4)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <span style={{ fontSize:"0.52rem",color:"#c9a96e" }}>A</span>
                </div>
                <Dots/>
              </div>
            )}
            {error&&(
              <div style={{ fontSize:"0.75rem",color:"#8a5040",fontFamily:"'DM Sans',sans-serif",padding:"0.5rem 0.875rem",border:"1px solid rgba(139,80,64,0.2)",borderRadius:5 }}>
                {error} — <button onClick={()=>setError("")} style={{ background:"none",border:"none",color:"#c9a96e",cursor:"pointer",fontSize:"0.75rem" }}>Dismiss</button>
              </div>
            )}
            <div ref={endRef}/>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding:"0 1.75rem 1.5rem",flexShrink:0 }}>
        <div style={{ height:1,background:"rgba(201,169,110,0.1)",marginBottom:"1rem" }}/>
        <div style={{ display:"flex",gap:"0.75rem",alignItems:"flex-end" }}>
          <textarea ref={taRef} value={draft}
            onChange={e=>setDraft(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
            onInput={e=>{e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,120)+"px";}}
            placeholder="Where would you like to go?"
            disabled={busy} rows={1}
            style={{ flex:1,background:"none",border:"none",outline:"none",color:"#d0c8b8",fontSize:"0.9rem",resize:"none",lineHeight:1.7,maxHeight:120,overflowY:"auto",fontFamily:"'DM Sans',sans-serif",paddingTop:"0.1rem" }}
          />
          <button onClick={()=>send()} disabled={!draft.trim()||busy}
            style={{ flexShrink:0,background:"none",border:`1px solid ${draft.trim()&&!busy?"rgba(201,169,110,0.4)":"rgba(201,169,110,0.1)"}`,borderRadius:4,width:34,height:34,cursor:draft.trim()&&!busy?"pointer":"default",color:draft.trim()&&!busy?"#c9a96e":"#2a2520",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.85rem",transition:"all 0.2s" }}>
            {busy?"·":"↑"}
          </button>
        </div>
        <div style={{ marginTop:"0.65rem",fontSize:"0.58rem",color:"#2a2520",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif" }}>
          Any language · Any currency · Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
