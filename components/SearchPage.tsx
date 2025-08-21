'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SearchEngine,
  SearchResult,
  SearchFilters,
  highlightMatches,
  measureSearchPerformance,
} from '@/lib/search';
import { SearchableContent, ContentType } from '@/lib/schemas';

interface SearchPageProps {
  searchIndex: SearchableContent[];
}

const contentTypeLabels: Record<ContentType, string> = {
  book: 'ספרים',
  author: 'מחברים',
  genre: 'סוגות',
  review: 'ביקורות',
  article: 'מאמרים',
  list: 'רשימות',
};

export default function SearchPage({ searchIndex }: SearchPageProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchTime, setSearchTime] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  // Initialize search engine
  const searchEngine = useMemo(
    () => new SearchEngine(searchIndex),
    [searchIndex]
  );

  // Get filter options
  const filterOptions = useMemo(
    () => searchEngine.getFilterOptions(),
    [searchEngine]
  );
  const popularTags = useMemo(
    () => searchEngine.getPopularTags(15),
    [searchEngine]
  );

  // Debounced search function
  const performSearch = useCallback(
    (searchQuery: string, searchFilters: SearchFilters) => {
      setIsLoading(true);

      const { result, duration } = measureSearchPerformance(() =>
        searchEngine.search(searchQuery, searchFilters, 20)
      );

      setResults(result);
      setSearchTime(duration);
      setIsLoading(false);
    },
    [searchEngine]
  );

  // Handle search input change
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);

    // Get suggestions
    if (newQuery.length >= 2) {
      const newSuggestions = searchEngine.getSuggestions(newQuery, 5);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Debounce search execution
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query, filters);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query, filters, performSearch]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({});
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
  };

  const activeFiltersCount = Object.values(filters).filter((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  ).length;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* Page Header */}
      <div className="mb-10">
        {' '}
        {/* Increased from mb-8 */}
        <h1 className="text-4xl font-bold text-ink mb-5">
          חיפוש בתוך האתר
        </h1>{' '}
        {/* Increased font size and margin */}
        <p className="text-xl text-gray-600">
          {' '}
          {/* Increased from text-lg */}
          חפשו ספרים, ביקורות, מאמרים ועוד במאגר התוכן שלנו
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-8">
        {' '}
        {/* Increased from mb-6 */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="הקלידו כדי לחפש ספרים, מחברים, תגים..."
            className="w-full px-6 py-4 text-xl border-2 border-gray-200 rounded-xl focus:border-brand-500 focus:outline-none transition-colors"
            aria-label="שדה חיפוש"
            autoComplete="off"
          />

          {isLoading && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              {' '}
              {/* Adjusted position */}
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500" />{' '}
              {/* Increased size */}
            </div>
          )}
        </div>
        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-10 mt-2">
            {' '}
            {/* Increased border radius and margin */}
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionSelect(suggestion)}
                className="block w-full px-5 py-3 text-right text-base hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Toggle and Results Info */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-5 py-3 text-base rounded-xl border transition-colors ${
              showFilters
                ? 'bg-brand-500 text-white border-brand-500'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
            }`}
          >
            סינון {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-base text-gray-500 hover:text-gray-700 transition-colors"
            >
              נקה סינון
            </button>
          )}
        </div>

        <div className="text-base text-gray-500">
          {results.length > 0 && (
            <>
              נמצאו {results.length} תוצאות
              {searchTime > 0 && ` (${searchTime.toFixed(0)}ms)`}
            </>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-xl p-8 mb-8">
          {' '}
          {/* Increased border radius and padding */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {' '}
            {/* Increased gap */}
            {/* Content Type Filter */}
            <div>
              <h3 className="font-semibold mb-4 text-lg">סוג תוכן</h3>{' '}
              {/* Increased margin and font size */}
              <div className="space-y-3">
                {' '}
                {/* Increased spacing */}
                {filterOptions.types.map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.types?.includes(type) || false}
                      onChange={(e) => {
                        const newTypes = filters.types || [];
                        if (e.target.checked) {
                          handleFilterChange({ types: [...newTypes, type] });
                        } else {
                          handleFilterChange({
                            types: newTypes.filter((t) => t !== type),
                          });
                        }
                      }}
                      className="mr-3 w-4 h-4"
                    />
                    <span className="text-base">{contentTypeLabels[type]}</span>{' '}
                    {/* Increased font size */}
                  </label>
                ))}
              </div>
            </div>
            {/* Popular Tags */}
            <div>
              <h3 className="font-semibold mb-4 text-lg">תגים פופולריים</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {popularTags.slice(0, 10).map(({ tag, count }) => (
                  <label key={tag} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.tags?.includes(tag) || false}
                      onChange={(e) => {
                        const newTags = filters.tags || [];
                        if (e.target.checked) {
                          handleFilterChange({ tags: [...newTags, tag] });
                        } else {
                          handleFilterChange({
                            tags: newTags.filter((t) => t !== tag),
                          });
                        }
                      }}
                      className="mr-3 w-4 h-4"
                    />
                    <span className="text-base">
                      {tag} ({count})
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {/* Featured Content */}
            <div>
              <h3 className="font-semibold mb-4 text-lg">אפשרויות נוספות</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.featuredOnly || false}
                  onChange={(e) =>
                    handleFilterChange({ featuredOnly: e.target.checked })
                  }
                  className="mr-3 w-4 h-4"
                />
                <span className="text-base">תוכן מומלץ בלבד</span>
              </label>
            </div>
            {/* Date Range - Simplified */}
            <div>
              <h3 className="font-semibold mb-4 text-lg">תאריך</h3>
              <select
                value={filters.dateFrom || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    const date = new Date();
                    date.setMonth(date.getMonth() - parseInt(value));
                    handleFilterChange({
                      dateFrom: date.toISOString().split('T')[0],
                    });
                  } else {
                    handleFilterChange({ dateFrom: undefined });
                  }
                }}
                className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg"
                aria-label="סינון לפי תאריך"
              >
                <option value="">כל הזמנים</option>
                <option value="1">החודש האחרון</option>
                <option value="3">3 חודשים אחרונים</option>
                <option value="6">6 חודשים אחרונים</option>
                <option value="12">השנה האחרונה</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-8">
        {' '}
        {/* Increased from space-y-6 */}
        {results.length === 0 && !isLoading && query && (
          <div className="text-center py-16">
            {' '}
            {/* Increased from py-12 */}
            <p className="text-xl text-gray-500 mb-5">
              {' '}
              {/* Increased font size and margin */}
              לא נמצאו תוצאות עבור "{query}"
            </p>
            <p className="text-base text-gray-400">
              {' '}
              {/* Increased from text-sm */}
              נסו לחפש במילים אחרות או להסיר חלק מהסינונים
            </p>
          </div>
        )}
        {results.length === 0 && !isLoading && !query && (
          <div className="text-center py-16">
            {' '}
            {/* Increased from py-12 */}
            <h2 className="text-2xl font-semibold mb-5">תוכן מומלץ</h2>{' '}
            {/* Increased font size and margin */}
            <p className="text-lg text-gray-500 mb-8">
              {' '}
              {/* Increased font size and margin */}
              התחילו להקליד כדי לחפש, או עיינו בתוכן הפופולרי שלנו
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-base">
              {' '}
              {/* Increased gap and font size */}
              {popularTags.slice(0, 8).map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => handleFilterChange({ tags: [tag] })}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  {tag} ({count})
                </button>
              ))}
            </div>
          </div>
        )}
        {results.map((result, index) => (
          <SearchResultCard
            key={`${result.item.type}-${result.item.slug}-${index}`}
            result={result}
          />
        ))}
      </div>
    </div>
  );
}

// Individual search result card component
function SearchResultCard({ result }: { result: SearchResult }) {
  const { item, matches } = result;

  const highlightedTitle = highlightMatches(item.title, matches);
  const highlightedExcerpt = item.excerpt
    ? highlightMatches(item.excerpt, matches)
    : '';

  const typeLabel = contentTypeLabels[item.type];
  const typeColor = {
    book: 'bg-blue-100 text-blue-800',
    author: 'bg-green-100 text-green-800',
    genre: 'bg-purple-100 text-purple-800',
    review: 'bg-orange-100 text-orange-800',
    article: 'bg-red-100 text-red-800',
    list: 'bg-yellow-100 text-yellow-800',
  }[item.type];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
      {' '}
      {/* Increased padding and border radius */}
      <div className="flex items-start justify-between mb-4">
        {' '}
        {/* Increased margin */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            {' '}
            {/* Increased gap and margin */}
            <span
              className={`px-3 py-1.5 text-sm font-medium rounded-lg ${typeColor}`}
            >
              {' '}
              {/* Increased padding, font size, and border radius */}
              {typeLabel}
            </span>
            {item.featured && (
              <span className="px-3 py-1.5 text-sm font-medium bg-brand-500 text-white rounded-lg">
                {' '}
                {/* Increased padding, font size, and border radius */}
                מומלץ
              </span>
            )}
          </div>

          <h3 className="text-2xl font-semibold mb-3">
            {' '}
            {/* Increased font size and margin */}
            <a
              href={item.url}
              className="hover:text-brand-500 transition-colors"
              dangerouslySetInnerHTML={{ __html: highlightedTitle }}
              aria-label={`קישור ל${typeLabel}: ${item.title}`}
            />
          </h3>

          {item.excerpt && (
            <p
              className="text-lg text-gray-600 mb-4 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: highlightedExcerpt }}
            />
          )}

          <div className="flex items-center gap-5 text-base text-gray-500">
            {' '}
            {/* Increased gap and font size */}
            {item.date && (
              <span>{new Date(item.date).toLocaleDateString('he-IL')}</span>
            )}
            {item.tags.length > 0 && (
              <div className="flex items-center gap-2">
                {' '}
                {/* Increased gap */}
                <span>תגים:</span>
                <div className="flex gap-2">
                  {' '}
                  {/* Increased gap */}
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 rounded-lg text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-sm">+{item.tags.length - 3}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
