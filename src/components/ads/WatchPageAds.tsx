
import { useAds } from '@/contexts/AdContext';
import Ad from './Ad';

const WatchPageAds = () => {
  const { isAdEnabled } = useAds();
  
  if (!isAdEnabled) return null;
  
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4">
      {/* Top banner ad */}
      <div className="flex justify-center my-6 max-w-full overflow-hidden bg-white/5 p-2 rounded-lg">
        <Ad size="728x90" className="hidden md:block" />
        <Ad size="320x50" className="md:hidden" />
      </div>
      
      {/* Side ads and rectangle ads */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar ad */}
        <div className="hidden lg:block bg-white/5 p-2 rounded-lg sticky top-24 h-fit">
          <Ad size="160x600" />
        </div>
        
        {/* Main content area would go here */}
        <div className="flex-1">
          {/* This is just a placeholder - actual content would be rendered by the parent */}
        </div>
        
        {/* Right sidebar ad */}
        <div className="hidden lg:block bg-white/5 p-2 rounded-lg sticky top-24 h-fit">
          <Ad size="160x600" />
        </div>
      </div>
      
      {/* Bottom banner ad */}
      <div className="flex justify-center my-6 bg-white/5 p-2 rounded-lg">
        <Ad size="728x90" className="hidden md:block" />
        <Ad size="320x50" className="md:hidden" />
      </div>
      
      {/* Native ad */}
      <div className="my-6 bg-white/5 p-3 rounded-lg">
        <Ad size="native" />
      </div>
      
      {/* Social bar */}
      <div className="my-6 bg-white/5 p-2 rounded-lg">
        <Ad size="social-bar" />
      </div>
    </div>
  );
};

export default WatchPageAds;
