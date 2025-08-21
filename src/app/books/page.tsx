import Link from 'next/link';
import { Metadata } from 'next';
import {
  getAllBooks,
  getAllAuthors,
  getAllGenres,
  getAuthorBySlug,
} from '../../../lib/content';
import { BookCard } from '../../../components';

export const metadata: Metadata = {
  title: 'כל הספרים | בין הדפים',
  description: 'רשימת כל הספרים באתר - עיינו, חפשו וגלו ספרים חדשים',
  openGraph: {
    title: 'כל הספרים | בין הדפים',
    description: 'רשימת כל הספרים באתר - עיינו, חפשו וגלו ספרים חדשים',
    type: 'website',
  },
};

export default function BooksPage() {
  const books = getAllBooks();
  const genres = getAllGenres();

  // Sort books by title
  const sortedBooks = books.sort((a, b) =>
    a.title.localeCompare(b.title, 'he')
  );

  // Get featured books
  const featuredBooks = books.filter((book) => book.featured);

  // Get some stats
  const totalBooks = books.length;
  const uniqueAuthors = new Set(books.flatMap((book) => book.authors)).size;
  const totalGenres = genres.length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-ink mb-4">
            כל הספרים
          </h1>
          <p className="text-xl text-ink-light max-w-2xl mx-auto">
            עיינו ברשימת הספרים המלאה שלנו, גלו ספרים חדשים ומצאו את הקריאה הבאה
            שלכם
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
          <div className="text-center p-4 bg-sepia/30 rounded-lg">
            <div className="text-2xl font-bold text-ink">{totalBooks}</div>
            <div className="text-sm text-ink-light">ספרים</div>
          </div>
          <div className="text-center p-4 bg-sepia/30 rounded-lg">
            <div className="text-2xl font-bold text-ink">{uniqueAuthors}</div>
            <div className="text-sm text-ink-light">מחברים</div>
          </div>
          <div className="text-center p-4 bg-sepia/30 rounded-lg">
            <div className="text-2xl font-bold text-ink">{totalGenres}</div>
            <div className="text-sm text-ink-light">סוגות</div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <nav className="mb-8" aria-label="פירורי לחם">
          <ol className="flex items-center justify-center space-x-2 space-x-reverse text-sm">
            <li className="flex items-center">
              <Link
                href="/"
                className="text-ink-light hover:text-ink transition-colors"
              >
                בית
              </Link>
              <svg
                className="w-4 h-4 mx-2 text-ink-light/60"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li>
              <span className="text-ink">ספרים</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Quick Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/authors"
            className="px-4 py-2 bg-sepia text-ink rounded-full hover:bg-sepia-dark transition-colors"
          >
            מחברים
          </Link>
          <Link
            href="/genres"
            className="px-4 py-2 bg-sepia text-ink rounded-full hover:bg-sepia-dark transition-colors"
          >
            סוגות
          </Link>
          <Link
            href="/reviews"
            className="px-4 py-2 bg-sepia text-ink rounded-full hover:bg-sepia-dark transition-colors"
          >
            ביקורות
          </Link>
          <Link
            href="/search"
            className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/80 transition-colors"
          >
            חיפוש
          </Link>
        </div>
      </div>

      {/* Featured Books */}
      {featuredBooks.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-ink mb-6 text-center">
            ספרים מומלצים
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {featuredBooks.map((book) => {
              const bookAuthors = book.authors
                .map((slug) => getAuthorBySlug(slug))
                .filter(Boolean)
                .map((author) => ({ slug: author!.slug, name: author!.name }));

              return (
                <BookCard
                  key={book.slug}
                  slug={book.slug}
                  title={book.title}
                  authors={bookAuthors}
                  genres={book.genres}
                  rating={book.rating}
                  description={book.description}
                  cover={book.cover}
                  featured={book.featured}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* All Books */}
      <div>
        <h2 className="text-2xl font-bold text-ink mb-6 text-center">
          כל הספרים ({sortedBooks.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {sortedBooks.map((book) => {
            const bookAuthors = book.authors
              .map((slug) => getAuthorBySlug(slug))
              .filter(Boolean)
              .map((author) => ({ slug: author!.slug, name: author!.name }));

            return (
              <BookCard
                key={book.slug}
                slug={book.slug}
                title={book.title}
                authors={bookAuthors}
                genres={book.genres}
                rating={book.rating}
                description={book.description}
                cover={book.cover}
                featured={book.featured}
              />
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {books.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-ink-light/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25A8.966 8.966 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
          <h3 className="text-xl font-semibold text-ink mb-2">
            עדיין אין ספרים
          </h3>
          <p className="text-ink-light">ספרים יתווספו בקרוב!</p>
        </div>
      )}
    </div>
  );
}
