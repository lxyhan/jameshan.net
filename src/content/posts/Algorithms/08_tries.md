---
title: '8: Tries'
pubDate: '2025-12-12'
---

A **trie** stores strings character-by-character. Strings with common prefixes share paths. Operations are $O(k)$ where $k$ is string length—independent of how many strings are stored.

---

## Data Structure

```
TrieNode:
  - key: Key
  - val: Object  # non-None marks end of word
  - children: Dictionary[String, TrieNode]

Trie:
  - root: Optional[TrieNode]
```

---

## Operations

### Insert

```
insert(key, val):
    node = root
    for char in key:
        if char not in node.children:
            node.children[char] = TrieNode(char, None)
        node = node.children[char]
    node.val = val  # mark end of word
```

### Search

```
get(key):
    node = root
    for char in key:
        if char not in node.children:
            return None
        node = node.children[char]
    return node if node.val is not None else None
```

### Prefix Search

```
starts_with(prefix):
    node = root
    for char in prefix:
        if char not in node.children:
            return False
        node = node.children[char]
    return True
```

### Autocomplete

```
autocomplete(prefix):
    node = root
    for char in prefix:
        if char not in node.children:
            return []
        node = node.children[char]
    return collect_all_words(node, prefix)
```

---

## Runtime

| Operation | Time |
|-----------|------|
| Insert | $O(k)$ |
| Search | $O(k)$ |
| Delete | $O(k)$ |
| Prefix search | $O(k)$ |
| Autocomplete | $O(k + m)$ |

$k$ = string length, $m$ = total chars in results.

**Space**: $O(n \cdot k)$ worst case, better with shared prefixes.

---

## Trie vs Hash Table vs BST

| | Trie | Hash Table | BST |
|--|------|------------|-----|
| Search | $O(k)$ | $O(k)$ avg | $O(k \log n)$ |
| Prefix search | $O(k)$ | $O(nk)$ | complex |

Tries win for **prefix operations**.

---

## Key Insight

Operations depend on string length $k$, not on number of strings $n$. Prefix operations are trivial: walk to the prefix node, and all descendants are matches.
