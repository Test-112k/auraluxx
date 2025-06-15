
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-md hover:bg-white/10 transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative">
        {theme === 'light' ? (
          <Moon className="h-4 w-4 text-white transition-all duration-300 ease-in-out transform rotate-0 scale-100" />
        ) : (
          <Sun className="h-4 w-4 text-yellow-400 transition-all duration-300 ease-in-out transform rotate-180 scale-100" />
        )}
      </div>
    </Button>
  );
};
