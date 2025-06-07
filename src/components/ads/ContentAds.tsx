
import { useAds } from '@/contexts/AdContext';
import Ad from './Ad';
import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const ContentAds = () => {
  const { isAdEnabled } = useAds();
  const socialBarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (isAdEnabled && socialBarRef.current) {
      // Clear any existing content first
      socialBarRef.current.innerHTML = '';
      
      // Create and append script directly
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//bluetackclasp.com/65/ae/89/65ae89355595f1693dbba515d5ec23d8.js';
      socialBarRef.current.appendChild(script);
      
      // Log for debugging
      console.log('Social bar script added to DOM');
    }
  }, [isAdEnabled]);
  
  if (!isAdEnabled) return null;
  
  return (
    <div className="w-full space-y-12 my-8 px-4 max-w-7xl mx-auto">
      {/* Social bar ad */}
      <div ref={socialBarRef} className="w-full my-6 min-h-[70px]"></div>
      
      {/* Mobile-specific banner with proper sizing */}
      <div className="flex justify-center mb-12">
        {isMobile ? (
          <Ad size="320x50" className="w-full max-w-[320px]" />
        ) : (
          <Ad size="728x90" /> 
        )}
      </div>
      
      {/* Rectangle ad - works on both mobile and desktop */}
      <div className="flex justify-center mb-12">
        <Ad size="300x250" />
      </div>
    </div>
  );
};

export default ContentAds;
