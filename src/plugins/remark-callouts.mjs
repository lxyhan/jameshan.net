import { visit } from 'unist-util-visit'

/**
 * Remark plugin to add callout styling to blockquotes that start with emojis
 * Automatically detects emojis and adds data-callout attributes
 */
export default function remarkCallouts() {
  return (tree) => {
    visit(tree, 'blockquote', (node) => {
      // Get the first paragraph in the blockquote
      const firstParagraph = node.children.find(child => child.type === 'paragraph')
      if (!firstParagraph || !firstParagraph.children || firstParagraph.children.length === 0) {
        return
      }

      // Get the first text node
      const firstChild = firstParagraph.children[0]
      if (firstChild.type !== 'text') {
        return
      }

      const text = firstChild.value
      if (!text) {
        return
      }

      // Map emojis to callout types
      const emojiMap = {
        '💡': 'info',
        '📝': 'note',
        'ℹ️': 'info',
        '📘': 'note',
        '⚠️': 'warning',
        '❗': 'warning',
        '⚡': 'caution',
        '✅': 'success',
        '✓': 'success',
        '🎉': 'success',
        '💚': 'tip',
        '❌': 'error',
        '🔴': 'danger',
        '⛔': 'danger',
        '❓': 'question',
        '🤔': 'question',
        '💬': 'quote',
        '🗨️': 'quote'
      }

      // Check if the text starts with a known emoji
      for (const [emoji, calloutType] of Object.entries(emojiMap)) {
        if (text.startsWith(emoji)) {
          // Add data attribute to the blockquote node
          if (!node.data) {
            node.data = {}
          }
          if (!node.data.hProperties) {
            node.data.hProperties = {}
          }
          node.data.hProperties['data-callout'] = calloutType
          break
        }
      }
    })
  }
}
