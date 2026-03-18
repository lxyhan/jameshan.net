---
title: 'Bridging the Transit Data Gap'
pubDate: '2026-03-17'
---

A research proposal for using machine learning to detect transit deserts and predict latent demand in unserved Canadian communities. Written with Ethan Qiu and Helen Zhao for the RBC Borealis Let's Solve It competition.

---

## The Problem

Public transit planning decisions are typically justified using existing ridership data. This creates a feedback loop: areas without service produce no ridership data, so planners have no quantitative basis to extend service there. The communities that depend most on transit --- low-income households, newcomers, seniors, zero-car families --- are systematically underserved because no data exists to advocate on their behalf.

This is especially urgent in Canada's fast-growing suburbs. The Toronto CMA grew by 268,911 people in a single year as of July 2024, surpassing 7 million residents, with growth concentrated in peripheral municipalities like Brampton and Markham. Research from U of T's School of Cities documents that immigrants to the GTA have increasingly settled in outer suburbs rather than the urban core since the early 2000s. Many face limited car access and rely on transit to reach employment, language training, and settlement services --- yet these communities often have the sparsest transit coverage.

The data confirms the equity dimension: roughly one in four Black (25.7%), Latin American (25.3%), and Filipino (24.4%) commuters in Canada primarily use public transit, compared to just 6.8% of non-racialized, non-Indigenous commuters.

## The Proposed System

A two-layer ML pipeline:

**Layer 1: Transit desert identification.** Combine GTFS transit network data with socioeconomic demand proxies (census demographics, points of interest, walkability metrics) to score every neighbourhood on the gap between transit supply and likely demand.

**Layer 2: Counterfactual demand prediction.** Estimate how many people *would* ride transit in areas that currently have no service. This is the harder problem --- we're predicting an outcome (ridership) that's unobservable because the intervention (transit service) doesn't exist yet.

## Why Machine Learning

Traditional transit planning uses GIS-based gap analysis to identify transit deserts, but can't answer the follow-up question: *if we added a bus route here, how many people would use it?*

Three ML techniques make this tractable:

1. **Gradient boosted models** (XGBoost) capture nonlinear relationships between neighbourhood characteristics and ridership that linear regression can't
2. **Importance-weighted empirical risk minimization** corrects for the domain shift between served areas (denser, more central) and unserved areas (suburban, lower-density) --- a covariate shift correction that re-weights training examples to match the target distribution
3. **Conformal prediction** provides distribution-free uncertainty quantification, attaching honest confidence intervals to every demand estimate so decision-makers know where predictions are reliable vs speculative

## Data Sources

All publicly available:

- **Transit supply:** GTFS schedule data from Canadian transit agencies (TTC, TransLink, OC Transpo, STM, Calgary Transit) via the Transitland platform --- encodes every route, stop, trip, and schedule
- **Demand proxies:** Statistics Canada Census data at the dissemination area level (population density, income, car ownership, immigration status, age, commuting mode) supplemented with OpenStreetMap POIs (hospitals, schools, grocery stores, shelters)
- **Ridership targets:** Route-level or stop-level boarding data published by several agencies (TTC average weekday ridership by route, TransLink stop-level counts)
- **Accessibility validation:** Isochrones computed via OpenTripPlanner using the standard 400m bus / 800m rail walking buffers from the transit planning literature

## The Reframing

The fundamental contribution is shifting the conversation from "nobody rides transit there" to "many people *would* ride transit there if it existed." That reframing, backed by data, is what underserved communities need to be heard in planning decisions.

---

### References

- Jiao & Dillivan (2013). Transit Deserts: The Gap between Demand and Supply. *Journal of Public Transportation*, 16(3).
- Karner et al. (2020). From Transportation Equity to Transportation Justice. *Journal of Planning Literature*, 35(4).
- Allen, Farber & Tiznado-Aitken (2024). Pathways to suburban poverty in nine Canadian metropolitan areas. *Cities*, 147.
- Shimodaira (2000). Improving predictive inference under covariate shift. *JSPI*, 90(2).
- Romano, Patterson & Candes (2019). Conformalized Quantile Regression. *NeurIPS* 32.
- Marques & Pitombo (2022). Transit Ridership Modeling at the Bus Stop Level. *Applied Spatial Analysis and Policy*.
