---
title: '0: Preface'
pubDate: '2025-12-10'
---

These articles document my journey learning data structures and algorithms—not as a comprehensive textbook, but as a personal record of concepts that clicked, implementations that worked, and intuitions I want to remember.

The focus is practical: **what** each structure does, **when** to use it, **how** to implement it, and **why** the runtime is what it is. No formal proofs—just clear explanations and the reasoning behind complexity claims.

---

## The Standard Data Structures

Throughout these articles, I use a consistent set of data structure definitions. These aren't arbitrary—they're the building blocks you'll encounter in courses and interviews. When I write code, I'm using these exact structures:

**Graphs** use adjacency lists with `Vertex`, `Edge`, and `Path` objects. Each vertex tracks its incoming and outgoing edges. Each edge knows its endpoints and weight.

**Union-Find** uses `UnifNode` objects with parent pointers and ranks. Path compression and union-by-rank give us near-constant amortized operations.

**Dictionaries** come in two flavors: hash tables (unordered, $O(1)$ average) and balanced BSTs (ordered, $O(\log n)$ guaranteed). Both use `DictNode` with key-value pairs.

**Tries** store strings character-by-character, with each `TrieNode` containing a dictionary of children.

**Priority Queues** are implemented as heaps, with `QueueNode` objects containing keys, values, and priorities.

These structures appear throughout the articles. Understanding them deeply—not just their interfaces but their internals—is what separates "I've seen this before" from "I know how to use this."

---

## The Articles

### **Part I: Graphs**

Graphs are everywhere. Social networks, maps, dependencies, state machines. Learning to think in graphs unlocks a huge class of problems.

**1: Graphs and Representations**
What is a graph? Vertices, edges, directed vs undirected, weighted vs unweighted. The two main representations (adjacency list vs matrix) and when each makes sense.

**2: Breadth-First Search**
Exploring level-by-level. Finding shortest paths in unweighted graphs. The intuition: BFS guarantees you see closer vertices before farther ones.

**3: Depth-First Search**
Diving deep before backtracking. Detecting cycles, finding connected components, topological sorting. The intuition: DFS fully explores one path before trying alternatives.

**4: Weighted Shortest Paths**
When edges have costs, BFS isn't enough. Dijkstra's algorithm (cheapest-first search) and why it works. The critical insight: always expand the cheapest unvisited vertex.

**5: Minimum Spanning Trees**
Connecting all vertices with minimum total weight. Prim's algorithm (grow from a vertex) and Kruskal's algorithm (pick cheapest edges). Both are greedy—and both are optimal.

**6: Union-Find**
Tracking connected components efficiently. The data structure that makes Kruskal's algorithm fast. Path compression and union-by-rank: two simple tricks that make operations nearly constant time.

---

### **Part II: Dictionaries**

The dictionary ADT—insert, lookup, delete by key—is fundamental. The implementation determines the tradeoffs.

**7: Hash Tables**
Trading space for speed. Hash functions, collision resolution (chaining vs open addressing), load factors, and resizing. Why average-case $O(1)$ but worst-case $O(n)$.

**8: Balanced Binary Search Trees**
When you need ordering *and* speed. BST basics, why balance matters, and how AVL trees maintain it. Guaranteed $O(\log n)$ for everything, plus in-order traversal.

---

### **Part III: Specialized Structures**

Some problems need specialized tools.

**9: Priority Queues and Heaps**
Always need the minimum (or maximum)? Heaps give you $O(\log n)$ insert and extract-min with a beautifully simple array-based structure. The heap property and why heapify is $O(n)$, not $O(n \log n)$.

**10: Tries**
Prefix matching as a tree problem. Autocomplete, spell checkers, IP routing. Operations are $O(k)$ where $k$ is string length—independent of how many strings you've stored.

---

## Standard Algorithms

These algorithms appear repeatedly. They're the "vocabulary" for solving graph problems:

- **BFS**: Shortest path in unweighted graphs. $O(V + E)$.
- **DFS**: Cycle detection, topological sort, connected components. $O(V + E)$.
- **Dijkstra's (CFS)**: Shortest path in weighted graphs (non-negative weights). $O((V + E) \log V)$ with a heap.
- **Prim's MST**: Grow a tree from a starting vertex. $O((V + E) \log V)$ with a heap.
- **Kruskal's MST**: Sort edges, add if no cycle. $O(E \log E)$ with Union-Find.
- **Kahn's Algorithm**: Topological sort via in-degree counting. $O(V + E)$.

---

## How to Use These Notes

**If you're studying the same material**: Read sequentially. Each article builds on previous concepts.

**If you're looking for a specific topic**: Jump directly to it. I've tried to make each article self-contained, defining terms as needed.

**If you're preparing for interviews**: Focus on the runtime intuitions. Interviewers care less about formal proofs and more about whether you understand *why* an algorithm is efficient.

**The best approach**: Implement everything yourself first. Then read my notes. You'll understand them ten times better if you've wrestled with the problems yourself.

---

*The goal isn't to memorize—it's to internalize. When you truly understand why BFS finds shortest paths, you don't need to remember it. It becomes obvious.*
