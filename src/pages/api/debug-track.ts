import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  const testPath = url.searchParams.get('path') || '/debug-test';

  if (!supabase) {
    return new Response(JSON.stringify({ error: 'No supabase client' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const userAgent = request.headers.get('user-agent') || 'debug-test';

    const { data, error } = await supabase.from('page_views').insert({
      page_path: testPath,
      user_agent: userAgent,
      ip_address: 'debug-test',
      device_type: 'desktop',
      browser: 'Debug',
      os: 'Debug',
      is_bot: false,
    }).select();

    if (error) {
      return new Response(JSON.stringify({ error: error.message, code: error.code }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, inserted: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
