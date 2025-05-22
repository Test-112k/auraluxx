
import { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MediaSlider from '@/components/common/MediaSlider';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import MediaCard from '@/components/common/MediaCard';
import { getAnimeContent, getTrendingAnime, getTopRatedAnime, getRecentAnime } from '@/services/tmdbApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useSearchParams } from 'react-router-dom';

const filterOptions = [
  { label: 'Popular', value: 'popular' },
  { label: 'Trending', value: 'trending' },
  { label: 'Top Rated', value: 'top_rated' },
  { label: 'New Releases', value: 'recent' }
];

const AnimePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [animeContent, setAnimeContent] = useState<any[]>([]);
  const [trendingAnime, setTrendingAnime] = useState<any[]>([]);
  const [recentAnime, setRecentAnime] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const activeFilter = searchParams.get('filter') || 'popular';

  // Improved filter function for anime content
  const filterAnimeContent = useCallback((results: any[]) => {
    // First filter for basic requirements (Japanese animation with poster)
    const basicFiltered = results.filter(item => 
      item.original_language === 'ja' && 
      item.poster_path
    );
    
    // Apply additional filter for recent content if needed
    if (activeFilter === 'recent') {
      const currentYear = new Date().getFullYear();
      // Only include anime from the current year or last year
      return basicFiltered.filter(item => {
        const releaseDate = item.first_air_date || item.release_date;
        if (!releaseDate) return false;
        
        const releaseYear = parseInt(releaseDate.split('-')[0]);
        return releaseYear >= currentYear - 1;
      });
    }
    
    return basicFiltered;
  }, [activeFilter]);

  // Fetch anime content based on the active filter
  const fetchAnimeData = useCallback(async (reset = true) => {
    try {
      setLoading(true);
      
      let data;
      const currentPage = reset ? 1 : page;
      
      switch (activeFilter) {
        case 'trending':
          data = await getTrendingAnime(currentPage);
          break;
        case 'top_rated':
          data = await getTopRatedAnime(currentPage);
          break;
        case 'recent':
          data = await getRecentAnime(currentPage);
          break;
        case 'popular':
        default:
          data = await getAnimeContent(currentPage);
          break;
      }
      
      if (data?.results) {
        const filtered = filterAnimeContent(data.results);
        
        if (reset) {
          setAnimeContent(filtered);
          setPage(1);
        } else {
          setAnimeContent(prev => [...prev, ...filtered]);
          setPage(currentPage + 1);
        }
        
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      console.error('Error fetching anime data:', error);
    } finally {
      setLoading(false);
      if (initialLoading) setInitialLoading(false);
    }
  }, [activeFilter, page, initialLoading, filterAnimeContent]);
  
  // Load featured content separately (trending and recent)
  const loadFeaturedContent = useCallback(async () => {
    try {
      // Get trending anime for the slider
      const trendingData = await getTrendingAnime(1);
      if (trendingData?.results) {
        const filteredTrending = trendingData.results
          .filter(item => item.original_language === 'ja' && item.poster_path)
          .slice(0, 15);
        setTrendingAnime(filteredTrending);
      }
      
      // Get properly filtered recent anime
      const recentData = await getRecentAnime(1);
      if (recentData?.results) {
        const currentYear = new Date().getFullYear();
        const filteredRecent = recentData.results
          .filter(item => {
            const hasValidPoster = item.original_language === 'ja' && item.poster_path;
            if (!hasValidPoster) return false;
            
            const releaseDate = item.first_air_date || item.release_date;
            if (!releaseDate) return false;
            
            const releaseYear = parseInt(releaseDate.split('-')[0]);
            return releaseYear >= currentYear - 1;
          })
          .slice(0, 15);
        setRecentAnime(filteredRecent);
      }
    } catch (error) {
      console.error('Error loading featured anime:', error);
    }
  }, []);

  // Load more anime for infinite scrolling - optimized
  const loadMoreAnime = useCallback(async () => {
    if (page >= totalPages) return false;
    
    await fetchAnimeData(false);
    return true;
  }, [page, totalPages, fetchAnimeData]);
  
  // Handle filter change
  const handleFilterChange = useCallback((filter: string) => {
    setSearchParams({ filter });
  }, [setSearchParams]);

  // Initial data loading
  useEffect(() => {
    // Reset page when filter changes
    setPage(1);
    loadFeaturedContent();
    fetchAnimeData(true);
  }, [activeFilter, loadFeaturedContent, fetchAnimeData]);

  return (
    <MainLayout>
      {initialLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" variant="purple" text="Loading anime content..." />
        </div>
      ) : (
        <div className="auraluxx-container py-24">
          <h1 className="text-3xl font-bold text-white mb-8">Anime</h1>
          
          {/* Featured Anime Sliders */}
          <div className="mb-8">
            <MediaSlider 
              title="Trending Anime" 
              items={trendingAnime}
              loading={initialLoading}
              mediaType="tv"
              viewAllLink="/anime?filter=trending"
            />
            
            <MediaSlider 
              title="Recently Released" 
              items={recentAnime}
              loading={initialLoading}
              mediaType="tv"
              viewAllLink="/anime?filter=recent"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                className={`px-4 py-2 rounded-full transition-all ${
                  activeFilter === option.value
                    ? 'bg-aura-purple text-white'
                    : 'bg-white/5 hover:bg-white/10 text-white/70'
                }`}
                onClick={() => handleFilterChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Main Anime Grid with Infinite Scrolling */}
          <h2 className="text-xl font-bold text-white mb-4">
            {filterOptions.find(opt => opt.value === activeFilter)?.label || 'Popular'} Anime
          </h2>
          
          {loading && animeContent.length === 0 ? (
            <div className="flex justify-center my-12">
              <LoadingSpinner size="lg" variant="purple" text="Loading anime..." />
            </div>
          ) : animeContent.length > 0 ? (
            <InfiniteScroll
              loadMore={loadMoreAnime}
              loading={loading}
              hasMore={page < totalPages}
              threshold={300}
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
            </InfiniteScroll>
          ) : (
            <div className="flex justify-center items-center py-12 text-white/60">
              No anime found
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
};

export default AnimePage;
