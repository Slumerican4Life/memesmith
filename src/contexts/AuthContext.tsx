
import { createContext, useContext, useState, useEffect, FC, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { Session, User, Provider } from '@supabase/supabase-js';
import { UserProfile } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  signUp: (email: string, password: string, username?: string) => Promise<{ error?: { message: string } }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: { message: string } }>;
  updatePassword: (password: string) => Promise<{ error?: { message: string } }>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (!data.is_pro) {
        data.is_pro = false;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // First set up listener for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              // Use setTimeout to prevent potential deadlock in Supabase client
              setTimeout(async () => {
                const userProfile = await fetchProfile(session.user.id);
                setProfile(userProfile);
              }, 0);
            } else {
              setProfile(null);
            }
          }
        );

        // Then check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
        }
        
        setLoading(false);

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      // User will be set by the onAuthStateChange listener
      const returnTo = new URLSearchParams(location.search).get('returnTo') || '/';
      navigate(returnTo);
      
      return { error: undefined };
    } catch (error: any) {
      console.error('Error in signIn:', error);
      return { error: { message: error.message || "An error occurred during sign in" } };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, username?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username,
          },
        }
      });
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            username: username || null,
            wins: 0,
            losses: 0,
            is_pro: false,
          });
          
        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
        
        toast({
          title: "Account created",
          description: "Your account has been created successfully!",
        });
        
        navigate('/');
      }
      
      return { error: undefined };
    } catch (error: any) {
      console.error('Error in signUp:', error);
      return { error: { message: error.message || "An error occurred during sign up" } };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      
      // User will be cleared by the onAuthStateChange listener
      navigate('/');
      
    } catch (error) {
      console.error('Error in signOut:', error);
    }
  };

  // Reset password (send password reset email)
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      
      if (error) {
        return { error };
      }
      
      return { error: undefined };
    } catch (error: any) {
      console.error('Error in resetPassword:', error);
      return { error: { message: error.message || "An error occurred during password reset" } };
    }
  };

  // Update password
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        return { error };
      }
      
      return { error: undefined };
    } catch (error: any) {
      console.error('Error in updatePassword:', error);
      return { error: { message: error.message || "An error occurred during password update" } };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Google sign in failed",
          description: error.message,
        });
        throw error;
      }
    } catch (error: any) {
      console.error('Error in signInWithGoogle:', error);
      throw error;
    }
  };

  // Sign in with GitHub
  const signInWithGithub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "GitHub sign in failed",
          description: error.message,
        });
        throw error;
      }
    } catch (error: any) {
      console.error('Error in signInWithGithub:', error);
      throw error;
    }
  };
  
  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);
      
      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      // Update local state
      setProfile({ ...profile, ...updates });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully!",
      });
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    session,
    user,
    profile,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    signInWithGoogle,
    signInWithGithub,
    loading,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
