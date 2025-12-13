---
title: '7: Priority Queues and Heaps'
pubDate: '2025-12-12'
---

A **priority queue** supports insert and extract-min/max. Binary heaps implement this with $O(\log n)$ operations.

---

## Data Structure

```
QueueNode:
  - key: Key
  - val: Object
  - pri: Integer  # priority

Queue:
  - heap: List[QueueNode]
  - push(key, val, pri) -> QueueNode
  - pop() -> Optional[QueueNode]
  - peek() -> Optional[QueueNode]
```

---

## Heap Property

A **binary heap** is a complete binary tree where every parent has higher priority than its children.

- **Min-heap**: parent ≤ children. Root is minimum.
- **Max-heap**: parent ≥ children. Root is maximum.

---

## Array Representation

Complete binary tree → store in array without pointers.

For node at index $i$ (0-indexed):
- Parent: $\lfloor(i-1)/2\rfloor$
- Left child: $2i + 1$
- Right child: $2i + 2$

---

## Operations

### Push (Insert)

Add at end, bubble up:

```
push(key, val, pri):
    heap.append(QueueNode(key, val, pri))
    bubble_up(len(heap) - 1)

bubble_up(i):
    while i > 0:
        parent = (i - 1) / 2
        if heap[i].pri >= heap[parent].pri:
            break
        swap(heap[i], heap[parent])
        i = parent
```

### Pop (Extract)

Replace root with last, bubble down:

```
pop():
    result = heap[0]
    heap[0] = heap.pop_last()
    bubble_down(0)
    return result

bubble_down(i):
    while True:
        smallest = i
        left, right = 2*i + 1, 2*i + 2
        if left < len(heap) and heap[left].pri < heap[smallest].pri:
            smallest = left
        if right < len(heap) and heap[right].pri < heap[smallest].pri:
            smallest = right
        if smallest == i:
            break
        swap(heap[i], heap[smallest])
        i = smallest
```

---

## Heapify: Building a Heap

**Naive**: Insert one by one → $O(n \log n)$

**Bottom-up**: Bubble down from last non-leaf → $O(n)$

```
heapify(array):
    for i from len(array)/2 - 1 down to 0:
        bubble_down(i)
```

**Why O(n)?** Most nodes are near the bottom. Half are leaves (no work). Quarter are 1 level up (1 step max). The sum is $O(n)$.

---

## Runtime

| Operation | Time |
|-----------|------|
| peek | $O(1)$ |
| push | $O(\log n)$ |
| pop | $O(\log n)$ |
| heapify | $O(n)$ |

---

## Applications

- **CFS/Dijkstra**: Extract closest vertex
- **Prim's MST**: Extract closest vertex to tree
- **Heap sort**: Heapify + repeated extract → $O(n \log n)$

---

## Key Insight

Heaps maintain a **weaker invariant** than full sorting: only the min (or max) is at the root. This is cheaper to maintain but still gives efficient access to the extreme element.
