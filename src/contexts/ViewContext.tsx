import React, { createContext, useState, useContext } from 'react';

// We're only using mobile for now, but keeping the type for future expansion
type ViewMode = 'mobile' | 'desktop';

interface ViewContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isInitialized: boolean;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  // Always enforce mobile mode - no switching allowed for now
  const [viewMode] = useState<ViewMode>('mobile');
  const [isInitialized] = useState(true);
  
  // This is just a placeholder function that does nothing
  // We'll implement real functionality when desktop mode is added later
  const setViewMode = () => {
    // Do nothing - mobile only for now
    console.log("Desktop mode not available yet");
  };
  
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
