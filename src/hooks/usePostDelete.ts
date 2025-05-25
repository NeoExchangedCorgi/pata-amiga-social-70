
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { postsApi } from '@/services/postsApi';

export const usePostDelete = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const deletePost = async (postId: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para excluir posts",
        variant: "destructive",
      });
      return false;
    }

    console.log(`Tentando excluir post ${postId} do usuário ${user.id}`);

    try {
      const success = await postsApi.deletePost(postId, user.id);
      
      if (success) {
        toast({
          title: "Post excluído",
          description: "O post e todos os dados relacionados foram excluídos com sucesso",
        });
      } else {
        toast({
          title: "Erro",
          description: "Post não encontrado ou você não tem permissão para excluí-lo",
          variant: "destructive",
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao excluir post",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    deletePost,
  };
};
