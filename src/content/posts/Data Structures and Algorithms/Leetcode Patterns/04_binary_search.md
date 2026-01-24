---
title: 'Binary Search'
pubDate: '2025-01-24'
---

Binary search achieves $O(\log n)$ by halving the search space each iteration. The challenge isn't the algorithm—it's recognizing when to use it and handling boundary conditions correctly.

---

## The Template

Most binary search problems fit one of two templates:

**Template 1: Find exact value**
```python
def binary_search(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1  # not found
```

**Template 2: Find boundary (leftmost/rightmost)**
```python
def find_left_boundary(nums, target):
    left, right = 0, len(nums)

    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid

    return left  # first index where nums[i] >= target
```

**Key differences:**
- Template 1: `left <= right`, returns exact match
- Template 2: `left < right`, returns insertion point/boundary

---

## Pattern 1: Search in Rotated Sorted Array

Array was sorted then rotated. One half is always sorted—binary search on that half.

```python
def search_rotated(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if nums[mid] == target:
            return mid

        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1
```

**Insight:** Check which half is sorted (compare `nums[left]` with `nums[mid]`), then check if target is in that sorted range.

---

## Pattern 2: Find Minimum in Rotated Array

The minimum is where the rotation point is.

```python
def find_min(nums):
    left, right = 0, len(nums) - 1

    while left < right:
        mid = left + (right - left) // 2

        if nums[mid] > nums[right]:
            # Min is in right half
            left = mid + 1
        else:
            # Min is in left half (including mid)
            right = mid

    return nums[left]
```

**With duplicates:** Add `right -= 1` when `nums[mid] == nums[right]` (worst case $O(n)$).

---

## Pattern 3: Search a 2D Matrix

Treat 2D matrix as 1D sorted array.

```python
def search_matrix(matrix, target):
    if not matrix:
        return False

    m, n = len(matrix), len(matrix[0])
    left, right = 0, m * n - 1

    while left <= right:
        mid = left + (right - left) // 2
        # Convert 1D index to 2D
        val = matrix[mid // n][mid % n]

        if val == target:
            return True
        elif val < target:
            left = mid + 1
        else:
            right = mid - 1

    return False
```

---

## Pattern 4: Find First and Last Position

Use boundary-finding template twice.

```python
def search_range(nums, target):
    def find_left():
        left, right = 0, len(nums)
        while left < right:
            mid = left + (right - left) // 2
            if nums[mid] < target:
                left = mid + 1
            else:
                right = mid
        return left

    def find_right():
        left, right = 0, len(nums)
        while left < right:
            mid = left + (right - left) // 2
            if nums[mid] <= target:
                left = mid + 1
            else:
                right = mid
        return left - 1

    left_idx = find_left()
    if left_idx >= len(nums) or nums[left_idx] != target:
        return [-1, -1]

    return [left_idx, find_right()]
```

---

## Pattern 5: Binary Search on Answer

When asked for min/max of something that's monotonic, binary search the answer space.

**Koko Eating Bananas:** Find minimum eating speed to finish in h hours.

```python
def min_eating_speed(piles, h):
    def can_finish(speed):
        hours = sum((p + speed - 1) // speed for p in piles)
        return hours <= h

    left, right = 1, max(piles)

    while left < right:
        mid = left + (right - left) // 2
        if can_finish(mid):
            right = mid  # try slower
        else:
            left = mid + 1  # need faster

    return left
```

**Split Array Largest Sum:** Minimize the maximum sum when splitting array into m parts.

```python
def split_array(nums, m):
    def can_split(max_sum):
        count = 1
        current = 0
        for num in nums:
            if current + num > max_sum:
                count += 1
                current = num
            else:
                current += num
        return count <= m

    left, right = max(nums), sum(nums)

    while left < right:
        mid = left + (right - left) // 2
        if can_split(mid):
            right = mid
        else:
            left = mid + 1

    return left
```

---

## Pattern 6: Find Peak Element

A peak is greater than its neighbors. Binary search by comparing with neighbor.

```python
def find_peak_element(nums):
    left, right = 0, len(nums) - 1

    while left < right:
        mid = left + (right - left) // 2

        if nums[mid] < nums[mid + 1]:
            # Rising slope, peak is on right
            left = mid + 1
        else:
            # Falling slope, peak is on left (including mid)
            right = mid

    return left
```

---

## Pattern 7: Median of Two Sorted Arrays

Binary search on partition point. Ensure left elements ≤ right elements.

```python
def find_median_sorted_arrays(nums1, nums2):
    # Ensure nums1 is smaller
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1

    m, n = len(nums1), len(nums2)
    left, right = 0, m

    while left <= right:
        i = left + (right - left) // 2
        j = (m + n + 1) // 2 - i

        left1 = nums1[i - 1] if i > 0 else float('-inf')
        right1 = nums1[i] if i < m else float('inf')
        left2 = nums2[j - 1] if j > 0 else float('-inf')
        right2 = nums2[j] if j < n else float('inf')

        if left1 <= right2 and left2 <= right1:
            # Found correct partition
            if (m + n) % 2 == 0:
                return (max(left1, left2) + min(right1, right2)) / 2
            return max(left1, left2)
        elif left1 > right2:
            right = i - 1
        else:
            left = i + 1

    return 0
```

---

## Common Problems

| Problem | Variant | Time |
|---------|---------|------|
| Binary Search | Basic | $O(\log n)$ |
| Search Rotated Array | Modified sorted | $O(\log n)$ |
| Find Min Rotated | Find rotation point | $O(\log n)$ |
| Search 2D Matrix | Index mapping | $O(\log mn)$ |
| First/Last Position | Boundary finding | $O(\log n)$ |
| Koko Eating Bananas | Search on answer | $O(n \log k)$ |
| Find Peak Element | Compare with neighbor | $O(\log n)$ |
| Median Two Arrays | Partition search | $O(\log \min(m,n))$ |

---

## Key Insights

1. **Sorted or monotonic = binary search opportunity**: Even if not explicitly sorted, look for monotonic properties.

2. **Binary search on answer**: If checking "is X achievable?" is easy and answer is monotonic, binary search X.

3. **Boundary conditions are everything**: Decide `left <= right` vs `left < right`, `mid` vs `mid + 1`, and what to return.

4. **Use `left + (right - left) // 2`**: Prevents integer overflow (matters in some languages).

5. **Draw the search space**: Visualize what left, right, mid represent and where the answer lives.
