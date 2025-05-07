
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Meme } from '@/types/meme';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from '@/components/Head';
import MemeGalleryCard from '@/components/MemeGalleryCard';

const fetchUserMemes = async (userId: string) => {
  const { data, error } = await supabase
    .from('memes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Meme[];
};

const MyMemes = () => {
  const { profile } = useAuth();
  
  const { data: memes, isLoading, error } = useQuery({
    queryKey: ['userMemes', profile?.id],
    queryFn: () => fetchUserMemes(profile!.id),
    enabled: !!profile?.id,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Head 
        title="My Memes"
        description="View all the memes you've created with MemeSmith"
      />
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-meme-blue to-meme-purple bg-clip-text text-transparent">
          My Memes
        </h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg shadow-md h-72 animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Error loading your memes</p>
            <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
          </div>
        ) : memes?.length === 0 ? (
          <div className="text-center py-12 border border-border rounded-lg bg-card/50">
            <h3 className="text-xl font-medium mb-2">You haven't created any memes yet</h3>
            <p className="text-muted-foreground mb-6">Time to get creative!</p>
            <a href="/" className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors">
              Create Your First Meme
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {memes?.map((meme) => (
              <MemeGalleryCard key={meme.id} meme={meme} />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default MyMemes;
