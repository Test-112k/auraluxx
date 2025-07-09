import React from 'react';
import { X, Gift, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface SignupPromotionPopupProps {
  open: boolean;
  onClose: () => void;
}

const SignupPromotionPopup = ({ open, onClose }: SignupPromotionPopupProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-aura-dark border-white/10 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <Gift className="h-5 w-5 text-yellow-400" />
              Free Ad-Free Experience
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
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg p-4 border border-yellow-400/30">
              <div className="flex items-center justify-center gap-2 text-yellow-400 font-bold text-lg mb-2">
                <Clock className="h-5 w-5" />
                <span>1 Hour FREE</span>
              </div>
              <p className="text-white/80 text-sm">
                Sign up now and enjoy 1 full hour of ad-free browsing!
              </p>
            </div>
            
            <div className="text-white/70 text-sm space-y-2">
              <p>✨ No ads interrupting your viewing</p>
              <p>🎬 Unlimited streaming access</p>
              <p>⚡ Faster page loading</p>
              <p>🎁 Plus earn more ad-free time by watching ads</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              asChild
              className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold text-lg"
            >
              <Link to="/login">
                <Gift className="h-5 w-5 mr-2" />
                Sign Up & Get 1 Hour Free
              </Link>
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              Maybe Later
            </Button>
          </div>

          <div className="text-center text-xs text-white/50">
            Free ad-free time is automatically added to new accounts
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupPromotionPopup;