
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
  threshold = 800, // Further increased threshold for even earlier loading
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
    
    // Load more content much earlier when scrolling down (increased threshold)
    if (scrollY + windowHeight >= documentHeight - threshold) {
      loadingRef.current = true;
      loadMoreContent();
    }
  }, [loading, loadingMore, hasMore, threshold]);

  const loadMoreContent = useCallback(async () => {
    if (loadingMore) return; // Prevent duplicate loads
    
    setLoadingMore(true);
    
    try {
      // Immediate loading without delay
      const hasMoreContent = await loadMore();
      setLoadingMore(false);
      loadingRef.current = false;
      
      // If still more content and we're near bottom, load more proactively
      if (hasMoreContent && 
          window.innerHeight + window.scrollY >= 
          document.documentElement.scrollHeight - threshold * 1.5) {
        // Small timeout to prevent UI jank
        setTimeout(() => {
          handleScroll();
        }, 300);
      }
    } catch (error) {
      console.error('Error loading more content:', error);
      setLoadingMore(false);
      loadingRef.current = false;
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
    if (document.documentElement.scrollHeight <= window.innerHeight * 1.5 && hasMore && !loading) {
      loadMoreContent();
    }
    
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', scrollHandler);
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
