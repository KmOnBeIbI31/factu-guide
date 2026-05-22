import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
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
    }),
});

const authors = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    avatar: z.string().optional(),
    role: z.string(),
    sameAs: z.array(z.string().url()),
  }),
});

export const collections = { blog, authors };
