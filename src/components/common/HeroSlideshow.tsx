
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { getTrending, getImageUrl } from '@/services/tmdbApi';
import { truncateText } from '@/utils/helpers';

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

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  useEffect(() => {
    if (slides.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [slides]);

  const renderSkeleton = () => (
    <div className="relative w-full h-[50vh] md:h-[70vh] bg-aura-dark/50 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-aura-purple border-white/20 rounded-full animate-spin"></div>
      </div>
    </div>
  );

  if (loading) return renderSkeleton();
  if (slides.length === 0) return null;

  const slide = slides[currentSlide];
  const title = slide.title || slide.name || '';

  return (
    <div className="relative w-full h-[50vh] md:h-[80vh] overflow-hidden">
      {/* Backdrop Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-aura-dark via-transparent to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
        <img
          src={getImageUrl(slide.backdrop_path, 'original')}
          alt={title}
          className="w-full h-full object-cover object-center"
        />
      </div>

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
