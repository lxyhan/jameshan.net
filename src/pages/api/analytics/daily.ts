import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  if (!supabase) {
    return new Response(JSON.stringify({ days: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(request.url);
    const daysParam = url.searchParams.get('days') || '60';
    const viewIdParam = url.searchParams.get('viewId');
    const numDays = Math.min(parseInt(daysParam, 10) || 60, 365);

    // Get date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numDays);
    startDate.setHours(0, 0, 0, 0);

    // Fetch all views in the date range (with pagination)
    const fetchAllViews = async () => {
      const batchSize = 1000;
      let allViews: any[] = [];
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        let query = supabase
          .from('page_views')
          .select('viewed_at, ip_address, page_path, view_id, is_bot')
          .gte('viewed_at', startDate.toISOString())
          .order('viewed_at', { ascending: true })
          .range(offset, offset + batchSize - 1);

        if (viewIdParam) {
          query = query.eq('view_id', parseInt(viewIdParam, 10));
        }

        const { data, error } = await query;

        if (error) throw error;

        if (data && data.length > 0) {
          allViews = allViews.concat(data);
          offset += batchSize;
          hasMore = data.length === batchSize;
        } else {
          hasMore = false;
        }
      }

      return allViews;
    };

    const data = await fetchAllViews();

    // Filter owner IPs and apply 10-min cooldown dedup
    const OWNER_IPS = (import.meta.env.OWNER_IPS || '').split(',').map(ip => ip.trim()).filter(Boolean);

    const filterViews = (views: any[]) => {
      const cleaned = views.filter(v =>
        v.ip_address && v.ip_address !== 'unknown' && v.ip_address !== 'None' && !OWNER_IPS.includes(v.ip_address)
      );
      const lastView = new Map<string, number>();
      const cooldownMs = 10 * 60 * 1000;

      return cleaned.filter(v => {
        const key = `${v.ip_address}|${v.page_path}`;
        const viewTime = new Date(v.viewed_at).getTime();
        const last = lastView.get(key);

        if (!last || viewTime - last >= cooldownMs) {
          lastView.set(key, viewTime);
          return true;
        }
        return false;
      });
    };

    const filtered = filterViews(data || []);

    // Group by day
    const dayMap = new Map<string, number>();

    // Initialize all days with 0
    for (let i = 0; i < numDays; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      dayMap.set(key, 0);
    }

    // Count views per day (exclude bots)
    filtered.forEach(v => {
      if (v.is_bot) return;
      const day = new Date(v.viewed_at).toISOString().split('T')[0];
      if (dayMap.has(day)) {
        dayMap.set(day, (dayMap.get(day) || 0) + 1);
      }
    });

    // Convert to array
    const days = Array.from(dayMap.entries()).map(([date, views]) => ({
      date,
      views,
    }));

    // If requested, also compute the global max daily views (across all posts)
    const includeMax = url.searchParams.get('includeMax') === 'true';
    let globalMaxDaily = 0;

    if (includeMax) {
      // Fetch all views (no viewId filter) for the same date range
      let allViews: any[] = [];
      let allOffset = 0;
      let allHasMore = true;

      while (allHasMore) {
        const { data: allData, error: allError } = await supabase
          .from('page_views')
          .select('viewed_at, ip_address, page_path, is_bot')
          .gte('viewed_at', startDate.toISOString())
          .order('viewed_at', { ascending: true })
          .range(allOffset, allOffset + 1000 - 1);

        if (allError) throw allError;
        if (allData && allData.length > 0) {
          allViews = allViews.concat(allData);
          allOffset += 1000;
          allHasMore = allData.length === 1000;
        } else {
          allHasMore = false;
        }
      }

      const allFiltered = filterViews(allViews);
      const globalDayMap = new Map<string, number>();
      allFiltered.forEach(v => {
        if (v.is_bot) return;
        const day = new Date(v.viewed_at).toISOString().split('T')[0];
        globalDayMap.set(day, (globalDayMap.get(day) || 0) + 1);
      });
      globalMaxDaily = Math.max(...globalDayMap.values(), 0);
    }

    return new Response(JSON.stringify({ days, ...(includeMax ? { globalMaxDaily } : {}) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Daily analytics error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
