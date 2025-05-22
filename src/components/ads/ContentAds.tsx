import { useAds } from '@/contexts/AdContext';
import Ad from './Ad';
import { useEffect, useRef } from 'react';

const ContentAds = () => {
  // Force ads to be disabled regardless of context
  const { isAdEnabled: _ } = useAds();
  const isAdEnabled = false; // Override ad display
  const socialBarRef = useRef<HTMLDivElement>(null);
  
  // Keep the effect but it won't run as isAdEnabled is false
  useEffect(() => {
    if (isAdEnabled && socialBarRef.current) {
      // Clear any existing content first
      socialBarRef.current.innerHTML = '';
      
      // Create and append script directly
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//bluetackclasp.com/65/ae/89/65ae89355595f1693dbba515d5ec23d8.js';
      socialBarRef.current.appendChild(script);
    }
  }, [isAdEnabled]);
  
  // Component returns null when ads are disabled (which is always now)
  if (!isAdEnabled) return null;
  
  // This code is now unreachable but kept for structure
  return (
    <div className="w-full space-y-12 my-8 px-4 max-w-7xl mx-auto">
      {/* Social bar ad */}
      <div ref={socialBarRef} className="w-full my-6 min-h-[70px]"></div>
      
      {/* Small banner ad */}
      <div className="flex justify-center mb-12">
        <Ad size="320x50" />
      </div>
      
      {/* Rectangle ad */}
      <div className="flex justify-center mb-12">
        <Ad size="300x250" />
      </div>
    </div>
  );
};

export default ContentAds;
