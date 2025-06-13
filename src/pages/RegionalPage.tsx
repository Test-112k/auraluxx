
import { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MediaCard from '@/components/common/MediaCard';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import CountrySelector from '@/components/common/CountrySelector';
import CategoryFilterBar from '@/components/common/CategoryFilterBar';
import { getRegionalContent, countryToLanguagesMap } from '@/services/tmdbApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const RegionalPage = () => {
  const [regionalContent, setRegionalContent] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegionalContent = useCallback(async (reset = false) => {
    if (!selectedCountry) return;
    
    setLoading(true);
    setError(null);
    const currentPage = reset ? 1 : page;
    
    // Get the primary language or selected language for the country
    const countryData = countryToLanguagesMap[selectedCountry];
    if (!countryData) {
      setLoading(false);
      setError('Language mapping not found for selected country');
      return;
    }
    
    // Use selected language or default to primary language
    const language = selectedLanguage || countryData.primary;
    
    try {
      // Prepare filters for enhanced API call
      const filters: any = {};
      
      if (selectedGenre) {
        filters.with_genres = selectedGenre;
      }
      
      if (selectedYear) {
        filters.year = selectedYear; // Will be converted to date range in API
      }
      
      const data = await getRegionalContent(language, currentPage, filters);
      
      if (data?.results) {
        // Filter out results without poster images for cleaner UI
        const filteredResults = data.results.filter(item => item.poster_path);
        
        if (reset) {
          setRegionalContent(filteredResults);
          setPage(2);
        } else {
          setRegionalContent(prev => [...prev, ...filteredResults]);
          setPage(currentPage + 1);
        }
        
        setTotalPages(data.total_pages);
      } else {
        if (reset) {
          setRegionalContent([]);
        }
        setError('No content available for this region with current filters');
      }
    } catch (error) {
      console.error('Error fetching regional content:', error);
      setError('Failed to load content for this region');
    } finally {
      setLoading(false);
    }
  }, [selectedCountry, selectedGenre, selectedYear, selectedLanguage, page]);

  const loadMore = async () => {
    if (page <= totalPages) {
      await fetchRegionalContent();
      return true;
    }
    return false;
  };

  const handleCountryChange = (countryCode: string) => {
    if (countryCode === selectedCountry) return;
    console.log('Country changed to:', countryCode);
    setSelectedCountry(countryCode);
    setSelectedLanguage(''); // Reset language when country changes
    setPage(1);
    setRegionalContent([]);
    setTotalPages(0);
  };

  const handleFilterChange = () => {
    setPage(1);
    setRegionalContent([]);
    setTotalPages(0);
  };

  useEffect(() => {
    if (selectedCountry) {
      console.log('Fetching content for country:', selectedCountry, 'with filters:', {
        genre: selectedGenre,
        year: selectedYear,
        language: selectedLanguage
      });
      fetchRegionalContent(true);
    }
  }, [selectedCountry, selectedGenre, selectedYear, selectedLanguage]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-aura-purple/20 to-aura-darkpurple/20 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-aura-purple/30 shadow-xl">
          <div className="flex flex-col space-y-8">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-aura-purple bg-clip-text text-transparent">
                Regional Content
              </h1>
              <p className="text-white/80 text-lg md:text-xl leading-relaxed">
                Discover movies and shows from different regions around the world in their local languages
              </p>
            </div>
            
            {/* Country Selector */}
            <div className="flex flex-col space-y-4">
              <p className="text-white font-semibold text-xl">Choose Your Region:</p>
              <CountrySelector 
                selectedCountry={selectedCountry} 
                onSelect={handleCountryChange} 
                className="w-full max-w-2xl"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        {selectedCountry && (
          <CategoryFilterBar
            onGenreChange={(genre) => {
              setSelectedGenre(genre);
              handleFilterChange();
            }}
            onYearChange={(year) => {
              setSelectedYear(year);
              handleFilterChange();
            }}
            onLanguageChange={(language) => {
              setSelectedLanguage(language);
              handleFilterChange();
            }}
            selectedGenre={selectedGenre}
            selectedYear={selectedYear}
            selectedLanguage={selectedLanguage}
            selectedCountry={selectedCountry}
            mediaType="movie"
          />
        )}
        
        {/* Content Section */}
        <div className="relative">
          {loading && regionalContent.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" text="Loading regional content..." />
            </div>
          ) : regionalContent.length > 0 ? (
            <InfiniteScroll
              loadMore={loadMore}
              loading={loading}
              hasMore={page <= totalPages}
              threshold={1000}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {regionalContent.map((item) => (
                  <MediaCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    type="movie"
                    posterPath={item.poster_path}
                    releaseDate={item.release_date}
                    voteAverage={item.vote_average}
                  />
                ))}
              </div>
              
              {loading && regionalContent.length > 0 && (
                <div className="flex justify-center my-8">
                  <LoadingSpinner size="md" text="Loading more..." />
                </div>
              )}
            </InfiniteScroll>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-gradient-to-r from-aura-purple/10 to-aura-darkpurple/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-aura-purple/20 max-w-md">
                <div className="text-white/80 space-y-4">
                  <h3 className="text-2xl font-bold text-white">No Content Available</h3>
                  <p className="text-lg">{error || 'No content available for this region with current filters.'}</p>
                  <p className="text-sm">Please try selecting another country or adjusting your filters.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default RegionalPage;
