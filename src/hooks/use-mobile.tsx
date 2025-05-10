
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const DEBOUNCE_DELAY = 1500 // Increased to 1500ms for better stability

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Initial check
    const checkMobile = () => window.innerWidth < MOBILE_BREAKPOINT
    
    // Set initial value
    setIsMobile(checkMobile())
    
    // Debounced handler to prevent rapid state changes
    let debounceTimer: number | null = null
    
    const handleResize = () => {
      if (debounceTimer) {
        window.clearTimeout(debounceTimer)
      }
      
      debounceTimer = window.setTimeout(() => {
        setIsMobile(checkMobile())
      }, DEBOUNCE_DELAY)
    }
    
    // Use matchMedia for efficient listening
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Use the correct event listener based on browser support
    try {
      mql.addEventListener("change", handleResize)
    } catch (err) {
      // Fallback for older browsers
      console.log("Using fallback media query listener")
      mql.addListener(handleResize)
    }
    
    return () => {
      try {
        mql.removeEventListener("change", handleResize)
      } catch (err) {
        // Fallback cleanup for older browsers
        mql.removeListener(handleResize)
      }
      
      if (debounceTimer) {
        window.clearTimeout(debounceTimer)
      }
    }
  }, [])

  return isMobile
}
