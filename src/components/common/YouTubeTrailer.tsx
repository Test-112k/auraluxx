
import { useState, useEffect, useRef } from 'react';
import { Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface YouTubeTrailerProps {
  videoKey: string;
  title: string;
}

const YouTubeTrailer = ({ videoKey, title }: YouTubeTrailerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePlayTrailer = () => {
    setIsPlaying(true);
  };

  const handleCloseTrailer = () => {
    setIsPlaying(false);
  };

  if (!videoKey) return null;

  return (
    <div ref={containerRef} className="w-full mb-8">
      <h3 className="text-xl font-semibold text-white mb-4">Official Trailer</h3>
      
      {!isPlaying ? (
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video w-full max-w-full md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
          {isVisible && (
            <>
              <img
                src={`https://img.youtube.com/vi/${videoKey}/maxresdefault.jpg`}
                alt={`${title} trailer thumbnail`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Button
                  onClick={handlePlayTrailer}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-full flex items-center gap-2 text-base md:text-lg lg:text-xl"
                >
                  <Play size={20} className="md:w-6 md:h-6 lg:w-7 lg:h-7" fill="white" />
                  Watch Trailer
                </Button>
              </div>
            </>
          )}
          
          {!isVisible && (
            <div className="w-full h-full bg-white/5 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-t-aura-purple border-white/20 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-white/40 text-sm">Loading trailer...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video w-full max-w-full md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
          <Button
            onClick={handleCloseTrailer}
            className="absolute top-2 right-2 md:top-4 md:right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-1.5 md:p-2 rounded-full"
          >
            <X size={16} className="md:w-5 md:h-5" />
          </Button>
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
            title={`${title} trailer`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};

export default YouTubeTrailer;
