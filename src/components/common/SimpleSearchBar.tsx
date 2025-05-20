
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/contexts/SearchContext';
import SearchDropdown from './SearchDropdown';

const SimpleSearchBar = () => {
  const { query, setQuery, isDropdownOpen, setIsDropdownOpen, clearSearch, results } = useSearch();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      clearSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClearSearch = () => {
    clearSearch();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text" 
          value={query}
          onChange={handleInputChange}
          placeholder="Search movies, TV shows..."
          className="w-full py-2 pl-10 pr-10 bg-white/10 text-white border-white/10 rounded-full focus:border-aura-purple focus:ring-aura-purple"
        />
        {query && (
          <Button 
            type="button" 
            onClick={handleClearSearch}
            variant="ghost" 
            size="icon"
            className="absolute right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button 
          type="submit" 
          variant="ghost" 
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-transparent"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>
      
      {/* Show search dropdown only when input is focused and there are results */}
      {isDropdownOpen && results.length > 0 && <SearchDropdown />}
    </div>
  );
};

export default SimpleSearchBar;
