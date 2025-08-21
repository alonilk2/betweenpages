import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getListBySlug,
  getAllLists,
  getBookBySlug,
  getAuthorBySlug,
} from '../../../../lib/content';
import { BookCard } from '../../../../components';

interface ListPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const lists = getAllLists();
  return lists.map((list) => ({
    slug: list.frontmatter.slug,
  }));
}

export async function generateMetadata({
  params,
}: ListPageProps): Promise<Metadata> {
  const list = getListBySlug(params.slug);

  if (!list) {
    return {
      title: 'רשימה לא נמצאה | בין הדפים',
    };
  }

  return {
    title: `${list.frontmatter.title} | בין הדפים`,
    description: list.frontmatter.excerpt || list.frontmatter.subtitle,
    openGraph: {
      title: list.frontmatter.title,
      description: list.frontmatter.excerpt,
      images: list.frontmatter.coverImage
        ? [{ url: list.frontmatter.coverImage }]
        : undefined,
      type: 'article',
      publishedTime: list.frontmatter.date,
    },
  };
}

export default function ListPage({ params }: ListPageProps) {
  const list = getListBySlug(params.slug);

  if (!list || list.frontmatter.draft) {
    notFound();
  }

  // Get books referenced in this list
  const listBooks = list.frontmatter.books
    .map((slug) => getBookBySlug(slug))
    .filter(Boolean);

  // Generate breadcrumbs
  const breadcrumbs = [
    { name: 'בית', href: '/' },
    { name: 'רשימות', href: '/lists' },
    { name: list.frontmatter.title, href: `/lists/${list.frontmatter.slug}` },
  ];

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get list type label
  const getListTypeLabel = (type: string) => {
    const types = {
      'best-of': 'הטובים ביותר',
      recommendation: 'המלצות',
      themed: 'רשימה נושאית',
      seasonal: 'רשימת עונה',
    };
    return types[type as keyof typeof types] || 'רשימה';
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

      <article className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          {/* Featured badge & List Type */}
          <div className="flex items-center gap-3 mb-4">
            {list.frontmatter.featured && (
              <span className="inline-block bg-primary text-white text-sm px-3 py-1 rounded-full font-medium">
                רשימה מומלצת
              </span>
            )}
            <span className="inline-block text-sm text-ink-light bg-sepia px-3 py-1 rounded-full font-medium">
              {getListTypeLabel(list.frontmatter.listType)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-ink leading-tight mb-4">
            {list.frontmatter.title}
          </h1>

          {/* Subtitle */}
          {list.frontmatter.subtitle && (
            <p className="text-xl text-ink-light leading-relaxed mb-6">
              {list.frontmatter.subtitle}
            </p>
          )}

          {/* Excerpt */}
          {list.frontmatter.excerpt && (
            <div className="bg-sepia/30 rounded-lg p-6 mb-6">
              <p className="text-lg text-ink leading-relaxed">
                {list.frontmatter.excerpt}
              </p>
            </div>
          )}

          {/* Cover Image */}
          {list.frontmatter.coverImage && (
            <div className="mb-8">
              <Image
                src={list.frontmatter.coverImage}
                alt={list.frontmatter.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-sm"
              />
            </div>
          )}

          {/* Meta information */}
          <div className="flex items-center justify-between text-sm text-ink-light border-b border-border pb-6">
            <div className="flex items-center gap-4">
              <time dateTime={list.frontmatter.date}>
                {formatDate(list.frontmatter.date)}
              </time>
              {list.frontmatter.author && (
                <>
                  <span>•</span>
                  <span>מאת {list.frontmatter.author}</span>
                </>
              )}
              <span>•</span>
              <span>{listBooks.length} ספרים</span>
            </div>

            {/* Tags */}
            {list.frontmatter.tags.length > 0 && (
              <div className="flex items-center gap-2">
                {list.frontmatter.tags.slice(0, 3).map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${encodeURIComponent(tag)}`}
                    className="inline-block px-2 py-1 text-xs bg-sepia text-ink-light rounded-md hover:bg-sepia-dark transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
                {list.frontmatter.tags.length > 3 && (
                  <span className="text-xs text-ink-light">
                    +{list.frontmatter.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </header>

        {/* List Content */}
        <div className="prose prose-lg prose-gray max-w-none font-reading mb-12">
          <div className="text-ink leading-relaxed whitespace-pre-line">
            {list.content}
          </div>
        </div>

        {/* Books in List */}
        {listBooks.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-ink mb-6">
              הספרים ברשימה ({listBooks.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listBooks.map((book, index) => {
                const bookAuthors = book!.authors
                  .map((slug) => getAuthorBySlug(slug))
                  .filter(Boolean)
                  .map((author) => ({
                    slug: author!.slug,
                    name: author!.name,
                  }));

                return (
                  <div key={book!.slug} className="relative">
                    {/* List number/position */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white text-sm font-bold rounded-full flex items-center justify-center z-10 shadow-sm">
                      {index + 1}
                    </div>
                    <BookCard
                      slug={book!.slug}
                      title={book!.title}
                      authors={bookAuthors}
                      genres={book!.genres}
                      rating={book!.rating}
                      description={book!.description}
                      cover={book!.cover}
                      featured={book!.featured}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          {/* All Tags */}
          {list.frontmatter.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-ink-light mb-2">
                תגיות:
              </h3>
              <div className="flex flex-wrap gap-2">
                {list.frontmatter.tags.map((tag) => (
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

          {/* Back to lists */}
          <div className="text-center">
            <Link
              href="/lists"
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
              חזרה לכל הרשימות
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
