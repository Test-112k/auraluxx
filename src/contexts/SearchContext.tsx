import { createContext, useState, useContext, ReactNode } from 'react';
import { searchMulti } from '@/services/tmdbApi';
import { debounce } from '@/utils/helpers';
import { toast } from '@/components/ui/use-toast';

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
  performSearch: (query: string) => Promise<void>;
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQueryValue] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Create a properly working search function
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setIsDropdownOpen(false);
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchMulti(searchQuery);
      if (data && data.results) {
        // Filter out person results, keep only movies and TV shows
        const filteredResults = data.results
          .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
          .slice(0, 8); // Limit to 8 results for dropdown
        
        setResults(filteredResults);
        setIsDropdownOpen(filteredResults.length > 0);
      } else {
        setResults([]);
        setIsDropdownOpen(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setIsDropdownOpen(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search with a shorter delay for better responsiveness
  const debouncedSearch = debounce(performSearch, 300);

  const setQuery = (newQuery: string) => {
    setQueryValue(newQuery);
    
    if (newQuery.trim()) {
      debouncedSearch(newQuery);
    } else {
      setResults([]);
      setIsDropdownOpen(false);
    }
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
        performSearch,
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
