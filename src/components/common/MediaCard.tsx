
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/services/tmdbApi';
import { getYearFromDate, truncateText } from '@/utils/helpers';

interface MediaCardProps {
  id: number;
  title: string;
  type: 'movie' | 'tv';
  posterPath: string | null;
  releaseDate?: string;
  voteAverage?: number;
  className?: string;
}

const MediaCard = ({
  id,
  title,
  type,
  posterPath,
  releaseDate,
  voteAverage,
  className = '',
}: MediaCardProps) => {
  const year = releaseDate ? getYearFromDate(releaseDate) : '';
  const rating = voteAverage ? Math.round(voteAverage * 10) : null;

  return (
    <Link
      to={`/watch/${type}/${id}`}
      className={`block rounded-lg overflow-hidden card-hover ${className}`}
    >
      <div className="relative aspect-[2/3] bg-aura-darkpurple/20">
        <img
          src={getImageUrl(posterPath, 'w500')}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        
        {rating && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
            {rating}%
          </div>
        )}
      </div>
      
      <div className="p-2">
        <h3 className="font-medium text-white line-clamp-1" title={title}>
          {truncateText(title, 25)}
        </h3>
        {year && (
          <p className="text-sm text-white/70">{year}</p>
        )}
      </div>
    </Link>
  );
};

export default MediaCard;
