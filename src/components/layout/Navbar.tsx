
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, X, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/contexts/SearchContext';
import SearchDropdown from '@/components/common/SearchDropdown';
import MobileMenu from '@/components/layout/MobileMenu';

const Navbar = () => {
  const { query, setQuery, isSearching, isDropdownOpen, setIsDropdownOpen, clearSearch, performSearch } = useSearch();
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

  // Close dropdown when navigating to another page
  useEffect(() => {
    clearSearch();
    setIsMobileMenuOpen(false);
  }, [location.pathname, clearSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsDropdownOpen(false);
    }
  };

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
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-sm mx-4">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, TV shows..."
                className="w-full py-2 pl-10 pr-4 bg-white/10 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-aura-purple transition-all"
                onFocus={() => query && performSearch(query)}
                aria-label="Search"
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
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </nav>
  );
};

export default Navbar;
