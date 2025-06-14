
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimpleSearchBar from '@/components/common/SimpleSearchBar';
import MobileMenu from '@/components/layout/MobileMenu';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Add scroll event listener to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // External link to Telegram
  const telegramUrl = "https://t.me/auralux1";

  const handleMobileMenuToggle = () => {
    console.log('Mobile menu toggle clicked, current state:', isMobileMenuOpen);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    console.log('Mobile menu closing');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[10000] w-full transition-all duration-300 ${
          isScrolled ? 'bg-aura-dark/98 shadow-lg backdrop-blur-md border-b border-white/10' : 'bg-aura-dark/95 backdrop-blur-sm'
        }`}
        style={{ position: 'fixed' }}
      >
        <div className="auraluxx-container">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <h1 className="text-xl md:text-3xl font-bold text-gradient">
                Auraluxx
              </h1>
            </Link>

            {/* Search Bar - centered and responsive */}
            <div className="flex-1 max-w-md mx-4 md:mx-8">
              <SimpleSearchBar />
            </div>

            {/* Menu Button */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleMobileMenuToggle}
              className="text-white hover:bg-white/10 min-h-[44px] min-w-[44px] z-50"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={handleMobileMenuClose} 
        telegramUrl={telegramUrl} 
      />
    </>
  );
};

export default Navbar;
