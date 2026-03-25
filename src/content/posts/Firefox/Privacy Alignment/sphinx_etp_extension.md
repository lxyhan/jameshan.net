---
title: 'Sphinx ETP Extension'
pubDate: '2026-02-27'
order: 1
---

**Bug 2011450** | [D281665](https://phabricator.services.mozilla.com/D281665) | Reviewer: manuel

Firefox's Enhanced Tracking Protection is configured by hundreds of prefs scattered across multiple source files. There was no single document that showed what's actually enabled, in which mode, for which browsing context. The privacy team needed that document for internal alignment and external-facing documentation, but maintaining it by hand was impractical since prefs change every release cycle.

I built a 982-line Python Sphinx extension that auto-generates this documentation from source code at build time. It parses the actual pref files, resolves what's on or off in Standard vs Strict mode, and outputs markdown tables published to Firefox Source Docs.

---

## The problem

ETP has two modes: Standard (the default) and Strict (opt-in). Each mode toggles a different set of privacy features, and some features behave differently in Private Browsing vs normal browsing. The configuration for all of this lives in three places:

- **firefox.js** contains the `browser.contentblocking.features.strict` pref, a comma-separated string that encodes which features are enabled in Strict mode (codes like `tp`, `tpPrivate`, `cookieBehavior5`, `btp`, `fpp`, etc.)
- **StaticPrefList.yaml** defines the Standard mode defaults
- **all.js** holds additional default values

Before this extension, if you wanted to know "is Bounce Tracking Protection enabled in Strict mode, normal browsing?" you had to trace through all three files yourself. Multiply that by ~15 features and two browsing contexts, and you get a matrix nobody wanted to maintain manually.

---

## The approach

The extension hooks into Sphinx's `builder-inited` event. When the docs build runs, it reads the three source files, parses out every relevant pref value, and generates structured tables. The output covers ETP features plus seven additional sections: Safe Browsing, Private Browsing, Cookie Behavior, Privacy Headers, Fingerprinting Resistance, Anti-fraud, and Other Privacy Features.

The core data structure is a `FEATURES` list that maps each privacy feature to its codes, prefs, and description:

```python
FEATURES = [
    {
        "name": "Tracking Protection",
        "code": "tp",
        "pb_code": "tpPrivate",
        "pref_normal": "privacy.trackingprotection.enabled",
        "pref_pb": "privacy.trackingprotection.pbmode.enabled",
        "desc": "Blocks resources loaded from domains on the Disconnect tracking protection list.",
    },
    {
        "name": "Bounce Tracking Protection",
        "code": "btp",
        "pb_code": None,
        "pref_normal": "privacy.bounceTrackingProtection.mode",
        "pref_pb": None,
        "desc": "Clears state for sites used as bounce trackers.",
    },
    ...
]
```

Each entry carries a `code` (the shorthand used in the Strict mode feature string), an optional `pb_code` for Private Browsing, the actual pref names, and a human-readable description. The `FEATURES` list drives the ETP tables, while a separate `OTHER_PRIVACY_PREFS` dict maps category names to lists of `(name, pref, pb_pref, description)` tuples for the remaining seven sections.

---

## Resolving Strict mode values

The trickiest part was figuring out what value a pref takes in Strict mode. The `browser.contentblocking.features.strict` string is a clever compression format. It's a comma-separated list of feature codes, and some codes carry their value inline. For example, `cookieBehavior5` means "set the cookie behavior pref to 5." Boolean prefs are simpler: if the code is present, the feature is on.

Here's the resolution logic:

```python
def _resolve_strict_value(feature, strict_features, standard_value):
    code = feature["code"]
    enabled = code in strict_features
    pref_value = str(standard_value)

    if pref_value in ("true", "false"):
        return "true" if enabled else "false"

    # BTP uses a named mode integer, not a numeric suffix
    if code == "btp":
        return "1" if enabled else standard_value

    # For integer prefs (cookieBehavior), the feature code encodes the value
    # E.g. "cookieBehavior5" means set to 5
    ...
```

The function checks whether the feature code appears in the parsed Strict string. For boolean prefs, presence means `true`. For BTP, which uses a mode integer, presence means mode `1`. For numeric prefs like `cookieBehavior`, the code itself embeds the target value as a suffix. This cascading logic handles all the encoding variants I found across the feature set.

---

## Parsing the source files

Each of the three source files needed its own parsing strategy:

- **firefox.js and all.js**: These are JavaScript pref files with lines like `pref("privacy.trackingprotection.enabled", false);`. I used regex to extract pref name-value pairs. Not glamorous, but the format is stable and simple enough that a regex handles it reliably.
- **StaticPrefList.yaml**: This one I could parse properly with Python's YAML library. Each entry maps a pref name to its default value and type.

The parsing is inherently brittle since I'm reading source code, not a stable API. But that's the whole point: the docs are generated from the same source that ships in Firefox. If a pref changes, the next docs build picks it up automatically. The brittleness is a feature in the sense that if the source format changes in a way the parser can't handle, the build fails loudly rather than publishing stale documentation.

---

## The output

The extension generates a complete reference page with separate tables for each category. The ETP table has columns for Feature, Description, Standard (Normal), Standard (Private Browsing), Strict (Normal), and Strict (Private Browsing). Each cell shows the resolved pref value. The additional seven sections follow a similar format, covering everything from Safe Browsing settings to fingerprinting resistance flags.

The `setup` function registers the extension with Sphinx and connects to `builder-inited`, so the generation runs before any rendering. The output is written as reStructuredText that Sphinx then processes normally alongside the rest of Firefox Source Docs.

---

## What I learned

Parsing real source code is a compromise. Regex for JS prefs and a YAML parser for StaticPrefList is the pragmatic choice, not the elegant one. But it works, and it means the documentation is always derived from the actual shipped configuration rather than a manually maintained copy.

The ETP feature string encoding turned out to be a surprisingly compact format for representing a matrix of feature toggles. Understanding how that string gets unpacked at runtime helped me write the resolution logic correctly.

The bigger takeaway is that documentation-as-code is worth the upfront investment. The privacy team now has a reference that updates itself every release cycle, and nobody has to remember to go update a wiki page when a pref flips. Four files changed, 987 lines added, and the result is a living document that stays in sync with Firefox.
