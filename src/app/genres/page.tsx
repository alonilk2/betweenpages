import Link from 'next/link';
import { Metadata } from 'next';
import { getAllGenres, getBooksByGenre } from '../../../lib/content';

export const metadata: Metadata = {
  title: 'כל הסוגות | בין הדפים',
  description:
    'עיינו בכל הסוגות הספרותיות באתר - מצאו ספרים לפי תחומי העניין שלכם',
  openGraph: {
    title: 'כל הסוגות | בין הדפים',
    description:
      'עיינו בכל הסוגות הספרותיות באתר - מצאו ספרים לפי תחומי העניין שלכם',
    type: 'website',
  },
};

export default function GenresPage() {
  const genres = getAllGenres();

  // Sort genres by name
  const sortedGenres = genres.sort((a, b) =>
    a.name.localeCompare(b.name, 'he')
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-ink mb-4">
            כל הסוגות
          </h1>
          <p className="text-xl text-ink-light max-w-2xl mx-auto">
            גלו ספרים לפי סוגות ספרותיות שונות - מצאו בדיוק את מה שאתם מחפשים
          </p>
        </div>

        {/* Stats */}
        <div className="text-center p-4 bg-sepia/30 rounded-lg max-w-xs mx-auto mb-8">
          <div className="text-2xl font-bold text-ink">{genres.length}</div>
          <div className="text-sm text-ink-light">סוגות</div>
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
              <span className="text-ink">סוגות</span>
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
            href="/authors"
            className="px-4 py-2 bg-sepia text-ink rounded-full hover:bg-sepia-dark transition-colors"
          >
            מחברים
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

      {/* Genres Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {sortedGenres.map((genre) => {
          const genreBooks = getBooksByGenre(genre.slug);

          return (
            <article
              key={genre.slug}
              className="bg-paper rounded-lg border border-border hover:border-primary/30 transition-all duration-200 overflow-hidden group"
            >
              <Link href={`/genres/${genre.slug}`} className="block p-6">
                {/* Genre Icon/Color */}
                <div className="flex items-center mb-4">
                  {genre.icon ? (
                    <div className="w-12 h-12 ml-4 flex items-center justify-center rounded-full bg-primary/10">
                      <span className="text-2xl">{genre.icon}</span>
                    </div>
                  ) : (
                    <div className="w-12 h-12 ml-4 flex items-center justify-center rounded-full bg-sepia text-ink-light">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-ink group-hover:text-primary transition-colors duration-200">
                      {genre.name}
                    </h3>
                  </div>
                </div>

                {/* Genre Description */}
                {genre.description && (
                  <p className="text-sm text-ink-light line-clamp-3 leading-relaxed mb-4">
                    {genre.description}
                  </p>
                )}

                {/* Books Count */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-light">
                    {genreBooks.length}{' '}
                    {genreBooks.length === 1 ? 'ספר' : 'ספרים'}
                  </span>

                  {/* Arrow */}
                  <svg
                    className="w-4 h-4 text-ink-light group-hover:text-primary transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {/* Empty State */}
      {genres.length === 0 && (
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
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-ink mb-2">
            עדיין אין סוגות
          </h3>
          <p className="text-ink-light">סוגות יתווספו בקרוב!</p>
        </div>
      )}
    </div>
  );
}
