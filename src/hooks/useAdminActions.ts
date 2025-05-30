
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { postsApi } from '@/services/postsApi';

export const useAdminActions = () => {
  const { isAdmin, deleteUserProfile } = useAuth();
  const { toast } = useToast();

  const deletePost = async (postId: string) => {
    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para executar esta ação",
        variant: "destructive",
      });
      return false;
    }

    try {
      const success = await postsApi.deletePost(postId, 'admin');
      if (success) {
        toast({
          title: "Post excluído",
          description: "O post foi excluído permanentemente",
        });
        return true;
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível excluir o post",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro interno do servidor",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteUser = async (userId: string) => {
    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para executar esta ação",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await deleteUserProfile(userId);
      if (!error) {
        toast({
          title: "Usuário excluído",
          description: "O usuário foi excluído permanentemente",
        });
        return true;
      } else {
        toast({
          title: "Erro",
          description: error,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro interno do servidor",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    isAdmin,
    deletePost,
    deleteUser,
  };
};
