import type { Metadata } from 'next';
import { Assistant, Libertinus_Serif } from 'next/font/google';
import { Layout } from '../../components';
import './globals.css';

const assistant = Assistant({
  variable: '--font-ui',
  subsets: ['latin', 'hebrew'],
  display: 'swap',
});

const libertinusSerif = Libertinus_Serif({
  variable: '--font-reading',
  subsets: ['latin'],
  weight: ['400', '700'],
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
        className={`${assistant.variable} ${libertinusSerif.variable} antialiased`}
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
