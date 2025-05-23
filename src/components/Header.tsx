
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <img 
            src="/lovable-uploads/93af301e-74f3-46b0-8935-2af2039cabcf.png" 
            alt="Paraíso dos Focinhos" 
            className="h-10 w-auto"
          />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pata-yellow-light to-pata-blue-light dark:from-pata-yellow-dark dark:to-pata-blue-dark bg-clip-text text-transparent">
            Pata Amiga
          </h1>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-pata-blue-light dark:text-pata-blue-dark hover:bg-pata-yellow-light/20 dark:hover:bg-pata-yellow-dark/20"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
};

export default Header;
