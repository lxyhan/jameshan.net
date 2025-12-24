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
    // Get today's unique visitors (unique session_ids for today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: todayVisitors, error: todayError } = await supabase
      .from('visitors')
      .select('session_id')
      .gte('visited_at', today.toISOString());

    if (todayError) {
      console.error('Today visitors error:', todayError);
      return new Response(JSON.stringify({ error: 'Failed to fetch today visitors' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get all-time unique visitors
    const { data: allTimeVisitors, error: allTimeError } = await supabase
      .from('visitors')
      .select('session_id');

    if (allTimeError) {
      console.error('All-time visitors error:', allTimeError);
      return new Response(JSON.stringify({ error: 'Failed to fetch all-time visitors' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Count unique session IDs
    const todayUnique = new Set(todayVisitors?.map((v) => v.session_id) || []).size;
    const allTimeUnique = new Set(allTimeVisitors?.map((v) => v.session_id) || []).size;

    return new Response(
      JSON.stringify({
        today: todayUnique,
        allTime: allTimeUnique,
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
