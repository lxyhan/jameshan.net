/**
 * One-time script to generate index.md files for all content folders.
 * Run: node scripts/generate-indexes.mjs
 *
 * Each index recursively lists all articles, sorted by frontmatter order field.
 */

import fs from 'node:fs'
import path from 'node:path'

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'posts')
const SKIP = new Set(['_drafts', '_assets', '_statistics', 'examples', 'posts'])
const TODAY = new Date().toISOString().split('T')[0]

function getDirectories(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !SKIP.has(d.name) && !d.name.startsWith('_'))
    .map(d => path.join(dir, d.name))
}

function getMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(f => f.isFile() && /\.(md|mdx)$/.test(f.name) && f.name !== 'index.md' && !f.name.startsWith('_'))
    .map(f => f.name)
}

function extractFrontmatter(dir, filename) {
  const content = fs.readFileSync(path.join(dir, filename), 'utf-8')
  const titleMatch = content.match(/^---\s*\n[\s\S]*?title:\s*['"]?(.+?)['"]?\s*\n[\s\S]*?^---/m)
  const orderMatch = content.match(/^order:\s*(\d+)/m)
  return {
    title: titleMatch ? titleMatch[1] : filename.replace(/\.(md|mdx)$/, '').replace(/[-_]/g, ' '),
    order: orderMatch ? parseInt(orderMatch[1], 10) : Infinity
  }
}

function getFolderOrder(dir) {
  // Get order from the folder's index file if it exists
  const indexPath = path.join(dir, 'index.md')
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf-8')
    const match = content.match(/^order:\s*(\d+)/m)
    if (match) return parseInt(match[1], 10)
  }
  return Infinity
}

function getSlug(dir, filename) {
  const relative = path.relative(POSTS_DIR, path.join(dir, filename))
    .replace(/\.(md|mdx)$/, '')
    .split(path.sep)
    .map(p => p.toLowerCase().replace(/\s+/g, '-'))
    .join('/')
  return `/${relative}`
}

function hasIndex(dir) {
  return fs.existsSync(path.join(dir, 'index.md'))
}

/** Build a nested listing of all files and subfolders, sorted by order */
function buildListing(dir, indent = '') {
  const files = getMarkdownFiles(dir)
  const subdirs = getDirectories(dir)
  const lines = []

  const entries = []

  for (const file of files) {
    const fm = extractFrontmatter(dir, file)
    entries.push({ type: 'file', name: file, dir, title: fm.title, order: fm.order })
  }
  for (const subdir of subdirs) {
    const name = path.basename(subdir)
    entries.push({ type: 'folder', name, path: subdir, order: getFolderOrder(subdir) })
  }

  // Sort by order (ascending), then alphabetically as tiebreaker
  entries.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order
    return a.name.localeCompare(b.name)
  })

  let counter = 1
  for (const entry of entries) {
    if (entry.type === 'file') {
      const slug = getSlug(entry.dir, entry.name)
      lines.push(`${indent}${counter}. [${entry.title}](${slug})`)
    } else {
      const folderSlug = '/' + path.relative(POSTS_DIR, entry.path)
        .split(path.sep)
        .map(p => p.toLowerCase().replace(/\s+/g, '-'))
        .join('/') + '/index'
      lines.push(`${indent}${counter}. [${entry.name}](${folderSlug})`)
      const subLines = buildListing(entry.path, indent + '   ')
      lines.push(...subLines)
    }
    counter++
  }

  return lines
}

function generateIndex(dir) {
  if (hasIndex(dir)) {
    console.log(`  SKIP (exists): ${path.relative(POSTS_DIR, dir)}`)
    return
  }

  const lines = buildListing(dir)
  const folderName = path.basename(dir)

  const content = `---
title: "Index: ${folderName}"
pubDate: "${TODAY}"
order: 0
---

## Articles

${lines.join('\n')}
`

  fs.writeFileSync(path.join(dir, 'index.md'), content)
  console.log(`  CREATED: ${path.relative(POSTS_DIR, dir)}/index.md (${lines.length} entries)`)
}

function walk(dir) {
  generateIndex(dir)
  for (const subdir of getDirectories(dir)) {
    walk(subdir)
  }
}

console.log('Generating index files...\n')

for (const dir of getDirectories(POSTS_DIR)) {
  walk(dir)
}

console.log('\nDone.')
