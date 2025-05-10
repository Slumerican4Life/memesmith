
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { HelmetProvider } from 'react-helmet-async';
import { TooltipProvider } from "@/components/ui/tooltip";
import { ViewProvider } from "./contexts/ViewContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MobileMeme from "./pages/MobileMeme";
import InstallPWA from "./components/InstallPWA";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import UpdatePassword from "./pages/auth/UpdatePassword";
import AuthCallback from "./pages/auth/AuthCallback";
import Profile from "./pages/Profile";
import ProUpgrade from "./pages/ProUpgrade";
import UpgradeSuccess from "./pages/UpgradeSuccess";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import MemeDetail from "./pages/MemeDetail";
import MyMemes from "./pages/MyMemes";
import ExploreMemes from "./pages/ExploreMemes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

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

// Simplified responsive component that just renders Index
const ResponsiveHome = () => {
  return <Index />;
};

const App = () => {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <AuthProvider>
            <ViewProvider>
              <HelmetProvider>
                <Toaster />
                <Sonner />
                <InstallPWA />
                <Routes>
                  <Route path="/" element={<ResponsiveHome />} />
                  <Route path="/mobile" element={<MobileMeme />} />
                  
                  {/* Meme Routes */}
                  <Route path="/memes/:id" element={<MemeDetail />} />
                  <Route path="/my-memes" element={
                    <ProtectedRoute>
                      <MyMemes />
                    </ProtectedRoute>
                  } />
                  <Route path="/explore" element={<ExploreMemes />} />
                  
                  {/* Auth Routes */}
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/register" element={<Register />} />
                  <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                  <Route path="/auth/update-password" element={<UpdatePassword />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  
                  {/* Protected Routes */}
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  
                  {/* Pro Upgrade Routes */}
                  <Route path="/upgrade" element={<ProUpgrade />} />
                  <Route path="/upgrade-success" element={<UpgradeSuccess />} />
                  
                  {/* Legal Routes */}
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  
                  {/* Catch-all 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </HelmetProvider>
            </ViewProvider>
          </AuthProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
