
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface SpeedTestResults {
  dl: string;
  ul: string;
  ping: string;
  jitter: string;
  log: string;
}

const getResolutionRecommendation = (speed: number): string => {
  if (speed >= 25) {
    return 'Your connection is great for 4K Ultra HD streaming.';
  }
  if (speed >= 10) {
    return 'Your connection is good for Full HD (1080p) streaming.';
  }
  if (speed >= 5) {
    return 'Your connection is suitable for HD (720p) streaming.';
  }
  if (speed >= 3) {
    return 'Your connection should handle Standard Definition (480p) streaming.';
  }
  return 'Your connection might struggle with video streaming. Lower quality might be necessary.';
};

const SpeedtestPage = () => {
  const [results, setResults] = useState<SpeedTestResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Always verify the origin of the message
      if (event.origin !== 'https://librespeed.org') {
        return;
      }
      
      try {
        const data = JSON.parse(event.data);
        // Check if the data looks like a speed test result
        if (data && typeof data.dl !== 'undefined') {
          setResults(data);
        }
      } catch (error) {
        // Silently ignore parsing errors, as other messages might be sent from browser extensions etc.
      }
    };

    const handleIframeLoad = () => {
      setIsLoading(false);
    };

    const handleIframeError = () => {
      setIsLoading(false);
      setError('Failed to load speed test. Please check your internet connection and try again.');
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const recommendation = results ? getResolutionRecommendation(parseFloat(results.dl)) : '';

  return (
    <MainLayout>
      <div className="auraluxx-container pb-8 flex flex-col flex-grow">
        <div className="text-center my-8 shrink-0">
          <h1 className="text-4xl font-bold text-white mb-4">Internet Speed Test</h1>
          <p className="text-white/70 text-lg">
            Powered by LibreSpeed, an open-source speed test.
          </p>
        </div>

        {results && (
          <div className="glass-card p-6 my-8 text-center animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-white mb-4">Your Results</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
              <div className="p-4 bg-white/10 rounded-lg">
                <p className="text-sm text-white/70">Download</p>
                <p className="text-2xl font-semibold">{results.dl} <span className="text-base">Mbps</span></p>
              </div>
              <div className="p-4 bg-white/10 rounded-lg">
                <p className="text-sm text-white/70">Upload</p>
                <p className="text-2xl font-semibold">{results.ul} <span className="text-base">Mbps</span></p>
              </div>
              <div className="p-4 bg-white/10 rounded-lg">
                <p className="text-sm text-white/70">Ping</p>
                <p className="text-2xl font-semibold">{results.ping} <span className="text-base">ms</span></p>
              </div>
              <div className="p-4 bg-white/10 rounded-lg">
                <p className="text-sm text-white/70">Jitter</p>
                <p className="text-2xl font-semibold">{results.jitter} <span className="text-base">ms</span></p>
              </div>
            </div>
            {recommendation && (
              <p className="mt-6 text-lg text-aura-accent">{recommendation}</p>
            )}
          </div>
        )}
        
        <div className="flex-grow rounded-lg overflow-hidden border border-white/10 shadow-lg min-h-[60vh] relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/5">
              <LoadingSpinner size="lg" text="Loading speed test..." />
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/5">
              <div className="text-center p-8">
                <p className="text-white/70 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-aura-purple hover:bg-aura-purple/80 text-white rounded-lg transition-colors"
                >
                  Reload Page
                </button>
              </div>
            </div>
          )}
          
          <iframe
            src="https://librespeed.org/"
            className="w-full h-full border-0"
            title="LibreSpeed Speed Test"
            allow="geolocation"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setError('Failed to load speed test. Please check your internet connection and try again.');
            }}
          ></iframe>
        </div>
      </div>
    </MainLayout>
  );
};

export default SpeedtestPage;
