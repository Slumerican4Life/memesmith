
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  
  React.useEffect(() => {
    // Initial check based on screen width
    const checkMobile = () => window.innerWidth < MOBILE_BREAKPOINT
    setIsMobile(checkMobile())
    
    // Use matchMedia for efficient change detection
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Simple handler without debounce for immediate UI response
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }
    
    // Add event listener with compatibility fallback
    if (mql.addEventListener) {
      mql.addEventListener('change', handleChange)
    } else {
      // @ts-ignore - For older browsers
      mql.addListener(() => setIsMobile(mql.matches))
    }
    
    // Clean up
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handleChange)
      } else {
        // @ts-ignore - For older browsers
        mql.removeListener(() => setIsMobile(mql.matches))
      }
    }
  }, [])

  return isMobile
}
