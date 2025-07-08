import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Timer } from 'lucide-react';

const AdFreeTimer = () => {
  const { isAdFree, adFreeTimeLeft } = useAuth();

  if (!isAdFree || adFreeTimeLeft <= 0) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-30 animate-fade-in">
      <div className="bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-md border border-green-400/30 rounded-full px-4 py-2 shadow-lg">
        <div className="flex items-center gap-2 text-white text-sm font-medium">
          <Timer className="h-4 w-4 animate-pulse" />
          <span className="font-mono font-bold text-base">
            {formatTime(adFreeTimeLeft)}
          </span>
          <span className="text-green-100">Ad-Free</span>
        </div>
      </div>
    </div>
  );
};

export default AdFreeTimer;