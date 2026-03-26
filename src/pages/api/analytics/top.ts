import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const prerender = false;

const OWNER_IPS = (import.meta.env.OWNER_IPS || '').split(',').map(ip => ip.trim()).filter(Boolean);

export const GET: APIRoute = async () => {
  if (!supabase) {
    return new Response(JSON.stringify({ pages: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Fetch all views in batches
    let allData: any[] = [];
    let offset = 0;
    while (true) {
      const { data, error } = await supabase
        .from('page_views')
        .select('view_id, page_path, ip_address, is_bot')
        .order('viewed_at', { ascending: false })
        .range(offset, offset + 999);

      if (error) throw error;
      if (data && data.length > 0) {
        allData = allData.concat(data);
        offset += 1000;
        if (data.length < 1000) break;
      } else {
        break;
      }
    }

    // Filter: no bots, no owner IPs, no unknown
    const clean = allData.filter(r =>
      !r.is_bot &&
      r.ip_address &&
      r.ip_address !== 'unknown' &&
      r.ip_address !== 'None' &&
      !OWNER_IPS.includes(r.ip_address)
    );

    // Aggregate by view_id (for posts) and page_path (for non-posts)
    const stats: Record<string, { views: number; visitors: Set<string>; path: string }> = {};

    for (const row of clean) {
      const key = row.view_id ? `vid:${row.view_id}` : `path:${row.page_path}`;
      if (!stats[key]) {
        stats[key] = { views: 0, visitors: new Set(), path: row.page_path };
      }
      stats[key].views++;
      stats[key].visitors.add(row.ip_address);
    }

    const pages = Object.entries(stats)
      .map(([key, s]) => ({
        key,
        viewId: key.startsWith('vid:') ? parseInt(key.slice(4)) : null,
        path: s.path,
        views: s.views,
        unique: s.visitors.size,
      }))
      // Only include posts (have view_id) or homepage
      .filter(p => p.viewId !== null || p.path === '/')
      .sort((a, b) => b.views - a.views)
      .slice(0, 50);

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
