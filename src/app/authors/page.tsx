import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getAllAuthors, getBooksByAuthor } from '../../../lib/content';

export const metadata: Metadata = {
  title: 'כל המחברים | בין הדפים',
  description: 'רשימת כל המחברים באתר - גלו סופרים חדשים ומצאו את הכותבים שלכם',
  openGraph: {
    title: 'כל המחברים | בין הדפים',
    description:
      'רשימת כל המחברים באתר - גלו סופרים חדשים ומצאו את הכותבים שלכם',
    type: 'website',
  },
};

export default function AuthorsPage() {
  const authors = getAllAuthors();

  // Sort authors by name
  const sortedAuthors = authors.sort((a, b) =>
    a.name.localeCompare(b.name, 'he')
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-ink mb-4">
            כל המחברים
          </h1>
          <p className="text-xl text-ink-light max-w-2xl mx-auto">
            גלו את הסופרים והכותבים המופיעים באתר, קראו על חייהם ועיינו בספריהם
          </p>
        </div>

        {/* Stats */}
        <div className="text-center p-4 bg-sepia/30 rounded-lg max-w-xs mx-auto mb-8">
          <div className="text-2xl font-bold text-ink">{authors.length}</div>
          <div className="text-sm text-ink-light">מחברים</div>
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
              <span className="text-ink">מחברים</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Quick Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/books"
            className="px-4 py-2 bg-sepia text-ink rounded-full hover:bg-sepia-dark transition-colors"
          >
            ספרים
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

      {/* Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {sortedAuthors.map((author) => {
          const authorBooks = getBooksByAuthor(author.slug);
          const lifespan = author.birthYear
            ? author.deathYear
              ? `${author.birthYear}–${author.deathYear}`
              : `נולד/ה ${author.birthYear}`
            : null;

          return (
            <article
              key={author.slug}
              className="bg-paper rounded-lg border border-border hover:border-primary/30 transition-all duration-200 overflow-hidden group"
            >
              <Link href={`/authors/${author.slug}`} className="block">
                {/* Author Photo */}
                <div className="aspect-square relative overflow-hidden bg-sepia">
                  {author.photo ? (
                    <Image
                      src={author.photo}
                      alt={`תמונה של ${author.name}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sepia to-sepia-dark">
                      <div className="text-center p-6">
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <p className="text-sm text-ink-light/70 font-medium">
                          אין תמונה
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Author Info */}
                <div className="p-6">
                  <h3 className="font-bold text-xl text-ink group-hover:text-primary transition-colors duration-200 mb-2">
                    {author.name}
                  </h3>

                  {author.originalName && (
                    <p className="text-sm text-ink-light mb-2">
                      {author.originalName}
                    </p>
                  )}

                  {lifespan && (
                    <p className="text-sm text-ink-light mb-3">{lifespan}</p>
                  )}

                  {author.nationality && (
                    <p className="text-sm text-ink-light mb-3">
                      {author.nationality}
                    </p>
                  )}

                  {author.bio && (
                    <p className="text-sm text-ink-light line-clamp-3 leading-relaxed mb-4">
                      {author.bio}
                    </p>
                  )}

                  {/* Books Count */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-light">
                      {authorBooks.length}{' '}
                      {authorBooks.length === 1 ? 'ספר' : 'ספרים'}
                    </span>

                    {/* Awards indicator */}
                    {author.awards.length > 0 && (
                      <div className="flex items-center text-yellow-500">
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.27l6.18 3.73-1.64-7.03 5.46-4.73-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19.15z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs">{author.awards.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {/* Empty State */}
      {authors.length === 0 && (
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-ink mb-2">
            עדיין אין מחברים
          </h3>
          <p className="text-ink-light">מחברים יתווספו בקרוב!</p>
        </div>
      )}
    </div>
  );
}
