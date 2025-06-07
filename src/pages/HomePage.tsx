
import { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSlideshow from '@/components/common/HeroSlideshow';
import MediaSlider from '@/components/common/MediaSlider';
import CategoryButtons from '@/components/common/CategoryButtons';
import { Button } from '@/components/ui/button';
import { 
  getTrending, 
  getPopular, 
  getTopRated, 
  getNowPlaying,
  getAnimeContent
} from '@/services/tmdbApi';

const HomePage = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingShows, setTrendingShows] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [animeContent, setAnimeContent] = useState([]);
  const [loading, setLoading] = useState({
    trending: true,
    trendingShows: true,
    popular: true,
    topRated: true,
    nowPlaying: true,
    anime: true,
  });

  const fetchData = useCallback(async () => {
    try {
      // Use Promise.allSettled for better performance and error handling
      const [
        trendingMoviesData,
        trendingShowsData,
        popularData,
        topRatedData,
        nowPlayingData,
        animeData
      ] = await Promise.allSettled([
        getTrending('movie', 'week'),
        getTrending('tv', 'week'),
        getPopular('movie'),
        getTopRated('movie'),
        getNowPlaying('movie'),
        getAnimeContent()
      ]);

      // Process results with error handling
      if (trendingMoviesData.status === 'fulfilled' && trendingMoviesData.value?.results) {
        setTrendingMovies(trendingMoviesData.value.results);
      }
      setLoading(prev => ({ ...prev, trending: false }));

      if (trendingShowsData.status === 'fulfilled' && trendingShowsData.value?.results) {
        setTrendingShows(trendingShowsData.value.results);
      }
      setLoading(prev => ({ ...prev, trendingShows: false }));

      if (popularData.status === 'fulfilled' && popularData.value?.results) {
        setPopularMovies(popularData.value.results);
      }
      setLoading(prev => ({ ...prev, popular: false }));

      if (topRatedData.status === 'fulfilled' && topRatedData.value?.results) {
        setTopRatedMovies(topRatedData.value.results);
      }
      setLoading(prev => ({ ...prev, topRated: false }));

      if (nowPlayingData.status === 'fulfilled' && nowPlayingData.value?.results) {
        setNowPlayingMovies(nowPlayingData.value.results);
      }
      setLoading(prev => ({ ...prev, nowPlaying: false }));

      if (animeData.status === 'fulfilled' && animeData.value?.results) {
        setAnimeContent(animeData.value.results);
      }
      setLoading(prev => ({ ...prev, anime: false }));
    } catch (error) {
      console.error('Error fetching homepage data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <HeroSlideshow />
        
        {/* Telegram Announcement with animation */}
        <div className="bg-gradient-to-r from-aura-purple/20 to-aura-accent/20 py-6 animate-slide-in-right">
          <div className="auraluxx-container flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Join our Telegram Channel</h2>
              <p className="text-white/80">Stay updated with our new websites and latest releases</p>
            </div>
            <Button 
              asChild 
              className="bg-aura-purple hover:bg-aura-darkpurple flex items-center gap-2 hover-scale"
            >
              <a 
                href="https://t.me/auralux1" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.84 14.22 15.51 15.99C15.37 16.74 15.09 16.99 14.83 17.02C14.25 17.07 13.81 16.64 13.25 16.27C12.37 15.69 11.87 15.33 11.02 14.77C10.03 14.12 10.67 13.76 11.24 13.18C11.39 13.03 13.95 10.7 14 10.49C14.0069 10.4589 14.006 10.4267 13.9973 10.3961C13.9886 10.3655 13.9724 10.3376 13.95 10.315C13.89 10.25 13.81 10.27 13.74 10.28C13.65 10.29 12.15 11.24 9.24 13.12C8.78 13.42 8.36 13.57 7.98 13.56C7.57 13.55 6.77 13.35 6.17 13.17C5.44 12.95 4.86 12.83 4.91 12.43C4.94 12.22 5.22 12.01 5.76 11.8C8.87 10.38 10.97 9.45 12.06 9C15.17 7.68 15.92 7.45 16.43 7.45C16.54 7.45 16.8 7.48 16.97 7.62C17.11 7.73 17.15 7.89 17.16 7.99C17.15 8.15 17.14 8.48 16.64 8.8Z" 
                  />
                </svg>
                Join Now
              </a>
            </Button>
          </div>
        </div>
        
        {/* Category buttons with animation */}
        <div className="auraluxx-container animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <CategoryButtons />
        </div>
        
        <div className="auraluxx-container py-6 space-y-8">
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <MediaSlider
              title="Trending Movies"
              items={trendingMovies}
              loading={loading.trending}
              viewAllLink="/movies?filter=trending"
              mediaType="movie"
            />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <MediaSlider
              title="Trending TV Shows"
              items={trendingShows}
              loading={loading.trendingShows}
              viewAllLink="/tv-series?filter=trending"
              mediaType="tv"
            />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <MediaSlider
              title="Now Playing"
              items={nowPlayingMovies}
              loading={loading.nowPlaying}
              viewAllLink="/movies?filter=now_playing"
              mediaType="movie"
            />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <MediaSlider
              title="Popular Movies"
              items={popularMovies}
              loading={loading.popular}
              viewAllLink="/movies?filter=popular"
              mediaType="movie"
            />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <MediaSlider
              title="Top Rated Movies"
              items={topRatedMovies}
              loading={loading.topRated}
              viewAllLink="/movies?filter=top_rated"
              mediaType="movie"
            />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
            <MediaSlider
              title="Popular Anime"
              items={animeContent}
              loading={loading.anime}
              viewAllLink="/anime"
              mediaType="tv"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
