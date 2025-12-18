---
title: '3: Minimum Spanning Trees'
pubDate: '2025-12-12'
---

A **spanning tree** of a connected graph includes all vertices with exactly $V-1$ edges (minimum to connect, no cycles). A **minimum spanning tree (MST)** minimizes total edge weight.

---

## Cut Property

> The minimum-weight edge crossing any cut belongs to some MST.

Both Prim's and Kruskal's are greedy algorithms that exploit this property.

---

## Prim's Algorithm

**Idea**: Grow MST from a starting vertex. Always add the cheapest edge connecting the tree to a new vertex.

```python
mst_prim(graph, start):
    in_mst = Dict()
    parent = Dict()
    pq = Queue()  # min-heap by edge weight

    pq.push(start, start, 0)
    parent.insert(start, None)

    while not pq.is_empty():
        node = pq.pop()
        current = node.key
        weight = node.pri

        if in_mst.get(current) is not None:
            continue
        in_mst.insert(current, True)

        # Add edge (parent[current], current) to MST

        for edge in graph.get_vertex(current).out_edges:
            neighbor = edge.to.key
            if in_mst.get(neighbor) is None:
                parent.insert(neighbor, current)
                pq.push(neighbor, neighbor, edge.wgt)

    return MST
```

**Runtime**: $O((V + E) \log V)$ — same structure as CFS.

---

## Kruskal's Algorithm

**Idea**: Sort all edges by weight. Add edges in order, skipping any that would create a cycle.

```python
mst_kruskal(graph):
    uf = UnionFind()
    mst_edges = []

    for v in graph.vertices:
        uf.make_set(v)

    edges = sort_by_weight(all_edges(graph))

    for edge in edges:
        u, v = edge.from.key, edge.to.key

        if uf.find(u) != uf.find(v):
            mst_edges.append(edge)
            uf.union(u, v)

            if len(mst_edges) == V - 1:
                break

    return mst_edges
```

**Runtime**: $O(E \log E)$ — dominated by sorting. Union-Find operations are $O(\alpha(n)) \approx O(1)$.

---

## Comparison

| | Prim's | Kruskal's |
|--|--------|-----------|
| Approach | Grow from vertex | Global edge selection |
| Data structure | Priority queue | Union-Find |
| Runtime | $O((V+E) \log V)$ | $O(E \log E)$ |

Both produce valid MSTs. Same tree if edge weights are unique.

---

## Key Properties

1. **$V-1$ edges**: Any spanning tree has exactly $V-1$ edges
2. **Cut property**: Min edge across any cut is in MST
3. **Cycle property**: Max edge in any cycle is NOT in MST
4. **Uniqueness**: Unique if all weights are distinct

---

## MST ≠ Shortest Paths

MST minimizes **total weight** to connect all vertices.

Shortest path minimizes weight **to a specific destination**.
