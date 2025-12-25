---
title: 'III. SmartBlock Link Preservation'
pubDate: '2025-12-22'
---

*Making blocked embeds still useful by preserving their text and links.*

**Bug 1976290** | [D273937](https://phabricator.services.mozilla.com/D273937) | Reviewer: manuel (security review: freddyb)

---

## The Problem

When Firefox's SmartBlock replaces a blocked embed (e.g., a Twitter/X embed), users lose access to the content entirely. They see a placeholder but can't read the tweet or follow any links without unblocking the tracker.

This patch preserves the original text content and links so users can still access the information.

![SmartBlock preserving embed content](/images/posts/firefox/embed.png)

---

## Security Implementation

This required careful security review from freddyb. The challenge: extract content from untrusted embed HTML without introducing XSS vulnerabilities.

### 1. Sanitizer API

Replaced manual DOM extraction with the browser's built-in Sanitizer API:

```javascript
const sanitizer = new Sanitizer({
  elements: [{ name: "a", attributes: ["href"] }, "br"],
  replaceWithChildrenElements: [
    "div", "span", "p", "b", "i", "em", "strong",
    "blockquote", "article", "section", "header",
    "footer", "aside", "nav", "ul", "ol", "li"
  ],
});
```

This configuration:
- **Allows** only `<a>` (with href) and `<br>` elements
- **Replaces** all other elements with their text children (preserving content, removing tags)

### 2. URL Filtering

After sanitizing, filter out dangerous URL schemes:

```javascript
contentDiv.querySelectorAll("a[href]").forEach(link => {
  try {
    const url = new URL(link.href, document.baseURI);
    if (url.protocol !== "https:") {
      link.removeAttribute("href");
    }
  } catch {
    link.removeAttribute("href");
  }
});
```

This prevents XSS via `javascript:`, `data:`, `blob:`, and other dangerous schemes.

### 3. Security Attributes

Add protective attributes to remaining links:

```javascript
link.target = "_blank";
link.rel = "noopener noreferrer";
```

---

## Files Changed

- `browser/extensions/webcompat/lib/smartblock_embeds_helper.js` — Main implementation
- `browser/extensions/webcompat/tests/browser/browser_smartblockembeds_link_preservation.js` — New tests
- `browser/extensions/webcompat/tests/browser/smartblock_embed_test.html` — Test HTML

---

## What I Learned

- The Sanitizer API is the right tool for extracting content from untrusted HTML
- Security reviews catch real vulnerabilities—freddyb's feedback was invaluable
- Defense in depth: sanitize first, then filter URLs, then add security attributes
