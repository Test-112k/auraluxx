
import { useAds } from '@/contexts/AdContext';
import Ad from './Ad';

const ContentAds = () => {
  const { isAdEnabled } = useAds();
  
  if (!isAdEnabled) return null;
  
  return (
    <div className="w-full space-y-6 my-6 px-4 max-w-7xl mx-auto">
      {/* Small banner ad */}
      <div className="flex justify-center overflow-hidden bg-white/5 p-2 rounded-lg">
        <Ad size="320x50" />
      </div>
      
      {/* Rectangle ad */}
      <div className="flex justify-center bg-white/5 p-3 rounded-lg">
        <Ad size="300x250" />
      </div>
    </div>
  );
};

export default ContentAds;
