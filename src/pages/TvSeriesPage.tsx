
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import MediaCard from '@/components/common/MediaCard';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import { getTrending, getPopular, getTopRated, getNowPlaying } from '@/services/tmdbApi';

const filterOptions = [
  { label: 'Popular', value: 'popular' },
  { label: 'Trending', value: 'trending' },
  { label: 'Top Rated', value: 'top_rated' },
  { label: 'On The Air', value: 'now_playing' },
];

const TvSeriesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tvSeries, setTvSeries] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const activeFilter = searchParams.get('filter') || 'popular';

  const fetchTvSeries = useCallback(async (reset = false) => {
    setLoading(true);
    const currentPage = reset ? 1 : page;
    let data;

    try {
      switch (activeFilter) {
        case 'trending':
          data = await getTrending('tv', 'week', currentPage);
          break;
        case 'top_rated':
          data = await getTopRated('tv', currentPage);
          break;
        case 'now_playing':
          data = await getNowPlaying('tv', currentPage);
          break;
        case 'popular':
        default:
          data = await getPopular('tv', currentPage);
          break;
      }

      if (data?.results) {
        if (reset) {
          setTvSeries(data.results);
          setPage(1);
        } else {
          setTvSeries(prev => [...prev, ...data.results]);
          setPage(currentPage + 1);
        }
        
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      console.error('Error fetching TV series:', error);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, page]);

  const loadMore = async () => {
    if (page < totalPages) {
      await fetchTvSeries();
      return true;
    }
    return false;
  };

  const handleFilterChange = (filter: string) => {
    setSearchParams({ filter });
  };

  useEffect(() => {
    fetchTvSeries(true);
  }, [activeFilter]);

  return (
    <MainLayout>
      <div className="auraluxx-container py-24">
        <h1 className="text-3xl font-bold text-white mb-8">TV Series</h1>
        
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
        
        {loading && tvSeries.length === 0 ? (
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
        ) : (
          <InfiniteScroll
            loadMore={loadMore}
            loading={loading}
            hasMore={page < totalPages}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {tvSeries.map((series) => (
                <MediaCard
                  key={series.id}
                  id={series.id}
                  title={series.name}
                  type="tv"
                  posterPath={series.poster_path}
                  releaseDate={series.first_air_date}
                  voteAverage={series.vote_average}
                />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </MainLayout>
  );
};

export default TvSeriesPage;
