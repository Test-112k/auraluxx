
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { getAnimeContent, getImageUrl } from '@/services/tmdbApi';
import { truncateText } from '@/utils/helpers';

interface AnimeSlideItem {
  id: number;
  name: string;
  backdrop_path: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
}

const AnimeHeroSlideshow = () => {
  const [slides, setSlides] = useState<AnimeSlideItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<number, boolean>>({});
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const slideshowRef = useRef<HTMLDivElement>(null);
  
  // Touch handling state
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fetchAnimeSlides = useCallback(async () => {
    setLoading(true);
    try {
      // Get popular anime for slideshow
      const data = await getAnimeContent('popular');
      
      if (data?.results) {
        // Filter anime with backdrop images and limit to 5 for performance
        const filteredResults = data.results
          .filter((item: any) => item.backdrop_path)
          .slice(0, 5);
        
        if (filteredResults.length > 0) {
          setSlides(filteredResults);
          // Pre-load first image
          const firstImage = new Image();
          firstImage.onload = () => {
            setImageLoadingStates(prev => ({ ...prev, [filteredResults[0].id]: true }));
          };
          firstImage.src = getImageUrl(filteredResults[0].backdrop_path, 'w1280');
        }
      }
    } catch (error) {
      console.error('Error fetching anime slideshow data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Progressive image loading
  const handleImageLoad = useCallback((slideId: number) => {
    setImageLoadingStates(prev => ({ ...prev, [slideId]: true }));
  }, []);

  const nextSlide = useCallback(() => {
    if (!slides.length) return;
    const nextIndex = (currentSlide + 1) % slides.length;
    setCurrentSlide(nextIndex);
    
    // Pre-load next image
    const nextSlideData = slides[nextIndex];
    if (nextSlideData && !imageLoadingStates[nextSlideData.id]) {
      const img = new Image();
      img.onload = () => handleImageLoad(nextSlideData.id);
      img.src = getImageUrl(nextSlideData.backdrop_path, 'w1280');
    }
  }, [slides, currentSlide, imageLoadingStates, handleImageLoad]);

  const prevSlide = useCallback(() => {
    if (!slides.length) return;
    const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    setCurrentSlide(prevIndex);
    
    // Pre-load previous image
    const prevSlideData = slides[prevIndex];
    if (prevSlideData && !imageLoadingStates[prevSlideData.id]) {
      const img = new Image();
      img.onload = () => handleImageLoad(prevSlideData.id);
      img.src = getImageUrl(prevSlideData.backdrop_path, 'w1280');
    }
  }, [slides, currentSlide, imageLoadingStates, handleImageLoad]);

  // Handle autoplay
  useEffect(() => {
    if (!slides.length || !autoplay) return;
    
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    
    autoplayRef.current = setInterval(() => {
      nextSlide();
    }, 6000);
    
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [slides, nextSlide, autoplay]);

  // Load initial data
  useEffect(() => {
    fetchAnimeSlides();
  }, [fetchAnimeSlides]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (slideshowRef.current?.contains(document.activeElement) || slideshowRef.current === document.activeElement) {
        if (e.key === 'ArrowLeft') {
          prevSlide();
        } else if (e.key === 'ArrowRight') {
          nextSlide();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch handling
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
    setIsDragging(false);
    setAutoplay(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const currentTouch = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
    
    setTouchEnd(currentTouch);
    
    const deltaX = Math.abs(currentTouch.x - touchStart.x);
    const deltaY = Math.abs(currentTouch.y - touchStart.y);
    
    if (deltaX > deltaY && deltaX > 10) {
      setIsDragging(true);
      e.preventDefault();
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setAutoplay(true);
      return;
    }

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX);

    if (!isVerticalSwipe) {
      if (isLeftSwipe) {
        nextSlide();
      } else if (isRightSwipe) {
        prevSlide();
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
    setIsDragging(false);
    setAutoplay(true);
  };

  const renderSkeleton = () => (
    <div className="relative w-full h-[50vh] md:h-[60vh] bg-aura-dark/50">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-aura-purple border-white/20 rounded-full animate-spin"></div>
        <p className="text-white/60 mt-4">Loading featured anime...</p>
      </div>
    </div>
  );

  if (loading) return renderSkeleton();
  if (slides.length === 0) return null;

  const slide = slides[currentSlide];

  return (
    <div 
      ref={slideshowRef}
      className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden select-none mb-8" 
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      tabIndex={0}
      style={{ touchAction: isDragging ? 'none' : 'pan-y' }}
    >
      {/* Backdrop Images */}
      {slides.map((slideItem, index) => (
        <div 
          key={slideItem.id} 
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-aura-dark via-transparent to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10"></div>
          
          {!imageLoadingStates[slideItem.id] && (
            <div className="w-full h-full bg-aura-dark/30 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-t-aura-purple border-white/20 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-white/40 text-sm">Loading anime...</p>
              </div>
            </div>
          )}
          
          <img
            src={getImageUrl(slideItem.backdrop_path, 'w1280')}
            alt={slideItem.name}
            className={`w-full h-full object-cover object-center transition-all duration-500 ${
              imageLoadingStates[slideItem.id] ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => handleImageLoad(slideItem.id)}
            loading="lazy"
            draggable={false}
          />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center px-4 md:px-6 lg:px-16 pointer-events-none">
        <div className="auraluxx-container max-w-4xl">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-6 animate-fade-in leading-tight drop-shadow-2xl">
            {slide.name}
          </h1>
          <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl mb-4 md:mb-8 line-clamp-2 sm:line-clamp-3 md:line-clamp-4 animate-fade-in max-w-3xl leading-relaxed drop-shadow-xl">
            {truncateText(slide.overview, window.innerWidth < 768 ? 120 : 200)}
          </p>
          <div className="flex flex-row items-center space-x-3 animate-fade-in pointer-events-auto">
            <Link to={`/watch/tv/${slide.id}`}>
              <Button className="bg-aura-purple hover:bg-aura-darkpurple text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg w-full sm:w-auto">
                <Play size={16} className="mr-2" /> Watch Now
              </Button>
            </Link>
            <Link to={`/watch/tv/${slide.id}`}>
              <Button variant="outline" className="text-white border-white/50 hover:bg-white/10 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg w-full sm:w-auto">
                More Info
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all touch-manipulation ${
              index === currentSlide ? 'w-6 md:w-8 bg-aura-purple' : 'w-2 bg-white/40'
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            type="button"
          />
        ))}
      </div>

      {/* Mobile swipe indicators */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-30 md:hidden">
        <div className="w-1 h-8 bg-white/20 rounded-full"></div>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-30 md:hidden">
        <div className="w-1 h-8 bg-white/20 rounded-full"></div>
      </div>
    </div>
  );
};

export default AnimeHeroSlideshow;
