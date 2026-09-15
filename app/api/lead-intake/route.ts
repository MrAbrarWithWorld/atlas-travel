import { NextRequest, NextResponse } from 'next/server';
import { parseLeadIntake } from '../../lib/lead-intake';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 32_000;
const MAX_WEBHOOK_RESPONSE_BYTES = 64_000;
const DEFAULT_TIMEOUT_MS = 8_000;
const CONSENT_VERSION = 'contact-2026-08-30-v1';

function webhookTimeoutMs() {
  const configured = Number(process.env.ATLAS_CRM_WEBHOOK_TIMEOUT_MS);
  if (!Number.isFinite(configured)) return DEFAULT_TIMEOUT_MS;
  return Math.min(Math.max(configured, 2_000), 20_000);
}

function validatedWebhookUrl(value: string) {
  try {
    const url = new URL(value);
    const allowedProtocol = process.env.NODE_ENV === 'production'
      ? url.protocol === 'https:'
      : url.protocol === 'http:' || url.protocol === 'https:';
    return allowedProtocol ? url.toString() : null;
  } catch {
    return null;
  }
}

async function readWebhookData(response: Response, controller: AbortController) {
  if (!response.body) return {} as Record<string, unknown>;

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_WEBHOOK_RESPONSE_BYTES) {
      controller.abort();
      throw new Error('Webhook response exceeded limit');
    }
    chunks.push(value);
  }

  if (!totalBytes) return {} as Record<string, unknown>;
  const combined = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const parsed = JSON.parse(new TextDecoder().decode(combined));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : {};
  } catch {
    return {} as Record<string, unknown>;
  }
}

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();

  if (!req.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    return NextResponse.json(
      { error: 'Content-Type must be application/json', requestId },
      { status: 415 },
    );
  }

  const contentLength = Number(req.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request body is too large', requestId }, { status: 413 });
  }

  try {
    let body: unknown;
    try {
      const rawBody = await req.text();
      if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) {
        return NextResponse.json(
          { error: 'Request body is too large', requestId },
          { status: 413 },
        );
      }
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body', requestId }, { status: 400 });
    }

    const parsed = parseLeadIntake(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error, requestId }, { status: 400 });
    }

    const lead = parsed.data;

    const configuredWebhookUrl = process.env.ATLAS_CRM_WEBHOOK_URL;
    const webhookToken = process.env.ATLAS_CRM_WEBHOOK_TOKEN;

    if (!configuredWebhookUrl || !webhookToken) {
      console.error('[lead-intake] Missing env: ATLAS_CRM_WEBHOOK_URL or ATLAS_CRM_WEBHOOK_TOKEN');
      return NextResponse.json(
        { error: 'Service temporarily unavailable', requestId },
        { status: 503 },
      );
    }

    const webhookUrl = validatedWebhookUrl(configuredWebhookUrl);
    if (!webhookUrl) {
      console.error('[lead-intake] Invalid CRM webhook URL configuration');
      return NextResponse.json(
        { error: 'Service temporarily unavailable', requestId },
        { status: 503 },
      );
    }

    const payload = {
      ...lead,
      message: lead.message || 'No message provided',
      source: 'getatlas.ca/contact',
      request_id: requestId,
      idempotency_key: lead.clientSubmissionId,
      submitted_at: new Date().toISOString(),
      consent_at: new Date().toISOString(),
      consent_version: CONSENT_VERSION,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), webhookTimeoutMs());
    let n8nRes: Response;
    let data: Record<string, unknown> = {};
    try {
      n8nRes = await fetch(webhookUrl, {
        method: 'POST',
        redirect: 'error',
        headers: {
          'Content-Type': 'application/json',
          'X-Atlas-CRM-Token': webhookToken,
          'Idempotency-Key': lead.clientSubmissionId,
          'X-Atlas-Request-Id': requestId,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      data = await readWebhookData(n8nRes, controller);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('[lead-intake] Webhook timeout', { requestId });
        return NextResponse.json(
          { error: 'Lead service timed out. Please retry.', requestId },
          { status: 504 },
        );
      }
      console.error('[lead-intake] Webhook network or response error', { requestId });
      return NextResponse.json(
        { error: 'Lead service error. Please retry.', status: 'error', requestId },
        { status: 502 },
      );
    } finally {
      clearTimeout(timeout);
    }

    // Duplicate detection: 409 or body has duplicate flag
    if (n8nRes.status === 409 || data?.duplicate === true || data?.status === 'duplicate') {
      return NextResponse.json({ status: 'duplicate', requestId });
    }

    if (n8nRes.ok) {
      return NextResponse.json({ status: 'ok', requestId });
    }

    console.error('[lead-intake] Webhook error', { requestId, status: n8nRes.status });
    return NextResponse.json(
      { error: 'Lead service error. Please retry.', status: 'error', requestId },
      { status: 502 },
    );

  } catch (err) {
    console.error('[lead-intake] Unexpected error', {
      requestId,
      name: err instanceof Error ? err.name : 'UnknownError',
    });
    return NextResponse.json({ error: 'Internal server error', requestId }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
