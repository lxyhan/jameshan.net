/**
 * Simple spam detection utilities for comments
 * No external APIs needed - uses heuristics
 */

interface SpamCheckResult {
  isSpam: boolean;
  reasons: string[];
}

/**
 * Check if comment content looks like spam
 */
export function checkSpam(content: string, authorName: string): SpamCheckResult {
  const reasons: string[] = [];

  // Check content length
  if (content.length < 10) {
    reasons.push('Content too short');
  }
  if (content.length > 2000) {
    reasons.push('Content too long');
  }

  // Check for too many links
  const linkCount = (content.match(/https?:\/\//gi) || []).length;
  if (linkCount > 2) {
    reasons.push('Too many links');
  }

  // Check for all caps (more than 50% uppercase in content over 20 chars)
  if (content.length > 20) {
    const uppercaseCount = (content.match(/[A-Z]/g) || []).length;
    const letterCount = (content.match(/[a-zA-Z]/g) || []).length;
    if (letterCount > 0 && uppercaseCount / letterCount > 0.5) {
      reasons.push('Too many uppercase letters');
    }
  }

  // Check for repeated characters (e.g., "aaaaaaa" or "!!!!!!")
  if (/(.)\1{5,}/.test(content)) {
    reasons.push('Repeated characters');
  }

  // Check for common spam patterns
  const spamPatterns = [
    /\b(viagra|cialis|casino|lottery|winner|congratulations)\b/i,
    /\b(click here|buy now|limited time|act now)\b/i,
    /\b(earn money|make money|work from home)\b/i,
    /\$\d+[,\d]*\s*(per|a)\s*(day|week|month|hour)/i,
  ];

  for (const pattern of spamPatterns) {
    if (pattern.test(content)) {
      reasons.push('Contains spam keywords');
      break;
    }
  }

  // Check author name
  if (authorName.length < 2) {
    reasons.push('Author name too short');
  }
  if (authorName.length > 50) {
    reasons.push('Author name too long');
  }
  if (/https?:\/\//.test(authorName)) {
    reasons.push('Author name contains URL');
  }

  return {
    isSpam: reasons.length > 0,
    reasons,
  };
}

/**
 * Sanitize content for display (basic XSS prevention)
 */
export function sanitizeContent(content: string): string {
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Sanitize author name
 */
export function sanitizeName(name: string): string {
  return name
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
    .slice(0, 50);
}
