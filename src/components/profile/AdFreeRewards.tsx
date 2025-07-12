
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Gift, Timer, ExternalLink } from 'lucide-react';
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
  const { isAdFree, adFreeTimeLeft, addAdFreeTime } = useAuth();
  const { toast } = useToast();
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adWindow, setAdWindow] = useState<Window | null>(null);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
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
    if (isWatchingAd) return;
    
    setIsWatchingAd(true);
    
    // Open the ad in a new tab with proper focus
    const newWindow = window.open(
      'https://bluetackclasp.com/x5972whr?key=9af361aa4bfff9436548dc8117c52c2a',
      '_blank',
      'width=800,height=600,scrollbars=yes,resizable=yes,location=yes,menubar=no,toolbar=no'
    );
    
    if (newWindow) {
      setAdWindow(newWindow);
      
      // Add focus to the new window
      newWindow.focus();
      
      // Enhanced tracking with better intervals and cross-origin handling
      const checkClosed = setInterval(() => {
        try {
          if (newWindow.closed) {
            clearInterval(checkClosed);
            handleAdWatched();
          }
        } catch (error) {
          // Cross-origin error, assume window is closed
          clearInterval(checkClosed);
          handleAdWatched();
        }
      }, 500); // Check more frequently
      
      // Minimum viewing time of 10 seconds before allowing reward
      let hasMinViewTime = false;
      setTimeout(() => {
        hasMinViewTime = true;
      }, 10000);
      
      // Auto-close after 60 seconds if still open (increased time for better ad viewing)
      setTimeout(() => {
        try {
          if (!newWindow.closed && hasMinViewTime) {
            newWindow.close();
            clearInterval(checkClosed);
            handleAdWatched();
          }
        } catch (error) {
          clearInterval(checkClosed);
          if (hasMinViewTime) {
            handleAdWatched();
          } else {
            setIsWatchingAd(false);
            toast({
              title: 'Ad Not Watched Long Enough',
              description: 'Please watch the ad for at least 10 seconds to earn rewards',
              variant: 'destructive',
            });
          }
        }
      }, 60000);
    } else {
      // Popup blocked
      toast({
        title: 'Popup Blocked',
        description: 'Please allow popups for this site to earn ad-free time',
        variant: 'destructive',
      });
      setIsWatchingAd(false);
    }
  };

  const handleAdWatched = async () => {
    try {
      console.log('Processing ad reward...');
      
      // Call the function and wait for it to complete
      const result = await addAdFreeTime();
      console.log('Add ad-free time result:', result);
      
      // Show success message
      toast({
        title: '🎉 Reward Earned!',
        description: '30 minutes of ad-free time has been added to your account!',
      });
      
      console.log('Ad reward processed successfully');
      
      // Close the dialog after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error: any) {
      console.error('Error adding ad-free time:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add ad-free time',
        variant: 'destructive',
      });
    } finally {
      setIsWatchingAd(false);
      setAdWindow(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (adWindow && !adWindow.closed) {
        adWindow.close();
      }
    };
  }, [adWindow]);

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
                    style={{ 
                      width: `${Math.min(100, (adFreeTimeLeft / (30 * 60)) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Reward Button */}
          <div className="space-y-4">
            <Button
              onClick={handleWatchAd}
              disabled={isWatchingAd}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg relative overflow-hidden group disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center gap-2">
                {isWatchingAd ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Ad...</span>
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

            <div className="text-center space-y-2">
              <p className="text-sm text-white/70">
                Click the button above to open an ad in a new tab.
              </p>
              <p className="text-xs text-white/50">
                Watch for at least 10 seconds, then close the tab to receive your reward.
              </p>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white/5 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-white">How it works:</h3>
            <ul className="text-sm text-white/70 space-y-1">
              <li>• Click the reward button to open an ad</li>
              <li>• The ad will open in a new tab</li>
              <li>• Watch for at least 10 seconds</li>
              <li>• Close the tab when you're done viewing</li>
              <li>• Receive 30 minutes of ad-free browsing</li>
              <li>• Time stacks if you already have ad-free time remaining</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdFreeRewards;
