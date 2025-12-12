---
title: '9: Priority Queues and Heaps'
pubDate: '2025-12-12'
---

A **priority queue** is an abstract data type where each element has a priority, and you can efficiently:
- **Insert** an element with a given priority
- **Extract** the element with the highest (or lowest) priority

Priority queues power many algorithms: Dijkstra's shortest paths, Prim's MST, Huffman coding, task scheduling, and simulation systems.

The standard implementation is a **binary heap**—a beautifully simple structure that gives $O(\log n)$ insert and extract.

---

## The Data Structure

```
QueueNode:
  - key: Key           # identifier
  - val: Object        # payload
  - pri: Integer       # priority (smaller = higher priority for min-heap)

Queue:
  - heap: List[QueueNode]  # underlying array

  # Operations:
  - push(key, val, pri) -> QueueNode   # insert
  - pop() -> Optional[QueueNode]        # extract min/max
  - peek() -> Optional[QueueNode]       # view min/max without removing
```

---

## The Heap Property

A **binary heap** is a complete binary tree where every parent has higher priority than its children.

**Min-heap**: Parent's priority ≤ children's priorities. Root is minimum.
**Max-heap**: Parent's priority ≥ children's priorities. Root is maximum.

```
Min-heap example (priorities shown):

         1
        / \
       3   2
      / \   \
     7   4   5

Every parent is smaller than its children.
```

### Complete Binary Tree

A binary heap is a **complete binary tree**: all levels are fully filled except possibly the last, which is filled left to right.

This structure allows a clever optimization: store the tree in an **array** without explicit pointers.

---

## Array Representation

For a node at index $i$ (0-indexed):
- **Parent**: $\lfloor (i-1)/2 \rfloor$
- **Left child**: $2i + 1$
- **Right child**: $2i + 2$

```
Array: [1, 3, 2, 7, 4, 5]
Index:  0  1  2  3  4  5

Tree structure:
         1 (index 0)
        / \
       3   2  (indices 1, 2)
      / \   \
     7   4   5  (indices 3, 4, 5)

Parent of index 4: (4-1)/2 = 1 (value 3) ✓
Children of index 1: 2*1+1=3, 2*1+2=4 (values 7, 4) ✓
```

This array representation is:
- **Memory efficient**: No pointers needed
- **Cache friendly**: Sequential memory access
- **Simple navigation**: Parent/child via arithmetic

---

## Core Operations

### Peek

Return the root (min or max) without removing:

```
peek() -> Optional[QueueNode]:
    if heap is empty:
        return None
    return heap[0]
```

**Time: $O(1)$** — just return the first element.

### Push (Insert)

Add element at the end, then "bubble up" to restore heap property:

```
push(key: Key, val: Object, pri: Integer) -> QueueNode:
    node = QueueNode(key, val, pri)
    heap.append(node)
    bubble_up(len(heap) - 1)
    return node


bubble_up(index: Integer):
    while index > 0:
        parent = (index - 1) / 2

        if heap[index].pri >= heap[parent].pri:
            break  # Heap property satisfied

        # Swap with parent
        swap(heap[index], heap[parent])
        index = parent
```

**Time: $O(\log n)$** — at most, bubble up from leaf to root.

**Intuition**: New element might be smaller than its parent. Keep swapping up until it finds its proper place.

### Pop (Extract)

Remove and return the root. Replace with last element, then "bubble down":

```
pop() -> Optional[QueueNode]:
    if heap is empty:
        return None

    result = heap[0]

    # Move last element to root
    heap[0] = heap[len(heap) - 1]
    heap.remove_last()

    if heap is not empty:
        bubble_down(0)

    return result


bubble_down(index: Integer):
    size = len(heap)

    while True:
        smallest = index
        left = 2 * index + 1
        right = 2 * index + 2

        if left < size and heap[left].pri < heap[smallest].pri:
            smallest = left

        if right < size and heap[right].pri < heap[smallest].pri:
            smallest = right

        if smallest == index:
            break  # Heap property satisfied

        swap(heap[index], heap[smallest])
        index = smallest
```

**Time: $O(\log n)$** — at most, bubble down from root to leaf.

**Intuition**: After replacing root with the last element, the root might be larger than its children. Keep swapping down with the smaller child until heap property is restored.

---

## Trace Example

Insert 5, 3, 7, 1 into an empty min-heap:

**Insert 5:**
```
heap: [5]
```

**Insert 3:**
```
heap: [5, 3]
bubble_up(1): 3 < 5, swap
heap: [3, 5]
```

**Insert 7:**
```
heap: [3, 5, 7]
bubble_up(2): 7 > 3, done
heap: [3, 5, 7]

    3
   / \
  5   7
```

**Insert 1:**
```
heap: [3, 5, 7, 1]
bubble_up(3): 1 < 5, swap → [3, 1, 7, 5]
bubble_up(1): 1 < 3, swap → [1, 3, 7, 5]

    1
   / \
  3   7
 /
5
```

**Pop (extract min):**
```
Return 1
Replace root with last: [5, 3, 7]
bubble_down(0): 5 > 3, swap with smaller child
heap: [3, 5, 7]

    3
   / \
  5   7
```

---

## Building a Heap: Heapify

Given an unsorted array, convert it to a heap. Two approaches:

### Approach 1: Repeated Insertion

Insert elements one by one: $O(n \log n)$.

### Approach 2: Bottom-Up Heapify

Build in-place from the bottom: $O(n)$.

```
heapify(array: List[QueueNode]):
    heap = array  # Work in-place

    # Start from last non-leaf node
    for i from (len(heap) / 2 - 1) down to 0:
        bubble_down(i)
```

**Why O(n)?**

This is counterintuitive—we're doing $O(n)$ bubble-downs, each taking $O(\log n)$, so shouldn't it be $O(n \log n)$?

The key insight: **most nodes are near the bottom**.

- Half the nodes are leaves (bubble_down does nothing)
- A quarter are one level up (bubble_down at most 1 step)
- An eighth are two levels up (bubble_down at most 2 steps)
- ...

The total work:
$$\sum_{h=0}^{\log n} \frac{n}{2^{h+1}} \cdot h = O(n)$$

Most nodes only bubble down a small distance.

---

## Priority Queue Applications

### Dijkstra's Algorithm

The priority queue stores vertices by distance from source. We always extract the vertex with minimum distance—exactly what a min-heap provides.

```
dijkstra using priority queue:
    pq = Queue()
    pq.push(source, source, 0)

    while not pq.empty():
        node = pq.pop()  # Get closest unvisited vertex
        ...
        for neighbor:
            pq.push(neighbor, neighbor, new_distance)
```

### Prim's MST

Same idea: extract the vertex closest to the current tree.

### Event-Driven Simulation

Events are processed in order of their scheduled time. Insert events with their timestamp as priority; pop to get the next event.

### Task Scheduling

Jobs with priorities. Always run the highest-priority job next.

### Median Maintenance

Use two heaps: a max-heap for the lower half and a min-heap for the upper half. The median is accessible in $O(1)$.

---

## Decrease-Key Operation

Some algorithms (like Dijkstra) want to update a key's priority. With the basic heap, this is tricky because we don't know where a key is stored.

**Options:**

1. **Lazy approach**: Just insert a new entry with updated priority. When popping, check if it's outdated (already processed). This is what we do in our Dijkstra implementation.

2. **Position tracking**: Maintain a hash map from keys to heap indices. Update in $O(\log n)$.

3. **Fibonacci heap**: Amortized $O(1)$ decrease-key. Better theoretical bound for Dijkstra, but complex.

---

## Heap Sort

The heap structure enables a simple sorting algorithm:

```
heap_sort(array):
    heapify(array)               # O(n)
    result = []

    while heap not empty:
        result.append(pop())     # O(log n) each, O(n log n) total

    return result
```

**Total: $O(n \log n)$** — optimal comparison-based sorting.

**In-place variant**: Build a max-heap. Repeatedly swap root with last element, shrink heap, and bubble down. Sorts in ascending order without extra space.

---

## Runtime Summary

| Operation | Time |
|-----------|------|
| peek | $O(1)$ |
| push | $O(\log n)$ |
| pop | $O(\log n)$ |
| heapify (build heap) | $O(n)$ |
| decrease-key (with tracking) | $O(\log n)$ |

**Space: $O(n)$** for storing $n$ elements.

---

## Min-Heap vs Max-Heap

The choice depends on what you need to access quickly:
- **Min-heap**: Root is minimum. Use for Dijkstra, Prim, task scheduling by earliest deadline.
- **Max-heap**: Root is maximum. Use for heap sort (in-place ascending), task scheduling by highest priority.

To convert: negate priorities. If you have a min-heap library but need max-heap behavior, insert with priority `-pri` and interpret accordingly.

---

## Comparison with Other Structures

| | Binary Heap | Sorted Array | Unsorted Array | BST |
|--|-------------|--------------|----------------|-----|
| Insert | $O(\log n)$ | $O(n)$ | $O(1)$ | $O(\log n)$ |
| Find min | $O(1)$ | $O(1)$ | $O(n)$ | $O(\log n)$ |
| Extract min | $O(\log n)$ | $O(1)$ or $O(n)$ | $O(n)$ | $O(\log n)$ |
| Build from $n$ elements | $O(n)$ | $O(n \log n)$ | $O(n)$ | $O(n \log n)$ |

Heaps win when you need **frequent insert and extract-min**. If you mostly insert, unsorted array is better. If you mostly extract, sorted array might work.

---

## The Intuition to Remember

A binary heap is a **complete binary tree stored in an array** with the **heap property**: every parent has higher priority than its children.

The root is always the highest-priority element, giving $O(1)$ access.

Modifications ($O(\log n)$) maintain the heap property by:
- **Bubble up**: New element rises to its correct position
- **Bubble down**: Replacement element sinks to its correct position

The tree height is $\log n$ (complete binary tree), so bubbling takes $O(\log n)$.

**The key insight**: Heaps don't maintain full ordering—just the min (or max) at the root. This weaker invariant is cheaper to maintain than full sorting, but still gives efficient access to the extreme element.
