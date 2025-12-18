---
title: '5: Hash Tables'
pubDate: '2025-12-12'
---

Hash tables implement dictionaries with **$O(1)$ average** insert, lookup, and delete. The tradeoff: no ordering, and worst-case is $O(n)$.

---

## Core Idea

Convert keys to array indices via a **hash function**:
```python
index = hash(key) mod capacity
```

**Collisions** occur when two keys hash to the same index.

---

## Data Structure

```python
DictNode:
  - key: String
  - val: Object
  - next: Optional[DictNode]  # for chaining

Dict:
  - table: List[Optional[DictNode]]
  - size: Integer
  - capacity: Integer
  - hash_func: Callable[[String], Integer]
```

---

## Collision Resolution: Chaining

Each bucket is a linked list of all elements that hash to that index.

```python
insert(key, val):
    index = hash_func(key) mod capacity
    # Search bucket for existing key
    node = table[index]
    while node is not None:
        if node.key == key:
            node.val = val
            return node
        node = node.next
    # Prepend new node
    new_node = DictNode(key, val)
    new_node.next = table[index]
    table[index] = new_node
    size += 1

get(key):
    index = hash_func(key) mod capacity
    node = table[index]
    while node is not None:
        if node.key == key:
            return node
        node = node.next
    return None
```

---

## Load Factor

$$\alpha = \frac{n}{m} = \frac{\text{elements}}{\text{capacity}}$$

- Higher $\alpha$ → more collisions → slower
- Resize (double capacity, rehash all) when $\alpha > 0.75$

Resizing is $O(n)$ but amortized $O(1)$ per insertion.

---

## Runtime

| Operation | Average | Worst |
|-----------|---------|-------|
| insert | $O(1)$ | $O(n)$ |
| get | $O(1)$ | $O(n)$ |
| delete | $O(1)$ | $O(n)$ |

**Why average O(1)**: With good hashing, elements distribute uniformly. Expected bucket length is $\alpha$. Bounded $\alpha$ means $O(1)$.

**Why worst O(n)**: All keys could hash to one bucket.

---

## Universal Hashing

A **universal hash family** guarantees: for any two distinct keys, $P(\text{collision}) \leq 1/m$ when hash function is chosen randomly.

$$h_{a,b}(k) = ((ak + b) \mod p) \mod m$$

Provides expected $O(1)$ regardless of input distribution.

---

## Hash Table vs BST

| | Hash Table | Balanced BST |
|--|------------|--------------|
| Insert/Lookup/Delete | $O(1)$ avg | $O(\log n)$ |
| Ordered iteration | $O(n \log n)$ | $O(n)$ |
| Range queries | $O(n)$ | $O(\log n + k)$ |
| Worst case | $O(n)$ | $O(\log n)$ |

**Use hash tables** when you only need key-based operations and don't need ordering.
