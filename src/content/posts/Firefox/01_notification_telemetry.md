---
title: 'I. Notification Permission Telemetry'
pubDate: '2025-11-27'
---

*My first Firefox patch: adding Glean telemetry to track how users interact with notification permission prompts.*

**Bug 1998053** | [D274203](https://phabricator.services.mozilla.com/D274203) | Reviewer: timhuang

---

## The Problem

Firefox had limited visibility into how users interact with notification permission requests. We knew when permissions were granted or denied, but not:

- How often the permission icon appears vs. the full prompt
- Whether users click the icon or get the prompt automatically
- What percentage of requests are auto-blocked due to lack of user gesture
- How behavior differs across site categories (social media vs. productivity apps)

---

## The Architecture

Firefox's notification permission system has several layers:

**1. DOM Layer** (`dom/notification/`)
- Handles `Notification.requestPermission()` API calls
- Validates security context (HTTPS required)
- Checks for user gesture activation

**2. Permission UI Layer** (`browser/modules/PermissionUI.sys.mjs`)
- `DesktopNotificationPermissionPrompt` class
- Manages the permission dialog lifecycle
- Handles the "post-prompt" (shaking icon) flow
- **This is where I added the new telemetry**

**3. Popup Notification System** (`browser/modules/PopupNotifications.jsm`)
- Generic notification panel infrastructure
- Provides callbacks: `onShown`, `onAfterShow`, event callbacks

---

## What I Built

### Five Glean Event Metrics

```yaml
web_notification_permission:
  icon_shown:
    description: Permission icon appears and animates in URL bar
  icon_clicked:
    description: User clicks the permission icon
  prompt_shown:
    description: Permission dialog displayed (script vs icon_click)
  prompt_blocked:
    description: Permission request auto-denied (no user gesture)
  prompt_interaction:
    description: User allows/blocks permission (with persistence)
```

### Site Categorization System

Added a hardcoded map of 86 high-traffic domains across 8 categories:

```javascript
const SITE_CATEGORIES = new Map([
  ["facebook.com", "social"],
  ["slack.com", "chat_communication"],
  ["mail.google.com", "email"],
  ["youtube.com", "media_streaming"],
  // ... 86 total domains
]);

function getSiteCategory(principal) {
  let host = principal.URI.host;
  if (SITE_CATEGORIES.has(host)) {
    return SITE_CATEGORIES.get(host);
  }
  // Check subdomain match
  for (let [domain, category] of SITE_CATEGORIES) {
    if (host.endsWith("." + domain)) {
      return category;
    }
  }
  return "other";
}
```

---

## The Tricky Parts

### Detecting Icon Click vs. Automatic Prompt

The challenge was distinguishing:
- **Automatic**: User clicked a button → site calls `requestPermission()` → prompt appears immediately
- **Icon click**: Site calls `requestPermission()` without gesture → icon appears → user clicks icon → prompt appears

Solution: check both the preference and the request's `hasValidTransientUserGestureActivation`:

```javascript
let trigger = "automatic";
if (
  this.requiresUserInput &&
  !this.request.hasValidTransientUserGestureActivation
) {
  trigger = "icon_click";
}
```

### Finding the Right Callback Point

The telemetry had to go in the base `PermissionPrompt` class's `prompt()` method, which wraps all actions—not in `DesktopNotificationPermissionPrompt` directly.

---

## What I Learned

1. **Firefox's Permission System is Layered** — DOM validates, UI presents, permission manager stores
2. **Glean Telemetry is Code, Not Configuration** — Metrics are defined in YAML but recorded in code
3. **User Gestures Matter** — `hasValidTransientUserGestureActivation` determines immediate vs. deferred prompts
4. **The Permission Prompt is a State Machine** — Not just "shown → allow/block" but a full lifecycle
