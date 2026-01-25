import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'

import remarkMath from 'remark-math'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'                         // ⭐ ADDED
import remarkEmbeddedMedia from './src/plugins/remark-embedded-media.mjs'
import remarkReadingTime from './src/plugins/remark-reading-time.mjs'
import remarkTOC from './src/plugins/remark-toc.mjs'
import remarkCallouts from './src/plugins/remark-callouts.mjs'

import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'                         // ⭐ ADDED
import rehypeCleanup from './src/plugins/rehype-cleanup.mjs'
import rehypeImageProcessor from './src/plugins/rehype-image-processor.mjs'
import rehypeCopyCode from './src/plugins/rehype-copy-code.mjs'

import { themeConfig } from './src/config'
import { imageConfig } from './src/utils/image-config'

import path from 'path'
import netlify from '@astrojs/netlify'

export default defineConfig({
  adapter: netlify(),
  site: themeConfig.site.website,

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: imageConfig
    }
  },

  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      defaultColor: false,
      wrap: false
    },
    remarkPlugins: [
      remarkMath,
      remarkDirective,
      remarkGfm,                         // ⭐ ADDED: enables footnotes, tables, tasks, etc.
      remarkCallouts,                    // ⭐ ADDED: emoji-based callouts
      remarkEmbeddedMedia,
      remarkReadingTime,
      remarkTOC
    ],
    rehypePlugins: [
      rehypeKatex,
      rehypeRaw,                         // ⭐ ADDED: enables inline HTML in markdown
      rehypeCleanup,
      rehypeImageProcessor,
      rehypeCopyCode
    ]
  },

  integrations: [
    // playformInline({
    //   Exclude: [
    //     (file) => file.toLowerCase().includes('katex'),
    //     (file) => file.toLowerCase().includes('shiki'),
    //     (file) => file.toLowerCase().includes('astro-code')
    //   ]
    // }),
    mdx(),
    sitemap()
  ],

  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    },
    server: {
      headers: {
        'Cache-Control': 'no-store'
      }
    }
  },

  devToolbar: {
    enabled: false
  }
})
