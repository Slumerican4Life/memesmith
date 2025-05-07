
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Meme } from '@/types/meme';
import { Share2, Download, Trash2, Twitter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Head from '@/components/Head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

const fetchMeme = async (id: string) => {
  const { data, error } = await supabase
    .from('memes')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Meme not found');
  
  return data as Meme;
};

const MemeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast: hookToast } = useToast();

  const { data: meme, isLoading, error } = useQuery({
    queryKey: ['meme', id],
    queryFn: () => fetchMeme(id!),
    enabled: !!id,
  });

  const isOwner = profile && meme && profile.id === meme.user_id;

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast('Link copied to clipboard', {
      description: 'Share this meme with your friends!',
    });
  };

  const handleShareToTwitter = () => {
    if (!meme) return;
    
    const text = `Check out this meme I made with MemeSmith!`;
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleDownload = () => {
    if (!meme) return;
    
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = meme.meme_url;
    link.download = `memesmith-${meme.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    if (!meme || !isOwner) return;
    
    try {
      const { error } = await supabase
        .from('memes')
        .delete()
        .eq('id', meme.id);
      
      if (error) throw error;
      
      hookToast({
        title: "Meme deleted",
        description: "Your meme has been permanently deleted.",
      });
      
      navigate('/my-memes');
    } catch (err) {
      console.error('Error deleting meme:', err);
      hookToast({
        title: "Error deleting meme",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 mx-auto flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-pulse bg-card w-full max-w-md h-64 rounded-lg"></div>
          <div className="animate-pulse bg-card w-48 h-8 mt-4 rounded"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !meme) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 mx-auto flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold text-foreground mb-4">Meme not found</h1>
          <p className="text-muted-foreground mb-6">This meme doesn't exist or you don't have permission to view it.</p>
          <Button asChild>
            <Link to="/">Create a new meme</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Head 
        title={`Check out this meme from MemeSmith`}
        description="Create your own memes with MemeSmith - the web's easiest meme generator."
        image={meme.meme_url}
        type="article"
      />
      
      <Header />
      
      <div className="container py-8 mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-lg overflow-hidden shadow-xl border border-border">
            {/* Meme image */}
            <div className="flex justify-center p-4 bg-muted">
              <img 
                src={meme.meme_url} 
                alt="Meme" 
                className="max-w-full rounded shadow-sm"
                loading="lazy"
              />
            </div>
            
            {/* Action buttons */}
            <div className="p-4 flex flex-wrap gap-3 justify-center sm:justify-between items-center border-t border-border">
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2"
                >
                  <Share2 size={18} />
                  Copy Link
                </Button>
                
                <Button 
                  onClick={handleShareToTwitter}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Twitter size={18} />
                  Share to X/Twitter
                </Button>
                
                <Button 
                  onClick={handleDownload}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <Download size={18} />
                  Download
                </Button>
              </div>
              
              {isOwner && (
                <Button 
                  onClick={() => setShowDeleteDialog(true)}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete
                </Button>
              )}
            </div>
            
            {/* Meme details */}
            <div className="p-4 bg-card/50 border-t border-border">
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Top text:</span>
                  <p className="text-foreground">{meme.top_text || "(none)"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Bottom text:</span>
                  <p className="text-foreground">{meme.bottom_text || "(none)"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Created:</span>
                  <p className="text-foreground">
                    {new Date(meme.created_at).toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button asChild variant="outline">
              <Link to="/">Create Another Meme</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your meme.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MemeDetail;
