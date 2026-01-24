---
title: 'Arrays and Hashing'
pubDate: '2025-01-24'
---

Arrays and hash maps form the foundation of most coding interviews. Master these first—they appear in nearly every problem, either as the main technique or as a building block.

---

## Core Concepts

**Arrays** give $O(1)$ random access by index, $O(n)$ search, and $O(n)$ insert/delete (due to shifting).

**Hash Maps** give $O(1)$ average lookup, insert, and delete by key. The tradeoff: no ordering and extra space.

The key insight: **use hash maps to trade space for time**. When you need to check "have I seen this before?" or "what's the count of X?"—think hash map.

---

## Pattern 1: Frequency Counting

Count occurrences to detect duplicates, find majority elements, or check anagrams.

```python
def contains_duplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False

def is_anagram(s, t):
    if len(s) != len(t):
        return False
    count = {}
    for c in s:
        count[c] = count.get(c, 0) + 1
    for c in t:
        if c not in count or count[c] == 0:
            return False
        count[c] -= 1
    return True
```

**Time:** $O(n)$ — single pass
**Space:** $O(n)$ — hash map storage

---

## Pattern 2: Two Sum / Complement Lookup

Instead of $O(n^2)$ brute force checking all pairs, store seen values and look up complements.

```python
def two_sum(nums, target):
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
```

This pattern extends to **3Sum** and **4Sum** by reducing to nested Two Sum calls.

---

## Pattern 3: Grouping by Key

Use a hash map to group elements by some computed property.

```python
def group_anagrams(strs):
    groups = {}  # sorted string -> list of anagrams
    for s in strs:
        key = ''.join(sorted(s))
        if key not in groups:
            groups[key] = []
        groups[key].append(s)
    return list(groups.values())
```

Alternative: use character count tuple as key (faster for long strings):
```python
key = tuple(sorted(Counter(s).items()))
```

---

## Pattern 4: Prefix Sums

Precompute cumulative sums for $O(1)$ range sum queries.

```python
def build_prefix_sum(nums):
    prefix = [0]
    for num in nums:
        prefix.append(prefix[-1] + num)
    return prefix

def range_sum(prefix, left, right):
    return prefix[right + 1] - prefix[left]
```

**Subarray sum equals k:** Use hash map to count prefix sums.

```python
def subarray_sum(nums, k):
    count = 0
    prefix_sum = 0
    seen = {0: 1}  # prefix_sum -> count

    for num in nums:
        prefix_sum += num
        # If prefix_sum - k exists, we found a subarray
        if prefix_sum - k in seen:
            count += seen[prefix_sum - k]
        seen[prefix_sum] = seen.get(prefix_sum, 0) + 1

    return count
```

---

## Pattern 5: Index Mapping

Map values to indices for $O(1)$ lookups of positions.

```python
def intersection(nums1, nums2):
    set1 = set(nums1)
    return list(set1 & set(nums2))

def find_disappeared_numbers(nums):
    # Mark indices as visited using negation
    for num in nums:
        idx = abs(num) - 1
        nums[idx] = -abs(nums[idx])

    return [i + 1 for i, num in enumerate(nums) if num > 0]
```

---

## Common Problems

| Problem | Technique | Time |
|---------|-----------|------|
| Two Sum | Complement lookup | $O(n)$ |
| Contains Duplicate | Hash set | $O(n)$ |
| Valid Anagram | Frequency count | $O(n)$ |
| Group Anagrams | Group by sorted key | $O(nk \log k)$ |
| Top K Frequent | Frequency + bucket sort | $O(n)$ |
| Product Except Self | Prefix/suffix products | $O(n)$ |
| Longest Consecutive | Hash set + sequence check | $O(n)$ |
| Subarray Sum Equals K | Prefix sum + hash map | $O(n)$ |

---

## Key Insights

1. **Set for existence, Map for association**: Use `set` when you only need to check membership. Use `dict/map` when you need to store additional info (counts, indices).

2. **Sort the key, not the value**: For grouping problems, compute a canonical form as the key.

3. **Prefix sums turn range queries into point queries**: `sum(i, j) = prefix[j+1] - prefix[i]`.

4. **In-place marking**: Use sign flipping or index swapping to mark visited elements without extra space.

5. **Think about what you need to look up**: If you're doing nested loops asking "is X in the array?", use a hash map instead.
