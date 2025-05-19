
import { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MediaCard from '@/components/common/MediaCard';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import CountrySelector from '@/components/common/CountrySelector';
import { getRegionalContent, countryToLanguageMap } from '@/services/tmdbApi';

const RegionalPage = () => {
  const [regionalContent, setRegionalContent] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('IN'); // Default to India
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchRegionalContent = useCallback(async (reset = false) => {
    setLoading(true);
    const language = countryToLanguageMap[selectedCountry];
    const currentPage = reset ? 1 : page;
    
    if (!language) {
      setLoading(false);
      return;
    }
    
    try {
      const data = await getRegionalContent(language, currentPage);
      
      if (data?.results) {
        if (reset) {
          setRegionalContent(data.results);
          setPage(1);
        } else {
          setRegionalContent(prev => [...prev, ...data.results]);
          setPage(currentPage + 1);
        }
        
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      console.error('Error fetching regional content:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCountry, page]);

  const loadMore = async () => {
    if (page < totalPages) {
      await fetchRegionalContent();
      return true;
    }
    return false;
  };

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array(18).fill(0).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-[2/3] bg-white/5"></div>
                <div className="p-2">
                  <div className="h-4 bg-white/5 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-white/5 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : regionalContent.length > 0 ? (
          <InfiniteScroll
            loadMore={loadMore}
            loading={loading}
            hasMore={page < totalPages}
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
          </InfiniteScroll>
        ) : (
          <div className="flex items-center justify-center h-64 text-center">
            <div className="text-white/60">
              <p className="mb-2">No content available for this region.</p>
              <p>Please try another country.</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default RegionalPage;
