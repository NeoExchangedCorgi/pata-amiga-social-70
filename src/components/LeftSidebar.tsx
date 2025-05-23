
import React from 'react';
import { Home, Bell, User, Heart, History, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const LeftSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Home', active: true, requiresAuth: false },
    { icon: Bell, label: 'Notificações', requiresAuth: true },
    { icon: User, label: 'Perfil', requiresAuth: true },
    { icon: Heart, label: 'Curtidas', requiresAuth: true },
    { icon: History, label: 'Histórico', requiresAuth: true },
  ];

  const handleItemClick = (item: any) => {
    if (item.requiresAuth) {
      alert('Você precisa fazer login para acessar esta área. Redirecionando para o cadastro...');
      navigate('/signup');
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <aside className="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background p-4 overflow-y-auto">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "secondary" : "ghost"}
            className={`w-full justify-start text-left h-12 text-foreground ${
              item.active 
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
