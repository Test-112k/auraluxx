
import { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Wifi, Download, Upload, Gauge, AlertCircle, CheckCircle, ServerCrash } from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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

  // Real ping test using multiple reliable endpoints
  const measurePing = async (): Promise<number> => {
    const pings: number[] = [];
    const testEndpoints = [
      'https://www.google.com/favicon.ico',
      'https://httpbin.org/get',
      'https://jsonplaceholder.typicode.com/posts/1',
      'https://api.github.com',
      'https://www.cloudflare.com/favicon.ico'
    ];

    for (let i = 0; i < 5; i++) {
      try {
        const endpoint = testEndpoints[i % testEndpoints.length];
        const startTime = performance.now();
        
        await fetch(endpoint + '?cache=' + Math.random(), {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache'
        });
        
        const endTime = performance.now();
        const pingTime = endTime - startTime;
        pings.push(pingTime);
        
        console.log(`Ping ${i + 1}: ${pingTime.toFixed(2)}ms`);
      } catch (error) {
        console.log(`Ping ${i + 1} failed:`, error);
        // Add a penalty for failed pings
        pings.push(1000);
      }
    }

    // Remove outliers and calculate average
    pings.sort((a, b) => a - b);
    const validPings = pings.slice(1, -1); // Remove highest and lowest
    const averagePing = validPings.reduce((a, b) => a + b, 0) / validPings.length;
    
    return Math.round(averagePing);
  };

  // Real download speed test using actual file downloads
  const measureDownloadSpeed = async (onProgress: (speed: number) => void): Promise<number> => {
    const testFiles = [
      // GitHub releases for reliable large files
      'https://github.com/microsoft/vscode/releases/download/1.74.0/VSCode-win32-x64-1.74.0.zip',
      // Cloudflare speed test endpoint
      'https://speed.cloudflare.com/__down?bytes=25000000', // 25MB
      // Alternative test files
      'https://ash-speed.hetzner.com/100MB.bin',
      'https://proof.ovh.net/files/100Mb.dat'
    ];

    let bestSpeed = 0;
    let successfulTests = 0;

    for (const testUrl of testFiles) {
      try {
        console.log(`Testing download from: ${testUrl}`);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const startTime = performance.now();
        let totalBytes = 0;
        
        const response = await fetch(testUrl, {
          signal: controller.signal,
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        clearTimeout(timeout);

        if (!response.ok) {
          console.log(`Download test failed: ${response.status}`);
          continue;
        }

        if (!response.body) {
          console.log('No response body available');
          continue;
        }

        const reader = response.body.getReader();
        let lastProgressTime = startTime;

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            totalBytes += value.length;
            const currentTime = performance.now();
            
            // Update progress every 200ms
            if (currentTime - lastProgressTime > 200) {
              const elapsed = (currentTime - startTime) / 1000;
              if (elapsed > 0) {
                const currentSpeed = (totalBytes * 8) / elapsed / 1000000; // Mbps
                onProgress(currentSpeed);
                bestSpeed = Math.max(bestSpeed, currentSpeed);
              }
              lastProgressTime = currentTime;
            }

            // Stop test after 10 seconds or 50MB
            if (currentTime - startTime > 10000 || totalBytes > 50 * 1024 * 1024) {
              break;
            }
          }
        } finally {
          reader.releaseLock();
        }

        const totalTime = (performance.now() - startTime) / 1000;
        if (totalTime > 0 && totalBytes > 0) {
          const speed = (totalBytes * 8) / totalTime / 1000000;
          bestSpeed = Math.max(bestSpeed, speed);
          successfulTests++;
          console.log(`Download speed from ${testUrl}: ${speed.toFixed(2)} Mbps`);
        }

        // If we got a good speed, we can break early
        if (bestSpeed > 10) break;

      } catch (error) {
        console.log(`Download test error for ${testUrl}:`, error);
        continue;
      }
    }

    if (successfulTests === 0) {
      throw new Error('All download tests failed');
    }

    return Math.round(bestSpeed);
  };

  // Real upload speed test using actual file uploads
  const measureUploadSpeed = async (onProgress: (speed: number) => void): Promise<number> => {
    const testEndpoints = [
      'https://httpbin.org/post',
      'https://postman-echo.com/post',
      'https://jsonplaceholder.typicode.com/posts'
    ];

    const testSizes = [
      1 * 1024 * 1024,   // 1MB
      2 * 1024 * 1024,   // 2MB
      5 * 1024 * 1024    // 5MB
    ];

    let bestSpeed = 0;
    let successfulTests = 0;

    for (const size of testSizes) {
      for (const endpoint of testEndpoints) {
        try {
          console.log(`Testing upload to: ${endpoint} with ${(size / 1024 / 1024).toFixed(1)}MB`);
          
          // Create test data
          const testData = new Uint8Array(size);
          for (let i = 0; i < size; i++) {
            testData[i] = Math.floor(Math.random() * 256);
          }

          const startTime = performance.now();
          
          // Simulate progress updates
          const progressInterval = setInterval(() => {
            const elapsed = (performance.now() - startTime) / 1000;
            if (elapsed > 0) {
              const estimatedSpeed = (size * 8) / elapsed / 1000000;
              onProgress(estimatedSpeed);
            }
          }, 300);

          const response = await fetch(endpoint, {
            method: 'POST',
            body: testData,
            headers: {
              'Content-Type': 'application/octet-stream',
              'Cache-Control': 'no-cache'
            }
          });

          clearInterval(progressInterval);

          if (!response.ok) {
            console.log(`Upload test failed: ${response.status}`);
            continue;
          }

          const totalTime = (performance.now() - startTime) / 1000;
          if (totalTime > 0) {
            const speed = (size * 8) / totalTime / 1000000;
            bestSpeed = Math.max(bestSpeed, speed);
            successfulTests++;
            console.log(`Upload speed to ${endpoint}: ${speed.toFixed(2)} Mbps`);
          }

          // If we got a good speed, we can break
          if (bestSpeed > 5) break;

        } catch (error) {
          console.log(`Upload test error for ${endpoint}:`, error);
          continue;
        }
      }
      
      // If we got a reasonable speed, no need to test larger files
      if (bestSpeed > 5) break;
    }

    if (successfulTests === 0) {
      throw new Error('All upload tests failed');
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
      toast({
        title: "Speed Test Started",
        description: "Running comprehensive internet speed test...",
      });

      // 1. Ping test
      console.log('Starting ping test...');
      setCurrentTest('ping');
      setProgress(10);
      const pingResult = await measurePing();
      console.log(`Ping result: ${pingResult}ms`);
      setProgress(30);

      // 2. Download test with real-time updates
      console.log('Starting download test...');
      setCurrentTest('download');
      const downloadResult = await measureDownloadSpeed((speed) => {
        setRealTimeSpeed(speed);
        console.log(`Real-time download speed: ${speed.toFixed(2)} Mbps`);
      });
      console.log(`Download result: ${downloadResult} Mbps`);
      setProgress(70);

      // 3. Upload test with real-time updates  
      console.log('Starting upload test...');
      setCurrentTest('upload');
      const uploadResult = await measureUploadSpeed((speed) => {
        setRealTimeSpeed(speed);
        console.log(`Real-time upload speed: ${speed.toFixed(2)} Mbps`);
      });
      console.log(`Upload result: ${uploadResult} Mbps`);

      setProgress(100);
      setResults({
        download: downloadResult,
        upload: uploadResult,
        ping: pingResult,
      });

      toast({
        title: "Speed Test Complete",
        description: `Download: ${downloadResult} Mbps, Upload: ${uploadResult} Mbps, Ping: ${pingResult}ms`,
      });

    } catch (err) {
      console.error("Speedtest failed", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setTestError(`Speed test failed: ${errorMessage}. Please check your internet connection and try again.`);
      setResults(null);
      setProgress(100);
      
      toast({
        title: "Speed Test Failed",
        description: errorMessage,
        variant: "destructive"
      });
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
              Test your internet connection speed with real-world measurements
            </p>
          </div>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-white flex items-center justify-center gap-2">
                <Wifi className="h-6 w-6" />
                Real Speed Test Results
              </CardTitle>
              <CardDescription className="text-white/70">
                Accurate measurements using real file transfers and network requests
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
                      Start Real Speed Test
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
                  <li>• Download speed: Measured using real file downloads from multiple servers</li>
                  <li>• Upload speed: Measured using actual data uploads to test endpoints</li>
                  <li>• Ping: Average response time from multiple reliable endpoints</li>
                  <li>• All tests use real network requests for accurate measurements</li>
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
