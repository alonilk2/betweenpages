import { buildSearchIndex } from '../../../lib/content';
import SearchPage from '../../components/SearchPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'חיפוש | בין הדפים',
  description: 'חפשו ספרים, ביקורות, מאמרים ותוכן נוסף באתר בין הדפים',
  openGraph: {
    title: 'חיפוש | בין הדפים',
    description: 'חפשו ספרים, ביקורות, מאמרים ותוכן נוסף באתר בין הדפים',
    type: 'website',
  },
};

export default function Search() {
  // Build search index at build time
  const searchIndex = buildSearchIndex();

  return <SearchPage searchIndex={searchIndex} />;
}
