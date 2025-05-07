
import React from 'react';
import { Heart, Sparkles, Flame, Sword } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-10 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-meme-darkpurple/10 via-meme-purple/5 to-meme-pink/10 z-0"></div>
      
      {/* Animated bubbles */}
      <div className="absolute bottom-0 left-1/4 w-16 h-16 rounded-full bg-meme-purple/5 animate-pulse"></div>
      <div className="absolute top-1/2 right-1/3 w-24 h-24 rounded-full bg-meme-pink/5 animate-pulse delay-700"></div>
      <div className="absolute top-0 right-1/4 w-12 h-12 rounded-full bg-meme-blue/5 animate-pulse delay-1000"></div>
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="relative group">
            <div className="flex items-center gap-1">
              <p className="text-muted-foreground text-sm font-medium">
                © {new Date().getFullYear()} 
                <span className="bg-gradient-to-r from-meme-purple to-meme-pink bg-clip-text text-transparent group-hover:font-bold transition-all duration-300 ml-1">
                  MemeSmith
                </span>
              </p>
              <Flame size={10} className="text-meme-orange animate-pulse" />
              <Sword size={10} className="text-[#9F9EA1] transform -rotate-45" />
            </div>
            <span className="absolute -top-3 -right-3 transform rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Sparkles size={12} className="text-meme-pink" />
            </span>
          </div>
          
          <p className="text-muted-foreground text-sm mt-3 md:mt-0 flex items-center gap-1 group">
            Created with <Heart size={14} className="text-meme-pink fill-meme-pink animate-pulse group-hover:scale-125 transition-transform duration-300" /> by the <span className="bg-gradient-to-r from-meme-purple to-meme-orange bg-clip-text text-transparent font-medium">MemeSmith Crew</span>
          </p>
        </div>
        
        <div className="mt-6 border-t border-border/30 pt-4 flex flex-col md:flex-row justify-center items-center gap-4 text-xs text-muted-foreground/70">
          <Link to="/privacy" className="hover:text-meme-purple transition-colors duration-200">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-meme-purple transition-colors duration-200">Terms of Service</Link>
          <Link to="mailto:contact@memesmith.com" className="hover:text-meme-purple transition-colors duration-200">Contact Us</Link>
          <p>Meme responsibly!</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
