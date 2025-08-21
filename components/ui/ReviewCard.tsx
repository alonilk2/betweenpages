'use client';

import Image from 'next/image';
import Link from 'next/link';

interface ReviewCardProps {
  slug: string;
  title: string;
  excerpt?: string;
  date: string;
  bookTitle?: string;
  bookSlug?: string;
  bookCover?: string;
  author?: string;
  featured?: boolean;
  readTime?: number;
  className?: string;
}

export default function ReviewCard({
  slug,
  title,
  excerpt,
  date,
  bookTitle,
  bookSlug,
  bookCover,
  author,
  featured = false,
  readTime,
  className = '',
}: ReviewCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article
      className={`group bg-paper rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 ${className}`}
    >
      <Link href={`/reviews/${slug}`} className="block">
        <div className="flex gap-6">
          {/* Content */}
          <div className="flex-1 p-6 min-w-0">
            {/* Featured Badge */}
            {featured && (
              <span className="inline-block mb-4 bg-gradient-to-r from-primary to-coral-600 text-white text-sm px-4 py-2 rounded-full font-medium shadow-sm">
                {' '}
                {/* Increased padding and font size */}
                ביקורת מומלצת
              </span>
            )}

            {/* Review Title */}
            <h3 className="font-bold text-ink group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-4 leading-tight text-xl">
              {' '}
              {/* Increased margin and font size */}
              {title}
            </h3>

            {/* Book Info */}
            {bookTitle && (
              <div className="text-base text-ink-light mb-4 p-4 bg-sepia/50 rounded-xl">
                {' '}
                {/* Increased font size, margin, and padding */}
                ביקורת על:{' '}
                {bookSlug ? (
                  <Link
                    href={`/books/${bookSlug}`}
                    className="font-medium hover:text-primary hover:underline transition-colors duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {bookTitle}
                  </Link>
                ) : (
                  <span className="font-medium">{bookTitle}</span>
                )}
                {author && (
                  <span className="text-ink-light/70"> מאת {author}</span>
                )}
              </div>
            )}

            {/* Excerpt */}
            {excerpt && (
              <p className="text-base text-ink-light line-clamp-3 leading-relaxed mb-5">
                {' '}
                {/* Increased font size and margin */}
                {excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-ink-light mt-auto pt-3 border-t border-border/50">
              <time dateTime={date} className="flex items-center gap-2">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formatDate(date)}
              </time>
              {readTime && (
                <span className="flex items-center gap-2 bg-primary/90 text-white px-3 py-2 rounded-full font-medium text-sm shadow-sm">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {readTime} דקות
                </span>
              )}
            </div>
          </div>

          {/* Book Cover */}
          {bookCover && bookSlug && (
            <div className="flex-shrink-0 w-54 md:w-54">
              <div className="aspect-[3/4] relative overflow-hidden rounded-xl h-full">
                <Image
                  src={bookCover}
                  alt={`עטיפת הספר "${bookTitle}"`}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 144px, 176px"
                />
              </div>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
