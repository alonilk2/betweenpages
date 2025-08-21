import { ReactNode } from 'react';

interface PullQuoteProps {
  children: ReactNode;
  author?: string;
  source?: string;
  className?: string;
}

export default function PullQuote({
  children,
  author,
  source,
  className = '',
}: PullQuoteProps) {
  return (
    <blockquote className={`relative my-12 ${className}`}>
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-lavender/5 to-sage/5 rounded-3xl"></div>

        {/* Quote marks */}
        <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-primary to-coral-600 rounded-full flex items-center justify-center shadow-lg">
          <span
            className="text-3xl text-white font-serif leading-none"
            aria-hidden="true"
          >
            „
          </span>
        </div>

        {/* Quote content */}
        <div className="relative bg-paper/80 backdrop-blur-sm border border-primary/20 p-8 rounded-3xl shadow-lg">
          <div className="font-reading text-xl md:text-2xl leading-relaxed text-ink font-medium">
            {children}
          </div>

          {/* Attribution */}
          {(author || source) && (
            <footer className="mt-6 pt-4 border-t border-border/50 text-ink-light">
              {author && (
                <cite className="font-medium not-italic text-primary">
                  {author}
                </cite>
              )}
              {author && source && <span className="mx-3 text-border">•</span>}
              {source && (
                <span className="text-sm bg-sepia px-3 py-1 rounded-full">
                  {source}
                </span>
              )}
            </footer>
          )}
        </div>
      </div>
    </blockquote>
  );
}
