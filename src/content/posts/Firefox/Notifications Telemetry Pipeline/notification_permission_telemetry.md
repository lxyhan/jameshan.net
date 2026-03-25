---
title: 'Notification Permission Telemetry'
pubDate: '2026-01-14'
order: 1
---

*My first Firefox patch: instrumenting the full lifecycle of notification permission prompts with Glean telemetry.*

**Bug 1998053** | [D274203](https://phabricator.services.mozilla.com/D274203) | Reviewers: timhuang, mconley

---

## The Problem

Firefox had limited visibility into how users interact with notification permission requests. We knew when permissions were granted or denied, but not the nuances in between. There was no data on whether users were seeing the permission icon vs. the full prompt, whether prompts were being auto-blocked due to missing user gestures, or how behavior varied across different types of sites. And once a permission was granted, we had no idea how often (or through which path) users revoked it.

The goal was to instrument the entire notification permission lifecycle, from the moment a prompt appears to the moment a user potentially revokes the permission months later.

---

## The Seven Events

The patch adds seven Glean events under the `web_notification_permission` category, covering three phases of the lifecycle:

**Prompt phase:**
1. `icon_shown` - The permission icon appears and animates in the URL bar (deferred prompt)
2. `icon_clicked` - The user clicks the permission icon to open the prompt
3. `prompt_shown` - The full permission dialog is displayed
4. `prompt_blocked` - The request is auto-denied because there was no user gesture

**Decision phase:**
5. `prompt_interaction` - The user allows or blocks the permission (with persistence info)

**Revocation phase:**
6. `permission_revoked_toolbar` - Permission revoked via the toolbar identity panel
7. `permission_revoked_preferences` - Permission revoked from the Settings/Preferences page

Here's a representative excerpt from the `metrics.yaml` definitions:

```yaml
web_notification_permission:
  prompt_shown:
    type: event
    description: >
      Recorded when the notification permission prompt is shown to the user
    extra_keys:
      site_category:
        description: Category of the site
        type: string
      trigger:
        description: How the prompt was triggered (user click vs automatic)
        type: string
  prompt_interaction:
    type: event
    extra_keys:
      site_category: { type: string }
      action: { type: string }
      is_persistent: { type: boolean }
```

Each event carries a `site_category` extra key so we can slice the data by type of site.

---

## Site Categorization

To make the telemetry useful for analysis, every event includes a site category. The implementation stores 86 domains across 8 categories (social, email, chat_communication, media_streaming, etc.) as a JSON preference, which makes it easy to update without shipping code changes.

The `getSiteCategory` function uses a lazy pref getter that parses the JSON into a `Map` on first access:

```javascript
XPCOMUtils.defineLazyPreferenceGetter(
  lazy, "siteCategories",
  "permissions.desktop-notification.telemetry.siteCategories",
  "{}", null,
  val => {
    try {
      let obj = JSON.parse(val);
      return new Map(Object.entries(obj));
    } catch (e) {
      return new Map();
    }
  }
);

function getSiteCategory(principal) {
  try {
    let host = principal.URI.host;
    if (lazy.siteCategories.has(host)) {
      return lazy.siteCategories.get(host);
    }
    let baseDomain = principal.baseDomain;
    if (lazy.siteCategories.has(baseDomain)) {
      return lazy.siteCategories.get(baseDomain);
    }
    return "other";
  } catch (e) {
    return "other";
  }
}
```

The lookup checks the full host first (so `mail.google.com` can be categorized as "email" separately from `google.com`), then falls back to `baseDomain` for general matches. Anything unrecognized returns `"other"`.

---

## Recording in the Permission Lifecycle

The core telemetry hooks into `DesktopNotificationPermissionPrompt` in `PermissionUI.sys.mjs`. The prompt interaction event fires inside the `promptActions` callback, which runs when the user clicks allow or block:

```javascript
let siteCategory = getSiteCategory(this.principal);

// In promptActions (allow button):
callback: () => {
  Glean.webNotificationPermission.promptInteraction.record({
    site_category: siteCategory,
    action: "allow",
    is_persistent: true,
  });
},
```

For the `prompt_shown` event, the interesting part is detecting how the prompt was triggered. If the site called `requestPermission()` with a valid user gesture, the prompt shows immediately (trigger: `"script"`). If the request lacked a gesture, Firefox shows the icon first, and the prompt only appears when the user clicks it (trigger: `"icon_click"`). The distinction is important because auto-prompted sites tend to have much lower grant rates.

---

## Revocation Tracking

Users can revoke notification permissions through two paths, and the patch instruments both.

The toolbar path fires when a user clicks the site identity icon in the URL bar and removes the notification permission from the panel:

```javascript
if (idNoSuffix === "desktop-notification") {
  Glean.webNotificationPermission.permissionRevokedToolbar.record({
    site_category: PermissionUI.getSiteCategory(gBrowser.contentPrincipal),
  });
}
```

This lives in `browser-sitePermissionPanel.js`. The preferences path is similar but fires from `sitePermissions.js`, where users can manage all site permissions in a list view.

Having both revocation events lets us understand whether users tend to revoke permissions reactively (from the toolbar, while on the site) or proactively (from settings, in bulk).

---

## What I Learned

This was my first patch in the Firefox codebase, and it touched a lot of surface area: 7 files changed, +646 lines added, including 336 lines of browser tests.

**Navigating a massive codebase is a skill in itself.** The notification permission system spans the DOM layer, the permission UI layer, and the popup notification infrastructure. Just figuring out where the telemetry should live (and which callbacks to hook into) took more time than writing the actual code. I spent a lot of time with `searchfox.org` tracing call paths before I wrote a single line.

**The review process teaches you things docs can't.** My reviewers pushed back on the original hardcoded site category map, which led to the JSON pref approach. That was a better design, both for maintainability and because it means the categories can be updated through a pref change without landing a new patch.

**Glean is well-designed but has real constraints.** Metrics definitions in YAML feel declarative and simple, but the recording side requires careful thought about where in the code lifecycle to fire events, what extra keys to include, and how to handle edge cases (like a principal with no host). The test infrastructure for Glean events in browser tests was also something I had to learn from scratch.
