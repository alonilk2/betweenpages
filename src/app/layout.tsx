import type { Metadata } from 'next';
import { Assistant, Noto_Serif_Hebrew } from 'next/font/google';
import { Layout } from '../../components';
import './globals.css';

const assistant = Assistant({
  variable: '--font-ui',
  subsets: ['latin', 'hebrew'],
  display: 'swap',
});

// Reading font (Hebrew serif). Libertinus Serif is not available on Google Fonts,
// so we use Noto Serif Hebrew as a close accessible alternative. To self-host
// Libertinus you can add font files in /public/fonts and reference via CSS.
const readingSerif = Noto_Serif_Hebrew({
  variable: '--font-reading',
  subsets: ['hebrew'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'בין הדפים',
  description: 'אתר המלצות וביקורות ספרים בעברית',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body
        className={`${assistant.variable} ${readingSerif.variable} antialiased`}
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
