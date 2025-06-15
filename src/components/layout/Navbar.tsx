
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

const DesktopNavigation = () => {
  return (
    <div className="hidden md:flex items-center space-x-4">
      <ThemeToggle />
      <MobileMenu />
    </div>
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

const Logo = () => (
  <Link to="/" className="flex items-center font-bold text-xl md:text-2xl tracking-tight">
    Auraluxx
  </Link>
);

const SearchBar = () => {
  const { setQuery } = useSearch();
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    setQuery(value);
  };

  return (
    <div className="flex-grow max-w-md md:max-w-lg lg:max-w-xl">
      <Input
        type="search"
        placeholder="Search movies, TV shows..."
        value={searchText}
        onChange={handleSearchChange}
        className="bg-aura-darkpurple border-gray-700 text-white focus:ring-aura-purple focus:border-aura-purple"
      />
      {!isSearchPage && (
        <Link
          to="/search"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors duration-200"
        >
          <Search size={20} />
        </Link>
      )}
    </div>
  );
};

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-aura-dark text-white w-64">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Navigate through Auraluxx
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Link to="/" className="hover:text-aura-purple transition-colors duration-200">
            Home
          </Link>
          <Link to="/movies" className="hover:text-aura-purple transition-colors duration-200">
            Movies
          </Link>
          <Link to="/tv-series" className="hover:text-aura-purple transition-colors duration-200">
            TV Series
          </Link>
          <Link to="/anime" className="hover:text-aura-purple transition-colors duration-200">
            Anime
          </Link>
          <Link to="/k-drama" className="hover:text-aura-purple transition-colors duration-200">
            K-Drama
          </Link>
          <Link to="/regional" className="hover:text-aura-purple transition-colors duration-200">
            Regional
          </Link>
          <Link to="/speedtest" className="hover:text-aura-purple transition-colors duration-200">
            Speedtest
          </Link>
          <Link to="/contact" className="hover:text-aura-purple transition-colors duration-200">
            Contact
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <nav className="fixed top-0 left-0 w-full bg-aura-dark dark:bg-black z-40">
      <div className="auraluxx-container py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <SearchBar />
          <DesktopNavigation />
          <MobileNavigation />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
