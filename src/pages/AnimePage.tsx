
import { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MediaSlider from '@/components/common/MediaSlider';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import MediaCard from '@/components/common/MediaCard';
import { Button } from '@/components/ui/button';
import { getAnimeContent, getTrendingAnime, getTopRatedAnime, getRecentAnime } from '@/services/tmdbApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const AnimePage = () => {
  const [popularAnime, setPopularAnime] = useState<any[]>([]);
  const [trendingAnime, setTrendingAnime] = useState<any[]>([]);
  const [topRatedAnime, setTopRatedAnime] = useState<any[]>([]);
  const [recentAnime, setRecentAnime] = useState<any[]>([]);
  const [displayedAnime, setDisplayedAnime] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState({
    popular: true,
    trending: true,
    topRated: true,
    recent: true
  });
  const [selectedCategory, setSelectedCategory] = useState('popular');

  // Filter function to ensure only anime content is shown
  const filterAnimeContent = (results: any[]) => {
    return results.filter(item => 
      // Filter for Japanese animation
      (item.original_language === 'ja' && 
      // Make sure it has a poster
      item.poster_path)
    );
  };

  // Fetch anime data for each category
  const fetchAnimeData = useCallback(async () => {
    try {
      // Popular Anime
      setCategoryLoading(prev => ({ ...prev, popular: true }));
      const popularData = await getAnimeContent(1);
      if (popularData?.results) {
        const filtered = filterAnimeContent(popularData.results);
        setPopularAnime(filtered);
        setDisplayedAnime(filtered);
        setTotalPages(popularData.total_pages);
      }
      setCategoryLoading(prev => ({ ...prev, popular: false }));

      // Trending Anime
      setCategoryLoading(prev => ({ ...prev, trending: true }));
      const trendingData = await getTrendingAnime(1);
      if (trendingData?.results) {
        setTrendingAnime(filterAnimeContent(trendingData.results));
      }
      setCategoryLoading(prev => ({ ...prev, trending: false }));

      // Top Rated Anime
      setCategoryLoading(prev => ({ ...prev, topRated: true }));
      const topRatedData = await getTopRatedAnime(1);
      if (topRatedData?.results) {
        setTopRatedAnime(filterAnimeContent(topRatedData.results));
      }
      setCategoryLoading(prev => ({ ...prev, topRated: false }));

      // Recent Anime
      setCategoryLoading(prev => ({ ...prev, recent: true }));
      const recentData = await getRecentAnime(1);
      if (recentData?.results) {
        setRecentAnime(filterAnimeContent(recentData.results));
      }
      setCategoryLoading(prev => ({ ...prev, recent: false }));

      // Set overall loading to false
      setLoading(false);
    } catch (error) {
      console.error('Error fetching anime data:', error);
      setLoading(false);
    }
  }, []);

  // Load more anime for infinite scrolling
  const loadMoreAnime = async () => {
    if (page >= totalPages) return false;
    
    const nextPage = page + 1;
    setLoading(true);
    
    try {
      let data;
      switch (selectedCategory) {
        case 'trending':
          data = await getTrendingAnime(nextPage);
          break;
        case 'topRated':
          data = await getTopRatedAnime(nextPage);
          break;
        case 'recent':
          data = await getRecentAnime(nextPage);
          break;
        default:
          data = await getAnimeContent(nextPage);
      }
      
      if (data?.results) {
        const filteredResults = filterAnimeContent(data.results);
        setDisplayedAnime(prev => [...prev, ...filteredResults]);
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

  // Change the displayed anime when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
    
    switch (category) {
      case 'trending':
        setDisplayedAnime(trendingAnime);
        break;
      case 'topRated':
        setDisplayedAnime(topRatedAnime);
        break;
      case 'recent':
        setDisplayedAnime(recentAnime);
        break;
      default:
        setDisplayedAnime(popularAnime);
    }
  };

  useEffect(() => {
    fetchAnimeData();
  }, [fetchAnimeData]);

  return (
    <MainLayout>
      <div className="auraluxx-container py-24">
        <h1 className="text-3xl font-bold text-white mb-8">Anime</h1>
        
        {/* Category Selection Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {['popular', 'trending', 'topRated', 'recent'].map((category) => (
            <Button 
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'} 
              className={selectedCategory === category ? 'bg-aura-purple hover:bg-aura-purple/90' : 'text-white border-white/30'}
              onClick={() => handleCategoryChange(category)}
            >
              {category === 'popular' ? 'Popular' : 
               category === 'trending' ? 'Trending' :
               category === 'topRated' ? 'Top Rated' : 'Recent'}
            </Button>
          ))}
        </div>
        
        {/* Featured Anime Categories (Horizontal Scrolling) */}
        <div className="mb-8">
          <MediaSlider 
            title="Trending Anime" 
            items={trendingAnime}
            loading={categoryLoading.trending}
            mediaType="tv"
          />
          
          <MediaSlider 
            title="Top Rated Anime" 
            items={topRatedAnime}
            loading={categoryLoading.topRated}
            mediaType="tv"
          />
          
          <MediaSlider 
            title="Recently Released" 
            items={recentAnime}
            loading={categoryLoading.recent}
            mediaType="tv"
          />
        </div>

        {/* Main Anime Grid with Infinite Scrolling */}
        <h2 className="text-xl font-bold text-white mb-4">
          {selectedCategory === 'popular' ? 'Popular Anime' : 
           selectedCategory === 'trending' ? 'Trending Anime' :
           selectedCategory === 'topRated' ? 'Top Rated Anime' : 'Recent Anime'}
        </h2>
        
        {loading && displayedAnime.length === 0 ? (
          <div className="flex justify-center my-12">
            <LoadingSpinner size="lg" variant="purple" text="Loading anime..." />
          </div>
        ) : displayedAnime.length > 0 ? (
          <InfiniteScroll
            loadMore={loadMoreAnime}
            loading={loading}
            hasMore={page < totalPages}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {displayedAnime.map((item) => (
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
            
            {loading && displayedAnime.length > 0 && (
              <div className="flex justify-center my-8">
                <LoadingSpinner size="md" text="Loading more..." />
              </div>
            )}
          </InfiniteScroll>
        ) : (
          <div className="flex justify-center items-center py-12 text-white/60">
            No anime found in this category
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AnimePage;
