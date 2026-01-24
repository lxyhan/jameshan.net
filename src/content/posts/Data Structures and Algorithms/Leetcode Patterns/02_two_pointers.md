---
title: 'Two Pointers'
pubDate: '2025-01-24'
---

Two pointers reduce $O(n^2)$ brute force to $O(n)$ by maintaining invariants as pointers move. The key: knowing *when* and *which direction* to move each pointer.

---

## Core Patterns

**1. Opposite ends** — Start at both ends, move inward
**2. Same direction** — Fast and slow pointers
**3. Two arrays** — Pointer in each, advance based on comparison

---

## Pattern 1: Opposite Ends (Sorted Array)

When the array is sorted, start from both ends and use the sorted property to decide which pointer to move.

```python
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1

    while left < right:
        total = nums[left] + nums[right]
        if total == target:
            return [left, right]
        elif total < target:
            left += 1   # need larger sum
        else:
            right -= 1  # need smaller sum

    return []
```

**Why it works:** If sum is too small, moving `left` right increases it (sorted). If too large, moving `right` left decreases it. We never skip valid pairs.

---

## Pattern 2: Three Sum

Reduce 3Sum to 2Sum by fixing one element and using two pointers on the rest.

```python
def three_sum(nums):
    nums.sort()
    result = []

    for i in range(len(nums) - 2):
        # Skip duplicates for first element
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        left, right = i + 1, len(nums) - 1
        target = -nums[i]

        while left < right:
            total = nums[left] + nums[right]
            if total == target:
                result.append([nums[i], nums[left], nums[right]])
                # Skip duplicates
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < target:
                left += 1
            else:
                right -= 1

    return result
```

**Time:** $O(n^2)$ — outer loop × two pointers
**Space:** $O(1)$ excluding output

---

## Pattern 3: Container With Most Water

Maximize area between two lines. Greedy: always move the shorter line inward.

```python
def max_area(height):
    left, right = 0, len(height) - 1
    max_water = 0

    while left < right:
        width = right - left
        h = min(height[left], height[right])
        max_water = max(max_water, width * h)

        # Move the shorter line (it's the bottleneck)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1

    return max_water
```

**Why move the shorter line?** The shorter line limits the height. Moving the taller line can only decrease width without increasing height. Moving the shorter line *might* find a taller line.

---

## Pattern 4: Fast and Slow (Same Direction)

Use two pointers moving in the same direction at different speeds.

**Remove duplicates in-place:**
```python
def remove_duplicates(nums):
    if not nums:
        return 0

    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]

    return slow + 1
```

**Move zeroes:**
```python
def move_zeroes(nums):
    slow = 0
    for fast in range(len(nums)):
        if nums[fast] != 0:
            nums[slow], nums[fast] = nums[fast], nums[slow]
            slow += 1
```

`slow` marks the boundary of "processed" elements. `fast` scans ahead.

---

## Pattern 5: Linked List Cycle Detection (Floyd's)

Fast pointer moves 2 steps, slow moves 1. If there's a cycle, they meet.

```python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False

def find_cycle_start(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            # Reset slow to head, move both at same speed
            slow = head
            while slow != fast:
                slow = slow.next
                fast = fast.next
            return slow
    return None
```

**Why does finding cycle start work?** Let distance to cycle start be $a$, cycle length be $c$. When they meet, slow traveled $a + b$, fast traveled $a + b + nc$. Since fast goes 2x speed: $2(a + b) = a + b + nc$, so $a = nc - b$. Moving both from head and meeting point at same speed, they meet at cycle start.

---

## Pattern 6: Palindrome Check

Compare characters from both ends moving inward.

```python
def is_palindrome(s):
    s = ''.join(c.lower() for c in s if c.isalnum())
    left, right = 0, len(s) - 1

    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1

    return True
```

---

## Pattern 7: Trapping Rain Water

For each position, water trapped = `min(max_left, max_right) - height[i]`.

```python
def trap(height):
    if not height:
        return 0

    left, right = 0, len(height) - 1
    left_max, right_max = height[left], height[right]
    water = 0

    while left < right:
        if left_max < right_max:
            left += 1
            left_max = max(left_max, height[left])
            water += left_max - height[left]
        else:
            right -= 1
            right_max = max(right_max, height[right])
            water += right_max - height[right]

    return water
```

**Insight:** We only need to know the *minimum* of max_left and max_right. Process from the side with the smaller max.

---

## Common Problems

| Problem | Pattern | Time |
|---------|---------|------|
| Two Sum II (sorted) | Opposite ends | $O(n)$ |
| 3Sum | Fix one + two pointers | $O(n^2)$ |
| Container With Most Water | Opposite ends, greedy | $O(n)$ |
| Remove Duplicates | Fast/slow | $O(n)$ |
| Linked List Cycle | Fast/slow (Floyd's) | $O(n)$ |
| Valid Palindrome | Opposite ends | $O(n)$ |
| Trapping Rain Water | Opposite ends | $O(n)$ |

---

## Key Insights

1. **Sorted array = two pointers from ends**: The sorted property lets you decide which pointer to move.

2. **In-place modification = fast/slow**: `slow` marks the write position, `fast` scans.

3. **Cycle detection = different speeds**: If there's a cycle, different speeds guarantee a meeting.

4. **kSum reduces to (k-1)Sum**: Fix one element, recurse. Base case is 2Sum with two pointers.

5. **When stuck, ask:** "What invariant can I maintain as I move pointers?"
