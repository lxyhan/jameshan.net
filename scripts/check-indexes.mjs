/**
 * Build-time check: every content folder must have an index.md file.
 * Run: node scripts/check-indexes.mjs
 */

import fs from 'node:fs'
import path from 'node:path'

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'posts')
const SKIP = new Set(['_drafts', '_assets', '_statistics', 'examples', 'posts'])

function getDirectories(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !SKIP.has(d.name) && !d.name.startsWith('_'))
    .map(d => path.join(dir, d.name))
}

const missing = []

function walk(dir) {
  const indexPath = path.join(dir, 'index.md')
  if (!fs.existsSync(indexPath)) {
    missing.push(path.relative(POSTS_DIR, dir))
  }
  for (const subdir of getDirectories(dir)) {
    walk(subdir)
  }
}

for (const dir of getDirectories(POSTS_DIR)) {
  walk(dir)
}

if (missing.length > 0) {
  console.error('\nMissing index.md in the following folders:')
  for (const m of missing) {
    console.error(`  - ${m}`)
  }
  console.error(`\nRun "node scripts/generate-indexes.mjs" to create them.\n`)
  process.exit(1)
}

console.log('All content folders have index.md.')
