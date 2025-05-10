
import React, { createContext, useState, useContext, useEffect } from 'react';

type ViewMode = 'auto' | 'mobile' | 'desktop';

interface ViewContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  actualDeviceType: 'mobile' | 'desktop' | undefined;
  isInitialized: boolean;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>('auto');
  const [actualDeviceType, setActualDeviceType] = useState<'mobile' | 'desktop' | undefined>(undefined);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Detect actual device type on mount using User-Agent and screen size
  useEffect(() => {
    const detectDeviceType = () => {
      // Check for mobile user agent patterns
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      // Check screen width
      const isMobileScreen = window.innerWidth < 768;
      
      // Check for touch capability as additional signal
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Combine signals - if 2 out of 3 suggest mobile, treat as mobile
      const mobileSignals = [isMobileUserAgent, isMobileScreen, hasTouch].filter(Boolean).length;
      const isMobile = mobileSignals >= 2;
      
      return isMobile ? 'mobile' : 'desktop';
    };

    // Set the actual device type
    const detectedType = detectDeviceType();
    setActualDeviceType(detectedType);
    
    // Load saved preference from localStorage if available
    const savedViewMode = localStorage.getItem('viewMode') as ViewMode;
    if (savedViewMode && ['auto', 'mobile', 'desktop'].includes(savedViewMode)) {
      setViewModeState(savedViewMode);
    } else {
      // If no saved preference, start with auto
      setViewModeState('auto');
    }
    
    // Mark initialization as complete
    setIsInitialized(true);
  }, []);
  
  // Save preference to localStorage whenever it changes
  useEffect(() => {
    if (viewMode) {
      localStorage.setItem('viewMode', viewMode);
    }
  }, [viewMode]);
  
  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
  };
  
  return (
    <ViewContext.Provider value={{ viewMode, setViewMode, actualDeviceType, isInitialized }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
}
