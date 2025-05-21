
import { useAds } from '@/contexts/AdContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Ad from './Ad';

const SidebarAd = () => {
  const { isAdEnabled } = useAds();
  const isMobile = useIsMobile();
  
  if (!isAdEnabled || isMobile) return null;
  
  return (
    <div className="hidden xl:flex flex-col items-center gap-6 min-w-[180px] pt-4">
      {/* Taller ad for wider screens */}
      <div className="bg-white/5 p-2 rounded-lg sticky top-24 hidden xxl:block">
        <Ad size="160x600" />
      </div>
      
      {/* Shorter ad for narrower screens */}
      <div className="bg-white/5 p-2 rounded-lg sticky top-24 xl:block xxl:hidden">
        <Ad size="160x300" />
      </div>
    </div>
  );
};

export default SidebarAd;
