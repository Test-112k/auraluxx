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
    // Navigation & Layout
    'Trending Movies': 'Trending Movies',
    'Trending TV Shows': 'Trending TV Shows',
    'Trending Anime': 'Trending Anime',
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
    'Change': 'Change',
    'Success': 'Success',
    'Language updated successfully': 'Language updated successfully',
    
    // Content Actions
    'Watch Trailer': 'Watch Trailer',
    'Play': 'Play',
    'View Details': 'View Details',
    'More Info': 'More Info',
    'Add to Watchlist': 'Add to Watchlist',
    'Remove from Watchlist': 'Remove from Watchlist',
    
    // Content Information
    'Rating': 'Rating',
    'Release Date': 'Release Date',
    'Runtime': 'Runtime',
    'Genre': 'Genre',
    'Genres': 'Genres',
    'Overview': 'Overview',
    'Plot': 'Plot',
    'Summary': 'Summary',
    'Cast': 'Cast',
    'Cast & Crew': 'Cast & Crew',
    'Recommendations': 'Recommendations',
    'Similar': 'Similar',
    'Related': 'Related',
    'Season': 'Season',
    'Episode': 'Episode',
    'Episodes': 'Episodes',
    'Seasons': 'Seasons',
    'Director': 'Director',
    'Writer': 'Writer',
    'Writers': 'Writers',
    'Producers': 'Producers',
    'Studio': 'Studio',
    'Studios': 'Studios',
    'Network': 'Network',
    'Networks': 'Networks',
    'Air Date': 'Air Date',
    'First Air Date': 'First Air Date',
    'Last Air Date': 'Last Air Date',
    'Status': 'Status',
    'Country': 'Country',
    'Countries': 'Countries',
    'Original Language': 'Original Language',
    'Budget': 'Budget',
    'Revenue': 'Revenue',
    'Tagline': 'Tagline',
    'Keywords': 'Keywords',
    
    // Status Values
    'Returning Series': 'Returning Series',
    'Ended': 'Ended',
    'Canceled': 'Canceled',
    'In Production': 'In Production',
    'Planned': 'Planned',
    'Pilot': 'Pilot',
    'Released': 'Released',
    'Post Production': 'Post Production',
    'Rumored': 'Rumored',
    
    // UI Elements
    'Loading': 'Loading',
    'Load More': 'Load More',
    'View All': 'View All',
    'Show More': 'Show More',
    'Show Less': 'Show Less',
    'Search': 'Search',
    'Search Results': 'Search Results',
    'No Results Found': 'No Results Found',
    'Error': 'Error',
    'Try Again': 'Try Again',
    'Back': 'Back',
    'Next': 'Next',
    'Previous': 'Previous',
    'Page': 'Page',
    'of': 'of',
    
    // Settings & Account
    'Language Settings': 'Language Settings',
    'Select Language': 'Select Language',
    'Apply': 'Apply',
    'Cancel': 'Cancel',
    'Save': 'Save',
    'Profile Settings': 'Profile Settings',
    'Account Settings': 'Account Settings',
    'Privacy Settings': 'Privacy Settings',
    'Notification Settings': 'Notification Settings',
    
    // Time & Date
    'minutes': 'minutes',
    'hours': 'hours',
    'days': 'days',
    'weeks': 'weeks',
    'months': 'months',
    'years': 'years',
    'min': 'min',
    'hr': 'hr',
    'Today': 'Today',
    'Yesterday': 'Yesterday',
    'This Week': 'This Week',
    'This Month': 'This Month',
    'This Year': 'This Year',
    
    // Common Phrases
    'Welcome': 'Welcome',
    'Welcome back': 'Welcome back',
    'Good morning': 'Good morning',
    'Good afternoon': 'Good afternoon',
    'Good evening': 'Good evening',
    'Thank you': 'Thank you',
    'You\'re welcome': 'You\'re welcome',
    'Please': 'Please',
    'Sorry': 'Sorry',
    'Excuse me': 'Excuse me',
  },
  es: {
    // Navigation & Layout
    'Trending Movies': 'Películas en Tendencia',
    'Trending TV Shows': 'Series de TV en Tendencia',
    'Trending Anime': 'Anime en Tendencia',
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
    'Change': 'Cambiar',
    'Success': 'Éxito',
    'Language updated successfully': 'Idioma actualizado exitosamente',
    
    // Content Actions
    'Watch Trailer': 'Ver Tráiler',
    'Play': 'Reproducir',
    'View Details': 'Ver Detalles',
    'More Info': 'Más Información',
    'Add to Watchlist': 'Agregar a Lista',
    'Remove from Watchlist': 'Quitar de Lista',
    
    // Content Information
    'Rating': 'Calificación',
    'Release Date': 'Fecha de Estreno',
    'Runtime': 'Duración',
    'Genre': 'Género',
    'Genres': 'Géneros',
    'Overview': 'Sinopsis',
    'Plot': 'Trama',
    'Summary': 'Resumen',
    'Cast': 'Reparto',
    'Cast & Crew': 'Reparto y Equipo',
    'Recommendations': 'Recomendaciones',
    'Similar': 'Similar',
    'Related': 'Relacionado',
    'Season': 'Temporada',
    'Episode': 'Episodio',
    'Episodes': 'Episodios',
    'Seasons': 'Temporadas',
    'Director': 'Director',
    'Writer': 'Guionista',
    'Writers': 'Guionistas',
    'Producers': 'Productores',
    'Studio': 'Estudio',
    'Studios': 'Estudios',
    'Network': 'Cadena',
    'Networks': 'Cadenas',
    'Air Date': 'Fecha de Emisión',
    'First Air Date': 'Primera Emisión',
    'Last Air Date': 'Última Emisión',
    'Status': 'Estado',
    'Country': 'País',
    'Countries': 'Países',
    'Original Language': 'Idioma Original',
    'Budget': 'Presupuesto',
    'Revenue': 'Recaudación',
    'Tagline': 'Lema',
    'Keywords': 'Palabras Clave',
    
    // Status Values
    'Returning Series': 'Serie Renovada',
    'Ended': 'Finalizada',
    'Canceled': 'Cancelada',
    'In Production': 'En Producción',
    'Planned': 'Planeada',
    'Pilot': 'Piloto',
    'Released': 'Estrenada',
    'Post Production': 'Postproducción',
    'Rumored': 'Rumoreada',
    
    // UI Elements
    'Loading': 'Cargando',
    'Load More': 'Cargar Más',
    'View All': 'Ver Todo',
    'Show More': 'Mostrar Más',
    'Show Less': 'Mostrar Menos',
    'Search': 'Buscar',
    'Search Results': 'Resultados de Búsqueda',
    'No Results Found': 'No se Encontraron Resultados',
    'Error': 'Error',
    'Try Again': 'Intentar de Nuevo',
    'Back': 'Atrás',
    'Next': 'Siguiente',
    'Previous': 'Anterior',
    'Page': 'Página',
    'of': 'de',
    
    // Settings & Account
    'Language Settings': 'Configuración de Idioma',
    'Select Language': 'Seleccionar Idioma',
    'Apply': 'Aplicar',
    'Cancel': 'Cancelar',
    'Save': 'Guardar',
    'Profile Settings': 'Configuración de Perfil',
    'Account Settings': 'Configuración de Cuenta',
    'Privacy Settings': 'Configuración de Privacidad',
    'Notification Settings': 'Configuración de Notificaciones',
    
    // Time & Date
    'minutes': 'minutos',
    'hours': 'horas',
    'days': 'días',
    'weeks': 'semanas',
    'months': 'meses',
    'years': 'años',
    'min': 'min',
    'hr': 'hr',
    'Today': 'Hoy',
    'Yesterday': 'Ayer',
    'This Week': 'Esta Semana',
    'This Month': 'Este Mes',
    'This Year': 'Este Año',
    
    // Common Phrases
    'Welcome': 'Bienvenido',
    'Welcome back': 'Bienvenido de nuevo',
    'Good morning': 'Buenos días',
    'Good afternoon': 'Buenas tardes',
    'Good evening': 'Buenas noches',
    'Thank you': 'Gracias',
    'You\'re welcome': 'De nada',
    'Please': 'Por favor',
    'Sorry': 'Lo siento',
    'Excuse me': 'Disculpe',
  },
  fr: {
    // Navigation & Layout
    'Trending Movies': 'Films Tendance',
    'Trending TV Shows': 'Séries TV Tendance',
    'Trending Anime': 'Anime Tendance',
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
    'Change': 'Changer',
    'Success': 'Succès',
    'Language updated successfully': 'Langue mise à jour avec succès',
    
    // Content Actions
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
