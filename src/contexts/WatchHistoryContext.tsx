import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface WatchHistoryItem {
  id: string;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  media_type: 'movie' | 'tv';
  progress: number; // 0-100 percentage
  timestamp: number;
  episode?: number;
  season?: number;
}

interface WatchHistoryContextType {
  watchHistory: WatchHistoryItem[];
  addToWatchHistory: (item: WatchHistoryItem) => void;
  updateProgress: (id: string, progress: number, episode?: number, season?: number) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

const WatchHistoryContext = createContext<WatchHistoryContextType>({
  watchHistory: [],
  addToWatchHistory: () => {},
  updateProgress: () => {},
  removeFromHistory: () => {},
  clearHistory: () => {},
});

export const useWatchHistory = () => useContext(WatchHistoryContext);

export const WatchHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('auraluxx-watch-history');
    if (stored) {
      try {
        setWatchHistory(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading watch history:', error);
      }
    }
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem('auraluxx-watch-history', JSON.stringify(watchHistory));
  }, [watchHistory]);

  const addToWatchHistory = (item: WatchHistoryItem) => {
    setWatchHistory(prev => {
      // Remove existing entry if it exists
      const filtered = prev.filter(historyItem => historyItem.id !== item.id);
      // Add new entry at the beginning
      return [item, ...filtered].slice(0, 20); // Keep only last 20 items
    });
  };

  const updateProgress = (id: string, progress: number, episode?: number, season?: number) => {
    setWatchHistory(prev => 
      prev.map(item => 
        item.id === id 
          ? { 
              ...item, 
              progress, 
              timestamp: Date.now(),
              episode: episode ?? item.episode,
              season: season ?? item.season
            }
          : item
      )
    );
  };

  const removeFromHistory = (id: string) => {
    setWatchHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setWatchHistory([]);
    localStorage.removeItem('auraluxx-watch-history');
  };

  return (
    <WatchHistoryContext.Provider value={{
      watchHistory,
      addToWatchHistory,
      updateProgress,
      removeFromHistory,
      clearHistory,
    }}>
      {children}
    </WatchHistoryContext.Provider>
  );
};