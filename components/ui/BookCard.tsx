'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Author {
  slug: string;
  name: string;
}

interface BookCardProps {
  slug: string;
  title: string;
  authors: Author[];
  genres: string[];
  rating?: number;
  description?: string;
  cover?: string;
  featured?: boolean;
  className?: string;
}

export default function BookCard({
  slug,
  title,
  authors,
  genres,
  rating,
  description,
  cover,
  featured = false,
  className = '',
}: BookCardProps) {
  return (
    <article
      className={`group relative bg-paper rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 ${className}`}
    >
      {featured && (
        <div className="absolute top-5 left-5 z-10 bg-gradient-to-r from-primary to-coral-600 text-white text-sm px-4 py-2 rounded-full font-medium shadow-lg">
          {' '}
          {/* Increased size and padding */}
          מומלץ
        </div>
      )}

      <Link href={`/books/${slug}`} className="block">
        {/* Book Cover */}
        <div className="aspect-[3/4] relative overflow-hidden bg-sepia rounded-t-2xl">
          {cover ? (
            <Image
              src={cover}
              alt={`עטיפת הספר "${title}"`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sepia to-sepia-dark">
              <div className="text-center p-6">
                {' '}
                {/* Increased padding */}
                <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
                  {' '}
                  {/* Increased size */}
                  <svg
                    className="w-10 h-10 text-ink-light/50"
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
                </div>
                <p className="text-sm text-ink-light/70 font-medium">
                  אין עטיפה
                </p>{' '}
                {/* Increased from text-xs */}
              </div>
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="p-8">
          {' '}
          {/* Increased from p-6 */}
          <h3 className="font-bold text-ink group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-4 leading-tight text-xl">
            {' '}
            {/* Increased margins and font size */}
            {title}
          </h3>
          {/* Authors */}
          <div className="text-base text-ink-light mb-4">
            {' '}
            {/* Increased font size and margin */}
            מאת:{' '}
            {authors.map((author, index) => (
              <span key={author.slug}>
                <Link
                  href={`/authors/${author.slug}`}
                  className="hover:text-ink hover:underline transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {author.name}
                </Link>
                {index < authors.length - 1 && ', '}
              </span>
            ))}
          </div>
          {/* Genres */}
          <div className="flex flex-wrap gap-3 mb-5">
            {genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="inline-block px-4 py-2 text-sm bg-gradient-to-r from-sepia to-sepia-dark text-ink-light rounded-full font-medium"
              >
                {genre}
              </span>
            ))}
            {genres.length > 2 && (
              <span className="inline-block px-4 py-2 text-sm bg-gradient-to-r from-lavender-100 to-lavender-200 text-lavender-700 rounded-full font-medium">
                +{genres.length - 2}
              </span>
            )}
          </div>
          {/* Rating */}
          {rating && (
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(rating)
                        ? 'text-yellow-400 fill-current'
                        : i < rating
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
                <span className="mr-3 text-base text-ink-light">
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>
          )}
          {/* Description */}
          {description && (
            <p className="text-base text-ink-light line-clamp-3 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
