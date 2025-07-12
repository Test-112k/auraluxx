import React from 'react';
import { useWatchHistory } from '@/contexts/WatchHistoryContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Play, Clock, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ContinueWatching = () => {
  const { watchHistory, removeFromHistory } = useWatchHistory();
  const { t } = useLanguage();

  if (watchHistory.length === 0) {
    return null;
  }

  const formatProgress = (progress: number) => {
    return `${Math.round(progress)}%`;
  };

  const getWatchLink = (item: any) => {
    if (item.media_type === 'movie') {
      return `/watch/movie/${item.id}`;
    } else {
      return `/watch/tv/${item.id}${item.season && item.episode ? `?s=${item.season}&e=${item.episode}` : ''}`;
    }
  };

  return (
    <div className="auraluxx-container py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Clock className="h-6 w-6 text-aura-purple" />
          {t('Continue Watching')}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {watchHistory.slice(0, 12).map((item) => (
          <div key={item.id} className="relative group">
            <Link to={getWatchLink(item)} className="block">
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800">
                <img
                  src={item.poster_path 
                    ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
                    : '/placeholder.svg'
                  }
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                  <div className="w-full bg-white/20 rounded-full h-1 mb-1">
                    <div 
                      className="bg-aura-purple h-1 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-white/80">
                    {formatProgress(item.progress)} {t('watched')}
                  </div>
                </div>

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-aura-purple/90 rounded-full p-3">
                    <Play className="h-6 w-6 text-white" fill="white" />
                  </div>
                </div>

                {/* Episode info for TV shows */}
                {item.media_type === 'tv' && item.season && item.episode && (
                  <div className="absolute top-2 left-2 bg-black/70 rounded px-2 py-1 text-xs text-white">
                    S{item.season}E{item.episode}
                  </div>
                )}
              </div>
            </Link>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-6 w-6"
              onClick={(e) => {
                e.preventDefault();
                removeFromHistory(item.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>

            <div className="mt-2">
              <h3 className="text-white text-sm font-medium line-clamp-2 group-hover:text-aura-purple transition-colors">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContinueWatching;