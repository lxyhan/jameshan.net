---
title: 'Removing the Old Dialog'
pubDate: '2026-01-14'
order: 1
viewId: 65
---

*Deleting 2,500 lines of dead code across 46 files after the new clear history dialog shipped.*

**Bug 1856418** | [D271909](https://phabricator.services.mozilla.com/D271909) | Reviewers: manuel, necko-reviewers, places-reviewers, urlbar-reviewers, akulyk, valentin

---

## The Problem

Firefox had two clear history dialogs: the old one (`sanitize.xhtml`) and the new one (`sanitize_v2.xhtml`). They were toggled by a preference, `privacy.sanitize.useOldClearHistoryDialog`. The new dialog had been the default for several releases, and it was time to remove the old one entirely.

This sounds simple: just delete the old files, right? In a 20-million-line codebase, every feature leaves traces everywhere.

---

## The Scope

The removal touched 46 files and deleted 2,645 lines:

**UI files removed:**
- `sanitize.xhtml`, `clearSiteData.xhtml` (the old dialogs)
- `sanitize.js`, `clearSiteData.js` (their logic)
- Platform-specific CSS: `sanitizeDialog.css` for Linux, macOS, and Windows

**Test files removed:**
- `browser_sanitizeDialog.js` (815 lines, the largest single deletion)
- `test_Sanitizer_interrupted.js` (139 lines)
- `browser_privacy_syncDataClearing.js` (303 lines)
- `browser_clearSiteData.js` (234 lines)
- `test_clearHistory_shutdown.js` (181 lines)
- `test_sss_sanitizeOnShutdown.js` (59 lines)

**Code updated:**
- `Sanitizer.sys.mjs`: removed conditional branches for old vs new dialog
- `sanitizeDialog.js`: removed old dialog initialization paths
- `privacy.js`: removed dialog selection logic
- `CacheObserver.h`: removed a C++ preference check
- `StaticPrefList.yaml`: removed the pref definition
- `firefox.js`: removed the pref default
- Multiple `browser.toml` and `xpcshell.toml` manifests: removed test entries
- `jar.mn` files: removed old dialog packaging

---

## What Made This Hard

The challenge wasn't any single file. It was finding every reference. The old dialog pref was checked in C++ (`CacheObserver.h`), JavaScript (`Sanitizer.sys.mjs`, `privacy.js`), test setup code, and build manifests. Missing any one reference would cause build failures or test crashes.

The review required sign-off from 6 reviewers across different module ownership areas (networking, places/bookmarks, URL bar, frontend code style). Each reviewer checked that their module's references were correctly removed.

Running `./mach lint --warnings --outgoing` after each change was essential. The linter catches references to files that no longer exist in build manifests and test configurations.

---

## What I Learned

1. **Cleanup patches require exhaustive search.** `grep -r` for the pref name, the old file names, and any conditional that branches on dialog version. In a codebase this size, you will miss something on the first pass.
2. **Every feature flag becomes tech debt.** The old dialog pref existed for a safe rollout, but once the new dialog was validated, the pref and all its conditional branches became dead weight. Regular cleanup keeps the codebase maintainable.
3. **Multi-reviewer patches take calendar time.** With 6 reviewers across different teams, this patch took weeks to land even though the code changes were straightforward. Planning for review latency is part of the work.
