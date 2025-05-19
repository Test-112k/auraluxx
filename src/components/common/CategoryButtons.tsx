
import { Link } from 'react-router-dom';
import { Film, Tv, Video, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CategoryButtons = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4 my-8">
      <Button asChild variant="outline" className="bg-white/5 hover:bg-white/10 hover:scale-105 transition-all duration-300 border-white/10 text-white">
        <Link to="/movies" className="flex items-center gap-2">
          <Film size={18} />
          Movies
        </Link>
      </Button>
      <Button asChild variant="outline" className="bg-white/5 hover:bg-white/10 hover:scale-105 transition-all duration-300 border-white/10 text-white">
        <Link to="/tv-series" className="flex items-center gap-2">
          <Tv size={18} />
          TV Series
        </Link>
      </Button>
      <Button asChild variant="outline" className="bg-white/5 hover:bg-white/10 hover:scale-105 transition-all duration-300 border-white/10 text-white">
        <Link to="/anime" className="flex items-center gap-2">
          <Video size={18} />
          Anime
        </Link>
      </Button>
      <Button asChild variant="outline" className="bg-white/5 hover:bg-white/10 hover:scale-105 transition-all duration-300 border-white/10 text-white">
        <Link to="/regional" className="flex items-center gap-2">
          <Globe size={18} />
          Regional
        </Link>
      </Button>
    </div>
  );
};

export default CategoryButtons;
