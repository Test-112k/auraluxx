
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-aura-dark border-t border-white/5 mt-24">
      <div className="auraluxx-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gradient mb-4">Auraluxx</h2>
            <p className="text-sm text-white/70">
              Your premium streaming destination for movies, TV series, anime and regional content.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-4">Navigation</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <Link to="/" className="text-white/70 hover:text-white transition-colors">Home</Link>
              <Link to="/movies" className="text-white/70 hover:text-white transition-colors">Movies</Link>
              <Link to="/tv-series" className="text-white/70 hover:text-white transition-colors">TV Series</Link>
              <Link to="/anime" className="text-white/70 hover:text-white transition-colors">Anime</Link>
              <Link to="/regional" className="text-white/70 hover:text-white transition-colors">Regional</Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-4">Categories</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <Link to="/movies?filter=trending" className="text-white/70 hover:text-white transition-colors">Trending</Link>
              <Link to="/movies?filter=popular" className="text-white/70 hover:text-white transition-colors">Popular</Link>
              <Link to="/movies?filter=top_rated" className="text-white/70 hover:text-white transition-colors">Top Rated</Link>
              <Link to="/movies?filter=now_playing" className="text-white/70 hover:text-white transition-colors">Now Playing</Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-4">Legal</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <Link to="/terms" className="text-white/70 hover:text-white transition-colors">Terms of Use</Link>
              <Link to="/privacy" className="text-white/70 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/dmca" className="text-white/70 hover:text-white transition-colors">DMCA</Link>
              <Link to="/contact" className="text-white/70 hover:text-white transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-white/60">
            Auraluxx © {new Date().getFullYear()} All Rights Reserved
          </p>
          <p className="text-xs text-white/40 mt-4">
            This site does not store any files on its server. All contents are provided by non-affiliated third parties.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
