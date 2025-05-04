
import React from 'react';
import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="py-10 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-meme-darkpurple/30 via-meme-purple/20 to-meme-pink/30 blur-3xl opacity-40 z-0 animate-pulse"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-12 left-8 w-24 h-24 bg-meme-orange/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-8 right-12 w-32 h-32 bg-meme-blue/10 rounded-full blur-xl"></div>
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative group">
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-meme-purple via-meme-pink to-meme-orange mb-3 animate-pulse">
              MemeSmith
            </h1>
            <span className="absolute -top-6 -right-6 transform rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Sparkles className="text-meme-orange w-6 h-6" />
            </span>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-3/4 h-1.5 bg-gradient-to-r from-meme-blue via-meme-purple to-meme-pink rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-pulse"></div>
          </div>
          <p className="text-xl md:text-2xl font-medium mt-6 max-w-lg">
            <span className="text-meme-orange font-bold relative">
              Make It.
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-meme-orange/40 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </span>{" "}
            <span className="text-meme-blue font-bold relative ml-2">
              Meme It.
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-meme-blue/40 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left delay-100"></span>  
            </span>{" "}
            <span className="text-meme-pink font-bold relative ml-2">
              Share It.
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-meme-pink/40 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left delay-200"></span>
            </span>
          </p>
          <div className="mt-6 max-w-md text-muted-foreground text-sm px-4 py-2 bg-gradient-to-r from-meme-purple/5 to-meme-pink/5 rounded-md backdrop-blur-sm">
            Create professional-quality memes in seconds with our powerful yet simple editor.
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
