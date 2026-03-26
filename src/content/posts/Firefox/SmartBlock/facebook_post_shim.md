---
title: 'Facebook Post Shim'
pubDate: '2025-12-09'
order: 2
viewId: 82
---

*When ETP blocks the Facebook SDK, embedded posts disappear completely. This shim renders click-to-load placeholders so users know the content exists.*

**Bug 1698840** | [D275716](https://phabricator.services.mozilla.com/D275716) | Reviewer: manuel

---

## The Problem

Facebook's XFBML system uses `<div class="fb-post">` elements that get rendered by the Facebook SDK JavaScript. When Firefox's Enhanced Tracking Protection (Strict mode) blocks the SDK, these elements never get processed. The result is invisible: the `<div>` is there in the DOM but renders as nothing. Users don't even know a post was supposed to be there.

Firefox already had a SmartBlock shim for the Facebook SDK that handled login buttons and video embeds. But it didn't know about `fb-post` elements.

---

## The Implementation

I extended the existing `facebook-sdk.js` shim with a new `makePostPlaceholder()` function:

```javascript
async function makePostPlaceholder(target) {
  if (target.hasAttribute("fb-xfbml-state")) {
    return;
  }
  target.setAttribute("fb-xfbml-state", "");

  let width = parseInt(target.getAttribute("data-width")) || 500;
  width = `${width}px`;

  const placeholder = document.createElement("div");
  placeholdersToRemoveOnUnshim.add(placeholder);
  placeholder.style = `
    width: ${width};
    min-height: 200px;
    padding: 24px;
    background: light-dark(#f0f2f5, #242526);
    border: 1px solid light-dark(#dddfe2, #3e4042);
    border-radius: 8px;
    color: light-dark(#1c1e21, #e4e6eb);
    text-align: center;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  `;

  // Facebook logo icon + "Click to allow blocked Facebook content"
  ...

  target.appendChild(placeholder);
}
```

The placeholder respects the `data-width` attribute that site authors use to control embed size, and uses `light-dark()` CSS function to work in both light and dark mode.

### Detection

The shim detects `fb-post` elements in two places:

1. **On page load**: `FB.XFBML.parse()` is called by sites after the SDK loads. The shim intercepts this call and processes `fb-post` elements.
2. **Dynamically**: A `MutationObserver` watches for `fb-post` elements added after initial page load (common in single-page apps).

When a user clicks the placeholder, the shim triggers the full SDK load, removing all placeholders and letting Facebook's real rendering take over.

---

## Testing

Added a test HTML file (`test_facebook_post_embed.html`) that verifies three scenarios:
- Static `fb-post` elements present at page load
- Dynamically added `fb-post` elements
- Custom `data-width` attributes being respected

Total: 2 files changed, +143 lines.

---

## What I Learned

1. **Shims are a middle ground between blocking and allowing.** Rather than fully blocking or fully allowing the Facebook SDK, the shim gives users informed consent: they can see that content exists and choose to load it. This is a privacy-respecting UX pattern.
2. **The `light-dark()` CSS function is great.** It lets you write a single value that adapts to the user's color scheme without media queries. I hadn't used it before but it's perfect for injected content that needs to match the browser's theme.
