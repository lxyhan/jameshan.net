import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  if (!supabase) {
    return new Response(JSON.stringify({
      today: 0, allTime: 0, uniqueToday: 0, uniqueAllTime: 0,
      humanToday: 0, humanAllTime: 0, botToday: 0, botAllTime: 0,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(request.url);
    const path = url.searchParams.get('path');
    const excludeBots = url.searchParams.get('excludeBots') !== 'false';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch today's data
    let todayQuery = supabase
      .from('page_views')
      .select('ip_address, session_id, fingerprint, viewed_at, is_bot, page_path')
      .gte('viewed_at', today.toISOString());

    if (path) {
      todayQuery = todayQuery.eq('page_path', path);
    }

    const { data: todayData, error: todayError } = await todayQuery;
    if (todayError) throw todayError;

    // Fetch all data in batches to get accurate unique counts
    const fetchAllData = async () => {
      const batchSize = 1000;
      let allData: any[] = [];
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        let query = supabase
          .from('page_views')
          .select('ip_address, session_id, fingerprint, is_bot, page_path')
          .order('viewed_at', { ascending: false })
          .range(offset, offset + batchSize - 1);

        if (path) {
          query = query.eq('page_path', path);
        }

        const { data, error } = await query;
        if (error) throw error;

        if (data && data.length > 0) {
          allData = allData.concat(data);
          offset += batchSize;
          // Continue if we got a full batch (might be more data)
          hasMore = data.length === batchSize;
        } else {
          hasMore = false;
        }
      }

      return allData;
    };

    const allDataRaw = await fetchAllData();

    // Fallback filter for old data: remove views within 2.5 min of previous view (same IP + page)
    const filterSessionDupes = (data: any[]) => {
      const sorted = [...data].sort((a, b) => new Date(a.viewed_at).getTime() - new Date(b.viewed_at).getTime());
      const lastView = new Map<string, number>(); // "ip|path" -> timestamp
      const cooldownMs = 2.5 * 60 * 1000;

      return sorted.filter(v => {
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

    const allData = filterSessionDupes(allDataRaw);
    const filteredTodayData = filterSessionDupes(todayData || []);

    // Separate bots and humans
    const humanData = allData.filter(d => !d.is_bot);
    const botData = allData.filter(d => d.is_bot);
    const humanTodayData = filteredTodayData.filter(d => !d.is_bot);
    const botTodayData = filteredTodayData.filter(d => d.is_bot);

    // Count unique by IP > fingerprint > session_id
    // Improved to handle multiple identifiers per visitor
    const getUniqueCount = (data: any[]) => {
      // Group by IP first, then fingerprint
      const ipGroups = new Map<string, Set<string>>();
      const fingerprintGroups = new Map<string, Set<string>>();
      const sessionOnly = new Set<string>();

      data.forEach(d => {
        const ip = d.ip_address && d.ip_address !== 'unknown' ? d.ip_address : null;
        const fingerprint = d.fingerprint || null;
        const session = d.session_id || null;

        if (ip) {
          // IP is the strongest identifier
          if (!ipGroups.has(ip)) {
            ipGroups.set(ip, new Set());
          }
          if (fingerprint) ipGroups.get(ip)!.add(fingerprint);
        } else if (fingerprint) {
          // Fingerprint without IP
          if (!fingerprintGroups.has(fingerprint)) {
            fingerprintGroups.set(fingerprint, new Set());
          }
          if (session) fingerprintGroups.get(fingerprint)!.add(session);
        } else if (session) {
          // Session only (weakest)
          sessionOnly.add(session);
        }
      });

      // Count: unique IPs + unique fingerprints (without IP) + unique sessions (without fingerprint or IP)
      return ipGroups.size + fingerprintGroups.size + sessionOnly.size;
    };

    const stats = {
      // Total views (after session-based deduplication)
      today: filteredTodayData.length,
      allTime: allData.length,

      // Unique visitors
      uniqueToday: getUniqueCount(filteredTodayData),
      uniqueAllTime: getUniqueCount(allData),

      // Human vs Bot breakdown
      humanToday: humanTodayData.length,
      humanAllTime: humanData.length,
      botToday: botTodayData.length,
      botAllTime: botData.length,

      // Unique humans only
      uniqueHumanToday: getUniqueCount(humanTodayData),
      uniqueHumanAllTime: getUniqueCount(humanData),
    };

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
