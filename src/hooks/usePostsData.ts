
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const usePostsData = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchPosts = async () => {
    // TODO: Implementar busca de posts com o novo banco
    console.log('Fetching posts - to be implemented with new database');
    setPosts([]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    isLoading,
    refetch: fetchPosts,
    setPosts,
  };
};
