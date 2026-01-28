---
title: 'Changelog'
pubDate: '2025-01-25'
---

All notable changes to this project will be documented in this file.

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
