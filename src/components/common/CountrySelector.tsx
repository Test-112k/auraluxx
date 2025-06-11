
import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Globe } from 'lucide-react';
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
  const [initialCountrySet, setInitialCountrySet] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const getCountryFlag = (countryCode: string) => {
    try {
      const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
      return String.fromCodePoint(...codePoints);
    } catch {
      return '🌍';
    }
  };

  const popularCountries = ['US', 'IN', 'JP', 'KR', 'CN', 'FR', 'ES', 'IT', 'DE', 'GB', 'BR', 'MX', 'RU', 'TR'];
  
  const detectUserCountry = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      console.log('IP detection result:', data);
      
      if (data.country_code && countryToLanguageMap[data.country_code]) {
        console.log(`Setting country based on IP: ${data.country_code}`);
        return data.country_code;
      }
    } catch (error) {
      console.error('Error detecting country:', error);
    }
    
    return 'IN';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        
        const countriesWithFlags = commonCountries.map(country => ({
          ...country,
          flag: getCountryFlag(country.iso_3166_1)
        }));

        setCountries(countriesWithFlags);

        if (!initialCountrySet) {
          const detectedCountry = await detectUserCountry();
          onSelect(detectedCountry);
          setInitialCountrySet(true);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, [initialCountrySet, onSelect]);

  const filteredCountries = countries
    .filter(country => {
      const hasMapping = Object.keys(countryToLanguageMap).includes(country.iso_3166_1);
      const matchesSearch = !searchQuery || 
        country.english_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.iso_3166_1.toLowerCase().includes(searchQuery.toLowerCase());
      return hasMapping && matchesSearch;
    });

  const getDisplayedCountries = () => {
    if (searchQuery) {
      return filteredCountries;
    }
    
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
      <div className={`px-4 py-2 bg-white/10 rounded-lg border border-white/20 ${className}`}>
        <LoadingSpinner size="sm" variant="white" />
      </div>
    );
  }

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[999999] bg-black/50 backdrop-blur-sm" 
          onClick={() => setIsOpen(false)} 
        />
      )}
      
      <div className={`relative ${className}`} ref={dropdownRef}>
        {/* Selected country button */}
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-between w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all duration-200 min-h-[50px] backdrop-blur-sm"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3">
            {selectedCountryObj ? (
              <>
                <span className="text-xl">{selectedCountryObj.flag}</span>
                <span className="font-medium">{selectedCountryObj.english_name}</span>
              </>
            ) : (
              <>
                <Globe className="h-5 w-5" />
                <span className="font-medium">Select Country</span>
              </>
            )}
          </div>
          <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 z-[9999999] bg-aura-dark border border-aura-purple/30 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
            {/* Search input */}
            <div className="p-4 border-b border-aura-purple/20">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-aura-purple/50 transition-all placeholder:text-white/50"
                />
              </div>
            </div>

            {/* Countries list */}
            <div className="max-h-80 overflow-y-auto">
              {displayedCountries.length > 0 ? (
                displayedCountries.map((country) => (
                  <button
                    key={country.iso_3166_1}
                    onClick={() => handleCountrySelect(country.iso_3166_1)}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-aura-purple/20 transition-colors ${
                      selectedCountry === country.iso_3166_1
                        ? 'bg-aura-purple text-white'
                        : 'text-white'
                    }`}
                  >
                    <span className="text-xl">{country.flag}</span>
                    <span className="font-medium">{country.english_name}</span>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-white/60">
                  No countries found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CountrySelector;
