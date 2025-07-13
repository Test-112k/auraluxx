
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Gift, Timer, ExternalLink, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AdFreeRewardsProps {
  onClose: () => void;
}

const AdFreeRewards = ({ onClose }: AdFreeRewardsProps) => {
  const { isAdFree, adFreeTimeLeft, addAdFreeTime, canWatchAds, maxAdFreeTime } = useAuth();
  const { toast } = useToast();
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adWindow, setAdWindow] = useState<Window | null>(null);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTimeDetailed = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const handleWatchAd = () => {
    if (isWatchingAd || !canWatchAds) return;
    
    console.log('Starting ad watch process...');
    setIsWatchingAd(true);
    
    // Open the new ad URL
    const newWindow = window.open(
      'https://bluetackclasp.com/bqgss8fe?key=1bbd6028b3e0f20c631f53fe9c75cfc5',
      '_blank',
      'width=800,height=600,scrollbars=yes,resizable=yes,location=yes,menubar=no,toolbar=no'
    );
    
    if (newWindow) {
      setAdWindow(newWindow);
      newWindow.focus();
      console.log('Ad window opened successfully');
      
      let hasMinViewTime = false;
      
      // Minimum viewing time of 10 seconds
      const minTimeTimer = setTimeout(() => {
        hasMinViewTime = true;
        console.log('Minimum view time reached (10 seconds)');
      }, 10000);
      
      // Check if window is closed every 500ms
      const checkClosed = setInterval(() => {
        try {
          if (newWindow.closed) {
            console.log('Ad window detected as closed');
            clearInterval(checkClosed);
            clearTimeout(minTimeTimer);
            
            if (hasMinViewTime) {
              console.log('Ad window closed after minimum time, processing reward...');
              handleAdWatched();
            } else {
              console.log('Ad window closed too early, no reward');
              setIsWatchingAd(false);
              toast({
                title: 'Ad Not Watched Long Enough',
                description: 'Please watch the ad for at least 10 seconds to earn rewards',
                variant: 'destructive',
              });
            }
          }
        } catch (error) {
          // Cross-origin error means window is likely closed
          console.log('Cross-origin error detected, assuming window closed');
          clearInterval(checkClosed);
          clearTimeout(minTimeTimer);
          
          if (hasMinViewTime) {
            console.log('Processing reward due to cross-origin closure...');
            handleAdWatched();
          } else {
            console.log('Too early for reward');
            setIsWatchingAd(false);
            toast({
              title: 'Ad Not Watched Long Enough',
              description: 'Please watch the ad for at least 10 seconds to earn rewards',
              variant: 'destructive',
            });
          }
        }
      }, 500);
      
      // Auto-close and reward after 60 seconds if still open
      setTimeout(() => {
        try {
          if (!newWindow.closed) {
            console.log('Auto-closing ad window after 60 seconds');
            newWindow.close();
            clearInterval(checkClosed);
            clearTimeout(minTimeTimer);
            
            if (hasMinViewTime) {
              console.log('Auto-closed after minimum time, processing reward...');
              handleAdWatched();
            }
          }
        } catch (error) {
          console.log('Error in auto-close, processing reward anyway');
          clearInterval(checkClosed);
          clearTimeout(minTimeTimer);
          if (hasMinViewTime) {
            handleAdWatched();
          }
        }
      }, 60000);
      
    } else {
      // Popup blocked
      console.log('Popup was blocked');
      toast({
        title: 'Popup Blocked',
        description: 'Please allow popups for this site to earn ad-free time',
        variant: 'destructive',
      });
      setIsWatchingAd(false);
    }
  };

  const handleAdWatched = async () => {
    console.log('handleAdWatched called - processing reward...');
    
    try {
      console.log('Calling addAdFreeTime...');
      await addAdFreeTime();
      console.log('addAdFreeTime completed successfully');
      
      toast({
        title: '🎉 Reward Earned!',
        description: '30 minutes of ad-free time has been added to your account!',
      });
      
      // Close the dialog after showing success
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error: any) {
      console.error('Error in handleAdWatched:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add ad-free time',
        variant: 'destructive',
      });
    } finally {
      console.log('Cleaning up ad watch state...');
      setIsWatchingAd(false);
      setAdWindow(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (adWindow && !adWindow.closed) {
        console.log('Cleaning up ad window on unmount');
        adWindow.close();
      }
    };
  }, [adWindow]);

  const timeUntilCanWatch = maxAdFreeTime - adFreeTimeLeft;
  const progressPercentage = isAdFree ? (adFreeTimeLeft / maxAdFreeTime) * 100 : 0;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-aura-dark border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <Gift className="h-5 w-5 text-yellow-400" />
            Ad-Free Rewards
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Status */}
          <div className="bg-white/5 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/80">Current Status:</span>
              {isAdFree ? (
                <span className="text-green-400 font-semibold flex items-center gap-1">
                  <Timer className="h-4 w-4 animate-pulse" />
                  Ad-Free Active
                </span>
              ) : (
                <span className="text-red-400 font-semibold">Ads Enabled</span>
              )}
            </div>
            
            {isAdFree && (
              <div className="space-y-2">
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold text-green-400 animate-pulse">
                    {formatTime(adFreeTimeLeft)}
                  </div>
                  <div className="text-xs text-white/60">
                    {formatTimeDetailed(adFreeTimeLeft)} remaining
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, progressPercentage)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Maximum Limit Warning */}
          {!canWatchAds && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-yellow-400">
                <Clock className="h-4 w-4" />
                <span className="font-semibold">Maximum Limit Reached</span>
              </div>
              <p className="text-sm text-yellow-300/80">
                You've reached the 3-hour maximum ad-free time. You can watch more ads after your current time expires.
              </p>
            </div>
          )}

          {/* Reward Button */}
          <div className="space-y-4">
            <Button
              onClick={handleWatchAd}
              disabled={isWatchingAd || !canWatchAds}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg relative overflow-hidden group disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center gap-2">
                {isWatchingAd ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Ad...</span>
                  </>
                ) : !canWatchAds ? (
                  <>
                    <Clock className="h-4 w-4" />
                    <span>Maximum Time Reached</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">🎁</span>
                    <span>Watch Ad to Get +30 Minutes Ad-Free</span>
                    <ExternalLink className="h-4 w-4" />
                  </>
                )}
              </div>
            </Button>

            {canWatchAds && (
              <div className="text-center space-y-2">
                <p className="text-sm text-white/70">
                  Click the button above to open an ad in a new tab.
                </p>
                <p className="text-xs text-white/50">
                  Watch for at least 10 seconds, then close the tab to receive your reward.
                </p>
              </div>
            )}
          </div>

          {/* Limits Information */}
          <div className="bg-white/5 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-white">Limits & Rules:</h3>
            <ul className="text-sm text-white/70 space-y-1">
              <li>• Each ad watched gives 30 minutes of ad-free time</li>
              <li>• Maximum ad-free time limit: 3 hours</li>
              <li>• Watch ads for at least 10 seconds to earn rewards</li>
              <li>• Time stacks if you already have ad-free time remaining</li>
              <li>• Once 3-hour limit is reached, wait for current time to expire</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdFreeRewards;
