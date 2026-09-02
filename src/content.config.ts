import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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

const labNotes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
  }),
});

const quizzes = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/quizzes' }),
  schema: z.object({
    questions: z.array(
      z.object({
        q: z.string(),
        o: z.array(z.string()),
        a: z.number(),
        x: z.string().optional(),
        h: z.string().optional(),
      }),
    ),
  }),
});

export const collections = { blog, partials, 'partials-es': partialsEs, 'lab-notes': labNotes, quizzes };
