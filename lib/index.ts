// Type utilities and re-exports for easier importing
export type {
  Book,
  Author,
  Genre,
  ReviewFrontmatter,
  ArticleFrontmatter,
  ListFrontmatter,
  SearchableContent,
  ContentType,
} from './schemas';

// Re-export all content functions for easier access
export {
  getAllBooks,
  getBookBySlug,
  getAllAuthors,
  getAuthorBySlug,
  getAllGenres,
  getGenreBySlug,
  getAllReviews,
  getReviewBySlug,
  getAllArticles,
  getArticleBySlug,
  getAllLists,
  getListBySlug,
  getBooksByAuthor,
  getBooksByGenre,
  getBooksByTag,
  getReviewsByBook,
  buildSearchIndex,
  getFeaturedContent,
  getRecentContent,
  getAllTags,
  getContentByTag,
  initContentDirs,
} from './content';

// Re-export all schema validators
export {
  bookSchema,
  authorSchema,
  genreSchema,
  reviewFrontmatterSchema,
  articleFrontmatterSchema,
  listFrontmatterSchema,
  slugSchema,
  hebrewTitleSchema,
  dateSchema,
} from './schemas';
