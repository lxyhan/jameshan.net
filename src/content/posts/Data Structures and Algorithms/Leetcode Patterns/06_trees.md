---
title: 'Trees'
pubDate: '2025-01-24'
---

Tree problems are recursion problems. The key insight: solve for the current node assuming you've already solved for children. Most solutions are variations of DFS traversals.

---

## Tree Node Structure

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

---

## Pattern 1: Tree Traversals

**Preorder (Root → Left → Right):**
```python
def preorder(root):
    if not root:
        return []
    return [root.val] + preorder(root.left) + preorder(root.right)
```

**Inorder (Left → Root → Right):** For BST, gives sorted order.
```python
def inorder(root):
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)
```

**Postorder (Left → Right → Root):** Process children before parent.
```python
def postorder(root):
    if not root:
        return []
    return postorder(root.left) + postorder(root.right) + [root.val]
```

**Level-order (BFS):**
```python
from collections import deque

def level_order(root):
    if not root:
        return []

    result = []
    queue = deque([root])

    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)

    return result
```

---

## Pattern 2: Tree Properties (Height, Depth, Balance)

**Maximum Depth:**
```python
def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))
```

**Balanced Tree Check:**
```python
def is_balanced(root):
    def height(node):
        if not node:
            return 0

        left_h = height(node.left)
        right_h = height(node.right)

        if left_h == -1 or right_h == -1:
            return -1  # already unbalanced
        if abs(left_h - right_h) > 1:
            return -1

        return 1 + max(left_h, right_h)

    return height(root) != -1
```

**Diameter (longest path between any two nodes):**
```python
def diameter(root):
    max_diameter = 0

    def height(node):
        nonlocal max_diameter
        if not node:
            return 0

        left_h = height(node.left)
        right_h = height(node.right)

        # Path through this node
        max_diameter = max(max_diameter, left_h + right_h)

        return 1 + max(left_h, right_h)

    height(root)
    return max_diameter
```

---

## Pattern 3: Path Problems

**Path Sum (root to leaf):**
```python
def has_path_sum(root, target):
    if not root:
        return False

    if not root.left and not root.right:  # leaf
        return root.val == target

    remaining = target - root.val
    return has_path_sum(root.left, remaining) or has_path_sum(root.right, remaining)
```

**All Root-to-Leaf Paths:**
```python
def binary_tree_paths(root):
    if not root:
        return []

    paths = []

    def dfs(node, path):
        if not node.left and not node.right:
            paths.append(path + [node.val])
            return

        if node.left:
            dfs(node.left, path + [node.val])
        if node.right:
            dfs(node.right, path + [node.val])

    dfs(root, [])
    return paths
```

**Maximum Path Sum (any path):**
```python
def max_path_sum(root):
    max_sum = float('-inf')

    def max_gain(node):
        nonlocal max_sum
        if not node:
            return 0

        # Max gain from left/right subtrees (take 0 if negative)
        left_gain = max(max_gain(node.left), 0)
        right_gain = max(max_gain(node.right), 0)

        # Path through this node
        path_sum = node.val + left_gain + right_gain
        max_sum = max(max_sum, path_sum)

        # Return max gain if we continue upward
        return node.val + max(left_gain, right_gain)

    max_gain(root)
    return max_sum
```

---

## Pattern 4: Tree Construction

**Build from Preorder + Inorder:**
```python
def build_tree(preorder, inorder):
    if not preorder:
        return None

    root_val = preorder[0]
    root = TreeNode(root_val)

    mid = inorder.index(root_val)

    root.left = build_tree(preorder[1:mid + 1], inorder[:mid])
    root.right = build_tree(preorder[mid + 1:], inorder[mid + 1:])

    return root
```

**Serialize and Deserialize:**
```python
def serialize(root):
    if not root:
        return "null"
    return f"{root.val},{serialize(root.left)},{serialize(root.right)}"

def deserialize(data):
    nodes = iter(data.split(","))

    def build():
        val = next(nodes)
        if val == "null":
            return None
        node = TreeNode(int(val))
        node.left = build()
        node.right = build()
        return node

    return build()
```

---

## Pattern 5: Lowest Common Ancestor (LCA)

**LCA in Binary Tree:**
```python
def lowest_common_ancestor(root, p, q):
    if not root or root == p or root == q:
        return root

    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)

    if left and right:
        return root  # p and q are in different subtrees
    return left or right  # both in same subtree
```

**LCA in BST:** Use BST property.
```python
def lca_bst(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root
    return None
```

---

## Pattern 6: BST Operations

**Validate BST:**
```python
def is_valid_bst(root):
    def valid(node, min_val, max_val):
        if not node:
            return True

        if node.val <= min_val or node.val >= max_val:
            return False

        return valid(node.left, min_val, node.val) and \
               valid(node.right, node.val, max_val)

    return valid(root, float('-inf'), float('inf'))
```

**Kth Smallest in BST:** Inorder traversal gives sorted order.
```python
def kth_smallest(root, k):
    stack = []
    current = root

    while stack or current:
        while current:
            stack.append(current)
            current = current.left

        current = stack.pop()
        k -= 1
        if k == 0:
            return current.val

        current = current.right

    return -1
```

**Insert into BST:**
```python
def insert_bst(root, val):
    if not root:
        return TreeNode(val)

    if val < root.val:
        root.left = insert_bst(root.left, val)
    else:
        root.right = insert_bst(root.right, val)

    return root
```

---

## Pattern 7: Tree Comparison

**Same Tree:**
```python
def is_same_tree(p, q):
    if not p and not q:
        return True
    if not p or not q:
        return False
    return p.val == q.val and \
           is_same_tree(p.left, q.left) and \
           is_same_tree(p.right, q.right)
```

**Symmetric Tree:**
```python
def is_symmetric(root):
    def is_mirror(t1, t2):
        if not t1 and not t2:
            return True
        if not t1 or not t2:
            return False
        return t1.val == t2.val and \
               is_mirror(t1.left, t2.right) and \
               is_mirror(t1.right, t2.left)

    return is_mirror(root, root)
```

**Subtree of Another Tree:**
```python
def is_subtree(root, sub_root):
    if not root:
        return False
    if is_same_tree(root, sub_root):
        return True
    return is_subtree(root.left, sub_root) or is_subtree(root.right, sub_root)
```

---

## Pattern 8: Tree Modification

**Invert Binary Tree:**
```python
def invert_tree(root):
    if not root:
        return None

    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root
```

**Flatten to Linked List (preorder):**
```python
def flatten(root):
    if not root:
        return

    flatten(root.left)
    flatten(root.right)

    # Save right subtree
    right_subtree = root.right

    # Move left to right
    root.right = root.left
    root.left = None

    # Attach right subtree at the end
    current = root
    while current.right:
        current = current.right
    current.right = right_subtree
```

---

## Common Problems

| Problem | Pattern | Time |
|---------|---------|------|
| Max Depth | Recursion | $O(n)$ |
| Balanced Tree | Height check | $O(n)$ |
| Diameter | Path through node | $O(n)$ |
| Path Sum | Root-to-leaf DFS | $O(n)$ |
| Max Path Sum | Any path DFS | $O(n)$ |
| LCA | Find in subtrees | $O(n)$ |
| Validate BST | Range checking | $O(n)$ |
| Level Order | BFS | $O(n)$ |
| Serialize/Deserialize | Preorder | $O(n)$ |

---

## Key Insights

1. **Think recursively**: Solve for current node assuming children are solved. Base case is null node.

2. **Return vs update global**: Some problems need to return values up (height), others update a global (diameter).

3. **Preorder for top-down, postorder for bottom-up**: Choose traversal based on what info you need when.

4. **BST = inorder is sorted**: Many BST problems reduce to "kth element in sorted order."

5. **BFS for level-related problems**: Shortest path, level order, rightmost node per level.

6. **Path problems need careful state**: Track running sum, path so far, or other state as you recurse.
