
import { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MediaSlider from '@/components/common/MediaSlider';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import MediaCard from '@/components/common/MediaCard';
import { getAnimeContent, getTrendingAnime, getTopRatedAnime, getRecentAnime } from '@/services/tmdbApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Ad from '@/components/ads/Ad';
import { useAds } from '@/contexts/AdContext';

const AnimePage = () => {
  const [animeContent, setAnimeContent] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const { isAdEnabled } = useAds();

  // Filter function to ensure only anime content is shown
  const filterAnimeContent = (results: any[]) => {
    return results.filter(item => 
      // Filter for Japanese animation
      (item.original_language === 'ja' && 
      // Make sure it has a poster
      item.poster_path)
    );
  };

  // Fetch anime data
  const fetchAnimeData = useCallback(async () => {
    try {
      setInitialLoading(true);
      const popularData = await getAnimeContent(1);
      
      if (popularData?.results) {
        const filtered = filterAnimeContent(popularData.results);
        setAnimeContent(filtered);
        setTotalPages(popularData.total_pages);
      }
    } catch (error) {
      console.error('Error fetching anime data:', error);
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  }, []);

  // Load more anime for infinite scrolling
  const loadMoreAnime = async () => {
    if (page >= totalPages) return false;
    
    const nextPage = page + 1;
    setLoading(true);
    
    try {
      const data = await getAnimeContent(nextPage);
      
      if (data?.results) {
        const filteredResults = filterAnimeContent(data.results);
        setAnimeContent(prev => [...prev, ...filteredResults]);
        setPage(nextPage);
      }
      return true;
    } catch (error) {
      console.error('Error loading more anime:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimeData();
  }, [fetchAnimeData]);

  return (
    <MainLayout>
      {initialLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" variant="purple" text="Loading anime content..." />
        </div>
      ) : (
        <div className="auraluxx-container py-24">
          <h1 className="text-3xl font-bold text-white mb-8">Anime</h1>
          
          {/* Banner ad placement */}
          {isAdEnabled && (
            <div className="flex justify-center my-6 bg-white/5 p-2 rounded-lg">
              <Ad size="728x90" className="hidden md:block" />
              <Ad size="320x50" className="md:hidden" />
            </div>
          )}
          
          {/* Featured Anime Sliders */}
          <div className="mb-8">
            <MediaSlider 
              title="Trending Anime" 
              items={animeContent.slice(0, 10)}
              loading={initialLoading}
              mediaType="tv"
            />
            
            <MediaSlider 
              title="Recently Released" 
              items={animeContent.slice(10, 20)}
              loading={initialLoading}
              mediaType="tv"
            />
          </div>

          {/* Banner ad between sections */}
          {isAdEnabled && (
            <div className="flex justify-center my-6 bg-white/5 p-2 rounded-lg">
              <Ad size="468x60" />
            </div>
          )}

          {/* Main Anime Grid with Infinite Scrolling */}
          <h2 className="text-xl font-bold text-white mb-4">All Anime</h2>
          
          {initialLoading ? (
            <div className="flex justify-center my-12">
              <LoadingSpinner size="lg" variant="purple" text="Loading anime..." />
            </div>
          ) : animeContent.length > 0 ? (
            <InfiniteScroll
              loadMore={loadMoreAnime}
              loading={loading}
              hasMore={page < totalPages}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {animeContent.map((item) => (
                  <MediaCard
                    key={item.id}
                    id={item.id}
                    title={item.name || item.title}
                    type="tv"
                    posterPath={item.poster_path}
                    releaseDate={item.first_air_date || item.release_date}
                    voteAverage={item.vote_average}
                  />
                ))}
              </div>
              
              {loading && (
                <div className="flex justify-center my-8">
                  <LoadingSpinner size="md" text="Loading more..." />
                </div>
              )}
            </InfiniteScroll>
          ) : (
            <div className="flex justify-center items-center py-12 text-white/60">
              No anime found
            </div>
          )}
          
          {/* Bottom banner ad */}
          {isAdEnabled && (
            <div className="flex justify-center mt-8 bg-white/5 p-2 rounded-lg">
              <Ad size="728x90" className="hidden md:block" />
              <Ad size="320x50" className="md:hidden" />
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
};

export default AnimePage;
