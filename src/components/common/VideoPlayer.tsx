
import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface VideoPlayerProps {
  id: string;
  type: 'movie' | 'tv';
  title: string;
  season?: number;
  episode?: number;
  apiType: 'embed' | 'torrent' | 'agg';
}

const VideoPlayer = ({ id, type, title, season, episode, apiType }: VideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const getIframeSrc = () => {
    const baseUrl = 'https://rivestream.net';
    
    switch (apiType) {
      case 'torrent':
        return type === 'tv' 
          ? `${baseUrl}/embed/torrent?type=tv&id=${id}&season=${season}&episode=${episode}` 
          : `${baseUrl}/embed/torrent?type=movie&id=${id}`;
      
      case 'agg':
        return type === 'tv' 
          ? `${baseUrl}/embed/agg?type=tv&id=${id}&season=${season}&episode=${episode}` 
          : `${baseUrl}/embed/agg?type=movie&id=${id}`;
      
      default: // embed
        return type === 'tv' 
          ? `${baseUrl}/embed?type=tv&id=${id}&season=${season}&episode=${episode}` 
          : `${baseUrl}/embed?type=movie&id=${id}`;
    }
  };

  const iframeSrc = getIframeSrc();

  // Handle iframe load events with longer timeout for slow connections
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    // Longer timeout for slow connections
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 8000); // Increased timeout for slow connections
    
    return () => clearTimeout(timer);
  }, [id, season, episode, apiType]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="flex flex-col w-full mb-8">
      {/* Enhanced mobile video player with better sizing */}
      <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-xl shadow-black/30 border border-white/5 max-w-[1400px] mx-auto
        h-[60vh] sm:h-[65vh] md:h-auto
        md:aspect-[16/9] 
        lg:aspect-[16/8.5]
        min-h-[300px] sm:min-h-[350px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <LoadingSpinner size="lg" text="Loading video player..." />
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="text-center text-white/70 px-4">
              <p className="text-lg font-medium mb-2">Unable to load video</p>
              <p className="text-sm">Please try a different API or check your connection</p>
            </div>
          </div>
        )}
        
        <iframe
          key={iframeSrc} // Force re-render when URL changes
          className="absolute inset-0 w-full h-full border-0"
          src={iframeSrc}
          title={title}
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen; cast; display-capture; camera; microphone"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-presentation allow-top-navigation-by-user-activation"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          loading="lazy"
        ></iframe>
      </div>
      
      {/* User guidance message - more compact on mobile */}
      <div className="mt-3 p-3 md:p-4 rounded-lg bg-white/5 text-white/80 text-xs sm:text-sm border border-white/10 max-w-[1400px] mx-auto">
        <p>If the video doesn't load, try switching to a different API above or change the server within the video player.</p>
      </div>
    </div>
  );
};

export default VideoPlayer;
