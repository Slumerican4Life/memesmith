
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Award, Flame, Sword, Image, Compass } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProBadge from './ProBadge';
import ViewToggle from './ViewToggle';

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b border-border py-4 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container px-4 mx-auto flex justify-between items-center">
        <Link to="/" className="flex flex-col items-center">
          {/* Logo container with fire effect and title */}
          <div className="relative group">
            {/* Fire effect behind the text */}
            <div className="absolute -inset-1 -z-10 flex">
              <div className="w-full h-10 bg-gradient-to-t from-meme-orange via-[#ea384c] to-[#f97316]/80 blur-sm"></div>
              <Flame className="absolute -top-2 left-0 h-7 w-7 text-[#ea384c] animate-pulse" />
              <Flame className="absolute -top-3 left-6 h-6 w-6 text-[#f97316] animate-pulse-subtle" />
              <Flame className="absolute -top-2 right-3 h-5 w-5 text-[#ea384c] animate-pulse" />
            </div>
            
            {/* MemeSmith title */}
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-white to-[#f3f3f3] bg-clip-text text-transparent relative z-10">
              MemeSmith
            </h1>
            
            {/* Embers/particles effect */}
            <div className="absolute top-0 left-1/4 h-1 w-1 bg-[#ffafbd] rounded-full animate-ping"></div>
            <div className="absolute top-1 right-1/3 h-1 w-1 bg-[#ffc3a0] rounded-full animate-ping delay-700"></div>
          </div>
          
          {/* Sword element underneath */}
          <div className="relative mt-1 w-full flex justify-center items-center">
            <div className="h-[3px] w-full bg-gradient-to-r from-[#9F9EA1]/30 via-[#eee] to-[#9F9EA1]/30 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse-subtle"></div>
            </div>
            <Sword className="absolute -right-3 h-4 w-4 text-[#ccc] transform -rotate-45" />
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[7px] font-mono text-[#ccc] tracking-widest uppercase opacity-70">
              MemeSmith
            </div>
          </div>
        </Link>
        
        <div className="hidden sm:block">
          <ViewToggle />
        </div>
        
        <nav>
          <ul className="flex items-center gap-6">
            <li>
              <Link 
                to="/" 
                className={`${isActive('/') ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors flex items-center gap-1`}
              >
                Create
              </Link>
            </li>
            
            <li>
              <Link 
                to="/explore" 
                className={`${isActive('/explore') ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors flex items-center gap-1`}
              >
                <Compass className="w-4 h-4" />
                Explore
              </Link>
            </li>
            
            {user && (
              <li>
                <Link 
                  to="/my-memes" 
                  className={`${isActive('/my-memes') ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors flex items-center gap-1`}
                >
                  <Image className="w-4 w-4" />
                  My Memes
                </Link>
              </li>
            )}
            
            {!user && (
              <li>
                <Link to="/upgrade" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pro
                </Link>
              </li>
            )}
            
            {user && (
              <>
                {profile?.is_pro ? (
                  <li className="hidden sm:flex">
                    <ProBadge size="sm" />
                  </li>
                ) : (
                  <li>
                    <Link 
                      to="/upgrade" 
                      className="text-meme-purple hover:text-meme-purple/80 font-medium transition-colors flex items-center"
                    >
                      <Award className="w-4 h-4 mr-1" />
                      Upgrade
                    </Link>
                  </li>
                )}
                
                <li>
                  <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                    Profile
                  </Link>
                </li>
                <li>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hidden sm:flex items-center gap-2"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </li>
              </>
            )}
            
            {!user && (
              <li>
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                  className="hidden sm:flex items-center gap-2"
                >
                  <Link to="/auth/login">
                    <User className="w-4 h-4" />
                    Sign In
                  </Link>
                </Button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
