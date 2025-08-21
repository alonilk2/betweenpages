import Link from 'next/link';
import { BookCard, ReviewCard } from '../../components';
import {
  getAllBooks,
  getAllAuthors,
  getAllReviews,
  getBookBySlug,
} from '../../lib/content';

// Transform book data with author details for display
function transformBookForDisplay(book: any, authors: any[]) {
  const bookAuthors = book.authors.map((authorSlug: string) => {
    const author = authors.find((a) => a.slug === authorSlug);
    return {
      slug: authorSlug,
      name: author ? author.name : authorSlug,
    };
  });

  return {
    ...book,
    authors: bookAuthors,
  };
}

// Transform review data with book details for display
function transformReviewForDisplay(review: any, books: any[], authors: any[]) {
  const book = books.find((b) => b.slug === review.frontmatter.book);
  if (!book) return null;

  const bookAuthor = authors.find((a) => book.authors.includes(a.slug));

  return {
    slug: review.frontmatter.slug,
    title: review.frontmatter.title,
    excerpt: review.frontmatter.excerpt,
    date: review.frontmatter.date,
    bookTitle: book.title,
    bookSlug: book.slug,
    bookCover: book.cover,
    author: bookAuthor ? bookAuthor.name : '',
    featured: review.frontmatter.featured,
    readTime: review.frontmatter.readingTime,
  };
}

export default async function Home() {
  // Load real data
  const allBooks = getAllBooks();
  const allAuthors = getAllAuthors();
  const allReviews = getAllReviews();

  // Get featured books
  const featuredBooks = allBooks
    .filter((book) => book.featured)
    .slice(0, 3)
    .map((book) => transformBookForDisplay(book, allAuthors));

  // Get latest reviews
  const latestReviews = allReviews
    .map((review) => transformReviewForDisplay(review, allBooks, allAuthors))
    .filter((review) => review !== null)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime())
    .slice(0, 2);
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-sepia to-paper py-20 md:py-32">
        {' '}
        {/* Increased padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {' '}
            {/* Increased max width */}
            <h1 className="text-5xl md:text-6xl font-bold text-ink mb-8">
              {' '}
              {/* Increased font sizes and margin */}
              ברוכים הבאים לבין הדפים
            </h1>
            <p className="text-2xl md:text-3xl text-ink-light mb-10 leading-relaxed">
              {' '}
              {/* Increased font sizes and margin */}
              המקום שלכם לגלות ספרים חדשים, לקרוא ביקורות מעמיקות ולהמליץ על
              הקריאות הטובות ביותר
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {' '}
              {/* Increased gap */}
              <Link href="/books" className="btn btn-primary">
                עיינו בספרים
              </Link>
              <Link href="/reviews" className="btn btn-secondary">
                קראו ביקורות
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-20 bg-paper">
        {' '}
        {/* Increased padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            {' '}
            {/* Increased margin */}
            <h2 className="text-4xl font-bold text-ink">ספרים מומלצים</h2>{' '}
            {/* Increased font size */}
            <Link
              href="/books"
              className="text-primary hover:text-primary/80 font-medium text-lg flex items-center gap-3 transition-colors duration-200"
            >
              <span>כל הספרים</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {' '}
                {/* Increased icon size */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {' '}
            {/* Increased gap */}
            {featuredBooks.map((book) => (
              <BookCard key={book.slug} {...book} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Reviews Section */}
      <section className="py-20 bg-sepia">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-bold text-ink">ביקורות אחרונות</h2>
            <Link
              href="/reviews"
              className="text-primary hover:text-primary/80 font-medium text-lg flex items-center gap-3 transition-colors duration-200"
            >
              <span>כל הביקורות</span>
              <svg
                className="w-5 h-5"
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
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {latestReviews.map((review) => (
              <ReviewCard key={review!.slug} {...review} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter/CTA Section */}
      <section className="py-20 bg-gradient-to-t from-sepia to-paper">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-ink mb-6">הישארו מעודכנים</h2>
          <p className="text-xl text-ink-light mb-10">
            גלו ביקורות חדשות, המלצות על ספרים ומאמרים על ספרות עברית
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center max-w-lg mx-auto">
            <input
              type="email"
              placeholder="כתובת המייל שלכם"
              className="flex-1 px-6 py-4 border border-border rounded-xl text-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors duration-200"
            />
            <button className="btn btn-primary px-8 text-lg">הרשמה</button>
          </div>
        </div>
      </section>
    </div>
  );
}
