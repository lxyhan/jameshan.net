---
title: '1: Graphs and Representations'
pubDate: '2025-12-12'
---

A **graph** $G = (V, E)$ consists of vertices $V$ and edges $E$. Edges can be **directed** (one-way) or **undirected** (two-way), and **weighted** or **unweighted**.

---

## Terminology

- **Path**: Sequence of edges connecting two vertices
- **Cycle**: Path that starts and ends at the same vertex
- **Connected**: Path exists between every pair (undirected)
- **Strongly connected**: Directed path exists in both directions between every pair
- **DAG**: Directed Acyclic Graph

---

## Adjacency List Representation

```
Vertex:
  - key: Key
  - in_edges: List[Edge]
  - out_edges: List[Edge]
  - val: Object

Edge:
  - key: Key
  - from: Vertex
  - to: Vertex
  - wgt: Integer

Graph:
  - vertices: Dictionary[Key, Vertex]
```

Each vertex maintains lists of incoming and outgoing edges. For undirected graphs, each edge appears in both directions.

---

## Adjacency List vs Matrix

|  | Adjacency List | Adjacency Matrix |
|--|----------------|------------------|
| Space | $O(V + E)$ | $O(V^2)$ |
| Check edge $(u,v)$ | $O(\deg(u))$ | $O(1)$ |
| Iterate neighbors | $O(\deg(u))$ | $O(V)$ |

**Use adjacency lists** for sparse graphs ($E \ll V^2$) and when iterating neighbors (most algorithms).

**Use adjacency matrix** for dense graphs or when checking specific edges repeatedly.

---

## Runtime Pattern

Most graph algorithms are $O(V + E)$: visit each vertex once, examine each edge once. This is optimal—you can't do better than looking at the entire input.
