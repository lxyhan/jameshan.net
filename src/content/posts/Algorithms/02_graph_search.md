---
title: '2: Graph Search'
pubDate: '2025-12-12'
---

BFS, DFS, and CFS are **the same algorithm**. The only difference is how we pick the next node from the frontier:

| Algorithm | Pick Rule | Data Structure |
|-----------|-----------|----------------|
| BFS | Earliest added | Queue (FIFO) |
| DFS | Most recent | Stack (LIFO) |
| CFS | Lowest cost | Priority Queue (min-heap) |

Same skeleton, different priority.

---

## The Universal Template

```
search(graph, source, goals):
    open = {source}              # frontier: discovered, not yet processed
    closed = {}                  # already processed
    parent = {source: None}
    cost = {source: 0}

    while open is not empty:
        current = pick from open      # ← THIS IS THE ONLY DIFFERENCE

        if current in closed:
            continue
        closed.add(current)

        if current in goals:
            return reconstruct_path(parent, source, current)

        for edge in current.out_edges:
            neighbor = edge.to
            new_cost = cost[current] + edge.wgt

            if neighbor not in closed:
                if neighbor not in cost or new_cost < cost[neighbor]:
                    cost[neighbor] = new_cost
                    parent[neighbor] = current
                    open.add(neighbor)

    return None
```

**Open set** = frontier (discovered but not processed)

**Closed set** = done (never revisit)

---

## BFS: Pick Earliest (Queue)

```
open = Queue()  # FIFO
```

**Why it finds shortest paths (unweighted)**: FIFO means we process vertices in discovery order. Closer vertices are discovered first → processed first → their distance is finalized first.

**Runtime**: $O(V + E)$

---

## DFS: Pick Most Recent (Stack)

```
open = Stack()  # LIFO (or use recursion)
```

**Behavior**: Goes deep before going wide. Commits to one path fully before backtracking.

**Does NOT find shortest paths**: May find a long path before discovering a short one.

**Runtime**: $O(V + E)$

### Cycle Detection (DFS)

Track states: WHITE (unvisited), GRAY (in progress), BLACK (done).

Back edge to GRAY vertex = cycle.

```
dfs_cycle(v, color):
    color[v] = GRAY

    for neighbor in v.out_edges:
        if color[neighbor] == GRAY:
            return True  # cycle!
        if color[neighbor] == WHITE:
            if dfs_cycle(neighbor, color):
                return True

    color[v] = BLACK
    return False
```

### Topological Sort (DFS)

Output vertices in reverse finishing order.

```
dfs_topsort(v, visited, result):
    visited[v] = True
    for neighbor in v.out_edges:
        if neighbor not in visited:
            dfs_topsort(neighbor, visited, result)
    result.append(v)  # add AFTER all descendants

# Then reverse result
```

---

## CFS: Pick Cheapest (Priority Queue)

```
open = PriorityQueue()  # min-heap by cost
```

**Why it finds shortest paths (weighted)**: Always process the cheapest vertex. With non-negative weights, no cheaper path can go through an unprocessed vertex.

**Runtime**: $O((V + E) \log V)$
- Each vertex extracted once: $O(V \log V)$
- Each edge may cause one insertion: $O(E \log V)$

### Requires Non-Negative Weights

With negative edges, a "more expensive" unprocessed vertex might actually lead to a cheaper path. The greedy choice fails.

---

## Summary

| | BFS | DFS | CFS |
|--|-----|-----|-----|
| Pick rule | Earliest | Most recent | Cheapest |
| Structure | Queue | Stack | Priority Queue |
| Runtime | $O(V+E)$ | $O(V+E)$ | $O((V+E)\log V)$ |
| Shortest (unweighted) | **Yes** | No | Yes |
| Shortest (weighted) | No | No | **Yes** |
| Cycle detection | Possible | **Natural** | Possible |
| Topological sort | Kahn's | **Natural** | N/A |

**One algorithm, three variations.** The picking rule determines everything.
