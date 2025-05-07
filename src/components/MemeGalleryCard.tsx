
import React from 'react';
import { Link } from 'react-router-dom';
import { Meme } from '@/types/meme';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, Eye, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface MemeGalleryCardProps {
  meme: Meme;
}

const MemeGalleryCard: React.FC<MemeGalleryCardProps> = ({ meme }) => {
  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/memes/${meme.id}`;
    navigator.clipboard.writeText(url);
    toast('Link copied to clipboard', {
      description: 'Share this meme with your friends!',
    });
  };
  
  return (
    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover-lift group">
      <Link to={`/memes/${meme.id}`} className="block h-full">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={meme.meme_url} 
            alt={`Meme with text: ${meme.top_text} ${meme.bottom_text}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
            <div className="text-white text-sm line-clamp-2 font-medium">
              {meme.top_text && <span>"{meme.top_text}"</span>}
              {meme.top_text && meme.bottom_text && <span> - </span>}
              {meme.bottom_text && <span>"{meme.bottom_text}"</span>}
            </div>
          </div>
          
          <button 
            onClick={handleCopyLink}
            className="absolute top-2 right-2 bg-background/80 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/90 hover:text-primary-foreground"
            title="Copy link"
          >
            <Share2 size={16} />
          </button>
        </div>
        
        <CardContent className="p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{format(new Date(meme.created_at), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>View Details</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default MemeGalleryCard;
