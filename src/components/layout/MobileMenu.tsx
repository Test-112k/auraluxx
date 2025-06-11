
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
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] bg-aura-dark backdrop-blur-sm flex flex-col animate-fade-in">
      {/* Header with close button */}
      <div className="flex justify-between items-center p-4 border-b border-aura-purple/30 bg-aura-dark">
        <h2 className="text-xl font-bold text-white">Menu</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="text-white hover:bg-aura-purple/20 transition-colors min-h-[44px] min-w-[44px]"
        >
          <X size={24} />
        </Button>
      </div>

      {/* Menu items */}
      <div className="flex-1 bg-aura-dark p-6">
        <div className="space-y-6">
          <Link 
            to="/" 
            onClick={onClose}
            className="block text-lg font-medium text-white hover:text-aura-purple transition-colors py-3 border-b border-aura-purple/20"
          >
            Home
          </Link>
          <Link 
            to="/movies" 
            onClick={onClose}
            className="block text-lg font-medium text-white hover:text-aura-purple transition-colors py-3 border-b border-aura-purple/20"
          >
            Movies
          </Link>
          <Link 
            to="/tv-series" 
            onClick={onClose}
            className="block text-lg font-medium text-white hover:text-aura-purple transition-colors py-3 border-b border-aura-purple/20"
          >
            TV Shows
          </Link>
          <Link 
            to="/anime" 
            onClick={onClose}
            className="block text-lg font-medium text-white hover:text-aura-purple transition-colors py-3 border-b border-aura-purple/20"
          >
            Anime
          </Link>
          <Link 
            to="/regional" 
            onClick={onClose}
            className="block text-lg font-medium text-white hover:text-aura-purple transition-colors py-3 border-b border-aura-purple/20"
          >
            Regional
          </Link>
          <a 
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="block text-lg font-medium text-white hover:text-aura-purple transition-colors py-3 flex items-center"
          >
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
      </div>

      {/* Footer */}
      <div className="text-center p-4 text-sm text-white/60 border-t border-aura-purple/30 bg-aura-dark">
        <p>Auraluxx © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default MobileMenu;
