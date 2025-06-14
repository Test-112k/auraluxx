
import { useState, useEffect } from 'react';
import { Check, ChevronDown, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { getCountries, countryToLanguagesMap } from '@/services/tmdbApi';

interface Country {
  iso_3166_1: string;
  english_name: string;
  native_name?: string;
}

// Helper to get flag URL from country code
const getFlagUrl = (countryCode: string) => 
  `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;

const ImprovedCountrySelector = ({ selectedCountry, onCountryChange, className }: {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await getCountries();
        let supportedCountries = [];
        if (data && Array.isArray(data)) {
          supportedCountries = data
            .filter((country: Country) => countryToLanguagesMap[country.iso_3166_1])
            .sort((a: Country, b: Country) => a.english_name.localeCompare(b.english_name));
        }
        if (!supportedCountries.find(c => c.iso_3166_1 === 'PK')) {
          supportedCountries.unshift({
            iso_3166_1: 'PK',
            english_name: 'Pakistan',
            native_name: 'پاکستان'
          });
        }
        setCountries(supportedCountries);
      } catch (error) {
        console.error('Error loading countries:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCountries();
  }, []);

  const selectedCountryData = countries.find(country => country.iso_3166_1 === selectedCountry);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between bg-white/15 border-white/15 text-white shadow-md rounded-lg min-w-[220px] h-12 hover:bg-white/25 transition-all duration-150 font-medium focus:ring-2 focus:ring-aura-purple",
            className
          )}
        >
          <div className="flex items-center gap-2">
            {selectedCountryData ? (
              <img src={getFlagUrl(selectedCountryData.iso_3166_1)} alt="" className="w-5 h-5 rounded-sm object-cover mr-2 shadow" />
            ) : (
              <Flag size={18} className="mr-2 opacity-60" />
            )}
            {selectedCountryData ? (
              <span className="truncate">{selectedCountryData.english_name}</span>
            ) : (
              <span className="text-white/70">Select country...</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[310px] p-0 bg-aura-darkpurple/95 rounded-xl border-white/15 border shadow-2xl z-50 animate-scale-in" align="start">
        <Command className="bg-transparent">
          <CommandInput
            placeholder="Search countries..."
            className="border-none bg-transparent text-white placeholder:text-white/40 h-10 px-3"
          />
          <CommandList className="max-h-[350px] overflow-y-auto">
            <CommandEmpty className="py-6 text-center text-white/70">
              {loading ? "Loading countries..." : "No countries found."}
            </CommandEmpty>
            {!loading && (
              <CommandGroup>
                {countries.map((country) => (
                  <CommandItem
                    key={country.iso_3166_1}
                    value={`${country.english_name} ${country.iso_3166_1}`}
                    onSelect={() => {
                      onCountryChange(country.iso_3166_1);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between text-white hover:bg-white/10 cursor-pointer rounded transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={getFlagUrl(country.iso_3166_1)}
                        alt=""
                        className="w-5 h-5 rounded-sm object-cover border border-white/10 shadow-sm"
                        onError={e => {
                          (e.target as HTMLImageElement).src = 'https://flagcdn.com/w20/un.png';
                        }}
                      />
                      <div className="flex flex-col ml-2">
                        <span className="font-medium">{country.english_name}</span>
                        {country.native_name && country.native_name !== country.english_name && (
                          <span className="text-sm text-white/60">{country.native_name}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/40 font-mono">{country.iso_3166_1}</span>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedCountry === country.iso_3166_1 ? "opacity-100 text-aura-accent" : "opacity-0"
                        )}
                      />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ImprovedCountrySelector;
