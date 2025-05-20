
import { useAds } from '@/contexts/AdContext';
import Ad from './Ad';

const ContentAds = () => {
  const { isAdEnabled } = useAds();
  
  if (!isAdEnabled) return null;
  
  return (
    <div className="w-full space-y-8 my-8">
      {/* Top banner */}
      <div className="flex justify-center overflow-hidden">
        <Ad size="728x90" className="hidden md:block" />
        <Ad size="320x50" className="md:hidden" />
      </div>
      
      {/* Rectangle ad */}
      <div className="flex justify-center">
        <Ad size="300x250" />
      </div>
      
      {/* Bottom banner */}
      <div className="flex justify-center overflow-hidden">
        <Ad size="468x60" />
      </div>
    </div>
  );
};

export default ContentAds;
