import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllTags, getContentByTag } from '../../../../lib/content';

interface TagPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    slug: encodeURIComponent(tag),
  }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const tagName = decodeURIComponent(params.slug);

  return {
    title: `תגית &ldquo;${tagName}&rdquo; | בין הדפים`,
    description: `תוכן המתויג ב&ldquo;${tagName}&rdquo;`,
    openGraph: {
      title: `תגית &ldquo;${tagName}&rdquo;`,
      description: `תוכן המתויג ב&ldquo;${tagName}&rdquo;`,
      type: 'website',
    },
  };
}

export default function TagPage({ params }: TagPageProps) {
  const tagName = decodeURIComponent(params.slug);

  // Get all content with this tag
  const content = getContentByTag(tagName);

  if (content.length === 0) {
    notFound();
  }

  // Separate content by type
  const books = content.filter((item) => item.type === 'book');
  const reviews = content.filter((item) => item.type === 'review');
  const articles = content.filter((item) => item.type === 'article');
  const lists = content.filter((item) => item.type === 'list');

  // Generate breadcrumbs
  const breadcrumbs = [
    { name: 'בית', href: '/' },
    { name: 'תגיות', href: '/tags' },
    { name: tagName, href: `/tag/${params.slug}` },
  ];

  // Get stats
  const totalContent = content.length;
  const contentTypes = [
    { name: 'ספרים', count: books.length, type: 'books' },
    { name: 'ביקורות', count: reviews.length, type: 'reviews' },
    { name: 'מאמרים', count: articles.length, type: 'articles' },
    { name: 'רשימות', count: lists.length, type: 'lists' },
  ].filter((type) => type.count > 0);

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

      {/* Tag Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 ml-4 flex items-center justify-center rounded-full bg-sepia">
            <svg
              className="w-6 h-6 text-ink-light"
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
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-ink">
              תגית &ldquo;{tagName}&rdquo;
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-ink-light">
              <span>{totalContent} פריטי תוכן</span>
              <span>•</span>
              <span>
                {contentTypes
                  .map((type) => `${type.count} ${type.name}`)
                  .join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Books Section */}
      {books.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-ink mb-6">
            ספרים ({books.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => {
              // We need to get the actual book data for full info
              // This is a simplified version - in practice you'd fetch the full book
              return (
                <article
                  key={book.slug}
                  className="bg-paper rounded-lg border border-border p-4 hover:border-primary/30 transition-colors"
                >
                  <Link href={book.url} className="block">
                    <h3 className="font-bold text-ink hover:text-primary transition-colors mb-2 line-clamp-2">
                      {book.title}
                    </h3>
                    {book.excerpt && (
                      <p className="text-sm text-ink-light line-clamp-3">
                        {book.excerpt}
                      </p>
                    )}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-ink mb-6">
            ביקורות ({reviews.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <article
                key={review.slug}
                className="bg-paper rounded-lg border border-border p-4 hover:border-primary/30 transition-colors"
              >
                <Link href={review.url} className="block">
                  {review.featured && (
                    <span className="inline-block mb-2 bg-primary text-white text-xs px-2 py-1 rounded-md font-medium">
                      ביקורת מומלצת
                    </span>
                  )}
                  <h3 className="font-bold text-ink hover:text-primary transition-colors mb-2 line-clamp-2">
                    {review.title}
                  </h3>
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
        </div>
      )}

      {/* Articles Section */}
      {articles.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-ink mb-6">
            מאמרים ({articles.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <article
                key={article.slug}
                className="bg-paper rounded-lg border border-border p-4 hover:border-primary/30 transition-colors"
              >
                <Link href={article.url} className="block">
                  {article.featured && (
                    <span className="inline-block mb-2 bg-primary text-white text-xs px-2 py-1 rounded-md font-medium">
                      מאמר מומלץ
                    </span>
                  )}
                  <h3 className="font-bold text-ink hover:text-primary transition-colors mb-2 line-clamp-2">
                    {article.title}
                  </h3>
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
        </div>
      )}

      {/* Lists Section */}
      {lists.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-ink mb-6">
            רשימות ({lists.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lists.map((list) => (
              <article
                key={list.slug}
                className="bg-paper rounded-lg border border-border p-4 hover:border-primary/30 transition-colors"
              >
                <Link href={list.url} className="block">
                  {list.featured && (
                    <span className="inline-block mb-2 bg-primary text-white text-xs px-2 py-1 rounded-md font-medium">
                      רשימה מומלצת
                    </span>
                  )}
                  <h3 className="font-bold text-ink hover:text-primary transition-colors mb-2 line-clamp-2">
                    {list.title}
                  </h3>
                  {list.excerpt && (
                    <p className="text-sm text-ink-light line-clamp-3 mb-2">
                      {list.excerpt}
                    </p>
                  )}
                  <time className="text-xs text-ink-light">
                    {new Date(list.date!).toLocaleDateString('he-IL')}
                  </time>
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
