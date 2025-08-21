import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getGenreBySlug,
  getAllGenres,
  getBooksByGenre,
  getAuthorBySlug,
  buildSearchIndex,
} from '../../../../lib/content';
import { BookCard } from '../../../../components';

interface GenrePageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const genres = getAllGenres();
  return genres.map((genre) => ({
    slug: genre.slug,
  }));
}

export async function generateMetadata({
  params,
}: GenrePageProps): Promise<Metadata> {
  const genre = getGenreBySlug(params.slug);

  if (!genre) {
    return {
      title: 'סוגה לא נמצאה | בין הדפים',
    };
  }

  return {
    title: `${genre.name} | בין הדפים`,
    description: genre.description || `ספרים בסוגת ${genre.name}`,
    openGraph: {
      title: `סוגת ${genre.name}`,
      description: genre.description,
      type: 'website',
    },
  };
}

export default function GenrePage({ params }: GenrePageProps) {
  const genre = getGenreBySlug(params.slug);

  if (!genre) {
    notFound();
  }

  // Get books in this genre
  const books = getBooksByGenre(genre.slug);

  // Get related content from search index
  const searchIndex = buildSearchIndex();
  const relatedReviews = searchIndex
    .filter((item) => item.type === 'review' && item.tags.includes(genre.slug))
    .slice(0, 6);

  const relatedArticles = searchIndex
    .filter((item) => item.type === 'article' && item.tags.includes(genre.slug))
    .slice(0, 6);

  // Generate breadcrumbs
  const breadcrumbs = [
    { name: 'בית', href: '/' },
    { name: 'סוגות', href: '/genres' },
    { name: genre.name, href: `/genres/${genre.slug}` },
  ];

  // Get stats
  const totalBooks = books.length;
  const uniqueAuthors = new Set(books.flatMap((book) => book.authors)).size;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-8" aria-label="פירורי לחם">
        <ol className="flex items-center space-x-2 space-x-reverse text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.href} className="flex items-center">
              {index > 0 && (
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
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-ink">{crumb.name}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-ink-light hover:text-ink transition-colors"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Genre Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          {genre.icon && (
            <div className="w-12 h-12 ml-4 flex items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl">{genre.icon}</span>
            </div>
          )}
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-ink">
              סוגת {genre.name}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-ink-light">
              <span>{totalBooks} ספרים</span>
              <span>•</span>
              <span>{uniqueAuthors} מחברים</span>
            </div>
          </div>
        </div>

        {/* Genre Description */}
        {genre.description && (
          <div className="prose prose-lg prose-gray max-w-none font-reading">
            <p className="text-ink leading-relaxed">{genre.description}</p>
          </div>
        )}
      </div>

      {/* Books in Genre */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-ink mb-6">
          ספרים בסוגת {genre.name}
        </h2>

        {books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => {
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
        ) : (
          <div className="text-center py-8 text-ink-light">
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
            <p>עדיין אין ספרים רשומים בסוגה זו</p>
          </div>
        )}
      </div>

      {/* Related Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Related Reviews */}
        {relatedReviews.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-ink mb-4">ביקורות קשורות</h3>
            <div className="space-y-4">
              {relatedReviews.map((review) => (
                <article
                  key={review.slug}
                  className="bg-paper rounded-lg border border-border p-4 hover:border-primary/30 transition-colors"
                >
                  <Link href={review.url} className="block">
                    <h4 className="font-bold text-ink hover:text-primary transition-colors mb-2 line-clamp-2">
                      {review.title}
                    </h4>
                    {review.excerpt && (
                      <p className="text-sm text-ink-light line-clamp-3 mb-2">
                        {review.excerpt}
                      </p>
                    )}
                    <time className="text-xs text-ink-light">
                      {new Date(review.date!).toLocaleDateString('he-IL')}
                    </time>
                  </Link>
                </article>
              ))}
            </div>
            {relatedReviews.length >= 6 && (
              <Link
                href={`/reviews?genre=${genre.slug}`}
                className="inline-block mt-4 text-primary hover:underline text-sm"
              >
                צפה בכל הביקורות ←
              </Link>
            )}
          </div>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-ink mb-4">מאמרים קשורים</h3>
            <div className="space-y-4">
              {relatedArticles.map((article) => (
                <article
                  key={article.slug}
                  className="bg-paper rounded-lg border border-border p-4 hover:border-primary/30 transition-colors"
                >
                  <Link href={article.url} className="block">
                    <h4 className="font-bold text-ink hover:text-primary transition-colors mb-2 line-clamp-2">
                      {article.title}
                    </h4>
                    {article.excerpt && (
                      <p className="text-sm text-ink-light line-clamp-3 mb-2">
                        {article.excerpt}
                      </p>
                    )}
                    <time className="text-xs text-ink-light">
                      {new Date(article.date!).toLocaleDateString('he-IL')}
                    </time>
                  </Link>
                </article>
              ))}
            </div>
            {relatedArticles.length >= 6 && (
              <Link
                href={`/articles?genre=${genre.slug}`}
                className="inline-block mt-4 text-primary hover:underline text-sm"
              >
                צפה בכל המאמרים ←
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
