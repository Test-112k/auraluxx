
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SimpleSearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full">
      <Input
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies, TV shows..."
        className="w-full py-2 pl-10 pr-4 bg-white/10 text-white border-white/10 rounded-full focus:border-aura-purple focus:ring-aura-purple"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 h-4 w-4" />
      <Button 
        type="submit" 
        variant="ghost" 
        size="icon"
        className="absolute right-1 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-transparent"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default SimpleSearchBar;
