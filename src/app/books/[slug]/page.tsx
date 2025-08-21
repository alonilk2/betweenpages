import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getBookBySlug,
  getAllBooks,
  getAuthorBySlug,
  getReviewsByBook,
} from '../../../../lib/content';
import { BookCard, ReviewCard } from '../../../../components';

interface BookPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const books = getAllBooks();
  return books.map((book) => ({
    slug: book.slug,
  }));
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const book = getBookBySlug(params.slug);

  if (!book) {
    return {
      title: 'ספר לא נמצא | בין הדפים',
    };
  }

  return {
    title: `${book.title} | בין הדפים`,
    description: book.description || `מידע על הספר ${book.title}`,
    openGraph: {
      title: book.title,
      description: book.description,
      images: book.cover ? [{ url: book.cover }] : undefined,
      type: 'article',
    },
  };
}

export default function BookPage({ params }: BookPageProps) {
  const book = getBookBySlug(params.slug);

  if (!book) {
    notFound();
  }

  // Get authors data
  const authors = book.authors
    .map((authorSlug) => getAuthorBySlug(authorSlug))
    .filter(Boolean);

  // Get reviews for this book
  const reviews = getReviewsByBook(book.slug);

  // Get related books (by same authors or genres)
  const relatedBooks = getAllBooks()
    .filter(
      (b) =>
        b.slug !== book.slug &&
        (b.authors.some((author) => book.authors.includes(author)) ||
          b.genres.some((genre) => book.genres.includes(genre)) ||
          book.related.includes(b.slug))
    )
    .slice(0, 4);

  // Generate breadcrumbs
  const breadcrumbs = [
    { name: 'בית', href: '/' },
    { name: 'ספרים', href: '/books' },
    { name: book.title, href: `/books/${book.slug}` },
  ];

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Book Cover & Basic Info */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            {/* Cover Image */}
            <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-sepia mb-6">
              {book.cover ? (
                <Image
                  src={book.cover}
                  alt={`עטיפת הספר "${book.title}"`}
                  fill
                  className="object-cover"
                  priority
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
                        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25A8.966 8.966 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                    <p className="text-sm text-ink-light/70 font-medium">
                      אין עטיפה
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Book Rating */}
            {book.rating && (
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(book.rating!)
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
                  <span className="mr-2 text-lg font-medium text-ink">
                    {book.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            )}

            {/* Book Details */}
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="font-medium text-ink-light mb-1">מחבר/ים:</dt>
                <dd>
                  {authors.map((author, index) => (
                    <span key={author!.slug}>
                      <Link
                        href={`/authors/${author!.slug}`}
                        className="text-primary hover:underline"
                      >
                        {author!.name}
                      </Link>
                      {index < authors.length - 1 && ', '}
                    </span>
                  ))}
                </dd>
              </div>

              {book.publishYear && (
                <div>
                  <dt className="font-medium text-ink-light mb-1">
                    שנת פרסום:
                  </dt>
                  <dd className="text-ink">{book.publishYear}</dd>
                </div>
              )}

              {book.pages && (
                <div>
                  <dt className="font-medium text-ink-light mb-1">
                    מספר עמודים:
                  </dt>
                  <dd className="text-ink">{book.pages}</dd>
                </div>
              )}

              {book.publisher && (
                <div>
                  <dt className="font-medium text-ink-light mb-1">הוצאה:</dt>
                  <dd className="text-ink">{book.publisher}</dd>
                </div>
              )}

              {book.isbn && (
                <div>
                  <dt className="font-medium text-ink-light mb-1">ISBN:</dt>
                  <dd className="text-ink font-mono">{book.isbn}</dd>
                </div>
              )}
            </dl>

            {/* Genres & Tags */}
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="font-medium text-ink-light mb-2">סוגות:</h3>
                <div className="flex flex-wrap gap-2">
                  {book.genres.map((genre) => (
                    <Link
                      key={genre}
                      href={`/genres/${genre}`}
                      className="inline-block px-3 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              </div>

              {book.tags.length > 0 && (
                <div>
                  <h3 className="font-medium text-ink-light mb-2">תגיות:</h3>
                  <div className="flex flex-wrap gap-2">
                    {book.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/tag/${encodeURIComponent(tag)}`}
                        className="inline-block px-3 py-1 text-xs bg-sepia text-ink-light rounded-full hover:bg-sepia-dark transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Book Title & Basic Info */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-ink mb-2">
              {book.title}
            </h1>
            {book.originalTitle && (
              <p className="text-lg text-ink-light mb-4">
                {book.originalTitle}
              </p>
            )}
          </div>

          {/* Book Description */}
          {book.description && (
            <div className="prose prose-lg prose-gray max-w-none mb-8 font-reading">
              <p className="text-ink leading-relaxed">{book.description}</p>
            </div>
          )}

          {/* Notable Quotes */}
          {book.quotes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-ink mb-4">
                ציטוטים בולטים
              </h2>
              <div className="space-y-4">
                {book.quotes.map((quote, index) => (
                  <blockquote
                    key={index}
                    className="border-r-4 border-primary pr-4 py-2 bg-sepia/30 rounded-r-lg"
                  >
                    <p className="text-ink font-reading italic text-lg leading-relaxed">
                      &ldquo;{quote}&rdquo;
                    </p>
                  </blockquote>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          {reviews.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-ink mb-4">ביקורות</h2>
              <div className="grid gap-6">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.frontmatter.slug}
                    slug={review.frontmatter.slug}
                    title={review.frontmatter.title}
                    excerpt={review.frontmatter.excerpt || ''}
                    date={review.frontmatter.date}
                    bookTitle={book.title}
                    bookSlug={book.slug}
                    bookCover={book.cover}
                    featured={review.frontmatter.featured}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Related Books */}
          {relatedBooks.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-ink mb-6">ספרים קשורים</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedBooks.map((relatedBook) => {
                  const relatedAuthors = relatedBook.authors
                    .map((slug) => getAuthorBySlug(slug))
                    .filter(Boolean)
                    .map((author) => ({
                      slug: author!.slug,
                      name: author!.name,
                    }));

                  return (
                    <BookCard
                      key={relatedBook.slug}
                      slug={relatedBook.slug}
                      title={relatedBook.title}
                      authors={relatedAuthors}
                      genres={relatedBook.genres}
                      rating={relatedBook.rating}
                      description={relatedBook.description}
                      cover={relatedBook.cover}
                      featured={relatedBook.featured}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
