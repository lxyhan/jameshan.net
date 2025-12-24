import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const prerender = false;

export const GET: APIRoute = async () => {
  if (!supabase) {
    return new Response(JSON.stringify({ today: 0, allTime: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's total views (every page load counts)
    const { count: todayViews, error: todayError } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true })
      .gte('visited_at', today.toISOString());

    if (todayError) {
      console.error('Today views error:', todayError);
      return new Response(JSON.stringify({ error: 'Failed to fetch today views' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get all-time total views
    const { count: allTimeViews, error: allTimeError } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true });

    if (allTimeError) {
      console.error('All-time views error:', allTimeError);
      return new Response(JSON.stringify({ error: 'Failed to fetch all-time views' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        today: todayViews || 0,
        allTime: allTimeViews || 0,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Analytics error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
