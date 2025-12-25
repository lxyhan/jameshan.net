---
title: 'II. Telemetry Revocation Events'
pubDate: '2025-12-22'
---

*Extending the notification telemetry to track when users revoke permissions.*

**Bug 1998053** | [D274203](https://phabricator.services.mozilla.com/D274203) | Reviewer: timhuang

---

## New Metrics

Building on the initial telemetry work, I added two new events to track permission revocation:

| Event | Description |
|-------|-------------|
| `permission_revoked_toolbar` | User revokes via toolbar panel (X button) |
| `permission_revoked_preferences` | User revokes via Firefox preferences |

---

## Implementation

### Exporting getSiteCategory

The `getSiteCategory` function needed to be accessible from other modules:

```javascript
// PermissionUI.sys.mjs
export function getSiteCategory(principal) {
  // ... categorization logic
}
```

### Toolbar Revocation

In `browser-sitePermissionPanel.js`:

```javascript
if (idNoSuffix === "desktop-notification") {
  Glean.webNotificationPermission.permissionRevokedToolbar.record({
    site_category: PermissionUI.getSiteCategory(gBrowser.contentPrincipal),
  });
}
```

### Preferences Revocation

In `sitePermissions.js`:

```javascript
if (this._type === "desktop-notification") {
  for (let group of this._permissionsToDelete.values()) {
    Glean.webNotificationPermission.permissionRevokedPreferences.record({
      site_category: PermissionUI.getSiteCategory(group.principal),
    });
  }
}
```

---

## Complete Metrics Summary

With these additions, the full telemetry suite covers 7 events:

1. `icon_shown` — Permission icon appears
2. `icon_clicked` — User clicks the icon
3. `prompt_shown` — Dialog displayed (script vs icon_click trigger)
4. `prompt_blocked` — Auto-denied (no user gesture)
5. `prompt_interaction` — User allows/blocks (with persistence tracking)
6. `permission_revoked_toolbar` — Revoked via toolbar
7. `permission_revoked_preferences` — Revoked via preferences

This gives Firefox complete visibility into the notification permission lifecycle—from request to revocation.
