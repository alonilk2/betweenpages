'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SearchEngine,
  SearchResult,
  SearchFilters,
  highlightMatches,
  measureSearchPerformance,
} from '../../lib/search';
import { SearchableContent, ContentType } from '../../lib/schemas';

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink mb-4">חיפוש בתוך האתר</h1>
        <p className="text-lg text-gray-600">
          חפשו ספרים, ביקורות, מאמרים ועוד במאגר התוכן שלנו
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="הקלידו כדי לחפש ספרים, מחברים, תגים..."
            className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-coral-500 focus:outline-none transition-colors"
            aria-label="שדה חיפוש"
            autoComplete="off"
          />

          {isLoading && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-coral-500" />
            </div>
          )}
        </div>

        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionSelect(suggestion)}
                className="block w-full px-4 py-2 text-right hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Toggle and Results Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              showFilters
                ? 'bg-coral-500 text-white border-coral-500'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
            }`}
          >
            סינון {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              נקה סינון
            </button>
          )}
        </div>

        <div className="text-sm text-gray-500">
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
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Content Type Filter */}
            <div>
              <h3 className="font-semibold mb-3">סוג תוכן</h3>
              <div className="space-y-2">
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
                      className="mr-2"
                    />
                    <span className="text-sm">{contentTypeLabels[type]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div>
              <h3 className="font-semibold mb-3">תגים פופולריים</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
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
                      className="mr-2"
                    />
                    <span className="text-sm">
                      {tag} ({count})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Featured Content */}
            <div>
              <h3 className="font-semibold mb-3">אפשרויות נוספות</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.featuredOnly || false}
                  onChange={(e) =>
                    handleFilterChange({ featuredOnly: e.target.checked })
                  }
                  className="mr-2"
                />
                <span className="text-sm">תוכן מומלץ בלבד</span>
              </label>
            </div>

            {/* Date Range - Simplified */}
            <div>
              <h3 className="font-semibold mb-3">תאריך</h3>
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
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded"
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
      <div className="space-y-6">
        {results.length === 0 && !isLoading && query && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 mb-4">
              לא נמצאו תוצאות עבור &quot;{query}&quot;
            </p>
            <p className="text-sm text-gray-400">
              נסו לחפש במילים אחרות או להסיר חלק מהסינונים
            </p>
          </div>
        )}

        {results.length === 0 && !isLoading && !query && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">תוכן מומלץ</h2>
            <p className="text-gray-500 mb-6">
              התחילו להקליד כדי לחפש, או עיינו בתוכן הפופולרי שלנו
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {popularTags.slice(0, 8).map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => handleFilterChange({ tags: [tag] })}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
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
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${typeColor}`}
            >
              {typeLabel}
            </span>
            {item.featured && (
              <span className="px-2 py-1 text-xs font-medium bg-coral-500 text-white rounded">
                מומלץ
              </span>
            )}
          </div>

          <h3 className="text-xl font-semibold mb-2">
            <a
              href={item.url}
              className="hover:text-coral-500 transition-colors"
              dangerouslySetInnerHTML={{ __html: highlightedTitle }}
              aria-label={`קישור ל${typeLabel}: ${item.title}`}
            />
          </h3>

          {item.excerpt && (
            <p
              className="text-gray-600 mb-3 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: highlightedExcerpt }}
            />
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            {item.date && (
              <span>{new Date(item.date).toLocaleDateString('he-IL')}</span>
            )}

            {item.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <span>תגים:</span>
                <div className="flex gap-1">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-xs">+{item.tags.length - 3}</span>
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
