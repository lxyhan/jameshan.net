---
title: 'Android ETP Pipeline'
pubDate: '2026-03-25'
order: 1
---

**Bug 2020402** | [D286029](https://phabricator.services.mozilla.com/D286029), [D289805](https://phabricator.services.mozilla.com/D289805) | Reviewer: manuel

The Sphinx extension I built for the ETP capability matrix worked well, but it only covered desktop Firefox. Android has its own tracking protection implementation, and the privacy team needed a single document comparing both platforms side by side. So I built a cross-platform pref extraction pipeline that could pull resolved ETP values from both desktop and Android nightly builds.

---

## Why Android is Different

On desktop, ETP works through individual Gecko prefs. There is a base layer of defaults in `firefox.js`, and the ETP feature string overrides specific prefs depending on whether the user is in Standard or Strict mode. The Sphinx extension I already had could parse these statically.

Android (Fenix, built on GeckoView) takes a fundamentally different approach. Instead of toggling individual prefs, it uses a category-based system defined in `EngineSession.kt`. The categories are coarse buckets: `SAFE_BROWSING`, `AD`, `ANALYTIC`, `SOCIAL`, `TEST`, `CRYPTOMINING`, `FINGERPRINTING`, `CONTENT`, `FULL`. When a user selects Standard or Strict mode, GeckoView applies the relevant set of categories through `ContentBlocking.Settings`, which then maps down to underlying Gecko prefs in a way that is not directly visible from the source code.

The mapping from categories to actual prefs is not one-to-one, and it is not documented anywhere I could find. The only reliable way to know what prefs Android sets is to actually run it and read the values back.

---

## The Extraction Pipeline

The core insight was that both platforms ultimately resolve to Gecko prefs at runtime, even though they get there through different paths. If I could capture those resolved values from running instances, I could compare them directly.

Here is what I built:

**Desktop extraction** uses a Marionette script. It connects to a running Firefox instance, reads `ContentBlockingPrefs.CATEGORY_PREFS` at runtime for both Standard and Strict mode, and dumps the resolved values as JSON. This was simpler than the static parsing approach and caught cases where prefs interacted in ways that were hard to predict from source alone.

**Android extraction** required a GeckoView JUnit test (`EtpPrefExtractionTest.kt`, about 155 lines). The test spins up a GeckoView session, applies `ContentBlocking.Settings` in Standard mode, reads back all privacy-relevant prefs via `GeckoPreferenceController`, then repeats for Strict mode. The output is a JSON blob with every pref value under each mode.

```kotlin
// Simplified structure of the extraction test
@Test
fun extractStandardModePrefs() {
    val settings = ContentBlocking.Settings.Builder()
        .categories(ContentBlocking.Category.STANDARD)
        .build()
    sessionRule.applyContentBlockingSettings(settings)

    val prefs = GeckoPreferenceController.getAllPrivacyPrefs()
    writeJson("standard", prefs)
}
```

**CI integration** ties it together. A Taskcluster job defined in `etp-prefs.yml` (47 lines) runs both extraction scripts daily against nightly builds. The outputs are stored as JSON snapshots (`android.json`, `desktop.json`) that the Sphinx extension can fetch at documentation build time.

**Sphinx rendering** was the last piece. I updated `etp_matrix.py` to fetch the Android JSON alongside the desktop data and generate a combined table. The extension gained HTTP fetch logic and Android table generation, adding about 173 lines. The final rendered doc shows desktop and Android columns side by side, making it immediately obvious where the platforms diverge.

---

## Where They Diverge

Once I had the pipeline running, the comparison revealed some interesting gaps. A few prefs that desktop Strict mode enables are not set by Android at all, because GeckoView's category system does not have a matching bucket. In other cases, Android's `CONTENT` category sets prefs that desktop does not touch in either mode.

These were not bugs exactly. They were consequences of two teams implementing the same feature through different abstractions over several years. But having them visible in a single document made it much easier for the privacy team to decide what to align and what to leave as platform-specific behavior.

---

## What Made This Hard

The biggest challenge was not any single piece of the pipeline. It was that each piece lived in a different part of Mozilla's infrastructure.

The GeckoView test needed to land in the `mobile/android/` tree and run on Android emulators in CI. The Marionette script lived in the desktop test harness. The Taskcluster job needed its own task definition with the right dependencies on both platforms' nightly builds. The Sphinx extension needed to handle the case where the JSON snapshots were stale or missing without breaking the docs build.

Coordinating across these systems meant working with Taskcluster's YAML-based task graph, GeckoView's testing infrastructure, and the Sphinx build pipeline all in one patch stack. The total diff was 9 files changed with about 502 new lines spread across Firefox, GeckoView, and Taskcluster configs.

---

## Takeaways

This project taught me a few things that are hard to learn outside of a large codebase.

First, cross-platform parity is harder than it sounds. Desktop and Android implement the same user-facing feature through completely different abstractions. Comparing them required going below both abstractions to the shared layer (Gecko prefs) and working back up.

Second, I got real experience with Taskcluster, Mozilla's CI/CD system. Writing task definitions, managing artifact dependencies between jobs, and debugging failures on remote emulators is a different skill set from writing application code.

Third, I learned GeckoView's API surface for testing. The JUnit integration test pattern, where you spin up a real GeckoView session and interact with it programmatically, was new to me and turned out to be a powerful way to verify behavior that is hard to test statically.
