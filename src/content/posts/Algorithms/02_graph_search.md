---
title: '2: Graph Search'
pubDate: '2025-12-12'
---

BFS, DFS, and CFS follow the same template. The only difference is the **frontier data structure**:

| Algorithm | Frontier | Priority | Finds |
|-----------|----------|----------|-------|
| BFS | Queue (FIFO) | Discovery order | Shortest path (unweighted) |
| DFS | Stack (LIFO) | Reverse discovery | Cycles, topological order |
| CFS | Priority Queue | Lowest cost | Shortest path (weighted) |

---

## Unified Search Template

```
search(graph: Graph, source: Key, goals: List[Key]) -> Optional[Path]:
    open = Frontier()           # vertices discovered but not processed
    closed = Dict()             # vertices already processed
    parent = Dict()             # how we reached each vertex
    cost = Dict()               # cost to reach each vertex

    open.add(source, priority=0)
    cost.insert(source, 0)
    parent.insert(source, None)

    while not open.is_empty():
        current = open.remove()     # get next vertex by frontier's priority

        if closed.get(current) is not None:
            continue                 # already processed
        closed.insert(current, True)

        if current in goals:
            return reconstruct_path(parent, source, current)

        for edge in graph.get_vertex(current).out_edges:
            neighbor = edge.to.key
            new_cost = cost.get(current) + edge.wgt

            if closed.get(neighbor) is None:
                old_cost = cost.get(neighbor)
                if old_cost is None or new_cost < old_cost:
                    cost.insert(neighbor, new_cost)
                    parent.insert(neighbor, current)
                    open.add(neighbor, priority=new_cost)

    return None
```

**Open set**: Discovered vertices waiting to be processed (the "frontier")

**Closed set**: Vertices we've already processed (never revisit)

---

## BFS: Breadth-First Search

**Frontier**: Queue (FIFO)

**Invariant**: When a vertex is removed from open, its distance from source is final.

**Why it works**: FIFO order ensures we process vertices in order of discovery. In an unweighted graph, discovery order = distance order.

```
bfs(graph, source, goals):
    # Use queue as frontier
    # Treat all edges as weight 1
    # First time we reach a vertex = shortest path
```

**Runtime**: $O(V + E)$ — each vertex enqueued/dequeued once, each edge examined once.

**Use for**: Shortest path in unweighted graphs, level-order traversal.

---

## DFS: Depth-First Search

**Frontier**: Stack (LIFO)

**Behavior**: Explores as deep as possible before backtracking.

```
dfs(graph, source, goals):
    # Use stack as frontier (or recursion)
    # Goes deep before going wide
```

**Runtime**: $O(V + E)$

**Use for**: Cycle detection, topological sort, connected components.

### DFS Does NOT Find Shortest Paths

DFS commits to one path fully before trying alternatives. It may find a long path before a short one.

### Cycle Detection

Track vertex states during DFS:
- **WHITE**: Unvisited
- **GRAY**: Currently being explored (on the current path)
- **BLACK**: Fully explored

A **back edge** (edge to a GRAY vertex) indicates a cycle.

```
has_cycle(graph):
    color = Dict()  # all WHITE initially

    for v in graph.vertices:
        if color.get(v) == WHITE:
            if dfs_cycle(v, color):
                return True
    return False

dfs_cycle(v, color):
    color.insert(v, GRAY)

    for edge in v.out_edges:
        neighbor = edge.to.key
        if color.get(neighbor) == GRAY:
            return True  # back edge = cycle
        if color.get(neighbor) == WHITE:
            if dfs_cycle(neighbor, color):
                return True

    color.insert(v, BLACK)
    return False
```

### Topological Sort

For DAGs: output vertices in reverse finishing order.

```
topological_sort(graph):
    visited = Dict()
    result = []

    for v in graph.vertices:
        if visited.get(v) is None:
            dfs_topsort(v, visited, result)

    reverse(result)
    return result

dfs_topsort(v, visited, result):
    visited.insert(v, True)

    for edge in v.out_edges:
        if visited.get(edge.to.key) is None:
            dfs_topsort(edge.to, visited, result)

    result.append(v)  # add AFTER processing all descendants
```

**Alternative**: Kahn's algorithm uses BFS with in-degree counting.

---

## CFS: Cheapest-First Search

**Frontier**: Priority Queue (min-heap by cost)

**Invariant**: When a vertex is removed from open, its cost from source is final (requires non-negative weights).

**Why it works**: We always process the cheapest unvisited vertex. With non-negative weights, no cheaper path can exist through unprocessed vertices.

```
cfs(graph, source, goals):
    open = PriorityQueue()  # min-heap by cost
    closed = Dict()
    cost = Dict()
    parent = Dict()

    open.push(source, source, 0)
    cost.insert(source, 0)
    parent.insert(source, None)

    while not open.is_empty():
        node = open.pop()
        current = node.key

        if closed.get(current) is not None:
            continue
        closed.insert(current, True)

        if current in goals:
            return reconstruct_path(parent, source, current)

        for edge in graph.get_vertex(current).out_edges:
            neighbor = edge.to.key
            new_cost = cost.get(current) + edge.wgt

            if closed.get(neighbor) is None:
                old_cost = cost.get(neighbor)
                if old_cost is None or new_cost < old_cost:
                    cost.insert(neighbor, new_cost)
                    parent.insert(neighbor, current)
                    open.push(neighbor, neighbor, new_cost)

    return None
```

**Runtime**: $O((V + E) \log V)$ — each vertex extracted once ($O(V \log V)$), each edge may cause one insertion ($O(E \log V)$).

**Use for**: Shortest path in weighted graphs with non-negative weights.

### Why Non-Negative Weights?

With negative edges, processing a vertex doesn't guarantee finality—a later path through another vertex might be cheaper.

---

## Summary

| | BFS | DFS | CFS |
|--|-----|-----|-----|
| Frontier | Queue | Stack | Priority Queue |
| Runtime | $O(V+E)$ | $O(V+E)$ | $O((V+E)\log V)$ |
| Shortest path (unweighted) | Yes | No | Yes |
| Shortest path (weighted) | No | No | Yes (non-negative) |
| Cycle detection | Possible | Natural | Possible |
| Topological sort | Kahn's | Natural | N/A |

The unified view: all three are the same algorithm with different frontier orderings.
