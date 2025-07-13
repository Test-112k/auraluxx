
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Gift, X, Timer } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AdFreeExpiredPopupProps {
  open: boolean;
  onClose: () => void;
}

const AdFreeExpiredPopup = ({ open, onClose }: AdFreeExpiredPopupProps) => {
  const { addAdFreeTime } = useAuth();
  const { toast } = useToast();
  const [isWatchingAd, setIsWatchingAd] = useState(false);

  const handleWatchAd = () => {
    if (isWatchingAd) return;
    
    console.log('Expired popup: Starting ad watch process...');
    setIsWatchingAd(true);
    
    // Open the new ad URL
    const newWindow = window.open(
      'https://bluetackclasp.com/bqgss8fe?key=1bbd6028b3e0f20c631f53fe9c75cfc5',
      '_blank',
      'width=800,height=600,scrollbars=yes,resizable=yes'
    );
    
    if (newWindow) {
      console.log('Expired popup: Ad window opened');
      let hasMinViewTime = false;
      
      // Minimum viewing time of 10 seconds
      const minTimeTimer = setTimeout(() => {
        hasMinViewTime = true;
        console.log('Expired popup: Minimum view time reached');
      }, 10000);
      
      // Check if the window is closed
      const checkClosed = setInterval(() => {
        try {
          if (newWindow.closed) {
            console.log('Expired popup: Window closed detected');
            clearInterval(checkClosed);
            clearTimeout(minTimeTimer);
            
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
        } catch (error) {
          // Cross-origin error, assume closed
          clearInterval(checkClosed);
          clearTimeout(minTimeTimer);
          if (hasMinViewTime) {
            handleAdWatched();
          } else {
            setIsWatchingAd(false);
          }
        }
      }, 500);
      
      // Auto-close after 60 seconds if still open
      setTimeout(() => {
        try {
          if (!newWindow.closed) {
            newWindow.close();
            clearInterval(checkClosed);
            clearTimeout(minTimeTimer);
            if (hasMinViewTime) {
              handleAdWatched();
            }
          }
        } catch (error) {
          clearInterval(checkClosed);
          clearTimeout(minTimeTimer);
          if (hasMinViewTime) {
            handleAdWatched();
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
    console.log('Expired popup: Processing ad reward...');
    try {
      await addAdFreeTime();
      console.log('Expired popup: Reward processed successfully');
      toast({
        title: '🎉 Reward Earned!',
        description: '30 minutes of ad-free time has been added!',
      });
      onClose();
    } catch (error: any) {
      console.error('Expired popup: Error processing reward:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add ad-free time',
        variant: 'destructive',
      });
    } finally {
      setIsWatchingAd(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-aura-dark border-white/10 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <Timer className="h-5 w-5 text-red-400" />
              Ad-Free Time Expired
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center space-y-3">
            <div className="text-lg text-white/80">
              Your ad-free browsing time has expired.
            </div>
            <div className="text-sm text-white/60">
              Watch a quick ad to enjoy 30 minutes of ad-free browsing!
            </div>
          </div>

          <Button
            onClick={handleWatchAd}
            disabled={isWatchingAd}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg"
          >
            {isWatchingAd ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Opening Ad...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Gift className="h-5 w-5" />
                <span>Watch Ad for 30 Minutes Ad-Free</span>
              </div>
            )}
          </Button>

          <div className="text-center text-xs text-white/50">
            Close the ad tab when finished to receive your reward
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdFreeExpiredPopup;
