
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col animate-fade-in md:hidden">
      <div className="flex justify-end p-6">
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
          <X size={24} />
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 space-y-8 text-center">
        <Link 
          to="/" 
          onClick={onClose}
          className="text-2xl font-medium text-white hover:text-gradient transition-all"
        >
          Home
        </Link>
        <Link 
          to="/movies" 
          onClick={onClose}
          className="text-2xl font-medium text-white hover:text-gradient transition-all"
        >
          Movies
        </Link>
        <Link 
          to="/tv-series" 
          onClick={onClose}
          className="text-2xl font-medium text-white hover:text-gradient transition-all"
        >
          TV Series
        </Link>
        <Link 
          to="/anime" 
          onClick={onClose}
          className="text-2xl font-medium text-white hover:text-gradient transition-all"
        >
          Anime
        </Link>
        <Link 
          to="/regional" 
          onClick={onClose}
          className="text-2xl font-medium text-white hover:text-gradient transition-all"
        >
          Regional
        </Link>
      </div>

      <div className="text-center pb-8 text-sm text-white/60">
        <p>Auraluxx © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default MobileMenu;
