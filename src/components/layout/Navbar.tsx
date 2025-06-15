import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimpleSearchBar from '@/components/common/SimpleSearchBar';
import MobileMenu from '@/components/layout/MobileMenu';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // External link to Telegram
  const telegramUrl = "https://t.me/auralux1";

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };
  
  const navLinkClasses = "text-sm font-medium text-white/80 hover:text-white transition-colors";

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 z-[10000] w-full bg-aura-dark/98 shadow-lg backdrop-blur-md border-b border-white/10"
      >
        <div className="auraluxx-container">
          <div className="flex items-center justify-between py-4">
            {/* Logo & Desktop Nav */}
            <div className="flex items-center gap-4 lg:gap-8">
              <Link to="/" className="flex items-center flex-shrink-0">
                <h1 className="text-xl md:text-3xl font-bold text-gradient">
                  Auraluxx
                </h1>
              </Link>
              <div className="hidden md:flex items-center gap-4 lg:gap-6">
                <Link to="/movies" className={navLinkClasses}>Movies</Link>
                <Link to="/tv-series" className={navLinkClasses}>TV Series</Link>
                <Link to="/anime" className={navLinkClasses}>Anime</Link>
                <Link to="/regional" className={navLinkClasses}>Regional</Link>
              </div>
            </div>

            {/* Search Bar - centered and responsive */}
            <div className="flex-1 max-w-sm lg:max-w-md mx-4">
              <SimpleSearchBar />
            </div>

            {/* Menu Button */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleMobileMenuToggle}
              className="md:hidden text-white hover:bg-white/10 min-h-[44px] min-w-[44px] z-50"
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
