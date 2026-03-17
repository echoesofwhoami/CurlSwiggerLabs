import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    labUrl: z.string().url(),
    category: z.string(),
    date: z.string(),
    portswiggerDescription: z.string(),
    lang: z.enum(['en', 'es']).default('en'),
  }),
});

const partials = defineCollection({
  type: 'content',
  schema: z.object({}),
});

const partialsEs = defineCollection({
  type: 'content',
  schema: z.object({}),
});

export const collections = { blog, partials, 'partials-es': partialsEs };
