
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
  // Prevent body scrolling when menu is open with better mobile handling
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Apply fixed position with top offset to prevent jumping
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      
      // Prevent iOS bounce scrolling
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Restore scroll position when closing menu
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }
    
    return () => {
      // Cleanup on unmount
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/98 backdrop-blur-sm flex flex-col animate-fade-in duration-300 overscroll-none">
      {/* Header with close button */}
      <div className="flex justify-end p-4 md:p-6 border-b border-white/10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="text-white hover:bg-white/10 transition-colors"
        >
          <X size={24} />
        </Button>
      </div>

      {/* Menu items - optimized for touch */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="flex flex-col justify-center flex-1 space-y-6 md:space-y-8 text-center py-8 px-4">
          <Link 
            to="/" 
            onClick={onClose}
            className="text-xl md:text-2xl font-medium text-white hover:text-gradient transition-all py-3 border-b border-white/10 last:border-0"
          >
            Home
          </Link>
          <Link 
            to="/movies" 
            onClick={onClose}
            className="text-xl md:text-2xl font-medium text-white hover:text-gradient transition-all py-3 border-b border-white/10 last:border-0"
          >
            Movies
          </Link>
          <Link 
            to="/tv-series" 
            onClick={onClose}
            className="text-xl md:text-2xl font-medium text-white hover:text-gradient transition-all py-3 border-b border-white/10 last:border-0"
          >
            TV Series
          </Link>
          <Link 
            to="/anime" 
            onClick={onClose}
            className="text-xl md:text-2xl font-medium text-white hover:text-gradient transition-all py-3 border-b border-white/10 last:border-0"
          >
            Anime
          </Link>
          <Link 
            to="/regional" 
            onClick={onClose}
            className="text-xl md:text-2xl font-medium text-white hover:text-gradient transition-all py-3 border-b border-white/10 last:border-0"
          >
            Regional
          </Link>
          <a 
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="text-xl md:text-2xl font-medium text-white hover:text-gradient transition-all flex items-center justify-center py-3"
          >
            {/* Optimized Telegram Logo for faster loading */}
            <svg 
              className="mr-3 h-6 w-6" 
              fill="currentColor"
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.665,3.717l-17.73,6.837c-1.21,0.486-1.203,1.161-0.222,1.462l4.552,1.42l10.532-6.645 c0.498-0.303,0.953-0.14,0.579,0.192l-8.533,7.701l0,0l0,0H9.84l0.002,0.001l-0.314,4.692c0.46,0,0.663-0.211,0.921-0.46 l2.211-2.15l4.599,3.397c0.848,0.467,1.457,0.227,1.668-0.785l3.019-14.228C22.256,3.912,21.474,3.351,20.665,3.717z"/>
            </svg>
            Telegram
          </a>
        </div>

        {/* Footer */}
        <div className="text-center pb-6 md:pb-8 text-xs md:text-sm text-white/60 border-t border-white/10 pt-4">
          <p>Auraluxx © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
