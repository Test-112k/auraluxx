
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      // More comprehensive mobile detection
      const mobile = width < MOBILE_BREAKPOINT || (isTouchDevice && width < 1024) || isMobileUA;
      setIsMobile(mobile);
    };

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = checkDevice;
    
    mql.addEventListener("change", onChange);
    checkDevice(); // Initial check
    
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
