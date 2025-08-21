import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
  Book,
  Author,
  Genre,
  ReviewFrontmatter,
  ArticleFrontmatter,
  ListFrontmatter,
  bookSchema,
  authorSchema,
  genreSchema,
  reviewFrontmatterSchema,
  articleFrontmatterSchema,
  listFrontmatterSchema,
  SearchableContent,
} from './schemas';

// Content directories
const CONTENT_DIR = path.join(process.cwd(), 'content');
const BOOKS_DIR = path.join(CONTENT_DIR, 'books');
const AUTHORS_DIR = path.join(CONTENT_DIR, 'authors');
const GENRES_DIR = path.join(CONTENT_DIR, 'genres');
const REVIEWS_DIR = path.join(CONTENT_DIR, 'reviews');
const ARTICLES_DIR = path.join(CONTENT_DIR, 'articles');
const LISTS_DIR = path.join(CONTENT_DIR, 'lists');

// Utility function to ensure directory exists
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Initialize content directories
export function initContentDirs() {
  ensureDir(BOOKS_DIR);
  ensureDir(AUTHORS_DIR);
  ensureDir(GENRES_DIR);
  ensureDir(REVIEWS_DIR);
  ensureDir(ARTICLES_DIR);
  ensureDir(LISTS_DIR);
}

// Generic function to read and validate JSON files
function readJsonFile<T>(
  filePath: string,
  schema: { parse: (data: unknown) => T }
): T {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    return schema.parse(data);
  } catch (error) {
    throw new Error(`Error reading ${filePath}: ${error}`);
  }
}

// Generic function to read and validate MDX files
function readMdxFile<T>(
  filePath: string,
  schema: { parse: (data: unknown) => T }
): { frontmatter: T; content: string } {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const frontmatter = schema.parse(data);
    return { frontmatter, content };
  } catch (error) {
    throw new Error(`Error reading ${filePath}: ${error}`);
  }
}

// Get all files of a specific type
function getFilePaths(dir: string, extension: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(extension))
    .map((file) => path.join(dir, file));
}

// Books
export function getAllBooks(): Book[] {
  const filePaths = getFilePaths(BOOKS_DIR, '.json');
  return filePaths.map((filePath) => readJsonFile<Book>(filePath, bookSchema));
}

export function getBookBySlug(slug: string): Book | null {
  const filePath = path.join(BOOKS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return readJsonFile<Book>(filePath, bookSchema);
}

// Authors
export function getAllAuthors(): Author[] {
  const filePaths = getFilePaths(AUTHORS_DIR, '.json');
  return filePaths.map((filePath) =>
    readJsonFile<Author>(filePath, authorSchema)
  );
}

export function getAuthorBySlug(slug: string): Author | null {
  const filePath = path.join(AUTHORS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return readJsonFile<Author>(filePath, authorSchema);
}

// Genres
export function getAllGenres(): Genre[] {
  const filePaths = getFilePaths(GENRES_DIR, '.json');
  return filePaths.map((filePath) =>
    readJsonFile<Genre>(filePath, genreSchema)
  );
}

export function getGenreBySlug(slug: string): Genre | null {
  const filePath = path.join(GENRES_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return readJsonFile<Genre>(filePath, genreSchema);
}

// Reviews
export function getAllReviews(): {
  frontmatter: ReviewFrontmatter;
  content: string;
}[] {
  const filePaths = getFilePaths(REVIEWS_DIR, '.mdx');
  return filePaths.map((filePath) =>
    readMdxFile<ReviewFrontmatter>(filePath, reviewFrontmatterSchema)
  );
}

export function getReviewBySlug(
  slug: string
): { frontmatter: ReviewFrontmatter; content: string } | null {
  const filePath = path.join(REVIEWS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return readMdxFile<ReviewFrontmatter>(filePath, reviewFrontmatterSchema);
}

// Articles
export function getAllArticles(): {
  frontmatter: ArticleFrontmatter;
  content: string;
}[] {
  const filePaths = getFilePaths(ARTICLES_DIR, '.mdx');
  return filePaths.map((filePath) =>
    readMdxFile<ArticleFrontmatter>(filePath, articleFrontmatterSchema)
  );
}

export function getArticleBySlug(
  slug: string
): { frontmatter: ArticleFrontmatter; content: string } | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return readMdxFile<ArticleFrontmatter>(filePath, articleFrontmatterSchema);
}

// Lists
export function getAllLists(): {
  frontmatter: ListFrontmatter;
  content: string;
}[] {
  const filePaths = getFilePaths(LISTS_DIR, '.mdx');
  return filePaths.map((filePath) =>
    readMdxFile<ListFrontmatter>(filePath, listFrontmatterSchema)
  );
}

export function getListBySlug(
  slug: string
): { frontmatter: ListFrontmatter; content: string } | null {
  const filePath = path.join(LISTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return readMdxFile<ListFrontmatter>(filePath, listFrontmatterSchema);
}

// Helper functions for relationships
export function getBooksByAuthor(authorSlug: string): Book[] {
  return getAllBooks().filter((book) => book.authors.includes(authorSlug));
}

export function getBooksByGenre(genreSlug: string): Book[] {
  return getAllBooks().filter((book) => book.genres.includes(genreSlug));
}

export function getBooksByTag(tag: string): Book[] {
  return getAllBooks().filter((book) => book.tags.includes(tag));
}

export function getReviewsByBook(
  bookSlug: string
): { frontmatter: ReviewFrontmatter; content: string }[] {
  return getAllReviews().filter(
    (review) => review.frontmatter.book === bookSlug
  );
}

// Search indexing - build searchable content for all content types
export function buildSearchIndex(): SearchableContent[] {
  const searchableContent: SearchableContent[] = [];

  // Books
  const books = getAllBooks();
  books.forEach((book) => {
    searchableContent.push({
      type: 'book',
      slug: book.slug,
      title: book.title,
      excerpt: book.description,
      tags: [...book.genres, ...book.tags, ...book.authors],
      url: `/books/${book.slug}`,
      date: book.createdAt,
      featured: book.featured,
    });
  });

  // Authors
  const authors = getAllAuthors();
  authors.forEach((author) => {
    searchableContent.push({
      type: 'author',
      slug: author.slug,
      title: author.name,
      excerpt: author.bio,
      tags: [],
      url: `/authors/${author.slug}`,
      date: author.createdAt,
    });
  });

  // Genres
  const genres = getAllGenres();
  genres.forEach((genre) => {
    searchableContent.push({
      type: 'genre',
      slug: genre.slug,
      title: genre.name,
      excerpt: genre.description,
      tags: [],
      url: `/genres/${genre.slug}`,
      date: genre.createdAt,
    });
  });

  // Reviews
  const reviews = getAllReviews();
  reviews.forEach((review) => {
    if (!review.frontmatter.draft) {
      searchableContent.push({
        type: 'review',
        slug: review.frontmatter.slug,
        title: review.frontmatter.title,
        excerpt: review.frontmatter.excerpt,
        tags: review.frontmatter.tags,
        url: `/reviews/${review.frontmatter.slug}`,
        date: review.frontmatter.date,
        featured: review.frontmatter.featured,
      });
    }
  });

  // Articles
  const articles = getAllArticles();
  articles.forEach((article) => {
    if (!article.frontmatter.draft) {
      searchableContent.push({
        type: 'article',
        slug: article.frontmatter.slug,
        title: article.frontmatter.title,
        excerpt: article.frontmatter.excerpt,
        tags: article.frontmatter.tags,
        url: `/articles/${article.frontmatter.slug}`,
        date: article.frontmatter.date,
        featured: article.frontmatter.featured,
      });
    }
  });

  // Lists
  const lists = getAllLists();
  lists.forEach((list) => {
    if (!list.frontmatter.draft) {
      searchableContent.push({
        type: 'list',
        slug: list.frontmatter.slug,
        title: list.frontmatter.title,
        excerpt: list.frontmatter.excerpt,
        tags: list.frontmatter.tags,
        url: `/lists/${list.frontmatter.slug}`,
        date: list.frontmatter.date,
        featured: list.frontmatter.featured,
      });
    }
  });

  return searchableContent;
}

// Get featured content
export function getFeaturedContent() {
  const searchIndex = buildSearchIndex();
  return {
    books: searchIndex.filter((item) => item.type === 'book' && item.featured),
    reviews: searchIndex.filter(
      (item) => item.type === 'review' && item.featured
    ),
    articles: searchIndex.filter(
      (item) => item.type === 'article' && item.featured
    ),
    lists: searchIndex.filter((item) => item.type === 'list' && item.featured),
  };
}

// Get recent content
export function getRecentContent(limit: number = 10) {
  const searchIndex = buildSearchIndex();
  return searchIndex
    .filter((item) => item.date)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
    .slice(0, limit);
}

// Get all tags across all content
export function getAllTags(): string[] {
  const searchIndex = buildSearchIndex();
  const tagSet = new Set<string>();

  searchIndex.forEach((item) => {
    item.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}

// Get content by tag
export function getContentByTag(tag: string): SearchableContent[] {
  const searchIndex = buildSearchIndex();
  return searchIndex.filter((item) => item.tags.includes(tag));
}
