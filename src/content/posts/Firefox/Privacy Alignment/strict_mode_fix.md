---
title: 'Strict Mode Fix'
pubDate: '2026-03-08'
order: 4
---

*The capability matrix was showing the wrong value for Bounce Tracking Protection in Strict mode. The bug was in how feature codes get resolved.*

**Bug 2020404** | [D286581](https://phabricator.services.mozilla.com/D286581)

---

## The Problem

The ETP feature string in `firefox.js` encodes which features are enabled in Strict mode as comma-separated codes like `tp,tpPrivate,cookieBehavior5,cm,fp,stp,btp,lna`. For integer prefs, the code usually includes the value as a suffix: `cookieBehavior5` means "set `network.cookie.cookieBehavior` to 5."

Bounce Tracking Protection (BTP) broke this pattern. Its feature code is just `btp` with no numeric suffix, but its pref (`privacy.bounceTrackingProtection.mode`) is an integer. The standard default is mode 3 (dry-run/observing), and Strict should set it to mode 1 (enabled). But `_resolve_strict_value` was falling through to the generic integer-suffix parsing path, finding no suffix, and returning the standard default (3) instead of the correct Strict value (1).

---

## The Fix

Added a named case for the `btp` feature code:

```python
def _resolve_strict_value(feature, strict_features, standard_value):
    code = feature["code"]
    enabled = code in strict_features
    pref_value = str(standard_value)

    if pref_value in ("true", "false"):
        return "true" if enabled else "false"

    # BTP uses a named mode integer, not a numeric suffix in the feature code.
    # MODE_ENABLED=1 is the active state; strict enables it by setting mode to 1.
    if code == "btp":
        return "1" if enabled else standard_value

    # For integer prefs (cookieBehavior), the feature code name encodes the
    # enabled value. E.g. "cookieBehavior5" means set to 5.
    ...
```

I also updated the description for Local Network Access (LNA) to note that it's gated behind an additional Nimbus pref (`network.lna.etp.enabled`), which the feature string alone doesn't capture.

---

## What I Learned

1. **Convention-based parsing breaks on exceptions.** The numeric-suffix convention for feature codes worked for most features, but BTP was the exception. When you build a parser around a convention, you need explicit handling for the cases that don't follow it.
2. **Feature flags can have multiple layers of gating.** LNA is "enabled" in the ETP Strict string, but also requires a separate Nimbus experiment flag. The capability matrix needs to reflect both layers to be accurate.
