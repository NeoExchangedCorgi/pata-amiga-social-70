
import React, { useState } from 'react';
import { Home, Bell, User, Heart, History, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';

const FooterBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      setIsOpen(false);
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  const handleItemClick = (label: string, requiresAuth: boolean = false, path?: string, action?: () => void) => {
    if (action) {
      action();
      return;
    }

    if (requiresAuth && !isAuthenticated) {
      toast({
        title: "Acesso negado",
        description: "Você precisa fazer login para acessar esta área. Redirecionando para o cadastro...",
        variant: "destructive",
        className: "bg-red-500 text-white border-red-600",
      });
      navigate('/signup');
      setIsOpen(false);
      return;
    }
    
    if (path) {
      navigate(path);
      setIsOpen(false);
    }
  };

  const menuItems = [
    { icon: Bell, label: 'Notificações', path: '/notifications', requiresAuth: true },
    { icon: User, label: 'Perfil', path: '/profile', requiresAuth: true },
    { icon: Heart, label: 'Curtidas', path: '/likes', requiresAuth: true },
    { icon: History, label: 'Histórico', path: '/history', requiresAuth: true },
    ...(isAuthenticated ? [{ icon: LogOut, label: 'Logout', action: handleLogout, requiresAuth: false }] : [])
  ];

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-foreground/20 p-2 z-50">
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center space-y-1 h-auto py-2 px-2 text-foreground hover:bg-foreground/10"
          onClick={() => handleItemClick('Home', false, '/')}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </Button>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 h-auto py-2 px-2 text-foreground hover:bg-foreground/10"
            >
              <Menu className="h-5 w-5" />
              <span className="text-xs">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-2 mt-6">
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className={`justify-start text-left h-12 ${
                    item.label === 'Logout' ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : ''
                  }`}
                  onClick={() => handleItemClick(
                    item.label, 
                    item.requiresAuth, 
                    'path' in item ? item.path : undefined, 
                    'action' in item ? item.action : undefined
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </footer>
  );
};

export default FooterBar;
