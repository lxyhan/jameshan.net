import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const prerender = false;

export const GET: APIRoute = async () => {
  if (!supabase) {
    return new Response(JSON.stringify({ error: 'No supabase' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get session distribution over time
    const { data } = await supabase
      .from('page_views')
      .select('session_id, viewed_at, page_path')
      .order('viewed_at', { ascending: true });

    // Group by date
    const byDate: Record<string, { views: number; sessions: Set<string> }> = {};

    for (const row of data || []) {
      const date = row.viewed_at?.split('T')[0] || 'unknown';
      if (!byDate[date]) {
        byDate[date] = { views: 0, sessions: new Set() };
      }
      byDate[date].views++;
      byDate[date].sessions.add(row.session_id);
    }

    const dailyStats = Object.entries(byDate).map(([date, stats]) => ({
      date,
      views: stats.views,
      unique: stats.sessions.size
    }));

    return new Response(JSON.stringify({ dailyStats }, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
