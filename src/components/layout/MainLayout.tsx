
import { ReactNode } from 'react';
import { SearchProvider } from '@/contexts/SearchContext';
import { AdProvider } from '@/contexts/AdContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import SidebarAd from '@/components/ads/SidebarAd';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <SearchProvider>
      <AdProvider>
        <div className="flex flex-col min-h-screen bg-aura-dark text-white">
          <Navbar />
          <div className="flex flex-1 max-w-full mx-auto w-full pt-20">
            <main className="flex-grow w-full min-h-0">
              {children}
            </main>
            {!isMobile && <SidebarAd />}
          </div>
          <ScrollToTop />
          <Footer />
        </div>
      </AdProvider>
    </SearchProvider>
  );
};

export default MainLayout;
