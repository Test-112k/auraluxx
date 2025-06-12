
import { useState, useEffect } from 'react';
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
  mediaType?: 'movie' | 'tv';
}

interface Genre {
  id: number;
  name: string;
}

const CategoryFilterBar = ({ 
  onGenreChange, 
  onYearChange, 
  onLanguageChange,
  selectedGenre = '',
  selectedYear = '',
  selectedLanguage = '',
  mediaType = 'movie'
}: CategoryFilterBarProps) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch genres from TMDB API
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/${mediaType}/list?api_key=54d82ce065f64ee04381a81d3bcc2455&language=en-US`
        );
        const data = await response.json();
        
        if (data.genres) {
          setGenres([{ id: 0, name: 'All Genres' }, ...data.genres]);
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
        // Fallback to static genres if API fails
        setGenres([
          { id: 0, name: 'All Genres' },
          { id: 28, name: 'Action' },
          { id: 12, name: 'Adventure' },
          { id: 16, name: 'Animation' },
          { id: 35, name: 'Comedy' },
          { id: 80, name: 'Crime' },
          { id: 18, name: 'Drama' },
          { id: 14, name: 'Fantasy' },
          { id: 27, name: 'Horror' },
          { id: 9648, name: 'Mystery' },
          { id: 10749, name: 'Romance' },
          { id: 878, name: 'Science Fiction' },
          { id: 53, name: 'Thriller' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, [mediaType]);

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

  const getSelectedGenreLabel = () => {
    const genre = genres.find(g => g.id.toString() === selectedGenre);
    return genre?.name || 'All Genres';
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
    <div className="sticky top-16 z-[150] bg-aura-dark/95 backdrop-blur-sm border-b border-white/10 py-4">
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
                disabled={loading}
              >
                {loading ? 'Loading...' : getSelectedGenreLabel()}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="bg-aura-dark/95 backdrop-blur-sm border-white/10 text-white max-h-60 overflow-y-auto z-[160]"
              align="start"
            >
              {genres.map((genre) => (
                <DropdownMenuItem
                  key={genre.id}
                  onClick={() => onGenreChange?.(genre.id === 0 ? '' : genre.id.toString())}
                  className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                >
                  {genre.name}
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
              className="bg-aura-dark/95 backdrop-blur-sm border-white/10 text-white max-h-60 overflow-y-auto z-[160]"
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
              className="bg-aura-dark/95 backdrop-blur-sm border-white/10 text-white max-h-60 overflow-y-auto z-[160]"
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
