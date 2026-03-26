import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const posts = defineCollection({
  // Load Markdown and MDX files in the `src/content/posts/` directory.
  loader: glob({
    base: './src/content/posts',
    pattern: '**/*.{md,mdx}',
    // Preserve "index" in IDs so folder/index.md doesn't collapse to just "folder"
    generateId: ({ entry }) => {
      return entry
        .replace(/\.(md|mdx)$/, '')
        .split('/')
        .map(segment => segment.toLowerCase().replace(/[&]/g, 'and').replace(/\s+/g, '-'))
        .join('/')
    }
  }),
  // Type-check frontmatter using a schema
  schema: () =>
    z.object({
      title: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      image: z.string().optional(),
      order: z.number().optional(),
      viewId: z.number().optional()
    })
})

const about = defineCollection({
  // Load Markdown files in the `src/content/about/` directory.
  loader: glob({ base: './src/content/about', pattern: '**/*.md' }),
  // Type-check frontmatter using a schema
  schema: z.object({})
})

export const collections = { posts, about }
