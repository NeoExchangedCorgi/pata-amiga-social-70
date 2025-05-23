
import React from 'react';
import { Home, Bell, User, Heart, History, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LeftSidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Bell, label: 'Notificações' },
    { icon: User, label: 'Perfil' },
    { icon: Heart, label: 'Curtidas' },
    { icon: History, label: 'Histórico' },
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background p-4 overflow-y-auto">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "secondary" : "ghost"}
            className={`w-full justify-start text-left h-12 ${
              item.active 
                ? 'bg-pata-yellow-light/20 dark:bg-pata-yellow-dark/20 text-pata-blue-light dark:text-pata-blue-dark' 
                : 'hover:bg-pata-yellow-light/10 dark:hover:bg-pata-yellow-dark/10'
            }`}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>
      
      <div className="mt-8 pt-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-left h-12 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default LeftSidebar;
