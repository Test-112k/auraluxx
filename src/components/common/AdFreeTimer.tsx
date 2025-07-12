
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

  const getTimeColor = () => {
    if (adFreeTimeLeft > 600) return 'from-green-500 to-emerald-500'; // > 10 minutes
    if (adFreeTimeLeft > 300) return 'from-yellow-500 to-orange-500'; // > 5 minutes
    return 'from-red-500 to-pink-500'; // < 5 minutes
  };

  const getPulseIntensity = () => {
    if (adFreeTimeLeft <= 60) return 'animate-pulse'; // Last minute
    if (adFreeTimeLeft <= 300) return 'animate-pulse'; // Last 5 minutes
    return '';
  };

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-30 animate-fade-in">
      <div className={`bg-gradient-to-r ${getTimeColor()}/90 backdrop-blur-md border border-white/30 rounded-full px-6 py-3 shadow-xl ${getPulseIntensity()}`}>
        <div className="flex items-center gap-3 text-white text-sm font-medium">
          <div className="relative">
            <Timer className="h-5 w-5 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75"></div>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-mono font-bold text-lg tracking-wider">
              {formatTime(adFreeTimeLeft)}
            </span>
            <span className="text-xs text-white/80 font-medium">Ad-Free Time</span>
          </div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default AdFreeTimer;
