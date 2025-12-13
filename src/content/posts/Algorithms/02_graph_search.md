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

## Pruning Strategies

How do we avoid revisiting nodes? Two approaches:

### Interpath Pruning

Once a node is added to the closed set, **never revisit it from any path**. Works when first discovery guarantees optimality (or we don't care about optimality).

**When to add to closed?**
- **Explore time**: Add when we pop/process the node
- **Export time**: Add immediately when first discovered (smaller open set - each node added only once)

### Intrapath Pruning

Only prevent cycles **within the current path**. A node can be revisited from a different path if it offers a better cost.

---

## The Universal Template

```
search(graph, source, goals):
    open = {source}              # frontier: discovered, not yet processed
    closed = {}                  # for interpath pruning
    parent = {source: None}
    cost = {source: 0}

    while open is not empty:
        current = pick from open      # ← PICK RULE VARIES

        # Interpath: skip if already processed
        if current in closed:
            continue
        closed.add(current)           # ← EXPLORE TIME (or move to export)

        if current in goals:
            return reconstruct_path(parent, source, current)

        for edge in current.out_edges:
            neighbor = edge.to
            new_cost = cost[current] + edge.wgt

            if neighbor not in closed:                              # interpath check
                if neighbor not in cost or new_cost < cost[neighbor]:
                    cost[neighbor] = new_cost
                    parent[neighbor] = current
                    open.add(neighbor)
                    # closed.add(neighbor)  ← EXPORT TIME (alternative)

    return None
```

---

## BFS: Interpath Pruning

```
open = Queue()  # FIFO
```

**Pruning**: Interpath (explore or export time)

**Why interpath works**: All edges have equal weight, so discovery order = distance order. First time we see a node IS the shortest path. Safe to permanently close it.

**Export time is preferred**: Smaller open set, each node enqueued at most once.

**Runtime**: $O(V + E)$

---

## DFS: Interpath Pruning

```
open = Stack()  # LIFO (or use recursion)
```

**Pruning**: Interpath (explore or export time)

**Why interpath works**: We don't care about shortest paths. Any path is fine, so once we've seen a node, no need to revisit.

**Behavior**: Goes deep before going wide.

**Runtime**: $O(V + E)$

### Cycle Detection

For cycle detection specifically, we track **intrapath** state (current path only):

- **WHITE**: Unvisited
- **GRAY**: On current path (in the recursion stack)
- **BLACK**: Finished (not on current path)

Back edge to GRAY = cycle.

```
dfs_cycle(v, color):
    color[v] = GRAY              # entering current path

    for neighbor in v.out_edges:
        if color[neighbor] == GRAY:
            return True          # cycle: neighbor is ancestor on current path
        if color[neighbor] == WHITE:
            if dfs_cycle(neighbor, color):
                return True

    color[v] = BLACK             # leaving current path
    return False
```

---

## CFS: Intrapath Pruning Only

```
open = PriorityQueue()  # min-heap by cost
```

**Pruning**: Intrapath only (no interpath!)

**Why interpath fails**: First discovery ≠ optimal. A node might be discovered via an expensive path first, then later found via a cheaper path. If we closed it on first discovery, we'd block the better path.

**How it works**:
- Nodes can be added to open multiple times (with different costs)
- When we pop a node, check if we've already processed it with a better cost
- Only process each node once (at its best cost)

```
cfs(graph, source, goals):
    open = PriorityQueue()
    processed = {}               # tracks best cost when processed
    parent = {source: None}
    cost = {source: 0}

    open.push(source, priority=0)

    while open is not empty:
        current, current_cost = open.pop()

        # Skip if already processed (found cheaper path earlier)
        if current in processed:
            continue
        processed[current] = current_cost

        if current in goals:
            return reconstruct_path(parent, source, current)

        for edge in current.out_edges:
            neighbor = edge.to
            new_cost = current_cost + edge.wgt

            # Allow re-adding with better cost (intrapath only)
            if neighbor not in processed:
                if neighbor not in cost or new_cost < cost[neighbor]:
                    cost[neighbor] = new_cost
                    parent[neighbor] = current
                    open.push(neighbor, priority=new_cost)

    return None
```

**Runtime**: $O((V + E) \log V)$

**Requires non-negative weights**: With negative edges, even a processed node might later be reachable more cheaply.

---

## Summary

| | BFS | DFS | CFS |
|--|-----|-----|-----|
| Pick rule | Earliest | Most recent | Cheapest |
| Pruning | **Interpath** | **Interpath** | **Intrapath** |
| Why | First discovery = optimal | Don't need optimal | First discovery ≠ optimal |
| Explore vs Export | Either (export preferred) | Either | N/A (no interpath) |
| Runtime | $O(V+E)$ | $O(V+E)$ | $O((V+E)\log V)$ |

**Key insight**: Interpath pruning is more aggressive (permanently closes nodes) but only works when first discovery is good enough. CFS must use intrapath because it needs to find the *cheapest* path, not just *any* path.
