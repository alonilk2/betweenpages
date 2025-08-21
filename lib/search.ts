import Fuse, { IFuseOptions, FuseResultMatch } from 'fuse.js';
import { SearchableContent, ContentType } from './schemas';

// Fuse.js configuration for Hebrew text support and fuzzy search
const fuseOptions: IFuseOptions<SearchableContent> = {
  // Which fields to search in
  keys: [
    {
      name: 'title',
      weight: 0.8, // Highest weight for titles
    },
    {
      name: 'excerpt',
      weight: 0.4,
    },
    {
      name: 'tags',
      weight: 0.6,
    },
  ],
  // Fuzzy matching options
  threshold: 0.3, // Lower = more strict matching
  distance: 100,
  minMatchCharLength: 2,
  ignoreLocation: true, // Don't consider position in text
  findAllMatches: false,
  includeScore: true,
  includeMatches: true,
  useExtendedSearch: true, // Enable extended search syntax
};

export interface SearchResult {
  item: SearchableContent;
  score?: number;
  matches?: readonly FuseResultMatch[];
}

export interface SearchFilters {
  types?: ContentType[];
  tags?: string[];
  authors?: string[];
  genres?: string[];
  dateFrom?: string;
  dateTo?: string;
  featuredOnly?: boolean;
}

export class SearchEngine {
  private fuse: Fuse<SearchableContent>;
  private allContent: SearchableContent[];

  constructor(content: SearchableContent[]) {
    this.allContent = content;
    this.fuse = new Fuse(content, fuseOptions);
  }

  /**
   * Perform a search with optional filters
   */
  search(
    query: string,
    filters?: SearchFilters,
    limit: number = 20
  ): SearchResult[] {
    // If no query and no filters, return recent content
    if (!query && !filters) {
      return this.allContent
        .filter((item) => item.date)
        .sort(
          (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()
        )
        .slice(0, limit)
        .map((item) => ({ item }));
    }

    let results: SearchResult[];

    // If we have a query, use Fuse.js for fuzzy search
    if (query) {
      const fuseResults = this.fuse.search(query, { limit: limit * 2 }); // Get more results to filter
      results = fuseResults.map((result) => ({
        item: result.item,
        score: result.score,
        matches: result.matches,
      }));
    } else {
      // No query - just get all content for filtering
      results = this.allContent.map((item) => ({ item }));
    }

    // Apply filters
    if (filters) {
      results = this.applyFilters(results, filters);
    }

    // Sort by score if available, otherwise by date
    results.sort((a, b) => {
      if (a.score !== undefined && b.score !== undefined) {
        return a.score - b.score; // Lower score = better match
      }
      if (a.item.date && b.item.date) {
        return (
          new Date(b.item.date).getTime() - new Date(a.item.date).getTime()
        );
      }
      return 0;
    });

    return results.slice(0, limit);
  }

  /**
   * Get search suggestions/autocomplete
   */
  getSuggestions(query: string, limit: number = 5): string[] {
    if (!query || query.length < 2) {
      return [];
    }

    const results = this.fuse.search(query, { limit: limit * 2 });
    const suggestions = new Set<string>();

    results.forEach((result) => {
      const title = result.item.title;

      // Add exact title matches
      if (title.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(title);
      }

      // Add tag matches
      result.item.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(tag);
        }
      });
    });

    return Array.from(suggestions).slice(0, limit);
  }

  /**
   * Get popular tags for autocomplete
   */
  getPopularTags(limit: number = 20): Array<{ tag: string; count: number }> {
    const tagCounts = new Map<string, number>();

    this.allContent.forEach((item) => {
      item.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get all available filter options
   */
  getFilterOptions() {
    const types = new Set<ContentType>();
    const tags = new Set<string>();
    const authors = new Set<string>();
    const genres = new Set<string>();

    this.allContent.forEach((item) => {
      types.add(item.type);
      item.tags.forEach((tag) => {
        tags.add(tag);

        // Distinguish authors and genres from general tags
        if (item.type === 'book') {
          // Authors and genres are included in book tags
          // This is a simplified approach - in practice, you might want
          // to maintain separate author/genre lists
        }
      });
    });

    return {
      types: Array.from(types),
      tags: Array.from(tags).sort(),
      authors: Array.from(authors).sort(),
      genres: Array.from(genres).sort(),
    };
  }

  /**
   * Apply filters to search results
   */
  private applyFilters(
    results: SearchResult[],
    filters: SearchFilters
  ): SearchResult[] {
    return results.filter((result) => {
      const item = result.item;

      // Filter by content type
      if (filters.types && filters.types.length > 0) {
        if (!filters.types.includes(item.type)) {
          return false;
        }
      }

      // Filter by tags
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some((tag) =>
          item.tags.includes(tag)
        );
        if (!hasMatchingTag) {
          return false;
        }
      }

      // Filter by date range
      if (item.date) {
        const itemDate = new Date(item.date);

        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          if (itemDate < fromDate) {
            return false;
          }
        }

        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          if (itemDate > toDate) {
            return false;
          }
        }
      }

      // Filter by featured status
      if (filters.featuredOnly && !item.featured) {
        return false;
      }

      return true;
    });
  }
}

/**
 * Utility function to highlight search matches in text
 */
export function highlightMatches(
  text: string,
  matches?: readonly FuseResultMatch[]
): string {
  if (!matches || matches.length === 0) {
    return text;
  }

  // Find matches for the current field
  const textMatches = matches.find(
    (match) => typeof match.value === 'string' && match.value === text
  );

  if (!textMatches || !textMatches.indices) {
    return text;
  }

  let result = '';
  let lastIndex = 0;

  textMatches.indices.forEach(([start, end]: [number, number]) => {
    // Add text before match
    result += text.slice(lastIndex, start);

    // Add highlighted match
    result += `<mark class="search-highlight">${text.slice(start, end + 1)}</mark>`;

    lastIndex = end + 1;
  });

  // Add remaining text
  result += text.slice(lastIndex);

  return result;
}

/**
 * Performance measurement utility
 */
export function measureSearchPerformance<T>(
  searchFunction: () => T,
  label: string = 'Search'
): { result: T; duration: number } {
  const startTime = performance.now();
  const result = searchFunction();
  const endTime = performance.now();
  const duration = endTime - startTime;

  if (process.env.NODE_ENV === 'development') {
    console.log(`${label} took ${duration.toFixed(2)}ms`);
  }

  return { result, duration };
}
