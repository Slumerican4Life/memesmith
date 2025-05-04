
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if the user has already dismissed the prompt
    const hasDismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (hasDismissed) {
      setDismissed(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the deferred prompt variable
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    });
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showInstallPrompt || dismissed || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-0 inset-x-0 mx-auto mb-4 max-w-md px-4 z-50">
      <div className="bg-gradient-to-r from-meme-darkpurple/90 to-meme-purple/90 backdrop-blur-lg rounded-lg shadow-lg p-4 border border-meme-purple/40 animate-fade-in">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-white">Add MemeSmith to your Home Screen</h3>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={handleDismiss}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-sm text-gray-200 mt-1">Install for the full mobile experience!</p>
        <div className="mt-3 flex justify-end">
          <Button 
            className="bg-white text-meme-purple hover:bg-white/90"
            onClick={handleInstallClick}
          >
            <Download className="mr-2 h-4 w-4" />
            Install App
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
