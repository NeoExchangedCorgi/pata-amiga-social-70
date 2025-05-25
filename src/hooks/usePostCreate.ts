
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { postsApi } from '@/services/postsApi';

export const usePostCreate = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createPost = async (content: string, mediaUrl?: string, mediaType?: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um post",
        variant: "destructive",
      });
      return { error: 'Usuário não autenticado' };
    }

    setIsCreating(true);
    try {
      console.log('Creating post in API with:', { content, mediaUrl, mediaType, userId: user.id });
      const result = await postsApi.createPost(content, mediaUrl, mediaType, user.id);
      console.log('Post creation result:', result);
      return result;
    } catch (error) {
      console.error('Error creating post:', error);
      return { error: 'Erro interno do servidor' };
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createPost,
    isCreating,
  };
};
