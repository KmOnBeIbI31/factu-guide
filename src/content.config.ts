import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(70),
      description: z.string().min(120).max(160),
      pillar: z.enum(['cumplimiento', 'fiscalidad', 'casos']),
      publishedAt: z.date(),
      updatedAt: z.date().optional(),
      author: z.literal('adrian-sanchez'),
      heroImage: image().optional(),
      heroAlt: z.string().optional(),
      tags: z.array(z.string()).max(6),
      readingTime: z.number().int().positive(),
      canonical: z.string().url().optional(),
      draft: z.boolean().default(false),
      relatedSlugs: z.array(z.string()).max(4).optional(),
      factCheckedAt: z.date().optional(),
      sources: z
        .array(
          z.object({
            label: z.string(),
            url: z.string().url(),
          }),
        )
        .optional(),
      faq: z
        .array(
          z.object({
            q: z.string(),
            a: z.string(),
          }),
        )
        .optional(),
    }),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    avatar: z.string().optional(),
    role: z.string(),
    sameAs: z.array(z.string().url()),
  }),
});

export const collections = { blog, authors };
