
import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import FooterBar from '@/components/FooterBar';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, User, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  username: string;
  full_name: string;
  bio?: string;
  created_at: string;
  avatar_url?: string;
}

const Search = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, bio, created_at, avatar_url')
        .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
        .limit(10);

      if (error) {
        console.error('Error searching profiles:', error);
        return;
      }

      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileClick = (username: string) => {
    navigate(`/user/${username}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <LeftSidebar />
        <main className="md:ml-64 min-h-screen bg-background pb-32 md:pb-0">
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold text-foreground mb-6">Pesquisar</h1>
            
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Procurar perfis..." 
                  className="pl-10 bg-muted/50 border-foreground/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} className="bg-primary text-primary-foreground" disabled={isLoading}>
                {isLoading ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>

            <div className="space-y-4">
              {searchResults.length === 0 && searchTerm && !isLoading && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum perfil encontrado para "{searchTerm}"</p>
                </div>
              )}
              
              {searchResults.map((user) => (
                <Card 
                  key={user.id} 
                  className="border-foreground/20 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleProfileClick(user.username)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.avatar_url ? (
                          <img 
                            src={user.avatar_url} 
                            alt={user.full_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          user.full_name.charAt(0)
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{user.full_name}</h3>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                        {user.bio && (
                          <p className="text-sm text-foreground mt-1">{user.bio}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Membro desde {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
      
      {/* Footer com informações da ONG */}
      <footer className="bg-muted border-t border-foreground/20 p-4 mt-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <img 
              src={theme === 'dark' ? "/lovable-uploads/00b1e86b-2813-433a-9aea-d914e445fe0a.png" : "/lovable-uploads/93af301e-74f3-46b0-8935-2af2039cabcf.png"}
              alt="Paraíso dos Focinhos" 
              className="h-12 w-auto"
            />
            <div>
              <h3 className="font-bold text-foreground">Paraíso dos Focinhos</h3>
              <p className="text-sm text-muted-foreground">
                ONG sem fins lucrativos dedicada ao resgate e cuidado de animais
              </p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-foreground">
              <Phone className="h-4 w-4" />
              <span>(21) 97609-0612</span>
            </div>
            
            <div className="flex items-center space-x-2 text-foreground">
              <Mail className="h-4 w-4" />
              <span>contato@paraisodosfocinhos.com.br</span>
            </div>
          </div>

          <div className="flex space-x-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-foreground/20 text-foreground hover:bg-foreground/10"
              onClick={() => window.open('https://www.paraisodosfocinhos.com.br/', '_blank')}
            >
              Site Oficial
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="border-foreground/20 text-foreground hover:bg-foreground/10"
              onClick={() => window.open('https://www.facebook.com/ongparaisodosfocinhos/', '_blank')}
            >
              <Facebook className="mr-2 h-4 w-4" />
              Facebook
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="border-foreground/20 text-foreground hover:bg-foreground/10"
              onClick={() => window.open('https://www.instagram.com/ongparaisodosfocinhos/', '_blank')}
            >
              <Instagram className="mr-2 h-4 w-4" />
              Instagram
            </Button>
          </div>
        </div>
      </footer>
      
      <FooterBar />
    </div>
  );
};

export default Search;
