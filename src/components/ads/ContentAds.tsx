
import { useAds } from '@/contexts/AdContext';
import Ad from './Ad';
import { useIsMobile } from '@/hooks/use-mobile';

const ContentAds = () => {
  const { isAdEnabled } = useAds();
  const isMobile = useIsMobile();
  
  if (!isAdEnabled) return null;
  
  return (
    <div className="w-full space-y-12 my-10 px-4 max-w-7xl mx-auto">
      {/* Top banner - responsive for different screen sizes */}
      <div className="flex justify-center overflow-hidden bg-white/5 p-2 rounded-lg">
        {isMobile ? (
          <Ad size="320x50" />
        ) : (
          <Ad size="728x90" />
        )}
      </div>
      
      {/* Rectangle ad - works well on all screen sizes */}
      <div className="flex justify-center bg-white/5 p-3 rounded-lg">
        <Ad size="300x250" />
      </div>
      
      {/* Bottom banner */}
      <div className="flex justify-center overflow-hidden bg-white/5 p-2 rounded-lg">
        {isMobile ? (
          <Ad size="320x50" />
        ) : (
          <Ad size="468x60" />
        )}
      </div>
    </div>
  );
};

export default ContentAds;
