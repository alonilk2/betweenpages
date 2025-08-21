import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getAllLists } from '../../../lib/content';

export const metadata: Metadata = {
  title: 'כל הרשימות | בין הדפים',
  description: 'רשימות ספרים מוכנות - המלצות לכל טעם ומזג אוויר',
  openGraph: {
    title: 'כל הרשימות | בין הדפים',
    description: 'רשימות ספרים מוכנות - המלצות לכל טעם ומזג אוויר',
    type: 'website',
  },
};

export default function ListsPage() {
  const lists = getAllLists();

  // Filter out drafts and sort by date
  const publishedLists = lists
    .filter((list) => !list.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

  // Get featured lists
  const featuredLists = publishedLists.filter(
    (list) => list.frontmatter.featured
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
            כל הרשימות
          </h1>
          <p className="text-xl text-ink-light max-w-2xl mx-auto">
            רשימות ספרים מוכנות - המלצות לכל טעם, מזג אוויר וחג
          </p>
        </div>

        {/* Stats */}
        <div className="text-center p-4 bg-sepia/30 rounded-lg max-w-xs mx-auto mb-8">
          <div className="text-2xl font-bold text-ink">
            {publishedLists.length}
          </div>
          <div className="text-sm text-ink-light">רשימות</div>
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
              <span className="text-ink">רשימות</span>
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

      {/* Featured Lists */}
      {featuredLists.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-ink mb-6 text-center">
            רשימות מומלצות
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {featuredLists.map((list) => (
              <article
                key={list.frontmatter.slug}
                className="bg-paper rounded-lg border border-border hover:border-primary/30 transition-all duration-200 overflow-hidden group"
              >
                <Link
                  href={`/lists/${list.frontmatter.slug}`}
                  className="block"
                >
                  {/* Cover Image */}
                  {list.frontmatter.coverImage && (
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={list.frontmatter.coverImage}
                        alt={list.frontmatter.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Featured badge */}
                    {list.frontmatter.featured && (
                      <span className="inline-block mb-2 bg-primary text-white text-xs px-2 py-1 rounded-md font-medium">
                        רשימה מומלצת
                      </span>
                    )}

                    {/* List Type */}
                    <div className="mb-2">
                      <span className="text-sm text-primary font-medium">
                        {list.frontmatter.listType === 'best-of' &&
                          'הטובים ביותר'}
                        {list.frontmatter.listType === 'recommendation' &&
                          'המלצות'}
                        {list.frontmatter.listType === 'themed' &&
                          'רשימה נושאית'}
                        {list.frontmatter.listType === 'seasonal' && 'עונתית'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-xl text-ink group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-3 leading-tight">
                      {list.frontmatter.title}
                    </h3>

                    {/* Subtitle as description */}
                    {list.frontmatter.subtitle && (
                      <p className="text-sm text-ink-light line-clamp-3 leading-relaxed mb-4">
                        {list.frontmatter.subtitle}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-ink-light">
                      <time dateTime={list.frontmatter.date}>
                        {formatDate(list.frontmatter.date)}
                      </time>
                      {list.frontmatter.books && (
                        <span>{list.frontmatter.books.length} ספרים</span>
                      )}
                    </div>

                    {/* Tags */}
                    {list.frontmatter.tags &&
                      list.frontmatter.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {list.frontmatter.tags
                            .slice(0, 3)
                            .map((tag: string) => (
                              <span
                                key={tag}
                                className="text-xs bg-sepia text-ink px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          {list.frontmatter.tags.length > 3 && (
                            <span className="text-xs text-ink-light">
                              +{list.frontmatter.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* All Lists */}
      <div>
        <h2 className="text-2xl font-bold text-ink mb-6 text-center">
          כל הרשימות ({publishedLists.length})
        </h2>
        <div className="space-y-6 max-w-4xl mx-auto">
          {publishedLists.map((list) => (
            <article
              key={list.frontmatter.slug}
              className="bg-paper rounded-lg border border-border hover:border-primary/30 transition-all duration-200 overflow-hidden group"
            >
              <Link href={`/lists/${list.frontmatter.slug}`} className="block">
                <div className="flex">
                  {/* Cover Image */}
                  {list.frontmatter.coverImage && (
                    <div className="flex-shrink-0 w-32 md:w-48">
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={list.frontmatter.coverImage}
                          alt={list.frontmatter.title}
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
                    {list.frontmatter.featured && (
                      <span className="inline-block mb-2 bg-primary text-white text-xs px-2 py-1 rounded-md font-medium">
                        רשימה מומלצת
                      </span>
                    )}

                    {/* List Type */}
                    <div className="mb-2">
                      <span className="text-sm text-primary font-medium">
                        {list.frontmatter.listType === 'best-of' &&
                          'הטובים ביותר'}
                        {list.frontmatter.listType === 'recommendation' &&
                          'המלצות'}
                        {list.frontmatter.listType === 'themed' &&
                          'רשימה נושאית'}
                        {list.frontmatter.listType === 'seasonal' && 'עונתית'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-lg md:text-xl text-ink group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-2 leading-tight">
                      {list.frontmatter.title}
                    </h3>

                    {/* Subtitle as description */}
                    {list.frontmatter.subtitle && (
                      <p className="text-sm text-ink-light line-clamp-2 leading-relaxed mb-3">
                        {list.frontmatter.subtitle}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-ink-light mb-3">
                      <time dateTime={list.frontmatter.date}>
                        {formatDate(list.frontmatter.date)}
                      </time>
                      {list.frontmatter.books && (
                        <span>{list.frontmatter.books.length} ספרים</span>
                      )}
                    </div>

                    {/* Tags */}
                    {list.frontmatter.tags &&
                      list.frontmatter.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {list.frontmatter.tags
                            .slice(0, 4)
                            .map((tag: string) => (
                              <span
                                key={tag}
                                className="text-xs bg-sepia text-ink px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          {list.frontmatter.tags.length > 4 && (
                            <span className="text-xs text-ink-light">
                              +{list.frontmatter.tags.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {publishedLists.length === 0 && (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-ink mb-2">
            עדיין אין רשימות
          </h3>
          <p className="text-ink-light">רשימות ספרים יתווספו בקרוב!</p>
        </div>
      )}
    </div>
  );
}
