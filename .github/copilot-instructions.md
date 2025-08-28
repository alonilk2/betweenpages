# "בין הדפים" Copilot Instructions

## Project Overview

"בין הדפים" is a Hebrew book recommendation and literary review site built as a **frontend-only Next.js application** using the App Router with SSG (Static Site Generation). Content is managed through MDX/JSON files in Git, with no backend server or database.

## Architecture Fundamentals

### Content Strategy

- **Books/Authors/Genres**: Static JSON files in `/content/` directory
- **Reviews/Articles/Lists**: MDX files with React components for rich typography
- **Build-time processing**: All content indexed during `next build` for client-side search
- **No CMS**: Writers work directly with MDX/JSON files in Git workflow

### Key Directory Structure

```
/app/(site)/          # Main site routes with App Router
/content/             # Static content (JSON + MDX)
  books/*.json        # Book entities with metadata
  authors/*.json      # Author profiles
  reviews/*.mdx       # Review content with frontmatter
/components/
  ui/                 # Reusable UI components
  blocks/             # MDX-specific blocks (PullQuote, Note, BookCard)
/lib/
  content.ts          # Content loading and indexing logic
  search.ts           # Fuse.js client-side search wrapper
  seo.ts              # Schema.org and meta tag generation
```

## Content Model Patterns

### Book Entity (`/content/books/*.json`)

```json
{
  "slug": "book-slug",
  "title": "ספר לדוגמה",
  "authors": ["author-slug"],
  "genres": ["literary-fiction"],
  "tags": ["אהבה", "מסע"],
  "cover": "/images/covers/book.jpg",
  "quotes": ["ציטוט חשוב..."],
  "related": ["other-book-slug"]
}
```

### MDX Frontmatter Pattern

```yaml
---
slug: 'review-slug'
title: 'כותרת בעברית'
date: '2025-08-01'
book: 'book-slug' # References book entity
tags: ['ביקורת', 'סיפורת']
featured: true # For editorial picks
---
```

## Development Workflows

### Content Creation Process

1. Create MDX/JSON following schema patterns in `/content/`
2. Use Zod validation during CI build process
3. Internal link checking prevents broken references
4. Preview builds show content before merge

### Build & Performance Requirements

- **Target**: Lighthouse scores ≥ 90/95/95/95 (Perf/A11y/BP/SEO)
- **Core Web Vitals**: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1
- **Bundle limit**: JavaScript ≤ 160KB gzipped for MVP
- Run `pnpm dlx next-bundle-analyzer` to monitor bundle size

## Search & Navigation Implementation

### Client-Side Search Architecture

- Build-time indexing creates searchable JSON from all content
- Fuse.js provides fuzzy search with Hebrew text support
- Auto-complete and filtering by genre/author/tags
- Target: ≤ 150ms first result response time

### SEO & Schema Requirements

- Every page needs structured data (Book, Review, Article schemas)
- Hebrew RTL support with `lang="he"` and proper text direction
- Breadcrumbs for navigation hierarchy
- Open Graph images for social sharing

## Typography & Design System

### Font Strategy

- **UI**: Inter/Assistant for interface elements
- **Reading**: Merriweather/Cardo for long-form content
- Load via `next/font` for performance optimization

### Color System (Extract from Logo)

```css
:root {
  --brand-500: /* Primary brand color */ --ink: #0f172a; /* Main text */
  --paper: #ffffff; /* Background */
  --sepia: #f6f1e9; /* Reading background */
}
```

## Critical Development Commands

```bash
pnpm dlx create-next-app@latest  # Project initialization
pnpm dev                         # Development server
pnpm build && pnpm start        # Production build + preview
pnpm lint                       # Code quality checks
pnpm dlx next-bundle-analyzer   # Bundle analysis
```

## Component Patterns

### MDX Custom Components

- `<PullQuote>`: Highlighted quotes within articles
- `<Note>`: Side commentary blocks
- `<BookCard>`: Embedded book recommendations
- All components support RTL text direction

### Image Optimization

- Use `next/image` with WebP/AVIF formats
- Responsive images with blur placeholders
- Book covers in `/public/images/covers/`

## Accessibility Requirements

- WCAG 2.2 AA compliance target
- Hebrew RTL text flow with proper `dir` attributes
- Keyboard navigation for all interactive elements
- Color contrast ratios ≥ 4.5:1 for normal text

## Deployment & Performance

- **Static deployment**: Vercel/Netlify compatible
- **Caching strategy**: Immutable assets with hashes
- **No server required**: Pure static site generation
- Monitor Core Web Vitals in production analytics
