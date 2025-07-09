
import { ReactNode, useState, useEffect } from 'react';
import { SearchProvider } from '@/contexts/SearchContext';
import { AdProvider } from '@/contexts/AdContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import SidebarAd from '@/components/ads/SidebarAd';
import AIChatbot from '@/components/chatbot';
import AdFreeTimer from '@/components/common/AdFreeTimer';
import AdFreeExpiredPopup from '@/components/common/AdFreeExpiredPopup';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const { user, isAdFree, adFreeTimeLeft } = useAuth();
  const [showExpiredPopup, setShowExpiredPopup] = useState(false);

  // Check if user needs to see expired popup
  useEffect(() => {
    if (user && !isAdFree && adFreeTimeLeft === 0) {
      // Show popup every 5 minutes for non-ad-free users
      const interval = setInterval(() => {
        setShowExpiredPopup(true);
      }, 5 * 60 * 1000); // 5 minutes

      // Show immediately if conditions are met
      const timer = setTimeout(() => {
        setShowExpiredPopup(true);
      }, 30000); // Show after 30 seconds

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [user, isAdFree, adFreeTimeLeft]);
  
  return (
    <SearchProvider>
      <AdProvider>
        <div className={`flex flex-col min-h-screen transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-black text-white' 
            : 'bg-aura-dark text-white'
        }`}>
          <Navbar />
          <AdFreeTimer />
          {/* Fixed header requires top padding for content - increased for better spacing */}
          <div className="flex flex-1 max-w-full mx-auto w-full pt-24 md:pt-28">
            <main className="flex-grow w-full flex flex-col">
              {children}
            </main>
            {!isMobile && <SidebarAd />}
          </div>
          <ScrollToTop />
          <Footer />
          {/* AI Chatbot - Always visible */}
          <AIChatbot />
          
          {/* Ad-Free Expired Popup */}
          <AdFreeExpiredPopup 
            open={showExpiredPopup} 
            onClose={() => setShowExpiredPopup(false)} 
          />
        </div>
      </AdProvider>
    </SearchProvider>
  );
};

export default MainLayout;
