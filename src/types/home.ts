import type { CollectionEntry } from 'astro:content'

export interface PostCardProps {
  post: CollectionEntry<'blog'>;
}

export interface PostListProps {
  category: string;
  posts: CollectionEntry<'blog'>[];
}

export interface DiscordCtaProps {
  compact?: boolean;
}
