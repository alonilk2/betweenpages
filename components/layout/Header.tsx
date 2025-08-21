'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const navigation = [
  { name: 'בית', href: '/' },
  { name: 'ספרים', href: '/books' },
  { name: 'מחברים', href: '/authors' },
  { name: 'סוגות', href: '/genres' },
  { name: 'ביקורות', href: '/reviews' },
  { name: 'רשימות', href: '/lists' },
  { name: 'חיפוש', href: '/search' },
  { name: 'אודות', href: '/about' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper/95 border-b border-border backdrop-blur-md bg-opacity-95 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {' '}
          {/* Increased from h-18 */}
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center hover:opacity-90 transition-opacity duration-300 bg-paper"
            >
              <Image
                src="/logo.jpg"
                alt="בין הדפים"
                width={200}
                height={80}
                priority
                className="h-16 w-auto md:h-20"
              />
            </Link>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2 space-x-reverse bg-sepia/50 rounded-full p-2">
            {' '}
            {/* Increased spacing and padding */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-ink-light hover:text-ink hover:bg-paper px-5 py-3 text-base font-medium transition-all duration-200 relative group rounded-full" /* Increased padding and font size */
              >
                {item.name}
              </Link>
            ))}
          </nav>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-ink-light hover:text-ink p-4 rounded-full hover:bg-sepia/50 transition-all duration-200" /* Increased padding */
              aria-expanded={isMenuOpen ? 'true' : 'false'}
              aria-label="פתח תפריט ניווט"
            >
              <svg
                className="h-7 w-7" /* Increased from h-6 w-6 */
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-6 pt-5 pb-7 space-y-3 bg-paper">
              {' '}
              {/* Increased padding and spacing */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-5 py-4 text-lg font-medium text-ink-light hover:text-ink hover:bg-sepia/50 rounded-xl transition-all duration-200" /* Increased padding and font size */
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
