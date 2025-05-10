
import React, { createContext, useState, useContext, useEffect } from 'react';

type ViewMode = 'mobile' | 'desktop';

interface ViewContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isInitialized: boolean;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>('desktop');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // On mount - load saved preference from localStorage if available
  useEffect(() => {
    const savedViewMode = localStorage.getItem('viewMode') as ViewMode;
    if (savedViewMode && ['mobile', 'desktop'].includes(savedViewMode)) {
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
  
  // Create a stable context value with React.useMemo to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    viewMode,
    setViewMode,
    isInitialized
  }), [viewMode, isInitialized]);
  
  return (
    <ViewContext.Provider value={contextValue}>
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
