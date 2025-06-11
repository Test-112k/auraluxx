
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      console.log('Scroll position:', window.scrollY); // Debug log
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    // Check initial scroll position
    toggleVisibility();
    
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  console.log('ScrollToTop isVisible:', isVisible); // Debug log

  return (
    <Button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-[50] rounded-full p-3 bg-aura-purple hover:bg-aura-darkpurple text-white shadow-xl transition-all duration-300 min-h-[50px] min-w-[50px] ${
        isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-2 pointer-events-none'
      }`}
      size="icon"
      aria-label="Scroll to top"
      style={{ display: 'block' }}
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
};

export default ScrollToTop;
