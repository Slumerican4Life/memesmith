
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MobileMeme from "./pages/MobileMeme";
import InstallPWA from "./components/InstallPWA";
import { useIsMobile } from "./hooks/use-mobile";

const queryClient = new QueryClient();

// Register service worker
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

const MobileRedirect = () => {
  const isMobile = useIsMobile();
  
  return isMobile ? <Navigate to="/mobile" /> : <Index />;
};

const App = () => {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <InstallPWA />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MobileRedirect />} />
            <Route path="/mobile" element={<MobileMeme />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
