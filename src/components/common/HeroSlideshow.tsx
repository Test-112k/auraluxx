
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTrending, getImageUrl } from '@/services/tmdbApi';
import { truncateText } from '@/utils/helpers';
import { Skeleton } from '@/components/ui/skeleton';

interface SlideItem {
  id: number;
  title?: string;
  name?: string;
  backdrop_path: string;
  overview: string;
  media_type: 'movie' | 'tv';
}

const HeroSlideshow = () => {
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const slideshowRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const fetchSlides = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTrending('movie', 'day');
      if (data?.results) {
        // Filter items with backdrop images
        const filteredResults = data.results
          .filter((item: any) => item.backdrop_path)
          .slice(0, 5);
        setSlides(filteredResults);
      }
    } catch (error) {
      console.error('Error fetching slideshow data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const nextSlide = useCallback(() => {
    if (!slides.length) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (!slides.length) return;
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  // Handle autoplay
  useEffect(() => {
    if (!slides.length || !autoplay) return;
    
    autoplayRef.current = setInterval(() => {
      nextSlide();
    }, 6000);
    
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [slides, nextSlide, autoplay]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  // Load initial data
  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (slideshowRef.current?.contains(document.activeElement)) {
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

  // Add touch support for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.touches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    // Swipe threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide(); // Swipe left
      } else {
        prevSlide(); // Swipe right
      }
      touchStartX.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  const renderSkeleton = () => (
    <div className="relative w-full h-[50vh] md:h-[70vh] bg-aura-dark/50 animate-pulse">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-aura-purple border-white/20 rounded-full animate-spin"></div>
        <p className="text-white/60 mt-4">Loading featured content...</p>
      </div>
    </div>
  );

  if (loading) return renderSkeleton();
  if (slides.length === 0) return null;

  const slide = slides[currentSlide];
  const title = slide.title || slide.name || '';

  return (
    <div 
      ref={slideshowRef}
      className="relative w-full h-[50vh] md:h-[80vh] overflow-hidden" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
    >
      {/* Backdrop Image with Animation */}
      <div className="absolute inset-0 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-t from-aura-dark via-transparent to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
        <img
          src={getImageUrl(slide.backdrop_path, 'original')}
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-10000 hover:scale-105"
        />
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors focus:outline-none focus:ring-2 focus:ring-aura-purple"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors focus:outline-none focus:ring-2 focus:ring-aura-purple"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 lg:px-16">
        <div className="auraluxx-container max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
            {title}
          </h1>
          <p className="text-white/80 text-base md:text-lg mb-6 line-clamp-3 md:line-clamp-4 animate-fade-in">
            {truncateText(slide.overview, 200)}
          </p>
          <div className="flex items-center space-x-4 animate-fade-in">
            <Link to={`/watch/${slide.media_type}/${slide.id}`}>
              <Button className="bg-aura-purple hover:bg-aura-darkpurple text-white">
                <Play size={18} className="mr-2" /> Watch Now
              </Button>
            </Link>
            <Link to={`/watch/${slide.media_type}/${slide.id}`}>
              <Button variant="outline" className="text-white border-white/50 hover:bg-white/5">
                More Info
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index === currentSlide ? 'w-8 bg-aura-purple' : 'w-2 bg-white/40'
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlideshow;
