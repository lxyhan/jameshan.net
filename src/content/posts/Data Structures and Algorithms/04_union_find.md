---
title: '4: Union-Find'
pubDate: '2025-12-12'
---

Union-Find tracks **disjoint sets** with two operations:
- **Find**: Which set contains this element? (Returns the root/representative)
- **Union**: Merge two sets

With path compression and union by rank, both operations are $O(\alpha(n)) \approx O(1)$.

---

## Data Structure

```python
UnifNode:
  - key: Key
  - parent: Optional[UnifNode]  # None if root
  - rank: Integer

UnionFind:
  - nodes: Dictionary[Key, UnifNode]
  - make_set(key) -> UnifNode
  - find(key) -> Optional[UnifNode]
  - union(x, y) -> UnifNode
```

Each set is a tree. Elements point to parents. The **root** is the set's representative.

---

## Operations

### Make Set

```python
make_set(key):
    node = UnifNode(key)
    node.parent = None
    node.rank = 0
    nodes.insert(key, node)
    return node
```

### Find (with Path Compression)

```python
find(key):
    node = nodes.get(key)
    if node.parent is None:
        return node
    node.parent = find(node.parent.key)  # compress path
    return node.parent
```

Path compression flattens the tree: after find, all nodes on the path point directly to the root.

### Union (by Rank)

```python
union(x, y):
    root_x = find(x)
    root_y = find(y)

    if root_x == root_y:
        return root_x

    # Attach smaller tree under larger
    if root_x.rank < root_y.rank:
        root_x.parent = root_y
        return root_y
    else if root_x.rank > root_y.rank:
        root_y.parent = root_x
        return root_x
    else:
        root_y.parent = root_x
        root_x.rank += 1
        return root_x
```

---

## Why O(α(n))?

**Union by rank**: Trees stay balanced. To get rank $k$, need $\geq 2^k$ elements. Height is $O(\log n)$.

**Path compression**: After any find, the entire path is flattened.

Together: amortized $O(\alpha(n))$ where $\alpha$ is inverse Ackermann. $\alpha(n) \leq 4$ for all practical $n$.

---

## Application: Kruskal's MST

```python
kruskal(graph):
    uf = UnionFind()
    for v in graph.vertices:
        uf.make_set(v)

    for edge in sort_by_weight(edges):
        if uf.find(edge.u) != uf.find(edge.v):
            add edge to MST
            uf.union(edge.u, edge.v)
```

Without Union-Find: $O(EV)$ for connectivity checks.
With Union-Find: $O(E \cdot \alpha(V)) \approx O(E)$.

---

## Runtime Summary

| Operation | Time |
|-----------|------|
| make_set | $O(1)$ |
| find | $O(\alpha(n))$ amortized |
| union | $O(\alpha(n))$ amortized |

**Limitation**: No efficient deletion (no "un-union").
