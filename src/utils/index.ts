import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

type Language = 'en' | 'es';

function getPostSlug(id: string): string {
  return id.replace(/^es\//, '').replace(/\.mdx?$/, '');
}

function byNewestFirst(
  a: CollectionEntry<'blog'>,
  b: CollectionEntry<'blog'>,
) {
  const dateDifference = new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  return dateDifference || a.id.localeCompare(b.id);
}

export async function getPosts(lang: Language = 'en') {
  const posts = await getCollection('blog', ({ data }) => (data.lang ?? 'en') === lang);
  return posts.map((post) => ({
    params: { slug: getPostSlug(post.id) },
    props: { post },
  }));
}

export function formatDate(date: string, lang: Language = 'en'): string {
  const locale = lang === 'es' ? 'es-ES' : 'en-US';
  return new Date(date).toLocaleDateString(locale, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export async function getGroupedPosts(lang: Language = 'en') {
  const allPosts = await getCollection('blog', ({ data }) => (data.lang ?? 'en') === lang);

  const sortedPosts = allPosts.sort(byNewestFirst);

  const postsByCategory = sortedPosts.reduce((categories, post) => {
    const category = post.data.category;
    
    categories[category] ??= [];
    
    categories[category].push(post);
    
    return categories;
  }, {} as Record<string, typeof sortedPosts>);

  const groupedPosts = Object
    .entries(postsByCategory)
    .map(([category, categoryPosts]) => ({
      category,
      categoryPosts,
    }));

  return groupedPosts;
}

export async function getAdjacentPosts(slug: string, lang: Language = 'en') {
  const posts = await getCollection('blog', ({ data }) => (data.lang ?? 'en') === lang);
  const currentPost = posts.find((post) => getPostSlug(post.id) === slug);

  if (!currentPost) {
    return { older: undefined, newer: undefined };
  }

  const categoryPosts = posts
    .filter((post) => post.data.category === currentPost.data.category)
    .sort((a, b) => {
      const dateDifference = new Date(a.data.date).getTime() - new Date(b.data.date).getTime();
      return dateDifference || a.id.localeCompare(b.id);
    });
  const currentIndex = categoryPosts.findIndex((post) => post.id === currentPost.id);

  return {
    older: categoryPosts[currentIndex - 1],
    newer: categoryPosts[currentIndex + 1],
  };
}

export async function getRelatedPosts(slug: string, lang: Language = 'en', limit = 3) {
  if (limit <= 0) {
    return [];
  }

  const posts = await getCollection('blog', ({ data }) => (data.lang ?? 'en') === lang);
  const currentPost = posts.find((post) => getPostSlug(post.id) === slug);

  if (!currentPost) {
    return [];
  }

  const candidates = posts
    .filter((post) => post.id !== currentPost.id)
    .sort(byNewestFirst);
  const sameSeries = currentPost.data.series
    ? candidates.filter((post) => post.data.series === currentPost.data.series)
    : [];
  const sameCategory = candidates.filter(
    (post) =>
      post.data.category === currentPost.data.category &&
      !sameSeries.some((seriesPost) => seriesPost.id === post.id),
  );

  return [...sameSeries, ...sameCategory].slice(0, limit);
}
