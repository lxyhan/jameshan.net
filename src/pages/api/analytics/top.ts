import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const prerender = false;

export const GET: APIRoute = async () => {
  if (!supabase) {
    return new Response(JSON.stringify({ pages: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get all page views
    const { data, error } = await supabase
      .from('page_views')
      .select('page_path, ip_address, session_id');

    if (error) throw error;

    // Aggregate by page
    const pageStats: Record<string, { views: number; visitors: Set<string> }> = {};

    for (const row of data || []) {
      const path = row.page_path;
      if (!pageStats[path]) {
        pageStats[path] = { views: 0, visitors: new Set() };
      }
      pageStats[path].views++;
      // Use IP if available, otherwise fallback to session_id
      const visitorId = row.ip_address || row.session_id;
      if (visitorId) {
        pageStats[path].visitors.add(visitorId);
      }
    }

    // Convert to array and sort by views
    const pages = Object.entries(pageStats)
      .map(([path, stats]) => ({
        path,
        views: stats.views,
        unique: stats.visitors.size,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 20);

    return new Response(JSON.stringify({ pages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Top pages error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch top pages' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
