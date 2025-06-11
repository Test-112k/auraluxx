
import { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CategoryFilterBarProps {
  onGenreChange?: (genre: string) => void;
  onYearChange?: (year: string) => void;
  onLanguageChange?: (language: string) => void;
  selectedGenre?: string;
  selectedYear?: string;
  selectedLanguage?: string;
}

const genres = [
  { label: 'All Genres', value: '' },
  { label: 'Action', value: '28' },
  { label: 'Adventure', value: '12' },
  { label: 'Animation', value: '16' },
  { label: 'Comedy', value: '35' },
  { label: 'Crime', value: '80' },
  { label: 'Documentary', value: '99' },
  { label: 'Drama', value: '18' },
  { label: 'Family', value: '10751' },
  { label: 'Fantasy', value: '14' },
  { label: 'Horror', value: '27' },
  { label: 'Mystery', value: '9648' },
  { label: 'Romance', value: '10749' },
  { label: 'Sci-Fi', value: '878' },
  { label: 'Thriller', value: '53' },
  { label: 'War', value: '10752' },
  { label: 'Western', value: '37' },
];

const years = [
  { label: 'All Years', value: '' },
  ...Array.from({ length: 25 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { label: year.toString(), value: year.toString() };
  }),
];

const languages = [
  { label: 'All Languages', value: '' },
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Italian', value: 'it' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Hindi', value: 'hi' },
];

const CategoryFilterBar = ({ 
  onGenreChange, 
  onYearChange, 
  onLanguageChange,
  selectedGenre = '',
  selectedYear = '',
  selectedLanguage = ''
}: CategoryFilterBarProps) => {
  const getSelectedGenreLabel = () => {
    const genre = genres.find(g => g.value === selectedGenre);
    return genre?.label || 'All Genres';
  };

  const getSelectedYearLabel = () => {
    const year = years.find(y => y.value === selectedYear);
    return year?.label || 'All Years';
  };

  const getSelectedLanguageLabel = () => {
    const language = languages.find(l => l.value === selectedLanguage);
    return language?.label || 'All Languages';
  };

  return (
    <div className="sticky top-20 z-40 bg-aura-dark/95 backdrop-blur-sm border-b border-white/10 py-4">
      <div className="auraluxx-container">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-white/70">
            <Filter size={16} />
            <span className="text-sm font-medium">Filter by:</span>
          </div>

          {/* Genre Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-white/5 hover:bg-white/10 border-white/10 text-white text-sm"
              >
                {getSelectedGenreLabel()}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="bg-aura-dark/95 backdrop-blur-sm border-white/10 text-white max-h-60 overflow-y-auto"
              align="start"
            >
              {genres.map((genre) => (
                <DropdownMenuItem
                  key={genre.value}
                  onClick={() => onGenreChange?.(genre.value)}
                  className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                >
                  {genre.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Year Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-white/5 hover:bg-white/10 border-white/10 text-white text-sm"
              >
                {getSelectedYearLabel()}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="bg-aura-dark/95 backdrop-blur-sm border-white/10 text-white max-h-60 overflow-y-auto"
              align="start"
            >
              {years.map((year) => (
                <DropdownMenuItem
                  key={year.value}
                  onClick={() => onYearChange?.(year.value)}
                  className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                >
                  {year.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-white/5 hover:bg-white/10 border-white/10 text-white text-sm"
              >
                {getSelectedLanguageLabel()}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="bg-aura-dark/95 backdrop-blur-sm border-white/10 text-white max-h-60 overflow-y-auto"
              align="start"
            >
              {languages.map((language) => (
                <DropdownMenuItem
                  key={language.value}
                  onClick={() => onLanguageChange?.(language.value)}
                  className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                >
                  {language.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters */}
          {(selectedGenre || selectedYear || selectedLanguage) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onGenreChange?.('');
                onYearChange?.('');
                onLanguageChange?.('');
              }}
              className="text-aura-purple hover:text-aura-purple/80 hover:bg-white/5 text-sm"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilterBar;
