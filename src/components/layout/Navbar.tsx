
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, X, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/contexts/SearchContext';
import SearchDropdown from '@/components/common/SearchDropdown';
import MobileMenu from '@/components/layout/MobileMenu';

const Navbar = () => {
  const { query, setQuery, isSearching, isDropdownOpen, clearSearch } = useSearch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
              <svg 
                className="mr-1 h-4 w-4" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.665-.436 2.13-.754 4.141l-.545 3.02c-.003.017-.047 1.177-.166 1.555-.157.505-.356.629-.585.629-.166 0-.378-.089-.594-.276-.277-.24-.858-.8-1.222-1.145-.249-.237-.646-.587-1.069-.587-.475 0-.848.343-.97.438l-.001.001c-.3.214-.546.39-.782.39-.45 0-.708-.248-.708-.688 0-.322.3-.511.3-.511l.124-.121s2.039-1.832 2.206-2.06c.014-.02.029-.04.044-.061.05-.068.118-.161.13-.294.012-.139-.093-.265-.374-.265-.644 0-1.904 1.269-1.904 1.269-.192.127-.394.19-.615.19-.318 0-.686-.141-.942-.266-.4-.194-1.698-.93-2.358-1.626-.111-.117-.468-.297-.468-.564 0-.265.42-.604 1.132-.604h4.146c.552 0 .814-.39.814-.76 0-.381-.299-.703-.93-.703H7.366c-.064 0-.118-.055-.118-.123 0-.068.054-.123.118-.123h4.145c.952 0 1.174-.673 1.174-.996 0-.067-.343-.994-1.174-.994h-3.8c-.378 0-.602-.47-.602-.828 0-.256.115-.441.603-.441h6.667c.382 0 .738-.173.738-.488 0-.482-.56-.677-.837-.677H8.163c-.068 0-.123-.055-.123-.123S8.095 5 8.163 5h6.026c.389 0 .904-.262.904-.57 0-.251-.186-.43-.474-.43H9.252c-.068 0-.123-.055-.123-.123s.055-.123.123-.123h5.367c.114 0 .3-.028.3-.276 0-.231-.185-.394-.3-.394H9.16c-.069 0-.124-.055-.124-.123s.055-.123.124-.123h5.249c.902 0 1.349.616 1.349 1.043 0 .427-.241.87-.779.968.538.098.95.573.95 1.144 0 .57-.232.973-.827 1.064.595.09.793.616.793 1.043 0 .241-.055.432-.155.579.928.111 1.153.678 1.153 1.023 0 .587-.495.876-.93.968.834.14 1.613.618 1.613 1.35 0 .733-.881 1.163-1.5.894z" />
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
                className="w-full py-2 pl-10 pr-4 bg-white/10 text-white rounded-full border-white/10 focus:border-aura-purple focus:ring-aura-purple"
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
            <svg 
              className="h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.665-.436 2.13-.754 4.141l-.545 3.02c-.003.017-.047 1.177-.166 1.555-.157.505-.356.629-.585.629-.166 0-.378-.089-.594-.276-.277-.24-.858-.8-1.222-1.145-.249-.237-.646-.587-1.069-.587-.475 0-.848.343-.97.438l-.001.001c-.3.214-.546.39-.782.39-.45 0-.708-.248-.708-.688 0-.322.3-.511.3-.511l.124-.121s2.039-1.832 2.206-2.06c.014-.02.029-.04.044-.061.05-.068.118-.161.13-.294.012-.139-.093-.265-.374-.265-.644 0-1.904 1.269-1.904 1.269-.192.127-.394.19-.615.19-.318 0-.686-.141-.942-.266-.4-.194-1.698-.93-2.358-1.626-.111-.117-.468-.297-.468-.564 0-.265.42-.604 1.132-.604h4.146c.552 0 .814-.39.814-.76 0-.381-.299-.703-.93-.703H7.366c-.064 0-.118-.055-.118-.123 0-.068.054-.123.118-.123h4.145c.952 0 1.174-.673 1.174-.996 0-.067-.343-.994-1.174-.994h-3.8c-.378 0-.602-.47-.602-.828 0-.256.115-.441.603-.441h6.667c.382 0 .738-.173.738-.488 0-.482-.56-.677-.837-.677H8.163c-.068 0-.123-.055-.123-.123S8.095 5 8.163 5h6.026c.389 0 .904-.262.904-.57 0-.251-.186-.43-.474-.43H9.252c-.068 0-.123-.055-.123-.123s.055-.123.123-.123h5.367c.114 0 .3-.028.3-.276 0-.231-.185-.394-.3-.394H9.16c-.069 0-.124-.055-.124-.123s.055-.123.124-.123h5.249c.902 0 1.349.616 1.349 1.043 0 .427-.241.87-.779.968.538.098.95.573.95 1.144 0 .57-.232.973-.827 1.064.595.09.793.616.793 1.043 0 .241-.055.432-.155.579.928.111 1.153.678 1.153 1.023 0 .587-.495.876-.93.968.834.14 1.613.618 1.613 1.35 0 .733-.881 1.163-1.5.894z" />
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
