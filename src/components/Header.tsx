
import React from 'react';

const Header = () => {
  return (
    <header className="py-8 md:py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-meme-darkpurple/20 to-meme-pink/20 blur-3xl opacity-30 z-0"></div>
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-meme-purple to-meme-pink mb-3 animate-pulse">
              MemeSmith
            </h1>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-meme-purple to-meme-pink rounded-full opacity-70"></div>
          </div>
          <p className="text-xl md:text-2xl font-medium text-muted-foreground mt-4 max-w-md">
            <span className="text-meme-orange font-bold">Make It.</span> <span className="text-meme-blue font-bold">Meme It.</span> <span className="text-meme-pink font-bold">Share It.</span>
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
