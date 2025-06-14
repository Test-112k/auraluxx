
import { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Wifi, Download, Upload, Gauge, AlertCircle, CheckCircle, ServerCrash } from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

const AnimatedSpeedometerGauge = ({ 
  value, 
  maxValue, 
  label, 
  unit, 
  color, 
  isActive = false,
  targetValue = 0 
}: { 
  value: number; 
  maxValue: number; 
  label: string; 
  unit: string; 
  color: string; 
  isActive?: boolean;
  targetValue?: number;
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isActive && targetValue > 0) {
      // Smooth animation to target value
      const startValue = animatedValue;
      const difference = targetValue - startValue;
      const duration = 1000; // 1 second
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (difference * easeOutCubic);
        
        setAnimatedValue(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    } else if (!isActive) {
      setAnimatedValue(value);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, targetValue, value]);

  const displayValue = isActive ? animatedValue : value;
  const data = [{ name: label, value: Math.min(displayValue, maxValue), fill: color }];
  const safeValue = isNaN(displayValue) ? 0 : displayValue;
  const safeMaxValue = isNaN(maxValue) || maxValue === 0 ? 100 : maxValue;

  return (
    <div className={`text-center p-3 bg-white/5 rounded-lg w-full h-[220px] flex flex-col justify-center items-center transition-all duration-300 ${
      isActive ? 'ring-2 ring-aura-purple shadow-lg scale-105' : ''
    }`}>
      <ResponsiveContainer width="100%" height={140}>
        <RadialBarChart
          cx="50%"
          cy="70%"
          innerRadius="60%"
          outerRadius="100%"
          barSize={12}
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, safeMaxValue]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: isActive ? '#4c1d95' : '#333' }}
            dataKey="value"
            angleAxisId={0}
            cornerRadius={6}
            className="transition-all duration-300"
          />
          <text
            x="50%"
            y="65%"
            textAnchor="middle"
            dominantBaseline="middle"
            className={`text-xl font-bold transition-all duration-300 ${isActive ? 'animate-pulse' : ''}`}
            style={{ fill: color }}
          >
            {safeValue.toFixed(0)}
          </text>
          <text
            x="50%"
            y="85%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs"
            style={{ fill: 'rgba(255,255,255,0.7)' }}
          >
            {unit}
          </text>
        </RadialBarChart>
      </ResponsiveContainer>
      <div className={`text-white/80 text-sm mt-1 transition-all duration-300 ${
        isActive ? 'text-aura-purple font-semibold' : ''
      }`}>
        {label}
      </div>
    </div>
  );
};

const SpeedtestPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    download: number;
    upload: number;
    ping: number;
  } | null>(null);
  const [currentTest, setCurrentTest] = useState<'ping' | 'download' | 'upload' | null>(null);
  const [realTimeSpeed, setRealTimeSpeed] = useState<number>(0);
  const [testError, setTestError] = useState<string | null>(null);

  const getSpeedRecommendation = (downloadSpeed: number) => {
    if (downloadSpeed >= 100) {
      return {
        quality: 'Excellent',
        description: 'Perfect for 4K streaming, gaming, and multiple devices',
        color: 'text-green-500',
        icon: <CheckCircle className="h-5 w-5" />
      };
    } else if (downloadSpeed >= 50) {
      return {
        quality: 'Very Good',
        description: 'Great for HD streaming and online gaming',
        color: 'text-green-400',
        icon: <CheckCircle className="h-5 w-5" />
      };
    } else if (downloadSpeed >= 25) {
      return {
        quality: 'Good',
        description: 'Suitable for HD streaming and video calls',
        color: 'text-yellow-500',
        icon: <AlertCircle className="h-5 w-5" />
      };
    } else if (downloadSpeed >= 10) {
      return {
        quality: 'Fair',
        description: 'Basic streaming and browsing',
        color: 'text-orange-500',
        icon: <AlertCircle className="h-5 w-5" />
      };
    } else {
      return {
        quality: 'Poor',
        description: 'May struggle with video streaming',
        color: 'text-red-500',
        icon: <AlertCircle className="h-5 w-5" />
      };
    }
  };

  // Enhanced ping test with multiple measurements
  const measurePing = async (): Promise<number> => {
    const pings: number[] = [];
    const testUrls = [
      'https://cloudflare.com/cdn-cgi/trace',
      'https://www.google.com/favicon.ico',
      'https://httpbin.org/status/200'
    ];

    for (let i = 0; i < 5; i++) {
      try {
        const startTime = performance.now();
        const url = testUrls[i % testUrls.length];
        
        await fetch(url + '?_=' + Math.random(), {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache'
        });
        
        const endTime = performance.now();
        pings.push(endTime - startTime);
      } catch (error) {
        // Fallback ping measurement
        const startTime = performance.now();
        try {
          await fetch('https://1.1.1.1', { method: 'HEAD', mode: 'no-cors' });
        } catch {
          // Even if it fails, we can measure the time it took
        }
        const endTime = performance.now();
        pings.push(endTime - startTime);
      }
    }

    // Return median ping to avoid outliers
    pings.sort((a, b) => a - b);
    return Math.round(pings[Math.floor(pings.length / 2)]);
  };

  // Enhanced download test with larger files and real-time updates
  const measureDownloadSpeed = async (onProgress: (speed: number) => void): Promise<number> => {
    const testSizes = [
      { url: 'https://speed.cloudflare.com/__down?bytes=10485760', size: 10485760 }, // 10MB
      { url: 'https://speed.cloudflare.com/__down?bytes=52428800', size: 52428800 }, // 50MB
    ];

    let bestSpeed = 0;

    for (const test of testSizes) {
      try {
        const controller = new AbortController();
        const startTime = performance.now();
        let received = 0;
        
        const response = await fetch(test.url, {
          signal: controller.signal,
          cache: 'no-cache'
        });

        if (!response.body) continue;

        const reader = response.body.getReader();
        const maxTestTime = 6000; // 6 seconds max per test

        // Real-time speed calculation
        const speedUpdateInterval = setInterval(() => {
          const elapsed = (performance.now() - startTime) / 1000;
          if (elapsed > 0 && received > 0) {
            const currentSpeed = (received * 8) / elapsed / 1000000; // Mbps
            onProgress(currentSpeed);
            bestSpeed = Math.max(bestSpeed, currentSpeed);
          }
        }, 200);

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            received += value.length;
            const elapsed = performance.now() - startTime;

            if (elapsed > maxTestTime) {
              controller.abort();
              break;
            }
          }
        } finally {
          clearInterval(speedUpdateInterval);
          reader.releaseLock();
        }

        const totalTime = (performance.now() - startTime) / 1000;
        if (totalTime > 0) {
          const speed = (received * 8) / totalTime / 1000000;
          bestSpeed = Math.max(bestSpeed, speed);
        }

      } catch (error) {
        console.log('Download test error:', error);
        // Continue with next test size
      }
    }

    return Math.round(bestSpeed);
  };

  // Enhanced upload test with larger payloads
  const measureUploadSpeed = async (onProgress: (speed: number) => void): Promise<number> => {
    const testSizes = [
      2 * 1024 * 1024,  // 2MB
      5 * 1024 * 1024,  // 5MB
    ];

    let bestSpeed = 0;

    for (const size of testSizes) {
      try {
        const data = new Uint8Array(size).fill(1);
        const startTime = performance.now();

        // Simulate progress updates during upload
        const progressInterval = setInterval(() => {
          const elapsed = (performance.now() - startTime) / 1000;
          if (elapsed > 0) {
            const estimatedSpeed = (size * 8) / elapsed / 1000000;
            onProgress(estimatedSpeed);
          }
        }, 200);

        await fetch('https://httpbin.org/post', {
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'application/octet-stream'
          }
        });

        clearInterval(progressInterval);

        const totalTime = (performance.now() - startTime) / 1000;
        if (totalTime > 0) {
          const speed = (size * 8) / totalTime / 1000000;
          bestSpeed = Math.max(bestSpeed, speed);
        }

      } catch (error) {
        console.log('Upload test error:', error);
        // Try alternative upload endpoint
        try {
          const data = new Uint8Array(size / 2).fill(1); // Smaller fallback
          const startTime = performance.now();
          
          await fetch('https://speed.cloudflare.com/__up', {
            method: 'POST',
            body: data
          });

          const totalTime = (performance.now() - startTime) / 1000;
          if (totalTime > 0) {
            const speed = (data.length * 8) / totalTime / 1000000;
            bestSpeed = Math.max(bestSpeed, speed);
          }
        } catch (fallbackError) {
          console.log('Upload fallback error:', fallbackError);
        }
      }
    }

    return Math.round(bestSpeed);
  };

  const runSpeedTest = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);
    setRealTimeSpeed(0);
    setTestError(null);

    try {
      // 1. Ping test
      setCurrentTest('ping');
      const pingResult = await measurePing();
      setProgress(25);

      // 2. Download test with real-time updates
      setCurrentTest('download');
      const downloadResult = await measureDownloadSpeed((speed) => {
        setRealTimeSpeed(speed);
      });
      setProgress(75);

      // 3. Upload test with real-time updates
      setCurrentTest('upload');
      const uploadResult = await measureUploadSpeed((speed) => {
        setRealTimeSpeed(speed);
      });

      setProgress(100);
      setResults({
        download: downloadResult,
        upload: uploadResult,
        ping: pingResult,
      });

    } catch (err) {
      console.error("Speedtest failed", err);
      setTestError("The speed test encountered an error. Please check your connection and try again.");
      setResults(null);
      setProgress(100);
    }

    setCurrentTest(null);
    setRealTimeSpeed(0);
    setIsRunning(false);
  };

  return (
    <MainLayout>
      <div className="auraluxx-container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Internet Speed Test</h1>
            <p className="text-white/70 text-lg">
              Test your internet connection speed with professional-grade measurements
            </p>
          </div>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-white flex items-center justify-center gap-2">
                <Wifi className="h-6 w-6" />
                Speed Test Results
              </CardTitle>
              <CardDescription className="text-white/70">
                Click the button below to start testing your connection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Test Button */}
              <div className="text-center">
                <Button
                  onClick={runSpeedTest}
                  disabled={isRunning}
                  className="bg-aura-purple hover:bg-aura-darkpurple text-white px-8 py-3 text-lg"
                >
                  {isRunning ? (
                    <>
                      <Gauge className="h-5 w-5 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Gauge className="h-5 w-5 mr-2" />
                      Start Speed Test
                    </>
                  )}
                </Button>
              </div>

              {/* Real-time Progress */}
              {isRunning && (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-white/70">
                    <span className="capitalize">
                      Testing {currentTest}...
                      {(currentTest === 'download' || currentTest === 'upload') && realTimeSpeed > 0 ? 
                        ` (${realTimeSpeed.toFixed(1)} Mbps)` : ''
                      }
                    </span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  
                  {/* Real-time speed indicator */}
                  {(currentTest === 'download' || currentTest === 'upload') && realTimeSpeed > 0 && (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-aura-purple animate-pulse">
                        {realTimeSpeed.toFixed(1)} Mbps
                      </div>
                      <div className="text-white/60 text-sm">Current {currentTest} speed</div>
                    </div>
                  )}
                </div>
              )}

              {/* Animated Speedometer Gauges */}
              <div className="grid md:grid-cols-3 gap-4">
                <AnimatedSpeedometerGauge
                  value={results?.download || 0}
                  maxValue={200}
                  label="Download"
                  unit="Mbps"
                  color="#3b82f6"
                  isActive={currentTest === 'download'}
                  targetValue={currentTest === 'download' ? realTimeSpeed : (results?.download || 0)}
                />
                <AnimatedSpeedometerGauge
                  value={results?.upload || 0}
                  maxValue={100}
                  label="Upload"
                  unit="Mbps"
                  color="#22c55e"
                  isActive={currentTest === 'upload'}
                  targetValue={currentTest === 'upload' ? realTimeSpeed : (results?.upload || 0)}
                />
                <AnimatedSpeedometerGauge
                  value={results?.ping || 0}
                  maxValue={100}
                  label="Ping"
                  unit="ms"
                  color="#a855f7"
                  isActive={currentTest === 'ping'}
                  targetValue={results?.ping || 0}
                />
              </div>

              {/* Error Message Display */}
              {testError && !isRunning && (
                <div className="p-4 bg-red-500/10 border-l-4 border-red-500 text-red-400 rounded-lg flex items-center gap-3">
                  <ServerCrash className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold">Test Failed</h3>
                    <p className="text-sm">{testError}</p>
                  </div>
                </div>
              )}

              {/* Speed Recommendation */}
              {results && !isRunning && !testError && (
                <div className="space-y-6">
                  {(() => {
                    const recommendation = getSpeedRecommendation(results.download);
                    return (
                      <div className="p-4 bg-white/5 rounded-lg border-l-4 border-aura-purple">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={recommendation.color}>
                            {recommendation.icon}
                          </div>
                          <h3 className={`font-semibold ${recommendation.color}`}>
                            {recommendation.quality} Connection
                          </h3>
                        </div>
                        <p className="text-white/80">{recommendation.description}</p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Information */}
              <div className="mt-8 p-4 bg-white/5 rounded-lg">
                <h3 className="text-white font-semibold mb-2">About the Test</h3>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Download speed: Measured using large file downloads with real-time monitoring</li>
                  <li>• Upload speed: Measured using data uploads to test servers</li>
                  <li>• Ping: Average response time from multiple test endpoints</li>
                  <li>• Tests use professional-grade measurement techniques for accuracy</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default SpeedtestPage;
