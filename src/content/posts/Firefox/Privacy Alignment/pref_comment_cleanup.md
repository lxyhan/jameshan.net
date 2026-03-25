---
title: 'Pref Comment Cleanup'
pubDate: '2026-03-12'
order: 3
---

*Inline comments in firefox.js were breaking the Sphinx extension's parser. Moving them to line comments fixed it.*

**Bug 2020396** | [D286360](https://phabricator.services.mozilla.com/D286360) | Reviewer: manuel

---

## The Problem

The Sphinx extension parses `firefox.js` with regex to extract pref values. The `cookieBehavior` prefs had inline comments after the value:

```javascript
pref("network.cookie.cookieBehavior", 5 /* BEHAVIOR_REJECT_TRACKER_AND_PARTITION_FOREIGN */);
```

The parser was picking up `5 /* BEHAVIOR_REJECT_TRACKER_AND_PARTITION_FOREIGN */` as the value instead of just `5`. Rather than making the regex more complex to handle inline comments, the simpler fix was to move the comments above the pref declaration.

---

## The Fix

```javascript
// Before:
pref("network.cookie.cookieBehavior", 5 /* BEHAVIOR_REJECT_TRACKER_AND_PARTITION_FOREIGN */);
pref("network.cookie.cookieBehavior.pbmode", 5 /* BEHAVIOR_REJECT_TRACKER_AND_PARTITION_FOREIGN */);

// After:
// Enable Dynamic First-Party Isolation by default (BEHAVIOR_REJECT_TRACKER_AND_PARTITION_FOREIGN).
pref("network.cookie.cookieBehavior", 5);

// Enable Dynamic First-Party Isolation in the private browsing mode (BEHAVIOR_REJECT_TRACKER_AND_PARTITION_FOREIGN).
pref("network.cookie.cookieBehavior.pbmode", 5);
```

One file changed, 4 lines modified. The kind of patch that takes 2 minutes to write and saves hours of debugging later.

---

## What I Learned

1. **Fix the data, not the parser.** When your input format is inconsistent, it's often cheaper and more robust to normalize the input than to make the parser handle every edge case.
