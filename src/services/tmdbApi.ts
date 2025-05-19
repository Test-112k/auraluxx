
import { toast } from "@/components/ui/use-toast";

const TMDB_API_KEY = '54d82ce065f64ee04381a81d3bcc2455';
const BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Base API request function with error handling
 */
const apiRequest = async (endpoint: string, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  
  // Add additional params
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  
  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    toast({
      title: "Error",
      description: "Failed to fetch content. Please try again later.",
      variant: "destructive",
    });
    return null;
  }
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
  return apiRequest(`/${mediaType}/${id}`, { append_to_response: 'credits,similar,videos' });
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
 * Discover items with filters
 */
export const discover = (mediaType: string, params = {}, page = 1) => {
  return apiRequest(`/discover/${mediaType}`, { ...params, page });
};

/**
 * Get popular movies from a specific country (region)
 */
export const getRegionalContent = (region: string, page = 1) => {
  return apiRequest('/discover/movie', { 
    with_original_language: region, 
    sort_by: 'popularity.desc',
    page
  });
};

/**
 * Get anime content (from Japan with animation genre)
 */
export const getAnimeContent = (page = 1) => {
  return apiRequest('/discover/tv', {
    with_genres: 16, // Animation genre id
    with_original_language: 'ja',
    sort_by: 'popularity.desc',
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

// Mapping between country codes and language codes (simplified list)
export const countryToLanguageMap: Record<string, string> = {
  'US': 'en', // United States - English
  'GB': 'en', // United Kingdom - English
  'IN': 'hi', // India - Hindi
  'JP': 'ja', // Japan - Japanese
  'KR': 'ko', // South Korea - Korean
  'FR': 'fr', // France - French
  'DE': 'de', // Germany - German
  'IT': 'it', // Italy - Italian
  'ES': 'es', // Spain - Spanish
  'CN': 'zh', // China - Chinese
  'HK': 'zh', // Hong Kong - Chinese
  'TW': 'zh', // Taiwan - Chinese
  'RU': 'ru', // Russia - Russian
  'BR': 'pt', // Brazil - Portuguese
  'MX': 'es', // Mexico - Spanish
  'TH': 'th', // Thailand - Thai
  'TR': 'tr', // Turkey - Turkish
  'PH': 'tl', // Philippines - Tagalog
  'ID': 'id', // Indonesia - Indonesian
  'NG': 'en', // Nigeria - English (Nollywood)
  'AR': 'es', // Argentina - Spanish
};
