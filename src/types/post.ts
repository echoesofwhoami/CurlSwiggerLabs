import type { CollectionEntry } from 'astro:content'

export type BlogPost = CollectionEntry<'blog'>

export type ConceptPartial = CollectionEntry<'partials'>

export interface GroupedPosts {
  category: string;
  categoryPosts: BlogPost[];
}

export interface ConceptGroup {
  category: string;
  id: string;
  partials: ConceptPartial[];
}

export interface LabLink {
  href: string;
  title: string;
}

export interface DescriptionParagraph {
  text: string;
  hook: boolean;
}

export interface PostLayoutProps {
  post: CollectionEntry<'blog'>;
}

export interface Heading {
  depth: number;
  slug: string;
  text: string;
}

export interface TableOfContentsProps {
  headings: Heading[];
}

export interface QuizProps {
  /** Collection id relative to `src/data/quizzes/`, without .json */
  file: string;
  /** Stable slug used as the localStorage key */
  slug: string;
}

export interface PostNavProps {
  older?: CollectionEntry<'blog'>;
  newer?: CollectionEntry<'blog'>;
}

export interface RelatedLabsProps {
  posts: CollectionEntry<'blog'>[];
}

export interface MetaChipProps {
  label: string;
}

export interface PostHeaderProps {
  title: string;
  description: string;
  category: string;
  labUrl: string;
  date: string;
  difficulty: 'Apprentice' | 'Practitioner' | 'Expert';
  tools: string[];
  technologies?: string[];
  series?: string;
}
