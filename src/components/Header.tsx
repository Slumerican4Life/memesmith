
import React from 'react';

const Header = () => {
  return (
    <header className="py-6 md:py-8">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-meme-purple to-meme-pink mb-2">
            SlumMemes
          </h1>
          <p className="text-xl md:text-2xl font-medium text-muted-foreground">
            Make It. Meme It. Share It.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
