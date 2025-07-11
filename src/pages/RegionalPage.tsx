import { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MediaCard from '@/components/common/MediaCard';
import InfiniteScroll from '@/components/common/InfiniteScroll';
import ImprovedCountrySelector from '@/components/common/ImprovedCountrySelector';
import CategoryFilterBar from '@/components/common/CategoryFilterBar';
import { getRegionalContent, countryToLanguagesMap } from '@/services/tmdbApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const fetchUserCountryWithFallback = async (): Promise<string | null> => {
  // Primary method: ipinfo.io
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const res = await fetch('https://ipinfo.io/json?token=2d947eab4e3ae4', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });
    clearTimeout(timeoutId);
    
    if (res.ok) {
      const data = await res.json();
      console.log('IP detection successful via ipinfo.io:', data.country);
      return data && data.country ? data.country : null;
    }
  } catch (error) {
    console.warn('ipinfo.io failed, trying fallback:', error);
  }

  // Fallback method 1: ip-api.com
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const res = await fetch('http://ip-api.com/json/', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });
    clearTimeout(timeoutId);
    
    if (res.ok) {
      const data = await res.json();
      console.log('IP detection successful via ip-api.com:', data.countryCode);
      return data && data.countryCode ? data.countryCode : null;
    }
  } catch (error) {
    console.warn('ip-api.com failed, trying another fallback:', error);
  }

  // Fallback method 2: ipapi.co
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const res = await fetch('https://ipapi.co/country/', {
      signal: controller.signal,
      headers: {
        'Accept': 'text/plain',
      }
    });
    clearTimeout(timeoutId);
    
    if (res.ok) {
      const countryCode = await res.text();
      console.log('IP detection successful via ipapi.co:', countryCode.trim());
      return countryCode.trim() || null;
    }
  } catch (error) {
    console.warn('ipapi.co failed:', error);
  }

  // Fallback method 3: Browser geolocation + timezone approximation
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log('Trying timezone-based detection:', timezone);
    
    // Simple timezone to country mapping for common cases
    const timezoneCountryMap: { [key: string]: string } = {
      'America/New_York': 'US',
      'America/Los_Angeles': 'US',
      'America/Chicago': 'US',
      'America/Denver': 'US',
      'Europe/London': 'GB',
      'Europe/Paris': 'FR',
      'Europe/Berlin': 'DE',
      'Europe/Rome': 'IT',
      'Europe/Madrid': 'ES',
      'Asia/Tokyo': 'JP',
      'Asia/Seoul': 'KR',
      'Asia/Shanghai': 'CN',
      'Asia/Kolkata': 'IN',
      'Asia/Karachi': 'PK',
      'Australia/Sydney': 'AU',
      'America/Toronto': 'CA',
      'America/Mexico_City': 'MX',
      'America/Sao_Paulo': 'BR',
      'Europe/Moscow': 'RU',
    };
    
    const detectedCountry = timezoneCountryMap[timezone];
    if (detectedCountry) {
      console.log('Country detected via timezone:', detectedCountry);
      return detectedCountry;
    }
  } catch (error) {
    console.warn('Timezone detection failed:', error);
  }

  console.log('All auto-detection methods failed');
  return null;
};

const RegionalPage = () => {
  const [regionalContent, setRegionalContent] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countryAutoDetected, setCountryAutoDetected] = useState(false);
  const [autoDetectionStatus, setAutoDetectionStatus] = useState('Detecting your region...');

  // This effect runs only once on mount to detect the user's country via IP.
  useEffect(() => {
    const detectAndSetCountry = async () => {
      setError(null);
      setAutoDetectionStatus('Detecting your region...');
      
      try {
        const ipCountry = await fetchUserCountryWithFallback();
        
        if (ipCountry && (countryToLanguagesMap[ipCountry] || ipCountry === 'PK')) {
          setSelectedCountry(ipCountry);
          setAutoDetectionStatus(`Region detected: ${ipCountry}`);
          console.log('Successfully auto-detected and set country:', ipCountry);
        } else {
          if (ipCountry) {
            console.log(`IP country ${ipCountry} detected but is not supported.`);
            setAutoDetectionStatus(`Detected ${ipCountry} but not supported`);
          } else {
            console.log('Could not auto-detect country from IP.');
            setAutoDetectionStatus('Auto-detection failed');
          }
        }
      } catch (error) {
        console.error('Error during country detection:', error);
        setAutoDetectionStatus('Auto-detection failed');
      } finally {
        setCountryAutoDetected(true);
      }
    };

    detectAndSetCountry();
  }, []);

  const fetchRegionalContent = useCallback(async (reset = false) => {
    if (!selectedCountry) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const currentPage = reset ? 1 : page;

    const countryData = countryToLanguagesMap[selectedCountry];
    if (!countryData) {
      setLoading(false);
      setError('Language mapping not found for selected country. Please select another country.');
      setRegionalContent([]);
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
        } else {
          setRegionalContent(prev => [...prev, ...filteredResults]);
        }
        setPage(currentPage + 1);
        setTotalPages(data.total_pages);
        if (filteredResults.length === 0 && currentPage === 1) {
          setError('No content available for this region with current filters.');
        }
      } else {
        if (reset) setRegionalContent([]);
        setPage(1);
        setTotalPages(0);
        setError('No content available for this region with current filters.');
      }
    } catch (error) {
      console.error('Failed to load regional content:', error);
      setError('Failed to load content for this region. Please try again.');
      if (reset) setRegionalContent([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCountry, selectedGenre, selectedYear, selectedLanguage, page]);

  const loadMore = async () => {
    if (loading || page > totalPages) return false;
    
    if (page > totalPages && totalPages > 0) return false;

    await fetchRegionalContent();
    return true;
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
    if (selectedCountry && countryAutoDetected) {
        fetchRegionalContent(true);
    } else if (!selectedCountry && countryAutoDetected) {
        setLoading(false);
        setRegionalContent([]);
        setPage(1);
        setTotalPages(0);
    }
  }, [selectedCountry, selectedGenre, selectedYear, selectedLanguage, countryAutoDetected]);

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
                {selectedCountry && (
                  <span className="font-normal text-xs text-white/60 ml-2">
                    Selected: {selectedCountry}
                  </span>
                )}
              </p>
              {!countryAutoDetected && (
                <div className="text-center text-white/70 text-sm mb-2">
                  {autoDetectionStatus}
                </div>
              )}
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
              <LoadingSpinner size="lg" text={!countryAutoDetected ? autoDetectionStatus : "Loading regional content..."} />
            </div>
          ) : regionalContent.length > 0 ? (
            <InfiniteScroll
              loadMore={loadMore}
              loading={loading}
              hasMore={page <= totalPages && totalPages > 0}
              threshold={1000}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {regionalContent.map((item) => (
                  <MediaCard
                    key={item.id}
                    id={item.id}
                    title={item.title || item.name}
                    type="movie"
                    posterPath={item.poster_path}
                    releaseDate={item.release_date || item.first_air_date}
                    voteAverage={item.vote_average}
                  />
                ))}
              </div>
              {loading && regionalContent.length > 0 && (
                <div className="flex justify-center my-8">
                  <LoadingSpinner size="md" text="Loading more..." />
                </div>
              )}
               {page > totalPages && totalPages > 0 && regionalContent.length > 0 && !loading && (
                 <div className="text-center text-white/70 py-8">All content loaded.</div>
               )}
            </InfiniteScroll>
          ) : countryAutoDetected && !selectedCountry && !loading ? (
             <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="bg-gradient-to-br from-aura-purple/15 to-aura-darkpurple/15 backdrop-blur-xl rounded-2xl p-8 text-center border border-aura-purple/30 shadow-lg max-w-md transition-all duration-300">
                <div className="text-white/80 space-y-4">
                  <h3 className="text-2xl font-bold text-white">Select a Region</h3>
                  <p className="text-lg">Could not auto-detect your region or it's not supported. Please choose a country above to explore regional content.</p>
                  <div className="bg-aura-darkpurple/40 text-aura-accent font-medium rounded-md px-4 py-2 mt-2 text-base">
                    <span className="text-white/80">
                      <b>Try searching for the movie</b> directly in the search bar above if you can't find it here.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedCountry && !loading && !error ? (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
              <div className="bg-gradient-to-br from-aura-purple/15 to-aura-darkpurple/15 backdrop-blur-xl rounded-2xl p-8 text-center border border-aura-purple/30 shadow-lg max-w-md transition-all duration-300">
                <div className="text-white/80 space-y-4">
                  <h3 className="text-2xl font-bold text-white flex justify-center items-center gap-2">
                    <span>No Content Available</span>
                  </h3>
                  <p className="text-lg">
                    No content found for the selected region and filters.
                  </p>
                  <div className="bg-aura-darkpurple/40 text-aura-accent font-medium rounded-md px-4 py-2 mt-2 text-base">
                    Not all regional content is indexed.<br />
                    <span className="text-white/80">
                      <b>Try searching for the movie</b> directly in the search bar above if you can't find it here.
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
          ) : error ? (
             <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
              <div className="bg-gradient-to-br from-aura-purple/15 to-aura-darkpurple/15 backdrop-blur-xl rounded-2xl p-8 text-center border border-aura-purple/30 shadow-lg max-w-md transition-all duration-300">
                <div className="text-white/80 space-y-4">
                  <h3 className="text-2xl font-bold text-white flex justify-center items-center gap-2">
                    <span>Content Issue</span>
                  </h3>
                  <p className="text-lg">
                    {error}
                  </p>
                  <div className="bg-aura-darkpurple/40 text-aura-accent font-medium rounded-md px-4 py-2 mt-2 text-base">
                    <span className="text-white/80">
                      <b>Try searching for the movie</b> directly in the search bar above if you can't find it here.
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
          ) : !countryAutoDetected && !loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="bg-gradient-to-br from-aura-purple/15 to-aura-darkpurple/15 backdrop-blur-xl rounded-2xl p-8 text-center border border-aura-purple/30 shadow-lg max-w-md transition-all duration-300">
                <div className="text-white/80 space-y-4">
                  <h3 className="text-2xl font-bold text-white">Select a Region</h3>
                  <p className="text-lg">Choose a country above to explore regional content, or wait for auto-detection.</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </MainLayout>
  );
};

export default RegionalPage;
