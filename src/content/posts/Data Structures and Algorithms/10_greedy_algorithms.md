---
title: '10: Greedy Algorithms'
pubDate: '2025-01-26'
---

Greedy algorithms build solutions incrementally, making locally optimal choices at each step. The challenge: proving these myopic decisions lead to globally optimal solutions.

---

## The Greedy Paradigm

**Goal:** Find a solution $x$ that maximizes/minimizes an objective function $f$.

**Challenge:** The space of possible solutions is exponentially large.

**Insight:** The solution $x$ is composed of several parts (e.g., $x$ is a set or sequence).

**Approach:**
1. Compute $x$ one part at a time
2. Select the next part "greedily" for immediate benefit
3. Prove this yields an optimal solution despite no foresight

Greedy algorithms typically run in polynomial time. The hard part is proving optimality.

---

## Interval Scheduling

### Problem Definition

- Job $j$ starts at time $s_j$ and finishes at time $f_j$
- Two jobs $i$ and $j$ are **compatible** if $[s_i, f_i)$ and $[s_j, f_j)$ don't overlap
- **Goal:** Find maximum-size subset of mutually compatible jobs

### Greedy Template

Consider jobs in some "natural" order. Take a job if it's compatible with those already chosen.

**Possible orderings:**
- **Earliest start time:** ascending order of $s_j$
- **Earliest finish time:** ascending order of $f_j$
- **Shortest interval:** ascending order of $f_j - s_j$
- **Fewest conflicts:** ascending order of $c_j$ (number of conflicting jobs)

Only **earliest finish time (EFT)** works. The others have counterexamples:
- Earliest start time fails when one long job starts first
- Shortest interval fails when a short job blocks two longer compatible jobs
- Fewest conflicts fails in certain symmetric configurations

### Algorithm: Earliest Finish Time (EFT)

```
Sort jobs by finish time: f_1 ≤ f_2 ≤ ... ≤ f_n
S ← ∅
for j = 1 to n:
    if job j is compatible with S:
        S ← S ∪ {j}
return S
```

**Running time:** $O(n \log n)$

- Sorting: $O(n \log n)$
- Compatibility check: $O(1)$ per job (just check if $s_j \geq f_{i^*}$ where $i^*$ is the last added job)

### Proof of Optimality by Contradiction

1. Suppose greedy is not optimal
2. Let greedy select jobs $i_1, i_2, \ldots, i_k$ (sorted by finish time)
3. Consider an optimal solution $j_1, j_2, \ldots, j_m$ that matches greedy for as many indices as possible
   - $j_1 = i_1, \ldots, j_r = i_r$ for the greatest possible $r$
4. Both $i_{r+1}$ and $j_{r+1}$ are compatible with the previous selection
5. Since greedy chose $i_{r+1}$ by EFT: $f_{i_{r+1}} \leq f_{j_{r+1}}$
6. Replace $j_{r+1}$ with $i_{r+1}$ in the optimal solution:
   - Still feasible: $f_{i_{r+1}} \leq f_{j_{r+1}} \leq s_{j_t}$ for $t \geq r+2$
   - Still optimal: same number of jobs
   - But matches greedy for $r+1$ indices — contradiction!

### Proof of Optimality by Induction

Let $S_j$ be the subset picked by greedy after considering the first $j$ jobs.

**Definition:** $S_j$ is *promising* if $\exists T \subseteq \{j+1, \ldots, n\}$ such that $O_j = S_j \cup T$ is optimal.

**Claim:** For all $t \in \{0, 1, \ldots, n\}$, $S_t$ is promising.

**Base case:** $S_0 = \emptyset$ is promising (any optimal solution extends it).

**Induction step:** Assume $S_{j-1}$ is promising with optimal extension $O_{j-1}$.

*Case 1:* Greedy didn't select job $j$ (conflicts with $S_{j-1}$)
- Since $S_{j-1} \subseteq O_{j-1}$, job $j$ also conflicts with $O_{j-1}$
- So $O_j = O_{j-1}$ also extends $S_j = S_{j-1}$

*Case 2:* Greedy selected job $j$, so $S_j = S_{j-1} \cup \{j\}$
- Let $r$ be the earliest job in $O_{j-1} \setminus S_{j-1}$
- Replace $r$ with $j$ in $O_{j-1}$ to get $O_j$
- $O_j$ is still feasible (since $f_j \leq f_r$) and optimal
- $O_j$ extends $S_j$ ∎

---

## Interval Partitioning

### Problem Definition

- Job $j$ starts at time $s_j$ and finishes at time $f_j$
- **Goal:** Partition jobs into fewest groups such that jobs in each group are mutually compatible

Think of scheduling lectures into classrooms.

### Algorithm: Earliest Start Time (EST)

```
Sort lectures by start time: s_1 ≤ s_2 ≤ ... ≤ s_n
d ← 0  (number of classrooms)

for j = 1 to n:
    if lecture j is compatible with some classroom k:
        Schedule lecture j in classroom k
    else:
        Allocate new classroom d+1
        Schedule lecture j in classroom d+1
        d ← d + 1

return schedule
```

**Implementation with priority queue:**
- Store classrooms in a min-heap keyed by latest finish time
- Check if $s_j \geq$ minimum key
- $O(n)$ priority queue operations → $O(n \log n)$ time

### Proof of Optimality

**Definition:** The **depth** is the maximum number of lectures running at any time.

**Lower bound:** $\text{\#classrooms needed} \geq \text{depth}$

**Claim:** Greedy uses exactly depth classrooms.

**Proof:**
- Let $d$ = number of classrooms used by greedy
- Classroom $d$ was opened because lecture $j$ conflicted with all $d-1$ existing classrooms
- All $d$ lectures end after $s_j$
- Since we sorted by start time, they all start at or before $s_j$
- At time $s_j$, we have $d$ mutually overlapping lectures
- Therefore, $\text{depth} \geq d$ ∎

Since $\text{\#classrooms} \geq \text{depth} \geq d$, greedy is optimal.

---

## Minimizing Lateness

### Problem Definition

- Single machine processes jobs
- Job $j$ requires $t_j$ time and is due at $d_j$
- If scheduled at $s_j$, finishes at $f_j = s_j + t_j$
- **Lateness:** $\ell_j = \max(0, f_j - d_j)$
- **Goal:** Minimize maximum lateness $L = \max_j \ell_j$

### Algorithm: Earliest Deadline First (EDF)

```
Sort jobs by deadline: d_1 ≤ d_2 ≤ ... ≤ d_n
t ← 0

for j = 1 to n:
    Assign job j to interval [t, t + t_j]
    s_j ← t
    f_j ← t + t_j
    t ← t + t_j

return intervals
```

**Counterexamples for other orderings:**

*Shortest processing time first:*
| Job | $t_j$ | $d_j$ |
|-----|-------|-------|
| 1   | 1     | 100   |
| 2   | 10    | 10    |

Processing job 1 first delays job 2 unnecessarily.

*Smallest slack first:*
| Job | $t_j$ | $d_j$ |
|-----|-------|-------|
| 1   | 1     | 2     |
| 2   | 10    | 10    |

Slack $(d_j - t_j)$: job 1 has slack 1, job 2 has slack 0. But doing job 2 first causes lateness.

### Proof of Optimality

**Key observations:**

1. There is an optimal schedule with no idle time
2. EDF has no idle time
3. An **inversion** is a pair $(i,j)$ where $d_i < d_j$ but $j$ is scheduled before $i$
4. EDF has no inversions
5. If a schedule has inversions, it has an **adjacent** inverted pair

**Lemma:** Swapping adjacent inverted jobs doesn't increase lateness but reduces inversions by 1.

**Proof:**
- Let $\ell_k$ and $\ell_k'$ denote lateness before and after swap
- For $k \neq i,j$: $\ell_k = \ell_k'$ (finish times unchanged)
- For job $i$: $\ell_i' \leq \ell_i$ (moved earlier)
- For job $j$:
$$\ell_j' = f_j' - d_j = f_i - d_j \leq f_i - d_i = \ell_i$$
  (using $d_j \geq d_i$ from the inversion)
- Therefore:
$$L' = \max\{\ell_i', \ell_j', \max_{k \neq i,j} \ell_k'\} \leq \max\{\ell_i, \ell_i, \max_{k \neq i,j} \ell_k\} \leq L$$

**Proof by contradiction:**
1. Suppose EDF is not optimal
2. Take optimal schedule $S^*$ with fewest inversions (no idle time WLOG)
3. Since EDF is not optimal, $S^*$ has at least one inversion
4. By observation 5, it has an adjacent inversion
5. Swapping maintains optimality but reduces inversions — contradiction! ∎

**Proof by reverse induction:**

**Claim:** For each $r \in \{0, 1, \ldots, \binom{n}{2}\}$, there exists an optimal schedule with at most $r$ inversions.

- Base case $r = \binom{n}{2}$: trivial
- Induction: If claim holds for $r = t+1$, take optimal with $\leq t+1$ inversions
  - If $\leq t$ inversions, done
  - If exactly $t+1 \geq 1$ inversions, swap adjacent inverted pair → $t$ inversions
- Claim for $r = 0$ proves EDF optimality ∎

---

## Huffman Coding (Lossless Compression)

### Problem Definition

- Document uses $n$ distinct symbols with frequencies $(w_1, \ldots, w_n)$
- Naive encoding: $\lceil \log n \rceil$ bits per symbol
- **Goal:** Find prefix-free encoding minimizing $\sum_{i=1}^{n} w_i \cdot \ell_i$

**Prefix-free encoding:** No codeword is a prefix of another. This enables unambiguous decoding.

**Key insight:** Prefix-free encodings correspond to binary trees where symbols are leaves.

### Huffman's Algorithm

```
Build priority queue with (symbol, frequency) pairs

while |queue| ≥ 2:
    (x, w_x) ← extract-min(queue)
    (y, w_y) ← extract-min(queue)
    Create new node z with children x and y
    Insert (z, w_x + w_y) into queue

return tree
```

**Running time:** $O(n \log n)$

Can be made $O(n)$ if symbols are pre-sorted by frequency (using two queues).

### Example

Frequencies: $(w_a, w_b, w_c, w_d, w_e, w_f) = (42, 20, 5, 10, 11, 12)$

**Steps:**
1. Merge $c$ (5) and $d$ (10) → node with weight 15
2. Merge $e$ (11) and $f$ (12) → node with weight 23
3. Merge 15 and $b$ (20) → node with weight 35
4. Merge 23 and 35 → node with weight 58
5. Merge $a$ (42) and 58 → root with weight 100

**Result:**
- $a \to 0$
- $e \to 100$
- $f \to 101$
- $c \to 1100$
- $d \to 1101$
- $b \to 111$

Higher frequency symbols get shorter codes.

### Proof of Optimality

**Induction on number of symbols $n$.**

**Base case:** $n = 2$. Both 1-bit encodings are optimal.

**Lemma 1:** If $w_x < w_y$, then $\ell_x \geq \ell_y$ in any optimal tree.

*Proof:* If $w_x < w_y$ and $\ell_x < \ell_y$, swapping reduces total length:
$$w_x \cdot \ell_y + w_y \cdot \ell_x < w_x \cdot \ell_x + w_y \cdot \ell_y$$

**Lemma 2:** There exists an optimal tree where the two lowest-frequency symbols $x$ and $y$ are siblings.

*Proof:*
1. Take any optimal tree
2. If $x$ doesn't have longest encoding, swap with one that does (no cost increase by Lemma 1)
3. $x$ must have a sibling (otherwise, could shorten its code)
4. If sibling isn't $y$, swap with $y$ (no cost increase)

**Induction step:**
- Let $x, y$ be the two lowest-frequency symbols Huffman merges into $xy$
- Let $H$ be Huffman's tree, $T$ be optimal tree where $x, y$ are siblings
- Let $H'$ and $T'$ treat $xy$ as one symbol with weight $w_x + w_y$
- By induction: $\text{Length}(H') \leq \text{Length}(T')$
- $\text{Length}(H) = \text{Length}(H') + (w_x + w_y) \cdot 1$
- $\text{Length}(T) = \text{Length}(T') + (w_x + w_y) \cdot 1$
- Therefore $\text{Length}(H) \leq \text{Length}(T)$ ∎

---

## Summary of Proof Techniques

| Problem | Algorithm | Proof Technique |
|---------|-----------|-----------------|
| Interval Scheduling | Earliest Finish Time | Contradiction/Induction (exchange argument) |
| Interval Partitioning | Earliest Start Time | Lower bound matching |
| Minimizing Lateness | Earliest Deadline First | Inversion counting |
| Huffman Coding | Merge lowest frequencies | Induction on problem size |

**Common pattern:** Show that any optimal solution can be transformed into the greedy solution without increasing cost.

---

## Other Classic Greedy Algorithms

- **Dijkstra's algorithm:** Single-source shortest paths
- **Kruskal's algorithm:** Minimum spanning tree (sort edges, add if no cycle)
- **Prim's algorithm:** Minimum spanning tree (grow tree from source)
