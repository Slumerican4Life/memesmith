
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-border py-4 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container px-4 mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-meme-purple to-meme-pink bg-clip-text text-transparent">
            MemeSmith
          </h1>
        </Link>
        
        <nav>
          <ul className="flex items-center gap-6">
            <li>
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Create
              </Link>
            </li>
            
            {user ? (
              <>
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
            ) : (
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
