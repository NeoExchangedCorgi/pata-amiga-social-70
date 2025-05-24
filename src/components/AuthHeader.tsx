
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Home } from 'lucide-react';

interface AuthHeaderProps {
  title: string;
  showHomeButton?: boolean;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, showHomeButton = true }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        {showHomeButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-foreground hover:bg-foreground/10"
          >
            <Home className="h-5 w-5" />
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

      <div className="text-center space-y-4">
        <img 
          src={theme === 'dark' ? "/lovable-uploads/00b1e86b-2813-433a-9aea-d914e445fe0a.png" : "/lovable-uploads/93af301e-74f3-46b0-8935-2af2039cabcf.png"}
          alt="Paraíso dos Focinhos" 
          className="h-16 w-auto mx-auto"
        />
        <h1 className="text-2xl font-bold text-foreground">
          {title}
        </h1>
      </div>
    </>
  );
};

export default AuthHeader;
