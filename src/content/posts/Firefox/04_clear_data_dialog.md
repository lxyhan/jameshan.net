---
title: 'IV. Clear Data Dialog Cleanup'
pubDate: '2025-12-22'
---

# Removing the Legacy Clear Data Dialog

*Cleanup patch removing dead code after the new dialog shipped.*

**Bug 1856418** | [D271909](https://phabricator.services.mozilla.com/D271909) | Reviewer: manuel

---

## The Change

The old clear history dialog (`sanitize.xhtml`) and the preference `privacy.sanitize.useOldClearHistoryDialog` have been fully removed. The new dialog (`sanitize_v2.xhtml`) is now the only option.

---

## Removed

**UI Files:**
- `sanitize.xhtml`
- `clearSiteData.xhtml`
- `sanitize.js`
- `clearSiteData.js`

**Tests:**
- `browser_sanitizeDialog.js`
- `test_Sanitizer_interrupted.js`
- Other old dialog test files

**Preferences:**
- `privacy.sanitize.useOldClearHistoryDialog` from `StaticPrefList.yaml` and `firefox.js`

---

## Updated

- `sanitizeDialog.js` and `Sanitizer.sys.mjs` — removed conditional branches
- `privacy.js` — removed old dialog selection logic
- `CacheObserver.h` — removed C++ preference check
- Test files — removed old dialog preference settings
- Test manifests — removed old test entries
- `jar.mn` — removed old dialog files from packaging

---

## What I Learned

1. **Cleanup patches require thoroughness** — Every reference must be found: prefs, tests, localization, conditionals
2. **Always run lint before committing** — `./mach lint --warnings --outgoing` catches accidental file inclusions
3. **Legacy code accumulates** — Every feature flag eventually becomes tech debt; regular cleanup keeps the codebase maintainable
