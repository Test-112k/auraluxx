
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
  threshold = 2000, // Further increased threshold for much earlier loading
}: InfiniteScrollProps) => {
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const scrollListenerRef = useRef<() => void>();
  const scrollAttemptCounter = useRef(0);
  
  // Memoize the scroll handler to improve performance
  const handleScroll = useCallback(() => {
    // Prevent multiple simultaneous loading requests
    if (loading || loadingMore || !hasMore || loadingRef.current) return;
    
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Load more content much earlier when scrolling down (increased threshold)
    if (scrollY + windowHeight >= documentHeight - threshold) {
      loadingRef.current = true;
      scrollAttemptCounter.current = 0;
      loadMoreContent();
    }
  }, [loading, loadingMore, hasMore, threshold]);

  const loadMoreContent = useCallback(async () => {
    if (loadingMore) return; // Prevent duplicate loads
    
    setLoadingMore(true);
    console.log('Loading more content...');
    
    try {
      // Immediate loading without delay
      const hasMoreContent = await loadMore();
      setLoadingMore(false);
      loadingRef.current = false;
      
      // If still more content and we're near bottom, load more proactively
      if (hasMoreContent && 
          window.innerHeight + window.scrollY >= 
          document.documentElement.scrollHeight - threshold * 1.5) {
        // No timeout - immediately check for more content
        handleScroll();
      }
    } catch (error) {
      console.error('Error loading more content:', error);
      setLoadingMore(false);
      loadingRef.current = false;
      
      // Retry loading if failed (up to 3 attempts)
      if (scrollAttemptCounter.current < 3) {
        scrollAttemptCounter.current += 1;
        setTimeout(() => {
          loadMoreContent();
        }, 1000); // Wait a second before retrying
      }
    }
  }, [loadMore, threshold, loadingMore, handleScroll]);

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
    
    // Check for content on mount and load initial content if needed
    // This ensures content fills the page on first load
    if (document.documentElement.scrollHeight <= window.innerHeight * 3 && hasMore && !loading) {
      loadMoreContent();
    }
    
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    // Also check when window is resized
    window.addEventListener('resize', scrollHandler, { passive: true });
    
    // Check after images might have loaded to prevent empty spaces
    window.addEventListener('load', scrollHandler);
    
    // Check periodically for a short time after initial load
    const periodicCheck = setInterval(() => {
      scrollHandler();
    }, 500);
    
    // Clear periodic check after 5 seconds
    setTimeout(() => {
      clearInterval(periodicCheck);
    }, 5000);
    
    return () => {
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', scrollHandler);
      window.removeEventListener('load', scrollHandler);
      clearInterval(periodicCheck);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [loadMoreContent, hasMore, loading]);

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
