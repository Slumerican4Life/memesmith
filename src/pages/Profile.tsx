
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, LogOut, User } from 'lucide-react';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Form validation schema
const formSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }).optional(),
});

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: profile?.username || '',
    },
  });
  
  // Update form values when profile data loads
  React.useEffect(() => {
    if (profile?.username) {
      form.setValue('username', profile.username);
    }
  }, [profile, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          username: values.username || null,
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "An error occurred while updating your profile.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/95">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgc3Ryb2tlPSIjOUI4N0Y1IiBzdHJva2Utb3BhY2l0eT0iLjAyIiBjeD0iMTAwIiBjeT0iMTAwIiByPSI5OCIvPjxwYXRoIGQ9Ik0xMDAgMmM1NiAwIDk4IDQyIDk4IDk4IDAgNTYtNDIgOTgtOTggOTgtNTQgMC05OC00NC05OC05OEMyIDQ0IDQ0IDIgMTAwIDJ6IiBzdHJva2U9IiNEOTQ2RUYiIHN0cm9rZS1vcGFjaXR5PSIuMDIiLz48L2c+PC9zdmc+')]"></div>
        
        <Header />
        
        <main className="container px-4 mx-auto flex-1 py-8 relative z-10 flex items-center justify-center">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-meme-purple" />
            <span className="ml-2 text-lg font-medium">Loading profile...</span>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/95">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgc3Ryb2tlPSIjOUI4N0Y1IiBzdHJva2Utb3BhY2l0eT0iLjAyIiBjeD0iMTAwIiBjeT0iMTAwIiByPSI5OCIvPjxwYXRoIGQ9Ik0xMDAgMmM1NiAwIDk4IDQyIDk4IDk4IDAgNTYtNDIgOTgtOTggOTgtNTQgMC05OC00NC05OC05OEMyIDQ0IDQ0IDIgMTAwIDJ6IiBzdHJva2U9IiNEOTQ2RUYiIHN0cm9rZS1vcGFjaXR5PSIuMDIiLz48L2c+PC9zdmc+')]"></div>
      
      <Header />
      
      <main className="container px-4 mx-auto flex-1 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg shadow-md border border-border p-6 md:p-8">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-meme-purple/20 flex items-center justify-center">
                <User className="h-8 w-8 text-meme-purple" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold">Profile</h1>
                <p className="text-muted-foreground">
                  Manage your account settings
                </p>
              </div>
            </div>
            
            <Separator className="my-6" />

            <div className="space-y-6">
              {/* Account Information */}
              <div>
                <h2 className="text-lg font-medium mb-4">Account Information</h2>
                <div className="grid gap-4">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Email</span>
                    <p className="mt-1">{user.email}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Account Created</span>
                    <p className="mt-1">{new Date(profile.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Account Status</span>
                    <div className="mt-1 flex items-center">
                      {profile.is_pro ? (
                        <div className="flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          <span className="font-medium">Pro Member</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                          <span>Free Account</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Profile Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <h2 className="text-lg font-medium mb-4">Profile Settings</h2>
                  
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Choose a username" 
                            {...field} 
                            value={field.value || ''}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="bg-meme-purple hover:bg-meme-purple/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save changes'
                    )}
                  </Button>
                </form>
              </Form>
              
              <Separator />
              
              {/* Sign Out */}
              <div>
                <h2 className="text-lg font-medium mb-4">Account Actions</h2>
                <Button 
                  variant="outline" 
                  className="border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
