import { toast } from "@/components/ui/use-toast";

const TMDB_API_KEY = '54d82ce065f64ee04381a81d3bcc2455';
const BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Base API request function with enhanced error handling and retry logic for slow connections
 */
const apiRequest = async (endpoint: string, params = {}, retries = 2) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  
  // Add additional params
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`TMDB API Request (attempt ${attempt + 1}):`, url.toString());
      
      const controller = new AbortController();
      // Progressive timeout: start with 30s for slow connections, reduce on retries
      const timeoutDuration = attempt === 0 ? 30000 : (attempt === 1 ? 20000 : 15000);
      const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
      
      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`TMDB API Error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`TMDB API Success:`, { endpoint, resultsCount: data.results?.length || 0 });
      return data;
      
    } catch (error) {
      console.error(`TMDB API attempt ${attempt + 1} failed:`, error);
      
      if (attempt === retries) {
        console.error('TMDB API final failure:', error);
        // Only show toast for non-abort errors on final attempt
        if (error.name !== 'AbortError') {
          toast({
            title: "Connection Error",
            description: "Content is loading slowly. Please wait or check your internet connection.",
            variant: "destructive",
          });
        }
        return null;
      }
      
      // Progressive backoff: longer waits for slow connections
      const waitTime = Math.pow(2, attempt) * 2000; // 2s, 4s, 8s
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  return null;
};

/**
 * Get trending items
 * @param mediaType - 'all', 'movie', 'tv', or 'person'
 * @param timeWindow - 'day' or 'week'
 */
export const getTrending = (mediaType = 'all', timeWindow = 'week', page = 1) => {
  return apiRequest(`/trending/${mediaType}/${timeWindow}`, { page });
};

/**
 * Search for movies, TV shows, or people
 */
export const searchMulti = (query: string, page = 1) => {
  return apiRequest('/search/multi', { query, page, include_adult: false });
};

/**
 * Get details for a specific movie, TV show, or person
 */
export const getDetails = (mediaType: string, id: number) => {
  return apiRequest(`/${mediaType}/${id}`, { append_to_response: 'credits,similar,videos,recommendations' });
};

/**
 * Get similar content for a movie or TV show - improved accuracy
 */
export const getSimilar = (mediaType: string, id: number, page = 1) => {
  // Use recommendations endpoint which provides more accurate similar content
  return apiRequest(`/${mediaType}/${id}/recommendations`, { page });
};

/**
 * Get collection details
 */
export const getCollection = (collectionId: number) => {
  return apiRequest(`/collection/${collectionId}`);
};

/**
 * Get popular items by type
 */
export const getPopular = (mediaType: string, page = 1) => {
  return apiRequest(`/${mediaType}/popular`, { page });
};

/**
 * Get top rated items by type
 */
export const getTopRated = (mediaType: string, page = 1) => {
  return apiRequest(`/${mediaType}/top_rated`, { page });
};

/**
 * Get now playing / on air
 */
export const getNowPlaying = (mediaType: 'movie' | 'tv', page = 1) => {
  const endpoint = mediaType === 'movie' ? '/movie/now_playing' : '/tv/on_the_air';
  return apiRequest(endpoint, { page });
};

/**
 * Discover items with filters - Enhanced with better date filtering accuracy
 */
export const discover = (mediaType: string, params: Record<string, any> = {}, page = 1) => {
  const enhancedParams: Record<string, any> = { ...params, page };
  
  // Enhanced date filtering for better accuracy - handle both year and date range filtering
  if (enhancedParams.year) {
    const year = enhancedParams.year;
    if (mediaType === 'movie') {
      enhancedParams['primary_release_date.gte'] = `${year}-01-01`;
      enhancedParams['primary_release_date.lte'] = `${year}-12-31`;
    } else {
      enhancedParams['first_air_date.gte'] = `${year}-01-01`;
      enhancedParams['first_air_date.lte'] = `${year}-12-31`;
    }
    delete enhancedParams.year;
  }
  
  // Handle legacy year parameters for backward compatibility
  if (enhancedParams.primary_release_year) {
    const year = enhancedParams.primary_release_year;
    enhancedParams['primary_release_date.gte'] = `${year}-01-01`;
    enhancedParams['primary_release_date.lte'] = `${year}-12-31`;
    delete enhancedParams.primary_release_year;
  }
  
  if (enhancedParams.first_air_date_year) {
    const year = enhancedParams.first_air_date_year;
    enhancedParams['first_air_date.gte'] = `${year}-01-01`;
    enhancedParams['first_air_date.lte'] = `${year}-12-31`;
    delete enhancedParams.first_air_date_year;
  }
  
  return apiRequest(`/discover/${mediaType}`, enhancedParams);
};

/**
 * Get regional content with enhanced filtering
 */
export const getRegionalContent = (language: string, page = 1, filters: Record<string, any> = {}) => {
  const params: Record<string, any> = {
    with_original_language: language,
    sort_by: 'popularity.desc',
    page,
    ...filters
  };
  
  // Apply accurate date range filtering if year is specified
  if (params.year) {
    params['primary_release_date.gte'] = `${params.year}-01-01`;
    params['primary_release_date.lte'] = `${params.year}-12-31`;
    delete params.year;
  }
  
  return apiRequest('/discover/movie', params);
};

/**
 * Get anime content (from Japan with animation genre)
 */
export const getAnimeContent = (filter = 'popular', options: Record<string, any> = {}) => {
  let sortBy = 'popularity.desc';
  const params: Record<string, any> = {
    with_genres: 16, // Animation genre id
    with_original_language: 'ja',
    page: options.page || 1,
  };

  // Handle different filter types
  switch (filter) {
    case 'recent':
      sortBy = 'first_air_date.desc';
      params['first_air_date.lte'] = new Date().toISOString().split('T')[0];
      break;
    case 'top_rated':
      sortBy = 'vote_average.desc';
      params['vote_count.gte'] = 100;
      break;
    case 'popular':
    default:
      sortBy = 'popularity.desc';
      break;
  }

  params.sort_by = sortBy;

  // Add additional filters if provided
  if (options.genre) {
    // Combine animation genre with selected genre
    params.with_genres = `16,${options.genre}`;
  }
  
  if (options.year) {
    params['first_air_date.gte'] = `${options.year}-01-01`;
    params['first_air_date.lte'] = `${options.year}-12-31`;
  }
  
  if (options.language && options.language !== 'ja') {
    // If a different language is selected, use it instead of Japanese
    params.with_original_language = options.language;
  }

  return apiRequest('/discover/tv', params);
};

/**
 * Get trending anime
 */
export const getTrendingAnime = (page = 1) => {
  return apiRequest('/discover/tv', {
    with_genres: 16, // Animation genre id
    with_original_language: 'ja',
    sort_by: 'popularity.desc',
    page
  });
};

/**
 * Get top rated anime
 */
export const getTopRatedAnime = (page = 1) => {
  return apiRequest('/discover/tv', {
    with_genres: 16, // Animation genre id
    with_original_language: 'ja',
    sort_by: 'vote_average.desc',
    'vote_count.gte': 100,
    page
  });
};

/**
 * Get recent anime (on air)
 */
export const getRecentAnime = (page = 1) => {
  return apiRequest('/discover/tv', {
    with_genres: 16, // Animation genre id
    with_original_language: 'ja',
    sort_by: 'first_air_date.desc',
    'first_air_date.lte': new Date().toISOString().split('T')[0],
    page
  });
};

/**
 * Get K-Drama content (Korean TV shows/dramas)
 */
export const getKDramaContent = (filter = 'popular', options: Record<string, any> = {}) => {
  let sortBy = 'popularity.desc';
  const params: Record<string, any> = {
    with_original_language: 'ko',
    page: options.page || 1,
  };

  // Handle different filter types
  switch (filter) {
    case 'recent':
      sortBy = 'first_air_date.desc';
      params['first_air_date.lte'] = new Date().toISOString().split('T')[0];
      break;
    case 'top_rated':
      sortBy = 'vote_average.desc';
      params['vote_count.gte'] = 50;
      break;
    case 'popular':
    default:
      sortBy = 'popularity.desc';
      break;
  }

  params.sort_by = sortBy;

  // Add additional filters if provided
  if (options.genre) {
    params.with_genres = options.genre;
  }
  
  if (options.year) {
    params['first_air_date.gte'] = `${options.year}-01-01`;
    params['first_air_date.lte'] = `${options.year}-12-31`;
  }

  return apiRequest('/discover/tv', params);
};

/**
 * Get trending K-Drama
 */
export const getTrendingKDrama = (page = 1) => {
  return apiRequest('/discover/tv', {
    with_original_language: 'ko',
    sort_by: 'popularity.desc',
    page
  });
};

/**
 * Get top rated K-Drama
 */
export const getTopRatedKDrama = (page = 1) => {
  return apiRequest('/discover/tv', {
    with_original_language: 'ko',
    sort_by: 'vote_average.desc',
    'vote_count.gte': 50,
    page
  });
};

/**
 * Get recent K-Drama
 */
export const getRecentKDrama = (page = 1) => {
  return apiRequest('/discover/tv', {
    with_original_language: 'ko',
    sort_by: 'first_air_date.desc',
    'first_air_date.lte': new Date().toISOString().split('T')[0],
    page
  });
};

/**
 * Get image URL
 */
export const getImageUrl = (path: string, size = 'original') => {
  if (!path) return '/placeholder.svg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

/**
 * Get a list of all available countries
 */
export const getCountries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/configuration/countries?api_key=${TMDB_API_KEY}`);
    if (!response.ok) throw new Error('Failed to fetch countries');
    return await response.json();
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

// Enhanced mapping between country codes and language codes with more comprehensive list
export const countryToLanguagesMap: Record<string, { primary: string; languages: Array<{ code: string; name: string }> }> = {
  'US': {
    primary: 'en',
    languages: [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' }
    ]
  },
  'GB': {
    primary: 'en',
    languages: [
      { code: 'en', name: 'English' }
    ]
  },
  'IN': {
    primary: 'hi',
    languages: [
      { code: 'hi', name: 'Hindi' },
      { code: 'bn', name: 'Bengali' },
      { code: 'ta', name: 'Tamil' },
      { code: 'te', name: 'Telugu' },
      { code: 'mr', name: 'Marathi' },
      { code: 'gu', name: 'Gujarati' },
      { code: 'kn', name: 'Kannada' },
      { code: 'ml', name: 'Malayalam' },
      { code: 'pa', name: 'Punjabi' },
      { code: 'or', name: 'Odia' },
      { code: 'as', name: 'Assamese' },
      { code: 'en', name: 'English' }
    ]
  },
  'JP': {
    primary: 'ja',
    languages: [
      { code: 'ja', name: 'Japanese' }
    ]
  },
  'KR': {
    primary: 'ko',
    languages: [
      { code: 'ko', name: 'Korean' }
    ]
  },
  'CN': {
    primary: 'zh',
    languages: [
      { code: 'zh', name: 'Mandarin Chinese' },
      { code: 'yue', name: 'Cantonese' }
    ]
  },
  'HK': {
    primary: 'zh',
    languages: [
      { code: 'yue', name: 'Cantonese' },
      { code: 'zh', name: 'Mandarin Chinese' },
      { code: 'en', name: 'English' }
    ]
  },
  'TW': {
    primary: 'zh',
    languages: [
      { code: 'zh', name: 'Traditional Chinese' }
    ]
  },
  'FR': {
    primary: 'fr',
    languages: [
      { code: 'fr', name: 'French' }
    ]
  },
  'DE': {
    primary: 'de',
    languages: [
      { code: 'de', name: 'German' }
    ]
  },
  'IT': {
    primary: 'it',
    languages: [
      { code: 'it', name: 'Italian' }
    ]
  },
  'ES': {
    primary: 'es',
    languages: [
      { code: 'es', name: 'Spanish' },
      { code: 'ca', name: 'Catalan' },
      { code: 'eu', name: 'Basque' },
      { code: 'gl', name: 'Galician' }
    ]
  },
  'RU': {
    primary: 'ru',
    languages: [
      { code: 'ru', name: 'Russian' }
    ]
  },
  'BR': {
    primary: 'pt',
    languages: [
      { code: 'pt', name: 'Portuguese' }
    ]
  },
  'MX': {
    primary: 'es',
    languages: [
      { code: 'es', name: 'Spanish' }
    ]
  },
  'TH': {
    primary: 'th',
    languages: [
      { code: 'th', name: 'Thai' }
    ]
  },
  'TR': {
    primary: 'tr',
    languages: [
      { code: 'tr', name: 'Turkish' }
    ]
  },
  'PH': {
    primary: 'tl',
    languages: [
      { code: 'tl', name: 'Filipino' },
      { code: 'en', name: 'English' }
    ]
  },
  'ID': {
    primary: 'id',
    languages: [
      { code: 'id', name: 'Indonesian' },
      { code: 'jv', name: 'Javanese' }
    ]
  },
  'NG': {
    primary: 'en',
    languages: [
      { code: 'en', name: 'English' },
      { code: 'ha', name: 'Hausa' },
      { code: 'ig', name: 'Igbo' },
      { code: 'yo', name: 'Yoruba' }
    ]
  },
  'AR': {
    primary: 'es',
    languages: [
      { code: 'es', name: 'Spanish' }
    ]
  },
  'CA': {
    primary: 'en',
    languages: [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'French' }
    ]
  },
  'AU': {
    primary: 'en',
    languages: [
      { code: 'en', name: 'English' }
    ]
  },
  'NL': {
    primary: 'nl',
    languages: [
      { code: 'nl', name: 'Dutch' }
    ]
  },
  'SE': {
    primary: 'sv',
    languages: [
      { code: 'sv', name: 'Swedish' }
    ]
  },
  'NO': {
    primary: 'no',
    languages: [
      { code: 'no', name: 'Norwegian' }
    ]
  },
  'DK': {
    primary: 'da',
    languages: [
      { code: 'da', name: 'Danish' }
    ]
  },
  'FI': {
    primary: 'fi',
    languages: [
      { code: 'fi', name: 'Finnish' }
    ]
  },
  'PT': {
    primary: 'pt',
    languages: [
      { code: 'pt', name: 'Portuguese' }
    ]
  },
  'GR': {
    primary: 'el',
    languages: [
      { code: 'el', name: 'Greek' }
    ]
  },
  'PL': {
    primary: 'pl',
    languages: [
      { code: 'pl', name: 'Polish' }
    ]
  },
  'CZ': {
    primary: 'cs',
    languages: [
      { code: 'cs', name: 'Czech' }
    ]
  },
  'SK': {
    primary: 'sk',
    languages: [
      { code: 'sk', name: 'Slovak' }
    ]
  },
  'HU': {
    primary: 'hu',
    languages: [
      { code: 'hu', name: 'Hungarian' }
    ]
  }
};

// Backward compatibility
export const countryToLanguageMap: Record<string, string> = Object.fromEntries(
  Object.entries(countryToLanguagesMap).map(([country, { primary }]) => [country, primary])
);
