---
title: '9: Divide and Conquer'
pubDate: '2025-01-26'
---

Divide and conquer breaks problems into smaller subproblems, solves them recursively, and combines solutions. The challenge: analyzing recurrences to prove efficiency.

---

## The Divide and Conquer Paradigm

**Steps:**
1. **Divide** the problem into smaller subproblems
2. **Conquer** each subproblem recursively
3. **Combine** solutions to solve the original problem

**Key insight:** Subproblems must be substantially smaller (often half the size) for efficiency gains.

---

## Merge Sort

### Algorithm

```
MergeSort(A, lo, hi):
    if lo < hi:
        mid = (lo + hi) / 2
        MergeSort(A, lo, mid)
        MergeSort(A, mid+1, hi)
        Merge(A, lo, mid, hi)
```

**Merge operation:** Combine two sorted halves in $O(n)$ time by comparing front elements.

### Recurrence Analysis

$$T(n) = 2T(n/2) + O(n)$$

**Recursion tree method:**
- Level 0: $n$ work (one problem of size $n$)
- Level 1: $n$ work (two problems of size $n/2$)
- Level $i$: $n$ work ($2^i$ problems of size $n/2^i$)
- Height: $\log n$ levels

**Total:** $O(n \log n)$

---

## Counting Inversions

### Problem Definition

Given array $A[1..n]$, count pairs $(i, j)$ where $i < j$ but $A[i] > A[j]$.

**Applications:** Measuring similarity between rankings (e.g., collaborative filtering).

### Brute Force

Check all $\binom{n}{2}$ pairs: $O(n^2)$

### Divide and Conquer Approach

**Key insight:** Inversions come in three types:
1. Both elements in left half
2. Both elements in right half
3. One in each half (**split inversions**)

**Algorithm:**
```
CountInversions(A):
    if |A| = 1: return 0

    Split A into L and R
    (L', countL) = CountInversions(L)
    (R', countR) = CountInversions(R)
    (A', countSplit) = MergeAndCount(L', R')

    return countL + countR + countSplit
```

**MergeAndCount:** During merge, when we take from right array, count remaining elements in left array (all form inversions).

$$T(n) = 2T(n/2) + O(n) = O(n \log n)$$

---

## Master Theorem

For recurrences of the form $T(n) = aT(n/b) + f(n)$ where $a \geq 1$, $b > 1$:

Let $c_{\text{crit}} = \log_b a$

**Case 1:** If $f(n) = O(n^c)$ where $c < c_{\text{crit}}$, then $T(n) = \Theta(n^{c_{\text{crit}}})$

**Case 2:** If $f(n) = \Theta(n^{c_{\text{crit}}} \log^k n)$, then $T(n) = \Theta(n^{c_{\text{crit}}} \log^{k+1} n)$

**Case 3:** If $f(n) = \Omega(n^c)$ where $c > c_{\text{crit}}$, and $af(n/b) \leq kf(n)$ for some $k < 1$, then $T(n) = \Theta(f(n))$

### Intuition

Compare $f(n)$ (combine work) to $n^{c_{\text{crit}}}$ (recursive work):
- **Case 1:** Recursion dominates → total is $\Theta(n^{c_{\text{crit}}})$
- **Case 2:** Equal work at each level → multiply by $\log n$
- **Case 3:** Combine dominates → total is $\Theta(f(n))$

### Examples

| Recurrence | $a$ | $b$ | $c_{\text{crit}}$ | $f(n)$ | Case | $T(n)$ |
|------------|-----|-----|-------------------|--------|------|--------|
| $T(n) = 2T(n/2) + n$ | 2 | 2 | 1 | $n$ | 2 | $\Theta(n \log n)$ |
| $T(n) = 4T(n/2) + n$ | 4 | 2 | 2 | $n$ | 1 | $\Theta(n^2)$ |
| $T(n) = 4T(n/2) + n^3$ | 4 | 2 | 2 | $n^3$ | 3 | $\Theta(n^3)$ |
| $T(n) = 3T(n/2) + n$ | 3 | 2 | $\log_2 3$ | $n$ | 1 | $\Theta(n^{\log_2 3})$ |

---

## Closest Pair in $\mathbb{R}^2$

### Problem Definition

Given $n$ points in the plane, find the pair with minimum Euclidean distance.

**Brute force:** $O(n^2)$

### Algorithm

```
ClosestPair(P):
    Sort P by x-coordinate → Px
    Sort P by y-coordinate → Py
    return ClosestPairRec(Px, Py)

ClosestPairRec(Px, Py):
    if |Px| ≤ 3: return brute force

    Divide Px into left half Lx and right half Rx
    Construct Ly, Ry from Py (preserving y-order)

    δL = ClosestPairRec(Lx, Ly)
    δR = ClosestPairRec(Rx, Ry)
    δ = min(δL, δR)

    δS = ClosestSplitPair(Px, Py, δ)

    return min(δ, δS)
```

### The Key Insight: The $\delta$-Strip

For split pairs, both points must be within distance $\delta$ of the dividing line.

**Crucial lemma:** In the $\delta$-strip sorted by $y$-coordinate, we only need to check each point against the next 7 points.

**Why 7?** Partition the strip into $\delta \times \delta$ boxes. Each box contains at most one point (otherwise we'd have found a closer pair). A $2\delta \times \delta$ rectangle contains at most 8 points.

```
ClosestSplitPair(Px, Py, δ):
    x* = rightmost x-coordinate in left half
    S = points in Py with x ∈ [x* - δ, x* + δ]

    best = δ
    for i = 1 to |S|:
        for j = 1 to min(7, |S| - i):
            best = min(best, dist(S[i], S[i+j]))

    return best
```

### Running Time

$$T(n) = 2T(n/2) + O(n) = O(n \log n)$$

The initial sorting is $O(n \log n)$. Maintaining sorted order during recursion is $O(n)$ per level.

---

## Karatsuba's Algorithm (Integer Multiplication)

### Problem

Multiply two $n$-digit integers $x$ and $y$.

**Grade school:** $O(n^2)$ single-digit multiplications.

### Divide and Conquer Attempt

Write $x = 10^{n/2} \cdot a + b$ and $y = 10^{n/2} \cdot c + d$ where $a, b, c, d$ have $n/2$ digits.

$$xy = 10^n \cdot ac + 10^{n/2}(ad + bc) + bd$$

**Naive:** 4 recursive multiplications → $T(n) = 4T(n/2) + O(n) = O(n^2)$

### Karatsuba's Insight

Compute $ad + bc$ using only one multiplication:

$$(a + b)(c + d) = ac + ad + bc + bd$$

So: $ad + bc = (a+b)(c+d) - ac - bd$

**Algorithm:**
1. Compute $ac$ (one multiplication)
2. Compute $bd$ (one multiplication)
3. Compute $(a+b)(c+d)$ (one multiplication)
4. Compute $ad + bc = (a+b)(c+d) - ac - bd$ (subtraction)

$$T(n) = 3T(n/2) + O(n)$$

By Master Theorem (Case 1): $T(n) = O(n^{\log_2 3}) \approx O(n^{1.585})$

---

## Strassen's Algorithm (Matrix Multiplication)

### Problem

Multiply two $n \times n$ matrices $A$ and $B$.

**Standard:** $O(n^3)$ operations.

### Block Matrix Multiplication

Partition into $n/2 \times n/2$ submatrices:

$$\begin{pmatrix} C_{11} & C_{12} \\ C_{21} & C_{22} \end{pmatrix} = \begin{pmatrix} A_{11} & A_{12} \\ A_{21} & A_{22} \end{pmatrix} \begin{pmatrix} B_{11} & B_{12} \\ B_{21} & B_{22} \end{pmatrix}$$

**Naive:** 8 recursive multiplications → $T(n) = 8T(n/2) + O(n^2) = O(n^3)$

### Strassen's Insight

Reduce to 7 multiplications using clever linear combinations:

$$M_1 = (A_{11} + A_{22})(B_{11} + B_{22})$$
$$M_2 = (A_{21} + A_{22})B_{11}$$
$$M_3 = A_{11}(B_{12} - B_{22})$$
$$M_4 = A_{22}(B_{21} - B_{11})$$
$$M_5 = (A_{11} + A_{12})B_{22}$$
$$M_6 = (A_{21} - A_{11})(B_{11} + B_{12})$$
$$M_7 = (A_{12} - A_{22})(B_{21} + B_{22})$$

Then:
$$C_{11} = M_1 + M_4 - M_5 + M_7$$
$$C_{12} = M_3 + M_5$$
$$C_{21} = M_2 + M_4$$
$$C_{22} = M_1 - M_2 + M_3 + M_6$$

$$T(n) = 7T(n/2) + O(n^2) = O(n^{\log_2 7}) \approx O(n^{2.807})$$

---

## Median and Selection

### Problem

Given unsorted array $A$ of $n$ distinct elements, find the $k$-th smallest element.

**Special case:** Median when $k = \lceil n/2 \rceil$.

**Sorting:** $O(n \log n)$ — can we do better?

### QuickSelect (Randomized)

```
QuickSelect(A, k):
    if |A| = 1: return A[1]

    Choose pivot p uniformly at random
    Partition A into:
        L = elements < p
        R = elements > p

    if k ≤ |L|:
        return QuickSelect(L, k)
    else if k = |L| + 1:
        return p
    else:
        return QuickSelect(R, k - |L| - 1)
```

**Expected time:** $O(n)$

**Worst case:** $O(n^2)$ (bad pivot choices)

### Deterministic Selection (Median of Medians)

**Goal:** Find a pivot guaranteed to eliminate a constant fraction of elements.

```
Select(A, k):
    if |A| ≤ 5: sort and return k-th element

    Divide A into groups of 5
    Find median of each group
    p = Select(medians, ⌈|medians|/2⌉)  // Median of medians

    Partition A around p into L and R

    Recurse on appropriate side
```

### Analysis

**Key insight:** At least $3n/10$ elements are $\leq p$, and at least $3n/10$ elements are $\geq p$.

- About $n/5$ groups
- Half of groups have median $\leq p$
- Each such group contributes at least 3 elements $\leq p$

So $|L|, |R| \leq 7n/10$.

$$T(n) \leq T(n/5) + T(7n/10) + O(n)$$

**Claim:** $T(n) = O(n)$

**Proof:** Guess $T(n) \leq cn$ and verify:
$$T(n) \leq c \cdot n/5 + c \cdot 7n/10 + an = cn(1/5 + 7/10) + an = 0.9cn + an$$

For $c \geq 10a$: $T(n) \leq cn$ ✓

---

## Summary

| Problem | Algorithm | Time Complexity |
|---------|-----------|-----------------|
| Sorting | Merge Sort | $O(n \log n)$ |
| Counting Inversions | Modified Merge Sort | $O(n \log n)$ |
| Closest Pair | Divide by x-coord | $O(n \log n)$ |
| Integer Multiplication | Karatsuba | $O(n^{1.585})$ |
| Matrix Multiplication | Strassen | $O(n^{2.807})$ |
| Selection | Median of Medians | $O(n)$ |

**The power of divide and conquer:** Reducing the number of subproblems (Karatsuba: 4→3, Strassen: 8→7) yields asymptotic improvements.
