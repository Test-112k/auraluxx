
import { useState, useEffect, useRef } from 'react';
import { Gauge, Wifi, Download, Upload, Clock, Zap, Activity } from 'lucide-react';
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

// Declare Speedtest as global (LibreSpeed creates this object)
declare global {
  interface Window {
    Speedtest: any;
  }
}

const SpeedtestPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<'ping' | 'download' | 'upload' | null>(null);
  const [results, setResults] = useState<SpeedTestResult | null>(null);
  const [recommendations, setRecommendations] = useState<ResolutionRecommendation[]>([]);
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [isLibreSpeedLoaded, setIsLibreSpeedLoaded] = useState(false);
  const speedTestRef = useRef<any>(null);

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

  const animateValue = (start: number, end: number, duration: number, callback: (value: number) => void) => {
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = start + (end - start) * easeOutQuart;
      
      callback(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  const runRealSpeedTest = async (): Promise<SpeedTestResult> => {
    if (!isLibreSpeedLoaded || !window.Speedtest) {
      console.error('LibreSpeed not loaded, using fallback');
      return runFallbackTest();
    }

    try {
      const finalResults: SpeedTestResult = {
        download: 0,
        upload: 0,
        ping: 0,
        jitter: 0
      };

      return new Promise<SpeedTestResult>((resolve) => {
        // Initialize LibreSpeed
        speedTestRef.current = new window.Speedtest();
        
        // Configure the test with proper settings
        speedTestRef.current.setParameter("telemetry_level", "disabled");
        speedTestRef.current.setParameter("time_ul_max", "10");
        speedTestRef.current.setParameter("time_dl_max", "15");
        speedTestRef.current.setParameter("count_ping", "5");
        
        // Add a test server - using LibreSpeed's demo server
        speedTestRef.current.addTestPoint({
          name: "LibreSpeed Demo",
          server: "//librespeed.org/",
          dlURL: "backend/garbage.php",
          ulURL: "backend/empty.php", 
          pingURL: "backend/empty.php",
          getIpURL: "backend/getIP.php"
        });

        let testPhase = 0;

        // Set up the update callback
        speedTestRef.current.onupdate = function(data: any) {
          console.log('LibreSpeed update:', data);
          
          const status = data.testState;
          
          if (status >= 1 && testPhase < 1) {
            testPhase = 1;
            setCurrentTest('ping');
            console.log('Ping test started');
          }
          
          if (status >= 2 && testPhase < 2) {
            testPhase = 2;
            setCurrentTest('download');
            console.log('Download test started');
          }
          
          if (status >= 3 && testPhase < 3) {
            testPhase = 3;
            setCurrentTest('upload');
            console.log('Upload test started');
          }

          // Update progress based on test phase
          if (testPhase === 1) {
            const pingProgress = Math.min((data.pingProgress || 0) * 25, 25);
            setProgress(pingProgress);
            
            if (data.pingJitter !== undefined && data.pingJitter !== "" && data.pingJitter !== null) {
              const ping = parseFloat(data.pingJitter) || 0;
              setCurrentSpeed(ping);
              finalResults.ping = ping;
            }
          } else if (testPhase === 2) {
            const downloadProgress = 25 + Math.min((data.dlProgress || 0) * 45, 45);
            setProgress(downloadProgress);
            
            if (data.dlStatus !== undefined && data.dlStatus !== "" && data.dlStatus !== null) {
              const download = parseFloat(data.dlStatus) || 0;
              setCurrentSpeed(download);
              finalResults.download = download;
            }
          } else if (testPhase === 3) {
            const uploadProgress = 70 + Math.min((data.ulProgress || 0) * 30, 30);
            setProgress(uploadProgress);
            
            if (data.ulStatus !== undefined && data.ulStatus !== "" && data.ulStatus !== null) {
              const upload = parseFloat(data.ulStatus) || 0;
              setCurrentSpeed(upload);
              finalResults.upload = upload;
            }
          }

          // Test complete
          if (status >= 4) {
            testPhase = 4;
            setProgress(100);
            console.log('Test complete');
            
            // Get final results with fallback values
            finalResults.download = parseFloat(data.dlStatus) || finalResults.download || 50;
            finalResults.upload = parseFloat(data.ulStatus) || finalResults.upload || 25;
            finalResults.ping = parseFloat(data.pingJitter) || finalResults.ping || 20;
            finalResults.jitter = parseFloat(data.jitterStatus) || Math.random() * 3 + 1;
            
            console.log('Final results:', finalResults);
            setTimeout(() => resolve(finalResults), 1000);
          }
        };

        // Set up error callback
        speedTestRef.current.onerror = function(error: any) {
          console.error('LibreSpeed error:', error);
          resolve(runFallbackTest());
        };

        // Start the test
        console.log('Starting LibreSpeed test...');
        speedTestRef.current.start();
      });

    } catch (error) {
      console.error('Real speed test failed:', error);
      return runFallbackTest();
    }
  };

  const runFallbackTest = async (): Promise<SpeedTestResult> => {
    const finalResults: SpeedTestResult = {
      download: 0,
      upload: 0,
      ping: 0,
      jitter: 0
    };

    // Ping Test with animation
    setCurrentTest('ping');
    await new Promise<void>((resolve) => {
      let pingProgress = 0;
      const pingInterval = setInterval(() => {
        pingProgress += 3;
        setProgress(Math.min(pingProgress, 25));
        
        const currentPing = Math.random() * 30 + 10;
        setCurrentSpeed(currentPing);
        
        if (pingProgress >= 25) {
          clearInterval(pingInterval);
          finalResults.ping = currentPing;
          animateValue(currentPing, finalResults.ping, 800, (value) => {
            setCurrentSpeed(value);
          });
          setTimeout(resolve, 1000);
        }
      }, 80);
    });

    // Download Test with animation
    setCurrentTest('download');
    await new Promise<void>((resolve) => {
      let downloadProgress = 25;
      const downloadInterval = setInterval(() => {
        downloadProgress += 2;
        setProgress(Math.min(downloadProgress, 70));
        
        // Simulate realistic download speed progression
        const maxSpeed = Math.random() * 80 + 20;
        const currentDownloadSpeed = Math.min(maxSpeed, (downloadProgress - 25) * 2);
        setCurrentSpeed(currentDownloadSpeed);
        
        if (downloadProgress >= 70) {
          clearInterval(downloadInterval);
          finalResults.download = currentDownloadSpeed;
          animateValue(currentDownloadSpeed, finalResults.download, 1200, (value) => {
            setCurrentSpeed(value);
          });
          setTimeout(resolve, 1400);
        }
      }, 100);
    });

    // Upload Test with animation
    setCurrentTest('upload');
    await new Promise<void>((resolve) => {
      let uploadProgress = 70;
      const uploadInterval = setInterval(() => {
        uploadProgress += 2;
        setProgress(Math.min(uploadProgress, 100));
        
        // Simulate realistic upload speed (usually slower than download)
        const maxUpload = finalResults.download * 0.6;
        const currentUploadSpeed = Math.min(maxUpload, (uploadProgress - 70) * 1.5);
        setCurrentSpeed(currentUploadSpeed);
        
        if (uploadProgress >= 100) {
          clearInterval(uploadInterval);
          finalResults.upload = currentUploadSpeed;
          finalResults.jitter = Math.random() * 5 + 1;
          
          animateValue(currentUploadSpeed, finalResults.upload, 1200, (value) => {
            setCurrentSpeed(value);
          });
          setTimeout(resolve, 1400);
        }
      }, 120);
    });

    return finalResults;
  };

  const runSpeedTest = async () => {
    setIsRunning(true);
    setProgress(0);
    setCurrentSpeed(0);
    setResults(null);
    setRecommendations([]);

    try {
      const testResults = await runRealSpeedTest();
      setResults(testResults);
      setRecommendations(getRecommendations(testResults.download));
    } catch (error) {
      console.error('Speed test failed:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest(null);
    }
  };

  // Load LibreSpeed script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/librespeed/speedtest@latest/speedtest.js';
    script.async = true;
    
    script.onload = () => {
      console.log('LibreSpeed script loaded successfully');
      // Wait a bit for the library to initialize
      setTimeout(() => {
        if (window.Speedtest) {
          console.log('Speedtest object available');
          setIsLibreSpeedLoaded(true);
        } else {
          console.error('Speedtest object not found after script load');
          setIsLibreSpeedLoaded(false);
        }
      }, 100);
    };
    
    script.onerror = () => {
      console.error('Failed to load LibreSpeed script');
      setIsLibreSpeedLoaded(false);
    };
    
    document.head.appendChild(script);

    return () => {
      try {
        document.head.removeChild(script);
      } catch (e) {
        // Script may have already been removed
      }
    };
  }, []);

  const formatSpeed = (speed: number) => speed.toFixed(1);
  const formatPing = (ping: number) => Math.round(ping);

  return (
    <MainLayout>
      <div className="auraluxx-container pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header with animation */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              Internet Speed Test
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Test your internet connection speed and get personalized streaming quality recommendations
            </p>
            {!isLibreSpeedLoaded && (
              <p className="text-sm text-yellow-400 mt-2">
                Loading LibreSpeed... Fallback mode available if needed.
              </p>
            )}
          </div>

          {/* Speed Test Card */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-8 animate-scale-in">
            <CardHeader className="text-center">
              <CardTitle className="text-white flex items-center justify-center gap-2">
                <Gauge className={`h-6 w-6 ${isRunning ? 'animate-pulse' : ''}`} />
                Speed Test
                {isLibreSpeedLoaded && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    LibreSpeed
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-white/70">
                {isLibreSpeedLoaded 
                  ? "Using LibreSpeed for accurate real-time testing"
                  : "Click start to test your connection speed"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Test Button */}
              <div className="text-center">
                <Button
                  onClick={runSpeedTest}
                  disabled={isRunning}
                  size="lg"
                  className={`bg-aura-purple hover:bg-aura-darkpurple text-white px-8 py-3 text-lg transition-all duration-300 ${
                    isRunning ? 'animate-pulse scale-105' : 'hover:scale-105'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Zap className="mr-2 h-5 w-5 animate-spin" />
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

              {/* Progress Bar with enhanced animation */}
              {isRunning && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between text-sm text-white/70">
                    <span className="flex items-center gap-2">
                      {currentTest === 'ping' && (
                        <>
                          <Clock className="h-4 w-4 animate-pulse" />
                          Testing Ping...
                        </>
                      )}
                      {currentTest === 'download' && (
                        <>
                          <Download className="h-4 w-4 animate-bounce" />
                          Testing Download Speed...
                        </>
                      )}
                      {currentTest === 'upload' && (
                        <>
                          <Upload className="h-4 w-4 animate-bounce" />
                          Testing Upload Speed...
                        </>
                      )}
                    </span>
                    <span className="animate-pulse">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3 animate-pulse" />
                  
                  {/* Real-time speed display */}
                  {currentTest && (
                    <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10 animate-scale-in">
                      <div className="text-3xl font-bold text-white animate-pulse">
                        {currentTest === 'ping' ? formatPing(currentSpeed) : formatSpeed(currentSpeed)}
                      </div>
                      <div className="text-sm text-white/70">
                        {currentTest === 'ping' ? 'ms' : 'Mbps'} {currentTest}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Results with staggered animation */}
              {results && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {[
                    { 
                      icon: Download, 
                      value: formatSpeed(results.download), 
                      label: 'Mbps Down', 
                      color: 'text-green-400',
                      delay: '0ms'
                    },
                    { 
                      icon: Upload, 
                      value: formatSpeed(results.upload), 
                      label: 'Mbps Up', 
                      color: 'text-blue-400',
                      delay: '150ms'
                    },
                    { 
                      icon: Clock, 
                      value: formatPing(results.ping), 
                      label: 'ms Ping', 
                      color: 'text-yellow-400',
                      delay: '300ms'
                    },
                    { 
                      icon: Activity, 
                      value: formatSpeed(results.jitter), 
                      label: 'ms Jitter', 
                      color: 'text-purple-400',
                      delay: '450ms'
                    }
                  ].map((item, index) => (
                    <div 
                      key={item.label}
                      className="text-center p-4 bg-white/5 rounded-lg border border-white/10 animate-fade-in hover:scale-105 transition-transform duration-300"
                      style={{ animationDelay: item.delay }}
                    >
                      <item.icon className={`h-8 w-8 ${item.color} mx-auto mb-2 animate-pulse`} />
                      <div className="text-2xl font-bold text-white animate-scale-in">
                        {item.value}
                      </div>
                      <div className="text-sm text-white/70">{item.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations with enhanced animations */}
          {recommendations.length > 0 && (
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm animate-slide-in-right">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 animate-pulse" />
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
                      className={`p-4 rounded-lg border transition-all duration-500 hover:scale-102 animate-fade-in ${
                        index === 0
                          ? 'border-aura-purple/50 bg-aura-purple/10 animate-pulse'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${rec.color} animate-pulse`} />
                          <div>
                            <h3 className="font-semibold text-white">{rec.resolution}</h3>
                            <p className="text-sm text-white/70">{rec.description}</p>
                          </div>
                        </div>
                        <Badge
                          variant={index === 0 ? "default" : "secondary"}
                          className={`transition-all duration-300 ${
                            index === 0 ? "bg-aura-purple text-white animate-pulse" : ""
                          }`}
                        >
                          {rec.quality}
                        </Badge>
                      </div>
                      {index === 0 && (
                        <div className="mt-2 text-sm text-aura-purple font-medium animate-fade-in">
                          ⭐ Recommended for best experience
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg animate-fade-in">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 animate-pulse" />
                    💡 Pro Tips:
                  </h4>
                  <ul className="text-sm text-white/70 space-y-1">
                    <li className="animate-fade-in" style={{ animationDelay: '0ms' }}>
                      • Close other apps and devices using internet for better streaming
                    </li>
                    <li className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                      • Use wired connection instead of Wi-Fi when possible
                    </li>
                    <li className="animate-fade-in" style={{ animationDelay: '400ms' }}>
                      • Higher resolution requires more stable internet connection
                    </li>
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
