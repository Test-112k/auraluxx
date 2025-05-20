
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, X, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/contexts/SearchContext';
import SearchDropdown from '@/components/common/SearchDropdown';
import MobileMenu from '@/components/layout/MobileMenu';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const { query, setQuery, isSearching, isDropdownOpen, clearSearch } = useSearch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
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

  // Clear search when navigating to another page
  useEffect(() => {
    if (!location.pathname.includes('/search')) {
      clearSearch();
    }
  }, [location.pathname, clearSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      clearSearch();
    }
  };

  // External link to Telegram
  const telegramUrl = "https://t.me/auralux1";

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-aura-dark/95 shadow-lg backdrop-blur-sm' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="auraluxx-container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gradient">
              Auraluxx
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/movies" className="text-white hover:text-aura-purple transition-colors">
              Movies
            </Link>
            <Link to="/tv-series" className="text-white hover:text-aura-purple transition-colors">
              TV Series
            </Link>
            <Link to="/anime" className="text-white hover:text-aura-purple transition-colors">
              Anime
            </Link>
            <Link to="/regional" className="text-white hover:text-aura-purple transition-colors">
              Regional
            </Link>
            <a 
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-aura-purple transition-colors flex items-center"
            >
              {/* Telegram Logo */}
              <svg 
                className="mr-1 h-5 w-5" 
                fill="#ffffff"
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.665,3.717l-17.73,6.837c-1.21,0.486-1.203,1.161-0.222,1.462l4.552,1.42l10.532-6.645 c0.498-0.303,0.953-0.14,0.579,0.192l-8.533,7.701l0,0l0,0H9.84l0.002,0.001l-0.314,4.692c0.46,0,0.663-0.211,0.921-0.46 l2.211-2.15l4.599,3.397c0.848,0.467,1.457,0.227,1.668-0.785l3.019-14.228C22.256,3.912,21.474,3.351,20.665,3.717z"/>
              </svg>
              Telegram
            </a>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-sm mx-4">
            <form onSubmit={handleSubmit} className="relative">
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, TV shows..."
                className="w-full py-2 pl-10 pr-4 bg-white/10 rounded-full border-white/10 focus:border-aura-purple focus:ring-aura-purple"
                aria-label="Search"
                autoComplete="off"
              />
              {isSearching ? (
                <Loader className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 h-4 w-4" />
                  {query && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </>
              )}
            </form>
            {isDropdownOpen && <SearchDropdown />}
          </div>

          {/* Telegram Icon (Mobile) */}
          <a 
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="md:hidden mr-2 text-white hover:text-aura-purple transition-colors"
            aria-label="Telegram"
          >
            {/* Telegram Logo */}
            <svg 
              className="h-6 w-6" 
              fill="#ffffff"
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.665,3.717l-17.73,6.837c-1.21,0.486-1.203,1.161-0.222,1.462l4.552,1.42l10.532-6.645 c0.498-0.303,0.953-0.14,0.579,0.192l-8.533,7.701l0,0l0,0H9.84l0.002,0.001l-0.314,4.692c0.46,0,0.663-0.211,0.921-0.46 l2.211-2.15l4.599,3.397c0.848,0.467,1.457,0.227,1.668-0.785l3.019-14.228C22.256,3.912,21.474,3.351,20.665,3.717z"/>
            </svg>
          </a>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-white hover:bg-white/10"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} telegramUrl={telegramUrl} />
    </nav>
  );
};

export default Navbar;
