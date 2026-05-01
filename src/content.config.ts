import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("ApexArc Global"),
    authorRole: z.string().optional(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    problem: z.string().optional(),
    solution: z.string().optional(),
    proof: z.string().optional(),
    outcome: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    readingTime: z.string().optional()
  })
});

export const collections = { blog };
