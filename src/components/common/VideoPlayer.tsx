
import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface VideoPlayerProps {
  id: string;
  type: 'movie' | 'tv';
  title: string;
  season?: number;
  episode?: number;
}

const VideoPlayer = ({ id, type, title, season, episode }: VideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const iframeSrc = type === 'tv' 
    ? `https://rivestream.net/embed?type=tv&id=${id}&season=${season}&episode=${episode}` 
    : `https://rivestream.net/embed?type=movie&id=${id}`;

  // Handle iframe load events
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    // Reset loading state when src changes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [id, season, episode]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="flex flex-col w-full mb-8">
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-xl shadow-black/30 border border-white/5">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <LoadingSpinner size="lg" text="Loading video player..." />
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="text-center text-white/70 px-4">
              <p className="text-lg font-medium mb-2">Unable to load video</p>
              <p className="text-sm">Please try again later or check your connection</p>
            </div>
          </div>
        )}
        
        <iframe
          className="absolute inset-0 w-full h-full border-0"
          src={iframeSrc}
          title={title}
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        ></iframe>
      </div>
      
      {/* User guidance message */}
      <div className="mt-3 p-4 rounded-lg bg-white/5 text-white/80 text-sm md:text-base border border-white/10">
        <p>If you are not able to watch properly, or want to watch in different language, change the server in video player.</p>
      </div>
    </div>
  );
};

export default VideoPlayer;
