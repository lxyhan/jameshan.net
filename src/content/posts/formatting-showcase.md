---
title: 'Markdown Formatting Showcase'
pubDate: '2025-11-28'
---

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Text Formatting

This is **bold text** and this is *italic text*. You can also use __bold__ and _italic_ with underscores.

This is ***bold and italic*** text.

This is ~~strikethrough~~ text.

This is `inline code` within a sentence.

## Links and Images

[This is a link to Google](https://google.com)

[This is a link with a title](https://example.com "Example Site")

![Alt text for an image](/profile1.png)

## Lists

### Unordered List
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
    - Deeply nested item
- Item 3

### Ordered List
1. First item
2. Second item
   1. Nested item 2.1
   2. Nested item 2.2
3. Third item

### Task List
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task

## Blockquotes

> This is a blockquote.
> It can span multiple lines.
>
> And have multiple paragraphs.

> **Note**: You can use formatting inside blockquotes.
> 
> - Even lists
> - Like this

## Code Blocks

### JavaScript
```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return true;
}

const result = greet('World');
```

### Python
```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

### TypeScript
```typescript
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: 'James',
  age: 20
};
```

### Without syntax highlighting
```
This is a plain code block
No syntax highlighting
Just monospace text
```

## Tables

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1, Col 1 | Row 1, Col 2 | Row 1, Col 3 |
| Row 2, Col 1 | Row 2, Col 2 | Row 2, Col 3 |
| Row 3, Col 1 | Row 3, Col 2 | Row 3, Col 3 |

### Aligned Tables

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Left | Center | Right |
| Text | Text | Text |

## Horizontal Rules

You can create horizontal rules with three or more hyphens, asterisks, or underscores:

---

***

___

## Math (LaTeX)

Inline math: $E = mc^2$

Block math:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

Matrix example:

$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
$$

Summation:

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

## Footnotes

Here's a sentence with a footnote[^1].

Here's another with a longer footnote[^longnote].

[^1]: This is the first footnote.

[^longnote]: This is a longer footnote with multiple paragraphs.
    
    You can include code, lists, and other formatting in footnotes.
    
    ```python
    print("Hello from a footnote!")
    ```

## Definition Lists

Term 1
: Definition 1

Term 2
: Definition 2a
: Definition 2b

## Escaping Characters

You can escape special characters with a backslash:

\*Not italic\*

\[Not a link\]

\`Not code\`

## HTML (if supported)

<div style="color: blue;">
  This is blue text using HTML.
</div>

<details>
  <summary>Click to expand</summary>
  
  Hidden content goes here!
  
  - You can use markdown
  - Inside HTML elements
</details>

## Emojis

:smile: :heart: :rocket: :fire: :tada:

Or use Unicode: 😀 ❤️ 🚀 🔥 🎉

## Nested Formatting

> **Quote with bold**
> 
> ```javascript
> // Code in a quote
> const x = 42;
> ```
> 
> - List in a quote
> - With multiple items

## Line Breaks

This is a line with two spaces at the end  
This creates a line break

Or use a backslash\
Like this

## Abbreviations

The HTML specification is maintained by the W3C.

*[HTML]: Hyper Text Markup Language
*[W3C]: World Wide Web Consortium

## Comments

<!-- This is a comment and won't be visible in the rendered output -->

## Special Blocks (if your theme supports them)

:::note
This is a note block
:::

:::warning
This is a warning block
:::

:::tip
This is a tip block
:::

:::danger
This is a danger block
:::

## Combining Everything

Here's a complex example combining multiple features:

### Algorithm: Binary Search

> **Time Complexity**: $O(\log n)$
> 
> **Space Complexity**: $O(1)$

```python
def binary_search(arr, target):
    """
    Performs binary search on a sorted array.
    
    Args:
        arr: Sorted list of integers
        target: Integer to search for
    
    Returns:
        Index of target if found, -1 otherwise
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1
```

**Key Points**:
- Array must be sorted[^sorted]
- Uses divide and conquer
- Very efficient for large datasets

[^sorted]: If the array is not sorted, you must sort it first, which takes $O(n \log n)$ time.

---

That's all the formatting options! 🎉
