
import { useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import LoadingSpinner from './LoadingSpinner';

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
  threshold = 800, // Increased threshold for earlier loading, especially on mobile
}: InfiniteScrollProps) => {
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const scrollListenerRef = useRef<() => void>();
  
  // Memoize the scroll handler to improve performance
  const handleScroll = useCallback(() => {
    // Prevent multiple simultaneous loading requests
    if (loading || loadingMore || !hasMore || loadingRef.current) return;
    
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Load more content when user scrolls near the bottom with optimized threshold
    // This triggers loading much earlier, especially important for mobile
    if (scrollY + windowHeight >= documentHeight - threshold) {
      loadingRef.current = true;
      loadMoreContent();
    }
  }, [loading, loadingMore, hasMore, threshold]);

  const loadMoreContent = useCallback(async () => {
    setLoadingMore(true);
    
    // Clear any existing timers
    if (timerRef.current) window.clearTimeout(timerRef.current);
    
    try {
      // Reduced delay for faster response
      timerRef.current = window.setTimeout(async () => {
        await loadMore();
        setLoadingMore(false);
        loadingRef.current = false;
      }, 30);
    } catch (error) {
      console.error('Error loading more content:', error);
      setLoadingMore(false);
      loadingRef.current = false;
    }
  }, [loadMore]);

  // Store the handler in a ref to avoid adding it as a dependency
  useEffect(() => {
    scrollListenerRef.current = handleScroll;
  }, [handleScroll]);
  
  useEffect(() => {
    const scrollHandler = () => {
      if (scrollListenerRef.current) {
        scrollListenerRef.current();
      }
    };
    
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    // Initial check in case the page is already scrolled
    // This helps load content immediately if the page is refreshed while scrolled
    setTimeout(() => handleScroll(), 100);
    
    return () => {
      window.removeEventListener('scroll', scrollHandler);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [handleScroll]);

  return (
    <>
      {children}
      {loadingMore && (
        <div className="flex justify-center my-6">
          <LoadingSpinner size="md" variant="purple" />
        </div>
      )}
    </>
  );
};

export default InfiniteScroll;
