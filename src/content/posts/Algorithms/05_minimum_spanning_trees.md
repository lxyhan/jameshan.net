---
title: '5: Minimum Spanning Trees'
pubDate: '2025-12-12'
---

A **spanning tree** of a connected graph is a subgraph that:
1. Includes all vertices
2. Is a tree (connected and acyclic)
3. Uses only edges from the original graph

A **minimum spanning tree (MST)** is a spanning tree with the smallest possible total edge weight. Think of it as the cheapest way to connect all vertices.

---

## Why MSTs Matter

MSTs solve the problem: **connect everything at minimum total cost**.

Real-world examples:
- **Network design**: Connect all computers with minimum cable
- **Road construction**: Connect all cities with minimum road building
- **Clustering**: MST-based clustering finds natural groupings
- **Approximation algorithms**: MSTs help approximate harder problems (like Traveling Salesman)

---

## Key Properties

### Tree Facts

A tree with $n$ vertices has exactly $n-1$ edges. This is the minimum number of edges needed to connect $n$ vertices (and stay acyclic).

### The Cut Property

This is the key insight behind both MST algorithms:

> For any cut (partition of vertices into two groups), the minimum-weight edge crossing the cut is in some MST.

**Intuition**: If we have two groups of vertices that need to be connected, we should use the cheapest bridge between them.

### MST Uniqueness

If all edge weights are distinct, the MST is unique. If some edges have equal weights, there may be multiple MSTs with the same total weight.

---

## Prim's Algorithm

Prim's algorithm **grows the MST from a starting vertex**. At each step, it adds the cheapest edge that connects the current tree to a new vertex.

### The Algorithm

```
mst_prim(graph: Graph, start: Key) -> Optional[Graph]:
    # Result MST
    mst = Graph()
    in_mst = Dict()      # tracks vertices in MST
    parent = Dict()       # tracks how each vertex joins MST

    # Priority queue: (weight, vertex)
    pq = Queue()  # min-heap by priority

    # Start from given vertex
    pq.push(start, start, 0)
    parent.insert(start, None)

    while not pq.is_empty():
        node = pq.pop()
        current = node.key
        weight = node.pri

        # Skip if already in MST
        if in_mst.get(current) is not None:
            continue
        in_mst.insert(current, True)

        # Add vertex to MST
        mst.add_vertex(current, None)

        # Add edge to MST (if not the start vertex)
        if parent.get(current) is not None:
            prev = parent.get(current)
            mst.add_edge(None, prev, current, weight)

        # Add all edges to unvisited neighbors
        vertex = graph.get_vertex(current)
        for edge in vertex.out_edges:
            neighbor = edge.to.key
            if in_mst.get(neighbor) is None:
                parent.insert(neighbor, current)
                pq.push(neighbor, neighbor, edge.wgt)

    # Check if we got all vertices
    if len(mst.vertices) != len(graph.vertices):
        return None  # Graph not connected

    return mst
```

### Trace Example

```
        B
       /|\
     (4) | (2)
     /   |   \
    A   (3)   D
     \   |   /
     (1) | (5)
       \|/
        C
```

Starting from A:

**Step 1:** Extract A (weight 0)
- Add A to MST
- Enqueue: B (weight 4), C (weight 1)

**Step 2:** Extract C (weight 1)
- Add C to MST, add edge A-C (weight 1)
- Enqueue: B (weight 3), D (weight 5)
- pq now has: [(B,3), (B,4), (D,5)]

**Step 3:** Extract B (weight 3, via C)
- Add B to MST, add edge C-B (weight 3)
- Enqueue: D (weight 2)
- pq now has: [(D,2), (B,4), (D,5)]

**Step 4:** Extract D (weight 2, via B)
- Add D to MST, add edge B-D (weight 2)
- No new neighbors

**MST edges:** A-C (1), C-B (3), B-D (2)
**Total weight:** 6

### Why Prim's Works

At each step, we add the cheapest edge connecting the "MST so far" to a new vertex. By the cut property, this edge must be in some MST.

Since we always make the locally optimal choice and that choice is globally correct (cut property), we end up with an MST.

### Runtime

**Time: $O((V + E) \log V)$** with a binary heap
- Each vertex extracted once: $O(V \log V)$
- Each edge may cause one insertion: $O(E \log V)$

**Space: $O(V)$** for the priority queue and tracking structures.

---

## Kruskal's Algorithm

Kruskal's algorithm takes a different approach: **sort all edges by weight and add them one by one**, skipping any edge that would create a cycle.

### The Algorithm

```
mst_kruskal(graph: Graph) -> Optional[Graph]:
    mst = Graph()
    uf = UnionFind()

    # Initialize: each vertex in its own set
    for key in graph.vertices.keys():
        mst.add_vertex(key, None)
        uf.make_set(key)

    # Get all edges and sort by weight
    edges = get_all_edges(graph)
    sort_by_weight(edges)  # ascending order

    edges_added = 0

    for edge in edges:
        u = edge.from.key
        v = edge.to.key

        # Check if u and v are in different components
        if uf.find(u) != uf.find(v):
            # Add edge to MST
            mst.add_edge(edge.key, u, v, edge.wgt)
            uf.union(u, v)
            edges_added += 1

            # MST complete when we have V-1 edges
            if edges_added == len(graph.vertices) - 1:
                break

    if edges_added != len(graph.vertices) - 1:
        return None  # Graph not connected

    return mst
```

### Trace Example

Same graph:
```
        B
       /|\
     (4) | (2)
     /   |   \
    A   (3)   D
     \   |   /
     (1) | (5)
       \|/
        C
```

**Sorted edges:** A-C(1), B-D(2), B-C(3), A-B(4), C-D(5)

**Step 1:** Consider A-C (weight 1)
- A and C in different sets: add edge
- Union A and C
- MST edges: {A-C}

**Step 2:** Consider B-D (weight 2)
- B and D in different sets: add edge
- Union B and D
- MST edges: {A-C, B-D}

**Step 3:** Consider B-C (weight 3)
- B and C in different sets: add edge
- Union (merges all into one set)
- MST edges: {A-C, B-D, B-C}

**Step 4:** We have V-1 = 3 edges. Done!

(A-B and C-D would create cycles, so we'd skip them if we continued.)

**Total weight:** 1 + 2 + 3 = 6 (same as Prim's)

### Why Kruskal's Works

By processing edges in weight order, we always add the cheapest edge that doesn't create a cycle. This edge connects two different components—and by the cut property, the minimum edge between any two components belongs in some MST.

### Runtime

**Time: $O(E \log E)$** or equivalently $O(E \log V)$
- Sorting edges: $O(E \log E)$
- Union-Find operations: nearly $O(E)$ with path compression and union by rank

Since $E \leq V^2$, we have $\log E \leq 2 \log V$, so $O(E \log E) = O(E \log V)$.

**Space: $O(V + E)$** for storing edges and the Union-Find structure.

---

## Prim's vs Kruskal's

| | Prim's | Kruskal's |
|--|--------|-----------|
| Approach | Grow from vertex | Add edges globally |
| Data structure | Priority queue | Union-Find |
| Runtime | $O((V+E) \log V)$ | $O(E \log E)$ |
| Better for | Dense graphs | Sparse graphs |
| Requires | Starting vertex | All edges sorted |

**Prim's** is like Dijkstra—expand from a source. It's slightly better for dense graphs.

**Kruskal's** considers edges globally. It's often preferred because:
- Conceptually simpler
- Doesn't need a starting vertex
- Naturally parallelizable (sort, then process)

Both produce valid MSTs. If edge weights are unique, they produce the same tree.

---

## The Union-Find Connection

Kruskal's algorithm needs to efficiently answer: "Are these two vertices in the same component?"

This is exactly what Union-Find does. Without it, Kruskal's would be $O(E \cdot V)$ (checking connectivity for each edge). With Union-Find, those checks are nearly $O(1)$.

The next article covers Union-Find in detail.

---

## MST Properties to Remember

1. **$V-1$ edges**: Any spanning tree of $V$ vertices has exactly $V-1$ edges.

2. **Cut property**: The minimum edge across any cut is in the MST.

3. **Cycle property**: The maximum edge in any cycle is NOT in the MST.

4. **Uniqueness**: Unique if all weights are distinct.

5. **Path optimality**: In an MST, the path between any two vertices minimizes the maximum edge weight (minimax path property).

---

## When MST ≠ Shortest Path

MST and shortest paths solve different problems:

```
    A ──(1)── B ──(1)── C
    └────────(3)────────┘
```

- **MST**: {A-B, B-C} with total weight 2
- **Shortest A to C**: Direct edge with weight 3

The MST uses A-B-C (total weight 2), but the shortest path from A to C is the direct edge (weight 3, but only 1 hop).

MST minimizes **total weight to connect everything**.
Shortest paths minimize **weight to reach specific destinations**.

---

## The Intuition to Remember

Both MST algorithms are **greedy**, and both are **correct** because of the cut property.

**Prim's**: "What's the cheapest edge to extend my current tree?"
**Kruskal's**: "What's the cheapest edge that connects two different pieces?"

Both questions have the same answer: the minimum edge across some cut. And that edge always belongs in the MST.
