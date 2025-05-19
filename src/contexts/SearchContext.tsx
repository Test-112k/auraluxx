
import { createContext, useState, useContext, ReactNode } from 'react';
import { searchMulti } from '@/services/tmdbApi';
import { debounce } from '@/utils/helpers';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
}

interface SearchContextType {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  isDropdownOpen: boolean;
  setQuery: (query: string) => void;
  setIsDropdownOpen: (isOpen: boolean) => void;
  clearSearch: () => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQueryValue] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchResults = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsDropdownOpen(false);
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchMulti(searchQuery);
      if (data && data.results) {
        setResults(data.results.slice(0, 8)); // Limit to 8 results for dropdown
        setIsDropdownOpen(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search to prevent too many API calls
  const debouncedSearch = debounce(fetchResults, 300);

  const setQuery = (newQuery: string) => {
    setQueryValue(newQuery);
    debouncedSearch(newQuery);
  };

  const clearSearch = () => {
    setQueryValue('');
    setResults([]);
    setIsDropdownOpen(false);
  };

  return (
    <SearchContext.Provider
      value={{
        query,
        results,
        isSearching,
        isDropdownOpen,
        setQuery,
        setIsDropdownOpen,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
