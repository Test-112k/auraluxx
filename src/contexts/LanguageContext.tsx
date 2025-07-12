import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type Language = {
  code: string;
  name: string;
  nativeName: string;
};

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
];

const translations: Record<string, Record<string, string>> = {
  en: {
    'Trending Movies': 'Trending Movies',
    'Trending TV Shows': 'Trending TV Shows',
    'Now Playing': 'Now Playing',
    'Popular Movies': 'Popular Movies',
    'Top Rated Movies': 'Top Rated Movies',
    'Popular Anime': 'Popular Anime',
    'Continue Watching': 'Continue Watching',
    'Search for movies, TV shows...': 'Search for movies, TV shows...',
    'Home': 'Home',
    'Movies': 'Movies',
    'TV Series': 'TV Series',
    'Anime': 'Anime',
    'K-Drama': 'K-Drama',
    'Regional': 'Regional',
    'Account': 'Account',
    'Language': 'Language',
    'Theme': 'Theme',
    'Settings': 'Settings',
    'Logout': 'Logout',
    'Login': 'Login',
    'Watch Trailer': 'Watch Trailer',
    'Play': 'Play',
    'View Details': 'View Details',
    'Rating': 'Rating',
    'Release Date': 'Release Date',
    'Runtime': 'Runtime',
    'Genre': 'Genre',
    'Overview': 'Overview',
    'Cast': 'Cast',
    'Recommendations': 'Recommendations',
    'Similar': 'Similar',
    'Season': 'Season',
    'Episode': 'Episode',
    'Episodes': 'Episodes',
    'Seasons': 'Seasons',
    'Director': 'Director',
    'Writer': 'Writer',
    'Producers': 'Producers',
    'Studio': 'Studio',
    'Network': 'Network',
    'Air Date': 'Air Date',
    'Status': 'Status',
    'Language Settings': 'Language Settings',
    'Select Language': 'Select Language',
    'Apply': 'Apply',
    'Cancel': 'Cancel',
  },
  es: {
    'Trending Movies': 'Películas Tendencia',
    'Trending TV Shows': 'Series de TV Tendencia',
    'Now Playing': 'En Cartelera',
    'Popular Movies': 'Películas Populares',
    'Top Rated Movies': 'Películas Mejor Valoradas',
    'Popular Anime': 'Anime Popular',
    'Continue Watching': 'Continuar Viendo',
    'Search for movies, TV shows...': 'Buscar películas, series...',
    'Home': 'Inicio',
    'Movies': 'Películas',
    'TV Series': 'Series de TV',
    'Anime': 'Anime',
    'K-Drama': 'K-Drama',
    'Regional': 'Regional',
    'Account': 'Cuenta',
    'Language': 'Idioma',
    'Theme': 'Tema',
    'Settings': 'Configuración',
    'Logout': 'Cerrar Sesión',
    'Login': 'Iniciar Sesión',
    'Watch Trailer': 'Ver Tráiler',
    'Play': 'Reproducir',
    'View Details': 'Ver Detalles',
    'Rating': 'Calificación',
    'Release Date': 'Fecha de Estreno',
    'Runtime': 'Duración',
    'Genre': 'Género',
    'Overview': 'Sinopsis',
    'Cast': 'Reparto',
    'Recommendations': 'Recomendaciones',
    'Similar': 'Similar',
    'Season': 'Temporada',
    'Episode': 'Episodio',
    'Episodes': 'Episodios',
    'Seasons': 'Temporadas',
    'Director': 'Director',
    'Writer': 'Guionista',
    'Producers': 'Productores',
    'Studio': 'Estudio',
    'Network': 'Cadena',
    'Air Date': 'Fecha de Emisión',
    'Status': 'Estado',
    'Language Settings': 'Configuración de Idioma',
    'Select Language': 'Seleccionar Idioma',
    'Apply': 'Aplicar',
    'Cancel': 'Cancelar',
  },
  fr: {
    'Trending Movies': 'Films Tendance',
    'Trending TV Shows': 'Séries TV Tendance',
    'Now Playing': 'À l\'Affiche',
    'Popular Movies': 'Films Populaires',
    'Top Rated Movies': 'Films les Mieux Notés',
    'Popular Anime': 'Anime Populaire',
    'Continue Watching': 'Continuer à Regarder',
    'Search for movies, TV shows...': 'Rechercher films, séries...',
    'Home': 'Accueil',
    'Movies': 'Films',
    'TV Series': 'Séries TV',
    'Anime': 'Anime',
    'K-Drama': 'K-Drama',
    'Regional': 'Régional',
    'Account': 'Compte',
    'Language': 'Langue',
    'Theme': 'Thème',
    'Settings': 'Paramètres',
    'Logout': 'Déconnexion',
    'Login': 'Connexion',
    'Watch Trailer': 'Voir la Bande-annonce',
    'Play': 'Lire',
    'View Details': 'Voir les Détails',
    'Rating': 'Note',
    'Release Date': 'Date de Sortie',
    'Runtime': 'Durée',
    'Genre': 'Genre',
    'Overview': 'Résumé',
    'Cast': 'Distribution',
    'Recommendations': 'Recommandations',
    'Similar': 'Similaire',
    'Season': 'Saison',
    'Episode': 'Épisode',
    'Episodes': 'Épisodes',
    'Seasons': 'Saisons',
    'Director': 'Réalisateur',
    'Writer': 'Scénariste',
    'Producers': 'Producteurs',
    'Studio': 'Studio',
    'Network': 'Chaîne',
    'Air Date': 'Date de Diffusion',
    'Status': 'Statut',
    'Language Settings': 'Paramètres de Langue',
    'Select Language': 'Sélectionner la Langue',
    'Apply': 'Appliquer',
    'Cancel': 'Annuler',
  },
  // Add more languages as needed
};

interface LanguageContextType {
  currentLanguage: Language;
  availableLanguages: Language[];
  changeLanguage: (code: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: languages[0],
  availableLanguages: languages,
  changeLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    const stored = localStorage.getItem('auraluxx-language');
    if (stored) {
      const found = languages.find(lang => lang.code === stored);
      if (found) {
        setCurrentLanguage(found);
      }
    }
  }, []);

  const changeLanguage = (code: string) => {
    const language = languages.find(lang => lang.code === code);
    if (language) {
      setCurrentLanguage(language);
      localStorage.setItem('auraluxx-language', code);
    }
  };

  const t = (key: string): string => {
    const languageTranslations = translations[currentLanguage.code];
    return languageTranslations?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      availableLanguages: languages,
      changeLanguage,
      t,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};