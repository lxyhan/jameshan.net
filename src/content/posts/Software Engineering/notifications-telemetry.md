---
title: 'Firefox Telemetry I'
pubDate: '2025-11-27'
---

# Instrumenting the Notification Permission Funnel in Firefox

*My first Firefox patch: adding Glean telemetry to track how users interact with notification permission prompts.*

---

## **The Problem**

Firefox currently has limited visibility into how users interact with notification permission requests. We know when permissions are granted or denied (stored in the permission manager), but we don't know:

- How often the permission icon appears vs. the full prompt
- Whether users click the icon or get the prompt automatically
- What percentage of requests are auto-blocked due to lack of user gesture
- How user behavior differs across site categories (social media vs. productivity apps)

Without this data, we can't optimize the permission flow or understand why certain sites have low opt-in rates.


---

## **The Architecture**

Firefox's notification permission system has several layers:

**1. DOM Layer** (`dom/notification/`)
- Handles `Notification.requestPermission()` API calls
- Validates security context (HTTPS required)
- Checks for user gesture activation
- Already has some telemetry (request origin categorization)

**2. Permission UI Layer** ([browser/modules/PermissionUI.sys.mjs](cci:7://file:///Users/jhan/Documents/firefox/browser/modules/PermissionUI.sys.mjs:0:0-0:0))
- [DesktopNotificationPermissionPrompt](cci:2://file:///Users/jhan/Documents/firefox/browser/modules/PermissionUI.sys.mjs:1259:0-1406:1) class
- Manages the permission dialog lifecycle
- Handles the "post-prompt" (shaking icon) flow
- **This is where I added the new telemetry**

**3. Popup Notification System** (`browser/modules/PopupNotifications.jsm`)
- Generic notification panel infrastructure
- Provides callbacks: [onShown](cci:1://file:///Users/jhan/Documents/firefox/browser/modules/PermissionUI.sys.mjs:494:2-498:14), [onAfterShow](cci:1://file:///Users/jhan/Documents/firefox/browser/modules/PermissionUI.sys.mjs:377:2-381:18), event callbacks
- Handles user interactions (Allow/Block/dismiss)

---

## **What I Built**

### **Five New Glean Event Metrics**

Defined in `browser/modules/metrics.yaml`:

```yaml
web_notification_permission:
  icon_shown:
    type: event
    description: >
      Recorded when the notification permission icon is shown and displays the
      shaking animation in the URL bar
    extra_keys:
      site_category:
        description: Category of the site requesting notification permissions
        type: string
    bugs:
      - https://bugzilla.mozilla.org/show_bug.cgi?id=1998053
    data_reviews:
      - https://bugzilla.mozilla.org/show_bug.cgi?id=1998053
    notification_emails:
      - jhan@mozilla.com
    expires: never
  
  icon_clicked:
    type: event
    description: >
      Recorded when the user clicks the notification permission icon in the URL bar
    extra_keys:
      site_category:
        description: Category of the site requesting notification permissions
        type: string
    # ... (similar structure)

  prompt_shown:
    type: event
    description: >
      Recorded when the notification permission prompt is shown to the user
    extra_keys:
      site_category:
        description: Category of the site requesting notification permissions
        type: string
      trigger:
        description: How the prompt was triggered (user click vs automatic)
        type: string
    # ... (similar structure)

  prompt_blocked:
    type: event
    description: >
      Recorded when the notification permission prompt is blocked (auto-denied)
    extra_keys:
      site_category:
        description: Category of the site requesting notification permissions
        type: string
      reason:
        description: Why the prompt was blocked
        type: string
    # ... (similar structure)

  prompt_interaction:
    type: event
    description: >
      Recorded when the user interacts with the notification permission prompt
    extra_keys:
      site_category:
        description: Category of the site requesting notification permissions
        type: string
      action:
        description: The action the user took (allow/block)
        type: string
      is_persistent:
        description: Whether the user's choice will be remembered
        type: boolean
    # ... (similar structure)
```

### **Site Categorization System**

Added a hardcoded map of 86 high-traffic domains across 8 categories:

```javascript
const SITE_CATEGORIES = new Map([
  // Social
  ["facebook.com", "social"],
  ["instagram.com", "social"],
  ["tiktok.com", "social"],
  ["reddit.com", "social"],
  // Chat & Communication
  ["slack.com", "chat_communication"],
  ["discord.com", "chat_communication"],
  ["teams.microsoft.com", "chat_communication"],
  // Email
  ["mail.google.com", "email"],
  ["outlook.com", "email"],
  // Media & Streaming
  ["youtube.com", "media_streaming"],
  ["netflix.com", "media_streaming"],
  ["spotify.com", "media_streaming"],
  // Gaming, Calendar, Productivity, News...
  // (86 total domains)
]);

function getSiteCategory(principal) {
  try {
    let host = principal.URI.host;
    
    // Check exact match
    if (SITE_CATEGORIES.has(host)) {
      return SITE_CATEGORIES.get(host);
    }
    
    // Check subdomain match
    for (let [domain, category] of SITE_CATEGORIES) {
      if (host.endsWith("." + domain) || host === domain) {
        return category;
      }
    }
    
    return "other";
  } catch (e) {
    return "other";
  }
}
```

### **Telemetry Recording Points**

**1. Icon Shown** (in [postPrompt()](cci:1://file:///Users/jhan/Documents/firefox/browser/modules/PermissionUI.sys.mjs:667:2-737:3) method):
```javascript
postPrompt() {
  // ... animation setup ...
  
  Glean.webNotificationPermission.iconShown.record({
    site_category: getSiteCategory(principal),
  });
  
  this.#showNotification(popupNotificationActions, true);
}
```

**2. Icon Clicked** (in post-prompt action callback):
```javascript
for (let promptAction of this.postPromptActions) {
  let action = {
    callback: () => {
      Glean.webNotificationPermission.iconClicked.record({
        site_category: getSiteCategory(principal),
      });
      // ... handle permission grant ...
    },
  };
}
```

**3. Prompt Shown** (in [onShown()](cci:1://file:///Users/jhan/Documents/firefox/browser/modules/PermissionUI.sys.mjs:494:2-498:14) override):
```javascript
onShown() {
  // Detect trigger type
  let trigger = "automatic";
  if (
    this.requiresUserInput &&
    !this.request.hasValidTransientUserGestureActivation
  ) {
    trigger = "icon_click";
  }

  Glean.webNotificationPermission.promptShown.record({
    site_category: getSiteCategory(this.principal),
    trigger,
  });
}
```

**4. Prompt Blocked** (in [prompt()](cci:1://file:///Users/jhan/Documents/firefox/browser/modules/PermissionUI.sys.mjs:506:2-665:3) method):
```javascript
if (
  this.requiresUserInput &&
  !this.request.hasValidTransientUserGestureActivation
) {
  Glean.webNotificationPermission.promptBlocked.record({
    site_category: getSiteCategory(this.principal),
    reason: "no_user_gesture",
  });
  
  if (this.postPromptEnabled) {
    this.postPrompt();
  }
  this.cancel();
  return;
}
```

**5. Prompt Interaction** (in action callback):
```javascript
callback: state => {
  let actionType =
    promptAction.action == lazy.SitePermissions.ALLOW
      ? "allow"
      : "block";
  let isPersistent =
    (state && state.checkboxChecked && state.source != "esc-press") ||
    promptAction.scope == lazy.SitePermissions.SCOPE_PERSISTENT;

  Glean.webNotificationPermission.promptInteraction.record({
    site_category: getSiteCategory(this.principal),
    action: actionType,
    is_persistent: isPersistent,
  });
  
  // ... handle permission storage ...
}
```

---

## **The Tricky Parts**

### **1. Detecting Icon Click vs. Automatic Prompt**

Firefox has a preference `dom.webnotifications.requireuserinteraction` that controls whether notification requests need a user gesture. The challenge was distinguishing:

- **Automatic**: User clicked a button → site calls `requestPermission()` → prompt appears immediately
- **Icon click**: Site calls `requestPermission()` without gesture → icon appears → user clicks icon → prompt appears

The solution: check both the preference and the request's `hasValidTransientUserGestureActivation` property in [onShown()](cci:1://file:///Users/jhan/Documents/firefox/browser/modules/PermissionUI.sys.mjs:494:2-498:14):

```javascript
let trigger = "automatic";
if (
  this.requiresUserInput &&
  !this.request.hasValidTransientUserGestureActivation
) {
  trigger = "icon_click";
}
```

### **2. Finding the Right Callback Point**

Initially, I thought [DesktopNotificationPermissionPrompt](cci:2://file:///Users/jhan/Documents/firefox/browser/modules/PermissionUI.sys.mjs:1259:0-1406:1) would have its own action callbacks. But it doesn't—it relies on the base [PermissionPrompt](cci:2://file:///Users/jhan/Documents/firefox/browser/modules/PermissionUI.sys.mjs:246:0-805:1) class to wrap its [promptActions](cci:1://file:///Users/jhan/Documents/firefox/browser/modules/PermissionUI.sys.mjs:309:2-333:3) array.

The telemetry had to go in the base class's [prompt()](cci:1://file:///Users/jhan/Documents/firefox/browser/modules/PermissionUI.sys.mjs:506:2-665:3) method, which wraps all actions:

```javascript
for (let promptAction of this.promptActions) {
  let action = {
    callback: state => {
      // Record telemetry HERE
      Glean.webNotificationPermission.promptInteraction.record({...});
      
      // Then call original callback if it exists
      if (promptAction.callback) {
        promptAction.callback();
      }
      // ... handle permission storage ...
    },
  };
}
```

### **3. Understanding Glean's Event Ping Behavior**

Events aren't sent immediately—they're batched and sent:
- Every ~24 hours
- When 500 events accumulate
- On app update
- **NOT on every shutdown** (for network efficiency)

For testing, I had to manually submit the events ping via `about:glean` or use `testGetValue()` in the Browser Console to see in-memory events.

---

## **Testing & Verification**

**1. Local Testing with Glean Debug Viewer:**
```javascript
// In about:glean → Manual Testing tab
// Set debug tag: "test-james"
// Select ping type: "events"
// Click Submit

// Then trigger notifications on test sites
// Check: https://debug-ping-preview.firebaseapp.com/
```

**2. Browser Console Verification:**
```javascript
// Cmd+Shift+J to open Browser Console
Glean.webNotificationPermission.promptShown.testGetValue()
// Returns array of recorded events

Glean.webNotificationPermission.promptInteraction.testGetValue()
// Returns array of user interactions
```

**3. Example Event Data:**
```json
{
  "category": "web_notification_permission",
  "name": "prompt_interaction",
  "timestamp": 1764196353310,
  "extra": {
    "site_category": "other",
    "action": "block",
    "is_persistent": "true"
  }
}
```

---

## **What I Learned**

**1. Firefox's Permission System is Layered**
- DOM layer validates and initiates
- UI layer presents and mediates
- Permission manager stores persistently
- Each layer has its own telemetry needs

**2. Glean Telemetry is Code, Not Configuration**
- Metrics are defined in YAML but recorded in code
- Privacy review happens at the metric definition level
- Data doesn't magically appear—you instrument specific code paths

**3. User Gestures Matter**
- Browsers distinguish between user-initiated and script-initiated actions
- `hasValidTransientUserGestureActivation` is the key property
- This affects whether prompts appear immediately or defer to an icon

**4. The Permission Prompt is a State Machine**
- Not just "shown → allow/block"
- Has states: requested → blocked → icon shown → icon clicked → prompt shown → interaction → stored
- Each transition is a potential telemetry point

**5. Testing Telemetry Requires Understanding the Pipeline**
- Events are batched, not sent immediately
- Debug tags let you see your own events in production infrastructure
- `testGetValue()` shows in-memory data before it's sent

---

## **Impact**

Once this lands, Firefox will have visibility into:
- **Conversion rates** by site category (how many requests → allows)
- **Icon effectiveness** (do users click the icon or ignore it?)
- **Auto-block frequency** (how often do we suppress prompts?)
- **Persistence patterns** (do users choose "Always Allow" or temporary?)

This data will inform:
- UI/UX improvements to the permission flow
- Policy decisions about auto-blocking behavior
- Product decisions about notification features
- Comparisons with other browsers' permission models

---

## **Closing Thought**

This wasn't "rewrite SpiderMonkey in Rust." It was instrumenting a 250-line state machine buried in browser chrome.

But it taught me how Firefox thinks: how user intent flows through layers, how privacy constraints shape what we can measure, and how good telemetry is the foundation for everything else.

Every browser engineer needs to understand the permission system. This was my entry point.

And now Firefox will actually know what users do when websites ask for notifications.

That's worth shipping.
