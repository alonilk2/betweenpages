import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import Image from 'next/image';

// Custom MDX components for enhanced typography and book-specific blocks
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Override default elements
    h1: ({ children }) => (
      <h1 className="text-3xl md:text-4xl font-bold text-ink leading-tight mb-6 mt-8">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-semibold text-ink leading-tight mb-4 mt-6">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-semibold text-ink leading-tight mb-3 mt-5">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-lg leading-relaxed text-ink/90 mb-4 max-w-prose">
        {children}
      </p>
    ),
    a: ({ href, children }) => {
      // Internal links
      if (href?.startsWith('/') || href?.startsWith('#')) {
        return (
          <Link
            href={href}
            className="text-brand-600 hover:text-brand-700 underline underline-offset-2 transition-colors"
          >
            {children}
          </Link>
        );
      }
      // External links
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 hover:text-brand-700 underline underline-offset-2 transition-colors"
        >
          {children}
        </a>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="border-r-4 border-brand-200 pr-6 py-4 my-6 italic text-lg text-ink/80 bg-sepia/30 rounded-r-lg">
        {children}
      </blockquote>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-lg text-ink/90">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-lg text-ink/90">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    img: ({ src, alt, ...props }) => (
      <div className="my-8">
        <Image
          src={src || ''}
          alt={alt || ''}
          width={800}
          height={600}
          className="rounded-lg shadow-sm"
          {...props}
        />
      </div>
    ),

    // Custom book-specific components
    PullQuote: ({
      children,
      author,
    }: {
      children: React.ReactNode;
      author?: string;
    }) => (
      <div className="my-8 p-6 bg-gradient-to-br from-sepia/40 to-sepia/20 border-r-4 border-brand-400 rounded-r-lg">
        <blockquote className="text-xl md:text-2xl font-medium text-ink italic leading-relaxed mb-2">
          "{children}"
        </blockquote>
        {author && (
          <cite className="text-sm text-ink/70 not-italic">— {author}</cite>
        )}
      </div>
    ),

    Note: ({
      children,
      type = 'info',
    }: {
      children: React.ReactNode;
      type?: 'info' | 'warning' | 'tip';
    }) => {
      const styles = {
        info: 'border-blue-200 bg-blue-50 text-blue-900',
        warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
        tip: 'border-green-200 bg-green-50 text-green-900',
      };

      return (
        <div className={`my-6 p-4 border-r-4 rounded-r-lg ${styles[type]}`}>
          <div className="text-sm font-medium mb-1">
            {type === 'info' && 'מידע נוסף'}
            {type === 'warning' && 'שים לב'}
            {type === 'tip' && 'טיפ'}
          </div>
          <div className="text-sm">{children}</div>
        </div>
      );
    },

    BookCard: ({
      slug,
      title,
      author,
      cover,
      inline = false,
    }: {
      slug: string;
      title: string;
      author: string;
      cover?: string;
      inline?: boolean;
    }) => (
      <div className={`${inline ? 'inline-block mx-2 my-1' : 'my-6'} max-w-sm`}>
        <Link
          href={`/books/${slug}`}
          className="block hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4 p-4 bg-paper border border-gray-200 rounded-lg">
            {cover && (
              <Image
                src={cover}
                alt={`עטיפת ${title}`}
                width={60}
                height={80}
                className="rounded shadow-sm flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-ink truncate">{title}</h4>
              <p className="text-sm text-ink/70 truncate">{author}</p>
            </div>
          </div>
        </Link>
      </div>
    ),

    ReadingProgress: ({ children }: { children: React.ReactNode }) => (
      <div className="sticky top-20 float-left w-1/4 p-4 ml-4 mb-4 bg-sepia/20 border border-brand-100 rounded-lg text-sm">
        <h4 className="font-semibold text-ink mb-2">במהלך הקריאה</h4>
        {children}
      </div>
    ),

    ...components,
  };
}
