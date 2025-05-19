
/**
 * RiveStream API Service
 * Based on https://rivestream.net/embed/docs#api
 */

const TMDB_API_KEY = '54d82ce065f64ee04381a81d3bcc2455';

// Generate embed URL for a TMDb ID
export const getEmbedUrl = (tmdbId: string, type: 'movie' | 'tv', season?: number, episode?: number) => {
  if (type === 'tv' && season !== undefined && episode !== undefined) {
    return `https://rivestream.net/embed?type=tv&id=${tmdbId}&season=${season}&episode=${episode}`;
  }
  return `https://rivestream.net/embed?type=movie&id=${tmdbId}`;
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
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"
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
  
  if (type === 'tv' && options.season !== undefined && options.episode !== undefined) {
    return `https://rivestream.net/embed?type=tv&id=${id}&season=${options.season}&episode=${options.episode}`;
  }
  
  return `https://rivestream.net/embed?type=movie&id=${id}`;
};
