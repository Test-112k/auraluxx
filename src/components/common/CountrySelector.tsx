
import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Globe, X, MapPin } from 'lucide-react';
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

  const handleCountrySelect = (countryCode: string) => {
    onSelect(countryCode);
    setIsOpen(false);
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 px-4 py-3 bg-aura-dark/80 border border-aura-purple/30 rounded-lg ${className}`}>
        <LoadingSpinner size="sm" variant="white" />
        <span className="text-white/70 text-sm">Detecting location...</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Selected country button - improved visibility */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-aura-purple/20 to-aura-darkpurple/20 hover:from-aura-purple/30 hover:to-aura-darkpurple/30 text-white rounded-lg border border-aura-purple/50 transition-all duration-200 min-h-[56px] backdrop-blur-sm shadow-lg group"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-aura-purple group-hover:text-white transition-colors" />
          {selectedCountryObj ? (
            <>
              <span className="text-2xl">{selectedCountryObj.flag}</span>
              <span className="font-semibold text-lg">{selectedCountryObj.english_name}</span>
            </>
          ) : (
            <>
              <Globe className="h-5 w-5" />
              <span className="font-semibold">Select Your Country</span>
            </>
          )}
        </div>
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Modal - Enhanced with higher z-index */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Modal - Higher z-index to appear above everything */}
          <div className="fixed inset-4 z-[9999] flex items-center justify-center">
            <div className="bg-aura-dark/95 backdrop-blur-md border border-aura-purple/40 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-aura-purple/30 bg-gradient-to-r from-aura-purple/10 to-aura-darkpurple/10">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-aura-purple" />
                  <h3 className="text-xl font-bold text-white">Select Your Country</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 bg-aura-dark/50">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aura-purple h-5 w-5" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search countries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-4 pl-12 pr-4 bg-aura-dark/80 border border-aura-purple/40 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-aura-purple transition-all placeholder:text-white/50 text-lg"
                  />
                </div>
              </div>

              {/* Countries list */}
              <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-aura-dark scrollbar-thumb-aura-purple">
                {displayedCountries.length > 0 ? (
                  <>
                    {!searchQuery && (
                      <div className="px-4 py-2 text-aura-purple text-sm font-medium bg-aura-dark/30">
                        Popular Countries
                      </div>
                    )}
                    {displayedCountries.map((country) => (
                      <button
                        key={country.iso_3166_1}
                        onClick={() => handleCountrySelect(country.iso_3166_1)}
                        className={`w-full flex items-center gap-4 p-4 hover:bg-aura-purple/20 transition-all duration-200 text-left border-b border-white/5 last:border-b-0 ${
                          selectedCountry === country.iso_3166_1
                            ? 'bg-aura-purple/30 text-white border-aura-purple/50'
                            : 'text-white hover:text-white'
                        }`}
                      >
                        <span className="text-2xl">{country.flag}</span>
                        <div className="flex-1">
                          <span className="font-semibold text-lg">{country.english_name}</span>
                          {country.native_name !== country.english_name && (
                            <div className="text-white/60 text-sm">{country.native_name}</div>
                          )}
                        </div>
                        {selectedCountry === country.iso_3166_1 && (
                          <div className="w-3 h-3 bg-aura-purple rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="p-8 text-center text-white/60">
                    <Globe className="h-12 w-12 mx-auto mb-3 text-white/30" />
                    <p className="text-lg">No countries found</p>
                    <p className="text-sm">Try adjusting your search</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CountrySelector;
