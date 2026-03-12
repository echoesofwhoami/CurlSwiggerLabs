import { getCollection } from 'astro:content';

export async function getPosts() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id.replace(/\.mdx?$/, '') },
    props: { post },
  }));
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export async function getGroupedPosts() {
  const allPosts = await getCollection('blog');

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