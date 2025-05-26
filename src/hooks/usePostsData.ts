
import { useState, useEffect } from 'react';
import { postsApi, type Post } from '@/services/postsApi';
import { useToast } from '@/hooks/use-toast';

export const usePostsData = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      const data = await postsApi.fetchPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar posts. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
