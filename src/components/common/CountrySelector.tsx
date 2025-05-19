
import { useState, useEffect } from 'react';
import { countryToLanguageMap } from '@/services/tmdbApi';

interface Country {
  iso_3166_1: string;  // Country code
  english_name: string; // Country name
  native_name: string;  // Native name (if available)
}

interface CountrySelectorProps {
  selectedCountry: string;
  onSelect: (countryCode: string) => void;
  className?: string;
}

const CountrySelector = ({ selectedCountry, onSelect, className = '' }: CountrySelectorProps) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Popular countries to show at the top
  const popularCountries = ['US', 'IN', 'JP', 'KR', 'FR', 'ES', 'IT', 'DE', 'GB', 'BR', 'MX', 'TR', 'RU', 'CN'];

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        // For simplicity, we'll use a hardcoded list of most common countries with streaming content
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
          { iso_3166_1: 'NG', english_name: 'Nigeria', native_name: 'Nigeria' },
          { iso_3166_1: 'EG', english_name: 'Egypt', native_name: 'مصر' },
        ];
        
        // Sort by English name
        setCountries(commonCountries.sort((a, b) => a.english_name.localeCompare(b.english_name)));
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Filter only countries that have language mappings
  const availableCountries = countries.filter(country => 
    Object.keys(countryToLanguageMap).includes(country.iso_3166_1)
  );

  // Sort countries to put popular ones first
  const sortedCountries = [...availableCountries].sort((a, b) => {
    const aIndex = popularCountries.indexOf(a.iso_3166_1);
    const bIndex = popularCountries.indexOf(b.iso_3166_1);
    
    if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
    if (aIndex >= 0) return -1;
    if (bIndex >= 0) return 1;
    
    return a.english_name.localeCompare(b.english_name);
  });

  if (isLoading) {
    return (
      <div className={`px-4 py-2 bg-white/5 rounded-md ${className}`}>
        <div className="h-6 bg-white/10 animate-pulse rounded w-20"></div>
      </div>
    );
  }

  return (
    <select
      value={selectedCountry}
      onChange={(e) => onSelect(e.target.value)}
      className={`px-4 py-2 bg-white/5 rounded-md border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-aura-purple ${className}`}
    >
      {sortedCountries.map((country) => (
        <option key={country.iso_3166_1} value={country.iso_3166_1}>
          {country.english_name}
        </option>
      ))}
    </select>
  );
};

export default CountrySelector;
