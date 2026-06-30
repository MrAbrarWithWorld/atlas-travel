import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_HASH = '621aad9d761eb91c182b6e3ae030df560a38e806a43e7308ffe11564422b7c1a';

function getSb() {
  return createClient(
    'https://prffhhkemxibujjjiyhg.supabase.co',
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}

function authorized(req: NextRequest): boolean {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') ?? '';
  return token === ADMIN_HASH;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const sb = getSb();

  if (action === 'list_posts') {
    const { data, error } = await sb
      .from('blog_posts')
      .select('id, slug, title, category, is_published, date_published, description, cover_image_url, read_time, hero_emoji')
      .order('date_published', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ posts: data });
  }

  if (action === 'get_post') {
    const slug = searchParams.get('slug');
    const { data, error } = await sb.from('blog_posts').select('*').eq('slug', slug).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ post: data });
  }

  if (action === 'get_stats') {
    const [
      { count: newsletter },
      { count: push },
      { count: total_posts },
      { count: published_posts },
    ] = await Promise.all([
      sb.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
      sb.from('push_subscriptions').select('*', { count: 'exact', head: true }),
      sb.from('blog_posts').select('*', { count: 'exact', head: true }),
      sb.from('blog_posts').select('*', { count: 'exact', head: true }).eq('is_published', true),
    ]);
    return NextResponse.json({ newsletter, push, total_posts, published_posts });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { action, ...data } = body;
  const sb = getSb();

  if (action === 'create_post') {
    const base =
      (data.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'untitled';
    const { data: existing } = await sb.from('blog_posts').select('slug').ilike('slug', `${base}%`);
    const taken = new Set((existing || []).map((r: { slug: string }) => r.slug));
    let slug = base;
    let i = 2;
    while (taken.has(slug)) slug = `${base}-${i++}`;

    const { error } = await sb.from('blog_posts').insert({
      slug,
      title: data.title,
      description: data.description || '',
      category: data.category || '',
      read_time: data.read_time || '',
      date_published: data.date_published || new Date().toISOString().slice(0, 10),
      is_published: false,
      cover_image_url: data.cover_image_url || '',
      content: data.content || '',
      hero_emoji: data.hero_emoji || '',
      inline_photos: [],
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, slug });
  }

  if (action === 'update_post') {
    const { slug, ...updates } = data;
    const { error } = await sb
      .from('blog_posts')
      .update({
        title: updates.title,
        description: updates.description,
        category: updates.category,
        read_time: updates.read_time,
        date_published: updates.date_published || null,
        is_published: updates.is_published,
        cover_image_url: updates.cover_image_url,
        content: updates.content,
        hero_emoji: updates.hero_emoji,
      })
      .eq('slug', slug);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === 'delete_post') {
    const { error } = await sb.from('blog_posts').delete().eq('slug', data.slug);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
