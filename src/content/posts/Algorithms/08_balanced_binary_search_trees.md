---
title: '8: Balanced Binary Search Trees'
pubDate: '2025-12-12'
---

A **Binary Search Tree (BST)** stores keys in a tree where every node's left subtree contains smaller keys and right subtree contains larger keys. This ordering enables $O(\log n)$ search—if the tree is balanced.

The problem: basic BSTs can become unbalanced, degrading to $O(n)$ operations. **Balanced BSTs** automatically maintain balance, guaranteeing $O(\log n)$ for all operations.

---

## The BST Property

For every node with key $k$:
- All keys in the left subtree are $< k$
- All keys in the right subtree are $> k$

This invariant makes search efficient: at each node, we know which subtree to explore.

```
        8
       / \
      3   10
     / \    \
    1   6    14
       / \   /
      4   7 13
```

To find 7: Start at 8 → go left (7 < 8) → at 3 → go right (7 > 3) → at 6 → go right (7 > 6) → found!

---

## The Data Structure

```
DictNode:
  - key: Key                     # the key
  - val: Object                  # the value
  - left: Optional[DictNode]     # left child
  - right: Optional[DictNode]    # right child
  - height: Integer              # for balancing (AVL trees)

SortDict:
  - root: Optional[DictNode]

  # Operations:
  - insert(key, val) -> DictNode
  - get(key) -> Optional[DictNode]
  - delete(key) -> Optional[DictNode]
  - keys() -> List[Key]          # returns keys in sorted order
```

---

## Basic Operations

### Search

```
get(key: Key) -> Optional[DictNode]:
    return search(root, key)

search(node: DictNode, key: Key) -> Optional[DictNode]:
    if node is None:
        return None

    if key == node.key:
        return node
    else if key < node.key:
        return search(node.left, key)
    else:
        return search(node.right, key)
```

At each step, we eliminate half the remaining nodes (in a balanced tree).

### Insert (Naive)

```
insert(key: Key, val: Object) -> DictNode:
    root = insert_node(root, key, val)
    return get(key)

insert_node(node: DictNode, key: Key, val: Object) -> DictNode:
    if node is None:
        return DictNode(key, val)

    if key == node.key:
        node.val = val  # Update existing
    else if key < node.key:
        node.left = insert_node(node.left, key, val)
    else:
        node.right = insert_node(node.right, key, val)

    return node
```

### In-Order Traversal

The BST property means in-order traversal visits keys in sorted order:

```
keys() -> List[Key]:
    result = []
    inorder(root, result)
    return result

inorder(node: DictNode, result: List):
    if node is None:
        return

    inorder(node.left, result)
    result.append(node.key)
    inorder(node.right, result)
```

This is the key advantage of BSTs over hash tables: **ordered iteration** is $O(n)$.

---

## The Balance Problem

Without balancing, BSTs can degenerate. Insert 1, 2, 3, 4, 5 in order:

```
1
 \
  2
   \
    3
     \
      4
       \
        5
```

This is effectively a linked list. Search takes $O(n)$.

**Balanced BSTs** maintain the invariant that the tree height is $O(\log n)$, guaranteeing efficient operations.

---

## AVL Trees

AVL trees (named after Adelson-Velsky and Landis) maintain balance using **height information**:

> For every node, the heights of its left and right subtrees differ by at most 1.

This is the **AVL property** or **balance factor** constraint.

### Balance Factor

```
balance_factor(node) = height(node.left) - height(node.right)
```

AVL property: $|balance\_factor(node)| \leq 1$ for all nodes.

### Height Update

After any modification, update heights bottom-up:

```
update_height(node: DictNode):
    left_h = height(node.left)   # -1 if None
    right_h = height(node.right)
    node.height = 1 + max(left_h, right_h)

height(node: DictNode) -> Integer:
    if node is None:
        return -1
    return node.height
```

---

## Rotations

When the AVL property is violated, we **rotate** to rebalance. There are four cases, handled by two types of rotations.

### Right Rotation

When left subtree is too tall (balance factor = +2) and left child is left-heavy or balanced:

```
        y                    x
       / \                  / \
      x   C    ──────>     A   y
     / \                      / \
    A   B                    B   C
```

```
right_rotate(y: DictNode) -> DictNode:
    x = y.left
    B = x.right

    x.right = y
    y.left = B

    update_height(y)
    update_height(x)

    return x  # new root of subtree
```

### Left Rotation

Mirror image—when right subtree is too tall:

```
      x                      y
     / \                    / \
    A   y      ──────>     x   C
       / \                / \
      B   C              A   B
```

```
left_rotate(x: DictNode) -> DictNode:
    y = x.right
    B = y.left

    y.left = x
    x.right = B

    update_height(x)
    update_height(y)

    return y
```

### The Four Cases

After insertion or deletion, check balance factor and rotate:

| Balance Factor | Child's Balance | Action |
|----------------|-----------------|--------|
| +2 (left heavy) | ≥ 0 (left-heavy or balanced) | Right rotate |
| +2 (left heavy) | < 0 (right-heavy) | Left-Right rotate |
| -2 (right heavy) | ≤ 0 (right-heavy or balanced) | Left rotate |
| -2 (right heavy) | > 0 (left-heavy) | Right-Left rotate |

### Double Rotations

Left-Right rotation (for zig-zag case):
```
      z                z                  y
     /                /                 /   \
    x       →        y        →        x     z
     \              /
      y            x
```

First left-rotate x, then right-rotate z.

```
left_right_rotate(z: DictNode) -> DictNode:
    z.left = left_rotate(z.left)
    return right_rotate(z)
```

Right-Left is the mirror image.

---

## AVL Insert

```
insert(key: Key, val: Object) -> DictNode:
    root = avl_insert(root, key, val)
    return get(key)

avl_insert(node: DictNode, key: Key, val: Object) -> DictNode:
    # Standard BST insert
    if node is None:
        return DictNode(key, val, height=0)

    if key < node.key:
        node.left = avl_insert(node.left, key, val)
    else if key > node.key:
        node.right = avl_insert(node.right, key, val)
    else:
        node.val = val
        return node

    # Update height
    update_height(node)

    # Rebalance
    return rebalance(node)


rebalance(node: DictNode) -> DictNode:
    bf = balance_factor(node)

    # Left heavy
    if bf > 1:
        if balance_factor(node.left) < 0:
            node.left = left_rotate(node.left)  # Left-Right case
        return right_rotate(node)

    # Right heavy
    if bf < -1:
        if balance_factor(node.right) > 0:
            node.right = right_rotate(node.right)  # Right-Left case
        return left_rotate(node)

    return node  # Already balanced
```

---

## AVL Delete

Deletion is more complex because removing a node can unbalance ancestors:

```
delete(key: Key) -> Optional[DictNode]:
    deleted = get(key)
    if deleted is not None:
        root = avl_delete(root, key)
    return deleted

avl_delete(node: DictNode, key: Key) -> Optional[DictNode]:
    if node is None:
        return None

    if key < node.key:
        node.left = avl_delete(node.left, key)
    else if key > node.key:
        node.right = avl_delete(node.right, key)
    else:
        # Found node to delete
        if node.left is None:
            return node.right
        if node.right is None:
            return node.left

        # Two children: replace with in-order successor
        successor = find_min(node.right)
        node.key = successor.key
        node.val = successor.val
        node.right = avl_delete(node.right, successor.key)

    update_height(node)
    return rebalance(node)


find_min(node: DictNode) -> DictNode:
    while node.left is not None:
        node = node.left
    return node
```

---

## Why AVL Trees are O(log n)

The AVL property guarantees the tree stays balanced:

**Claim**: An AVL tree with $n$ nodes has height $O(\log n)$.

**Intuition**: Let $N(h)$ be the minimum number of nodes in an AVL tree of height $h$.

- $N(0) = 1$ (single node)
- $N(1) = 2$ (root plus one child)
- $N(h) = N(h-1) + N(h-2) + 1$ (root plus two subtrees, which differ in height by at most 1)

This is similar to the Fibonacci sequence. It grows exponentially, meaning $h = O(\log n)$.

More precisely: $h < 1.44 \log_2(n+2)$. AVL trees are at most 44% taller than perfectly balanced trees.

---

## Runtime Summary

| Operation | Time | Why |
|-----------|------|-----|
| Search | $O(\log n)$ | Tree height is $O(\log n)$ |
| Insert | $O(\log n)$ | Search + $O(1)$ rotations |
| Delete | $O(\log n)$ | Search + $O(\log n)$ rotations |
| In-order traversal | $O(n)$ | Visit each node once |
| Find min/max | $O(\log n)$ | Go left/right to leaf |
| Range query | $O(\log n + k)$ | Find start + visit $k$ elements |

**Space**: $O(n)$ for $n$ nodes.

---

## BSTs vs Hash Tables

| | BST (Balanced) | Hash Table |
|--|----------------|------------|
| Search | $O(\log n)$ guaranteed | $O(1)$ average, $O(n)$ worst |
| Insert | $O(\log n)$ guaranteed | $O(1)$ average, $O(n)$ worst |
| Delete | $O(\log n)$ guaranteed | $O(1)$ average, $O(n)$ worst |
| Ordered iteration | $O(n)$ | $O(n \log n)$ (must sort) |
| Find min/max | $O(\log n)$ | $O(n)$ |
| Range queries | $O(\log n + k)$ | $O(n)$ |
| Space | $O(n)$ | $O(n)$ |

**Use BSTs when** you need ordering, range queries, or guaranteed worst-case bounds.

**Use hash tables when** you only need insert/search/delete and want average-case $O(1)$.

---

## Other Balanced BSTs

### Red-Black Trees

Another self-balancing BST, used in most standard library implementations (C++ `std::map`, Java `TreeMap`).

- Slightly less strictly balanced than AVL
- Faster insertions/deletions (fewer rotations on average)
- Same $O(\log n)$ guarantees

### B-Trees

Generalization of BSTs where nodes can have many children. Optimized for disk access.

- Used in databases and file systems
- Each node holds many keys (reducing tree height)
- $O(\log_B n)$ disk accesses where $B$ is the branching factor

---

## Practical Notes

### When to Implement Yourself

Usually, never. Standard libraries have well-tested, highly optimized implementations:
- Python: No built-in BST, use `sortedcontainers` library
- Java: `TreeMap`, `TreeSet`
- C++: `std::map`, `std::set`

### Augmenting BSTs

BSTs can be augmented to support additional operations:
- **Order statistics**: Find the $k$-th smallest element in $O(\log n)$ by storing subtree sizes
- **Interval trees**: Find all intervals overlapping a point
- **Range sums**: Query the sum of values in a key range

---

## The Intuition to Remember

BSTs maintain sorted order via the BST property: left is smaller, right is larger. This enables $O(\log n)$ search by eliminating half the keys at each step.

The catch: without balancing, BSTs can degenerate to linked lists.

AVL trees fix this by:
1. Tracking heights at each node
2. Rotating to restore balance after modifications

The result: **guaranteed $O(\log n)$ for all operations**, plus the ability to iterate in sorted order and answer range queries efficiently.

When you need a sorted dictionary with worst-case guarantees, balanced BSTs are the answer.
