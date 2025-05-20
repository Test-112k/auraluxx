
import { createContext, useContext, ReactNode, useState } from 'react';

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
  const [isAdEnabled, setIsAdEnabled] = useState(true);

  const toggleAds = () => {
    setIsAdEnabled(prev => !prev);
  };

  return (
    <AdContext.Provider value={{ isAdEnabled, toggleAds }}>
      {children}
    </AdContext.Provider>
  );
};
