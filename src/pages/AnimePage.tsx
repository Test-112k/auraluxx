
import { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MediaSlider from '@/components/common/MediaSlider';
import MediaCard from '@/components/common/MediaCard';
import { getAnimeContent, getTrendingAnime, getTopRatedAnime, getRecentAnime } from '@/services/tmdbApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useSearchParams } from 'react-router-dom';
import ContentAds from '@/components/ads/ContentAds';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const filterOptions = [
  { label: 'Popular', value: 'popular' },
  { label: 'Trending', value: 'trending' },
  { label: 'Top Rated', value: 'top_rated' },
  { label: 'New Releases', value: 'recent' }
];

const ITEMS_PER_PAGE = 24; // Number of items to show per page

const AnimePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [animeContent, setAnimeContent] = useState<any[]>([]);
  const [trendingAnime, setTrendingAnime] = useState<any[]>([]);
  const [recentAnime, setRecentAnime] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const activeFilter = searchParams.get('filter') || 'popular';
  const currentPage = parseInt(searchParams.get('page') || '1');

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

  // Fetch anime content based on the active filter and page
  const fetchAnimeData = useCallback(async () => {
    try {
      setLoading(true);
      console.log(`Fetching anime data with filter: ${activeFilter}, page: ${currentPage}`);
      
      let data;
      
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
      
      console.log(`Received data for ${activeFilter}, total pages: ${data?.total_pages || 0}`);
      
      if (data?.results) {
        const filtered = filterAnimeContent(data.results);
        console.log(`Filtered ${filtered.length} items from ${data.results.length} results`);
        setAnimeContent(filtered);
        setTotalPages(Math.min(data.total_pages, 500)); // API typically limits to 500 pages
      }
    } catch (error) {
      console.error('Error fetching anime data:', error);
    } finally {
      setLoading(false);
      if (initialLoading) setInitialLoading(false);
    }
  }, [activeFilter, currentPage, filterAnimeContent, initialLoading]);
  
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

  // Handle filter change
  const handleFilterChange = useCallback((filter: string) => {
    window.scrollTo(0, 0); // Scroll to top when changing filters
    setSearchParams({ filter, page: '1' }); // Reset to page 1 when changing filters
  }, [setSearchParams]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    window.scrollTo(0, 0); // Scroll to top when changing page
    setSearchParams({ filter: activeFilter, page: page.toString() });
  }, [setSearchParams, activeFilter]);

  // Initial data loading
  useEffect(() => {
    loadFeaturedContent();
  }, [loadFeaturedContent]);

  // Fetch data when filter or page changes
  useEffect(() => {
    fetchAnimeData();
  }, [fetchAnimeData, activeFilter, currentPage]);

  // Generate pagination items
  const renderPagination = () => {
    const items = [];
    const maxVisiblePages = 5; // Maximum number of page links to show
    
    // Calculate the range of pages to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Add previous page button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
        />
      </PaginationItem>
    );
    
    // Add first page and ellipsis if needed
    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink 
            isActive={currentPage === 1} 
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis1">
            <span className="flex h-9 w-9 items-center justify-center">...</span>
          </PaginationItem>
        );
      }
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis2">
            <span className="flex h-9 w-9 items-center justify-center">...</span>
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            isActive={currentPage === totalPages} 
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add next page button
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
        />
      </PaginationItem>
    );
    
    return items;
  };

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

          {/* Main Anime Grid with Pagination */}
          <h2 className="text-xl font-bold text-white mb-4">
            {filterOptions.find(opt => opt.value === activeFilter)?.label || 'Popular'} Anime
          </h2>
          
          {loading ? (
            <div className="flex justify-center my-12">
              <LoadingSpinner size="lg" variant="purple" text="Loading anime..." />
            </div>
          ) : animeContent.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {animeContent.map((item) => (
                  <MediaCard
                    key={`anime-${item.id}`}
                    id={item.id}
                    title={item.name || item.title}
                    type="tv"
                    posterPath={item.poster_path}
                    releaseDate={item.first_air_date || item.release_date}
                    voteAverage={item.vote_average}
                  />
                ))}
              </div>
              
              {/* Pagination control */}
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    {renderPagination()}
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center py-12 text-white/60">
              No anime found
            </div>
          )}
          
          {/* Content Ads */}
          <ContentAds />
        </div>
      )}
    </MainLayout>
  );
};

export default AnimePage;
