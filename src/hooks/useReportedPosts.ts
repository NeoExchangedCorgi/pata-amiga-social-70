
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Post } from '@/hooks/usePosts';

interface ReportedPost {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
  posts: Post;
}

export const useReportedPosts = () => {
  const [reportedPosts, setReportedPosts] = useState<ReportedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchReportedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('post_reports')
        .select(`
          *,
          posts!fk_post_reports_post_id (
            *,
            profiles!fk_posts_author_id (
              id,
              username,
              full_name,
              avatar_url
            ),
            post_likes!fk_post_likes_post_id (
              user_id
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reported posts:', error);
        return;
      }

      setReportedPosts(data || []);
    } catch (error) {
      console.error('Error fetching reported posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      await fetchReportedPosts();
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
      await fetchReportedPosts();
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
    return reportedPosts.some(report => report.post_id === postId && report.user_id === user.id);
  };

  useEffect(() => {
    fetchReportedPosts();
  }, []);

  return {
    reportedPosts,
    isLoading,
    reportPost,
    removeReport,
    isPostReported,
    refetch: fetchReportedPosts,
  };
};
