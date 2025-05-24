
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  username: string;
  full_name: string;
  bio?: string;
  created_at: string;
  avatar_url?: string;
}

export const useSearchPosts = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchProfiles = async (searchTerm: string) => {
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

  return {
    searchResults,
    isLoading,
    searchProfiles,
  };
};
