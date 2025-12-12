---
title: '3: Depth-First Search'
pubDate: '2025-12-12'
---

Depth-First Search explores a graph by going **as deep as possible** before backtracking. Where BFS explores level by level (like ripples in a pond), DFS dives down a single path until it hits a dead end, then backtracks to try other paths.

This "dive deep, then backtrack" behavior makes DFS ideal for problems involving **complete exploration**, **cycle detection**, and **topological ordering**.

---

## The Core Idea

Imagine exploring a maze. One strategy: at each intersection, pick a direction and keep going until you hit a dead end or a place you've been. Then backtrack to the last intersection and try a different direction. This is DFS.

The key insight: **DFS uses a stack** (or recursion, which implicitly uses the call stack). A stack is LIFO (last-in, first-out), so we always process the most recently discovered vertex—going deeper before going wider.

---

## The Algorithm

### Recursive Version

The recursive version is cleaner and more commonly used:

```
dfs(graph: Graph, source: Key, goals: List[Key]) -> Optional[Path]:
    visited = Dict()
    parent = Dict()
    parent.insert(source, None)

    result = dfs_visit(graph, source, goals, visited, parent)
    if result is not None:
        return reconstruct_path(parent, source, result)
    return None


dfs_visit(graph, current, goals, visited, parent) -> Optional[Key]:
    visited.insert(current, True)

    if current in goals:
        return current

    vertex = graph.get_vertex(current)
    for edge in vertex.out_edges:
        neighbor = edge.to.key
        if visited.get(neighbor) is None:
            parent.insert(neighbor, current)
            result = dfs_visit(graph, neighbor, goals, visited, parent)
            if result is not None:
                return result  # Goal found in this subtree

    return None  # No goal in this subtree
```

### Iterative Version

Uses an explicit stack instead of recursion:

```
dfs_iterative(graph: Graph, source: Key, goals: List[Key]) -> Optional[Path]:
    visited = Dict()
    parent = Dict()
    stack = Stack()

    stack.push(source)
    parent.insert(source, None)

    while not stack.is_empty():
        current = stack.pop()

        if visited.get(current) is not None:
            continue  # Already processed
        visited.insert(current, True)

        if current in goals:
            return reconstruct_path(parent, source, current)

        vertex = graph.get_vertex(current)
        for edge in vertex.out_edges:
            neighbor = edge.to.key
            if visited.get(neighbor) is None:
                parent.insert(neighbor, current)
                stack.push(neighbor)

    return None
```

**Note**: The iterative version may visit vertices in a different order than recursive DFS due to the order edges are pushed onto the stack.

---

## Tracing Through an Example

Consider this graph, starting DFS from A:

```
    A ─── B ─── E
    │     │
    │     │
    C ─── D ─── F
```

**Recursive DFS from A** (assuming we process neighbors in alphabetical order):

```
dfs_visit(A)
  ├── visit A
  ├── recurse on B (first unvisited neighbor)
  │     dfs_visit(B)
  │       ├── visit B
  │       ├── skip A (visited)
  │       ├── recurse on D
  │       │     dfs_visit(D)
  │       │       ├── visit D
  │       │       ├── skip B (visited)
  │       │       ├── recurse on C
  │       │       │     dfs_visit(C)
  │       │       │       ├── visit C
  │       │       │       ├── skip A, D (visited)
  │       │       │       └── return (dead end)
  │       │       ├── recurse on F
  │       │       │     dfs_visit(F)
  │       │       │       ├── visit F
  │       │       │       ├── skip D (visited)
  │       │       │       └── return (dead end)
  │       │       └── return
  │       ├── recurse on E
  │       │     dfs_visit(E)
  │       │       ├── visit E
  │       │       ├── skip B (visited)
  │       │       └── return (dead end)
  │       └── return
  └── skip C (already visited via D)
```

**Visit order**: A → B → D → C → F → E

Compare to BFS visit order: A → B → C → D → E → F (level by level)

---

## DFS Does NOT Find Shortest Paths

This is crucial. In the example above, the DFS path from A to C is A → B → D → C (length 3). But the shortest path is A → C (length 1).

Why doesn't DFS find shortest paths? Because it commits to exploring one branch completely before trying others. It might find a long path to a vertex before discovering a shorter one exists.

**Use BFS for shortest paths. Use DFS for other things.**

---

## Runtime Analysis

Let $V$ = number of vertices, $E$ = number of edges.

**Time: $O(V + E)$**

Same as BFS:
- Each vertex is visited exactly once
- Each edge is examined exactly once (when processing its source)

**Space: $O(V)$**

- `visited` and `parent`: $O(V)$
- Call stack (recursive) or explicit stack: $O(V)$ in worst case (a long path)

---

## Applications of DFS

### Cycle Detection

DFS is the natural algorithm for detecting cycles. The idea: if we're exploring from vertex $u$ and encounter a vertex $v$ that's currently "in progress" (on the current path), we've found a cycle.

```
has_cycle(graph: Graph) -> Boolean:
    WHITE = 0  # Unvisited
    GRAY = 1   # In progress (on current path)
    BLACK = 2  # Finished

    color = Dict()  # Initialize all to WHITE

    for vertex in graph.vertices:
        if color.get(vertex) == WHITE:
            if dfs_cycle(graph, vertex, color):
                return True
    return False


dfs_cycle(graph, current, color) -> Boolean:
    color.insert(current, GRAY)  # Start exploring

    for edge in graph.get_vertex(current).out_edges:
        neighbor = edge.to.key

        if color.get(neighbor) == GRAY:
            return True  # Back edge = cycle!

        if color.get(neighbor) == WHITE:
            if dfs_cycle(graph, neighbor, color):
                return True

    color.insert(current, BLACK)  # Done exploring
    return False
```

**Edge classification** in DFS:
- **Tree edge**: Goes to an unvisited vertex (WHITE)
- **Back edge**: Goes to an ancestor on current path (GRAY) — indicates a cycle
- **Forward edge**: Goes to a descendant (already BLACK)
- **Cross edge**: Goes to a vertex in a different subtree (already BLACK)

A directed graph has a cycle **if and only if** DFS finds a back edge.

---

### Topological Sort

A **topological ordering** of a DAG is a linear ordering of vertices such that for every edge $u \to v$, vertex $u$ appears before $v$. Think of it as a valid order to complete tasks with dependencies.

DFS gives us topological sort naturally: **output vertices in reverse order of finishing time**.

```
topological_sort(graph: Graph) -> List[Key]:
    visited = Dict()
    result = []

    for vertex in graph.vertices:
        if visited.get(vertex) is None:
            dfs_topsort(graph, vertex, visited, result)

    reverse(result)
    return result


dfs_topsort(graph, current, visited, result):
    visited.insert(current, True)

    for edge in graph.get_vertex(current).out_edges:
        neighbor = edge.to.key
        if visited.get(neighbor) is None:
            dfs_topsort(graph, neighbor, visited, result)

    result.append(current)  # Add AFTER processing all descendants
```

**Why this works**: When we finish a vertex (add it to result), all its descendants have already been added. So reversing gives us an order where each vertex appears before its descendants—exactly what topological order requires.

**Alternative: Kahn's Algorithm** uses BFS with in-degree counting. Both are $O(V + E)$.

---

### Finding Connected Components

For undirected graphs, DFS from any vertex visits its entire connected component. To find all components:

```
find_components(graph: Graph) -> List[List[Key]]:
    visited = Dict()
    components = []

    for vertex in graph.vertices:
        if visited.get(vertex) is None:
            component = []
            dfs_component(graph, vertex, visited, component)
            components.append(component)

    return components


dfs_component(graph, current, visited, component):
    visited.insert(current, True)
    component.append(current)

    for edge in graph.get_vertex(current).out_edges:
        neighbor = edge.to.key
        if visited.get(neighbor) is None:
            dfs_component(graph, neighbor, visited, component)
```

---

### Finding Strongly Connected Components

For directed graphs, connectivity is more subtle. A **strongly connected component (SCC)** is a maximal set of vertices where every vertex is reachable from every other.

**Kosaraju's Algorithm** uses two DFS passes:
1. DFS on original graph, recording finish order
2. DFS on reversed graph in reverse finish order

Each DFS tree in the second pass is an SCC.

---

## DFS Tree and Edge Types

When DFS explores a graph, it implicitly creates a **DFS tree** (or forest). The edges can be classified:

```
        A
       / \
      B   C      DFS Tree edges (solid)
     /
    D -----> C   Back edge (dashed) - to ancestor
    |
    v
    E -----> B   Cross edge - to different subtree
```

- **Tree edges**: The edges we actually traverse during DFS
- **Back edges**: Point to an ancestor in the DFS tree (indicate cycles in directed graphs)
- **Forward edges**: Point to a descendant (not via tree edge)
- **Cross edges**: Point to a vertex in a different subtree

For undirected graphs, there are only tree edges and back edges.

---

## BFS vs DFS Summary

| Property | BFS | DFS |
|----------|-----|-----|
| Data structure | Queue | Stack / Recursion |
| Exploration pattern | Level by level | Deep then backtrack |
| Shortest path (unweighted) | **Yes** | No |
| Cycle detection | Possible | **Natural** |
| Topological sort | Kahn's algorithm | **Natural** |
| Space (worst case) | $O(V)$ | $O(V)$ |
| Space (typical tree) | $O(\text{width})$ | $O(\text{depth})$ |

**Choose BFS when** distance matters.
**Choose DFS when** you need to explore completely, detect cycles, or find orderings.

---

## The Intuition to Remember

DFS is **commitment to a path**. It fully explores one direction before trying alternatives. This makes it perfect for:
- **Cycle detection**: You're following a path; if you see a vertex you're currently visiting, you've looped back.
- **Topological sort**: Finish all descendants before finishing yourself.
- **Backtracking**: Try one choice fully, then backtrack and try another.

The stack (explicit or implicit) remembers where to backtrack to. The recursion naturally handles the "try this path, then undo and try another" pattern.
