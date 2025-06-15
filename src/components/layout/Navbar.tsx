
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

            {/* Right side icons */}
            <div className="flex items-center gap-2">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                aria-label="Join us on Telegram"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.665,3.717l-17.73,6.837c-1.21,0.486-1.203,1.161-0.222,1.462l4.552,1.42l10.532-6.645 c0.498-0.303,0.953-0.14,0.579,0.192l-8.533,7.701l0,0l0,0H9.84l0.002,0.001l-0.314,4.692c0.46,0,0.663-0.211,0.921-0.46 l2.211-2.15l4.599,3.397c0.848,0.467,1.457,0.227,1.668-0.785l3.019-14.228C22.256,3.912,21.474,3.351,20.665,3.717z"/>
                </svg>
              </a>
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
