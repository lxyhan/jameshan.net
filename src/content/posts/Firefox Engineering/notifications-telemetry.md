---
title: 'Notification Telemetry'
pubDate: '2025-11-26'
---

```yaml
# metrics.yaml
notification.permission.requested:
  type: event
  description: Recorded when a site requests notification permission
  bugs: [1234567]
  data_reviews: [https://bugzilla.mozilla.org/...]
  notification_emails: [telemetry@mozilla.com]
  expires: never
```

# The Permission Funnel Problem

*how a single UI surface quietly governs the viability of web apps.*

There’s a moment every Firefox engineer experiences when they first descend into the codebase:
you discover that the hardest problems are not always nested in rendering pipelines, concurrency models, or Rust FFI boundaries.

Sometimes the critical bottleneck is a single square of UI chrome — the **notification permission prompt** — and the entire browser’s behavior depends on how ordinary humans interact with it.

My first project drops me right at this inflection point: a deceptively small surface atop a deeply layered architectural stack.

---

## **The Browser Is a Stack of Decisions, Not Just Code**

“Notifications” sound trivial:
send event → show alert → done.

In reality, they depend on a tight coupling between:

* the UI surface that exposes permission requests
* the system that persistently stores those permissions
* the dialog lifecycle that mediates user consent
* the underlying `Web Platform APIs`
* Firefox’s telemetry system (`Glean`)
* and the privacy policies that constrain what we are allowed to measure

If any of these layers misbehaves, the entire pipeline becomes unreliable.

And because Firefox currently does not deliver *background* notifications (unlike Safari/Edge), we cannot even consider that frontier until we understand the health of the *foreground* permission flow.

This is where the work begins.

---

## **The 7 Signal Points in the Permission Funnel**

A permission prompt is not a binary event.
It is a funnel — essentially a multi-state machine — that browsers have historically measured only in fragments.

I am instrumenting seven critical transitions:

1. **A site requests notification permission**
   – The initial exposure; how often the web attempts to initiate the dialogue.

2. **The user inspects the request**
   – Clicking the indicator is a revealing moment of curiosity, caution, or skepticism.

3. **The permission prompt appears**
   – The central decision surface.

4. **The request is automatically suppressed**
   – Due to prior user choices or protective settings.

5. **The user interacts with the prompt**
   – `Allow`, `Block`, `Never Allow`, `Learn More`, click-away, tab close — each branch carries different semantic weight.

6. **The user immediately adjusts the permission afterward**
   – A common but under-measured pattern: instant reconsideration.

7. **The user later revokes the permission in settings**
   – Long-horizon regret; the richest signal in the system.

These transitions span UI chrome, persistent preference storage, state transitions, and telemetry emissions.
Instrumenting them requires understanding how a decision propagates through the browser stack.

It is, in essence, **systems engineering disguised as UX analysis**.

---

## **Why Only Certain Domains Count**

We are not measuring the entire internet.
That would drown the signal in noise.

Instead, we focus on a **curated set of high-signal domains** — applications where notifications are genuinely central to user experience.

From an engineering perspective, this yields:

* bounded telemetry volume
* cleaner privacy review
* meaningful inter-domain comparisons
* stable behavioral patterns
* significantly higher signal-to-noise ratio

This is not product hand-waving; it is a data-quality and privacy necessity.

---

## **Telemetry Is Code, Not a Dashboard**

Telemetry is not something appended to the end of a project.
It *is* part of the architecture.

Every metric lives in the Firefox tree, defined, validated, privacy-reviewed, and emitted at specific boundaries.
Only after this pipeline runs does the data enter Mozilla’s internal analysis platform, where it eventually becomes dashboards.

The dashboard is not the artifact.
**The code is.**

Good telemetry is architecture.
Bad telemetry is entropy.

---

## **Why This Project Matters**

This is not “rewrite SpiderMonkey in Rust.”
And that is precisely why it is the right first project.

It forces me to learn:

* how browser chrome mediates user choices
* how the permission model behaves end-to-end
* the contract between UI surfaces and persistent storage
* where user intent can fracture or leak
* how telemetry observes behavior without violating privacy
* how data influences product and platform roadmaps

It is foundational engineering — the kind that quietly supports everything else.

Once shipped, it gives me the architectural context to work on deeper tasks:
improving permission behavior, contributing to quiet-UI logic, refining user flows, and eventually participating in the design conversations around background notification delivery.

Every browser engineer goes through some rite of passage where they learn how Firefox thinks.
This is mine.

---

## **Closing Thought**

In game theory, microscopic frictions compound into macroscopic outcomes.
In markets, microstructure determines whether a trade clears or slips into oblivion.
In browsers, micro-interactions like permission prompts influence whether the web can genuinely compete with native applications.

Shipping good telemetry is not glamorous.
But it is the difference between guessing and understanding —
and everything meaningful in engineering begins with understanding.