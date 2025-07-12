
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

  // Ads are completely disabled when user has ad-free time
  // This ensures no ads show up anywhere in the app
  const isAdEnabled = !isAdFree;

  const toggleAds = () => {
    // This function is kept for compatibility but doesn't do anything
    // Ad state is now controlled by authentication system
    console.log('Ad toggle attempted, but ads are controlled by ad-free status:', { isAdFree, isAdEnabled });
  };

  // Log ad status for debugging
  console.log('Ad Context Status:', { isAdFree, isAdEnabled });

  return (
    <AdContext.Provider value={{ isAdEnabled, toggleAds }}>
      {children}
    </AdContext.Provider>
  );
};
