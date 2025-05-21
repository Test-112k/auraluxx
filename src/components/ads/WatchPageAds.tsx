
import { useAds } from '@/contexts/AdContext';
import Ad from './Ad';

const WatchPageAds = () => {
  const { isAdEnabled } = useAds();
  
  if (!isAdEnabled) return null;
  
  return (
    <div className="space-y-14 max-w-7xl mx-auto px-4">
      {/* Top small banner ad */}
      <div className="flex justify-center my-8 max-w-full overflow-hidden">
        <Ad size="320x50" />
      </div>
      
      {/* Side ads - smaller formats only with proper spacing */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left sidebar ad - small format */}
        <div className="hidden lg:block sticky top-24 h-fit">
          <Ad size="160x300" />
        </div>
        
        {/* Main content area would go here */}
        <div className="flex-1">
          {/* This is just a placeholder - actual content would be rendered by the parent */}
        </div>
        
        {/* Right sidebar ad - small format */}
        <div className="hidden lg:block sticky top-24 h-fit">
          <Ad size="160x300" />
        </div>
      </div>
      
      {/* Bottom small banner ad with more spacing */}
      <div className="flex justify-center my-10">
        <Ad size="320x50" />
      </div>
    </div>
  );
};

export default WatchPageAds;
