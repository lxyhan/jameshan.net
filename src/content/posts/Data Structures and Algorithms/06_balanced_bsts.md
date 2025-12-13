---
title: '6: Balanced Binary Search Trees'
pubDate: '2025-12-12'
---

BSTs store keys where left subtree < node < right subtree. This gives $O(\log n)$ search—if balanced. AVL trees maintain balance via rotations, guaranteeing $O(\log n)$ worst-case.

---

## Data Structure

```
DictNode:
  - key: Key
  - val: Object
  - left: Optional[DictNode]
  - right: Optional[DictNode]
  - height: Integer

SortDict:
  - root: Optional[DictNode]
```

---

## Basic Operations

```
search(node, key):
    if node is None: return None
    if key == node.key: return node
    if key < node.key: return search(node.left, key)
    else: return search(node.right, key)

inorder(node):  # visits keys in sorted order
    if node is None: return
    inorder(node.left)
    visit(node)
    inorder(node.right)
```

---

## AVL Property

> For every node, $|\text{height}(left) - \text{height}(right)| \leq 1$

```
balance_factor(node) = height(node.left) - height(node.right)
```

AVL property: $|bf| \leq 1$ for all nodes.

---

## Rotations

When $|bf| > 1$ after insert/delete, rotate to rebalance:

**Right Rotation** (bf = +2, left child bf ≥ 0):
```
      y              x
     / \            / \
    x   C   →      A   y
   / \                / \
  A   B              B   C
```

**Left Rotation** (bf = -2, right child bf ≤ 0): Mirror image.

**Double Rotations** (zig-zag cases):
- Left-Right: left-rotate child, then right-rotate node
- Right-Left: right-rotate child, then left-rotate node

---

## AVL Insert

```
avl_insert(node, key, val):
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

    update_height(node)
    return rebalance(node)

rebalance(node):
    bf = balance_factor(node)
    if bf > 1:  # left heavy
        if balance_factor(node.left) < 0:
            node.left = left_rotate(node.left)
        return right_rotate(node)
    if bf < -1:  # right heavy
        if balance_factor(node.right) > 0:
            node.right = right_rotate(node.right)
        return left_rotate(node)
    return node
```

---

## AVL Delete

```
avl_delete(node, key):
    if node is None: return None

    if key < node.key:
        node.left = avl_delete(node.left, key)
    else if key > node.key:
        node.right = avl_delete(node.right, key)
    else:
        # Found: handle 0, 1, or 2 children
        if node.left is None: return node.right
        if node.right is None: return node.left
        # Two children: replace with successor
        succ = find_min(node.right)
        node.key, node.val = succ.key, succ.val
        node.right = avl_delete(node.right, succ.key)

    update_height(node)
    return rebalance(node)
```

---

## Why O(log n)?

AVL property ensures minimum nodes $N(h)$ for height $h$:
$$N(h) = N(h-1) + N(h-2) + 1$$

Similar to Fibonacci → grows exponentially → $h = O(\log n)$.

More precisely: $h < 1.44 \log_2(n+2)$.

---

## Runtime

| Operation | Time |
|-----------|------|
| Search | $O(\log n)$ |
| Insert | $O(\log n)$ |
| Delete | $O(\log n)$ |
| In-order traversal | $O(n)$ |
| Find min/max | $O(\log n)$ |
| Range query | $O(\log n + k)$ |

All operations are $O(\log n)$ because tree height is $O(\log n)$.

---

## BST vs Hash Table

| | BST | Hash Table |
|--|-----|------------|
| Operations | $O(\log n)$ worst | $O(1)$ avg, $O(n)$ worst |
| Ordered iteration | $O(n)$ | $O(n \log n)$ |
| Range queries | $O(\log n + k)$ | $O(n)$ |
| Min/Max | $O(\log n)$ | $O(n)$ |

**Use BST** when you need ordering or worst-case guarantees.
