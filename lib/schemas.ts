import { z } from 'zod';

// Base schemas for common fields
export const slugSchema = z.string().min(1, 'Slug is required');
export const hebrewTitleSchema = z.string().min(1, 'Hebrew title is required');
export const dateSchema = z
  .string()
  .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format');

// Book schema
export const bookSchema = z.object({
  slug: slugSchema,
  title: hebrewTitleSchema,
  originalTitle: z.string().optional(),
  authors: z.array(z.string()).min(1, 'At least one author required'),
  genres: z.array(z.string()).min(1, 'At least one genre required'),
  tags: z.array(z.string()).default([]),
  publishYear: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear() + 10),
  pages: z.number().int().positive().optional(),
  isbn: z.string().optional(),
  cover: z.string().optional(), // Path to cover image
  publisher: z.string().optional(),
  language: z.string().default('Hebrew'),
  description: z.string().optional(),
  quotes: z.array(z.string()).default([]),
  rating: z.number().min(1).max(5).optional(),
  related: z.array(z.string()).default([]), // Related book slugs
  featured: z.boolean().default(false),
  // Optional Shopify product handle for purchase integration
  shopifyHandle: z.string().optional(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

// Author schema
export const authorSchema = z.object({
  slug: slugSchema,
  name: hebrewTitleSchema,
  originalName: z.string().optional(),
  bio: z.string().optional(),
  birthYear: z.number().int().min(1000).optional(),
  deathYear: z.number().int().min(1000).optional(),
  nationality: z.string().optional(),
  photo: z.string().optional(), // Path to author photo
  website: z.string().url().optional(),
  books: z.array(z.string()).default([]), // Book slugs
  awards: z.array(z.string()).default([]),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

// Genre schema
export const genreSchema = z.object({
  slug: slugSchema,
  name: hebrewTitleSchema,
  description: z.string().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(), // Hex color
  icon: z.string().optional(), // Icon name or path
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

// MDX Frontmatter schemas
export const reviewFrontmatterSchema = z.object({
  slug: slugSchema,
  title: hebrewTitleSchema,
  subtitle: z.string().optional(),
  date: dateSchema,
  book: z.string(), // Book slug
  author: z.string().optional(), // Review author/critic
  excerpt: z.string().optional(),
  tags: z.array(z.string()).default([]),
  rating: z.number().min(1).max(5).optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  readingTime: z.number().positive().optional(), // In minutes
  coverImage: z.string().optional(),
});

export const articleFrontmatterSchema = z.object({
  slug: slugSchema,
  title: hebrewTitleSchema,
  subtitle: z.string().optional(),
  date: dateSchema,
  author: z.string().optional(),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  readingTime: z.number().positive().optional(),
  coverImage: z.string().optional(),
});

export const listFrontmatterSchema = z.object({
  slug: slugSchema,
  title: hebrewTitleSchema,
  subtitle: z.string().optional(),
  date: dateSchema,
  author: z.string().optional(),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).default([]),
  books: z.array(z.string()).default([]), // Book slugs included in list
  listType: z
    .enum(['best-of', 'recommendation', 'themed', 'seasonal'])
    .default('recommendation'),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  coverImage: z.string().optional(),
});

// Type exports
export type Book = z.infer<typeof bookSchema>;
export type Author = z.infer<typeof authorSchema>;
export type Genre = z.infer<typeof genreSchema>;
export type ReviewFrontmatter = z.infer<typeof reviewFrontmatterSchema>;
export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;
export type ListFrontmatter = z.infer<typeof listFrontmatterSchema>;

// Content type union for search indexing
export type ContentType =
  | 'book'
  | 'author'
  | 'genre'
  | 'review'
  | 'article'
  | 'list';

export interface SearchableContent {
  type: ContentType;
  slug: string;
  title: string;
  excerpt?: string;
  tags: string[];
  url: string;
  date?: string;
  featured?: boolean;
}
