# James Han - Personal Website

A minimal, performance-focused personal blog built with Astro, featuring mathematical typesetting, dark mode, and optimized for accessibility and SEO.

## About

Computer Science, Statistics, Economics Undergraduate, University of Toronto St. George, Class of 2028

My research interests live at the intersection of game theory, behavioral economics, asian history, and quantitative trading. I think a lot about how to define and quantify meaningful work. The following is my current understanding:

I believe the internet is worth fighting for. I work on next-gen privacy features at Firefox (read my love letter to rust) and build open-source tools (MarkUs & PythonTA) used by 30k+ students. I Lead Blueprint, UofT AI, Anthropic @ UofT, and Trinity College's Orientation. In 2026 I'll be doing quantitative research on a front-office electronic trading team. Won some hackathons (Hack the North, UofTHacks, NewHacks, Google x Hack the Future, Hack the 6ix) and organized others.

I read history and economics voraciously (an incomplete list). Recently: great game espionage, the Chilean revolution, Fengtian clique politics, the Taiping rebellion, Napoleon's 1814 campaign. I see history as pattern recognition at scale. In previous years, I was amongst the best in Canadian debate, placing 1st in Ontario and 5th Nationally, and coached many cohorts of students in political science, history, public speaking, and, of course, competitve debate.

I'm also a triathlete training for the national age group team. Did a few Ironmans and ultra events this year. I find the best conversations happen on long runs or at climbing gyms—people are often too exhausted to maintain pretense.

Through this blog, I'll be working through ideas that won't leave me alone. If any of my words resonate with you, write me at jameshan.cs@gmail.com and I'd love to chat. Find me on LinkedIn and GitHub.

---

## Technical Documentation

### Features

- ⚡ Built with [Astro](https://astro.build/) for optimal performance
- 📝 MDX support with KaTeX for mathematical expressions
- 🎨 Dark mode with system preference detection
- 🔍 SEO optimized with Open Graph and JSON-LD structured data
- ♿ WCAG AA accessible with proper ARIA labels and keyboard navigation
- 📱 PWA-ready with Web App Manifest
- 🖼️ Optimized image loading with lazy loading and responsive images
- 📂 Hierarchical blog post organization with interactive file tree
- 🎵 Easter egg music player
- 🔤 Serif/Sans-serif font toggle

### Project Structure

```
/
├── public/              # Static assets (fonts, images, favicon)
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── layout/      # Layout components (BaseHead, Header, Footer)
│   │   ├── ui/          # UI components (ThemeManager, ImageViewer, etc.)
│   │   └── widgets/     # Complex widgets (BlogTree, TableOfContents)
│   ├── content/         # Content collections
│   │   └── posts/       # Blog posts in MDX format
│   ├── layouts/         # Page layouts
│   ├── pages/           # File-based routing
│   │   └── api/         # API endpoints
│   ├── styles/          # Global styles and fonts
│   ├── utils/           # Utility functions
│   └── config.ts        # Theme configuration
├── astro.config.mjs     # Astro configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

### Getting Started

#### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

#### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

#### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Lint code
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code with Prettier
- `pnpm new` - Create new blog post

### Configuration

Edit `src/config.ts` to customize:

- Site metadata (title, description, author)
- Layout settings (width, centered layout)
- Date formatting
- Feature toggles (TOC, reading time, etc.)

### Writing Posts

Create new posts in `src/content/posts/`:

```bash
pnpm new
```

Posts support:
- MDX syntax
- KaTeX math expressions
- Code syntax highlighting with copy button
- Image preview on click
- Custom directives

### Security Features

- SSRF protection on proxy endpoint with URL validation
- Content Security Policy headers (configured in Netlify)
- Sanitized HTML in RSS feeds
- Environment-based console log guards

### Performance Optimizations

- Self-hosted fonts with `font-display: swap`
- Preloaded critical fonts
- Optimized images with WebP format
- Minimal JavaScript bundle
- Static site generation

### Accessibility

- WCAG AA compliant
- Keyboard navigation support
- Proper ARIA labels
- Focus indicators
- Screen reader friendly

### Deployment

The site is configured for deployment on Netlify with:
- Automatic builds on push
- Environment variable support
- Custom headers for security
- Redirect rules

### License

MIT
