
import React from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import FooterBar from '@/components/FooterBar';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import { useSearchPosts } from '@/hooks/useSearchPosts';

const Search = () => {
  const { searchResults, isLoading, searchProfiles } = useSearchPosts();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <LeftSidebar />
        <main className="md:ml-64 min-h-screen bg-background pb-20 md:pb-0">
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold text-foreground mb-6">Pesquisar</h1>
            
            <SearchBar onSearch={searchProfiles} isLoading={isLoading} />
            <SearchResults results={searchResults} searchTerm="" isLoading={isLoading} />
          </div>
        </main>
      </div>
      
      <FooterBar />
    </div>
  );
};

export default Search;
