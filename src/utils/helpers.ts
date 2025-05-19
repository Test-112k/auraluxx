
/**
 * Utility functions for Auraluxx application
 */

// Format number to display with commas
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Format date to readable format
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Format runtime to hours and minutes
export const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
};

// Truncate text to specific length with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Convert vote average to percentage
export const voteToPercentage = (vote: number): string => {
  return `${Math.round(vote * 10)}%`;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Get year from date string
export const getYearFromDate = (dateString: string | null): string => {
  if (!dateString) return '';
  return new Date(dateString).getFullYear().toString();
};

// Get media type label
export const getMediaTypeLabel = (type: string): string => {
  switch (type) {
    case 'movie':
      return 'Movie';
    case 'tv':
      return 'TV Series';
    case 'person':
      return 'Person';
    default:
      return type;
  }
};

// Debounce function for search
export function debounce<F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

// Create custom slug for URLs
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// Get random items from array
export const getRandomItems = <T>(array: T[], count: number): T[] => {
  if (count >= array.length) return [...array];
  
  const result: T[] = [];
  const used = new Set<number>();
  
  while (result.length < count) {
    const index = Math.floor(Math.random() * array.length);
    if (!used.has(index)) {
      used.add(index);
      result.push(array[index]);
    }
  }
  
  return result;
};
