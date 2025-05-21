
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
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col animate-in fade-in slide-in-from-bottom duration-300 md:hidden">
      <div className="flex justify-end p-6">
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
          <X size={24} />
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 space-y-6 text-center overflow-y-auto py-4">
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
            fill="#ffffff"
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20.665,3.717l-17.73,6.837c-1.21,0.486-1.203,1.161-0.222,1.462l4.552,1.42l10.532-6.645 c0.498-0.303,0.953-0.14,0.579,0.192l-8.533,7.701l0,0l0,0H9.84l0.002,0.001l-0.314,4.692c0.46,0,0.663-0.211,0.921-0.46 l2.211-2.15l4.599,3.397c0.848,0.467,1.457,0.227,1.668-0.785l3.019-14.228C22.256,3.912,21.474,3.351,20.665,3.717z"/>
          </svg>
          Telegram
        </a>
        
        <div className="w-full h-px bg-white/10 my-2"></div>
        
        <Link 
          to="/terms" 
          onClick={onClose}
          className="text-lg font-medium text-white/80 hover:text-white transition-all"
        >
          Terms of Use
        </Link>
        <Link 
          to="/privacy" 
          onClick={onClose}
          className="text-lg font-medium text-white/80 hover:text-white transition-all"
        >
          Privacy Policy
        </Link>
        <Link 
          to="/dmca" 
          onClick={onClose}
          className="text-lg font-medium text-white/80 hover:text-white transition-all"
        >
          DMCA
        </Link>
        <Link 
          to="/contact" 
          onClick={onClose}
          className="text-lg font-medium text-white/80 hover:text-white transition-all"
        >
          Contact Us
        </Link>
      </div>

      <div className="text-center pb-8 text-sm text-white/60">
        <p>Auraluxx © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default MobileMenu;
