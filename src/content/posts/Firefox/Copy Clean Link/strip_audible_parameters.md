---
title: 'Stripping Audible Tracking Parameters'
pubDate: '2025-11-18'
order: 2
---

*Extending Copy Clean Link to cover Audible's tracking parameters across all international domains.*

**Bug 1951456** | [D271524](https://phabricator.services.mozilla.com/D271524) | Reviewer: manuel

---

## The Problem

Amazon and Audible URLs are loaded with tracking parameters. Things like `ref_`, `pf_rd_r`, `pd_rd_w`, `dib_tag`, and many others carry session and referral data. The existing strip lists covered Amazon domains but were missing several international Amazon sites and all Audible domains entirely.

---

## The Fix

This patch touched both JSON files (MPL2 and LGPL) to add:

**New tracking parameters** to the Amazon/Audible site rule:

```json
"queryParams": [
  "creativeId",
  "ipRedirectFrom",
  "ipRedirectOriginalURL",
  "overrideBaseCountry",
  "pageLoadId",
  "plink",
  "ref",
  "ref_pageloadid",
  "source_code",
  ...
]
```

**New international domains** to both site rules:

```json
"websites": [
  "www.amazon.com.au",
  "www.amazon.com.br",
  "www.amazon.com.mx",
  "www.amazon.com.be",
  "www.amazon.com.tr",
  "www.amazon.sa",
  "www.amazon.ae",
  "www.audible.com",
  "www.audible.co.uk",
  "www.audible.de",
  "www.audible.fr",
  "www.audible.it"
]
```

The tricky part was the dual-license structure. The MPL2 and LGPL lists have overlapping but distinct entries, and both need to be updated consistently. The LGPL file derives from a community-maintained list, so the changes there needed to match upstream conventions.

---

## What I Learned

1. **Internationalization is easy to forget.** The original Amazon rules covered `www.amazon.com` and a few others, but missed `.com.au`, `.com.br`, `.com.mx`, and more. Privacy features that only work for English-speaking users aren't really privacy features.
2. **Dual-license repos require coordination.** When two files cover the same feature under different licenses, you need to update both and keep them consistent. The Mozilla codebase has a few places like this where licensing history creates maintenance overhead.
