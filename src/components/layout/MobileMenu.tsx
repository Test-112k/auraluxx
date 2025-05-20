
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  telegramUrl?: string;
}

const MobileMenu = ({ isOpen, onClose, telegramUrl = "https://t.me/auralux1" }: MobileMenuProps) => {
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
        <a 
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="text-2xl font-medium text-white hover:text-gradient transition-all flex items-center"
        >
          {/* Improved Telegram Logo */}
          <svg 
            className="mr-2 h-6 w-6" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.84 14.22 15.51 15.99C15.37 16.74 15.09 16.99 14.83 17.02C14.25 17.07 13.81 16.64 13.25 16.27C12.37 15.69 11.87 15.33 11.02 14.77C10.03 14.12 10.67 13.76 11.24 13.18C11.39 13.03 13.95 10.7 14 10.49C14.0069 10.4589 14.006 10.4267 13.9973 10.3961C13.9886 10.3655 13.9724 10.3376 13.95 10.315C13.89 10.25 13.81 10.27 13.74 10.28C13.65 10.29 12.15 11.24 9.24 13.12C8.78 13.42 8.36 13.57 7.98 13.56C7.57 13.55 6.77 13.35 6.17 13.17C5.44 12.95 4.86 12.83 4.91 12.43C4.94 12.22 5.22 12.01 5.76 11.8C8.87 10.38 10.97 9.45 12.06 9C15.17 7.68 15.92 7.45 16.43 7.45C16.54 7.45 16.8 7.48 16.97 7.62C17.11 7.73 17.15 7.89 17.16 7.99C17.15 8.15 17.14 8.48 16.64 8.8Z" 
            />
          </svg>
          Telegram
        </a>
      </div>

      <div className="text-center pb-8 text-sm text-white/60">
        <p>Auraluxx © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default MobileMenu;
