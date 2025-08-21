import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getArticleBySlug, getAllArticles } from '../../../../lib/content';

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.frontmatter.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: 'מאמר לא נמצא | בין הדפים',
    };
  }

  return {
    title: `${article.frontmatter.title} | בין הדפים`,
    description: article.frontmatter.excerpt || article.frontmatter.subtitle,
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.excerpt,
      images: article.frontmatter.coverImage
        ? [{ url: article.frontmatter.coverImage }]
        : undefined,
      type: 'article',
      publishedTime: article.frontmatter.date,
    },
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);

  if (!article || article.frontmatter.draft) {
    notFound();
  }

  // Generate breadcrumbs
  const breadcrumbs = [
    { name: 'בית', href: '/' },
    { name: 'מאמרים', href: '/articles' },
    {
      name: article.frontmatter.title,
      href: `/articles/${article.frontmatter.slug}`,
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
          {article.frontmatter.featured && (
            <div className="mb-4">
              <span className="inline-block bg-primary text-white text-sm px-3 py-1 rounded-full font-medium">
                מאמר מומלץ
              </span>
            </div>
          )}

          {/* Category */}
          {article.frontmatter.category && (
            <div className="mb-4">
              <span className="inline-block text-sm text-primary font-medium">
                {article.frontmatter.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-ink leading-tight mb-4">
            {article.frontmatter.title}
          </h1>

          {/* Subtitle */}
          {article.frontmatter.subtitle && (
            <p className="text-xl text-ink-light leading-relaxed mb-6">
              {article.frontmatter.subtitle}
            </p>
          )}

          {/* Excerpt */}
          {article.frontmatter.excerpt && (
            <div className="bg-sepia/30 rounded-lg p-6 mb-6">
              <p className="text-lg text-ink leading-relaxed italic">
                {article.frontmatter.excerpt}
              </p>
            </div>
          )}

          {/* Cover Image */}
          {article.frontmatter.coverImage && (
            <div className="mb-8">
              <Image
                src={article.frontmatter.coverImage}
                alt={article.frontmatter.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-sm"
              />
            </div>
          )}

          {/* Meta information */}
          <div className="flex items-center justify-between text-sm text-ink-light border-b border-border pb-6">
            <div className="flex items-center gap-4">
              <time dateTime={article.frontmatter.date}>
                {formatDate(article.frontmatter.date)}
              </time>
              {article.frontmatter.readingTime && (
                <>
                  <span>•</span>
                  <span>{article.frontmatter.readingTime} דקות קריאה</span>
                </>
              )}
              {article.frontmatter.author && (
                <>
                  <span>•</span>
                  <span>מאת {article.frontmatter.author}</span>
                </>
              )}
            </div>

            {/* Tags */}
            {article.frontmatter.tags.length > 0 && (
              <div className="flex items-center gap-2">
                {article.frontmatter.tags.slice(0, 3).map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${encodeURIComponent(tag)}`}
                    className="inline-block px-2 py-1 text-xs bg-sepia text-ink-light rounded-md hover:bg-sepia-dark transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
                {article.frontmatter.tags.length > 3 && (
                  <span className="text-xs text-ink-light">
                    +{article.frontmatter.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg prose-gray max-w-none font-reading">
          <div className="text-ink leading-relaxed whitespace-pre-line">
            {article.content}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          {/* All Tags */}
          {article.frontmatter.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-ink-light mb-2">
                תגיות:
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.frontmatter.tags.map((tag) => (
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

          {/* Back to articles */}
          <div className="text-center">
            <Link
              href="/articles"
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
              חזרה לכל המאמרים
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
