import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, phone, message, source } = body;

    // Validate required fields
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const webhookUrl = process.env.ATLAS_CRM_WEBHOOK_URL;
    const webhookToken = process.env.ATLAS_CRM_WEBHOOK_TOKEN;

    if (!webhookUrl || !webhookToken) {
      console.error('[lead-intake] Missing env: ATLAS_CRM_WEBHOOK_URL or ATLAS_CRM_WEBHOOK_TOKEN');
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }

    const payload = {
      name: (name || '').trim(),
      email: email.trim().toLowerCase(),
      company: (company || '').trim(),
      phone: (phone || '').trim(),
      message: (message || '').trim() || 'No message provided',
      source: (source || 'getatlas.ca/contact').trim(),
      submitted_at: new Date().toISOString(),
    };

    const n8nRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Atlas-CRM-Token': webhookToken,
      },
      body: JSON.stringify(payload),
    });

    let data: Record<string, unknown> = {};
    try {
      const text = await n8nRes.text();
      if (text) data = JSON.parse(text);
    } catch {
      // n8n may return empty body on success
    }

    // Duplicate detection: 409 or body has duplicate flag
    if (n8nRes.status === 409 || data?.duplicate === true || data?.status === 'duplicate') {
      return NextResponse.json({ status: 'duplicate' });
    }

    if (n8nRes.ok) {
      return NextResponse.json({ status: 'ok' });
    }

    console.error('[lead-intake] n8n error:', n8nRes.status, data);
    return NextResponse.json({ error: 'CRM error', status: 'error' }, { status: 502 });

  } catch (err) {
    console.error('[lead-intake] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
