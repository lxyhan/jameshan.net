import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const prerender = false;

// Bot detection patterns
const BOT_PATTERNS = [
  /bot/i, /spider/i, /crawl/i, /slurp/i, /mediapartners/i,
  /googlebot/i, /bingbot/i, /yandex/i, /baiduspider/i,
  /facebookexternalhit/i, /twitterbot/i, /rogerbot/i,
  /linkedinbot/i, /embedly/i, /quora/i, /pinterest/i,
  /slackbot/i, /discordbot/i, /telegrambot/i, /whatsapp/i,
  /applebot/i, /semrushbot/i, /ahrefsbot/i, /mj12bot/i,
  /headlesschrome/i, /phantomjs/i, /selenium/i, /puppeteer/i,
];

function isBot(userAgent: string): boolean {
  if (!userAgent) return false;
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent));
}

function getClientIP(request: Request): string {
  const headers = [
    'x-nf-client-connection-ip',
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip',
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      return value.split(',')[0].trim();
    }
  }

  return 'unknown';
}

// Owner traffic tracking removed - all traffic now counts with session-based cooldown

export const POST: APIRoute = async ({ request }) => {
  if (!supabase) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { path, sessionId, fingerprint } = body;

    if (!path) {
      return new Response(JSON.stringify({ error: 'Path required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userAgent = request.headers.get('user-agent') || '';
    const ip = getClientIP(request);

    // Check if this IP viewed this page within the last 2.5 minutes
    const cooldownMinutes = 2.5;
    const cooldownTime = new Date(Date.now() - cooldownMinutes * 60 * 1000);

    const { data: recentViews, error: checkError } = await supabase
      .from('page_views')
      .select('viewed_at')
      .eq('page_path', path)
      .eq('ip_address', ip)
      .gte('viewed_at', cooldownTime.toISOString())
      .order('viewed_at', { ascending: false })
      .limit(1);

    if (checkError) {
      console.error('Check recent views error:', checkError);
    }

    // If there's a recent view within cooldown period, skip tracking
    if (recentViews && recentViews.length > 0) {
      return new Response(JSON.stringify({ success: true, skipped: true, reason: 'cooldown' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const referer = request.headers.get('referer') || null;
    const language = request.headers.get('accept-language')?.split(',')[0] || null;

    const { error } = await supabase.from('page_views').insert({
      page_path: path,
      session_id: sessionId || null,
      fingerprint: fingerprint || null,
      ip_address: ip,
      user_agent: userAgent,
      referer: referer,
      language: language,
      is_bot: isBot(userAgent),
    });

    if (error) {
      console.error('Track view error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Track error:', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
