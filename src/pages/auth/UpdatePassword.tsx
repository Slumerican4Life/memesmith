
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Form validation schema
const formSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Please confirm your password' }),
})
.refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const UpdatePassword = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);

  // Check if user has access to this page
  useEffect(() => {
    const checkSession = async () => {
      // Check if there's an access token in the URL
      const params = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = params.get('access_token');
      
      if (!accessToken) {
        // No token in URL, check if user has a current session
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setIsValidLink(false);
          toast({
            variant: "destructive",
            title: "Invalid or expired link",
            description: "This password reset link is invalid or has expired.",
          });
          setTimeout(() => {
            navigate('/auth/login', { replace: true });
          }, 3000);
        }
      }
    };
    
    checkSession();
  }, [navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      const { error } = await updatePassword(values.password);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Password update failed",
          description: error.message || "We couldn't update your password. Please try again.",
        });
        setIsLoading(false);
        return;
      }

      // Success
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      
      // Redirect to login page
      navigate('/auth/login', { replace: true });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: error.message || "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidLink) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-background/95">
        <div className="bg-card px-6 py-8 shadow-md rounded-lg border border-border max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Invalid Link</h2>
          <p className="text-sm text-muted-foreground mb-4">
            This password reset link is invalid or has expired. 
            You'll be redirected to the login page.
          </p>
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-meme-purple" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-background/95">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgc3Ryb2tlPSIjOUI4N0Y1IiBzdHJva2Utb3BhY2l0eT0iLjAyIiBjeD0iMTAwIiBjeT0iMTAwIiByPSI5OCIvPjxwYXRoIGQ9Ik0xMDAgMmM1NiAwIDk4IDQyIDk4IDk4IDAgNTYtNDIgOTgtOTggOTgtNTQgMC05OC00NC05OC05OEMyIDQ0IDQ0IDIgMTAwIDJ6IiBzdHJva2U9IiNEOTQ2RUYiIHN0cm9rZS1vcGFjaXR5PSIuMDIiLz48L2c+PC9zdmc+')]"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-meme-purple to-meme-pink bg-clip-text text-transparent">
            MemeSmith
          </h1>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold text-foreground">
          Create a new password
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Your password must be at least 6 characters long.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card px-4 py-8 shadow-md sm:rounded-lg sm:px-10 border border-border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="••••••••" 
                        {...field} 
                        type="password"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="••••••••" 
                        {...field} 
                        type="password"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-meme-purple hover:bg-meme-purple/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating password...
                  </>
                ) : (
                  'Update password'
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
