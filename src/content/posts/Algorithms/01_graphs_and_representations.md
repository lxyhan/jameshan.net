---
title: '1: Graphs and Representations'
pubDate: '2025-12-12'
---

A graph is a collection of **vertices** (nodes) connected by **edges** (links). That's it. This simple abstraction captures an enormous range of problems: social networks (people connected by friendships), maps (intersections connected by roads), dependencies (tasks connected by prerequisites), state machines (states connected by transitions).

The power of graphs comes from this generality. Once you model a problem as a graph, you unlock a toolbox of algorithms for traversal, shortest paths, connectivity, and more.

---

## The Vocabulary

**Vertices** (or nodes) are the entities. **Edges** connect pairs of vertices.

A graph is **directed** if edges have a direction—an edge from $A$ to $B$ doesn't imply an edge from $B$ to $A$. Think of Twitter follows: you can follow someone without them following you back.

A graph is **undirected** if edges are bidirectional—an edge between $A$ and $B$ means you can go either way. Think of Facebook friendships: if you're friends, you're both friends.

A graph is **weighted** if edges have associated costs or distances. Think of a road map: the edge between two cities has a weight representing the distance.

A **path** is a sequence of edges connecting two vertices. The **length** of a path is the number of edges (in unweighted graphs) or the sum of edge weights (in weighted graphs).

A graph is **connected** (for undirected) if there's a path between every pair of vertices. It's **strongly connected** (for directed) if there's a directed path between every pair in both directions.

A **cycle** is a path that starts and ends at the same vertex. A graph with no cycles is **acyclic**. A directed acyclic graph is called a **DAG**—these are everywhere in dependency management.

---

## The Data Structures

Here's how we represent graphs in code. These definitions are standard—you'll see them (or variations) everywhere.

### Vertex

```
Vertex:
  - key: Key           # unique identifier
  - in_edges: List[Edge]    # edges pointing TO this vertex
  - out_edges: List[Edge]   # edges pointing FROM this vertex
  - val: Object        # optional payload (distance, color, etc.)
```

Each vertex has a unique key and maintains lists of its incoming and outgoing edges. For undirected graphs, an edge appears in both `out_edges` of one endpoint and `in_edges` of the other.

### Edge

```
Edge:
  - key: Key           # unique identifier
  - from: Vertex       # origin vertex
  - to: Vertex         # destination vertex
  - wgt: Integer       # weight (1 for unweighted graphs)
```

An edge knows both endpoints and its weight. For unweighted graphs, you can treat all weights as 1.

### Path

```
Path:
  - edges: List[Edge]  # sequence of edges
  - length: Integer    # number of edges
  - weight: Integer    # sum of edge weights
```

A path is a sequence of edges where each edge's destination is the next edge's origin.

### Graph

```
Graph:
  - vertices: Dictionary[Key, Vertex]

  # Operations:
  - add_vertex(key, val) -> Vertex
  - add_edge(key, u, v, wgt) -> Edge
  - get_vertex(key) -> Optional[Vertex]
  - get_edges(key1, key2) -> List[Edge]
```

The graph itself is just a dictionary mapping keys to vertices. All the connectivity information lives in the vertices' edge lists.

---

## Why Adjacency Lists?

There are two main ways to represent a graph:

**Adjacency List**: Each vertex stores a list of its neighbors (via edges). This is what we defined above.

**Adjacency Matrix**: A 2D array where `matrix[i][j]` indicates whether there's an edge from vertex $i$ to vertex $j$ (and its weight if weighted).

### Space Comparison

- **Adjacency List**: $O(V + E)$ — we store each vertex and each edge once
- **Adjacency Matrix**: $O(V^2)$ — we store a cell for every possible pair

For **sparse graphs** (few edges relative to vertices), adjacency lists are far more efficient. A social network with 1 million users where each person has ~100 friends needs $O(10^8)$ space with lists but $O(10^{12})$ with a matrix.

For **dense graphs** (many edges), the matrix wastes less space proportionally, and has other advantages.

### Operation Comparison

| Operation | Adjacency List | Adjacency Matrix |
|-----------|----------------|------------------|
| Check if edge $(u,v)$ exists | $O(\text{degree of } u)$ | $O(1)$ |
| Get all neighbors of $u$ | $O(\text{degree of } u)$ | $O(V)$ |
| Add edge | $O(1)$ | $O(1)$ |
| Space | $O(V + E)$ | $O(V^2)$ |

The key insight: adjacency lists are better when you need to **iterate over neighbors** (which is what most graph algorithms do). Matrices are better when you need to **check specific edges** repeatedly.

Most real-world graphs are sparse. Most graph algorithms iterate over neighbors. So adjacency lists are the default choice.

---

## Building a Graph

Let's trace through building a simple directed graph:

```
     A ──(5)──> B
     │         │
    (2)       (1)
     │         │
     v         v
     C ──(3)──> D
```

```python
G = Graph()

# Add vertices
G.add_vertex("A", None)
G.add_vertex("B", None)
G.add_vertex("C", None)
G.add_vertex("D", None)

# Add edges with weights
G.add_edge("e1", "A", "B", 5)  # A -> B, weight 5
G.add_edge("e2", "A", "C", 2)  # A -> C, weight 2
G.add_edge("e3", "B", "D", 1)  # B -> D, weight 1
G.add_edge("e4", "C", "D", 3)  # C -> D, weight 3
```

After this:
- `G.get_vertex("A").out_edges` contains edges to B and C
- `G.get_vertex("D").in_edges` contains edges from B and C
- `G.get_edges("A", "B")` returns the edge with weight 5

---

## Undirected Graphs

For undirected graphs, we represent each undirected edge as **two directed edges**—one in each direction. When you add an undirected edge between $A$ and $B$:

```python
G.add_edge("e1_forward", "A", "B", wgt)
G.add_edge("e1_backward", "B", "A", wgt)
```

This way, the same traversal code works for both directed and undirected graphs. When you're at vertex $A$ and look at `out_edges`, you see the edge to $B$. When you're at $B$, you see the edge to $A$.

---

## Common Graph Types

**Trees**: Connected acyclic graphs. $E = V - 1$ edges exactly. Every pair of vertices has exactly one path between them.

**DAGs** (Directed Acyclic Graphs): Directed graphs with no cycles. Used for dependencies, scheduling, and computation graphs. Can be topologically sorted.

**Complete Graphs**: Every pair of vertices is connected. $E = V(V-1)/2$ edges for undirected, $V(V-1)$ for directed. Dense by definition.

**Bipartite Graphs**: Vertices split into two sets, edges only between sets. Matching problems (jobs to workers, courses to time slots) are often bipartite.

**Sparse vs Dense**: A graph is "sparse" if $E = O(V)$ and "dense" if $E = O(V^2)$. Most real graphs are sparse.

---

## The Graph Mindset

Learning to "see" graphs in problems is a skill. Some patterns:

**Whenever you have entities with relationships**, you might have a graph. Users and friendships. Files and dependencies. States and transitions.

**Whenever you need to find a path**, you probably need graph traversal. Shortest route. Sequence of moves. Chain of connections.

**Whenever you need to detect impossibilities**, look for cycles. Circular dependencies. Deadlocks. Infinite loops.

**Whenever you need to cover everything efficiently**, think spanning trees. Minimum wiring. Broadcast networks. Clustering.

The next articles cover the algorithms that operate on these structures: BFS for shortest paths in unweighted graphs, DFS for deep exploration and cycle detection, and weighted algorithms for when edges have costs.

---

## Runtime Summary

| Operation | Adjacency List | Why |
|-----------|----------------|-----|
| Add vertex | $O(1)$ | Dictionary insertion |
| Add edge | $O(1)$ | Append to lists |
| Get vertex | $O(1)$ | Dictionary lookup |
| Get all edges from $u$ | $O(\text{out-degree of } u)$ | Iterate the list |
| Check if edge exists | $O(\text{out-degree of } u)$ | Search the list |
| Iterate all edges | $O(E)$ | Visit each edge once |
| Iterate all vertices | $O(V)$ | Visit each vertex once |
| Space | $O(V + E)$ | Store each vertex and edge |

The $O(V + E)$ pattern appears constantly in graph algorithms. It means "we touch each vertex once and each edge once"—the minimum work needed to examine the entire graph.
