---
title: 'Changelog'
pubDate: '2025-01-25'
---

All notable changes to this project will be documented in this file.

## [6.0] - 2026-03-23
### Added
- Frontmatter `order` field for article ordering (replaces filename-based hacks)
- Mandatory `index.md` for every content folder with build-time check
- Root-level index page linking to all sections
- "Choosing High EV Goals" series: Taleb and Asymmetric Bets, plus 5 follow-up stubs
- Blue book emoji (📘) for index files in sidebar
- Folder display names derived from index file titles (no more hardcoded map)
- Scripts: `generate-indexes.mjs`, `check-indexes.mjs`, `rename-to-slugs.mjs`, `rename-to-title-slugs.mjs`

### Changed
- Renamed all files site-wide to match article titles as slugs
- Merged all preface/overview files into folder indexes
- Sidebar header: "📘 index" linking to root index
- Font changed to Calibri
- Sidebar sorting: `order` field takes priority over folder-vs-file type
- Folders inherit order from their index file for sorting

## [5.9] - 2026-03-22
### Added
- Homepage recent writing section with 10 featured essays
- New essays: A Farewell to Arms, Red Star Over China, Fast 5K, Goal Gradient, Shurik & Gaidai

### Changed
- Revised existing essay drafts

## [5.8] - 2026-03-22
### Changed
- Restructured content: merged Books/Movies/Writing into Essays
- Promoted PythonTA and MarkUs to top-level folders

## [5.7] - 2026-03-19
### Added
- Sleep & Nutrition section under Athletics
- 16-week aquathlon training plan v4

### Changed
- Athletics sidebar section with Sleep & Nutrition folder routing fix
- Tilde font rendering fix

## [5.6] - 2026-03-16
### Added
- Effective goal setting content

### Changed
- Sidebar scrollbar moved to left side with hover-only visibility

## [5.5] - 2026-02-16
### Added
- Interview sim challenges: Job Board and Day Calendar
- Vanilla JS crash course
- Sim components MDX page

## [5.4] - 2026-02-15
### Added
- React learning materials: quick start, intermediate, advanced posts
- Practice components with live React embeds
- MDX live component demos with border/padding boxes
- MiniCalc exercise

### Changed
- Converted practice posts to MDX with live React component embeds

## [5.3] - 2026-02-05
### Changed
- Updated about page: softened quant research mention, removed writing section

## [5.2] - 2026-01-29
### Added
- Feature mapping, regularization, and linear classification notes
- OG preview image for social sharing
- JH favicon
- Software Design articles
- Top 5 albums list
- Interactive world map for analytics visitor locations
- Country tracking at view time with IP geolocation
- Visitor locations section on analytics page

### Changed
- Rewrite dreadnought essay, renamed all essay titles
- Updated about page writing section formatting
- Renamed Calculus folder, updated prefaces
- Clean up ML folder structure, created linear classification folder
- Map highlight changed to black scale
- Simplified album list to titles and years
- Locations count views per country instead of unique IPs
- Persisted sidebar across page transitions, only animate content

### Fixed
- Font loading on View Transitions navigation
- White screen bug on page transitions
- Reading list link, added watchlist link to homepage
- Consistent humanToday view counts
- IP pagination for locations fetch

## [5.1] - 2025-01-28
### Added
- New analytics page at /analytics with daily views histogram
- Movie reviews: Andrei Rublev, In the Heat of the Sun
- "I've Written About" section on watchlist page
- Y-axis scale on analytics histogram
- Hover tooltips showing date and view count
- Methodology blurb explaining how views are tracked

### Changed
- Rebuilt analytics system with Supabase Postgres backend
- Session-based deduplication (2.5 min cooldown per IP per page)
- Bot filtering via user-agent pattern matching
- IP addresses stored as SHA-256 hashes for privacy
- Page transitions now only fade content area, not sidebar
- Improved font loading: preload Merriweather, use `font-display: optional`
- Post views now fade in smoothly instead of showing "..."
- Standardized title format for movie/book reviews: "Title (Author/Director, Year)"

### Fixed
- Empty catch block lint errors
- Font loading jank on production builds

## [4.5] - 2025-01-25
### Added
- Emojis to folder titles (books 📚, firefox 🦊, data-structures-and-algorithms 🧮)

### Changed
- Consolidated sidebar footer into single line: Changelog v4.5 | Source | views today
- Disabled CSS caching for faster development iteration
- Reduced margins in sidebar footer section

### Removed
- Separate Analytics widget from homepage (moved to footer)

## [4.4] - 2025-12-29
### Added
- Comprehensive analytics tracking with per-page view counts
- Bot detection and human/bot separation in analytics
- Browser fingerprinting for unique visitor tracking
- Scroll depth and time-on-page engagement metrics
- Analytics dashboard page at /analytics

### Changed
- Moved views display between likes and date on posts
- Switched from middleware to client-side tracking (works with static pages)

## [4.3] - 2025-12-29
### Added
- Comments system with threaded replies
- Post and comment likes
- Spam detection for comments
- Social media icons in sidebar (GitHub, LinkedIn, Instagram)
- Recent posts section in sidebar
- Changelog and source links in sidebar

## [4.2] - 2025-12-28
### Added
- New essay: "Reflections on Bonapartism"

### Changed
- Major typography overhaul for headings

## [4.1] - 2024-12-24
### Added
- US Government course notes (25 articles across 5 sections)
- Triathlon Program: OCD and anxiety post

### Changed
- Reorganized Department of Computer Science posts into subdirectories
- Smaller serif font for analytics text
- Track all page views including reloads

## [4.0] - 2024-12-23
### Added
- Analytics feature with Supabase tracking
- Visitor count display (today/all-time)
- Analytics API endpoints

## [3.2] - 2024-12-22
### Changed
- Reorganized posts and images structure

### Fixed
- Sidebar header improvements
- Search modal improvements

## [3.1] - 2024-12-18
### Fixed
- Code highlighting on View Transitions navigation

## [3.0] - 2024-12-18
### Added
- Search functionality
- Post navigation
- Syntax highlighting
- Fitness section
- Media calendar

### Changed
- Major layout overhaul

## [2.3] - 2024-12-13
### Added
- Quant finance applications to linear algebra series

### Changed
- Renamed "Algorithms" to "Data Structures and Algorithms"

### Fixed
- Path-based search template
- Updated LinkedIn link

## [2.2] - 2024-12-12
### Added
- Complete Data Structures and Algorithms series
- Graph search frameworks and pruning documentation

### Changed
- Consolidated algorithms series into exam review notes

## [2.1] - 2024-12-10
### Added
- Reorganized content structure
- New articles and comprehensive eigenvalues chapter

## [2.0] - 2024-12-05
### Changed
- Dense, document-like typography (textbook/newspaper aesthetic)
- Comprehensive site improvements: security, performance, accessibility, SEO
- Darker dark mode

### Added
- Linear algebra content series

### Fixed
- UI improvements: theme toggle, dividers
- Removed music player
- Blog tree moved to bottom on mobile for post pages

## [1.4] - 2024-11-29
### Added
- Linear algebra chapter 1 and 2

## [1.3] - 2024-11-28
### Added
- SDS Final Blog post

### Changed
- Improved navigation and breadcrumbs

### Fixed
- File tree formatting
- Telemetry blog revisions and margins

## [1.2] - 2024-11-25
### Added
- Image viewer
- Font toggle functionality

### Fixed
- Site spacing bugs
- File tree styles
- Icon alignment
- Image styling and blog font

## [1.1] - 2024-11-24
### Added
- New post: "Dreadnought Closet"

## [1.0] - 2024-11-22
### Added
- Initial site launch
- Computer Modern font
- Profile photos
- About page

### Changed
- Increased font sizes for better web readability
