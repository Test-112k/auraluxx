
import { useAds } from '@/contexts/AdContext';
import Ad from './Ad';

const ContentAds = () => {
  const { isAdEnabled } = useAds();
  
  if (!isAdEnabled) return null;
  
  return (
    <div className="w-full space-y-16 my-12 px-4 max-w-7xl mx-auto">
      {/* Small banner ad */}
      <div className="flex justify-center overflow-hidden">
        <Ad size="320x50" />
      </div>
      
      {/* Rectangle ad */}
      <div className="flex justify-center my-12">
        <Ad size="300x250" />
      </div>
    </div>
  );
};

export default ContentAds;
