
import { Star, Clock, Calendar } from 'lucide-react';
import { getImageUrl } from '@/services/tmdbApi';
import { formatDate, formatRuntime, truncateText } from '@/utils/helpers';

interface Cast {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
}

interface MediaDetailsProps {
  title: string;
  releaseDate?: string;
  runtime?: number;
  voteAverage?: number;
  genres: Array<{ id: number; name: string }>;
  overview?: string;
  posterPath?: string | null;
  cast: Cast[];
}

const MediaDetails = ({
  title,
  releaseDate,
  runtime,
  voteAverage,
  genres,
  overview,
  posterPath,
  cast
}: MediaDetailsProps) => {
  return (
    <div className="md:flex gap-8 mb-12">
      {/* Poster */}
      <div className="hidden md:block w-1/4 max-w-xs flex-shrink-0">
        <div className="rounded-lg overflow-hidden shadow-lg shadow-black/20">
          <img 
            src={getImageUrl(posterPath || '', 'w500')} 
            alt={title}
            className="w-full h-auto"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
        </div>
      </div>
      
      {/* Details */}
      <div className="w-full md:w-3/4">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
          {title}
        </h1>
        
        <div className="flex flex-wrap items-center text-white/70 gap-x-4 gap-y-2 mb-4">
          {releaseDate && (
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              {formatDate(releaseDate)}
            </div>
          )}
          
          {runtime && (
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              {formatRuntime(runtime)}
            </div>
          )}
          
          {voteAverage && voteAverage > 0 && (
            <div className="flex items-center">
              <Star size={16} className="mr-1 text-yellow-500" />
              {voteAverage.toFixed(1)}/10
            </div>
          )}
        </div>
        
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {genres.map((genre) => (
              <span 
                key={genre.id}
                className="px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}
        
        {overview && (
          <div className="mb-8">
            <h2 className="text-xl font-medium text-white mb-2">Overview</h2>
            <p className="text-white/80 leading-relaxed">{overview}</p>
          </div>
        )}
        
        {/* Cast */}
        {cast.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-medium text-white mb-4">Cast</h2>
            <div className="flex overflow-x-auto scrollbar-none pb-4 gap-4">
              {cast.slice(0, 10).map((person) => (
                <div key={person.id} className="flex-shrink-0 w-24">
                  <div className="rounded-lg overflow-hidden bg-white/5 mb-2 aspect-[2/3]">
                    {person.profile_path ? (
                      <img 
                        src={getImageUrl(person.profile_path, 'w185')} 
                        alt={person.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white/30 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white line-clamp-1" title={person.name}>
                      {truncateText(person.name, 15)}
                    </p>
                    {person.character && (
                      <p className="text-xs text-white/60 line-clamp-1" title={person.character}>
                        {truncateText(person.character, 15)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaDetails;
