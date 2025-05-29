
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useReportedPostsData } from './useReportedPostsData';

export const useReportedPosts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { reportedPosts, isLoading, refetch } = useReportedPostsData();

  const reportPost = async (postId: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para denunciar posts",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('post_reports')
        .insert({
          user_id: user.id,
          post_id: postId,
        });

      if (error) {
        console.error('Error reporting post:', error);
        toast({
          title: "Erro",
          description: "Erro ao denunciar post",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Post denunciado",
        description: "O post foi denunciado e movido para a seção 'Denunciados'",
      });
      await refetch();
      return true;
    } catch (error) {
      console.error('Error reporting post:', error);
      toast({
        title: "Erro",
        description: "Erro ao denunciar post",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeReport = async (postId: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para retirar denúncias",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('post_reports')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', postId);

      if (error) {
        console.error('Error removing report:', error);
        toast({
          title: "Erro",
          description: "Erro ao retirar denúncia",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Denúncia retirada",
        description: "A denúncia foi removida",
      });
      await refetch();
      return true;
    } catch (error) {
      console.error('Error removing report:', error);
      toast({
        title: "Erro",
        description: "Erro ao retirar denúncia",
        variant: "destructive",
      });
      return false;
    }
  };

  const isPostReported = (postId: string) => {
    if (!user) return false;
    return reportedPosts.some(post => post.id === postId);
  };

  return {
    reportedPosts,
    isLoading,
    reportPost,
    removeReport,
    isPostReported,
    refetch,
  };
};
