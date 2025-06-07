
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import MediaCard from '@/components/common/MediaCard';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import { getTrending, getPopular, getTopRated, getNowPlaying } from '@/services/tmdbApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const filterOptions = [
  { label: 'Popular', value: 'popular' },
  { label: 'Trending', value: 'trending' },
  { label: 'Top Rated', value: 'top_rated' },
  { label: 'Now Playing', value: 'now_playing' },
];

const MoviePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const activeFilter = searchParams.get('filter') || 'popular';

  const fetchMovies = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      const currentPage = reset ? 1 : page;
      let data;

      console.log(`Fetching movies: filter=${activeFilter}, page=${currentPage}, reset=${reset}`);

      switch (activeFilter) {
        case 'trending':
          data = await getTrending('movie', 'week', currentPage);
          break;
        case 'top_rated':
          data = await getTopRated('movie', currentPage);
          break;
        case 'now_playing':
          data = await getNowPlaying('movie', currentPage);
          break;
        case 'popular':
        default:
          data = await getPopular('movie', currentPage);
          break;
      }

      if (data?.results) {
        // Filter out movies without posters for better UX
        const filteredResults = data.results.filter(movie => movie.poster_path);
        
        console.log(`Movies fetched successfully: ${filteredResults.length} movies`);
        
        if (reset) {
          setMovies(filteredResults);
          setPage(2); // Next page to load
        } else {
          setMovies(prev => [...prev, ...filteredResults]);
          setPage(currentPage + 1);
        }
        
        setTotalPages(data.total_pages);
      } else {
        console.error('No results from TMDB API');
        setError('No movies found. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [activeFilter, page]);

  const loadMore = useCallback(async () => {
    if (page <= totalPages && !loading) {
      await fetchMovies(false);
      return true;
    }
    return false;
  }, [page, totalPages, loading, fetchMovies]);

  const handleFilterChange = useCallback((filter: string) => {
    setSearchParams({ filter });
    setMovies([]);
    setPage(1);
    setError(null);
  }, [setSearchParams]);

  useEffect(() => {
    fetchMovies(true);
  }, [activeFilter]);

  // Memoize the loading skeleton to prevent unnecessary re-renders
  const loadingSkeleton = useMemo(() => (
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
  ), []);

  return (
    <MainLayout>
      <div className="auraluxx-container py-24">
        <h1 className="text-3xl font-bold text-white mb-8">Movies</h1>
        
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              className={`px-4 py-2 rounded-full transition-all btn-hover ${
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
        
        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => fetchMovies(true)}
              className="px-6 py-2 bg-aura-purple hover:bg-aura-purple/90 rounded-lg transition-all btn-hover"
            >
              Try Again
            </button>
          </div>
        )}
        
        {loading && movies.length === 0 ? (
          loadingSkeleton
        ) : movies.length > 0 ? (
          <InfiniteScroll
            loadMore={loadMore}
            loading={loading}
            hasMore={page <= totalPages}
            threshold={800}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MediaCard
                  key={`${movie.id}-${activeFilter}`}
                  id={movie.id}
                  title={movie.title}
                  type="movie"
                  posterPath={movie.poster_path}
                  releaseDate={movie.release_date}
                  voteAverage={movie.vote_average}
                />
              ))}
            </div>
            
            {loading && movies.length > 0 && (
              <div className="flex justify-center my-8">
                <LoadingSpinner size="md" variant="purple" />
              </div>
            )}
          </InfiniteScroll>
        ) : !loading && !error ? (
          <div className="text-center py-8">
            <p className="text-white/70">No movies found for this filter.</p>
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default MoviePage;
