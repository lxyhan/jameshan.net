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
    // Get sample of data to understand distribution
    const { data, error } = await supabase
      .from('page_views')
      .select('session_id, ip_address, page_path, viewed_at')
      .order('viewed_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    // Count nulls vs non-nulls for IP
    const { data: allData } = await supabase
      .from('page_views')
      .select('ip_address, session_id');

    const stats = {
      total: allData?.length || 0,
      withIP: allData?.filter(d => d.ip_address && d.ip_address !== 'unknown').length || 0,
      withoutIP: allData?.filter(d => !d.ip_address || d.ip_address === 'unknown').length || 0,
      uniqueIPs: new Set(allData?.filter(d => d.ip_address && d.ip_address !== 'unknown').map(d => d.ip_address)).size,
      uniqueSessionIds: new Set(allData?.map(d => d.session_id)).size,
      recentSamples: data?.slice(0, 10).map(d => ({
        session: d.session_id?.substring(0, 20) + '...',
        ip: d.ip_address,
        path: d.page_path,
        at: d.viewed_at
      }))
    };

    return new Response(JSON.stringify(stats, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Debug error:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
