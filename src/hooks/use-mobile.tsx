
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const DEBOUNCE_DELAY = 250 // Reduced for more responsive UI while preventing too many updates

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [initialCheckComplete, setInitialCheckComplete] = React.useState(false)

  React.useEffect(() => {
    // Initial check
    const checkMobile = () => window.innerWidth < MOBILE_BREAKPOINT
    
    // Set initial value only once
    if (!initialCheckComplete) {
      setIsMobile(checkMobile())
      setInitialCheckComplete(true)
    }
    
    // Use a ref to track the timeout to avoid re-renders
    const debounceTimerRef = React.useRef<number | null>(null)
    
    const handleResize = () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current)
      }
      
      debounceTimerRef.current = window.setTimeout(() => {
        const isMobileNow = checkMobile()
        setIsMobile(isMobileNow)
      }, DEBOUNCE_DELAY)
    }
    
    // Use matchMedia for efficient listening
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Initial check
    setIsMobile(mql.matches)
    
    // Add event listener
    const eventHandler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }
    
    try {
      mql.addEventListener("change", eventHandler)
    } catch (err) {
      // Fallback for older browsers
      mql.addListener(handleResize)
    }
    
    // Cleanup
    return () => {
      try {
        mql.removeEventListener("change", eventHandler)
      } catch (err) {
        mql.removeListener(handleResize)
      }
      
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current)
      }
    }
  }, [initialCheckComplete])

  return isMobile
}
