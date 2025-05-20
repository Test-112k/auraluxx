
import { useAds } from '@/contexts/AdContext';
import Ad from './Ad';

const ContentAds = () => {
  const { isAdEnabled } = useAds();
  
  if (!isAdEnabled) return null;
  
  return (
    <div className="w-full space-y-10 my-10 px-4">
      {/* Top banner */}
      <div className="flex justify-center overflow-hidden bg-white/5 p-2 rounded-lg">
        <Ad size="728x90" className="hidden md:block" />
        <Ad size="320x50" className="md:hidden" />
      </div>
      
      {/* Rectangle ad */}
      <div className="flex justify-center bg-white/5 p-3 rounded-lg">
        <Ad size="300x250" />
      </div>
      
      {/* Bottom banner */}
      <div className="flex justify-center overflow-hidden bg-white/5 p-2 rounded-lg">
        <Ad size="468x60" />
      </div>
    </div>
  );
};

export default ContentAds;
