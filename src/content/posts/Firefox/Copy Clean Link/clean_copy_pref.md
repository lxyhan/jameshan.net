---
title: 'Clean Copy as Default Preference'
pubDate: '2025-12-16'
order: 3
viewId: 68
---

*Letting users make "Copy Clean Link" the default copy behavior, with a pref toggle in Privacy settings.*

**Bug 1877421** | [D276776](https://phabricator.services.mozilla.com/D276776) | Reviewer: manuel

---

## The Problem

Firefox's "Copy Clean Link" option lived as a secondary menu item in the context menu. Users who wanted clean URLs by default had to remember to pick it every time. Power users wanted the option to flip the default: make the regular "Copy Link" do clean copying, and offer "Copy Original Link" for when you need the full URL.

---

## The Implementation

This patch added a new pref, `privacy.query_stripping.strip_on_share.default_clean_copy`, and wired it through three layers: the context menu, the URL bar, and the preferences UI.

### Context Menu

The context menu logic in `nsContextMenu.sys.mjs` needed to swap labels and behavior based on the pref:

```javascript
XPCOMUtils.defineLazyPreferenceGetter(
  lazy,
  "DEFAULT_CLEAN_COPY",
  "privacy.query_stripping.strip_on_share.default_clean_copy",
  false
);

// In the menu initialization:
if (showStripOnShare) {
  let stripOnShareItem = this.document.getElementById(
    "context-stripOnShareLink"
  );
  if (stripOnShareItem) {
    if (lazy.DEFAULT_CLEAN_COPY) {
      this.document.l10n.setAttributes(
        stripOnShareItem,
        "main-context-menu-copy-original-link"
      );
    } else {
      this.document.l10n.setAttributes(
        stripOnShareItem,
        "main-context-menu-copy-clean-link"
      );
    }
  }
}
```

When the pref is on, the secondary menu item becomes "Copy Original Link" instead of "Copy Clean Link," and the primary copy action strips parameters by default.

### URL Bar

The URL bar in `UrlbarInput.mjs` needed parallel logic. When you Ctrl+C in the URL bar, the copy behavior also respects the pref (61 lines changed).

### Preferences UI

Added a checkbox to `about:preferences#privacy` so users can toggle the behavior without touching `about:config`:

```xml
<!-- privacy.inc.xhtml -->
<checkbox id="defaultCleanCopy"
          data-l10n-id="privacy-default-clean-copy"
          preference="privacy.query_stripping.strip_on_share.default_clean_copy"/>
```

The patch also added 6 new Fluent localization strings across three `.ftl` files: context menu labels, URL bar labels, and the preferences description.

---

## What I Learned

1. **Feature surface area is deceptive.** What sounds like "add a pref" turned into touching 8 files across the context menu, URL bar, preferences UI, and three localization files. User-facing preferences require changes at every layer where the feature is exposed.
2. **Lazy pref getters are the Firefox pattern.** Every pref-dependent behavior uses `XPCOMUtils.defineLazyPreferenceGetter`. The pref is read once and cached, with automatic updates when the value changes. This is the standard way to make behavior responsive to settings without polling.
