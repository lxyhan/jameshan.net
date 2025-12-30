---
title: 'Dreadnought Economics'
pubDate: '2025-11-25'
---

![_HMS Dreadnought](../_assets/dreadnought.jpg)

In 1906, the British Royal Navy launched the _HMS Dreadnought_.

> **Before Dreadnought**
>
> Until that morning, naval power was a gradient. You had older battleships, newer battleships, some with more guns, some with fewer. It was a linear progression of utility.

**But the _Dreadnought_ was different:**
- First all-big-gun battleship
- Powered by steam turbines
- Faster, deadlier, and tougher than anything else on the water

> **The Discontinuous Jump**
>
> The moment she launched, she didn't just become the "best" ship. She effectively **deleted the value** of every other ship in existence. Every battleship built before 1906—even ones launched just a month prior—instantly became "pre-Dreadnoughts." They were obsolete scrap metal.

I tell you this because I recently realized I have inadvertently recreated the Anglo-German Naval Arms Race in my bedroom closet. And, much like the German Empire in 1910, I am losing.

## The Dataset of Ruin

I spend a lot of time optimizing trading strategies and game theory models. Theoretically, I should be good at resource allocation. In practice, my personal inventory is a disaster.

I conducted a forensic audit of my last 24 months of clothing consumption.

> **The Data**
>
> - **Sample Size ($N$):** $\approx 45$ items acquired
> - **CapEx:** $\approx$ \$2,250 (mean price $\mu_p \approx$ \$50)
> - **The Hypothesis:** Usage would follow a **Uniform Distribution** ($U(a,b)$). I paid for them, so I should wear them.
> - **The Reality:** Usage followed a severe **Power Law**. Roughly 5-7 items accounted for $>60\%$ of total utility.

**Result:** About \$1,000 of dead capital hanging on hangers.

**Why?** I didn't understand that clothing follows the same rules as naval warfare.

## The Dreadnought Effect in Utility Theory

> **Standard Economic Theory**
>
> Goods are **substitutable** with diminishing marginal utility. If I have a "Perfect" shirt ($U=1.0$) and a "Good" shirt ($U=0.8$), I should theoretically wear the Good shirt $40\%$ of the time.

**False.**

> **Reality: Discontinuous Utility**
>
> The moment I acquire a "Dreadnought"—a perfect item—the probability of me choosing an inferior substitute drops to near zero.

<!-- ![_Discontinuous Step Function](../_assets/utility-graph.png) -->

$$
P(\text{Wear}_x) =
\begin{cases}
1 & \text{if } x = \text{Dreadnought} \\
\epsilon & \text{if } x = \text{Sub-optimal} \quad (\text{where } \epsilon \to 0)
\end{cases}
$$

### Exhibit A: The Zara Failure

I bought a pair of white oversized Zara jeans.

- **The Intent:** High fashion.
- **The Reality:** They didn't pair well with my core items. My "Confidence Multiplier" ($\alpha$) was $\approx 0.4$.
- **The Dreadnought:** I already owned tailored chinos that fit perfectly ($\alpha = 1.0$).
- **Result:** The Zara jeans were rendered obsolete immediately. $N_{wears} = 2$. This is dead capital.

### Exhibit B: The Patagonia Arbitrage

I bought a Patagonia technical climbing tee (discounted to \$30).

- **The Reality:** It fits perfectly. It doesn't smell. It never wrinkles.
- **Result:** It is a Dreadnought. It murdered every other t-shirt in my drawer.
- **CPW:** Approaches \$0.

## The New Protocol: Quantifying the Closet

To stop bleeding money, I'm treating my wardrobe as a bounded system governed by specific variables.

### 1. The Decay Constant ($\lambda$)

Clothing is a depreciating asset. Its structural integrity over time ($t$) follows exponential decay:

$$
S(t) = S_0 e^{-\lambda t}
$$

> **Decay Rates**
>
> - **Patagonia/Arc'teryx:** $\lambda \to 0$ (the "Forever Coefficient")
> - **Cheap Fast Fashion Wool:** $\lambda \approx 0.5$ per wash (loses shape faster than a radioactive isotope)

---

### 2. The Optimization Strategy

I am pivoting to a **High-CPW Uniform** strategy (Zone 1).

> **Three Rules**
>
> 1. **The "Dreadnought" Filter** — If a new item does not completely obsolete a previous item in its category, **do not buy it**. "Good enough" is a trap.
> 2. **The Functional Exception** — For high-entropy environments (The Gym), Aesthetic Value is irrelevant. My \$15 Decathlon tee with CPW = \$0.50 is an efficiency masterpiece. It stays.
> 3. **The Constraint** — 5 Tops, 4 Bottoms, 4 Shoes

**Why 4 pairs of shoes?**

Material fatigue requires rotation. By introducing a rest period ($t_{rest} > 24h$), we reduce the Decay Constant ($\lambda$) and extend the asset lifespan.

---

## Conclusion

I spent \$2,250 to learn that in a closed system like a closet, the "Second Best" option isn't an alternative,it's waste.

The British Navy learned this in 1906. I learned it in 2024. From now on, I only invest in Dreadnoughts.
