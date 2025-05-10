
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const DEBOUNCE_DELAY = 100 // Reduced debounce delay for faster response

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isInitialized, setIsInitialized] = React.useState(false)

  React.useEffect(() => {
    // Simple check function
    const checkMobile = () => window.innerWidth < MOBILE_BREAKPOINT
    
    // Set initial value immediately
    setIsMobile(checkMobile())
    setIsInitialized(true)
    
    // Debounced handler for resize
    let debounceTimer: number | null = null
    
    const handleResize = () => {
      if (debounceTimer) {
        window.clearTimeout(debounceTimer)
      }
      
      debounceTimer = window.setTimeout(() => {
        setIsMobile(checkMobile())
      }, DEBOUNCE_DELAY)
    }
    
    // Add standard resize event listener
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      if (debounceTimer) {
        window.clearTimeout(debounceTimer)
      }
    }
  }, [])

  return {
    isMobile,
    isInitialized
  }
}
