import Link from 'next/link';
import Image from 'next/image';
// Hero background image (book spines) imported so it can be used in a background style even though it's not in /public
// If you later move the file to /public/images/hero-books.jpg you can remove the import and use the direct URL.
// @ts-ignore - Allow importing image asset
import heroImage from '../../unnamed.png';
import { BookCard, ReviewCard, ShopProductCard } from '../../components';
import { getProductByHandle } from '../../lib/shopify';
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
  // Build list of books that have a Shopify handle and fetch product data (limit 3)
  const shopEnabledBooks = allBooks.filter((b) => b.shopifyHandle).slice(0, 3);
  const shopProducts = await Promise.all(
    shopEnabledBooks.map(async (b) => {
      if (!b.shopifyHandle) return null;
      const p = await getProductByHandle(b.shopifyHandle);
      if (!p) return null;
      const firstVariant = p.variants[0];
      return {
        handle: p.handle,
        title: b.title,
        price: firstVariant ? firstVariant.price : '—',
        image: p.featuredImage
          ? { url: p.featuredImage.url, alt: b.title }
          : undefined,
        available: firstVariant?.availableForSale,
        buyUrl: firstVariant
          ? `/api/shopify/redirect?variantId=${encodeURIComponent(firstVariant.id)}&q=1`
          : null,
      };
    })
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section with background image */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background image layer */}
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={heroImage as any}
            alt=""
            fill
            priority
            className="object-cover object-center blur-sm md:blur md:scale-[1.03]"
          />
        </div>
        {/* Overlay gradient for readability */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/50"
          aria-hidden="true"
        />
        {/* Subtle warm tint to keep brand feel while retaining contrast */}
        <div
          className="absolute inset-0 bg-sepia/10 mix-blend-overlay"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold !text-white drop-shadow-lg mb-8">
              ברוכים הבאים לבין הדפים
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 mb-10 leading-relaxed drop-shadow-md">
              המקום שלכם לגלות ספרים חדשים, לקרוא ביקורות מעמיקות ולהמליץ על
              הקריאות הטובות ביותר
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
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

      {/* Shop Section (always visible; placeholder if no products) */}
      <section className="relative py-24 bg-gradient-to-b from-paper via-sepia/40 to-paper overflow-hidden">
        <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(circle_at_center,black,transparent)] opacity-40">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
            <div className="max-w-2xl space-y-6">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-coral-600 bg-clip-text text-transparent">
                החנות שלנו
              </h2>
              <p className="text-xl text-ink-light leading-relaxed">
                ספרים נבחרים לרכישה מיידית דרך הפלטפורמה שלנו. תמכו ביצירה
                ספרותית והעמיקו את הספרייה האישית שלכם.
              </p>
            </div>
            <div>
              <Link
                href="/books"
                className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-6 py-3 text-sm font-medium text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-paper transition"
              >
                לכל הספרים
                <svg
                  className="w-4 h-4"
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
          </div>
          {shopProducts.filter(Boolean).length > 0 ? (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {shopProducts.filter(Boolean).map((p) => (
                <ShopProductCard key={p!.handle} {...p!} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-12 text-center max-w-4xl mx-auto">
              <p className="text-xl font-medium text-ink mb-4">
                החנות עדיין בהכנה
              </p>
              <p className="text-ink-light mb-8">
                בקרוב תוכלו לרכוש כאן ספרים ישירות. בינתיים אפשר לעיין בקטלוג
                המלא.
              </p>
              <Link
                href="/books"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-coral-600 px-8 py-4 text-sm font-medium text-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-paper transition"
              >
                עיינו בקטלוג
                <svg
                  className="w-4 h-4"
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
          )}
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
