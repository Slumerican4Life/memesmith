
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-6 border-t border-border">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} MemeSmith. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm mt-2 md:mt-0">
            Created with 💜 by the MemeSmith Crew
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
