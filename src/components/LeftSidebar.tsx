
import React from 'react';
import { Home, Bell, User, Heart, History, LogOut, EyeOff, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { toast } = useToast();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/', active: true, requiresAuth: false },
    { icon: Bell, label: 'Notificações', path: '/notifications', requiresAuth: true },
    { icon: User, label: 'Perfil', path: '/profile', requiresAuth: true },
    { icon: Heart, label: 'Curtidas', path: '/likes', requiresAuth: true },
    { icon: Bookmark, label: 'Marcações', path: '/marcacoes', requiresAuth: true },
    { icon: History, label: 'Histórico', path: '/history', requiresAuth: true },
    { icon: EyeOff, label: 'Ocultos', path: '/hidden-profiles', requiresAuth: true },
  ];

  const handleItemClick = (item: any) => {
    if (item.requiresAuth && !isAuthenticated) {
      toast({
        title: "Acesso negado",
        description: "Você precisa fazer login para acessar esta área. Redirecionando para o cadastro...",
        variant: "destructive",
        className: "bg-red-500 text-white border-red-600",
      });
      navigate('/signup');
    } else {
      navigate(item.path);
    }
  };

  const handleLogout = () => {
    if (isAuthenticated) {
      logout();
    }
    navigate('/login');
  };

  return (
    <aside className="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background p-4 overflow-y-auto">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.label}
            variant={window.location.pathname === item.path ? "secondary" : "ghost"}
            className={`w-full justify-start text-left h-12 text-foreground ${
              window.location.pathname === item.path 
                ? 'bg-foreground/10' 
                : 'hover:bg-foreground/5'
            }`}
            onClick={() => handleItemClick(item)}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>
      
      <div className="mt-8 pt-4 border-t border-foreground/20">
        <Button
          variant="ghost"
          className="w-full justify-start text-left h-12 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default LeftSidebar;
