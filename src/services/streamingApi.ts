
/**
 * RiveStream API Service
 * Based on https://rivestream.net/embed/docs#api
 */

// Generate embed URL for a TMDb ID
export const getEmbedUrl = (tmdbId: string, type: 'movie' | 'tv', season?: number, episode?: number) => {
  const baseUrl = 'https://rivestream.net/embed';
  
  // Build URL with query parameters
  const url = new URL(baseUrl);
  url.searchParams.append('type', type);
  url.searchParams.append('id', tmdbId);
  
  // Add season and episode for TV shows
  if (type === 'tv' && season !== undefined) {
    url.searchParams.append('season', season.toString());
    
    if (episode !== undefined) {
      url.searchParams.append('episode', episode.toString());
    }
  }
  
  return url.toString();
};

// Generate iframe to embed the player
export const generatePlayerIframe = (tmdbId: string, type: 'movie' | 'tv', title: string, season?: number, episode?: number) => {
  const embedUrl = getEmbedUrl(tmdbId, type, season, episode);
  return `<iframe
    src="${embedUrl}"
    width="100%"
    height="100%"
    frameborder="0"
    allowfullscreen
    allow="autoplay; encrypted-media; picture-in-picture"
    title="${title}"
  ></iframe>`;
};

// Convert TMDB id to a format RiveStream can use
export const formatTmdbId = (id: string | number) => {
  return String(id);
};

interface StreamOptions {
  server?: string;
  subLang?: string;
  season?: number;
  episode?: number;
}

// Create direct streaming URL with options
export const getStreamUrl = (
  tmdbId: string | number,
  type: 'movie' | 'tv',
  options: StreamOptions = {}
) => {
  const id = formatTmdbId(tmdbId);
  const baseUrl = 'https://rivestream.net/embed';
  const queryParams = new URLSearchParams();
  
  // Add required parameters
  queryParams.append('type', type);
  queryParams.append('id', id);
  
  // Add optional parameters if provided
  if (options.server) {
    queryParams.append('server', options.server);
  }
  
  if (options.subLang) {
    queryParams.append('sub_lang', options.subLang);
  }
  
  // For TV shows, add season and episode
  if (type === 'tv') {
    if (options.season !== undefined) {
      queryParams.append('season', String(options.season));
      
      if (options.episode !== undefined) {
        queryParams.append('episode', String(options.episode));
      }
    }
  }
  
  return `${baseUrl}?${queryParams.toString()}`;
};
