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
    difficulty: z.enum(['Apprentice', 'Practitioner', 'Expert']),
    tools: z.array(z.string()).min(1),
    technologies: z.array(z.string()).default([]),
    series: z.string().optional(),
  }),
});

const partials = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
  }),
});

const partialsEs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    category: z.string().optional(),
  }),
});

export const collections = { blog, partials, 'partials-es': partialsEs };
