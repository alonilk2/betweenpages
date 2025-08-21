import Link from 'next/link';
import { Metadata } from 'next';
import { getAllReviews, getBookBySlug } from '../../../lib/content';
import { ReviewCard } from '../../../components';

export const metadata: Metadata = {
  title: 'כל הביקורות | בין הדפים',
  description: 'רשימת כל הביקורות באתר - קראו ביקורות מעמיقות על ספרים שונים',
  openGraph: {
    title: 'כל הביקורות | בין הדפים',
    description: 'רשימת כל הביקורות באתר - קראו ביקורות מעמיקות על ספרים שונים',
    type: 'website',
  },
};

export default function ReviewsPage() {
  const reviews = getAllReviews();

  // Filter out drafts and sort by date
  const publishedReviews = reviews
    .filter((review) => !review.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

  // Get featured reviews
  const featuredReviews = publishedReviews.filter(
    (review) => review.frontmatter.featured
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-ink mb-4">
            כל הביקורות
          </h1>
          <p className="text-xl text-ink-light max-w-2xl mx-auto">
            קראו ביקורות מעמיקות על ספרים שונים וגלו מה כדאי לקרוא הבא
          </p>
        </div>

        {/* Stats */}
        <div className="text-center p-4 bg-sepia/30 rounded-lg max-w-xs mx-auto mb-8">
          <div className="text-2xl font-bold text-ink">
            {publishedReviews.length}
          </div>
          <div className="text-sm text-ink-light">ביקורות</div>
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
              <span className="text-ink">ביקורות</span>
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
            href="/articles"
            className="px-4 py-2 bg-sepia text-ink rounded-full hover:bg-sepia-dark transition-colors"
          >
            מאמרים
          </Link>
          <Link
            href="/search"
            className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/80 transition-colors"
          >
            חיפוש
          </Link>
        </div>
      </div>

      {/* Featured Reviews */}
      {featuredReviews.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-ink mb-6 text-center">
            ביקורות מומלצות
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {featuredReviews.map((review) => {
              const book = getBookBySlug(review.frontmatter.book);

              return (
                <ReviewCard
                  key={review.frontmatter.slug}
                  slug={review.frontmatter.slug}
                  title={review.frontmatter.title}
                  excerpt={review.frontmatter.excerpt}
                  date={review.frontmatter.date}
                  bookTitle={book?.title}
                  bookSlug={book?.slug}
                  bookCover={book?.cover}
                  author={review.frontmatter.author}
                  featured={review.frontmatter.featured}
                  readTime={review.frontmatter.readingTime}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* All Reviews */}
      <div>
        <h2 className="text-2xl font-bold text-ink mb-6 text-center">
          כל הביקורות ({publishedReviews.length})
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {publishedReviews.map((review) => {
            const book = getBookBySlug(review.frontmatter.book);

            return (
              <ReviewCard
                key={review.frontmatter.slug}
                slug={review.frontmatter.slug}
                title={review.frontmatter.title}
                excerpt={review.frontmatter.excerpt}
                date={review.frontmatter.date}
                bookTitle={book?.title}
                bookSlug={book?.slug}
                bookCover={book?.cover}
                author={review.frontmatter.author}
                featured={review.frontmatter.featured}
                readTime={review.frontmatter.readingTime}
              />
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {publishedReviews.length === 0 && (
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
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-ink mb-2">
            עדיין אין ביקורות
          </h3>
          <p className="text-ink-light">ביקורות יתווספו בקרוב!</p>
        </div>
      )}
    </div>
  );
}
