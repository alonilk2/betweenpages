import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getAuthorBySlug,
  getAllAuthors,
  getBooksByAuthor,
} from '../../../../lib/content';
import { BookCard } from '../../../../components';

interface AuthorPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const authors = getAllAuthors();
  return authors.map((author) => ({
    slug: author.slug,
  }));
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const author = getAuthorBySlug(params.slug);

  if (!author) {
    return {
      title: 'מחבר לא נמצא | בין הדפים',
    };
  }

  return {
    title: `${author.name} | בין הדפים`,
    description: author.bio || `מידע על המחבר ${author.name}`,
    openGraph: {
      title: author.name,
      description: author.bio,
      images: author.photo ? [{ url: author.photo }] : undefined,
      type: 'profile',
    },
  };
}

export default function AuthorPage({ params }: AuthorPageProps) {
  const author = getAuthorBySlug(params.slug);

  if (!author) {
    notFound();
  }

  // Get author's books
  const books = getBooksByAuthor(author.slug);

  // Generate breadcrumbs
  const breadcrumbs = [
    { name: 'בית', href: '/' },
    { name: 'מחברים', href: '/authors' },
    { name: author.name, href: `/authors/${author.slug}` },
  ];

  const calculateAge = (birthYear?: number, deathYear?: number) => {
    if (!birthYear) return null;
    const endYear = deathYear || new Date().getFullYear();
    return endYear - birthYear;
  };

  const formatLifespan = (birthYear?: number, deathYear?: number) => {
    if (!birthYear) return null;
    return deathYear ? `${birthYear}–${deathYear}` : `נולד/ה ${birthYear}`;
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Author Photo & Basic Info */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            {/* Author Photo */}
            <div className="aspect-square relative overflow-hidden rounded-lg bg-sepia mb-6">
              {author.photo ? (
                <Image
                  src={author.photo}
                  alt={`תמונה של המחבר ${author.name}`}
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <p className="text-sm text-ink-light/70 font-medium">
                      אין תמונה
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Author Details */}
            <dl className="space-y-4 text-sm">
              {author.originalName && (
                <div>
                  <dt className="font-medium text-ink-light mb-1">שם מקורי:</dt>
                  <dd className="text-ink">{author.originalName}</dd>
                </div>
              )}

              {formatLifespan(author.birthYear, author.deathYear) && (
                <div>
                  <dt className="font-medium text-ink-light mb-1">
                    {author.deathYear ? 'שנות חיים:' : 'שנת לידה:'}
                  </dt>
                  <dd className="text-ink">
                    {formatLifespan(author.birthYear, author.deathYear)}
                    {calculateAge(author.birthYear, author.deathYear) && (
                      <span className="text-ink-light mr-2">
                        ({calculateAge(author.birthYear, author.deathYear)}{' '}
                        שנים)
                      </span>
                    )}
                  </dd>
                </div>
              )}

              {author.nationality && (
                <div>
                  <dt className="font-medium text-ink-light mb-1">לאום:</dt>
                  <dd className="text-ink">{author.nationality}</dd>
                </div>
              )}

              {author.website && (
                <div>
                  <dt className="font-medium text-ink-light mb-1">
                    אתר אינטרנט:
                  </dt>
                  <dd>
                    <a
                      href={author.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      קישור לאתר
                    </a>
                  </dd>
                </div>
              )}

              <div>
                <dt className="font-medium text-ink-light mb-1">מספר ספרים:</dt>
                <dd className="text-ink">{books.length}</dd>
              </div>
            </dl>

            {/* Awards */}
            {author.awards.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-ink-light mb-2">
                  פרסים והכרה:
                </h3>
                <ul className="space-y-1 text-sm text-ink">
                  {author.awards.map((award, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-4 h-4 mt-0.5 ml-2 text-yellow-500 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 15.27l6.18 3.73-1.64-7.03 5.46-4.73-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19.15z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {award}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Author Name */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-ink mb-2">
              {author.name}
            </h1>
          </div>

          {/* Author Bio */}
          {author.bio && (
            <div className="prose prose-lg prose-gray max-w-none mb-8 font-reading">
              <div className="text-ink leading-relaxed whitespace-pre-line">
                {author.bio}
              </div>
            </div>
          )}

          {/* Author's Books */}
          <div>
            <h2 className="text-2xl font-bold text-ink mb-6">
              ספרים של {author.name}
              <span className="text-lg font-normal text-ink-light mr-2">
                ({books.length} ספרים)
              </span>
            </h2>

            {books.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {books.map((book) => {
                  // For author page, we know this author wrote the book
                  const bookAuthors = [
                    { slug: author.slug, name: author.name },
                  ];

                  return (
                    <BookCard
                      key={book.slug}
                      slug={book.slug}
                      title={book.title}
                      authors={bookAuthors}
                      genres={book.genres}
                      rating={book.rating}
                      description={book.description}
                      cover={book.cover}
                      featured={book.featured}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-ink-light">
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
                <p>עדיין אין ספרים רשומים עבור מחבר זה</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
