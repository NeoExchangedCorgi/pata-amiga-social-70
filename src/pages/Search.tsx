
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import FooterBar from '@/components/FooterBar';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { useSearchPosts } from '@/hooks/useSearchPosts';

const Search = () => {
  const { theme } = useTheme();
  const { searchResults, isLoading, searchProfiles } = useSearchPosts();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <LeftSidebar />
        <main className="md:ml-64 min-h-screen bg-background pb-4 md:pb-0">
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold text-foreground mb-6">Pesquisar</h1>
            
            <SearchBar onSearch={searchProfiles} isLoading={isLoading} />
            <SearchResults results={searchResults} searchTerm="" isLoading={isLoading} />
          </div>
        </main>
      </div>
      
      {/* Footer com informações da ONG - com padding extra para dispositivos móveis */}
      <footer className="bg-muted border-t border-foreground/20 p-4 mt-8 mb-16 md:mb-0">
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
