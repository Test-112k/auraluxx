
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
  threshold = 3000, // Further increased threshold for much earlier loading
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
    
    console.log(`Scroll position: ${scrollY + windowHeight}, Document height: ${documentHeight}, Threshold: ${documentHeight - threshold}`);
    
    // Load more content much earlier when scrolling down (increased threshold)
    if (scrollY + windowHeight >= documentHeight - threshold) {
      console.log('Scroll threshold reached, loading more content...');
      loadingRef.current = true;
      scrollAttemptCounter.current = 0;
      loadMoreContent();
    }
  }, [loading, loadingMore, hasMore, threshold]);

  const loadMoreContent = useCallback(async () => {
    if (loadingMore) {
      console.log('Already loading more content, skipping request');
      return; // Prevent duplicate loads
    }
    
    setLoadingMore(true);
    console.log('Loading more content...');
    
    try {
      // Immediate loading without delay
      const hasMoreContent = await loadMore();
      console.log(`Load more result: ${hasMoreContent ? 'More content available' : 'No more content'}`);
      
      setLoadingMore(false);
      loadingRef.current = false;
      
      // If still more content and we're near bottom, load more proactively
      if (hasMoreContent && 
          window.innerHeight + window.scrollY >= 
          document.documentElement.scrollHeight - threshold * 1.5) {
        console.log('Still near bottom after loading, loading more content proactively');
        // Small delay to prevent rapid successive loads
        setTimeout(() => {
          handleScroll();
        }, 100);
      }
    } catch (error) {
      console.error('Error loading more content:', error);
      setLoadingMore(false);
      loadingRef.current = false;
      
      // Retry loading if failed (up to 5 attempts)
      if (scrollAttemptCounter.current < 5) {
        scrollAttemptCounter.current += 1;
        console.log(`Retrying load, attempt ${scrollAttemptCounter.current}/5`);
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
    const checkInitialLoad = () => {
      console.log('Checking initial load conditions');
      if (document.documentElement.scrollHeight <= window.innerHeight * 2 && hasMore && !loading && !loadingMore) {
        console.log('Page not filled, loading initial content');
        loadMoreContent();
      }
    };
    
    // Run initial load check after a short delay to allow for render
    setTimeout(checkInitialLoad, 100); // Reduced delay for faster initial load
    
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    // Also check when window is resized
    window.addEventListener('resize', scrollHandler, { passive: true });
    
    // Check after images might have loaded to prevent empty spaces
    window.addEventListener('load', scrollHandler);
    
    // Check periodically for a short time after initial load
    const periodicCheck = setInterval(() => {
      scrollHandler();
      console.log('Periodic scroll check');
    }, 500); // Faster checks
    
    // Clear periodic check after 15 seconds
    setTimeout(() => {
      clearInterval(periodicCheck);
    }, 15000); // Extended check period
    
    // Force an initial check
    scrollHandler();
    
    return () => {
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', scrollHandler);
      window.removeEventListener('load', scrollHandler);
      clearInterval(periodicCheck);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [loadMoreContent, hasMore, loading, loadingMore]);

  // Force an initial check for content
  useEffect(() => {
    if (hasMore && !loading && !loadingMore) {
      const timer = setTimeout(() => {
        handleScroll();
      }, 200); // Reduced timeout for faster initial check
      
      return () => clearTimeout(timer);
    }
  }, [hasMore, loading, loadingMore, handleScroll]);

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
