
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CreditCard, CheckCircle2, XCircle } from 'lucide-react';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const ProUpgrade = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUpgrade = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upgrade to Pro.",
        variant: "destructive"
      });
      navigate('/auth/login');
      return;
    }
    
    if (profile?.is_pro) {
      toast({
        title: "Already a Pro member",
        description: "You already have Pro access!",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the create-checkout Netlify function
      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          returnUrl: window.location.origin,
        }),
      });
      
      const { url, error } = await response.json();
      
      if (error) {
        throw new Error(error);
      }
      
      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Checkout Failed",
        description: "There was a problem starting the checkout process. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/95">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgc3Ryb2tlPSIjOUI4N0Y1IiBzdHJva2Utb3BhY2l0eT0iLjAyIiBjeD0iMTAwIiBjeT0iMTAwIiByPSI5OCIvPjxwYXRoIGQ9Ik0xMDAgMmM1NiAwIDk4IDQyIDk4IDk4IDAgNTYtNDIgOTgtOTggOTgtNTQgMC05OC00NC05OC05OEMyIDQ0IDQ0IDIgMTAwIDJ6IiBzdHJva2U9IiNEOTQ2RUYiIHN0cm9rZS1vcGFjaXR5PSIuMDIiLz48L2c+PC9zdmc+')]"></div>
      
      <Header />
      
      <main className="container px-4 mx-auto flex-1 py-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-meme-purple to-meme-pink bg-clip-text text-transparent mb-4">
            Upgrade to MemeSmith Pro
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Take your meme creation to the next level with premium features and templates
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Free Plan</CardTitle>
              <CardDescription>Current features</CardDescription>
              <div className="mt-4 text-4xl font-bold">$0</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Basic meme templates</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Create and download memes</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Mobile-friendly editor</span>
                </div>
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-muted-foreground">Premium templates</span>
                </div>
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-muted-foreground">Advanced text effects</span>
                </div>
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-muted-foreground">Priority support</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="border-meme-purple/40 bg-gradient-to-b from-background to-purple-900/5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-meme-purple/10 rounded-full w-64 h-64 blur-3xl"></div>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Pro Pack</CardTitle>
                <Badge className="bg-meme-purple text-white">RECOMMENDED</Badge>
              </div>
              <CardDescription>Unlock all features</CardDescription>
              <div className="mt-4 text-4xl font-bold">$19.99</div>
              <div className="text-sm text-muted-foreground">One-time payment</div>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>All free features</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Premium templates library</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Advanced text styles and effects</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>High-resolution downloads</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Early access to new features</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="relative z-10">
              {profile?.is_pro ? (
                <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Already Upgraded
                </Button>
              ) : (
                <Button 
                  className="w-full bg-meme-purple hover:bg-meme-purple/90" 
                  onClick={handleUpgrade}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Upgrade Now
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-bold mb-2">100% Secure Checkout</h3>
          <p className="text-muted-foreground">
            Your payment is secure and encrypted. We use Stripe for secure payment processing.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProUpgrade;
