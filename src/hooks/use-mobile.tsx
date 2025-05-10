
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile(): { isMobile: boolean; isInitialized: boolean } {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isInitialized, setIsInitialized] = React.useState(false)

  React.useEffect(() => {
    // Simple function to check if device is mobile based on width
    const checkMobile = () => window.innerWidth < MOBILE_BREAKPOINT
    
    // Set initial value
    setIsMobile(checkMobile())
    setIsInitialized(true)
    
    // Add resize listener
    const handleResize = () => {
      setIsMobile(checkMobile())
    }
    
    window.addEventListener('resize', handleResize)
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return {
    isMobile,
    isInitialized
  }
}
