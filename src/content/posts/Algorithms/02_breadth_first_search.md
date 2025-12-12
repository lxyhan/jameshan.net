---
title: '2: Breadth-First Search'
pubDate: '2025-12-12'
---

Breadth-First Search explores a graph **level by level**. Starting from a source vertex, it visits all vertices at distance 1, then all vertices at distance 2, and so on. This "expanding wavefront" behavior gives BFS a crucial property: **the first time you reach a vertex, you've found the shortest path to it** (in unweighted graphs).

---

## The Core Idea

Imagine dropping a stone in a pond. Ripples expand outward in concentric circles. BFS works the same way—it explores outward from the source, visiting vertices in order of their distance.

The key insight: **BFS uses a queue**. A queue is FIFO (first-in, first-out), which guarantees that we process vertices in the order we discovered them. Since we discover closer vertices before farther ones, we process them in order of distance.

Compare this to using a stack (LIFO), which would give us DFS—a completely different traversal pattern.

---

## The Algorithm

```
bfs(graph: Graph, source: Key, goals: List[Key]) -> Optional[Path]:
    # Initialize
    visited = Dict()                    # tracks which vertices we've seen
    parent = Dict()                     # tracks how we reached each vertex
    queue = Queue()                     # FIFO queue of vertices to process

    # Start from source
    visited.insert(source, True)
    parent.insert(source, None)
    queue.enqueue(source)

    while not queue.is_empty():
        current = queue.dequeue()

        # Goal check
        if current in goals:
            return reconstruct_path(parent, source, current)

        # Explore neighbors
        vertex = graph.get_vertex(current)
        for edge in vertex.out_edges:
            neighbor = edge.to.key
            if visited.get(neighbor) is None:
                visited.insert(neighbor, True)
                parent.insert(neighbor, current)
                queue.enqueue(neighbor)

    return None  # No path to any goal
```

### Reconstructing the Path

```
reconstruct_path(parent: Dict, source: Key, goal: Key) -> Path:
    path = Path()
    current = goal

    while current != source:
        prev = parent.get(current)
        # Add edge from prev to current to path
        current = prev

    reverse(path.edges)  # Path is built backwards
    return path
```

---

## Tracing Through an Example

Consider this graph, searching from A to F:

```
    A ─── B ─── E
    │     │
    │     │
    C ─── D ─── F
```

**Initial state:**
- Queue: [A]
- Visited: {A}
- Parent: {A: None}

**Step 1:** Dequeue A, not a goal
- Neighbors: B, C (both unvisited)
- Queue: [B, C]
- Visited: {A, B, C}
- Parent: {A: None, B: A, C: A}

**Step 2:** Dequeue B, not a goal
- Neighbors: A (visited), D, E (unvisited)
- Queue: [C, D, E]
- Visited: {A, B, C, D, E}
- Parent: {..., D: B, E: B}

**Step 3:** Dequeue C, not a goal
- Neighbors: A (visited), D (visited)
- Queue: [D, E]
- No changes

**Step 4:** Dequeue D, not a goal
- Neighbors: B (visited), C (visited), F (unvisited)
- Queue: [E, F]
- Visited: {A, B, C, D, E, F}
- Parent: {..., F: D}

**Step 5:** Dequeue E, not a goal
- No unvisited neighbors
- Queue: [F]

**Step 6:** Dequeue F, **goal found!**
- Reconstruct path: F ← D ← B ← A
- Return path: A → B → D → F (length 3)

Notice how BFS found the shortest path (3 edges). There are other paths (like A → C → D → F), but BFS found one of the shortest ones first.

---

## Why BFS Finds Shortest Paths

This is the key property of BFS. Here's the intuition:

**Claim**: When BFS dequeues a vertex $v$, the path from source to $v$ (via parent pointers) is a shortest path.

**Why it's true**:

1. BFS processes vertices in **order of discovery**. The queue is FIFO.

2. A vertex is discovered (and enqueued) when we're processing one of its neighbors. So if $v$ is discovered while processing $u$, then $v$ is one edge farther from the source than $u$.

3. The first time we discover a vertex, we've found it via a shortest path. Why? Because if there were a shorter path, we would have discovered it earlier (since we process vertices in order of distance).

4. Once a vertex is marked visited, we never update its parent. So the first path we find is the one we keep—and it's guaranteed to be shortest.

**The key insight**: BFS explores in "layers" of increasing distance. Layer 0 is the source. Layer 1 is all vertices 1 edge from source. Layer 2 is all vertices 2 edges from source. And so on. We fully explore layer $k$ before starting layer $k+1$.

---

## Runtime Analysis

Let $V$ = number of vertices, $E$ = number of edges.

**Time: $O(V + E)$**

Why? Let's count the work:
- Each vertex is enqueued at most once (we mark it visited before enqueuing)
- Each vertex is dequeued at most once
- When we process a vertex, we look at all its outgoing edges

Total edge examinations: Each edge is examined exactly once (when we process its source vertex). That's $O(E)$ work.

Total vertex operations: Each vertex is enqueued/dequeued at most once. That's $O(V)$ work.

Combined: $O(V + E)$.

**Space: $O(V)$**

Why? We store:
- `visited`: At most $V$ entries
- `parent`: At most $V$ entries
- `queue`: At most $V$ vertices (each vertex enqueued at most once)

---

## Use Cases

### Shortest Path in Unweighted Graphs

This is the primary use case. If all edges have the same cost (or no cost), BFS finds the shortest path.

Examples:
- Minimum number of moves in a puzzle
- Fewest hops in a network
- Degrees of separation in a social network

### Level-Order Traversal

BFS naturally processes vertices level by level. Useful when you need to:
- Find all vertices at distance exactly $k$
- Process a tree level by level
- Find the "depth" of each vertex

### Testing Bipartiteness

A graph is bipartite if vertices can be 2-colored such that no edge connects same-colored vertices. BFS can test this: alternate colors as you traverse. If you ever find an edge between same-colored vertices, the graph isn't bipartite.

### Finding Connected Components

Run BFS from an unvisited vertex; it discovers all vertices in that component. Repeat for remaining unvisited vertices to find all components.

---

## BFS vs DFS

| Property | BFS | DFS |
|----------|-----|-----|
| Data structure | Queue (FIFO) | Stack (LIFO) |
| Traversal order | Level by level | Deep then backtrack |
| Shortest path (unweighted) | Yes | No |
| Memory usage | $O(V)$ worst case | $O(V)$ worst case |
| Good for | Shortest paths, levels | Cycle detection, topological sort |

BFS is the right choice when **distance from source matters**. DFS is the right choice when you want to **fully explore one path before trying others**.

---

## Common Variations

### BFS on Implicit Graphs

Sometimes the graph isn't given explicitly—you generate neighbors on the fly. Example: solving a Rubik's cube, where vertices are configurations and edges are moves.

```
bfs_implicit(start, is_goal, get_neighbors):
    visited = {start}
    queue = [start]

    while queue:
        current = queue.pop(0)
        if is_goal(current):
            return current
        for neighbor in get_neighbors(current):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return None
```

### Multi-Source BFS

Start from multiple sources simultaneously. Useful for:
- Finding the vertex farthest from all sources
- Voronoi diagrams on graphs
- "Rotten oranges" style problems

Just initialize the queue with all sources at distance 0.

### 0-1 BFS

When edge weights are only 0 or 1, you can modify BFS using a deque: add weight-0 neighbors to the front, weight-1 neighbors to the back. Still $O(V + E)$ but handles this special weighted case.

---

## The Intuition to Remember

BFS is **exploration by proximity**. It finds everything close before anything far. This makes it the natural algorithm when you care about distance.

The queue enforces this: vertices are processed in the order they're discovered, and closer vertices are always discovered before farther ones.

When you see "shortest path" and "unweighted graph," think BFS immediately.
