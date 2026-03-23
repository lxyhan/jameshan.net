/**
 * Rename every markdown file to a slug of its frontmatter title.
 * Run: node scripts/rename-to-title-slugs.mjs --dry-run
 * Run: node scripts/rename-to-title-slugs.mjs
 */

import fs from 'node:fs'
import path from 'node:path'

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'posts')
const DRY_RUN = process.argv.includes('--dry-run')

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/['']/g, '')           // remove apostrophes
    .replace(/[&]/g, 'and')         // & -> and
    .replace(/[^a-z0-9\s-]/g, '')   // remove special chars
    .replace(/\s+/g, '_')           // spaces -> underscores
    .replace(/-+/g, '_')            // dashes -> underscores
    .replace(/_+/g, '_')            // collapse multiple underscores
    .replace(/^_|_$/g, '')          // trim leading/trailing underscores
}

function extractTitle(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8')
  const match = content.match(/^---\s*\n[\s\S]*?title:\s*['"]?(.+?)['"]?\s*\n[\s\S]*?^---/m)
  return match ? match[1] : null
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(fullPath)
      continue
    }
    if (!entry.name.match(/\.(md|mdx)$/)) continue
    if (entry.name === 'index.md') continue
    if (entry.name.startsWith('_')) continue

    const title = extractTitle(fullPath)
    if (!title) {
      console.log(`  SKIP (no title): ${path.relative(POSTS_DIR, fullPath)}`)
      continue
    }

    const ext = path.extname(entry.name)
    const newName = slugify(title) + ext
    const newPath = path.join(dir, newName)
    const relOld = path.relative(POSTS_DIR, fullPath)
    const relNew = path.relative(POSTS_DIR, newPath)

    if (entry.name === newName) {
      // Already matches
      continue
    }

    if (DRY_RUN) {
      console.log(`  ${relOld} -> ${relNew}`)
    } else {
      if (fs.existsSync(newPath) && fullPath !== newPath) {
        console.log(`  CONFLICT: ${relNew} already exists, skipping ${relOld}`)
        continue
      }
      fs.renameSync(fullPath, newPath)
      console.log(`  RENAMED: ${relOld} -> ${relNew}`)
    }
  }
}

console.log(`${DRY_RUN ? 'DRY RUN - ' : ''}Renaming files to title slugs...\n`)
walk(POSTS_DIR)
console.log('\nDone.')
