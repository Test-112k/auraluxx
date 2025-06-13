import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import MediaSlider from '@/components/common/MediaSlider';
import CategoryButtons from '@/components/common/CategoryButtons';
import VideoPlayer from '@/components/common/VideoPlayer';
import ApiSelector from '@/components/common/ApiSelector';
import MediaDetails from '@/components/common/MediaDetails';
import YouTubeTrailer from '@/components/common/YouTubeTrailer';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDetails, getSimilar } from '@/services/tmdbApi';
import { toast } from '@/components/ui/use-toast';
import Ad from '@/components/ads/Ad';
import { useAds } from '@/contexts/AdContext';

const WatchPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [selectedApi, setSelectedApi] = useState<'embed' | 'torrent' | 'agg'>('embed');
  const [seasonOpen, setSeasonOpen] = useState(false);
  const [episodeOpen, setEpisodeOpen] = useState(false);
  const { isAdEnabled } = useAds();
  
  // Fetch media details
  const { data: details, isLoading: detailsLoading, error: detailsError } = useQuery({
    queryKey: ['mediaDetails', type, id],
    queryFn: async () => {
      if (!type || !id) throw new Error('Missing parameters');
      const mediaType = type === 'movie' ? 'movie' : 'tv';
      return await getDetails(mediaType, Number(id));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch similar/recommended content using getSimilar
  const { data: recommendationsData, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['similar', type, id],
    queryFn: async () => {
      if (!type || !id) throw new Error('Missing parameters');
      const mediaType = type === 'movie' ? 'movie' : 'tv';
      return await getSimilar(mediaType, Number(id));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!details,
  });
  
  // Set initial season and episode when details load
  useEffect(() => {
    if (details && type === 'tv' && details.seasons && details.seasons.length > 0) {
      const firstValidSeason = details.seasons.find((s: any) => s.season_number > 0);
      if (firstValidSeason) {
        setSelectedSeason(firstValidSeason.season_number);
        setSelectedEpisode(1);
      }
    }
  }, [details, type]);

  const handleBackClick = () => {
    navigate(-1);
  };

  // Get the number of seasons and episodes for TV series
  const numberOfSeasons = details?.number_of_seasons || 0;
  const currentSeasonDetails = details?.seasons?.find((s: any) => s.season_number === selectedSeason);
  const numberOfEpisodes = currentSeasonDetails?.episode_count || 0;

  // Get trailer video key - improved to work for all content types
  const getTrailerVideoKey = () => {
    if (!details?.videos?.results) return null;
    
    // Find official trailer first
    const officialTrailer = details.videos.results.find((video: any) => 
      video.site === 'YouTube' && 
      video.type === 'Trailer' &&
      video.official === true
    );
    
    // Find any trailer as fallback
    const anyTrailer = details.videos.results.find((video: any) => 
      video.site === 'YouTube' && 
      (video.type === 'Trailer' || video.type === 'Teaser')
    );
    
    return officialTrailer?.key || anyTrailer?.key || null;
  };

  // Render loading skeleton
  if (detailsLoading) {
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
  
  if (detailsError || !details) {
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
  const recommendedContent = recommendationsData?.results || [];
  const isTvShow = type === 'tv';
  const posterPath = details.poster_path;
  const posterUrl = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null;
  const trailerVideoKey = getTrailerVideoKey();

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
        
        {/* Add mobile movie thumbnail */}
        {posterUrl && (
          <div className="block md:hidden mb-6">
            <div className="flex justify-center">
              <img 
                src={posterUrl} 
                alt={title} 
                className="w-40 h-auto rounded-lg shadow-lg border border-white/10"
              />
            </div>
            <h1 className="text-xl font-bold text-center mt-3 mb-4">{title}</h1>
          </div>
        )}
        
        {/* Top banner ad - separated from video player */}
        {isAdEnabled && (
          <div className="flex justify-center mb-8 overflow-hidden bg-white/5 p-2 rounded-lg max-w-[1400px] mx-auto">
            <Ad size="320x50" />
          </div>
        )}
        
        {/* Main content */}
        <div className="max-w-[1400px] mx-auto">
          {/* Fixed TV Show Season/Episode Selector */}
          {isTvShow && numberOfSeasons > 0 && (
            <div className="bg-white/5 rounded-xl p-4 md:p-6 mb-6 border border-white/10 relative">
              <h3 className="text-lg font-semibold text-white mb-4">Episode Selection</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Season Selector */}
                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-white/70 block">Season</label>
                  <Popover open={seasonOpen} onOpenChange={setSeasonOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={seasonOpen}
                        className="w-full justify-between bg-white/10 border-white/10 text-white hover:bg-white/20 h-12"
                      >
                        <span className="font-medium">Season {selectedSeason}</span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-full max-w-[300px] p-0 bg-aura-dark/98 backdrop-blur-lg border-white/20 shadow-2xl"
                      align="start"
                      side="bottom"
                      sideOffset={4}
                      avoidCollisions={true}
                      collisionPadding={16}
                      style={{ zIndex: 50 }}
                    >
                      <Command className="bg-transparent">
                        <CommandInput 
                          placeholder="Search seasons..." 
                          className="border-none bg-transparent text-white placeholder:text-white/50 h-10"
                        />
                        <CommandList className="max-h-48">
                          <CommandEmpty className="py-6 text-center text-white/70">No seasons found.</CommandEmpty>
                          <CommandGroup className="p-2">
                            {details.seasons
                              ?.filter((season: any) => season.season_number > 0)
                              .map((season: any) => (
                                <CommandItem
                                  key={season.season_number}
                                  value={`season-${season.season_number}`}
                                  onSelect={() => {
                                    setSelectedSeason(season.season_number);
                                    setSelectedEpisode(1);
                                    setSeasonOpen(false);
                                  }}
                                  className="text-white hover:bg-white/10 cursor-pointer rounded-lg p-2 flex items-center justify-between"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">Season {season.season_number}</span>
                                    <span className="text-xs text-white/60">
                                      {season.episode_count} episodes
                                    </span>
                                  </div>
                                  <Check
                                    className={cn(
                                      "h-4 w-4 text-aura-accent",
                                      selectedSeason === season.season_number ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Episode Selector */}
                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-white/70 block">Episode</label>
                  <Popover open={episodeOpen} onOpenChange={setEpisodeOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={episodeOpen}
                        className="w-full justify-between bg-white/10 border-white/10 text-white hover:bg-white/20 h-12"
                        disabled={numberOfEpisodes === 0}
                      >
                        <span className="font-medium">Episode {selectedEpisode}</span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-full max-w-[300px] p-0 bg-aura-dark/98 backdrop-blur-lg border-white/20 shadow-2xl"
                      align="start"
                      side="bottom"
                      sideOffset={4}
                      avoidCollisions={true}
                      collisionPadding={16}
                      style={{ zIndex: 50 }}
                    >
                      <Command className="bg-transparent">
                        <CommandInput 
                          placeholder="Search episodes..." 
                          className="border-none bg-transparent text-white placeholder:text-white/50 h-10"
                        />
                        <CommandList className="max-h-48">
                          <CommandEmpty className="py-6 text-center text-white/70">No episodes found.</CommandEmpty>
                          <CommandGroup className="p-2">
                            {Array.from({ length: numberOfEpisodes }, (_, i) => i + 1).map((episode) => (
                              <CommandItem
                                key={episode}
                                value={`episode-${episode}`}
                                onSelect={() => {
                                  setSelectedEpisode(episode);
                                  setEpisodeOpen(false);
                                }}
                                className="text-white hover:bg-white/10 cursor-pointer rounded-lg p-2 flex items-center justify-between"
                              >
                                <span className="font-medium">Episode {episode}</span>
                                <Check
                                  className={cn(
                                    "h-4 w-4 text-aura-accent",
                                    selectedEpisode === episode ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}
          
          {/* API Selector */}
          <ApiSelector 
            selectedApi={selectedApi}
            onApiChange={setSelectedApi}
          />
          
          {/* Video Player */}
          <VideoPlayer 
            id={id || ''} 
            type={type as 'movie' | 'tv'} 
            title={title} 
            season={isTvShow ? selectedSeason : undefined}
            episode={isTvShow ? selectedEpisode : undefined}
            apiType={selectedApi}
          />
          
          {/* Ad below video player - clearly separated */}
          {isAdEnabled && (
            <div className="flex justify-center my-10 bg-white/5 p-3 rounded-lg">
              <Ad size="300x250" />
            </div>
          )}
          
          {/* YouTube Trailer - now shows for all content types */}
          {trailerVideoKey && (
            <YouTubeTrailer 
              videoKey={trailerVideoKey}
              title={title}
            />
          )}
          
          {/* Content Info */}
          <MediaDetails 
            title={title}
            releaseDate={releaseDate}
            runtime={runtime}
            voteAverage={details.vote_average}
            genres={genres}
            overview={details.overview}
            posterPath={details.poster_path}
            cast={credits.cast || []}
          />
        </div>
        
        {/* Native ad - separated with margin */}
        {isAdEnabled && (
          <div className="my-12 max-w-[1400px] mx-auto bg-white/5 p-3 rounded-lg">
            <Ad size="native" />
          </div>
        )}
        
        {/* Recommended Content */}
        {recommendedContent.length > 0 ? (
          <MediaSlider
            title="Recommended for You"
            items={recommendedContent}
            mediaType={type as 'movie' | 'tv'}
          />
        ) : recommendationsLoading ? (
          <div className="pt-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Recommended for You</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <LoadingSkeleton key={i} type="card" />
              ))}
            </div>
          </div>
        ) : null}
        
        {/* Bottom banner ad */}
        {isAdEnabled && (
          <div className="flex justify-center mt-12 mb-8 bg-white/5 p-2 rounded-lg max-w-[1400px] mx-auto">
            <Ad size="320x50" />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default WatchPage;
