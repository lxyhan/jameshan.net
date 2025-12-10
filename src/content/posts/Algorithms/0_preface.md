---
title: '0: Preface'
pubDate: '2025-12-10'
---

These articles document my journey learning algorithms and data structures,not as a comprehensive guide, but as a personal record of concepts that clicked, implementations that worked, and patterns I want to remember.

This isn't a textbook. It's a learning log. The topics reflect what I'm studying right now, not everything there is to know. If you're learning the same material, maybe my explanations will help. If not, at least I'll have notes I can reference later.

The best way to learn is to explain. So here's my attempt.

---

## What I'm Learning

My courses started with **graphs**, which makes sense,most interesting data is connected. Social networks, dependencies, routing problems. Learning BFS and DFS felt like unlocking a new way to think about traversal. Minimum spanning trees (Kruskal's and Prim's) showed me how greedy algorithms can be elegant when they work.

Then came **dictionaries and trees**,the structures that make retrieval fast. Hash tables for constant-time lookup (when you don't care about order). BSTs for when you need both speed and sorting. Heaps for when you always need the "most important" element.

**Tries** were surprising,I'd never thought about prefix matching as a tree problem before, but once you see it, autocomplete makes so much more sense.

This ordering isn't canonical,it's just how my curriculum structured things. Starting with graphs before arrays felt backwards at first, but now I see why: graphs force you to think about structure and traversal from day one.

---

## The Articles

### **Part I: Graphs**

**1: Graphs and Representations**
Vertices, edges, adjacency lists, adjacency matrices. How you store a graph determines what you can do with it.

**2: Breadth-First Search (BFS)**
Level-by-level exploration. Finding shortest paths in unweighted graphs.

**3: Depth-First Search (DFS)**
Diving deep before backtracking. Detecting cycles, topological sorting, and connected components.

**4: Minimum Spanning Trees: Kruskal's Algorithm**
Connecting all vertices with minimum total edge weight. The greedy algorithm that picks edges by increasing weight.

**5: Minimum Spanning Trees: Prim's Algorithm**
Growing a tree from a starting vertex. The greedy algorithm that expands outward.

**6: Union-Find (Disjoint Set)**
Efficiently tracking connected components. The data structure that makes Kruskal's fast.

---

### **Part II: Dictionaries**

**7: Unsorted Dictionaries and Hashing**
Hash functions, collision resolution, and load factors. Trading space for constant-time operations.

**8: Sorted Dictionaries and Binary Search Trees**
In-order traversal, insertion, deletion, and balancing. When you need both lookup and ordering.

---

### **Part III: Specialized Structures**

**9: Priority Queues and Heaps**
Binary heaps, heapify, and heap sort. When you always need the minimum (or maximum) element.

**10: Tries and Prefix Matching**
Prefix trees, insertion, and search. The structure that makes autocomplete possible.

---

## How to Use These Notes

**If you're following the same course**: Read sequentially,I've ordered them the way I learned them.

**If you're looking for a specific topic**: Jump directly to it. I've tried to make each article self-contained, though some assume prior knowledge.

**If you're learning algorithms**: Implement everything yourself first, then read my notes. You'll get way more out of it that way.

These articles are me explaining things to myself. If they help you too, great. If not, there are better textbooks out there.

---

*The best moment in learning algorithms is when something "clicks" and suddenly feels obvious. "Of course BFS finds shortest paths,it explores level by level!" "Of course hash tables are fast,you jump straight to the answer!" These articles are my attempt to capture those moments before I forget them.*
