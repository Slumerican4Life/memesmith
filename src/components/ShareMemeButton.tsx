
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check, Copy, Twitter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

interface ShareMemeButtonProps {
  memeId?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  className?: string;
}

const ShareMemeButton: React.FC<ShareMemeButtonProps> = ({
  memeId,
  variant = "default",
  size = "default",
  className = ""
}) => {
  const [copied, setCopied] = useState(false);
  
  const getMemeUrl = () => {
    if (memeId) {
      return `${window.location.origin}/memes/${memeId}`;
    }
    return window.location.href;
  };
  
  const handleCopyLink = () => {
    const url = getMemeUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast('Link copied to clipboard', {
      description: 'Share this meme with your friends!',
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleShareToTwitter = () => {
    const text = `Check out this meme I made with MemeSmith!`;
    const url = getMemeUrl();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          {copied ? (
            <Check className="mr-2 h-4 w-4 text-green-500" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          {copied ? "Copied!" : "Copy Link"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareToTwitter} className="cursor-pointer">
          <Twitter className="mr-2 h-4 w-4" />
          Share to X/Twitter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareMemeButton;
