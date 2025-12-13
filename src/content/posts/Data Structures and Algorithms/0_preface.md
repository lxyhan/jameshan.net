---
title: '0: Preface'
pubDate: '2025-12-10'
---

These are my review notes for **CSC 263: Data Structures and Analysis**. They cover the core data structures, algorithms, and complexity analysis from the course.

The focus: **what** each structure does, **when** to use it, **how** to implement it using the standard definitions, and **why** the runtime is what it is.

---

## Standard Data Structures

The course uses consistent data structure definitions. All code in these notes follows these specifications.

### Graph (Adjacency Lists)

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

Path:
  - edges: List[Edge]
  - length: Integer
  - weight: Integer

Graph:
  - vertices: Dictionary[Key, Vertex]
  - add_vertex(key, val) -> Vertex
  - add_edge(key, u, v, wgt) -> Edge
  - get_vertex(key) -> Optional[Vertex]
  - get_edges(key1, key2) -> List[Edge]
```

### Union-Find

```
UnifNode:
  - key: Key
  - parent: Optional[UnifNode]
  - rank: Integer

UnionFind:
  - nodes: Dictionary[Key, UnifNode]
  - make_set(key) -> UnifNode
  - find(key) -> Optional[UnifNode]
  - union(x, y) -> UnifNode
```

### Dictionary (Hash Table)

```
DictNode:
  - key: String
  - val: Object
  - next: Optional[DictNode]

Dict:
  - table: List[Optional[DictNode]]
  - size: Integer
  - capacity: Integer
  - hash_func: Callable[[String], Integer]
  - insert(key, val) -> DictNode
  - get(key) -> Optional[DictNode]
  - delete(key) -> Optional[DictNode]
  - keys() -> List[String]
```

### Sorted Dictionary (Balanced BST)

```
DictNode:
  - key: Key
  - val: Object
  - left: Optional[DictNode]
  - right: Optional[DictNode]
  - height: Integer

SortDict:
  - root: Optional[DictNode]
  - insert(key, val) -> DictNode
  - get(key) -> Optional[DictNode]
  - delete(key) -> Optional[DictNode]
  - keys() -> List[Key]
```

### Trie

```
TrieNode:
  - key: Key
  - val: Object
  - children: Dictionary[String, TrieNode]

Trie:
  - root: Optional[TrieNode]
  - insert(key, val) -> TrieNode
  - get(key) -> Optional[TrieNode]
  - delete(key) -> Optional[TrieNode]
```

### Priority Queue (Heap)

```
QueueNode:
  - key: Key
  - val: Object
  - pri: Integer

Queue:
  - heap: List[QueueNode]
  - push(key, val, pri) -> QueueNode
  - pop() -> Optional[QueueNode]
  - peek() -> Optional[QueueNode]
```

---

## Standard Algorithms

```
bfs(graph, goals, args*) -> Optional[Path]
dfs(graph, goals, args*) -> Optional[Path]
cfs(graph, goals, args*) -> Optional[Path]
mst_prim(graph, args*) -> Optional[Graph]
mst_kruskal(graph, args*) -> Optional[Graph]
top_khans(graph, args*) -> Optional[Graph]
```

---

## The Articles

### Part I: Graphs

1. **Graphs and Representations** — Vertices, edges, adjacency lists, $O(V+E)$ space
2. **Graph Search** — Unified template: BFS, DFS, CFS differ only in frontier structure
3. **Minimum Spanning Trees** — Prim's and Kruskal's, cut property
4. **Union-Find** — Path compression, union-by-rank, $O(\alpha(n))$

### Part II: Dictionaries

5. **Hash Tables** — Chaining, load factors, $O(1)$ average
6. **Balanced BSTs** — AVL trees, rotations, $O(\log n)$ worst-case

### Part III: Specialized Structures

7. **Priority Queues and Heaps** — Binary heap, heapify, $O(\log n)$ operations
8. **Tries** — Prefix trees, $O(k)$ operations
