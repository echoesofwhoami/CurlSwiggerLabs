import { getCollection } from 'astro:content';

export async function getPosts(lang: 'en' | 'es' = 'en') {
  const posts = await getCollection('blog', ({ data }) => (data.lang ?? 'en') === lang);
  return posts.map((post) => ({
    params: { slug: post.id.replace(/^es\//, '').replace(/\.mdx?$/, '') },
    props: { post },
  }));
}

export function formatDate(date: string, lang: 'en' | 'es' = 'en'): string {
  const locale = lang === 'es' ? 'es-ES' : 'en-US';
  return new Date(date).toLocaleDateString(locale, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export async function getGroupedPosts(lang: 'en' | 'es' = 'en') {
  const allPosts = await getCollection('blog', ({ data }) => (data.lang ?? 'en') === lang);

  const sortedPosts = allPosts.sort((a, b) => 
    new Date(a.data.date).getTime() - new Date(b.data.date).getTime()
  );

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