
import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface AdContextType {
  isAdEnabled: boolean;
  toggleAds: () => void;
}

const AdContext = createContext<AdContextType>({
  isAdEnabled: true,
  toggleAds: () => {},
});

export const useAds = () => useContext(AdContext);

export const AdProvider = ({ children }: { children: ReactNode }) => {
  const { isAdFree } = useAuth();

  // Ads are disabled when user has ad-free time
  const isAdEnabled = !isAdFree;

  const toggleAds = () => {
    // This function is kept for compatibility but doesn't do anything
    // Ad state is now controlled by authentication system
  };

  return (
    <AdContext.Provider value={{ isAdEnabled, toggleAds }}>
      {children}
    </AdContext.Provider>
  );
};
