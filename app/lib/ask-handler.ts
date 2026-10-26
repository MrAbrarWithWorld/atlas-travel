// "Ask Atlas" website assistant, served by POST /api/lead-intake?mode=ask (the Vercel Hobby plan
// allows 12 server functions per deployment, so it shares the contact form's function). Answers questions about Atlas AI Technologies' services from the
// site's own approved copy (app/lib/assistant-knowledge.ts).
// Privacy: we don't store conversations and never log message text. The browser keeps the
// conversation for the open tab only. Messages go to an AI service provider to write the answer.
import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { ASSISTANT_SYSTEM } from './assistant-knowledge';
import { isServiceId } from './lead-intake';

const MAX_BODY_BYTES = 24_000;
const MAX_MESSAGE_CHARS = 1_000;
const MAX_HISTORY = 12; // messages sent to the model
const MAX_USER_TURNS = 25; // per conversation, then we point to the contact form
const MAX_OUTPUT_TOKENS = 500;
const PROVIDER_TIMEOUT_MS = 15_000;

// Best-effort abuse limits, per warm server instance (no database writes).
const WINDOW_MS = 10 * 60_000;
const PER_IP_WINDOW = 20;
const PER_IP_DAY = 80;
const PER_INSTANCE_DAY = 1_500;
const hits = new Map<string, number[]>();
let instanceDay = { day: '', count: 0 };

type Msg = { role: 'user' | 'assistant'; content: string };

const FALLBACK_REPLY =
  "Sorry, I can't answer right now. You can reach the team at support@getatlas.ca or through the [contact form](/contact).";

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function allowedOrigin(req: NextRequest) {
  const origin = req.headers.get('origin');
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname;
    return (
      host === 'getatlas.ca' ||
      host.endsWith('.getatlas.ca') ||
      (host.endsWith('.vercel.app') && host.startsWith('atlas-travel')) ||
      (process.env.NODE_ENV !== 'production' && (host === 'localhost' || host === '127.0.0.1'))
    );
  } catch {
    return false;
  }
}

function clientKey(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown').trim();
  return createHash('sha256').update(`ask:${ip}`).digest('hex').slice(0, 24);
}

function rateLimited(key: string) {
  const now = Date.now();
  const day = new Date(now).toISOString().slice(0, 10);
  if (instanceDay.day !== day) instanceDay = { day, count: 0 };
  if (instanceDay.count >= PER_INSTANCE_DAY) return true;

  const list = (hits.get(key) || []).filter((t) => now - t < 24 * 3_600_000);
  const recent = list.filter((t) => now - t < WINDOW_MS).length;
  if (recent >= PER_IP_WINDOW || list.length >= PER_IP_DAY) return true;

  list.push(now);
  hits.set(key, list);
  instanceDay.count += 1;
  if (hits.size > 5_000) hits.delete(hits.keys().next().value as string);
  return false;
}

function parseMessages(body: unknown): Msg[] | null {
  if (!body || typeof body !== 'object') return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 80) return null;
  const msgs: Msg[] = [];
  for (const m of raw) {
    if (!m || typeof m !== 'object') return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null;
    const text = content.trim();
    if (!text) continue;
    if (role === 'user' && text.length > MAX_MESSAGE_CHARS) return null;
    msgs.push({ role, content: text.slice(0, 4_000) });
  }
  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return null;
  return msgs;
}

// Models expect the conversation to start with a user turn and to alternate.
function forModel(msgs: Msg[]) {
  const recent = msgs.slice(-MAX_HISTORY);
  while (recent.length && recent[0].role !== 'user') recent.shift();
  const out: Msg[] = [];
  for (const m of recent) {
    const last = out[out.length - 1];
    if (last && last.role === m.role) last.content += `\n\n${m.content}`;
    else out.push({ ...m });
  }
  return out;
}

async function withTimeout(url: string, init: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function askPrimary(msgs: Msg[]) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const res = await withTimeout('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: MAX_OUTPUT_TOKENS,
      temperature: 0,
      system: ASSISTANT_SYSTEM,
      messages: msgs,
    }),
  });
  if (!res.ok) throw new Error(`primary ${res.status}`);
  const data = await res.json();
  return (data?.content || []).map((c: { text?: string }) => c.text || '').join('').trim() || null;
}

async function askSecondary(msgs: Msg[]) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  const res = await withTimeout('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      max_tokens: MAX_OUTPUT_TOKENS,
      temperature: 0,
      messages: [{ role: 'system', content: ASSISTANT_SYSTEM }, ...msgs],
    }),
  });
  if (!res.ok) throw new Error(`secondary ${res.status}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() || null;
}

function splitCta(text: string) {
  let cta: string | null = null;
  const reply = text
    .replace(/\[\[contact:([a-z-]+)\]\]/gi, (_, id: string) => {
      if (!cta && isServiceId(id.toLowerCase())) cta = id.toLowerCase();
      return '';
    })
    .trim();
  return { reply, cta };
}

export async function handleAsk(req: NextRequest) {
  if (!allowedOrigin(req)) return json({ error: 'Not allowed' }, 403);

  const length = Number(req.headers.get('content-length') || 0);
  if (length > MAX_BODY_BYTES) return json({ error: 'Message too long' }, 413);

  let body: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return json({ error: 'Message too long' }, 413);
    body = JSON.parse(text);
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  const msgs = parseMessages(body);
  if (!msgs) {
    const raw = body && typeof body === 'object' ? (body as { messages?: unknown }).messages : null;
    const tooLong = Array.isArray(raw) && raw.some((m) => {
      const { role, content } = (m && typeof m === 'object' ? m : {}) as { role?: unknown; content?: unknown };
      return role === 'user' && typeof content === 'string' && content.trim().length > MAX_MESSAGE_CHARS;
    });
    return json({ error: tooLong ? `Please keep messages under ${MAX_MESSAGE_CHARS} characters.` : 'Invalid request' }, 400);
  }

  if (msgs.filter((m) => m.role === 'user').length > MAX_USER_TURNS) {
    return json({
      reply: "We've covered a lot! The quickest way to continue is to send the team your details through the contact form, and they'll reply personally.",
      cta: 'not-sure',
    });
  }

  if (rateLimited(clientKey(req))) {
    return json({ error: "You've sent a lot of messages. Please try again a little later, or email support@getatlas.ca." }, 429);
  }

  const convo = forModel(msgs);
  for (const [step, ask] of [askPrimary, askSecondary].entries()) {
    try {
      const text = await ask(convo);
      if (text) {
        console.info('[ask] answered by step', step + 1); // no message text
        return json(splitCta(text));
      }
    } catch (err) {
      // Log only which provider step failed, never message text.
      console.warn('[ask] provider failed:', err instanceof Error ? err.message : 'unknown');
    }
  }
  return json({ reply: FALLBACK_REPLY, cta: null });
}
