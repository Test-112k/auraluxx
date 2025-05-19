
import { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MediaCard from '@/components/common/MediaCard';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import { getAnimeContent } from '@/services/tmdbApi';

const AnimePage = () => {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAnime = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAnimeContent(page);
      
      if (data?.results) {
        setAnimeList(prev => [...prev, ...data.results]);
        setTotalPages(data.total_pages);
        setPage(page + 1);
      }
    } catch (error) {
      console.error('Error fetching anime:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const loadMore = async () => {
    if (page < totalPages) {
      await fetchAnime();
      return true;
    }
    return false;
  };

  useEffect(() => {
    fetchAnime();
  }, []);

  return (
    <MainLayout>
      <div className="auraluxx-container py-24">
        <h1 className="text-3xl font-bold text-white mb-8">Anime</h1>
        
        {loading && animeList.length === 0 ? (
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
              {animeList.map((anime) => (
                <MediaCard
                  key={anime.id}
                  id={anime.id}
                  title={anime.name}
                  type="tv"
                  posterPath={anime.poster_path}
                  releaseDate={anime.first_air_date}
                  voteAverage={anime.vote_average}
                />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </MainLayout>
  );
};

export default AnimePage;
