
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { postsApi } from '@/services/postsApi';

export const usePostLike = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const toggleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para curtir posts",
        variant: "destructive",
      });
      return;
    }

    try {
      const hasLiked = await postsApi.checkUserLike(postId, user.id);
      
      if (hasLiked) {
        await postsApi.removeLike(postId, user.id);
      } else {
        await postsApi.addLike(postId, user.id);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return {
    toggleLike,
  };
};
