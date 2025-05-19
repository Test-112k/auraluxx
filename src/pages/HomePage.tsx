
import { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSlideshow from '@/components/common/HeroSlideshow';
import MediaSlider from '@/components/common/MediaSlider';
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
      // Fetch trending movies
      const trendingMoviesData = await getTrending('movie', 'week');
      if (trendingMoviesData?.results) {
        setTrendingMovies(trendingMoviesData.results);
      }
      setLoading(prev => ({ ...prev, trending: false }));

      // Fetch trending shows
      const trendingShowsData = await getTrending('tv', 'week');
      if (trendingShowsData?.results) {
        setTrendingShows(trendingShowsData.results);
      }
      setLoading(prev => ({ ...prev, trendingShows: false }));

      // Fetch popular movies
      const popularData = await getPopular('movie');
      if (popularData?.results) {
        setPopularMovies(popularData.results);
      }
      setLoading(prev => ({ ...prev, popular: false }));

      // Fetch top rated movies
      const topRatedData = await getTopRated('movie');
      if (topRatedData?.results) {
        setTopRatedMovies(topRatedData.results);
      }
      setLoading(prev => ({ ...prev, topRated: false }));

      // Fetch now playing movies
      const nowPlayingData = await getNowPlaying('movie');
      if (nowPlayingData?.results) {
        setNowPlayingMovies(nowPlayingData.results);
      }
      setLoading(prev => ({ ...prev, nowPlaying: false }));

      // Fetch anime content
      const animeData = await getAnimeContent();
      if (animeData?.results) {
        setAnimeContent(animeData.results);
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
      <HeroSlideshow />
      
      <div className="auraluxx-container py-8">
        <MediaSlider
          title="Trending Movies"
          items={trendingMovies}
          loading={loading.trending}
          viewAllLink="/movies?filter=trending"
          mediaType="movie"
        />
        
        <MediaSlider
          title="Trending TV Shows"
          items={trendingShows}
          loading={loading.trendingShows}
          viewAllLink="/tv-series?filter=trending"
          mediaType="tv"
        />
        
        <MediaSlider
          title="Now Playing"
          items={nowPlayingMovies}
          loading={loading.nowPlaying}
          viewAllLink="/movies?filter=now_playing"
          mediaType="movie"
        />
        
        <MediaSlider
          title="Popular Movies"
          items={popularMovies}
          loading={loading.popular}
          viewAllLink="/movies?filter=popular"
          mediaType="movie"
        />
        
        <MediaSlider
          title="Top Rated Movies"
          items={topRatedMovies}
          loading={loading.topRated}
          viewAllLink="/movies?filter=top_rated"
          mediaType="movie"
        />
        
        <MediaSlider
          title="Popular Anime"
          items={animeContent}
          loading={loading.anime}
          viewAllLink="/anime"
          mediaType="tv"
        />
      </div>
    </MainLayout>
  );
};

export default HomePage;
