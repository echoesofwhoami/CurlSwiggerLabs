import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import type { APIContext } from 'astro'
import { getPostSlug } from '../utils'

export async function GET(context: APIContext) {
  const posts = await getCollection('blog')
  const sorted = posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  )

  return rss({
    title: 'CurlSwiggerLabs',
    description: 'PortSwigger Web Security Academy labs solved with curl.',
    site: context.site!,
    trailingSlash: false,
    items: sorted.map((post) => {
      const slug = getPostSlug(post.id)
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: new Date(post.data.date),
        link: `/${slug}`,
        categories: [post.data.category],
      }
    }),
    customData: '<language>en-us</language>',
  })
}
