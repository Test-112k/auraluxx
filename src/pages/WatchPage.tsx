import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import MediaSlider from '@/components/common/MediaSlider';
import CategoryButtons from '@/components/common/CategoryButtons';
import VideoPlayer from '@/components/common/VideoPlayer';
import MediaDetails from '@/components/common/MediaDetails';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDetails, getSimilar } from '@/services/tmdbApi';
import { toast } from '@/components/ui/use-toast';
import Ad from '@/components/ads/Ad';
import { useAds } from '@/contexts/AdContext';

const WatchPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
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

  // Fetch similar content
  const { data: similarData, isLoading: similarLoading } = useQuery({
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
      const firstSeason = details.seasons.find((s: any) => s.season_number > 0);
      if (firstSeason) {
        setSelectedSeason(firstSeason.season_number);
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
  const similarContent = similarData?.results || [];
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
        
        {/* Top banner ad */}
        {isAdEnabled && (
          <div className="flex justify-center my-6 overflow-hidden">
            <Ad size="728x90" className="hidden md:block" />
            <Ad size="320x50" className="md:hidden" />
          </div>
        )}
        
        {/* Main content with side ads */}
        <div className="flex">
          {/* Left sidebar ad */}
          {isAdEnabled && (
            <div className="hidden lg:block lg:w-[160px] flex-shrink-0 mr-4">
              <div className="sticky top-24">
                <Ad size="160x600" />
              </div>
            </div>
          )}
          
          {/* Main content */}
          <div className="flex-1">
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
            <VideoPlayer 
              id={id || ''} 
              type={type as 'movie' | 'tv'} 
              title={title} 
              season={isTvShow ? selectedSeason : undefined}
              episode={isTvShow ? selectedEpisode : undefined}
            />
            
            {/* Ad below video player */}
            {isAdEnabled && (
              <div className="flex justify-center my-6">
                <Ad size="300x250" />
              </div>
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
          
          {/* Right sidebar ad */}
          {isAdEnabled && (
            <div className="hidden lg:block lg:w-[160px] flex-shrink-0 ml-4">
              <div className="sticky top-24">
                <Ad size="160x300" />
              </div>
            </div>
          )}
        </div>
        
        {/* Native ad */}
        {isAdEnabled && (
          <div className="my-8">
            <Ad size="native" />
          </div>
        )}
        
        {/* Similar Content */}
        {similarContent.length > 0 ? (
          <MediaSlider
            title="You Might Also Like"
            items={similarContent}
            mediaType={type as 'movie' | 'tv'}
          />
        ) : similarLoading ? (
          <div className="pt-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <LoadingSkeleton key={i} type="card" />
              ))}
            </div>
          </div>
        ) : null}
        
        {/* Bottom banner ad and social bar */}
        {isAdEnabled && (
          <>
            <div className="flex justify-center my-8">
              <Ad size="728x90" className="hidden md:block" />
              <Ad size="468x60" className="md:hidden" />
            </div>
            <div className="my-6">
              <Ad size="social-bar" />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default WatchPage;
