export const prerender = false

import type { APIContext } from 'astro'

/**
 * Validates if a URL is safe to proxy (prevents SSRF attacks)
 * @param urlString - The URL to validate
 * @returns true if the URL is safe to proxy
 */
function isSafeUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString)

    // Only allow HTTP and HTTPS protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false
    }

    // Block localhost and private IP ranges
    const hostname = url.hostname.toLowerCase()

    // Block localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return false
    }

    // Block private IP ranges (IPv4)
    const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
    const ipv4Match = hostname.match(ipv4Pattern)
    if (ipv4Match) {
      const [, a, b, c, d] = ipv4Match.map(Number)
      // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16
      if (
        a === 10 ||
        (a === 172 && b >= 16 && b <= 31) ||
        (a === 192 && b === 168) ||
        (a === 169 && b === 254)
      ) {
        return false
      }
    }

    // Block link-local IPv6 addresses
    if (hostname.startsWith('fe80:')) {
      return false
    }

    return true
  } catch {
    return false
  }
}

export async function GET(context: APIContext) {
  const host = context.request.headers.get('host') || 'localhost:4321'
  const url = new URL(context.request.url, `http://${host}`)
  const target = url.searchParams.get('url')

  if (!target) {
    return new Response('Missing url param', { status: 400 })
  }

  // Validate URL to prevent SSRF attacks
  if (!isSafeUrl(target)) {
    return new Response('Invalid or unsafe URL', { status: 400 })
  }

  try {
    const res = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000)
    })
    const contentType = res.headers.get('content-type') || 'text/html'
    const data = await res.text()
    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    // Log error for debugging (only in development)
    if (import.meta.env.DEV) {
      console.error('[Proxy] Error:', error)
    }
    return new Response('Proxy error', { status: 500 })
  }
}
