
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
  threshold = 600, // Increased threshold for earlier loading
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
    
    // Load more content earlier when scrolling down (increased threshold)
    if (scrollY + windowHeight >= documentHeight - threshold) {
      loadingRef.current = true;
      loadMoreContent();
    }
  }, [loading, loadingMore, hasMore, threshold]);

  const loadMoreContent = useCallback(async () => {
    setLoadingMore(true);
    
    try {
      // Remove the timeout delay for faster response
      await loadMore();
      setLoadingMore(false);
      loadingRef.current = false;
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
    
    // Check for content on mount if the page doesn't have a scrollbar yet
    if (document.documentElement.scrollHeight <= window.innerHeight && hasMore && !loading) {
      loadMoreContent();
    }
    
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', scrollHandler);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

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
