import { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MediaCard from '@/components/common/MediaCard';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import ImprovedCountrySelector from '@/components/common/ImprovedCountrySelector';
import CategoryFilterBar from '@/components/common/CategoryFilterBar';
import { getRegionalContent, countryToLanguagesMap } from '@/services/tmdbApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const fetchUserCountry = async (): Promise<string | null> => {
  try {
    const res = await fetch('https://ipinfo.io/json?token=2d947eab4e3ae4');
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.country ? data.country : null;
  } catch {
    return null;
  }
};

const RegionalPage = () => {
  const [regionalContent, setRegionalContent] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countryAutoDetected, setCountryAutoDetected] = useState(false);

  // Fix: Proper IP detection and set once (if not already set)
  useEffect(() => {
    const detect = async () => {
      if (!selectedCountry && !countryAutoDetected) {
        const ipCountry = await fetchUserCountry();
        if (ipCountry && countryToLanguagesMap[ipCountry]) {
          setSelectedCountry(ipCountry);
        } else if (ipCountry && ipCountry === 'PK') {
          setSelectedCountry('PK');
        }
        setCountryAutoDetected(true); // Mark as attempted
      }
    };
    detect();
  }, [selectedCountry, countryAutoDetected]);

  const fetchRegionalContent = useCallback(async (reset = false) => {
    if (!selectedCountry) return;
    setLoading(true);
    setError(null);
    const currentPage = reset ? 1 : page;

    const countryData = countryToLanguagesMap[selectedCountry];
    if (!countryData) {
      setLoading(false);
      setError('Language mapping not found for selected country');
      return;
    }
    const language = selectedLanguage || countryData.primary;
    try {
      const filters: any = {};
      if (selectedGenre) filters.with_genres = selectedGenre;
      if (selectedYear) filters.year = selectedYear;
      const data = await getRegionalContent(language, currentPage, filters);

      if (data?.results) {
        const filteredResults = data.results.filter(item => item.poster_path);
        if (reset) {
          setRegionalContent(filteredResults);
          setPage(2);
        } else {
          setRegionalContent(prev => [...prev, ...filteredResults]);
          setPage(currentPage + 1);
        }
        setTotalPages(data.total_pages);
        if (filteredResults.length === 0 && currentPage === 1) {
          setError('No content available for this region with current filters.');
        }
      } else {
        if (reset) setRegionalContent([]);
        setError('No content available for this region with current filters.');
      }
    } catch (error) {
      setError('Failed to load content for this region. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedCountry, selectedGenre, selectedYear, selectedLanguage, page]);

  const loadMore = async () => {
    if (page <= totalPages) {
      await fetchRegionalContent();
      return true;
    }
    return false;
  };

  const handleCountryChange = (countryCode: string) => {
    if (countryCode === selectedCountry) return;
    setSelectedCountry(countryCode);
    setSelectedLanguage('');
    setPage(1);
    setRegionalContent([]);
    setTotalPages(0);
    setError(null);
  };

  const handleFilterChange = () => {
    setPage(1);
    setRegionalContent([]);
    setTotalPages(0);
    setError(null);
  };

  useEffect(() => {
    if (selectedCountry) fetchRegionalContent(true);
  }, [selectedCountry, selectedGenre, selectedYear, selectedLanguage]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
        <div className="bg-gradient-to-r from-aura-purple/30 to-aura-darkpurple/30 backdrop-blur-md rounded-2xl p-6 sm:p-8 mb-8 border border-aura-purple/40 shadow-2xl transition-all duration-200">
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-white to-aura-purple bg-clip-text text-transparent drop-shadow-lg">
                Regional Content
              </h1>
              <p className="text-white/80 text-lg md:text-xl leading-relaxed">
                Explore movies and shows from worldwide regions in their native languages.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
              <p className="text-white font-semibold text-lg flex items-center justify-between">
                <span>Choose Your Region:</span>
                <span className="font-normal text-xs text-white/60 ml-2">
                  {selectedCountry}
                </span>
              </p>
              <ImprovedCountrySelector
                selectedCountry={selectedCountry}
                onCountryChange={handleCountryChange}
                className="w-full"
              />
            </div>
          </div>
        </div>
        {selectedCountry && (
          <CategoryFilterBar
            onGenreChange={(genre) => {
              setSelectedGenre(genre);
              handleFilterChange();
            }}
            onYearChange={(year) => {
              setSelectedYear(year);
              handleFilterChange();
            }}
            onLanguageChange={(language) => {
              setSelectedLanguage(language);
              handleFilterChange();
            }}
            selectedGenre={selectedGenre}
            selectedYear={selectedYear}
            selectedLanguage={selectedLanguage}
            selectedCountry={selectedCountry}
            mediaType="movie"
          />
        )}
        <div className="relative">
          {loading && regionalContent.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" text="Loading regional content..." />
            </div>
          ) : regionalContent.length > 0 ? (
            <InfiniteScroll
              loadMore={loadMore}
              loading={loading}
              hasMore={page <= totalPages}
              threshold={1000}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {regionalContent.map((item) => (
                  <MediaCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    type="movie"
                    posterPath={item.poster_path}
                    releaseDate={item.release_date}
                    voteAverage={item.vote_average}
                  />
                ))}
              </div>
              {loading && regionalContent.length > 0 && (
                <div className="flex justify-center my-8">
                  <LoadingSpinner size="md" text="Loading more..." />
                </div>
              )}
            </InfiniteScroll>
          ) : selectedCountry ? (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
              <div className="bg-gradient-to-br from-aura-purple/15 to-aura-darkpurple/15 backdrop-blur-xl rounded-2xl p-8 text-center border border-aura-purple/30 shadow-lg max-w-md transition-all duration-300">
                <div className="text-white/80 space-y-4">
                  <h3 className="text-2xl font-bold text-white flex justify-center items-center gap-2">
                    <span>No Content Available</span>
                  </h3>
                  <p className="text-lg">
                    {error || 'No content available for this region with current filters.'}
                  </p>
                  <div className="bg-aura-darkpurple/40 text-aura-accent font-medium rounded-md px-4 py-2 mt-2 text-base">
                    Not all regional content is indexed.<br />
                    <span className="text-white/80">
                      <b>Tip:</b> Try searching directly in the search bar above to find your favorite movies from this region!
                    </span>
                  </div>
                  <button
                    onClick={() => fetchRegionalContent(true)}
                    className="mt-6 px-5 py-2 bg-gradient-to-r from-aura-purple to-aura-darkpurple rounded-lg text-white font-semibold hover:scale-105 transition-transform"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="bg-gradient-to-br from-aura-purple/15 to-aura-darkpurple/15 backdrop-blur-xl rounded-2xl p-8 text-center border border-aura-purple/30 shadow-lg max-w-md transition-all duration-300">
                <div className="text-white/80 space-y-4">
                  <h3 className="text-2xl font-bold text-white">Select a Region</h3>
                  <p className="text-lg">Choose a country above to explore regional content</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default RegionalPage;
