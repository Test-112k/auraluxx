
import { useAds } from '@/contexts/AdContext';
import Ad from './Ad';

const SidebarAd = () => {
  const { isAdEnabled } = useAds();
  
  if (!isAdEnabled) return null;
  
  return (
    <div className="hidden xl:flex flex-col items-center gap-4 ml-4">
      <Ad size="160x600" className="sticky top-24" />
    </div>
  );
};

export default SidebarAd;
