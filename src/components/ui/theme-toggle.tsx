
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-aura-purple focus:ring-offset-2 focus:ring-offset-background",
        theme === 'dark' 
          ? "bg-aura-purple shadow-lg" 
          : "bg-gray-300 dark:bg-gray-600"
      )}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      type="button"
    >
      {/* Background gradient overlay for better visual effect */}
      <div className={cn(
        "absolute inset-0 rounded-full transition-all duration-300",
        theme === 'dark' 
          ? "bg-gradient-to-r from-aura-purple to-purple-600" 
          : "bg-gradient-to-r from-gray-200 to-gray-400"
      )} />
      
      {/* Sliding indicator */}
      <div className={cn(
        "relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out transform",
        theme === 'dark' 
          ? "translate-x-7" 
          : "translate-x-1"
      )}>
        {/* Icons with smooth transition */}
        <div className="relative">
          <Sun className={cn(
            "h-3.5 w-3.5 absolute transition-all duration-300 ease-in-out",
            theme === 'dark' 
              ? "opacity-0 scale-0 rotate-180 text-gray-400" 
              : "opacity-100 scale-100 rotate-0 text-yellow-500"
          )} />
          <Moon className={cn(
            "h-3.5 w-3.5 absolute transition-all duration-300 ease-in-out",
            theme === 'dark' 
              ? "opacity-100 scale-100 rotate-0 text-purple-600" 
              : "opacity-0 scale-0 -rotate-180 text-gray-400"
          )} />
        </div>
      </div>
      
      {/* Background icons for better context */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
        <Sun className={cn(
          "h-3 w-3 transition-all duration-300",
          theme === 'light' 
            ? "text-yellow-600 opacity-70" 
            : "text-white/30 opacity-40"
        )} />
        <Moon className={cn(
          "h-3 w-3 transition-all duration-300",
          theme === 'dark' 
            ? "text-white opacity-70" 
            : "text-gray-500/30 opacity-40"
        )} />
      </div>
    </button>
  );
};
