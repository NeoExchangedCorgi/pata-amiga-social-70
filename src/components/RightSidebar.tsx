
import React from 'react';
import { Search, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const RightSidebar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSearchClick = () => {
    if (!isAuthenticated) {
      alert('Você precisa fazer login para pesquisar perfis. Redirecionando para o cadastro...');
      navigate('/signup');
    } else {
      navigate('/search');
    }
  };

  return (
    <aside className="hidden lg:block fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 border-l border-foreground/20 bg-background p-4 overflow-y-auto">
      <div className="space-y-4">
        {/* Barra de Pesquisa */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Procurar perfis..." 
            className="pl-10 bg-muted/50 border-foreground/20"
            onClick={handleSearchClick}
            readOnly
          />
        </div>

        {/* Informações da ONG */}
        <Card className="border-foreground/20">
          <CardHeader>
            <CardTitle className="text-foreground">
              Paraíso dos Focinhos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              ONG sem fins lucrativos, fundada em 2011, dedicada ao resgate, proteção e cuidado de animais de rua no Rio de Janeiro.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-foreground">
                <Phone className="h-4 w-4" />
                <span>(21) 97609-0612</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-foreground">
                <Mail className="h-4 w-4" />
                <span className="break-all">contato@paraisodosfocinhos.com.br</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start border-foreground/20 text-foreground hover:bg-foreground/10"
                onClick={() => window.open('https://www.paraisodosfocinhos.com.br/', '_blank')}
              >
                Site Oficial
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start border-foreground/20 text-foreground hover:bg-foreground/10"
                onClick={() => window.open('https://www.facebook.com/ongparaisodosfocinhos/', '_blank')}
              >
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start border-foreground/20 text-foreground hover:bg-foreground/10"
                onClick={() => window.open('https://www.instagram.com/ongparaisodosfocinhos/', '_blank')}
              >
                <Instagram className="mr-2 h-4 w-4" />
                Instagram
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
};

export default RightSidebar;
