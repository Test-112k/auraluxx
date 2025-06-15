
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-16 items-center rounded-full bg-gray-700 dark:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-aura-purple focus:ring-offset-2 focus:ring-offset-background"
      role="switch"
      aria-checked={theme === 'dark'}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Background track */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 dark:from-gray-800 dark:to-gray-900 transition-all duration-300" />
      
      {/* Sliding pill */}
      <div
        className={`
          relative inline-block h-6 w-6 rounded-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${theme === 'dark' ? 'translate-x-9' : 'translate-x-1'}
        `}
      >
        {/* Icon container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {theme === 'light' ? (
            <Sun className="h-3.5 w-3.5 text-yellow-500 transition-all duration-300" />
          ) : (
            <Moon className="h-3.5 w-3.5 text-slate-700 transition-all duration-300" />
          )}
        </div>
      </div>
      
      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <Sun className={`h-3 w-3 transition-opacity duration-300 ${theme === 'light' ? 'opacity-0' : 'opacity-60 text-yellow-400'}`} />
        <Moon className={`h-3 w-3 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-0' : 'opacity-60 text-white'}`} />
      </div>
    </button>
  );
};
