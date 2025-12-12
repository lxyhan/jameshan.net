---
title: '4: Weighted Shortest Paths'
pubDate: '2025-12-12'
---

BFS finds shortest paths when all edges have equal weight. But what if edges have different costs? A direct flight might be faster than two connecting flights, even though it's "one hop" vs "two hops."

This is where **weighted shortest path** algorithms come in. The most important one is **Dijkstra's algorithm**, also known as **Cheapest-First Search (CFS)**.

---

## Why BFS Fails on Weighted Graphs

Consider this graph, finding the shortest path from A to C:

```
    A ──(10)──> C
    │
   (1)
    │
    v
    B ──(1)───> C
```

BFS would find A → C first (distance 1 hop). But that path has weight 10. The path A → B → C has weight 2, which is much cheaper.

BFS doesn't account for edge weights—it only counts hops. We need an algorithm that considers the **total cost** to reach each vertex.

---

## The Key Insight

Here's the fundamental observation that makes Dijkstra's algorithm work:

> **If all edge weights are non-negative, the unvisited vertex with the smallest known distance is guaranteed to have its final shortest distance.**

Why? Because any other path to that vertex would have to go through some other unvisited vertex first—and that would only add more weight (since weights are non-negative).

This means we can **greedily** process vertices in order of their distance from the source. Once we process a vertex, we're done with it.

---

## Dijkstra's Algorithm (Cheapest-First Search)

```
cfs(graph: Graph, source: Key, goals: List[Key]) -> Optional[Path]:
    # Distance from source to each vertex (infinity initially)
    dist = Dict()
    parent = Dict()
    visited = Dict()

    # Priority queue: (distance, vertex)
    pq = Queue()  # min-heap by priority

    # Initialize source
    dist.insert(source, 0)
    parent.insert(source, None)
    pq.push(source, source, 0)  # key, val, priority

    while not pq.is_empty():
        node = pq.pop()
        current = node.key
        current_dist = node.pri

        # Skip if already processed
        if visited.get(current) is not None:
            continue
        visited.insert(current, True)

        # Goal check
        if current in goals:
            return reconstruct_path(parent, source, current)

        # Relax edges
        vertex = graph.get_vertex(current)
        for edge in vertex.out_edges:
            neighbor = edge.to.key
            new_dist = current_dist + edge.wgt

            old_dist = dist.get(neighbor)
            if old_dist is None or new_dist < old_dist:
                dist.insert(neighbor, new_dist)
                parent.insert(neighbor, current)
                pq.push(neighbor, neighbor, new_dist)

    return None
```

### The Core Steps

1. **Initialize**: Source has distance 0, everything else has distance ∞
2. **Extract minimum**: Get the unvisited vertex with smallest distance
3. **Mark visited**: This vertex's distance is now final
4. **Relax edges**: For each neighbor, check if going through current vertex gives a shorter path
5. **Repeat** until we reach the goal or exhaust all vertices

---

## Tracing Through an Example

```
        B
       /|\
     (2) | (3)
     /   |   \
    A   (1)   D
     \   |   /
     (6) | (1)
       \|/
        C
```

Finding shortest path from A to D:

**Initial state:**
- dist: {A: 0}
- pq: [(A, 0)]

**Step 1:** Extract A (dist 0)
- Relax A→B: dist[B] = 0 + 2 = 2
- Relax A→C: dist[C] = 0 + 6 = 6
- pq: [(B, 2), (C, 6)]

**Step 2:** Extract B (dist 2)
- Relax B→C: 2 + 1 = 3 < 6, update dist[C] = 3
- Relax B→D: dist[D] = 2 + 3 = 5
- pq: [(C, 3), (D, 5), (C, 6)]  ← Note: C appears twice!

**Step 3:** Extract C (dist 3)
- Relax C→D: 3 + 1 = 4 < 5, update dist[D] = 4
- pq: [(D, 4), (D, 5), (C, 6)]

**Step 4:** Extract D (dist 4) — **Goal found!**
- Path: D ← C ← B ← A
- Total weight: 4

**Note:** The priority queue may contain duplicate entries for a vertex (with outdated distances). We handle this by checking if a vertex is already visited before processing.

---

## Why It Works: The Greedy Choice

The correctness of Dijkstra hinges on this property:

> When we extract a vertex $u$ from the priority queue, `dist[u]` is the true shortest distance from source to $u$.

**Intuition**: At the moment we extract $u$, it has the smallest distance among all unvisited vertices. Could there be a shorter path to $u$ that we haven't discovered yet?

That hypothetical shorter path would have to:
1. Start from source
2. Go through some other unvisited vertex $v$
3. Eventually reach $u$

But $v$ has distance ≥ dist[$u$] (since $u$ was extracted first). And the path from $v$ to $u$ adds non-negative weight. So the total would be ≥ dist[$u$].

Therefore, no shorter path exists. We've found the optimum.

**This argument fails if edges can be negative!** With negative edges, going through $v$ might actually decrease the total distance. That's why Dijkstra requires non-negative weights.

---

## Runtime Analysis

Let $V$ = number of vertices, $E$ = number of edges.

### With a Binary Heap

**Time: $O((V + E) \log V)$**

- Each vertex is extracted from the priority queue at most once: $O(V \log V)$
- Each edge causes at most one insertion to the priority queue: $O(E \log V)$
- Total: $O((V + E) \log V)$

For sparse graphs ($E \approx V$), this is $O(V \log V)$.
For dense graphs ($E \approx V^2$), this is $O(V^2 \log V)$.

**Space: $O(V)$** for dist, parent, visited, and the priority queue.

### With Different Priority Queues

| Priority Queue | Extract-Min | Decrease-Key | Overall |
|----------------|-------------|--------------|---------|
| Binary Heap | $O(\log V)$ | $O(\log V)$ | $O((V+E) \log V)$ |
| Fibonacci Heap | $O(\log V)$ | $O(1)$ amortized | $O(V \log V + E)$ |
| Array (naive) | $O(V)$ | $O(1)$ | $O(V^2)$ |

For dense graphs, the naive array approach ($O(V^2)$) can actually beat the heap approach ($O(V^2 \log V)$).

---

## Comparison: BFS vs Dijkstra

| | BFS | Dijkstra |
|--|-----|----------|
| Edge weights | All equal (or 1) | Non-negative |
| Data structure | Queue (FIFO) | Priority Queue (min-heap) |
| Runtime | $O(V + E)$ | $O((V+E) \log V)$ |
| Guarantee | Shortest path (unweighted) | Shortest path (weighted) |

BFS is a special case of Dijkstra where all edges have weight 1. The priority queue degenerates to a regular queue because all priorities are sequential.

---

## Negative Edges: Why Dijkstra Fails

Consider:

```
    A ──(1)──> B ──(-5)──> C
    │                      ^
    └────────(2)───────────┘
```

Dijkstra might process:
1. Extract A (dist 0), set dist[B] = 1, dist[C] = 2
2. Extract B (dist 1), set dist[C] = 1 + (-5) = -4
3. But wait—C was already "finalized" at dist 2!

The greedy assumption ("smallest distance vertex is final") breaks with negative edges. For graphs with negative edges (but no negative cycles), use **Bellman-Ford** algorithm: $O(VE)$.

---

## Variations and Extensions

### Single-Source Shortest Paths

Run Dijkstra once to find shortest paths from one source to all vertices. Just remove the goal check and run until the priority queue is empty.

### All-Pairs Shortest Paths

Run Dijkstra from every vertex: $O(V(V+E) \log V)$.

Or use **Floyd-Warshall**: $O(V^3)$ with a simpler implementation, better for dense graphs.

### A* Search

Dijkstra explores in order of distance from source. **A*** adds a heuristic estimate of distance to goal:

```
priority = dist_from_source + estimated_dist_to_goal
```

If the heuristic is "admissible" (never overestimates), A* finds optimal paths while often exploring fewer vertices than Dijkstra.

### Bidirectional Dijkstra

Run Dijkstra from both source and goal simultaneously. Stop when the searches meet. Can be much faster in practice.

---

## Common Mistakes

### Forgetting to Check Visited

```python
# Wrong: processes same vertex multiple times
node = pq.pop()
process(node)

# Right: skip already-processed vertices
node = pq.pop()
if visited[node]: continue
visited[node] = True
process(node)
```

### Using with Negative Weights

Dijkstra assumes non-negative weights. Negative edges break the greedy invariant. Use Bellman-Ford instead.

### Confusing "Distance" and "Hops"

Distance = sum of edge weights.
Hops = number of edges.

Dijkstra minimizes distance. BFS minimizes hops.

---

## The Intuition to Remember

Dijkstra is **greedy expansion by total cost**. At each step, it finalizes the cheapest reachable vertex because no cheaper path to it can exist (with non-negative edges).

The priority queue maintains "frontier" vertices sorted by their current best distance. This is exactly BFS, but with "cost" instead of "hops."

**When you see "shortest path" and "weighted graph" (non-negative), think Dijkstra.**
