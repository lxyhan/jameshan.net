/**
 * One-time script to rename numbered-prefix files to clean slugs
 * and add order field to frontmatter based on the old numeric prefix.
 *
 * Run: node scripts/rename-to-slugs.mjs
 * Add --dry-run to preview changes without executing them.
 */

import fs from 'node:fs'
import path from 'node:path'

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'posts')
const DRY_RUN = process.argv.includes('--dry-run')

// Match files starting with digits followed by _ or -
// e.g. 01_foo.md, 03-bar.md, 0_preface.md
const NUMBERED_RE = /^(\d+)[_-](.+)$/

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

    const match = entry.name.match(NUMBERED_RE)
    if (!match) continue

    const orderNum = parseInt(match[1], 10)
    const cleanName = match[2]
    const newPath = path.join(dir, cleanName)
    const relOld = path.relative(POSTS_DIR, fullPath)
    const relNew = path.relative(POSTS_DIR, newPath)

    // Read file content and inject order into frontmatter
    let content = fs.readFileSync(fullPath, 'utf-8')

    // Check if order already exists in frontmatter
    const hasOrder = /^order:\s*\d+/m.test(content.split('---')[1] || '')

    if (!hasOrder) {
      // Insert order before the closing ---
      content = content.replace(/^(---\n[\s\S]*?)(^---)/m, (_, front, close) => {
        return `${front}order: ${orderNum}\n${close}`
      })
    }

    // Also strip leading number from title if it starts with "N. " or "N: "
    content = content.replace(/^(title:\s*['"]?)(\d+\.\s*)/m, '$1')

    if (DRY_RUN) {
      console.log(`  ${relOld} -> ${relNew} (order: ${orderNum})`)
    } else {
      // Write updated content, then rename
      fs.writeFileSync(fullPath, content)
      if (fullPath !== newPath) {
        if (fs.existsSync(newPath)) {
          console.log(`  CONFLICT: ${relNew} already exists, skipping ${relOld}`)
          continue
        }
        fs.renameSync(fullPath, newPath)
      }
      console.log(`  RENAMED: ${relOld} -> ${relNew} (order: ${orderNum})`)
    }
  }
}

console.log(`${DRY_RUN ? 'DRY RUN - ' : ''}Renaming numbered files to clean slugs...\n`)
walk(POSTS_DIR)
console.log('\nDone.')
