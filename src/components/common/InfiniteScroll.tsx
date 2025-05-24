
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
  threshold = 4000, // Further increased threshold for much earlier loading
}: InfiniteScrollProps) => {
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const scrollListenerRef = useRef<() => void>();
  const scrollAttemptCounter = useRef(0);
  const lastScrollPosition = useRef(0);
  
  // Force layout recalculation to ensure accurate measurements
  const forceLayout = useCallback(() => {
    // Read layout property to force layout calculation
    document.body.offsetHeight;
    return true;
  }, []);
  
  // Memoize the scroll handler to improve performance
  const handleScroll = useCallback(() => {
    // Prevent multiple simultaneous loading requests
    if (loading || loadingMore || !hasMore || loadingRef.current) return;
    
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Log only if scrolling down or position changed significantly
    if (Math.abs(scrollY - lastScrollPosition.current) > 50) {
      console.log(`Scroll position: ${scrollY + windowHeight}, Document height: ${documentHeight}, Threshold: ${documentHeight - threshold}`);
      lastScrollPosition.current = scrollY;
    }
    
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
      // Force layout calculation before loading
      forceLayout();
      
      // Immediate loading without delay
      const hasMoreContent = await loadMore();
      console.log(`Load more result: ${hasMoreContent ? 'More content available' : 'No more content'}`);
      
      setLoadingMore(false);
      loadingRef.current = false;
      
      // Wait a tiny bit for the DOM to update with new content
      setTimeout(() => {
        // Force another layout calculation after content is added
        forceLayout();
        
        // If still more content and we're near bottom, load more proactively
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        if (hasMoreContent && windowHeight + scrollY >= documentHeight - threshold * 1.5) {
          console.log('Still near bottom after loading, loading more content proactively');
          // Small delay to prevent rapid successive loads
          setTimeout(() => {
            handleScroll();
          }, 50);
        }
      }, 50);
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
  }, [loadMore, threshold, loadingMore, handleScroll, forceLayout]);

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
      forceLayout(); // Force layout calculation
      if (document.documentElement.scrollHeight <= window.innerHeight * 1.5 && hasMore && !loading && !loadingMore) {
        console.log('Page not filled, loading initial content');
        loadMoreContent();
      }
    };
    
    // Run initial load check immediately and after a short delay to allow for render
    checkInitialLoad();
    setTimeout(checkInitialLoad, 100);
    
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    // Also check when window is resized
    window.addEventListener('resize', scrollHandler, { passive: true });
    
    // Check after images might have loaded to prevent empty spaces
    window.addEventListener('load', scrollHandler);
    
    // Check periodically for a short time after initial load
    const periodicCheckInterval = 250; // Faster checks
    const periodicCheck = setInterval(() => {
      scrollHandler();
      console.log('Periodic scroll check');
    }, periodicCheckInterval);
    
    // Clear periodic check after 30 seconds
    setTimeout(() => {
      clearInterval(periodicCheck);
    }, 30000); // Extended check period
    
    // Force multiple initial checks to ensure content loads
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        forceLayout();
        scrollHandler();
        console.log(`Force scroll check #${i+1}`);
      }, i * 500);
    }
    
    return () => {
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', scrollHandler);
      window.removeEventListener('load', scrollHandler);
      clearInterval(periodicCheck);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [loadMoreContent, hasMore, loading, loadingMore, forceLayout]);

  // Force an additional check when the component has mounted
  useEffect(() => {
    if (hasMore && !loading && !loadingMore) {
      const timer = setTimeout(() => {
        forceLayout();
        handleScroll();
        console.log('Additional initial content check');
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [hasMore, loading, loadingMore, handleScroll, forceLayout]);

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
