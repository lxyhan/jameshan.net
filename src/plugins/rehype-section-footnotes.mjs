import { visit } from 'unist-util-visit'

/**
 * Rehype plugin that moves GFM footnotes from the bottom of the page
 * to the end of the section (## heading) that contains their reference.
 */
export default function rehypeSectionFootnotes() {
  return (tree) => {
    // Find the footnotes section that remark-gfm generates
    let footnotesSection = null
    let footnotesSectionIndex = -1
    let footnotesParent = null

    visit(tree, 'element', (node, index, parent) => {
      if (
        node.tagName === 'section' &&
        node.properties?.dataFootnotes !== undefined
      ) {
        footnotesSection = node
        footnotesSectionIndex = index
        footnotesParent = parent
      }
    })

    if (!footnotesSection || !footnotesParent) return

    // Extract individual footnote list items from the <ol>
    const ol = footnotesSection.children.find(
      (c) => c.type === 'element' && c.tagName === 'ol'
    )
    if (!ol) return

    const footnoteItems = ol.children.filter(
      (c) => c.type === 'element' && c.tagName === 'li'
    )
    if (footnoteItems.length === 0) return

    // Build a map of footnote id -> footnote li node
    // GFM gives them ids like "user-content-fn-1"
    const footnoteMap = new Map()
    for (const item of footnoteItems) {
      const id = item.properties?.id
      if (id) {
        footnoteMap.set(id, item)
      }
    }

    // Find all footnote references in the document and map them to their
    // nearest preceding h2 section boundary
    // References have href like "#user-content-fn-1" and data-footnote-ref
    const refToSection = new Map()

    // First, collect all top-level children of body/root to find section boundaries
    const body = footnotesParent
    const children = body.children

    // Walk through children, tracking current section start index
    let currentSectionStart = 0
    const sectionBoundaries = [0] // indices where new sections start

    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (
        child.type === 'element' &&
        child.tagName === 'h2'
      ) {
        sectionBoundaries.push(i)
        currentSectionStart = i
      }
    }

    // For each footnote reference, find which section it belongs to
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (child === footnotesSection) continue

      // Determine which section this child belongs to
      let sectionIdx = 0
      for (let s = 0; s < sectionBoundaries.length; s++) {
        if (sectionBoundaries[s] <= i) {
          sectionIdx = s
        }
      }

      // Search this node for footnote references
      visit(child, 'element', (node) => {
        if (node.properties?.dataFootnoteRef !== undefined) {
          const href = node.properties?.href
          if (href) {
            // href is like "#user-content-fn-1", the id is "user-content-fn-1"
            const fnId = href.replace(/^#/, '')
            refToSection.set(fnId, sectionIdx)
          }
        }
      })
    }

    // Group footnotes by section
    const sectionFootnotes = new Map()
    for (const [fnId, item] of footnoteMap) {
      const sectionIdx = refToSection.get(fnId)
      if (sectionIdx === undefined) continue
      if (!sectionFootnotes.has(sectionIdx)) {
        sectionFootnotes.set(sectionIdx, [])
      }
      sectionFootnotes.get(sectionIdx).push(item)
    }

    // Remove the original footnotes section
    footnotesParent.children.splice(footnotesSectionIndex, 1)

    // Insert footnote blocks at the end of each section (before the next h2)
    // We need to work backwards to avoid index shifting
    const sortedSections = [...sectionFootnotes.keys()].sort((a, b) => b - a)

    for (const sectionIdx of sortedSections) {
      const items = sectionFootnotes.get(sectionIdx)
      if (!items || items.length === 0) continue

      // Find the insertion point: just before the next h2, or at the end
      const sectionStart = sectionBoundaries[sectionIdx]
      const nextSectionStart = sectionBoundaries[sectionIdx + 1]

      // The insertion index is right before the next section, or at the end
      let insertAt
      if (nextSectionStart !== undefined) {
        // Account for the removed footnotes section
        insertAt = nextSectionStart > footnotesSectionIndex
          ? nextSectionStart - 1
          : nextSectionStart
      } else {
        insertAt = footnotesParent.children.length
      }

      // Create a footnotes block for this section
      const footnoteBlock = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['section-footnotes'] },
        children: [
          {
            type: 'element',
            tagName: 'ol',
            properties: {},
            children: items
          }
        ]
      }

      footnotesParent.children.splice(insertAt, 0, footnoteBlock)
    }
  }
}
