import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { ui } from '../i18n/ui';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => (data.lang ?? 'en') === 'en');
  const sorted = posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  return rss({
    title: ui.en['site.title'],
    description: ui.en['site.description'],
    site: context.site!,
    items: sorted.map((post) => {
      const slug = post.id.replace(/^es\//, '').replace(/\.mdx?$/, '');
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: new Date(post.data.date),
        link: `/${slug}/`,
        categories: [post.data.category],
      };
    }),
    customData: `<language>en-us</language>`,
  });
}
