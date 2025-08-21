import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getAllArticles } from '../../../lib/content';

export const metadata: Metadata = {
  title: 'כל המאמרים | בין הדפים',
  description: 'רשימת כל המאמרים באתר - מאמרים על ספרות, כתיבה ותרבות',
  openGraph: {
    title: 'כל המאמרים | בין הדפים',
    description: 'רשימת כל המאמרים באתר - מאמרים על ספרות, כתיבה ותרבות',
    type: 'website',
  },
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  // Filter out drafts and sort by date
  const publishedArticles = articles
    .filter((article) => !article.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

  // Get featured articles
  const featuredArticles = publishedArticles.filter(
    (article) => article.frontmatter.featured
  );

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
      {/* Page Header */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-ink mb-4">
            כל המאמרים
          </h1>
          <p className="text-xl text-ink-light max-w-2xl mx-auto">
            מאמרים על ספרות, כתיבה, ביקורת ותרבות - הרחיבו את הידע שלכם
          </p>
        </div>

        {/* Stats */}
        <div className="text-center p-4 bg-sepia/30 rounded-lg max-w-xs mx-auto mb-8">
          <div className="text-2xl font-bold text-ink">
            {publishedArticles.length}
          </div>
          <div className="text-sm text-ink-light">מאמרים</div>
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
              <span className="text-ink">מאמרים</span>
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

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-ink mb-6 text-center">
            מאמרים מומלצים
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {featuredArticles.map((article) => (
              <article
                key={article.frontmatter.slug}
                className="bg-paper rounded-lg border border-border hover:border-primary/30 transition-all duration-200 overflow-hidden group"
              >
                <Link
                  href={`/articles/${article.frontmatter.slug}`}
                  className="block"
                >
                  {/* Cover Image */}
                  {article.frontmatter.coverImage && (
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={article.frontmatter.coverImage}
                        alt={article.frontmatter.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Featured badge */}
                    {article.frontmatter.featured && (
                      <span className="inline-block mb-2 bg-primary text-white text-xs px-2 py-1 rounded-md font-medium">
                        מאמר מומלץ
                      </span>
                    )}

                    {/* Category */}
                    {article.frontmatter.category && (
                      <div className="mb-2">
                        <span className="text-sm text-primary font-medium">
                          {article.frontmatter.category}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-bold text-xl text-ink group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-3 leading-tight">
                      {article.frontmatter.title}
                    </h3>

                    {/* Excerpt */}
                    {article.frontmatter.excerpt && (
                      <p className="text-sm text-ink-light line-clamp-3 leading-relaxed mb-4">
                        {article.frontmatter.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-ink-light">
                      <time dateTime={article.frontmatter.date}>
                        {formatDate(article.frontmatter.date)}
                      </time>
                      {article.frontmatter.readingTime && (
                        <span>
                          {article.frontmatter.readingTime} דקות קריאה
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* All Articles */}
      <div>
        <h2 className="text-2xl font-bold text-ink mb-6 text-center">
          כל המאמרים ({publishedArticles.length})
        </h2>
        <div className="space-y-6 max-w-4xl mx-auto">
          {publishedArticles.map((article) => (
            <article
              key={article.frontmatter.slug}
              className="bg-paper rounded-lg border border-border hover:border-primary/30 transition-all duration-200 overflow-hidden group"
            >
              <Link
                href={`/articles/${article.frontmatter.slug}`}
                className="block"
              >
                <div className="flex">
                  {/* Cover Image */}
                  {article.frontmatter.coverImage && (
                    <div className="flex-shrink-0 w-32 md:w-48">
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={article.frontmatter.coverImage}
                          alt={article.frontmatter.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 768px) 128px, 192px"
                        />
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 p-4 md:p-6 min-w-0">
                    {/* Featured badge */}
                    {article.frontmatter.featured && (
                      <span className="inline-block mb-2 bg-primary text-white text-xs px-2 py-1 rounded-md font-medium">
                        מאמר מומלץ
                      </span>
                    )}

                    {/* Category */}
                    {article.frontmatter.category && (
                      <div className="mb-2">
                        <span className="text-sm text-primary font-medium">
                          {article.frontmatter.category}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-bold text-lg md:text-xl text-ink group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-2 leading-tight">
                      {article.frontmatter.title}
                    </h3>

                    {/* Excerpt */}
                    {article.frontmatter.excerpt && (
                      <p className="text-sm text-ink-light line-clamp-2 leading-relaxed mb-3">
                        {article.frontmatter.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-ink-light">
                      <time dateTime={article.frontmatter.date}>
                        {formatDate(article.frontmatter.date)}
                      </time>
                      {article.frontmatter.readingTime && (
                        <span>
                          {article.frontmatter.readingTime} דקות קריאה
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {publishedArticles.length === 0 && (
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="text-xl font-semibold text-ink mb-2">
            עדיין אין מאמרים
          </h3>
          <p className="text-ink-light">מאמרים יתווספו בקרוב!</p>
        </div>
      )}
    </div>
  );
}
