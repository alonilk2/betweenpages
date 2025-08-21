import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getReviewBySlug,
  getAllReviews,
  getBookBySlug,
  getAuthorBySlug,
} from '../../../../lib/content';

interface ReviewPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const reviews = getAllReviews();
  return reviews.map((review) => ({
    slug: review.frontmatter.slug,
  }));
}

export async function generateMetadata({
  params,
}: ReviewPageProps): Promise<Metadata> {
  const review = getReviewBySlug(params.slug);

  if (!review) {
    return {
      title: 'ביקורת לא נמצאה | בין הדפים',
    };
  }

  return {
    title: `${review.frontmatter.title} | בין הדפים`,
    description: review.frontmatter.excerpt || review.frontmatter.subtitle,
    openGraph: {
      title: review.frontmatter.title,
      description: review.frontmatter.excerpt,
      images: review.frontmatter.coverImage
        ? [{ url: review.frontmatter.coverImage }]
        : undefined,
      type: 'article',
      publishedTime: review.frontmatter.date,
    },
  };
}

export default function ReviewPage({ params }: ReviewPageProps) {
  const review = getReviewBySlug(params.slug);

  if (!review || review.frontmatter.draft) {
    notFound();
  }

  // Get the book being reviewed
  const book = getBookBySlug(review.frontmatter.book);

  // Get book authors
  const bookAuthors =
    book?.authors.map((slug) => getAuthorBySlug(slug)).filter(Boolean) || [];

  // Generate breadcrumbs
  const breadcrumbs = [
    { name: 'בית', href: '/' },
    { name: 'ביקורות', href: '/reviews' },
    {
      name: review.frontmatter.title,
      href: `/reviews/${review.frontmatter.slug}`,
    },
  ];

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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

      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          {/* Featured badge */}
          {review.frontmatter.featured && (
            <div className="mb-4">
              <span className="inline-block bg-primary text-white text-sm px-3 py-1 rounded-full font-medium">
                ביקורת מומלצת
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-ink leading-tight mb-4">
            {review.frontmatter.title}
          </h1>

          {/* Subtitle */}
          {review.frontmatter.subtitle && (
            <p className="text-xl text-ink-light leading-relaxed mb-6">
              {review.frontmatter.subtitle}
            </p>
          )}

          {/* Book Information */}
          {book && (
            <div className="bg-sepia/30 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-4">
                {/* Book Cover */}
                {book.cover && (
                  <div className="flex-shrink-0">
                    <Link href={`/books/${book.slug}`}>
                      <Image
                        src={book.cover}
                        alt={`עטיפת הספר "${book.title}"`}
                        width={80}
                        height={112}
                        className="object-cover rounded shadow-sm hover:shadow-md transition-shadow"
                      />
                    </Link>
                  </div>
                )}

                {/* Book Details */}
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-ink mb-2">
                    ביקורת על:
                    <Link
                      href={`/books/${book.slug}`}
                      className="text-primary hover:underline mr-2"
                    >
                      {book.title}
                    </Link>
                  </h2>

                  {bookAuthors.length > 0 && (
                    <div className="text-sm text-ink-light mb-2">
                      מאת:{' '}
                      {bookAuthors.map((author, index) => (
                        <span key={author!.slug}>
                          <Link
                            href={`/authors/${author!.slug}`}
                            className="hover:text-ink hover:underline transition-colors"
                          >
                            {author!.name}
                          </Link>
                          {index < bookAuthors.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  )}

                  {book.publishYear && (
                    <div className="text-sm text-ink-light">
                      פורסם ב-{book.publishYear}
                    </div>
                  )}
                </div>

                {/* Rating */}
                {review.frontmatter.rating && (
                  <div className="flex-shrink-0 text-center">
                    <div className="text-sm text-ink-light mb-1">דירוג</div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(review.frontmatter.rating!)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.27l6.18 3.73-1.64-7.03 5.46-4.73-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19.15z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                    <div className="text-lg font-bold text-ink mt-1">
                      {review.frontmatter.rating.toFixed(1)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Meta information */}
          <div className="flex items-center justify-between text-sm text-ink-light border-b border-border pb-6">
            <div className="flex items-center gap-4">
              <time dateTime={review.frontmatter.date}>
                {formatDate(review.frontmatter.date)}
              </time>
              {review.frontmatter.readingTime && (
                <>
                  <span>•</span>
                  <span>{review.frontmatter.readingTime} דקות קריאה</span>
                </>
              )}
              {review.frontmatter.author && (
                <>
                  <span>•</span>
                  <span>מאת {review.frontmatter.author}</span>
                </>
              )}
            </div>

            {/* Tags */}
            {review.frontmatter.tags.length > 0 && (
              <div className="flex items-center gap-2">
                {review.frontmatter.tags.slice(0, 3).map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${encodeURIComponent(tag)}`}
                    className="inline-block px-2 py-1 text-xs bg-sepia text-ink-light rounded-md hover:bg-sepia-dark transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
                {review.frontmatter.tags.length > 3 && (
                  <span className="text-xs text-ink-light">
                    +{review.frontmatter.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Review Content */}
        <div className="prose prose-lg prose-gray max-w-none font-reading">
          <div className="text-ink leading-relaxed whitespace-pre-line">
            {review.content}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          {/* All Tags */}
          {review.frontmatter.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-ink-light mb-2">
                תגיות:
              </h3>
              <div className="flex flex-wrap gap-2">
                {review.frontmatter.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${encodeURIComponent(tag)}`}
                    className="inline-block px-3 py-1 text-sm bg-sepia text-ink-light rounded-full hover:bg-sepia-dark transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to reviews */}
          <div className="text-center">
            <Link
              href="/reviews"
              className="inline-flex items-center text-primary hover:underline"
            >
              <svg
                className="w-4 h-4 ml-2"
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
              חזרה לכל הביקורות
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
