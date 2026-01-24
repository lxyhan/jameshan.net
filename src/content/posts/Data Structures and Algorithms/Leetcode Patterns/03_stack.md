---
title: 'Stack'
pubDate: '2025-01-24'
---

Stacks are LIFO (Last In, First Out). They shine when you need to match pairs, track "most recent" state, or process things in reverse order. If you see parentheses, nested structures, or "next greater element"—think stack.

---

## Core Operations

```python
stack = []
stack.append(x)    # push - O(1)
stack.pop()        # pop - O(1)
stack[-1]          # peek - O(1)
len(stack) == 0    # isEmpty - O(1)
```

---

## Pattern 1: Matching Parentheses

Push opening brackets, pop and match on closing brackets.

```python
def is_valid(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}

    for char in s:
        if char in '([{':
            stack.append(char)
        elif char in ')]}':
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()

    return len(stack) == 0
```

**Minimum removals to make valid:**
```python
def min_remove_to_make_valid(s):
    s = list(s)
    stack = []  # indices of unmatched '('

    for i, char in enumerate(s):
        if char == '(':
            stack.append(i)
        elif char == ')':
            if stack:
                stack.pop()
            else:
                s[i] = ''  # unmatched ')'

    # Remove unmatched '('
    for i in stack:
        s[i] = ''

    return ''.join(s)
```

---

## Pattern 2: Monotonic Stack

Maintain a stack where elements are always increasing (or decreasing). Used for "next greater/smaller element" problems.

**Next Greater Element:**
```python
def next_greater_element(nums):
    n = len(nums)
    result = [-1] * n
    stack = []  # indices of elements waiting for their next greater

    for i in range(n):
        # Pop elements smaller than current (found their next greater)
        while stack and nums[stack[-1]] < nums[i]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)

    return result
```

**Key insight:** Elements in the stack are "waiting" for their answer. When we find it, we pop them.

---

## Pattern 3: Daily Temperatures

"How many days until a warmer temperature?" = next greater element with indices.

```python
def daily_temperatures(temps):
    n = len(temps)
    result = [0] * n
    stack = []  # indices

    for i in range(n):
        while stack and temps[stack[-1]] < temps[i]:
            idx = stack.pop()
            result[idx] = i - idx
        stack.append(i)

    return result
```

---

## Pattern 4: Largest Rectangle in Histogram

For each bar, find how far it can extend left and right. Use monotonic stack to find boundaries efficiently.

```python
def largest_rectangle_area(heights):
    stack = []  # indices of increasing heights
    max_area = 0
    heights.append(0)  # sentinel to flush remaining bars

    for i, h in enumerate(heights):
        start = i
        while stack and stack[-1][1] > h:
            idx, height = stack.pop()
            width = i - idx
            max_area = max(max_area, height * width)
            start = idx
        stack.append((start, h))

    return max_area
```

**Why it works:** When we pop a bar, we know its right boundary (current index) and left boundary (it extended from when it was pushed or inherited from popped bars).

---

## Pattern 5: Evaluate Reverse Polish Notation

Operands go on stack, operators pop two and push result.

```python
def eval_rpn(tokens):
    stack = []
    ops = {
        '+': lambda a, b: a + b,
        '-': lambda a, b: a - b,
        '*': lambda a, b: a * b,
        '/': lambda a, b: int(a / b)  # truncate toward zero
    }

    for token in tokens:
        if token in ops:
            b, a = stack.pop(), stack.pop()  # note order
            stack.append(ops[token](a, b))
        else:
            stack.append(int(token))

    return stack[0]
```

---

## Pattern 6: Basic Calculator

Handle operators, parentheses, and precedence with stack.

```python
def calculate(s):
    stack = []
    num = 0
    sign = 1
    result = 0

    for char in s:
        if char.isdigit():
            num = num * 10 + int(char)
        elif char == '+':
            result += sign * num
            num = 0
            sign = 1
        elif char == '-':
            result += sign * num
            num = 0
            sign = -1
        elif char == '(':
            # Push current result and sign, reset
            stack.append(result)
            stack.append(sign)
            result = 0
            sign = 1
        elif char == ')':
            result += sign * num
            num = 0
            result *= stack.pop()  # sign before '('
            result += stack.pop()  # result before '('

    return result + sign * num
```

---

## Pattern 7: Min Stack

Track minimum at each state by storing pairs or using auxiliary stack.

```python
class MinStack:
    def __init__(self):
        self.stack = []  # (value, min_so_far)

    def push(self, val):
        if not self.stack:
            self.stack.append((val, val))
        else:
            self.stack.append((val, min(val, self.stack[-1][1])))

    def pop(self):
        self.stack.pop()

    def top(self):
        return self.stack[-1][0]

    def getMin(self):
        return self.stack[-1][1]
```

---

## Pattern 8: Decode String

Nested encoding like `3[a2[c]]` → use stack to handle nesting.

```python
def decode_string(s):
    stack = []
    current_str = ''
    current_num = 0

    for char in s:
        if char.isdigit():
            current_num = current_num * 10 + int(char)
        elif char == '[':
            # Save current state and reset
            stack.append((current_str, current_num))
            current_str = ''
            current_num = 0
        elif char == ']':
            # Pop and build string
            prev_str, num = stack.pop()
            current_str = prev_str + current_str * num
        else:
            current_str += char

    return current_str
```

---

## Common Problems

| Problem | Pattern | Time |
|---------|---------|------|
| Valid Parentheses | Matching | $O(n)$ |
| Next Greater Element | Monotonic stack | $O(n)$ |
| Daily Temperatures | Monotonic stack | $O(n)$ |
| Largest Rectangle Histogram | Monotonic stack | $O(n)$ |
| Evaluate RPN | Operand stack | $O(n)$ |
| Basic Calculator | Operator stack | $O(n)$ |
| Min Stack | Pair with min | $O(1)$ ops |
| Decode String | Nested state | $O(n)$ |

---

## Key Insights

1. **Matching pairs = stack**: Open pushes, close pops and validates.

2. **Monotonic stack for "next greater/smaller"**: Elements wait on stack until their answer arrives.

3. **Nested structures = save state on stack**: Push current state before going deeper, pop when returning.

4. **Stack simulates recursion**: Any recursive solution can be converted to iterative with explicit stack.

5. **When to use monotonic stack**: "For each element, find the first larger/smaller element to the left/right."
