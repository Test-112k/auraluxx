
import { useAds } from '@/contexts/AdContext';
import Ad from './Ad';

const SidebarAd = () => {
  const { isAdEnabled } = useAds();
  
  if (!isAdEnabled) return null;
  
  return (
    <div className="hidden xl:flex flex-col items-center gap-6 ml-4 min-w-[180px] pt-4">
      <div className="bg-white/5 p-2 rounded-lg sticky top-24">
        <Ad size="160x600" />
      </div>
    </div>
  );
};

export default SidebarAd;
