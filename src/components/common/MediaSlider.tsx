
import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MediaCard from './MediaCard';

interface Media {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  media_type?: string;
}

interface MediaSliderProps {
  title: string;
  items: Media[];
  viewAllLink?: string;
  loading?: boolean;
  mediaType?: 'movie' | 'tv';
}

const MediaSlider = ({
  title,
  items,
  viewAllLink,
  loading = false,
  mediaType,
}: MediaSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;

    const scrollAmount = 320 * (direction === 'left' ? -1 : 1);
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  if (loading) {
    return (
      <div className="my-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-[2/3] bg-white/5"></div>
              <div className="p-2">
                <div className="h-4 bg-white/5 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-white/5 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!items.length) {
    return null;
  }

  return (
    <div className="my-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
        {viewAllLink && (
          <a href={viewAllLink} className="text-aura-purple hover:text-aura-accent transition-colors">
            View All
          </a>
        )}
      </div>

      <div className="relative group">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        )}

        <div
          className="flex overflow-x-auto scrollbar-none scroll-smooth pb-4 gap-4"
          ref={sliderRef}
          onScroll={handleScroll}
        >
          {items.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-[160px] sm:w-[200px]">
              <MediaCard
                id={item.id}
                title={item.title || item.name || 'Untitled'}
                type={item.media_type as 'movie' | 'tv' || mediaType || 'movie'}
                posterPath={item.poster_path}
                releaseDate={item.release_date || item.first_air_date}
                voteAverage={item.vote_average}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaSlider;
