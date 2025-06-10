
import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { countryToLanguageMap } from '@/services/tmdbApi';
import LoadingSpinner from './LoadingSpinner';

interface Country {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
  flag?: string;
}

interface CountrySelectorProps {
  selectedCountry: string;
  onSelect: (countryCode: string) => void;
  className?: string;
}

const CountrySelector = ({ selectedCountry, onSelect, className = '' }: CountrySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Flag emoji for each country
  const getCountryFlag = (countryCode: string) => {
    try {
      const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
      return String.fromCodePoint(...codePoints);
    } catch {
      return '🌍'; // Fallback flag
    }
  };

  // Popular countries to show at the top when not searching
  const popularCountries = ['US', 'IN', 'JP', 'KR', 'CN', 'FR', 'ES', 'IT', 'DE', 'GB', 'BR', 'MX', 'RU', 'TR'];
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        // Optimized list for faster loading
        const commonCountries: Country[] = [
          { iso_3166_1: 'US', english_name: 'United States', native_name: 'United States' },
          { iso_3166_1: 'IN', english_name: 'India', native_name: 'India' },
          { iso_3166_1: 'JP', english_name: 'Japan', native_name: '日本' },
          { iso_3166_1: 'KR', english_name: 'South Korea', native_name: '대한민국' },
          { iso_3166_1: 'FR', english_name: 'France', native_name: 'France' },
          { iso_3166_1: 'ES', english_name: 'Spain', native_name: 'España' },
          { iso_3166_1: 'IT', english_name: 'Italy', native_name: 'Italia' },
          { iso_3166_1: 'DE', english_name: 'Germany', native_name: 'Deutschland' },
          { iso_3166_1: 'GB', english_name: 'United Kingdom', native_name: 'United Kingdom' },
          { iso_3166_1: 'BR', english_name: 'Brazil', native_name: 'Brasil' },
          { iso_3166_1: 'MX', english_name: 'Mexico', native_name: 'México' },
          { iso_3166_1: 'TR', english_name: 'Turkey', native_name: 'Türkiye' },
          { iso_3166_1: 'RU', english_name: 'Russia', native_name: 'Россия' },
          { iso_3166_1: 'CN', english_name: 'China', native_name: '中国' },
          { iso_3166_1: 'HK', english_name: 'Hong Kong', native_name: '香港' },
          { iso_3166_1: 'TW', english_name: 'Taiwan', native_name: '台湾' },
          { iso_3166_1: 'TH', english_name: 'Thailand', native_name: 'ประเทศไทย' },
          { iso_3166_1: 'PH', english_name: 'Philippines', native_name: 'Philippines' },
          { iso_3166_1: 'ID', english_name: 'Indonesia', native_name: 'Indonesia' },
          { iso_3166_1: 'MY', english_name: 'Malaysia', native_name: 'Malaysia' },
          { iso_3166_1: 'SG', english_name: 'Singapore', native_name: 'Singapore' },
          { iso_3166_1: 'VN', english_name: 'Vietnam', native_name: 'Việt Nam' },
          { iso_3166_1: 'AR', english_name: 'Argentina', native_name: 'Argentina' },
          { iso_3166_1: 'AU', english_name: 'Australia', native_name: 'Australia' },
          { iso_3166_1: 'CA', english_name: 'Canada', native_name: 'Canada' },
        ];
        
        // Add flag emoji to each country
        const countriesWithFlags = commonCountries.map(country => ({
          ...country,
          flag: getCountryFlag(country.iso_3166_1)
        }));

        setCountries(countriesWithFlags);
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Filter countries by search query and only those with language mappings
  const filteredCountries = countries
    .filter(country => {
      const hasMapping = Object.keys(countryToLanguageMap).includes(country.iso_3166_1);
      const matchesSearch = !searchQuery || 
        country.english_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.iso_3166_1.toLowerCase().includes(searchQuery.toLowerCase());
      return hasMapping && matchesSearch;
    });

  // Get displayed countries (either filtered by search or sorted by popularity)
  const getDisplayedCountries = () => {
    if (searchQuery) {
      return filteredCountries;
    }
    
    // Sort to put popular countries first when not searching
    return [...filteredCountries].sort((a, b) => {
      const aIndex = popularCountries.indexOf(a.iso_3166_1);
      const bIndex = popularCountries.indexOf(b.iso_3166_1);
      
      if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
      if (aIndex >= 0) return -1;
      if (bIndex >= 0) return 1;
      
      return a.english_name.localeCompare(b.english_name);
    });
  };

  const displayedCountries = getDisplayedCountries();
  
  // Find the selected country object
  const selectedCountryObj = countries.find(c => c.iso_3166_1 === selectedCountry);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery('');
    }
  };

  const handleCountrySelect = (countryCode: string) => {
    onSelect(countryCode);
    setIsOpen(false);
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <div className={`px-4 py-2 bg-white/5 rounded-md ${className}`}>
        <LoadingSpinner size="sm" variant="white" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected country button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 md:px-4 bg-black/40 hover:bg-black/60 text-white rounded-md border border-white/10 transition-colors text-sm md:text-base min-h-[44px]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedCountryObj && (
          <>
            <span className="text-lg md:text-xl">{selectedCountryObj.flag}</span>
            <span className="hidden sm:inline">{selectedCountryObj.english_name}</span>
            <span className="sm:hidden">{selectedCountryObj.iso_3166_1}</span>
            <ChevronDown className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4 opacity-70" />
          </>
        )}
      </button>

      {/* Dropdown menu with ultra-maximum z-index to appear above everything */}
      {isOpen && (
        <div className="fixed z-[999999999] mt-2 right-4 w-80 sm:w-72 bg-aura-dark/98 backdrop-blur-lg border border-aura-purple/30 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Search input */}
          <div className="p-3 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search country by name or code"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 bg-white/10 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-aura-purple/50 transition-all text-sm"
              />
            </div>
          </div>

          {/* Countries grid */}
          <div className="max-h-80 md:max-h-96 overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {displayedCountries.length > 0 ? (
              displayedCountries.map((country) => (
                <button
                  key={country.iso_3166_1}
                  onClick={() => handleCountrySelect(country.iso_3166_1)}
                  className={`flex items-center gap-2 p-2 md:p-3 rounded-lg transition-colors text-sm md:text-base min-h-[44px] ${
                    selectedCountry === country.iso_3166_1
                      ? 'bg-aura-purple text-white'
                      : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  <span className="text-lg md:text-xl">{country.flag}</span>
                  <span className="truncate text-left">{country.english_name}</span>
                </button>
              ))
            ) : (
              <div className="col-span-full py-4 text-center text-white/60">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
