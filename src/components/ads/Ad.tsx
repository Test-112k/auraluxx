
import { useEffect, useRef } from 'react';

export type AdSize = 
  | '300x250'
  | '728x90'
  | '160x600'
  | '160x300'
  | '468x60'
  | '320x50'
  | 'social-bar'
  | 'native'
  | '728x90-new'
  | '160x600-new'
  | 'social-bar-new'
  | 'native-new';

interface AdProps {
  size: AdSize;
  className?: string;
}

const Ad = ({ size, className = '' }: AdProps) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!adContainerRef.current) return;
    
    // Clear any existing content
    adContainerRef.current.innerHTML = '';
    
    // Create and inject the appropriate ad code based on size
    const getAdCode = () => {
      switch(size) {
        case '300x250':
          return `
            <script type="text/javascript">
              atOptions = {
                'key' : '53e89f98c38565563710d681807156a9',
                'format' : 'iframe',
                'height' : 250,
                'width' : 300,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="//bluetackclasp.com/53e89f98c38565563710d681807156a9/invoke.js"></script>
          `;
        case '728x90':
          return `
            <script type="text/javascript">
              atOptions = {
                'key' : 'df6b2b6f28880a51e25db732f7816d06',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="//bluetackclasp.com/df6b2b6f28880a51e25db732f7816d06/invoke.js"></script>
          `;
        case '728x90-new':
          return `
            <script type="text/javascript">
              atOptions = {
                'key' : '9d5ea7156e620d00943d4c5b282de9cf',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="//esteemcountryside.com/9d5ea7156e620d00943d4c5b282de9cf/invoke.js"></script>
          `;
        case '160x600':
          return `
            <script type="text/javascript">
              atOptions = {
                'key' : 'b98c5b7929b95d5f7d290198fcf7ddaa',
                'format' : 'iframe',
                'height' : 600,
                'width' : 160,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="//bluetackclasp.com/b98c5b7929b95d5f7d290198fcf7ddaa/invoke.js"></script>
          `;
        case '160x600-new':
          return `
            <script type="text/javascript">
              atOptions = {
                'key' : '8b22b67d3d07ac77c8e6d2433c7ea72d',
                'format' : 'iframe',
                'height' : 600,
                'width' : 160,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="//esteemcountryside.com/8b22b67d3d07ac77c8e6d2433c7ea72d/invoke.js"></script>
          `;
        case '160x300':
          return `
            <script type="text/javascript">
              atOptions = {
                'key' : '3fcc1b108f3c16049e14cdf752fe0d7f',
                'format' : 'iframe',
                'height' : 300,
                'width' : 160,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="//bluetackclasp.com/3fcc1b108f3c16049e14cdf752fe0d7f/invoke.js"></script>
          `;
        case '468x60':
          return `
            <script type="text/javascript">
              atOptions = {
                'key' : '9b533d0e09470b2c29b09bbbbc4f12d0',
                'format' : 'iframe',
                'height' : 60,
                'width' : 468,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="//bluetackclasp.com/9b533d0e09470b2c29b09bbbbc4f12d0/invoke.js"></script>
          `;
        case 'social-bar':
          return `
            <script type='text/javascript' src='//bluetackclasp.com/65/ae/89/65ae89355595f1693dbba515d5ec23d8.js'></script>
          `;
        case 'social-bar-new':
          return `
            <script type='text/javascript' src='//esteemcountryside.com/ab/3e/db/ab3edbee4e41066448bdd58ac668a95e.js'></script>
          `;
        case '320x50':
          return `
            <script type="text/javascript">
              atOptions = {
                'key' : '7ed0239f5b32153e9f9079d279db3234',
                'format' : 'iframe',
                'height' : 50,
                'width' : 320,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="//bluetackclasp.com/7ed0239f5b32153e9f9079d279db3234/invoke.js"></script>
          `;
        case 'native':
          return `
            <script async="async" data-cfasync="false" src="//bluetackclasp.com/0ba6cc252e3f9c90d0f068a3f1982fcc/invoke.js"></script>
            <div id="container-0ba6cc252e3f9c90d0f068a3f1982fcc"></div>
          `;
        case 'native-new':
          return `
            <script async="async" data-cfasync="false" src="//esteemcountryside.com/80a77afeb9df5dfe320bded029910320/invoke.js"></script>
            <div id="container-80a77afeb9df5dfe320bded029910320"></div>
          `;
        default:
          return '';
      }
    };

    // Get appropriate ad code
    const adCode = getAdCode();
    
    // Inject the ad code
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = adCode;
    
    // Process script tags
    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach(script => {
      const newScript = document.createElement('script');
      
      // Copy all attributes
      Array.from(script.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      // Copy inline script content
      if (script.innerHTML) {
        newScript.appendChild(document.createTextNode(script.innerHTML));
      }
      
      // Replace old script with new one
      if (script.parentNode) {
        adContainerRef.current?.appendChild(newScript);
      }
    });
    
    // Add any non-script elements
    Array.from(tempDiv.childNodes).forEach(node => {
      if (node.nodeName !== 'SCRIPT') {
        adContainerRef.current?.appendChild(node.cloneNode(true));
      }
    });
    
  }, [size]);

  // Get proper container class based on ad size
  const getAdContainerClass = () => {
    switch(size) {
      case '300x250':
        return 'w-[300px] h-[250px]';
      case '728x90':
      case '728x90-new':
        return 'w-full max-w-[728px] h-[90px]';
      case '160x600':
      case '160x600-new':
        return 'w-[160px] h-[600px]';
      case '160x300':
        return 'w-[160px] h-[300px]';
      case '468x60':
        return 'w-full max-w-[468px] h-[60px]';
      case '320x50':
        return 'w-full max-w-[320px] h-[50px]';
      case 'social-bar':
      case 'social-bar-new':
        return 'w-full min-h-[70px]';
      case 'native':
      case 'native-new':
        return 'w-full';
      default:
        return '';
    }
  };

  return (
    <div 
      ref={adContainerRef} 
      className={`ad-container ${getAdContainerClass()} ${className}`}
    />
  );
};

export default Ad;
