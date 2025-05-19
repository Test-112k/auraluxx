
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/contexts/SearchContext';
import { getImageUrl } from '@/services/tmdbApi';
import { getYearFromDate } from '@/utils/helpers';
import { Loader } from 'lucide-react';

const SearchDropdown = () => {
  const { results, isSearching, setIsDropdownOpen } = useSearch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsDropdownOpen]);

  const handleItemClick = (id: number, type: string) => {
    setIsDropdownOpen(false);
    navigate(`/watch/${type}/${id}`);
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute z-50 top-full left-0 right-0 mt-1 p-2 bg-aura-dark/95 backdrop-blur-sm rounded-lg border border-white/10 shadow-lg animate-fade-in overflow-hidden"
    >
      {isSearching ? (
        <div className="flex justify-center py-4">
          <div className="w-8 h-8 rounded-full border-2 border-t-aura-purple border-aura-purple/20 animate-spin"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {results.map((item) => {
            const title = item.title || item.name || 'Unknown';
            const year = getYearFromDate(item.release_date || item.first_air_date || '');
            const type = item.media_type === 'tv' ? 'tv' : 'movie';
            
            return (
              <div
                key={item.id}
                className="flex items-center p-2 hover:bg-white/10 rounded cursor-pointer transition-colors"
                onClick={() => handleItemClick(item.id, type)}
              >
                <div className="w-10 h-14 bg-aura-darkpurple/20 rounded flex-shrink-0 overflow-hidden">
                  {item.poster_path ? (
                    <img 
                      src={getImageUrl(item.poster_path, 'w92')} 
                      alt={title} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <span className="text-xs text-white/40">No image</span>
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-white">{title}</div>
                  <div className="flex text-xs text-white/60">
                    <span className="capitalize">{type === 'tv' ? 'TV Series' : 'Movie'}</span>
                    {year && <span className="ml-1">• {year}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-4 text-white/60">
          No results found
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
