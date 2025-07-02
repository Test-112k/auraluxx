import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSearch } from '@/contexts/SearchContext';
import { Search, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from '@/components/ui/theme-toggle';
import SearchDropdown from '@/components/common/SearchDropdown';

const Logo = () => (
  <Link to="/" className="flex items-center font-bold text-xl md:text-2xl tracking-tight">
    <span className="bg-gradient-to-r from-aura-purple via-aura-accent to-purple-400 bg-clip-text text-transparent font-extrabold tracking-wider">
      Auraluxx
    </span>
  </Link>
);

const SearchBar = () => {
  const { query, setQuery, isDropdownOpen, setIsDropdownOpen, clearSearch, results } = useSearch();
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleFocus = () => {
    if (query.trim() && results.length > 0) {
      setIsDropdownOpen(true);
    }
  };

  const handleBlur = () => {
    // Delay closing to allow for clicking on dropdown items
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  return (
    <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-2 sm:mx-4 md:mx-6 lg:mx-8 relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
        <Input
          type="search"
          placeholder="Search movies, TV shows..."
          value={query}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full pl-10 pr-4 py-3 sm:py-2.5 bg-aura-darkpurple/60 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-aura-purple focus:border-aura-purple rounded-full transition-all duration-200 text-sm sm:text-base h-11 sm:h-10"
        />
        {query && (
          <Button
            type="button"
            onClick={clearSearch}
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white h-6 w-6"
          >
            <X size={14} />
          </Button>
        )}
      </div>
      
      {/* Search Dropdown */}
      {isDropdownOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <SearchDropdown />
        </div>
      )}
    </div>
  );
};

const DesktopNavigation = () => {
  return (
    <div className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
      <Link to="/movies" className="text-white hover:text-aura-purple transition-colors duration-200 font-medium text-sm lg:text-base whitespace-nowrap">
        Movies
      </Link>
      <Link to="/tv-series" className="text-white hover:text-aura-purple transition-colors duration-200 font-medium text-sm lg:text-base whitespace-nowrap">
        TV Series
      </Link>
      <Link to="/anime" className="text-white hover:text-aura-purple transition-colors duration-200 font-medium text-sm lg:text-base whitespace-nowrap">
        Anime
      </Link>
      <Link to="/k-drama" className="text-white hover:text-aura-purple transition-colors duration-200 font-medium text-sm lg:text-base whitespace-nowrap">
        K-Drama
      </Link>
      <Link to="/regional" className="text-white hover:text-aura-purple transition-colors duration-200 font-medium text-sm lg:text-base whitespace-nowrap">
        Regional
      </Link>
      <Link to="/speedtest" className="text-white hover:text-aura-purple transition-colors duration-200 font-medium text-sm lg:text-base whitespace-nowrap">
        Speed Test
      </Link>
      <div className="ml-2">
        <ThemeToggle />
      </div>
    </div>
  );
};

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
          <Menu className="h-5 w-5 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-aura-dark text-white w-72 sm:w-80">
        <SheetHeader className="text-left">
          <SheetTitle className="text-white text-xl font-bold">Menu</SheetTitle>
          <SheetDescription className="text-white/70">
            Navigate through Auraluxx
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-2 py-6">
          <Link 
            to="/" 
            className="flex items-center hover:text-aura-purple transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-white/5 text-base font-medium"
            onClick={handleCloseMenu}
          >
            Home
          </Link>
          <Link 
            to="/movies" 
            className="flex items-center hover:text-aura-purple transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-white/5 text-base font-medium"
            onClick={handleCloseMenu}
          >
            Movies
          </Link>
          <Link 
            to="/tv-series" 
            className="flex items-center hover:text-aura-purple transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-white/5 text-base font-medium"
            onClick={handleCloseMenu}
          >
            TV Series
          </Link>
          <Link 
            to="/anime" 
            className="flex items-center hover:text-aura-purple transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-white/5 text-base font-medium"
            onClick={handleCloseMenu}
          >
            Anime
          </Link>
          <Link 
            to="/k-drama" 
            className="flex items-center hover:text-aura-purple transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-white/5 text-base font-medium"
            onClick={handleCloseMenu}
          >
            K-Drama
          </Link>
          <Link 
            to="/regional" 
            className="flex items-center hover:text-aura-purple transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-white/5 text-base font-medium"
            onClick={handleCloseMenu}
          >
            Regional
          </Link>
          <Link 
            to="/speedtest" 
            className="flex items-center hover:text-aura-purple transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-white/5 text-base font-medium"
            onClick={handleCloseMenu}
          >
            Speed Test
          </Link>
          <a 
            href="https://t.me/auralux1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-aura-purple transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-white/5 text-base font-medium group"
            onClick={handleCloseMenu}
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-2 mr-3 group-hover:from-blue-600 group-hover:to-blue-700 transition-all">
              <svg 
                className="h-4 w-4 text-white" 
                fill="currentColor"
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.665,3.717l-17.73,6.837c-1.21,0.486-1.203,1.161-0.222,1.462l4.552,1.42l10.532-6.645 c0.498-0.303,0.953-0.14,0.579,0.192l-8.533,7.701l0,0l0,0H9.84l0.002,0.001l-0.314,4.692c0.46,0,0.663-0.211,0.921-0.46 l2.211-2.15l4.599,3.397c0.848,0.467,1.457,0.227,1.668-0.785l3.019-14.228C22.256,3.912,21.474,3.351,20.665,3.717z"/>
              </svg>
            </div>
            Join Telegram
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const MobileNavigation = () => {
  return (
    <div className="md:hidden flex items-center space-x-2">
      <ThemeToggle />
      <MobileMenu />
    </div>
  );
};

const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <nav className="fixed top-0 left-0 w-full bg-aura-dark/95 dark:bg-black/95 backdrop-blur-md z-40 border-b border-white/10">
      <div className="auraluxx-container">
        <div className="flex items-center justify-between h-16 md:h-18 lg:h-20 gap-1 sm:gap-2 md:gap-4">
          <div className="flex-shrink-0 min-w-0">
            <Logo />
          </div>
          
          <SearchBar />
          
          <div className="flex-shrink-0 min-w-0">
            <DesktopNavigation />
            <MobileNavigation />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
