
import React, { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Meme } from '@/types/meme';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from '@/components/Head';
import MemeGalleryCard from '@/components/MemeGalleryCard';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const fetchPublicMemes = async ({ pageParam = 0 }) => {
  const from = pageParam * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;
  
  const { data, error, count } = await supabase
    .from('memes')
    .select('*', { count: 'exact' })
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  
  return {
    memes: data as Meme[],
    nextPage: data.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
    totalCount: count || 0
  };
};

const ExploreMemes = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['publicMemes'],
    queryFn: fetchPublicMemes,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const allMemes = data?.pages.flatMap((page) => page.memes) || [];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Head 
        title="Explore Memes"
        description="Explore the best memes created by the MemeSmith community"
      />
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-meme-blue to-meme-purple bg-clip-text text-transparent">
            Explore Memes
          </h1>
          <Sparkles size={24} className="ml-2 text-meme-orange" />
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg shadow-md h-72 animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Error loading memes</p>
            <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
          </div>
        ) : allMemes.length === 0 ? (
          <div className="text-center py-12 border border-border rounded-lg bg-card/50">
            <h3 className="text-xl font-medium mb-2">No public memes available yet</h3>
            <p className="text-muted-foreground mb-6">Be the first to share a meme with the community!</p>
            <a href="/" className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors">
              Create and Share a Meme
            </a>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {allMemes.map((meme) => (
                <MemeGalleryCard key={meme.id} meme={meme} />
              ))}
            </div>
            
            {hasNextPage && (
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant="outline"
                  className="min-w-[200px]"
                >
                  {isFetchingNextPage ? "Loading more..." : "Load More Memes"}
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ExploreMemes;
