import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    labUrl: z.string().url(),
    category: z.string(),
    date: z.string(),
  }),
});

export const collections = { blog };
