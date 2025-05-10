
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Server-side rendering check
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });
  
  React.useEffect(() => {
    // Use matchMedia for efficient change detection
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Set initial state based on media query
    setIsMobile(mql.matches);
    
    // Create a stable event handler
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    
    // Add event listener with compatibility fallback
    if (mql.addEventListener) {
      mql.addEventListener('change', handleChange);
    } else {
      // @ts-ignore - For older browsers
      mql.addListener(handleChange);
    }
    
    // Clean up
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handleChange);
      } else {
        // @ts-ignore - For older browsers
        mql.removeListener(handleChange);
      }
    };
  }, []); // Empty dependency array to only run once on mount

  // Return memoized value to prevent unnecessary re-renders
  return React.useMemo(() => isMobile, [isMobile]);
}
