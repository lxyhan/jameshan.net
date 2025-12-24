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
    const { sessionId } = await request.json();

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'Session ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Check if this session already visited today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: existingVisit } = await supabase
      .from('visitors')
      .select('id')
      .eq('session_id', sessionId)
      .gte('visited_at', today.toISOString())
      .single();

    // Only insert if no visit today from this session
    if (!existingVisit) {
      const { error } = await supabase
        .from('visitors')
        .insert({
          session_id: sessionId,
          user_agent: userAgent,
          visited_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Supabase insert error:', error);
        return new Response(JSON.stringify({ error: 'Failed to track visit' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Track error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
