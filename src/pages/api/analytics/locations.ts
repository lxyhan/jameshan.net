import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const prerender = false;

// Cache for IP lookups to avoid repeated API calls
const ipCache = new Map<string, string>();

async function getCountryFromIP(ip: string): Promise<string | null> {
  // Check cache first
  if (ipCache.has(ip)) {
    return ipCache.get(ip) || null;
  }

  try {
    // Use ip-api.com (free, no key needed, 45 req/min)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`);
    if (response.ok) {
      const data = await response.json();
      if (data.countryCode) {
        ipCache.set(ip, data.countryCode);
        return data.countryCode;
      }
    }
  } catch {
    // Silent fail
  }
  return null;
}

async function batchGetCountries(ips: string[]): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  const uncachedIps: string[] = [];

  // Check cache first
  for (const ip of ips) {
    if (ipCache.has(ip)) {
      const country = ipCache.get(ip);
      if (country) results.set(ip, country);
    } else {
      uncachedIps.push(ip);
    }
  }

  // Batch lookup uncached IPs (ip-api.com supports up to 100 per batch)
  const batches = [];
  for (let i = 0; i < uncachedIps.length; i += 100) {
    batches.push(uncachedIps.slice(i, i + 100));
  }

  for (const batch of batches) {
    // Filter out invalid IPs before making the request
    const validIps = batch.filter(ip =>
      ip &&
      ip !== 'unknown' &&
      ip !== 'debug-test' &&
      !ip.startsWith('192.168.') &&
      !ip.startsWith('10.') &&
      !ip.startsWith('127.') &&
      ip.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)
    );

    if (validIps.length === 0) continue;

    try {
      // Use HTTP (ip-api.com free tier doesn't support HTTPS)
      const response = await fetch('http://ip-api.com/batch?fields=query,countryCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validIps),
      });

      if (response.ok) {
        const data = await response.json();
        for (const item of data) {
          if (item.countryCode) {
            ipCache.set(item.query, item.countryCode);
            results.set(item.query, item.countryCode);
          }
        }
      }

      // Rate limit: wait 1.5s between batches to stay under 45 req/min
      if (batches.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } catch {
      // Silent fail, continue with next batch
    }
  }

  return results;
}

export const GET: APIRoute = async () => {
  if (!supabase) {
    return new Response(JSON.stringify({ countries: {} }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get unique IPs (non-bot only)
    const { data, error } = await supabase
      .from('page_views')
      .select('ip_address')
      .eq('is_bot', false)
      .not('ip_address', 'is', null);

    if (error) throw error;

    // Get unique IPs
    const uniqueIps = [...new Set((data || []).map(d => d.ip_address).filter(Boolean))];

    // Get countries for all IPs
    const ipCountries = await batchGetCountries(uniqueIps);

    // Count by country
    const countryCounts: Record<string, number> = {};
    for (const country of ipCountries.values()) {
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    }

    // Sort by count descending
    const sortedCountries = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

    // Debug: sample some IPs to see what they look like
    const sampleIps = uniqueIps.slice(0, 5);

    return new Response(JSON.stringify({
      countries: sortedCountries,
      total: uniqueIps.length,
      resolved: ipCountries.size,
      debug: {
        sampleIps,
        failedCount: uniqueIps.length - ipCountries.size,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Locations analytics error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
