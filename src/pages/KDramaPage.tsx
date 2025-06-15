
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import MediaCard from '@/components/common/MediaCard';
import MediaSlider from '@/components/common/MediaSlider';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import CategoryFilterBar from '@/components/common/CategoryFilterBar';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import { Button } from '@/components/ui/button';
import { getKDramaContent } from '@/services/tmdbApi';
import Ad from '@/components/ads/Ad';
import { useAds } from '@/contexts/AdContext';

const KDramaPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [content, setContent] = useState([]);
  const [slideshowContent, setSlideshowContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slideshowLoading, setSlideshowLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { isAdEnabled } = useAds();

  const filter = searchParams.get('filter') || 'popular';
  const genre = searchParams.get('genre') || '';
  const year = searchParams.get('year') || '';

  // Fetch slideshow content (new arrivals)
  const fetchSlideshowContent = useCallback(async () => {
    try {
      setSlideshowLoading(true);
      const data = await getKDramaContent('recent', { page: 1 });
      if (data?.results) {
        setSlideshowContent(data.results.slice(0, 10)); // Show top 10 new arrivals
      }
    } catch (error) {
      console.error('Error fetching K-Drama slideshow content:', error);
    } finally {
      setSlideshowLoading(false);
    }
  }, []);

  const fetchContent = useCallback(async (page = 1, reset = false) => {
    try {
      setLoading(true);
      const data = await getKDramaContent(filter, {
        page,
        genre: genre || undefined,
        year: year || undefined,
      });

      if (data?.results) {
        setContent(prev => reset ? data.results : [...prev, ...data.results]);
        setHasNextPage(page < data.total_pages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching K-Drama content:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, genre, year]);

  useEffect(() => {
    fetchSlideshowContent();
  }, [fetchSlideshowContent]);

  useEffect(() => {
    setCurrentPage(1);
    fetchContent(1, true);
  }, [fetchContent]);

  const loadMore = async (): Promise<boolean> => {
    if (!loading && hasNextPage) {
      await fetchContent(currentPage + 1, false);
      return hasNextPage;
    }
    return false;
  };

  const handleFilterChange = (newFilter: string) => {
    const params = new URLSearchParams(searchParams);
    if (newFilter === 'popular') {
      params.delete('filter');
    } else {
      params.set('filter', newFilter);
    }
    setSearchParams(params);
  };

  const handleGenreChange = (newGenre: string) => {
    const params = new URLSearchParams(searchParams);
    if (newGenre) {
      params.set('genre', newGenre);
    } else {
      params.delete('genre');
    }
    setSearchParams(params);
  };

  const handleYearChange = (newYear: string) => {
    const params = new URLSearchParams(searchParams);
    if (newYear) {
      params.set('year', newYear);
    } else {
      params.delete('year');
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-aura-dark pt-20">
        <div className="auraluxx-container py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Korean Drama (K-Drama)
            </h1>
            <p className="text-white/80 text-lg">
              Discover the best Korean dramas and series
            </p>
          </div>

          {/* Top Ad */}
          {isAdEnabled && (
            <div className="mb-8 flex justify-center">
              <Ad size="728x90" />
            </div>
          )}

          {/* Slideshow - New Arrivals */}
          <MediaSlider
            title="New Arrivals"
            items={slideshowContent}
            loading={slideshowLoading}
            mediaType="tv"
          />

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button 
              onClick={() => handleFilterChange('popular')}
              variant={filter === 'popular' ? 'default' : 'outline'}
              className={filter === 'popular' 
                ? 'bg-aura-purple hover:bg-aura-purple/80 text-white' 
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
              }
            >
              Popular
            </Button>
            <Button 
              onClick={() => handleFilterChange('trending')}
              variant={filter === 'trending' ? 'default' : 'outline'}
              className={filter === 'trending' 
                ? 'bg-aura-purple hover:bg-aura-purple/80 text-white' 
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
              }
            >
              Trending
            </Button>
            <Button 
              onClick={() => handleFilterChange('recent')}
              variant={filter === 'recent' ? 'default' : 'outline'}
              className={filter === 'recent' 
                ? 'bg-aura-purple hover:bg-aura-purple/80 text-white' 
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
              }
            >
              New Arrivals
            </Button>
            <Button 
              onClick={() => handleFilterChange('top_rated')}
              variant={filter === 'top_rated' ? 'default' : 'outline'}
              className={filter === 'top_rated' 
                ? 'bg-aura-purple hover:bg-aura-purple/80 text-white' 
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
              }
            >
              Top Rated
            </Button>
          </div>

          {/* Filter Bar */}
          <CategoryFilterBar
            selectedGenre={genre}
            onGenreChange={handleGenreChange}
            selectedYear={year}
            onYearChange={handleYearChange}
            mediaType="tv"
          />

          {/* Content Grid */}
          {loading && currentPage === 1 ? (
            <LoadingSkeleton />
          ) : (
            <InfiniteScroll
              hasMore={hasNextPage}
              loading={loading}
              loadMore={loadMore}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
                {content.map((item: any, index: number) => (
                  <div key={`${item.id}-${index}`}>
                    <MediaCard 
                      id={item.id}
                      title={item.name || item.title}
                      type="tv"
                      posterPath={item.poster_path}
                      releaseDate={item.first_air_date || item.release_date}
                      voteAverage={item.vote_average}
                    />
                    {/* Ad every 12 items */}
                    {isAdEnabled && index > 0 && (index + 1) % 12 === 0 && (
                      <div className="col-span-full my-6 flex justify-center">
                        <Ad size="300x250" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {loading && currentPage > 1 && (
                <div className="flex justify-center py-8">
                  <LoadingSkeleton />
                </div>
              )}
            </InfiniteScroll>
          )}

          {/* Bottom Ad */}
          {isAdEnabled && (
            <div className="mt-8 flex justify-center">
              <Ad size="728x90" />
            </div>
          )}

          {/* No Results */}
          {!loading && content.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">No K-Drama found</h3>
              <p className="text-white/60 mb-4">
                Try adjusting your filters or search for something else.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default KDramaPage;
