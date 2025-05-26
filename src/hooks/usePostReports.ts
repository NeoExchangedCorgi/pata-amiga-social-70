
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const usePostReports = () => {
  const [reportedPosts, setReportedPosts] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchReportedPosts = async () => {
    if (!user) {
      setReportedPosts(new Set());
      return;
    }

    try {
      const { data, error } = await supabase
        .from('post_reports')
        .select('post_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching reported posts:', error);
        return;
      }

      const postIds = new Set(data?.map(report => report.post_id) || []);
      setReportedPosts(postIds);
    } catch (error) {
      console.error('Error fetching reported posts:', error);
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

      // Atualizar estado local imediatamente
      setReportedPosts(prev => new Set([...prev, postId]));
      
      toast({
        title: "Post denunciado",
        description: "O post foi denunciado e será borrado para você",
      });
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

      // Atualizar estado local imediatamente
      setReportedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });

      toast({
        title: "Denúncia retirada",
        description: "A denúncia foi removida e o post voltará a aparecer",
      });
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
    return reportedPosts.has(postId);
  };

  // Função para forçar atualização do cache
  const refreshReports = () => {
    fetchReportedPosts();
  };

  useEffect(() => {
    fetchReportedPosts();

    // Configurar realtime para denúncias
    const channel = supabase
      .channel('reports-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_reports',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchReportedPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    reportPost,
    removeReport,
    isPostReported,
    reportedPosts,
    refreshReports,
  };
};
