
import React from 'react';
import { Moon, Sun, LogIn, User } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/signup');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img 
            src={theme === 'dark' ? "/lovable-uploads/00b1e86b-2813-433a-9aea-d914e445fe0a.png" : "/lovable-uploads/93af301e-74f3-46b0-8935-2af2039cabcf.png"}
            alt="Paraíso dos Focinhos" 
            className="h-10 w-auto"
          />
          <h1 className="text-2xl font-bold text-foreground">
            Pata Amiga
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isLoading && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 border-foreground/20 text-foreground hover:bg-foreground/10"
              onClick={handleAuthClick}
            >
              {isAuthenticated ? (
                <>
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{profile?.username || 'Usuário'}</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign in</span>
                </>
              )}
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-foreground hover:bg-foreground/10"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
