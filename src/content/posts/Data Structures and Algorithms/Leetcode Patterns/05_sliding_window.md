---
title: 'Sliding Window'
pubDate: '2025-01-24'
---

Sliding window optimizes problems about contiguous subarrays/substrings. Instead of recalculating from scratch, maintain a "window" and update incrementally as it slides. Reduces $O(n \cdot k)$ or $O(n^2)$ to $O(n)$.

---

## Two Types of Windows

**Fixed-size window:** Window size is given. Slide by adding one element and removing one.

**Variable-size window:** Find min/max window satisfying some condition. Expand to satisfy, shrink to optimize.

---

## Pattern 1: Fixed-Size Window

**Maximum sum subarray of size k:**

```python
def max_sum_subarray(nums, k):
    if len(nums) < k:
        return 0

    # Initial window
    window_sum = sum(nums[:k])
    max_sum = window_sum

    # Slide window
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]  # add new, remove old
        max_sum = max(max_sum, window_sum)

    return max_sum
```

**Time:** $O(n)$ — each element added and removed exactly once.

---

## Pattern 2: Variable Window - Find Minimum

Expand until condition is met, then shrink to find minimum valid window.

**Minimum Window Substring:** Find smallest substring of `s` containing all chars of `t`.

```python
def min_window(s, t):
    from collections import Counter

    need = Counter(t)
    have = {}
    have_count, need_count = 0, len(need)

    result = ""
    result_len = float('inf')
    left = 0

    for right in range(len(s)):
        # Expand: add s[right] to window
        char = s[right]
        have[char] = have.get(char, 0) + 1

        if char in need and have[char] == need[char]:
            have_count += 1

        # Shrink: while window is valid, try to minimize
        while have_count == need_count:
            # Update result
            if right - left + 1 < result_len:
                result_len = right - left + 1
                result = s[left:right + 1]

            # Remove s[left] from window
            left_char = s[left]
            have[left_char] -= 1
            if left_char in need and have[left_char] < need[left_char]:
                have_count -= 1
            left += 1

    return result
```

---

## Pattern 3: Variable Window - Find Maximum

Expand while condition holds, shrink when violated.

**Longest Substring Without Repeating Characters:**

```python
def length_of_longest_substring(s):
    seen = {}  # char -> most recent index
    max_len = 0
    left = 0

    for right in range(len(s)):
        if s[right] in seen and seen[s[right]] >= left:
            # Shrink: move left past the duplicate
            left = seen[s[right]] + 1

        seen[s[right]] = right
        max_len = max(max_len, right - left + 1)

    return max_len
```

**Longest Repeating Character Replacement:** Can replace at most k characters.

```python
def character_replacement(s, k):
    count = {}
    max_freq = 0  # frequency of most common char in window
    max_len = 0
    left = 0

    for right in range(len(s)):
        count[s[right]] = count.get(s[right], 0) + 1
        max_freq = max(max_freq, count[s[right]])

        # Window is invalid if we need more than k replacements
        while (right - left + 1) - max_freq > k:
            count[s[left]] -= 1
            left += 1

        max_len = max(max_len, right - left + 1)

    return max_len
```

---

## Pattern 4: Sliding Window with Hash Map

Track character frequencies or other properties.

**Permutation in String:** Check if s2 contains a permutation of s1.

```python
def check_inclusion(s1, s2):
    from collections import Counter

    if len(s1) > len(s2):
        return False

    s1_count = Counter(s1)
    window = Counter(s2[:len(s1)])

    if window == s1_count:
        return True

    for i in range(len(s1), len(s2)):
        # Add new character
        window[s2[i]] += 1
        # Remove old character
        old_char = s2[i - len(s1)]
        window[old_char] -= 1
        if window[old_char] == 0:
            del window[old_char]

        if window == s1_count:
            return True

    return False
```

**Find All Anagrams:** Return all start indices of anagrams.

```python
def find_anagrams(s, p):
    from collections import Counter

    if len(p) > len(s):
        return []

    p_count = Counter(p)
    window = Counter(s[:len(p)])
    result = []

    if window == p_count:
        result.append(0)

    for i in range(len(p), len(s)):
        window[s[i]] += 1
        old_char = s[i - len(p)]
        window[old_char] -= 1
        if window[old_char] == 0:
            del window[old_char]

        if window == p_count:
            result.append(i - len(p) + 1)

    return result
```

---

## Pattern 5: Subarray Product/Sum Constraints

**Subarray Product Less Than K:**

```python
def num_subarray_product_less_than_k(nums, k):
    if k <= 1:
        return 0

    product = 1
    count = 0
    left = 0

    for right in range(len(nums)):
        product *= nums[right]

        while product >= k:
            product //= nums[left]
            left += 1

        # All subarrays ending at right with start in [left, right]
        count += right - left + 1

    return count
```

**Key insight:** When window `[left, right]` is valid, there are `right - left + 1` valid subarrays ending at `right`.

---

## Pattern 6: Sliding Window Maximum

Use monotonic deque to track maximum in window.

```python
from collections import deque

def max_sliding_window(nums, k):
    dq = deque()  # indices of potential maximums (decreasing values)
    result = []

    for i in range(len(nums)):
        # Remove indices outside window
        while dq and dq[0] < i - k + 1:
            dq.popleft()

        # Remove smaller elements (they can't be max)
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()

        dq.append(i)

        if i >= k - 1:
            result.append(nums[dq[0]])

    return result
```

**Time:** $O(n)$ — each element added and removed from deque at most once.

---

## The Template

```python
def sliding_window(s):
    left = 0
    result = 0  # or initialize appropriately
    state = {}  # track window state

    for right in range(len(s)):
        # 1. Expand: add s[right] to window state
        update_state(state, s[right])

        # 2. Shrink: while window is invalid
        while is_invalid(state):
            remove_from_state(state, s[left])
            left += 1

        # 3. Update result
        result = update_result(result, left, right)

    return result
```

---

## Common Problems

| Problem | Type | Time |
|---------|------|------|
| Max Sum Subarray Size K | Fixed | $O(n)$ |
| Minimum Window Substring | Variable (min) | $O(n)$ |
| Longest Substring No Repeat | Variable (max) | $O(n)$ |
| Longest Repeating Replacement | Variable (max) | $O(n)$ |
| Permutation in String | Fixed + hash | $O(n)$ |
| Find All Anagrams | Fixed + hash | $O(n)$ |
| Subarray Product < K | Variable | $O(n)$ |
| Sliding Window Maximum | Fixed + deque | $O(n)$ |

---

## Key Insights

1. **Contiguous subarray/substring = sliding window candidate**: If brute force checks all subarrays, think sliding window.

2. **Fixed vs variable**: Fixed size slides one step at a time. Variable expands/shrinks based on validity.

3. **"Longest/minimum satisfying X"**: Variable window. Expand to satisfy, shrink to optimize.

4. **Window state must be updatable in O(1)**: Use hash maps for frequencies, variables for sums/products.

5. **Two pointers are a special case**: Sliding window where both pointers only move right.

6. **Count subarrays**: When `[left, right]` is valid, count is often `right - left + 1` (all subarrays ending at right).
