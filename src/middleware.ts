import { defineMiddleware } from 'astro:middleware';
import { supabase } from '@/lib/supabase';

// Bot detection patterns
const BOT_PATTERNS = [
  /bot/i, /spider/i, /crawl/i, /slurp/i, /mediapartners/i,
  /googlebot/i, /bingbot/i, /yandex/i, /baiduspider/i,
  /facebookexternalhit/i, /twitterbot/i, /rogerbot/i,
  /linkedinbot/i, /embedly/i, /quora/i, /pinterest/i,
  /slackbot/i, /discordbot/i, /telegrambot/i, /whatsapp/i,
  /applebot/i, /semrushbot/i, /ahrefsbot/i, /mj12bot/i,
  /dotbot/i, /petalbot/i, /bytespider/i,
  /headlesschrome/i, /phantomjs/i, /selenium/i, /puppeteer/i,
  /curl/i, /wget/i, /python-requests/i, /axios/i, /node-fetch/i,
];

const BOT_NAMES: Record<string, RegExp> = {
  'Googlebot': /googlebot/i,
  'Bingbot': /bingbot/i,
  'Yandex': /yandex/i,
  'Baidu': /baiduspider/i,
  'Facebook': /facebookexternalhit/i,
  'Twitter': /twitterbot/i,
  'LinkedIn': /linkedinbot/i,
  'Pinterest': /pinterest/i,
  'Slack': /slackbot/i,
  'Discord': /discordbot/i,
  'Telegram': /telegrambot/i,
  'WhatsApp': /whatsapp/i,
  'Apple': /applebot/i,
  'SEMrush': /semrushbot/i,
  'Ahrefs': /ahrefsbot/i,
};

function isBot(userAgent: string): { isBot: boolean; botName: string | null } {
  if (!userAgent) return { isBot: false, botName: null };

  for (const [name, pattern] of Object.entries(BOT_NAMES)) {
    if (pattern.test(userAgent)) {
      return { isBot: true, botName: name };
    }
  }

  for (const pattern of BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return { isBot: true, botName: 'Unknown Bot' };
    }
  }

  return { isBot: false, botName: null };
}

function getClientIP(request: Request): string {
  const headers = [
    'x-nf-client-connection-ip',
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip',
    'x-client-ip',
    'true-client-ip',
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      return value.split(',')[0].trim();
    }
  }

  return 'unknown';
}

function parseUserAgent(ua: string): {
  deviceType: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
} {
  const result = {
    deviceType: 'desktop',
    browser: 'Unknown',
    browserVersion: '',
    os: 'Unknown',
    osVersion: '',
  };

  if (!ua) return result;

  // Device type
  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) {
    result.deviceType = 'mobile';
  } else if (/tablet|ipad|playbook|silk/i.test(ua)) {
    result.deviceType = 'tablet';
  }

  // Browser detection
  if (/edg/i.test(ua)) {
    result.browser = 'Edge';
    result.browserVersion = ua.match(/edg\/(\d+(\.\d+)?)/i)?.[1] || '';
  } else if (/chrome/i.test(ua) && !/chromium/i.test(ua)) {
    result.browser = 'Chrome';
    result.browserVersion = ua.match(/chrome\/(\d+(\.\d+)?)/i)?.[1] || '';
  } else if (/firefox/i.test(ua)) {
    result.browser = 'Firefox';
    result.browserVersion = ua.match(/firefox\/(\d+(\.\d+)?)/i)?.[1] || '';
  } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    result.browser = 'Safari';
    result.browserVersion = ua.match(/version\/(\d+(\.\d+)?)/i)?.[1] || '';
  } else if (/opr|opera/i.test(ua)) {
    result.browser = 'Opera';
    result.browserVersion = ua.match(/(?:opr|opera)\/(\d+(\.\d+)?)/i)?.[1] || '';
  }

  // OS detection
  if (/windows nt/i.test(ua)) {
    result.os = 'Windows';
    const version = ua.match(/windows nt (\d+(\.\d+)?)/i)?.[1];
    result.osVersion = version === '10.0' ? '10/11' : version || '';
  } else if (/mac os x/i.test(ua)) {
    result.os = 'macOS';
    result.osVersion = ua.match(/mac os x (\d+[._]\d+)/i)?.[1]?.replace('_', '.') || '';
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    result.os = 'iOS';
    result.osVersion = ua.match(/os (\d+[._]\d+)/i)?.[1]?.replace('_', '.') || '';
  } else if (/android/i.test(ua)) {
    result.os = 'Android';
    result.osVersion = ua.match(/android (\d+(\.\d+)?)/i)?.[1] || '';
  } else if (/linux/i.test(ua)) {
    result.os = 'Linux';
  }

  return result;
}

export const onRequest = defineMiddleware(async ({ request, url }, next) => {
  // Skip tracking for API routes, assets, and non-page requests
  const path = url.pathname;
  if (
    path.startsWith('/api/') ||
    path.startsWith('/_') ||
    path.includes('.') ||  // Skip files with extensions (.js, .css, .png, etc)
    path.startsWith('/open-graph/')
  ) {
    return next();
  }

  // Get response first
  const response = await next();

  // Don't track if not HTML response
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('text/html')) {
    return response;
  }

  // Track asynchronously (don't block response)
  if (supabase) {
    const userAgent = request.headers.get('user-agent') || '';
    const ip = getClientIP(request);

    // Skip build-time requests (no user-agent = not a real browser request)
    if (!userAgent) {
      return response;
    }

    const referer = request.headers.get('referer') || null;
    const language = request.headers.get('accept-language')?.split(',')[0] || null;

    const botCheck = isBot(userAgent);
    const deviceInfo = parseUserAgent(userAgent);

    // Fire and forget - don't await
    supabase.from('page_views').insert({
      page_path: path,
      page_query: url.search || null,
      ip_address: ip,
      user_agent: userAgent,
      referer: referer,
      language: language,
      is_bot: botCheck.isBot,
      bot_name: botCheck.botName,
      device_type: deviceInfo.deviceType,
      browser: deviceInfo.browser,
      browser_version: deviceInfo.browserVersion,
      os: deviceInfo.os,
      os_version: deviceInfo.osVersion,
    }).then(({ error }) => {
      if (error) console.error('Analytics tracking error:', error);
    });
  }

  return response;
});
