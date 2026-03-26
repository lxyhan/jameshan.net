---
title: 'Loading Indicator'
pubDate: '2026-01-15'
order: 3
viewId: 64
---

*Users were staring at a blank dialog for 3-10 seconds while Firefox calculated data sizes. A spinner fixed the UX.*

**Bug 1968076** | [D272497](https://phabricator.services.mozilla.com/D272497) | Reviewers: manuel, desktop-theme-reviewers, fluent-reviewers, bolsson, sfoster

---

## The Problem

When you open Firefox's clear history dialog, it calculates the size of cookies/site data and cached files to show next to each checkbox. This calculation takes 3-10 seconds depending on how much data you have. During that time, the checkboxes just sat there with no size labels and no indication that anything was happening. Users thought the dialog was broken.

---

## The Implementation

I added animated loading spinners that appear immediately when the dialog opens and hide once the size calculation completes.

### Dialog Logic

In `sanitizeDialog.js`, I added references to the loading elements and two methods to show/hide them:

```javascript
this._cookiesLoading = document.getElementById("cookiesAndStorage-loading");
this._cacheLoading = document.getElementById("cache-loading");

// Show loading spinners while data sizes are being fetched
this.showLoadingSpinners();
```

The spinners show on dialog init. When `updateDataSizes()` finishes its async work:

```javascript
this._dataSizesUpdated = true;
await this.updateDataSizesInUI();

// Hide loading spinners after data is loaded
this.hideLoadingSpinners();
```

### XHTML Changes

The dialog template (`sanitize_v2.xhtml`) got new loading indicator elements next to each checkbox. This was the bulk of the patch (186 lines changed in the XHTML file) because I restructured the checkbox layout to accommodate the spinner alongside the label and size text.

### CSS

Added 29 lines of CSS for the spinner animation and positioning in `sanitizeDialog_v2.css`.

### Localization

Added 4 new Fluent strings for the loading state text ("Calculating...").

---

## What I Learned

1. **UX problems don't always need complex solutions.** The fix was a standard spinner pattern, but it required touching 4 files across dialog logic, XHTML template, CSS, and localization. The technical complexity wasn't in the spinner itself, it was in integrating it cleanly into an existing dialog's lifecycle.
2. **Async operations need visual feedback.** Any operation that takes more than ~200ms should give the user some indication that work is happening. This is basic UX, but it's easy to overlook in a codebase where the async patterns are abstracted away.
