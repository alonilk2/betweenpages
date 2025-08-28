'use client';
import Link from 'next/link';
import Image from 'next/image';

interface ShopProductCardProps {
  handle: string;
  title: string;
  price: string;
  image?: { url: string; alt?: string } | null;
  available?: boolean;
  buyUrl?: string | null;
  className?: string;
}

export default function ShopProductCard({
  handle,
  title,
  price,
  image,
  available = true,
  buyUrl,
  className = '',
}: ShopProductCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-border bg-paper shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      <div className="aspect-[3/4] w-full overflow-hidden bg-sepia">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt || title}
            width={400}
            height={520}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-light/50">
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        )}
        {!available && (
          <div className="absolute inset-0 bg-paper/70 backdrop-blur-sm flex items-center justify-center">
            <span className="px-4 py-2 rounded-full bg-ink text-white text-sm font-medium">
              אזל במלאי
            </span>
          </div>
        )}
      </div>
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-ink mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-lg font-medium text-primary">₪{price}</p>
        </div>
        {buyUrl ? (
          <Link
            href={buyUrl}
            className="block w-full text-center rounded-xl bg-gradient-to-r from-primary to-coral-600 px-5 py-3 text-sm font-medium text-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-paper transition-all"
          >
            לרכישה
          </Link>
        ) : (
          <div className="w-full rounded-xl bg-sepia-dark px-5 py-3 text-center text-sm font-medium text-ink-light/70">
            לא זמין לרכישה
          </div>
        )}
      </div>
    </div>
  );
}
