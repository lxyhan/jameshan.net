---
title: "Index: Data Structures & Algorithms"
pubDate: "2025-12-10"
order: 0
---

Notes for **CSC263: Data Structures and Analysis** and **CSC373: Algorithm Design, Analysis & Complexity** at the University of Toronto.

CSC263 covers core data structures and their analysis. CSC373 extends into algorithm design techniques: divide-and-conquer, greedy strategies, dynamic programming, network flows, and computational complexity.

These notes assume full knowledge of CSC165 (mathematical expression and reasoning) and CSC236 (algorithm analysis, induction, recursion).

The focus: **what** each structure does, **when** to use it, **how** to implement it using the standard definitions, and **why** the runtime is what it is.

---

## Standard Data Structures

The course uses consistent data structure definitions. All code in these notes follows these specifications.

### Graph (Adjacency Lists)

```python
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

```python
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

```python
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

```python
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

```python
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

```python
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

```python
bfs(graph, goals, args*) -> Optional[Path]
dfs(graph, goals, args*) -> Optional[Path]
cfs(graph, goals, args*) -> Optional[Path]
mst_prim(graph, args*) -> Optional[Graph]
mst_kruskal(graph, args*) -> Optional[Graph]
top_khans(graph, args*) -> Optional[Graph]
```

---

## Articles

### Part I: Graphs

1. [Graphs and Representations](/data-structures-and-algorithms/1_graphs_and_representations)
2. [Graph Search](/data-structures-and-algorithms/2_graph_search)
3. [Minimum Spanning Trees](/data-structures-and-algorithms/3_minimum_spanning_trees)
4. [Union-Find](/data-structures-and-algorithms/4_union_find)

### Part II: Dictionaries

5. [Hash Tables](/data-structures-and-algorithms/5_hash_tables)
6. [Balanced Binary Search Trees](/data-structures-and-algorithms/6_balanced_binary_search_trees)

### Part III: Specialized Structures

7. [Priority Queues and Heaps](/data-structures-and-algorithms/7_priority_queues_and_heaps)
8. [Tries](/data-structures-and-algorithms/8_tries)

### Part IV: Algorithm Design (CSC373)

9. [Divide and Conquer](/data-structures-and-algorithms/9_divide_and_conquer)
10. [Greedy Algorithms](/data-structures-and-algorithms/10_greedy_algorithms)
11. [Dynamic Programming](/data-structures-and-algorithms/11_dynamic_programming)
12. [Network Flows](/data-structures-and-algorithms/12_network_flows)
13. [Linear Programming](/data-structures-and-algorithms/13_linear_programming)
14. [NP-Completeness](/data-structures-and-algorithms/14_np_completeness)
15. [Approximation Algorithms](/data-structures-and-algorithms/15_approximation_algorithms)
16. [Randomized Algorithms](/data-structures-and-algorithms/16_randomized_algorithms)

### Leetcode Patterns

- [Leetcode Patterns Index](/data-structures-and-algorithms/leetcode-patterns/index)

---

*CSC373 content coming Winter 2026.*
