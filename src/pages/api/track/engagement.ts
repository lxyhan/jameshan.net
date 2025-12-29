import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!supabase) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { path, sessionId, timeOnPage, scrollDepth } = body;

    if (!sessionId || !path) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // Find the most recent page view for this session and path (within last 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    const { data: recentView } = await supabase
      .from('page_views')
      .select('id')
      .eq('page_path', path)
      .eq('session_id', sessionId)
      .gte('viewed_at', thirtyMinutesAgo)
      .order('viewed_at', { ascending: false })
      .limit(1)
      .single();

    if (recentView) {
      await supabase
        .from('page_views')
        .update({
          time_on_page: timeOnPage,
          scroll_depth: scrollDepth,
        })
        .eq('id', recentView.id);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Engagement tracking error:', error);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
