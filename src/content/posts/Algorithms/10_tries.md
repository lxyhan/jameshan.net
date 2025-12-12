---
title: '10: Tries'
pubDate: '2025-12-12'
---

A **trie** (pronounced "try," from re**trie**val) is a tree structure for storing strings where each node represents a character. Strings with common prefixes share the same path from the root.

Tries excel at **prefix operations**: finding all strings that start with a given prefix, autocomplete, spell checking, and IP routing.

---

## The Core Idea

Instead of storing complete strings as keys, a trie stores strings **character by character**. Each path from root to a node spells out a prefix.

```
Storing: "cat", "car", "card", "care", "dog"

         (root)
         /    \
        c      d
        |      |
        a      o
       /|\     |
      t r e    g*
      * |\ \
        d* e*

* marks end of a word
```

"cat" and "car" share the path "c-a". "card" and "care" share "c-a-r".

---

## The Data Structure

```
TrieNode:
  - key: Key                              # the character at this node
  - val: Object                           # value (if this node ends a word)
  - children: Dictionary[String, TrieNode] # child nodes

Trie:
  - root: Optional[TrieNode]

  # Operations:
  - insert(key, val) -> TrieNode
  - get(key) -> Optional[TrieNode]
  - delete(key) -> Optional[TrieNode]
```

Note: `val` being non-None typically indicates this node represents a complete word.

---

## Basic Operations

### Insert

Traverse the trie, creating nodes as needed:

```
insert(key: String, val: Object) -> TrieNode:
    if root is None:
        root = TrieNode("", None)

    node = root

    for char in key:
        if char not in node.children:
            node.children[char] = TrieNode(char, None)
        node = node.children[char]

    node.val = val  # Mark end of word
    return node
```

**Time: $O(k)$** where $k$ is the length of the string.

### Get (Search)

Traverse the trie following the characters:

```
get(key: String) -> Optional[TrieNode]:
    node = root

    for char in key:
        if node is None or char not in node.children:
            return None
        node = node.children[char]

    # Return node only if it's a complete word
    if node is not None and node.val is not None:
        return node
    return None
```

**Time: $O(k)$** where $k$ is the length of the string.

### Delete

Remove a word (but preserve shared prefixes):

```
delete(key: String) -> Optional[TrieNode]:
    return delete_helper(root, key, 0)


delete_helper(node: TrieNode, key: String, depth: Integer) -> Optional[TrieNode]:
    if node is None:
        return None

    if depth == len(key):
        # Reached end of key
        if node.val is not None:
            deleted = node
            node.val = None  # Unmark as word
            return deleted
        return None

    char = key[depth]
    if char in node.children:
        result = delete_helper(node.children[char], key, depth + 1)

        # Clean up: remove child if it's no longer needed
        child = node.children[char]
        if child.val is None and len(child.children) == 0:
            del node.children[char]

        return result

    return None
```

**Time: $O(k)$** where $k$ is the length of the string.

---

## Trace Example

Insert "cat", "car", "card":

**Insert "cat":**
```
root
└── c
    └── a
        └── t (val="cat")
```

**Insert "car":**
```
root
└── c
    └── a
        ├── t (val="cat")
        └── r (val="car")
```

**Insert "card":**
```
root
└── c
    └── a
        ├── t (val="cat")
        └── r (val="car")
            └── d (val="card")
```

**Search "car":** Follow c → a → r, find val="car". Found!

**Search "ca":** Follow c → a, val is None. Not found (not a complete word).

**Delete "car":** Follow c → a → r, set val to None. Node "r" remains because "card" still needs it.

---

## Prefix Operations

The trie's superpower is prefix operations.

### Prefix Search

Check if any word starts with a given prefix:

```
starts_with(prefix: String) -> Boolean:
    node = root

    for char in prefix:
        if node is None or char not in node.children:
            return False
        node = node.children[char]

    return node is not None
```

**Time: $O(k)$** where $k$ is the prefix length.

### Autocomplete

Find all words with a given prefix:

```
autocomplete(prefix: String) -> List[String]:
    # Find the node for the prefix
    node = root
    for char in prefix:
        if node is None or char not in node.children:
            return []
        node = node.children[char]

    # Collect all words from this node
    results = []
    collect_words(node, prefix, results)
    return results


collect_words(node: TrieNode, current: String, results: List):
    if node.val is not None:
        results.append(current)

    for char, child in node.children:
        collect_words(child, current + char, results)
```

**Time: $O(k + m)$** where $k$ is prefix length and $m$ is total characters in all matching words.

---

## Runtime Analysis

Let $k$ = length of the key/string, $n$ = number of strings stored.

| Operation | Time |
|-----------|------|
| Insert | $O(k)$ |
| Search | $O(k)$ |
| Delete | $O(k)$ |
| Prefix search | $O(k)$ |
| Autocomplete | $O(k + m)$ |

**Key insight**: Operations depend on string length, not on how many strings are stored. This is different from hash tables or BSTs where operations depend on $n$.

### Space Complexity

**Worst case: $O(n \cdot k)$** — if no strings share prefixes.

**Best case (many shared prefixes):** Much less. English dictionary words, for example, share many prefixes.

Each node stores:
- The character (constant)
- A value (if word ends here)
- Children dictionary (up to alphabet size entries)

---

## Comparison with Other Structures

| | Trie | Hash Table | BST |
|--|------|------------|-----|
| Search | $O(k)$ | $O(k)$ avg | $O(k \log n)$ |
| Insert | $O(k)$ | $O(k)$ avg | $O(k \log n)$ |
| Prefix search | $O(k)$ | $O(n \cdot k)$ | $O(k \log n)$ |
| Autocomplete | $O(k + m)$ | $O(n \cdot k)$ | complex |
| Space | $O(n \cdot k)$ | $O(n \cdot k)$ | $O(n \cdot k)$ |

**Why $O(k)$ for tries?** We do constant work per character.

**Why $O(k)$ for hash tables?** Hash function must read entire string.

**Why $O(k \log n)$ for BSTs?** Each comparison is $O(k)$, and we do $O(\log n)$ comparisons.

Tries win when prefix operations matter.

---

## Applications

### Autocomplete

Type "prog" and see "program", "programming", "progress". The trie finds the prefix node in $O(k)$, then collects all descendants.

### Spell Checking

Store a dictionary in a trie. To check a word, search in $O(k)$. For suggestions, do fuzzy matching from prefix nodes.

### IP Routing (Longest Prefix Match)

Routers store IP prefixes in tries. Given a destination IP, find the longest matching prefix to determine where to route.

```
192.168.0.0/16  → Router A
192.168.1.0/24  → Router B
192.168.1.128/25 → Router C

IP 192.168.1.200 matches all three, but longest prefix (Router C) wins.
```

### T9 Predictive Text

Old phone keyboards: 2=ABC, 3=DEF, etc. Map each key sequence to possible words using a trie.

### Genome Sequencing

DNA sequences are strings over {A, C, G, T}. Tries efficiently store and search genomic data.

---

## Variations

### Compressed Trie (Radix Tree)

Compress chains of single-child nodes:

```
Standard trie for "romane", "romanus", "romulus":

      r
      |
      o
      |
      m
     /|\
    a u ...
    |
    n
   /|
  e us

Compressed:

      rom
      / \
    an   ulus
    /\
   e  us
```

Saves space when strings share long prefixes but branch rarely.

### Suffix Trie/Tree

Store all suffixes of a string. Enables powerful substring operations in $O(k)$.

### Ternary Search Trie

Each node has three children: less than, equal to, greater than. More space-efficient than standard tries for sparse alphabets.

---

## Implementation Considerations

### Children Storage

The `children` dictionary can be:
- **Hash map**: $O(1)$ child lookup, flexible alphabet
- **Array of size 26**: $O(1)$ lookup, wastes space for sparse nodes
- **Sorted list**: $O(\log A)$ lookup where $A$ is alphabet size, compact

For ASCII characters, a fixed array is common:
```
children: [TrieNode; 26]  # index 0 = 'a', index 25 = 'z'
```

### End-of-Word Marker

Options:
- Boolean `is_end` flag
- `val` being non-None
- Special terminator character

---

## The Intuition to Remember

A trie is a **prefix tree**: strings sharing a prefix share a path. This makes prefix operations trivial—just walk to the prefix node and you have access to all words with that prefix.

The key insight: **operations are $O(k)$ regardless of $n$**. Whether you have 100 words or 100 million, searching for a 10-character string takes the same time.

This is unlike hash tables (where hash computation is $O(k)$ but collisions depend on $n$) and BSTs (where comparisons are $O(k)$ but tree depth is $O(\log n)$).

**When you see "prefix," "autocomplete," or "dictionary of strings," think trie.**
