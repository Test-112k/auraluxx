
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Calendar } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import MediaSlider from '@/components/common/MediaSlider';
import CategoryButtons from '@/components/common/CategoryButtons';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDetails, getImageUrl } from '@/services/tmdbApi';
import { generatePlayerIframe } from '@/services/streamingApi';
import { formatDate, formatRuntime, truncateText, voteToPercentage } from '@/utils/helpers';

const WatchPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  
  // Get the number of seasons and episodes for TV series
  const numberOfSeasons = details?.number_of_seasons || 0;
  const currentSeasonDetails = details?.seasons?.find((s: any) => s.season_number === selectedSeason);
  const numberOfEpisodes = currentSeasonDetails?.episode_count || 0;

  useEffect(() => {
    const fetchDetails = async () => {
      if (!type || !id) return;
      
      setLoading(true);
      try {
        const mediaType = type === 'movie' ? 'movie' : 'tv';
        const data = await getDetails(mediaType, Number(id));
        setDetails(data);
        console.log("Media details:", data);
        
        // Set initial season and episode if it's a TV show
        if (mediaType === 'tv' && data.seasons && data.seasons.length > 0) {
          const firstSeason = data.seasons.find((s: any) => s.season_number > 0);
          if (firstSeason) {
            setSelectedSeason(firstSeason.season_number);
          }
        }
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [type, id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const createIframeSrcDoc = () => {
    if (!type || !id || !details) return '';
    
    const mediaType = type === 'movie' ? 'movie' : 'tv';
    const title = details.title || details.name || 'Media Player';
    
    // Include season and episode for TV shows
    if (mediaType === 'tv') {
      return generatePlayerIframe(id, mediaType, title, selectedSeason, selectedEpisode);
    }
    
    return generatePlayerIframe(id, mediaType, title);
  };

  // Render loading skeleton
  if (loading) {
    return (
      <MainLayout>
        <div className="auraluxx-container pt-24">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="mb-6 text-white/70 hover:text-white"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
          
          <div className="w-full aspect-video bg-aura-dark animate-pulse rounded-lg mb-8"></div>
          
          <div className="animate-pulse">
            <div className="h-8 bg-white/5 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-white/5 rounded w-1/2 mb-8"></div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-6 bg-white/5 rounded-full w-20"></div>
              ))}
            </div>
            
            <div className="h-4 bg-white/5 rounded w-full mb-2"></div>
            <div className="h-4 bg-white/5 rounded w-full mb-2"></div>
            <div className="h-4 bg-white/5 rounded w-3/4"></div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!details) {
    return (
      <MainLayout>
        <div className="auraluxx-container pt-24">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-white mb-4">Content Not Found</h1>
            <p className="text-white/70 mb-8">
              The requested content is not available.
            </p>
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  const title = details.title || details.name;
  const releaseDate = details.release_date || details.first_air_date;
  const runtime = details.runtime || (details.episode_run_time && details.episode_run_time[0]);
  const genres = details.genres || [];
  const credits = details.credits || { cast: [], crew: [] };
  const similarContent = details.similar?.results || [];
  const isTvShow = type === 'tv';

  return (
    <MainLayout>
      <div className="auraluxx-container pt-24 pb-16">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackClick}
          className="mb-6 text-white/70 hover:text-white"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <CategoryButtons />
        </div>
        
        {/* TV Show Season/Episode Selector */}
        {isTvShow && (
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-white/70">Season</label>
              <Select
                value={selectedSeason.toString()}
                onValueChange={(value) => {
                  setSelectedSeason(parseInt(value));
                  setSelectedEpisode(1); // Reset episode when season changes
                }}
              >
                <SelectTrigger className="w-32 bg-white/10 border-white/10">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent className="bg-aura-darkpurple border-white/10 text-white">
                  {Array.from({ length: numberOfSeasons }, (_, i) => i + 1).map((season) => (
                    <SelectItem key={season} value={season.toString()}>
                      Season {season}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm text-white/70">Episode</label>
              <Select
                value={selectedEpisode.toString()}
                onValueChange={(value) => setSelectedEpisode(parseInt(value))}
              >
                <SelectTrigger className="w-32 bg-white/10 border-white/10">
                  <SelectValue placeholder="Episode" />
                </SelectTrigger>
                <SelectContent className="bg-aura-darkpurple border-white/10 text-white">
                  {Array.from({ length: numberOfEpisodes }, (_, i) => i + 1).map((episode) => (
                    <SelectItem key={episode} value={episode.toString()}>
                      Episode {episode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {/* Video Player */}
        <div className="w-full aspect-video bg-black mb-8 rounded-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            srcDoc={createIframeSrcDoc()}
            title={title}
            frameBorder="0"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
          ></iframe>
        </div>
        
        {/* Content Info */}
        <div className="md:flex gap-8 mb-12">
          {/* Poster */}
          <div className="hidden md:block w-1/4 max-w-xs flex-shrink-0">
            <div className="rounded-lg overflow-hidden">
              <img 
                src={getImageUrl(details.poster_path, 'w500')} 
                alt={title}
                className="w-full h-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
          </div>
          
          {/* Details */}
          <div className="w-full md:w-3/4">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
              {title}
            </h1>
            
            <div className="flex flex-wrap items-center text-white/70 gap-x-4 gap-y-2 mb-4">
              {releaseDate && (
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {formatDate(releaseDate)}
                </div>
              )}
              
              {runtime && (
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  {formatRuntime(runtime)}
                </div>
              )}
              
              {details.vote_average > 0 && (
                <div className="flex items-center">
                  <Star size={16} className="mr-1 text-yellow-500" />
                  {details.vote_average.toFixed(1)}/10
                </div>
              )}
            </div>
            
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {genres.map((genre: any) => (
                  <span 
                    key={genre.id}
                    className="px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
            
            {details.overview && (
              <div className="mb-8">
                <h2 className="text-xl font-medium text-white mb-2">Overview</h2>
                <p className="text-white/80 leading-relaxed">{details.overview}</p>
              </div>
            )}
            
            {/* Cast */}
            {credits.cast && credits.cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-medium text-white mb-4">Cast</h2>
                <div className="flex overflow-x-auto scrollbar-none pb-4 gap-4">
                  {credits.cast.slice(0, 10).map((person: any) => (
                    <div key={person.id} className="flex-shrink-0 w-24">
                      <div className="rounded-lg overflow-hidden bg-white/5 mb-2 aspect-[2/3]">
                        {person.profile_path ? (
                          <img 
                            src={getImageUrl(person.profile_path, 'w185')} 
                            alt={person.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white/30 text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-white line-clamp-1" title={person.name}>
                          {truncateText(person.name, 15)}
                        </p>
                        {person.character && (
                          <p className="text-xs text-white/60 line-clamp-1" title={person.character}>
                            {truncateText(person.character, 15)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Similar Content */}
        {similarContent.length > 0 && (
          <MediaSlider
            title="You Might Also Like"
            items={similarContent}
            mediaType={type as 'movie' | 'tv'}
          />
        )}
        
        {/* Related content by genre */}
        {genres.length > 0 && (
          <div className="pt-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-8">
              More Like This
            </h2>
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full border-4 border-t-aura-purple border-white/10 animate-spin mx-auto"></div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default WatchPage;
