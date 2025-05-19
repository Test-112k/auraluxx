
import { useState, useEffect, ReactNode } from 'react';

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
  threshold = 300,
}: InfiniteScrollProps) => {
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || loadingMore || !hasMore) return;
      
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Load more content when user scrolls near the bottom
      if (scrollY + windowHeight >= documentHeight - threshold) {
        loadMoreContent();
      }
    };

    const loadMoreContent = async () => {
      setLoadingMore(true);
      await loadMore();
      setLoadingMore(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
