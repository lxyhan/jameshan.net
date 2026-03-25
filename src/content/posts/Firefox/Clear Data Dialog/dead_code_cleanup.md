---
title: 'Dead Code Cleanup'
pubDate: '2026-01-16'
order: 2
---

*The first patch removed the dialog. This one caught the references I missed.*

**Bug 2010586** | [D279160](https://phabricator.services.mozilla.com/D279160) | Reviewers: manuel, tschuster, kpatenio

---

## The Problem

After the [old dialog removal](/firefox/clear-data-dialog/remove_old_dialog) landed, there were still references to `privacy.sanitize.useOldClearHistoryDialog` lurking in the codebase. The backup component and the C++ content security allowlist both had stale entries.

---

## The Fix

**Backup component** (`BackupResource.sys.mjs`, `FormHistoryBackupResource.sys.mjs`, `SiteSettingsBackupResource.sys.mjs`):

These files had lazy pref getters for both the old and new shutdown prefs, with a conditional branch:

```javascript
// Before: branched on which dialog was active
if (!lazy.useOldClearHistoryDialog) {
  if (lazy.isHistoryClearedOnShutdown2) {
    return false;
  }
} else if (lazy.isHistoryClearedOnShutdown) {
  return false;
}

// After: just the v2 pref, no branching
if (lazy.isHistoryClearedOnShutdown) {
  return false;
}
```

The old pref getters for `useOldClearHistoryDialog` and the v1 shutdown prefs were removed entirely.

**C++ allowlist** (`nsContentSecurityUtils.cpp`):

Removed entries for `sanitize.xhtml` and `clearSiteData.xhtml` from the content security allowlist. These files no longer exist, so they don't need to be whitelisted.

Total: 6 files changed, -74 lines.

---

## What I Learned

1. **Follow-up patches are part of the job.** Large removals almost always leave stragglers. Filing the follow-up bug immediately after the first patch lands is good practice, because you'll find the stragglers in the days after landing, not during the initial review.
