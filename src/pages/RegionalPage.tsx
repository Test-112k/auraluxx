
import { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MediaCard from '@/components/common/MediaCard';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import CountrySelector from '@/components/common/CountrySelector';
import { getRegionalContent, countryToLanguageMap } from '@/services/tmdbApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const RegionalPage = () => {
  const [regionalContent, setRegionalContent] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState(''); // Start empty, will be set by IP detection
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegionalContent = useCallback(async (reset = false) => {
    if (!selectedCountry) return; // Don't fetch if no country selected yet
    
    setLoading(true);
    setError(null);
    const language = countryToLanguageMap[selectedCountry];
    const currentPage = reset ? 1 : page;
    
    if (!language) {
      setLoading(false);
      setError('Language mapping not found for selected country');
      return;
    }
    
    try {
      const data = await getRegionalContent(language, currentPage);
      
      if (data?.results) {
        if (reset) {
          setRegionalContent(data.results);
          setPage(2); // Set to 2 for next load
        } else {
          setRegionalContent(prev => [...prev, ...data.results]);
          setPage(currentPage + 1);
        }
        
        setTotalPages(data.total_pages);
      } else {
        if (reset) {
          setRegionalContent([]);
        }
        setError('No content available for this region');
      }
    } catch (error) {
      console.error('Error fetching regional content:', error);
      setError('Failed to load content for this region');
    } finally {
      setLoading(false);
    }
  }, [selectedCountry, page]);

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
    setPage(1);
    setRegionalContent([]);
    setTotalPages(0);
  };

  useEffect(() => {
    if (selectedCountry) {
      console.log('Fetching content for country:', selectedCountry);
      fetchRegionalContent(true);
    }
  }, [selectedCountry]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section - Better visibility */}
        <div className="bg-aura-dark/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-aura-purple/20">
          <div className="flex flex-col space-y-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Regional Content</h1>
              <p className="text-white/80 text-base md:text-lg">
                Discover movies and shows from different regions around the world
              </p>
            </div>
            
            {/* Country Selector - Better positioned */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-shrink-0">
                <p className="text-white font-medium text-lg">Select Your Country:</p>
              </div>
              <div className="w-full md:w-80">
                <CountrySelector 
                  selectedCountry={selectedCountry} 
                  onSelect={handleCountryChange} 
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
        
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
              <div className="bg-aura-dark/50 backdrop-blur-sm rounded-lg p-8 text-center border border-aura-purple/20 max-w-md">
                <div className="text-white/80 space-y-3">
                  <h3 className="text-xl font-semibold text-white">No Content Available</h3>
                  <p className="text-base">{error || 'No content available for this region.'}</p>
                  <p className="text-sm">Please try selecting another country from the dropdown above.</p>
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
