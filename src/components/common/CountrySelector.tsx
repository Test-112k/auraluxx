
import { useState, useEffect } from 'react';
import { Check, ChevronDown, Globe, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Enhanced country list with flags and auto-detection support
const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸', languages: ['en'] },
  { code: 'IN', name: 'India', flag: '🇮🇳', languages: ['hi', 'en'] },
  { code: 'CN', name: 'China', flag: '🇨🇳', languages: ['zh'] },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', languages: ['id'] },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', languages: ['ur', 'en'] },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', languages: ['bn'] },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', languages: ['en'] },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', languages: ['pt'] },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', languages: ['ru'] },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', languages: ['es'] },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', languages: ['ja'] },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', languages: ['en', 'tl'] },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', languages: ['vi'] },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', languages: ['am'] },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', languages: ['ar'] },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', languages: ['tr'] },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', languages: ['de'] },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', languages: ['th'] },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', languages: ['en'] },
  { code: 'FR', name: 'France', flag: '🇫🇷', languages: ['fr'] },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', languages: ['it'] },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', languages: ['en', 'af'] },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', languages: ['ko'] },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', languages: ['es'] },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', languages: ['es'] },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', languages: ['uk'] },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', languages: ['uz'] },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', languages: ['ms'] },
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫', languages: ['ps', 'fa'] },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', languages: ['es'] },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', languages: ['ar'] },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', languages: ['en', 'fr'] },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', languages: ['en'] },
];

interface CountrySelectorProps {
  selectedCountry: string;
  onSelect: (countryCode: string) => void;
  className?: string;
}

const CountrySelector = ({ selectedCountry, onSelect, className }: CountrySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [autoDetectedCountry, setAutoDetectedCountry] = useState<string>('');
  const [isDetecting, setIsDetecting] = useState(false);

  // Auto-detect user's location
  useEffect(() => {
    const detectLocation = async () => {
      setIsDetecting(true);
      try {
        // Try to get location from IP
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_code) {
          const detectedCountry = countries.find(c => c.code === data.country_code.toUpperCase());
          if (detectedCountry && !selectedCountry) {
            setAutoDetectedCountry(detectedCountry.code);
            onSelect(detectedCountry.code);
          }
        }
      } catch (error) {
        console.log('Location detection failed, using default');
      } finally {
        setIsDetecting(false);
      }
    };

    detectLocation();
  }, []);

  const selectedCountryData = countries.find(country => country.code === selectedCountry);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between bg-white/10 border-white/10 text-white hover:bg-white/20 min-w-[200px] h-12",
            className
          )}
        >
          <div className="flex items-center gap-3">
            {isDetecting ? (
              <div className="w-5 h-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Globe size={18} />
            )}
            {selectedCountryData ? (
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedCountryData.flag}</span>
                <span className="truncate font-medium">{selectedCountryData.name}</span>
                {autoDetectedCountry === selectedCountryData.code && (
                  <MapPin size={14} className="text-aura-accent" />
                )}
              </div>
            ) : (
              <span className="text-white/70">
                {isDetecting ? 'Detecting location...' : 'Select your country...'}
              </span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[400px] p-0 bg-aura-darkpurple/95 backdrop-blur-md border-white/20 shadow-2xl z-[10000]" 
        align="start"
        side="bottom"
        sideOffset={8}
      >
        <Command className="bg-transparent">
          <CommandInput 
            placeholder="Search countries..." 
            className="border-none bg-transparent text-white placeholder:text-white/50 h-12 px-4"
          />
          <CommandList className="max-h-[320px] overflow-y-auto">
            <CommandEmpty className="py-8 text-center text-white/70">
              No countries found.
            </CommandEmpty>
            <CommandGroup className="p-2">
              {countries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={`${country.name} ${country.code}`}
                  onSelect={() => {
                    onSelect(country.code);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between text-white hover:bg-white/10 cursor-pointer rounded-lg p-3 my-1"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-medium text-base">{country.name}</span>
                      <span className="text-sm text-white/60">
                        {country.languages.join(', ')}
                      </span>
                    </div>
                    {autoDetectedCountry === country.code && (
                      <div className="flex items-center gap-1 text-xs text-aura-accent bg-aura-accent/20 px-2 py-1 rounded-full">
                        <MapPin size={12} />
                        Detected
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40 font-mono bg-white/10 px-2 py-1 rounded">
                      {country.code}
                    </span>
                    <Check
                      className={cn(
                        "h-4 w-4 text-aura-accent",
                        selectedCountry === country.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CountrySelector;
