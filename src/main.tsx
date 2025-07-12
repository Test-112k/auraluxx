import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { SearchProvider } from '@/contexts/SearchContext'
import { AdProvider } from '@/contexts/AdContext'
import { WatchHistoryProvider } from '@/contexts/WatchHistoryContext'

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <LanguageProvider>
      <AuthProvider>
        <SearchProvider>
          <AdProvider>
            <WatchHistoryProvider>
              <App />
            </WatchHistoryProvider>
          </AdProvider>
        </SearchProvider>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
);
