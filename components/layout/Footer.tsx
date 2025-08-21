import Link from 'next/link';

const footerLinks = {
  site: [
    { name: 'בית', href: '/' },
    { name: 'ספרים', href: '/books' },
    { name: 'מחברים', href: '/authors' },
    { name: 'ביקורות', href: '/reviews' },
  ],
  about: [
    { name: 'אודות', href: '/about' },
    { name: 'צור קשר', href: '/contact' },
    { name: 'מדיניות פרטיות', href: '/privacy' },
    { name: 'תנאי שימוש', href: '/terms' },
  ],
};

const socialLinks = [
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M12.017 0C8.396 0 7.929.013 6.71.072 5.493.131 4.68.333 3.982.63c-.72.3-1.301.712-1.901 1.312C1.581 2.542 1.169 3.123.869 3.844c-.297.698-.499 1.51-.558 2.729C.252 7.794.24 8.261.24 11.882c0 3.621.012 4.089.071 5.307.059 1.219.261 2.031.558 2.729.3.721.712 1.302 1.312 1.902.6.6 1.181 1.012 1.902 1.312.698.297 1.51.499 2.729.558 1.219.059 1.686.071 5.307.071 3.621 0 4.089-.012 5.307-.071 1.219-.059 2.031-.261 2.729-.558.721-.3 1.302-.712 1.902-1.312.6-.6 1.012-1.181 1.312-1.902.297-.698.499-1.51.558-2.729.059-1.218.071-1.686.071-5.307 0-3.621-.012-4.089-.071-5.307-.059-1.219-.261-2.031-.558-2.729-.3-.721-.712-1.302-1.312-1.902-.6-.6-1.181-1.012-1.902-1.312-.698-.297-1.51-.499-2.729-.558C16.107.013 15.64 0 12.017 0zM12.017 2.162c3.557 0 3.98.013 5.386.071 1.3.059 2.006.276 2.477.456.623.243 1.07.534 1.538 1.002.468.468.759.915 1.002 1.538.18.471.397 1.177.456 2.477.058 1.407.071 1.83.071 5.386 0 3.557-.013 3.98-.071 5.386-.059 1.3-.276 2.006-.456 2.477-.243.623-.534 1.07-1.002 1.538-.468.468-.915.759-1.538 1.002-.471.18-1.177.397-2.477.456-1.407.058-1.83.071-5.386.071-3.557 0-3.98-.013-5.386-.071-1.3-.059-2.006-.276-2.477-.456-.623-.243-1.07-.534-1.538-1.002-.468-.468-.759-.915-1.002-1.538-.18-.471-.397-1.177-.456-2.477-.058-1.407-.071-1.83-.071-5.386 0-3.557.013-3.98.071-5.386.059-1.3.276-2.006.456-2.477.243-.623.534-1.07 1.002-1.538.468-.468.915-.759 1.538-1.002.471-.18 1.177-.397 2.477-.456 1.407-.058 1.83-.071 5.386-.071zm0 3.709c-3.718 0-6.73 3.013-6.73 6.73s3.012 6.73 6.73 6.73 6.73-3.013 6.73-6.73-3.012-6.73-6.73-6.73zm0 11.107c-2.417 0-4.377-1.96-4.377-4.377s1.96-4.377 4.377-4.377 4.377 1.96 4.377 4.377-1.96 4.377-4.377 4.377zm8.586-11.386c0 .868-.705 1.573-1.573 1.573-.868 0-1.573-.705-1.573-1.573s.705-1.573 1.573-1.573 1.573.705 1.573 1.573z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: '#',
    icon: (
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: '#',
    icon: (
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-sepia border-t border-border">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand and description */}
          <div className="xl:col-span-1">
            <Link
              href="/"
              className="text-xl font-bold text-ink hover:text-primary transition-colors duration-200"
            >
              בין הדפים
            </Link>
            <p className="mt-4 text-ink-light text-sm leading-relaxed">
              אתר המלצות וביקורות ספרים בעברית.
              <br />
              מקום לאוהבי ספרות לגלות, לקרוא ולהמליץ.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex space-x-6 space-x-reverse">
              {socialLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-ink-light hover:text-primary transition-colors duration-200"
                  aria-label={`עקוב אחרינו ב-${item.name}`}
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation links */}
          <div className="mt-12 xl:mt-0 xl:col-span-2">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-ink tracking-wider">
                  ניווט באתר
                </h3>
                <ul className="mt-4 space-y-4">
                  {footerLinks.site.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-ink-light hover:text-ink transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-ink tracking-wider">
                  מידע
                </h3>
                <ul className="mt-4 space-y-4">
                  {footerLinks.about.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-ink-light hover:text-ink transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-sm text-ink-light text-center">
            © 2025 בין הדפים. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}
