
import { Button } from '@/components/ui/button';

interface ApiSelectorProps {
  selectedApi: 'embed' | 'torrent' | 'agg';
  onApiChange: (api: 'embed' | 'torrent' | 'agg') => void;
}

const ApiSelector = ({ selectedApi, onApiChange }: ApiSelectorProps) => {
  const apis = [
    { key: 'embed' as const, label: 'Embed API', description: 'Standard streaming' },
    { key: 'torrent' as const, label: 'Torrent API', description: 'P2P streaming' },
    { key: 'agg' as const, label: 'Aggregator API', description: 'Multiple sources' },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto mb-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        {apis.map((api) => (
          <Button
            key={api.key}
            variant={selectedApi === api.key ? "default" : "outline"}
            size="sm"
            onClick={() => onApiChange(api.key)}
            className={`flex-1 min-h-[60px] sm:min-h-[70px] flex flex-col items-center justify-center transition-all duration-200 ${
              selectedApi === api.key 
                ? 'bg-primary text-primary-foreground shadow-lg' 
                : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="font-medium text-sm sm:text-base">{api.label}</span>
            <span className="text-xs opacity-70 mt-1">{api.description}</span>
          </Button>
        ))}
      </div>
      <p className="text-xs text-white/60 mt-2 text-center">
        Try different APIs if one doesn't work or for better quality
      </p>
    </div>
  );
};

export default ApiSelector;
