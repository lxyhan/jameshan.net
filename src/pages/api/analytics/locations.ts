import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const prerender = false;

// Cache for IP lookups to avoid repeated API calls
const ipCache = new Map<string, string>();

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
    // Fetch all IPs with pagination (Supabase default limit is 1000)
    const fetchAllIps = async () => {
      const batchSize = 1000;
      let allIps: string[] = [];
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from('page_views')
          .select('ip_address')
          .eq('is_bot', false)
          .not('ip_address', 'is', null)
          .range(offset, offset + batchSize - 1);

        if (error) throw error;

        if (data && data.length > 0) {
          allIps = allIps.concat(data.map(d => d.ip_address).filter(Boolean));
          offset += batchSize;
          hasMore = data.length === batchSize;
        } else {
          hasMore = false;
        }
      }

      return allIps;
    };

    const allIps = await fetchAllIps();
    const totalViews = allIps.length;

    // Get unique IPs for lookup
    const uniqueIps = [...new Set(allIps)];

    // Get countries for unique IPs
    const ipCountries = await batchGetCountries(uniqueIps);

    // Count VIEWS per country (not unique IPs)
    const countryCounts: Record<string, number> = {};
    for (const ip of allIps) {
      const country = ipCountries.get(ip);
      if (country) {
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      }
    }

    // Sort by count descending
    const sortedCountries = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

    // Calculate resolved views
    const resolvedViews = Object.values(countryCounts).reduce((a, b) => a + b, 0);

    return new Response(JSON.stringify({
      countries: sortedCountries,
      total: totalViews,
      resolved: resolvedViews,
      uniqueVisitors: uniqueIps.length,
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
