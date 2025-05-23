
import React from 'react';
import { Home, Bell, User, Heart, History, Search, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FooterBar = () => {
  const handleItemClick = (label: string, requiresAuth: boolean = false) => {
    if (requiresAuth) {
      alert('Você precisa fazer login para acessar esta área. Redirecionando para o cadastro...');
      // Aqui seria o redirecionamento para a tela de login/cadastro
      return;
    }
    
    if (label === 'Pesquisa') {
      alert('Você precisa fazer login para pesquisar perfis. Redirecionando para o cadastro...');
      return;
    }
    
    if (label === 'Info') {
      // Aqui seria a navegação para a tela de informações da ONG
      console.log('Navegando para informações da ONG');
    }
  };

  const menuItems = [
    { icon: Home, label: 'Home', requiresAuth: false },
    { icon: Bell, label: 'Notificações', requiresAuth: true },
    { icon: User, label: 'Perfil', requiresAuth: true },
    { icon: Heart, label: 'Curtidas', requiresAuth: true },
    { icon: History, label: 'Histórico', requiresAuth: true },
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
            onClick={() => handleItemClick(item.label, item.requiresAuth)}
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
