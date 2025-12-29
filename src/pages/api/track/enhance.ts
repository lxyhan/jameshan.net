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
    const {
      path,
      sessionId,
      fingerprint,
      screenWidth,
      screenHeight,
      viewportWidth,
      viewportHeight,
      timezone,
      language,
    } = body;

    // Find the most recent page view for this path (within last 30 seconds)
    const thirtySecondsAgo = new Date(Date.now() - 30000).toISOString();

    const { data: recentView } = await supabase
      .from('page_views')
      .select('id')
      .eq('page_path', path)
      .gte('viewed_at', thirtySecondsAgo)
      .is('session_id', null)  // Not yet enhanced
      .order('viewed_at', { ascending: false })
      .limit(1)
      .single();

    if (recentView) {
      // Enhance the existing record
      await supabase
        .from('page_views')
        .update({
          session_id: sessionId,
          fingerprint,
          screen_width: screenWidth,
          screen_height: screenHeight,
          viewport_width: viewportWidth,
          viewport_height: viewportHeight,
          timezone,
          language,
        })
        .eq('id', recentView.id);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Enhance tracking error:', error);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
