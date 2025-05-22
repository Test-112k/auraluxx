
import { useState, useEffect, ReactNode, useRef } from 'react';

interface InfiniteScrollProps {
  loadMore: () => Promise<boolean>; // Function returns true if more data is available
  children: ReactNode;
  loading: boolean;
  hasMore: boolean;
  threshold?: number;
}

const InfiniteScroll = ({
  loadMore,
  children,
  loading,
  hasMore,
  threshold = 500, // Increased threshold for earlier loading
}: InfiniteScrollProps) => {
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Prevent multiple simultaneous loading requests
      if (loading || loadingMore || !hasMore || loadingRef.current) return;
      
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Load more content when user scrolls near the bottom with increased threshold
      if (scrollY + windowHeight >= documentHeight - threshold) {
        loadingRef.current = true;
        loadMoreContent();
      }
    };

    const loadMoreContent = async () => {
      setLoadingMore(true);
      
      // Clear any existing timers
      if (timerRef.current) window.clearTimeout(timerRef.current);
      
      // Add a small delay to batch rapid scroll events
      timerRef.current = window.setTimeout(async () => {
        await loadMore();
        setLoadingMore(false);
        loadingRef.current = false;
      }, 100);
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [loading, loadingMore, hasMore, loadMore, threshold]);

  return (
    <>
      {children}
      {loadingMore && (
        <div className="flex justify-center my-8">
          <div className="w-10 h-10 rounded-full border-4 border-white/10 border-t-aura-purple animate-spin"></div>
        </div>
      )}
    </>
  );
};

export default InfiniteScroll;
