---
title: 'Stripping the _gl Parameter'
pubDate: '2025-11-05'
order: 1
viewId: 71
---

*My very first day on the job: adding one line to strip Google Analytics linker parameters from copied URLs.*

**Bug 1947168** | [D271523](https://phabricator.services.mozilla.com/D271523) | Reviewer: manuel

---

## The Problem

When you copy a URL from a website that uses Google Analytics cross-domain tracking, the URL often contains a `_gl` query parameter. This parameter carries a visitor identifier that follows the user across domains. When someone copies and shares that link, they're unknowingly sharing a tracking token.

Firefox's "Copy Clean Link" feature strips known tracking parameters when you use the clean copy option. But `_gl` wasn't on the list.

---

## How Copy Clean Link Works

Firefox maintains two JSON files that define which query parameters to strip:

- `StripOnShare.json` (MPL2 license) contains global parameters and site-specific rules
- `StripOnShareLGPL.json` (LGPL license) contains rules derived from community lists

The `global.queryParams` array in `StripOnShare.json` lists parameters that should be stripped from all URLs, regardless of the site. This is where UTM parameters (`utm_source`, `utm_medium`, etc.) already lived.

---

## The Fix

One line:

```json
{
  "global": {
    "queryParams": [
      "_gl",
      "li_fat_id",
      "utm_ad",
      "utm_affiliate",
      ...
    ]
  }
}
```

Adding `_gl` to the global list means it gets stripped from every URL, on every website. This is the right scope because the `_gl` parameter is always a Google Analytics linker token, regardless of which site it appears on.

---

## What I Learned

1. **Small patches can have outsized impact.** This is one line of JSON, but it affects every Firefox user who copies a URL from any site using Google Analytics cross-domain tracking. The simplicity of the fix belies the scope of the improvement.
2. **Open source onboarding is real.** This was my first Phabricator diff, my first review cycle, my first encounter with `./mach lint`. Having a simple, low-risk patch as my first contribution let me focus on learning the process rather than wrestling with complex code.
