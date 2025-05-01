
import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-8 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-meme-pink/5 to-meme-purple/5 z-0"></div>
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm font-medium">
            © {new Date().getFullYear()} <span className="text-primary">MemeSmith</span>. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm mt-3 md:mt-0 flex items-center gap-1">
            Created with <Heart size={14} className="text-meme-pink fill-meme-pink animate-pulse" /> by the <span className="text-primary font-medium">MemeSmith Crew</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
