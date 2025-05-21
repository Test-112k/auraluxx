
import { useAds } from '@/contexts/AdContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Ad from './Ad';

const SidebarAd = () => {
  const { isAdEnabled } = useAds();
  const isMobile = useIsMobile();
  
  if (!isAdEnabled || isMobile) return null;
  
  return (
    <div className="hidden xl:flex flex-col items-center gap-14 min-w-[160px] pt-10">
      {/* Using only the smaller ad format for better UX */}
      <div className="sticky top-24">
        <Ad size="160x300" />
      </div>
    </div>
  );
};

export default SidebarAd;
