
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle OAuth callback
    const handleOAuthCallback = async () => {
      try {
        // Process the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          // Success - redirect to home page
          toast("Authentication successful", {
            description: "You've been successfully signed in."
          });
          navigate('/', { replace: true });
        } else {
          // No session found - redirect to login page
          toast("Authentication failed", {
            description: "Unable to complete sign in. Please try again.",
            variant: "destructive"
          });
          navigate('/auth/login', { replace: true });
        }
      } catch (error: any) {
        console.error('Error during OAuth callback:', error);
        toast("Authentication failed", {
            description: error.message || "An error occurred during authentication. Please try again.",
            variant: "destructive"
        });
        navigate('/auth/login', { replace: true });
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-background to-background/95">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgc3Ryb2tlPSIjOUI4N0Y1IiBzdHJva2Utb3BhY2l0eT0iLjAyIiBjeD0iMTAwIiBjeT0iMTAwIiByPSI5OCIvPjxwYXRoIGQ9Ik0xMDAgMmM1NiAwIDk4IDQyIDk4IDk4IDAgNTYtNDIgOTgtOTggOTgtNTQgMC05OC00NC05OC05OEMyIDQ0IDQ0IDIgMTAwIDJ6IiBzdHJva2U9IiNEOTQ2RUYiIHN0cm9rZS1vcGFjaXR5PSIuMDIiLz48L2c+PC9zdmc+')]"></div>
      
      <div className="z-10 bg-card p-8 rounded-lg shadow-md border border-border flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-meme-purple to-meme-pink bg-clip-text text-transparent">
          MemeSmith
        </h1>
        <Loader2 className="h-8 w-8 animate-spin text-meme-purple" />
        <p className="mt-4 text-center text-muted-foreground">
          Completing authentication...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
