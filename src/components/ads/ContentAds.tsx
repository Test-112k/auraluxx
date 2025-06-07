
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
      socialBarRef.current.innerHTML = '';
      
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//bluetackclasp.com/65/ae/89/65ae89355595f1693dbba515d5ec23d8.js';
      socialBarRef.current.appendChild(script);
      
      console.log('Social bar script added to DOM');
    }
  }, [isAdEnabled]);
  
  if (!isAdEnabled) return null;
  
  return (
    <div className="w-full space-y-8 my-6 px-4 max-w-7xl mx-auto animate-fade-in">
      {/* Social bar ad */}
      <div ref={socialBarRef} className="w-full my-4 min-h-[70px]"></div>
      
      {/* Single mobile-optimized banner */}
      <div className="flex justify-center">
        {isMobile ? (
          <Ad size="320x50" className="w-full max-w-[320px]" />
        ) : (
          <Ad size="728x90" /> 
        )}
      </div>
    </div>
  );
};

export default ContentAds;
