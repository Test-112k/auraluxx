
import { ReactNode } from 'react';
import { SearchProvider } from '@/contexts/SearchContext';
import { AdProvider } from '@/contexts/AdContext';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import SidebarAd from '@/components/ads/SidebarAd';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  console.log('MainLayout rendering...');
  
  return (
    <SearchProvider>
      <AdProvider>
        <div className="flex flex-col min-h-screen bg-aura-dark text-white">
          <Navbar />
          <div className="flex flex-1 max-w-full mx-auto w-full">
            <main className="flex-grow pt-16 w-full">
              {children}
            </main>
            <SidebarAd />
          </div>
          <ScrollToTop />
          <Footer />
        </div>
      </AdProvider>
    </SearchProvider>
  );
};

export default MainLayout;
