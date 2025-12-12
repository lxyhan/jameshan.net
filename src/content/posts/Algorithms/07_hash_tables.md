---
title: '7: Hash Tables'
pubDate: '2025-12-12'
---

A **hash table** implements a dictionary: a collection of key-value pairs supporting insert, lookup, and delete. The magic of hash tables is that these operations are **$O(1)$ on average**—constant time regardless of how many elements you store.

The tradeoff: hash tables don't maintain any ordering, and the $O(1)$ is average-case, not worst-case.

---

## The Core Idea

An array gives $O(1)$ access by index. A hash table gives $O(1)$ access by key.

The trick: convert the key into an array index using a **hash function**.

```
key → hash(key) → index → array[index]
```

If we could perfectly map each key to a unique index, we'd have $O(1)$ operations always. But that's impossible when the key space is larger than the array. Instead, we handle **collisions**—when two keys map to the same index.

---

## The Data Structure

```
DictNode:
  - key: String              # the key
  - val: Object              # the value
  - next: Optional[DictNode] # for chaining (next node in bucket)

Dict:
  - table: List[Optional[DictNode]]  # array of buckets
  - size: Integer                     # number of elements stored
  - capacity: Integer                 # current array size
  - hash_func: Callable[[String], Integer]

  # Operations:
  - insert(key, val) -> DictNode
  - get(key) -> Optional[DictNode]
  - delete(key) -> Optional[DictNode]
  - keys() -> List[String]
```

---

## Hash Functions

A hash function maps keys to integers. A good hash function:
1. **Is deterministic**: Same key always produces same hash
2. **Distributes uniformly**: Keys spread evenly across the table
3. **Is fast**: Computing the hash should be quick

### Computing the Index

```
index = hash(key) mod capacity
```

The modulo ensures the index fits in our array.

### Example: String Hashing

A common approach for strings:

```
hash(s: String) -> Integer:
    h = 0
    for char in s:
        h = 31 * h + ord(char)
    return h
```

The multiplier (31) spreads the hash values. Different strings produce different hashes (usually).

### The Avalanche Effect

Good hash functions have the "avalanche effect": a small change in input causes a large change in output. "cat" and "cats" should hash to completely different values.

---

## Collision Resolution

When two keys hash to the same index, we have a collision. Two main strategies:

### Chaining (Separate Chaining)

Each bucket holds a **linked list** of all elements that hash to that index.

```
table[0]: → (key1, val1) → (key5, val5) → None
table[1]: → (key2, val2) → None
table[2]: → None
table[3]: → (key3, val3) → (key4, val4) → (key6, val6) → None
...
```

**Insert**: Hash key, prepend to the bucket's list.
**Lookup**: Hash key, search the bucket's list.
**Delete**: Hash key, remove from the bucket's list.

### Implementation with Chaining

```
insert(key: String, val: Object) -> DictNode:
    index = hash_func(key) mod capacity

    # Check if key already exists
    node = table[index]
    while node is not None:
        if node.key == key:
            node.val = val  # Update existing
            return node
        node = node.next

    # Insert new node at head
    new_node = DictNode(key, val)
    new_node.next = table[index]
    table[index] = new_node
    size += 1

    # Resize if needed
    if size > capacity:
        resize(2 * capacity)

    return new_node


get(key: String) -> Optional[DictNode]:
    index = hash_func(key) mod capacity

    node = table[index]
    while node is not None:
        if node.key == key:
            return node
        node = node.next

    return None


delete(key: String) -> Optional[DictNode]:
    index = hash_func(key) mod capacity

    prev = None
    node = table[index]

    while node is not None:
        if node.key == key:
            if prev is None:
                table[index] = node.next
            else:
                prev.next = node.next
            size -= 1
            return node
        prev = node
        node = node.next

    return None
```

### Open Addressing

Instead of linked lists, store all elements directly in the array. When a collision occurs, probe for the next open slot.

**Linear Probing**: Try index, index+1, index+2, ...

```
insert_linear(key, val):
    index = hash(key) mod capacity

    while table[index] is not None:
        if table[index].key == key:
            table[index].val = val  # Update
            return
        index = (index + 1) mod capacity

    table[index] = (key, val)
    size += 1
```

**Quadratic Probing**: Try index, index+1, index+4, index+9, ...

**Double Hashing**: Try index, index+h2(key), index+2*h2(key), ...

Open addressing has better cache performance (everything in one array) but suffers from **clustering**—once a region gets full, it stays full.

---

## Load Factor and Resizing

The **load factor** is $\alpha = n / m$ where $n$ is the number of elements and $m$ is the table size.

- Higher load factor → more collisions → slower operations
- Lower load factor → wasted space

A common threshold: resize when $\alpha > 0.75$.

### Resizing

When the table gets too full:
1. Create a new, larger array (usually 2x)
2. Rehash every element into the new array

```
resize(new_capacity: Integer):
    old_table = table
    table = new List[Optional[DictNode]] of size new_capacity
    capacity = new_capacity
    size = 0

    for bucket in old_table:
        node = bucket
        while node is not None:
            insert(node.key, node.val)  # Rehash into new table
            node = node.next
```

Resizing is $O(n)$, but it happens infrequently. Amortized over many insertions, the cost is $O(1)$ per insert.

---

## Runtime Analysis

Let $n$ = number of elements, $m$ = table size, $\alpha = n/m$ = load factor.

### With Good Hashing and Bounded Load Factor

| Operation | Average Case | Worst Case |
|-----------|--------------|------------|
| insert | $O(1)$ | $O(n)$ |
| get | $O(1)$ | $O(n)$ |
| delete | $O(1)$ | $O(n)$ |

**Why average case is O(1)**:

With a good hash function, elements distribute uniformly. With load factor $\alpha$, each bucket has $\alpha$ elements on average.

- Searching a bucket of length $\alpha$ takes $O(\alpha)$ time
- If we keep $\alpha$ bounded (e.g., $\alpha \leq 1$), that's $O(1)$

**Why worst case is O(n)**:

A pathological hash function could put all elements in one bucket. Then every operation searches a list of length $n$.

In practice, with a reasonable hash function, you'll essentially always see $O(1)$ behavior.

### Space

$O(n + m)$ = elements + table size. With bounded load factor, $m = O(n)$, so space is $O(n)$.

---

## Why Hashing Works

The fundamental insight: **randomization defeats adversaries**.

If keys were assigned to buckets uniformly at random, we'd expect each bucket to have $n/m$ elements. A good hash function approximates this random distribution.

Technically, for any fixed hash function, an adversary could choose keys that all collide. But:
1. Real inputs aren't adversarial
2. Universal hashing provides provable guarantees

---

## Universal Hashing

A **universal hash family** is a collection of hash functions where, for any two distinct keys, the probability of collision (when we pick a random function from the family) is at most $1/m$.

By choosing the hash function randomly at startup, we get expected $O(1)$ operations regardless of the input—the adversary doesn't know which function we'll use.

A simple universal family for integer keys:

$$h_{a,b}(k) = ((ak + b) \mod p) \mod m$$

where $p$ is a prime larger than any key, and $a, b$ are chosen randomly.

---

## Hash Tables vs Other Dictionaries

| | Hash Table | Balanced BST | Sorted Array |
|--|------------|--------------|--------------|
| Insert | $O(1)$ avg | $O(\log n)$ | $O(n)$ |
| Lookup | $O(1)$ avg | $O(\log n)$ | $O(\log n)$ |
| Delete | $O(1)$ avg | $O(\log n)$ | $O(n)$ |
| Ordered iteration | $O(n \log n)$ | $O(n)$ | $O(n)$ |
| Range queries | $O(n)$ | $O(\log n + k)$ | $O(\log n + k)$ |

**Use hash tables when**:
- You only need insert/lookup/delete
- You don't need ordering
- Average-case $O(1)$ is valuable

**Use BSTs when**:
- You need ordered iteration
- You need range queries
- You need worst-case guarantees

---

## Common Pitfalls

### Mutable Keys

If a key changes after insertion, its hash changes, and you can't find it anymore. Use immutable keys (strings, tuples of immutables).

### Hash Function Quality

A bad hash function causes clustering. For strings, use a standard hash (most languages provide one). Don't just use the length or first character.

### Not Resizing

Without resizing, performance degrades to $O(n)$ as the table fills up. Most implementations handle this automatically.

### Relying on Order

Hash tables have no meaningful order. If you iterate, don't expect any particular sequence. If you need order, use a BST or maintain a separate list.

---

## Practical Considerations

### When to Use

Hash tables are the default choice for:
- Counting occurrences
- Grouping by key
- Caching/memoization
- Set membership testing

They're so fast that "throw it in a hash table" is often the right first instinct.

### In Different Languages

- **Python**: `dict`, `set` (both hash-based)
- **Java**: `HashMap`, `HashSet`
- **C++**: `std::unordered_map`, `std::unordered_set`
- **JavaScript**: `Object`, `Map`, `Set`

---

## The Intuition to Remember

Hash tables trade ordering for speed. By converting keys to array indices, we get constant-time operations—as long as collisions are rare.

The key insights:
1. **Good hash functions spread keys uniformly**, making collisions rare
2. **Bounded load factor keeps buckets short**, ensuring fast operations
3. **Resizing maintains the load factor** as elements are added

When you need fast lookup by key and don't care about order, reach for a hash table first.
