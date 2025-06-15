
import { ReactNode } from 'react';
import { SearchProvider } from '@/contexts/SearchContext';
import { AdProvider } from '@/contexts/AdContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import SidebarAd from '@/components/ads/SidebarAd';
import AIChatbot from '@/components/chatbot';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  
  return (
    <SearchProvider>
      <AdProvider>
        <div className={`flex flex-col min-h-screen transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-black text-white' 
            : 'bg-aura-dark text-white'
        }`}>
          <Navbar />
          {/* Fixed header requires top padding for content */}
          <div className="flex flex-1 max-w-full mx-auto w-full">
            <main className="flex-grow w-full flex flex-col">
              {children}
            </main>
            {!isMobile && <SidebarAd />}
          </div>
          <Footer />
          
          {/* Fixed positioned elements with proper z-index */}
          <ScrollToTop />
          <AIChatbot />
        </div>
      </AdProvider>
    </SearchProvider>
  );
};

export default MainLayout;
