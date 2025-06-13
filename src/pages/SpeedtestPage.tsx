
import { useState, useEffect } from 'react';
import { Gauge, Wifi, Download, Upload, Clock, Zap } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface SpeedTestResult {
  download: number;
  upload: number;
  ping: number;
  jitter: number;
}

interface ResolutionRecommendation {
  resolution: string;
  quality: string;
  description: string;
  color: string;
}

const SpeedtestPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<'ping' | 'download' | 'upload' | null>(null);
  const [results, setResults] = useState<SpeedTestResult | null>(null);
  const [recommendations, setRecommendations] = useState<ResolutionRecommendation[]>([]);

  const getRecommendations = (downloadSpeed: number): ResolutionRecommendation[] => {
    const recs: ResolutionRecommendation[] = [];
    
    if (downloadSpeed >= 25) {
      recs.push({
        resolution: '4K Ultra HD',
        quality: 'Excellent',
        description: 'Perfect for 4K streaming with HDR',
        color: 'bg-green-500'
      });
    }
    
    if (downloadSpeed >= 15) {
      recs.push({
        resolution: '1080p Full HD',
        quality: 'Great',
        description: 'Smooth Full HD streaming',
        color: 'bg-blue-500'
      });
    }
    
    if (downloadSpeed >= 8) {
      recs.push({
        resolution: '720p HD',
        quality: 'Good',
        description: 'Reliable HD streaming',
        color: 'bg-yellow-500'
      });
    }
    
    if (downloadSpeed >= 3) {
      recs.push({
        resolution: '480p SD',
        quality: 'Fair',
        description: 'Basic streaming quality',
        color: 'bg-orange-500'
      });
    } else {
      recs.push({
        resolution: '360p',
        quality: 'Poor',
        description: 'Minimal streaming quality',
        color: 'bg-red-500'
      });
    }
    
    return recs;
  };

  const runSpeedTest = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);
    setRecommendations([]);

    try {
      // Simulate speed test phases
      setCurrentTest('ping');
      await simulateTest(0, 20, 1000); // Ping test
      
      setCurrentTest('download');
      await simulateTest(20, 70, 3000); // Download test
      
      setCurrentTest('upload');
      await simulateTest(70, 100, 2000); // Upload test
      
      // Simulate results (in a real implementation, you'd use LibreSpeed API)
      const mockResults: SpeedTestResult = {
        download: Math.random() * 100 + 10, // 10-110 Mbps
        upload: Math.random() * 50 + 5, // 5-55 Mbps
        ping: Math.random() * 50 + 10, // 10-60 ms
        jitter: Math.random() * 10 + 1 // 1-11 ms
      };
      
      setResults(mockResults);
      setRecommendations(getRecommendations(mockResults.download));
      
    } catch (error) {
      console.error('Speed test failed:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest(null);
      setProgress(100);
    }
  };

  const simulateTest = (startProgress: number, endProgress: number, duration: number) => {
    return new Promise<void>((resolve) => {
      const steps = 50;
      const stepDuration = duration / steps;
      const progressIncrement = (endProgress - startProgress) / steps;
      
      let currentProgress = startProgress;
      const interval = setInterval(() => {
        currentProgress += progressIncrement;
        setProgress(Math.min(currentProgress, endProgress));
        
        if (currentProgress >= endProgress) {
          clearInterval(interval);
          resolve();
        }
      }, stepDuration);
    });
  };

  const formatSpeed = (speed: number) => speed.toFixed(1);
  const formatPing = (ping: number) => Math.round(ping);

  return (
    <MainLayout>
      <div className="auraluxx-container pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              Internet Speed Test
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Test your internet connection speed and get personalized streaming quality recommendations
            </p>
          </div>

          {/* Speed Test Card */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-white flex items-center justify-center gap-2">
                <Gauge className="h-6 w-6" />
                Speed Test
              </CardTitle>
              <CardDescription className="text-white/70">
                Click start to test your connection speed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Test Button */}
              <div className="text-center">
                <Button
                  onClick={runSpeedTest}
                  disabled={isRunning}
                  size="lg"
                  className="bg-aura-purple hover:bg-aura-darkpurple text-white px-8 py-3 text-lg"
                >
                  {isRunning ? (
                    <>
                      <Zap className="mr-2 h-5 w-5 animate-pulse" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Wifi className="mr-2 h-5 w-5" />
                      Start Speed Test
                    </>
                  )}
                </Button>
              </div>

              {/* Progress Bar */}
              {isRunning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white/70">
                    <span>
                      {currentTest === 'ping' && 'Testing Ping...'}
                      {currentTest === 'download' && 'Testing Download Speed...'}
                      {currentTest === 'upload' && 'Testing Upload Speed...'}
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Results */}
              {results && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <Download className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">
                      {formatSpeed(results.download)}
                    </div>
                    <div className="text-sm text-white/70">Mbps Down</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <Upload className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">
                      {formatSpeed(results.upload)}
                    </div>
                    <div className="text-sm text-white/70">Mbps Up</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">
                      {formatPing(results.ping)}
                    </div>
                    <div className="text-sm text-white/70">ms Ping</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <Gauge className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">
                      {formatSpeed(results.jitter)}
                    </div>
                    <div className="text-sm text-white/70">ms Jitter</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  Recommended Streaming Quality
                </CardTitle>
                <CardDescription className="text-white/70">
                  Based on your download speed of {results && formatSpeed(results.download)} Mbps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div
                      key={rec.resolution}
                      className={`p-4 rounded-lg border ${
                        index === 0
                          ? 'border-aura-purple/50 bg-aura-purple/10'
                          : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${rec.color}`} />
                          <div>
                            <h3 className="font-semibold text-white">{rec.resolution}</h3>
                            <p className="text-sm text-white/70">{rec.description}</p>
                          </div>
                        </div>
                        <Badge
                          variant={index === 0 ? "default" : "secondary"}
                          className={index === 0 ? "bg-aura-purple text-white" : ""}
                        >
                          {rec.quality}
                        </Badge>
                      </div>
                      {index === 0 && (
                        <div className="mt-2 text-sm text-aura-purple font-medium">
                          ⭐ Recommended for best experience
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">💡 Pro Tips:</h4>
                  <ul className="text-sm text-white/70 space-y-1">
                    <li>• Close other apps and devices using internet for better streaming</li>
                    <li>• Use wired connection instead of Wi-Fi when possible</li>
                    <li>• Higher resolution requires more stable internet connection</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SpeedtestPage;
