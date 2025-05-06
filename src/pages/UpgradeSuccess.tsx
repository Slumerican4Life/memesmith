
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ThumbsUp } from 'lucide-react';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const UpgradeSuccess = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  useEffect(() => {
    // If profile is loaded and the user is not pro, they might have refreshed the page before the webhook updated their status
    // Let's wait a few seconds and then navigate to profile
    if (profile && !profile.is_pro) {
      const timer = setTimeout(() => {
        navigate('/profile');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [profile, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/95">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgc3Ryb2tlPSIjOUI4N0Y1IiBzdHJva2Utb3BhY2l0eT0iLjAyIiBjeD0iMTAwIiBjeT0iMTAwIiByPSI5OCIvPjxwYXRoIGQ9Ik0xMDAgMmM1NiAwIDk4IDQyIDk4IDk4IDAgNTYtNDIgOTgtOTggOTgtNTQgMC05OC00NC05OC05OEMyIDQ0IDQ0IDIgMTAwIDJ6IiBzdHJva2U9IiNEOTQ2RUYiIHN0cm9rZS1vcGFjaXR5PSIuMDIiLz48L2c+PC9zdmc+')]"></div>
      
      <Header />
      
      <main className="container px-4 mx-auto flex-1 py-16 relative z-10 flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Upgrade Complete!</h1>
          
          <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <p className="text-lg mb-4">
              Thank you for upgrading to MemeSmith Pro! Your account has been successfully upgraded.
            </p>
            
            <div className="flex items-center justify-center mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-meme-purple/20 text-meme-purple">
                <ThumbsUp className="w-4 h-4 mr-1" /> Pro Status Active
              </span>
            </div>
            
            <p className="text-muted-foreground">
              You now have access to all premium features and templates!
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              className="w-full bg-meme-purple hover:bg-meme-purple/90"
              onClick={() => navigate('/')}
            >
              Create Pro Memes Now
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/profile')}
            >
              View My Profile
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UpgradeSuccess;
