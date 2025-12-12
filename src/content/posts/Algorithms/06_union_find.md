---
title: '6: Union-Find'
pubDate: '2025-12-12'
---

Union-Find (also called Disjoint Set Union or DSU) is a data structure that tracks a collection of **disjoint sets**. It supports two operations:
- **Find**: Which set does this element belong to?
- **Union**: Merge two sets into one.

What makes Union-Find remarkable is that with two simple optimizations, these operations become nearly constant time—fast enough to make Kruskal's MST algorithm efficient.

---

## The Problem

Imagine tracking connected components in a graph as edges are added:
- Initially, each vertex is its own component
- Each edge merges two components (if they're different)
- We need to quickly check: "Are these two vertices in the same component?"

This is exactly what Union-Find does. It's the perfect data structure for **dynamic connectivity**.

---

## The Data Structure

```
UnifNode:
  - key: Key                    # identifier for this element
  - parent: Optional[UnifNode]  # parent in the tree (None if root)
  - rank: Integer               # used for union by rank

UnionFind:
  - nodes: Dictionary[Key, UnifNode]

  # Operations:
  - make_set(key) -> UnifNode   # create a new singleton set
  - find(key) -> UnifNode       # return the root (representative) of key's set
  - union(x, y) -> UnifNode     # merge the sets containing x and y
```

### The Representation

Each set is represented as a **tree**. Each element points to its parent. The **root** of the tree is the set's **representative**—the element that identifies the set.

```
Initial state (each element is its own set):

  A     B     C     D     E

After union(A, B) and union(C, D):

  A     C     E
  |     |
  B     D

After union(A, C):

    A
   /|
  B C
    |
    D
```

Two elements are in the same set if and only if they have the same root.

---

## Basic Implementation

### Make Set

Create a new set containing only this element:

```
make_set(key: Key) -> UnifNode:
    node = UnifNode(key)
    node.parent = None     # root of its own tree
    node.rank = 0
    nodes.insert(key, node)
    return node
```

### Find (Naive)

Find the root by following parent pointers:

```
find_naive(key: Key) -> UnifNode:
    node = nodes.get(key)
    while node.parent is not None:
        node = node.parent
    return node
```

### Union (Naive)

Merge by making one root point to the other:

```
union_naive(x: Key, y: Key) -> UnifNode:
    root_x = find(x)
    root_y = find(y)

    if root_x == root_y:
        return root_x  # Already in same set

    # Make root_x point to root_y
    root_x.parent = root_y
    return root_y
```

### The Problem with Naive Implementation

Without optimizations, trees can become long chains:

```
union(1,2), union(2,3), union(3,4), union(4,5)...

Results in:

1 → 2 → 3 → 4 → 5 → ...

Find(1) takes O(n) time!
```

---

## Optimization 1: Union by Rank

Instead of arbitrarily choosing which root becomes the child, we keep the tree **balanced** by always attaching the shorter tree under the taller one.

The **rank** is an upper bound on the tree's height.

```
union(x: Key, y: Key) -> UnifNode:
    root_x = find(x)
    root_y = find(y)

    if root_x == root_y:
        return root_x

    # Attach smaller tree under larger tree
    if root_x.rank < root_y.rank:
        root_x.parent = root_y
        return root_y
    else if root_x.rank > root_y.rank:
        root_y.parent = root_x
        return root_x
    else:
        # Equal ranks: pick one, increment its rank
        root_y.parent = root_x
        root_x.rank += 1
        return root_x
```

**Why it helps**: With union by rank, tree height is at most $O(\log n)$.

**Intuition**: The only way a tree's rank increases is when two trees of equal rank merge. To get rank $k$, you need at least $2^k$ elements. So rank is at most $\log n$.

---

## Optimization 2: Path Compression

When we find the root, **make every node on the path point directly to the root**. This flattens the tree for future operations.

```
find(key: Key) -> UnifNode:
    node = nodes.get(key)

    # Find root
    root = node
    while root.parent is not None:
        root = root.parent

    # Path compression: make all nodes point to root
    current = node
    while current != root:
        next_node = current.parent
        current.parent = root
        current = next_node

    return root
```

Or recursively (more elegant):

```
find(key: Key) -> UnifNode:
    node = nodes.get(key)
    if node.parent is None:
        return node
    node.parent = find(node.parent.key)  # Recursively find and compress
    return node.parent
```

**Before path compression:**
```
    R
    |
    A
    |
    B
    |
    C  ← find(C)
```

**After path compression:**
```
      R
    / | \
   A  B  C
```

Now future finds on A, B, or C are O(1).

---

## Combined Runtime: Nearly O(1)

With both optimizations:

**Time per operation: $O(\alpha(n))$** amortized

where $\alpha$ is the **inverse Ackermann function**. This function grows incredibly slowly:
- $\alpha(n) \leq 4$ for any practical value of $n$ (even $n = 10^{80}$, the atoms in the universe)

For all practical purposes, **Union-Find operations are O(1)**.

### Why So Fast?

Path compression keeps trees extremely flat. After a find, the entire path is compressed.

Union by rank prevents trees from getting tall in the first place.

Together, they ensure that trees are almost completely flat. The $\alpha(n)$ factor comes from a subtle amortized analysis—individual operations might do more work, but averaged over many operations, it's nearly constant.

---

## Complete Implementation

```
UnionFind:
    nodes: Dictionary[Key, UnifNode]

    make_set(key: Key) -> UnifNode:
        node = UnifNode(key)
        node.parent = None
        node.rank = 0
        nodes.insert(key, node)
        return node

    find(key: Key) -> Optional[UnifNode]:
        node = nodes.get(key)
        if node is None:
            return None

        # Find root with path compression
        if node.parent is None:
            return node
        node.parent = find(node.parent.key)
        return node.parent

    union(x: Key, y: Key) -> UnifNode:
        root_x = find(x)
        root_y = find(y)

        if root_x == root_y:
            return root_x

        # Union by rank
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

## Application: Kruskal's Algorithm

Here's why Union-Find matters for MST:

```
kruskal(graph):
    uf = UnionFind()

    for vertex in graph.vertices:
        uf.make_set(vertex)        # O(V) total

    sort edges by weight           # O(E log E)

    for edge in sorted_edges:
        u, v = edge.endpoints

        if uf.find(u) != uf.find(v):   # O(α(V)) per check
            add edge to MST
            uf.union(u, v)              # O(α(V)) per union

    return MST
```

Total Union-Find work: $O(E \cdot \alpha(V)) \approx O(E)$

Without Union-Find, checking connectivity would be $O(V)$ per edge, making Kruskal's $O(EV)$.

---

## Other Applications

### Dynamic Connectivity

Track whether two nodes are connected as edges are added (but not removed).

### Percolation

In physics/materials science: does a path exist from top to bottom? Union-Find efficiently tracks as cells are "opened."

### Least Common Ancestor (Offline)

With clever preprocessing, Union-Find can answer LCA queries.

### Image Segmentation

Group similar adjacent pixels. Union-Find tracks which pixels belong to which segment.

### Maze Generation

Start with all walls. Randomly remove walls (union cells), stopping when start and end are connected.

---

## Union by Rank vs Union by Size

An alternative to union by rank is **union by size**: always attach the smaller tree (by number of nodes) under the larger one.

```
union_by_size(x, y):
    root_x = find(x)
    root_y = find(y)

    if root_x == root_y:
        return

    if size[root_x] < size[root_y]:
        root_x.parent = root_y
        size[root_y] += size[root_x]
    else:
        root_y.parent = root_x
        size[root_x] += size[root_y]
```

Both achieve the same asymptotic bounds. Union by size has the advantage that `size[root]` tells you exactly how many elements are in that set.

---

## The Limitations

Union-Find excels at **dynamic connectivity with additions**. It doesn't efficiently support:

- **Deletions**: Removing an edge is hard (no "un-union" operation)
- **Path queries**: Finding the actual path between elements
- **Weighted operations**: Though variants exist (weighted Union-Find)

For problems requiring deletions, you might need link-cut trees or other advanced structures.

---

## Runtime Summary

| Operation | Time (with both optimizations) |
|-----------|-------------------------------|
| make_set | $O(1)$ |
| find | $O(\alpha(n))$ amortized |
| union | $O(\alpha(n))$ amortized |
| $m$ operations on $n$ elements | $O(m \cdot \alpha(n))$ |

Where $\alpha(n) \leq 4$ for all practical $n$.

---

## The Intuition to Remember

Union-Find answers "are these connected?" nearly instantly by maintaining sets as trees. Two elements are in the same set if they have the same root.

**Path compression** keeps trees flat by making nodes point directly to the root.

**Union by rank** keeps trees balanced by attaching shorter trees under taller ones.

Together, these simple optimizations turn what could be $O(n)$ operations into effectively $O(1)$ operations. It's one of the most elegant examples of how the right data structure makes an algorithm practical.
