import { getCollection, type CollectionEntry } from 'astro:content'

/**
 * Get all posts, filtering out posts whose filenames start with _ or are in the examples folder
 */
export async function getFilteredPosts() {
  const posts = await getCollection('posts')
  return posts.filter((post: CollectionEntry<'posts'>) => {
    const filename = post.id.split('/').pop() || ''
    return !filename.startsWith('_') && !post.id.startsWith('_') && !post.id.startsWith('examples/')
  })
}

/**
 * Get all posts sorted by publication date, filtering out posts whose filenames start with _
 */
export async function getSortedFilteredPosts() {
  const posts = await getFilteredPosts()
  return posts.sort(
    (a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) => {
      const aOrder = a.data.order
      const bOrder = b.data.order
      if (aOrder != null && bOrder != null) return aOrder - bOrder
      if (aOrder != null) return -1
      if (bOrder != null) return 1
      return b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
    }
  )
}
