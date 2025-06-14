
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import MediaCard from '@/components/common/MediaCard';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import CategoryFilterBar from '@/components/common/CategoryFilterBar';
import { getAnimeContent } from '@/services/tmdbApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const filterOptions = [
  { label: 'Popular', value: 'popular' },
  { label: 'Recent', value: 'recent' },
  { label: 'Top Rated', value: 'top_rated' },
  { label: 'Airing Today', value: 'airing_today' },
];

const AnimePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [anime, setAnime] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const activeFilter = searchParams.get('filter') || 'popular';

  const fetchAnime = useCallback(async (reset = false) => {
    setLoading(true);
    const currentPage = reset ? 1 : page;

    try {
      const data = await getAnimeContent(
        activeFilter,
        currentPage,
        selectedGenre,
        selectedYear,
        selectedLanguage
      );

      if (data?.results) {
        // Filter out results without poster images for cleaner UI
        const filteredResults = data.results.filter(item => item.poster_path);
        
        if (reset) {
          setAnime(filteredResults);
          setPage(2); // Set to 2 for next load
        } else {
          setAnime(prev => [...prev, ...filteredResults]);
          setPage(currentPage + 1);
        }
        
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      console.error('Error fetching anime:', error);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, selectedGenre, selectedYear, selectedLanguage, page]);

  const loadMore = async () => {
    if (page <= totalPages) {
      await fetchAnime(false);
      return true;
    }
    return false;
  };

  const handleFilterChange = (filter: string) => {
    setSearchParams({ filter });
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setPage(1);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setPage(1);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setPage(1);
  };

  useEffect(() => {
    fetchAnime(true);
  }, [activeFilter, selectedGenre, selectedYear, selectedLanguage]);

  return (
    <MainLayout>
      <div style={{ scrollBehavior: 'auto' }}>
        <CategoryFilterBar
          onGenreChange={handleGenreChange}
          onYearChange={handleYearChange}
          onLanguageChange={handleLanguageChange}
          selectedGenre={selectedGenre}
          selectedYear={selectedYear}
          selectedLanguage={selectedLanguage}
          mediaType="tv"
        />
        
        <div className="auraluxx-container py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Anime</h1>
          
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
          
          {loading && anime.length === 0 ? (
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
              hasMore={page <= totalPages}
              threshold={800}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {anime.map((animeItem) => (
                  <MediaCard
                    key={`${animeItem.id}-${activeFilter}`}
                    id={animeItem.id}
                    title={animeItem.name}
                    type="tv"
                    posterPath={animeItem.poster_path}
                    releaseDate={animeItem.first_air_date}
                    voteAverage={animeItem.vote_average}
                  />
                ))}
              </div>
              
              {loading && anime.length > 0 && (
                <div className="flex justify-center my-8">
                  <LoadingSpinner size="md" variant="purple" />
                </div>
              )}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AnimePage;
