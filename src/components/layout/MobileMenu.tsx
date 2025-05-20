
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
          <svg 
            className="mr-2 h-5 w-5" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.665-.436 2.13-.754 4.141l-.545 3.02c-.003.017-.047 1.177-.166 1.555-.157.505-.356.629-.585.629-.166 0-.378-.089-.594-.276-.277-.24-.858-.8-1.222-1.145-.249-.237-.646-.587-1.069-.587-.475 0-.848.343-.97.438l-.001.001c-.3.214-.546.39-.782.39-.45 0-.708-.248-.708-.688 0-.322.3-.511.3-.511l.124-.121s2.039-1.832 2.206-2.06c.014-.02.029-.04.044-.061.05-.068.118-.161.13-.294.012-.139-.093-.265-.374-.265-.644 0-1.904 1.269-1.904 1.269-.192.127-.394.19-.615.19-.318 0-.686-.141-.942-.266-.4-.194-1.698-.93-2.358-1.626-.111-.117-.468-.297-.468-.564 0-.265.42-.604 1.132-.604h4.146c.552 0 .814-.39.814-.76 0-.381-.299-.703-.93-.703H7.366c-.064 0-.118-.055-.118-.123 0-.068.054-.123.118-.123h4.145c.952 0 1.174-.673 1.174-.996 0-.067-.343-.994-1.174-.994h-3.8c-.378 0-.602-.47-.602-.828 0-.256.115-.441.603-.441h6.667c.382 0 .738-.173.738-.488 0-.482-.56-.677-.837-.677H8.163c-.068 0-.123-.055-.123-.123S8.095 5 8.163 5h6.026c.389 0 .904-.262.904-.57 0-.251-.186-.43-.474-.43H9.252c-.068 0-.123-.055-.123-.123s.055-.123.123-.123h5.367c.114 0 .3-.028.3-.276 0-.231-.185-.394-.3-.394H9.16c-.069 0-.124-.055-.124-.123s.055-.123.124-.123h5.249c.902 0 1.349.616 1.349 1.043 0 .427-.241.87-.779.968.538.098.95.573.95 1.144 0 .57-.232.973-.827 1.064.595.09.793.616.793 1.043 0 .241-.055.432-.155.579.928.111 1.153.678 1.153 1.023 0 .587-.495.876-.93.968.834.14 1.613.618 1.613 1.35 0 .733-.881 1.163-1.5.894z" />
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
