
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Considera que está no topo se scrollTop for 0
      setIsAtTop(scrollTop === 0);
      
      // Mostra o botão se a página foi rolada mais de 200px
      setIsVisible(scrollTop > 200);
    };

    window.addEventListener('scroll', toggleVisibility);
    
    // Checa a posição inicial
    toggleVisibility();

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    if (!isAtTop) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      disabled={isAtTop}
      className={`
        fixed bottom-24 right-6 z-50 h-12 w-12 rounded-full 
        bg-primary hover:bg-primary/90 text-primary-foreground
        shadow-lg transition-all duration-300 ease-in-out
        md:bottom-6 md:right-8 md:h-14 md:w-14
        ${isAtTop 
          ? 'opacity-50 cursor-not-allowed hover:bg-primary' 
          : 'opacity-100 hover:scale-110'
        }
      `}
      size="icon"
      aria-label="Voltar ao topo"
    >
      <ArrowUp className="h-5 w-5 md:h-6 md:w-6" />
    </Button>
  );
};

export default ScrollToTopButton;
