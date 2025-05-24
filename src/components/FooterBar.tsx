
import React from 'react';
import { Home, Bell, User, Heart, History, Search, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const FooterBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleItemClick = (label: string, requiresAuth: boolean = false, path?: string) => {
    if (requiresAuth && !isAuthenticated) {
      alert('Você precisa fazer login para acessar esta área. Redirecionando para o cadastro...');
      navigate('/signup');
      return;
    }
    
    if (label === 'Pesquisa') {
      if (!isAuthenticated) {
        alert('Você precisa fazer login para pesquisar perfis. Redirecionando para o cadastro...');
        navigate('/signup');
      } else {
        navigate('/search');
      }
      return;
    }
    
    if (label === 'Info') {
      navigate('/ong-info');
      return;
    }

    if (path) {
      navigate(path);
    }
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/', requiresAuth: false },
    { icon: Bell, label: 'Notificações', path: '/notifications', requiresAuth: true },
    { icon: User, label: 'Perfil', path: '/profile', requiresAuth: true },
    { icon: Heart, label: 'Curtidas', path: '/likes', requiresAuth: true },
    { icon: History, label: 'Histórico', path: '/history', requiresAuth: true },
    { icon: Search, label: 'Pesquisa', requiresAuth: false },
    { icon: Info, label: 'Info', requiresAuth: false },
  ];

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-foreground/20 p-2 z-50">
      <div className="flex justify-around items-center">
        {menuItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1 h-auto py-2 px-2 text-foreground hover:bg-foreground/10"
            onClick={() => handleItemClick(item.label, item.requiresAuth, item.path)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </footer>
  );
};

export default FooterBar;
