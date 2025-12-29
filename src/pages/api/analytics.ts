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

    // Get all data for aggregation
    const { data: allData, error } = await supabase
      .from('page_views')
      .select('ip_address, session_id, fingerprint, viewed_at, is_bot, page_path');

    if (error) throw error;

    // Filter by path if provided
    let filteredData = path
      ? allData?.filter(d => d.page_path === path)
      : allData;

    const todayData = filteredData?.filter(d =>
      new Date(d.viewed_at) >= today
    ) || [];

    // Separate bots and humans
    const humanData = filteredData?.filter(d => !d.is_bot) || [];
    const botData = filteredData?.filter(d => d.is_bot) || [];
    const humanTodayData = todayData.filter(d => !d.is_bot);
    const botTodayData = todayData.filter(d => d.is_bot);

    // Count unique by IP > fingerprint > session_id
    const getUniqueCount = (data: typeof allData) => {
      const unique = new Set(data?.map(d =>
        d.ip_address && d.ip_address !== 'unknown'
          ? d.ip_address
          : d.fingerprint || d.session_id || 'unknown'
      ));
      unique.delete('unknown');
      return unique.size;
    };

    const stats = {
      // Total views
      today: todayData.length,
      allTime: filteredData?.length || 0,

      // Unique visitors
      uniqueToday: getUniqueCount(todayData),
      uniqueAllTime: getUniqueCount(filteredData),

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
