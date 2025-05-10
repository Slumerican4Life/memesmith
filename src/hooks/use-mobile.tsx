
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const DEBOUNCE_DELAY = 1000 // Increased from 300 to 1000 for better stability

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

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
    mql.addEventListener("change", handleResize)
    
    return () => {
      mql.removeEventListener("change", handleResize)
      if (debounceTimer) {
        window.clearTimeout(debounceTimer)
      }
    }
  }, [])

  return isMobile === undefined ? false : isMobile
}
