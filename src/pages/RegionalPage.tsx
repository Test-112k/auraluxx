
import { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MediaCard from '@/components/common/MediaCard';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import CountrySelector from '@/components/common/CountrySelector';
import { getRegionalContent, countryToLanguageMap } from '@/services/tmdbApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const RegionalPage = () => {
  const [regionalContent, setRegionalContent] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('IN'); // Default to India
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegionalContent = useCallback(async (reset = false) => {
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
    setSelectedCountry(countryCode);
    setPage(1);
    setRegionalContent([]);
    setTotalPages(0);
  };

  useEffect(() => {
    fetchRegionalContent(true);
  }, [selectedCountry]);

  return (
    <MainLayout>
      <div className="auraluxx-container py-24">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">Regional Content</h1>
          <CountrySelector 
            selectedCountry={selectedCountry} 
            onSelect={handleCountryChange} 
          />
        </div>
        
        {loading && regionalContent.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" text="Loading regional content..." />
          </div>
        ) : regionalContent.length > 0 ? (
          <InfiniteScroll
            loadMore={loadMore}
            loading={loading}
            hasMore={page <= totalPages}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-white/60">
              <p className="mb-2">{error || 'No content available for this region.'}</p>
              <p>Please try another country.</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default RegionalPage;
