
import { useAds } from '@/contexts/AdContext';
import Ad from './Ad';

const ContentAds = () => {
  const { isAdEnabled } = useAds();
  
  if (!isAdEnabled) return null;
  
  return (
    <div className="w-full space-y-12 my-8 px-4 max-w-7xl mx-auto">
      {/* Social bar ad */}
      <div className="mb-8">
        <Ad size="social-bar" />
      </div>
      
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
