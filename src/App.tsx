
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdProvider } from "./contexts/AdContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import TvSeriesPage from "./pages/TvSeriesPage";
import AnimePage from "./pages/AnimePage";
import RegionalPage from "./pages/RegionalPage";
import KDramaPage from "./pages/KDramaPage";
import SearchPage from "./pages/SearchPage";
import WatchPage from "./pages/WatchPage";
import SpeedtestPage from "./pages/SpeedtestPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import DmcaPage from "./pages/DmcaPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AdProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movies" element={<MoviePage />} />
              <Route path="/tv-series" element={<TvSeriesPage />} />
              <Route path="/anime" element={<AnimePage />} />
              <Route path="/regional" element={<RegionalPage />} />
              <Route path="/k-drama" element={<KDramaPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/watch/:type/:id" element={<WatchPage />} />
              <Route path="/watch/:type/:id/" element={<WatchPage />} />
              <Route path="/speedtest" element={<SpeedtestPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/dmca" element={<DmcaPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AdProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
