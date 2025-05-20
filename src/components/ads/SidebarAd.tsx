
import { useAds } from '@/contexts/AdContext';
import Ad from './Ad';

const SidebarAd = () => {
  const { isAdEnabled } = useAds();
  
  if (!isAdEnabled) return null;
  
  return (
    <div className="hidden xl:flex flex-col items-center gap-6 ml-4">
      <div className="bg-white/5 p-2 rounded-lg">
        <Ad size="160x600" className="sticky top-24" />
      </div>
    </div>
  );
};

export default SidebarAd;
