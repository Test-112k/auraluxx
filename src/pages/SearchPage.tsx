import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import MediaCard from '@/components/common/MediaCard';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import { searchMulti } from '@/services/tmdbApi';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchResults = async (currentPage: number, isNewSearch = false) => {
    if (!query.trim()) return;
    
    setLoading(true);
    console.log(`Fetching search results for "${query}", page ${currentPage}`);
    
    try {
      const data = await searchMulti(query, currentPage);
      console.log('Search API response:', data);
      
      if (data && data.results) {
        // Filter out person results and keep only movies and TV shows
        const filteredResults = data.results.filter(
          item => item.media_type === 'movie' || item.media_type === 'tv'
        );
        
        console.log(`Filtered ${data.results.length} results to ${filteredResults.length} (movies/TV only)`);
        
        if (isNewSearch) {
          setResults(filteredResults);
        } else {
          setResults(prev => [...prev, ...filteredResults]);
        }
        
        setTotalPages(data.total_pages);
        setTotalResults(data.total_results);
      } else {
        console.log('No results found or invalid response');
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (page < totalPages && !loading) {
      const nextPage = page + 1;
      console.log(`Loading more results, page ${nextPage}`);
      setPage(nextPage);
      await fetchResults(nextPage, false);
      return true;
    }
    return false;
  };

  // Reset and fetch when query changes
  useEffect(() => {
    console.log('Query changed to:', query);
    if (query.trim()) {
      setPage(1);
      setResults([]);
      setTotalPages(0);
      setTotalResults(0);
      fetchResults(1, true);
    } else {
      setResults([]);
      setTotalPages(0);
      setTotalResults(0);
    }
  }, [query]);

  console.log(`Current state: ${results.length} results, page ${page}/${totalPages}, loading: ${loading}`);

  return (
    <MainLayout>
      <div className="auraluxx-container py-24">
        <h1 className="text-3xl font-bold text-white mb-2">Search Results</h1>
        <p className="text-white/70 mb-8">
          {query ? (
            <>
              Found {totalResults} results for <span className="font-medium">"{query}"</span>
            </>
          ) : (
            'Please enter a search query'
          )}
        </p>
        
        {loading && results.length === 0 ? (
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
        ) : results.length > 0 ? (
          <InfiniteScroll
            loadMore={loadMore}
            loading={loading}
            hasMore={page < totalPages}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map((item, index) => (
                <MediaCard
                  key={`${item.id}-${index}`}
                  id={item.id}
                  title={item.title || item.name}
                  type={item.media_type}
                  posterPath={item.poster_path}
                  releaseDate={item.release_date || item.first_air_date}
                  voteAverage={item.vote_average}
                />
              ))}
            </div>
          </InfiniteScroll>
        ) : query && !loading ? (
          <div className="flex items-center justify-center h-64 text-center">
            <div className="text-white/60">
              <p className="text-lg mb-2">No results found</p>
              <p>Try a different search term</p>
            </div>
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default SearchPage;
