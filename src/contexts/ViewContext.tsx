
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

type ViewMode = 'auto' | 'mobile' | 'desktop';

interface ViewContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  actualDeviceType: 'mobile' | 'desktop';
  isInitialized: boolean;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>('auto');
  const { isMobile, isInitialized: isMobileInitialized } = useIsMobile();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Load saved preference from localStorage if available
    const savedViewMode = localStorage.getItem('viewMode') as ViewMode;
    if (savedViewMode && ['auto', 'mobile', 'desktop'].includes(savedViewMode)) {
      setViewModeState(savedViewMode);
    }
    
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
  
  // Determine actual device type based on the isMobile hook
  const actualDeviceType = isMobile ? 'mobile' : 'desktop';
  
  return (
    <ViewContext.Provider value={{ 
      viewMode, 
      setViewMode, 
      actualDeviceType, 
      isInitialized: isInitialized && isMobileInitialized 
    }}>
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
