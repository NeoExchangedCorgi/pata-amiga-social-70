
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useGlobalReports = () => {
  const [globalReportedPosts, setGlobalReportedPosts] = useState<Set<string>>(new Set());
  const [postReportCounts, setPostReportCounts] = useState<Map<string, number>>(new Map());
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchGlobalReports = async () => {
    if (!user) {
      setGlobalReportedPosts(new Set());
      setPostReportCounts(new Map());
      return;
    }

    try {
      // Buscar posts denunciados pelo usuário atual
      const { data: userReports, error: userReportsError } = await supabase
        .from('post_global_reports')
        .select('post_id')
        .eq('user_id', user.id);

      if (userReportsError) {
        console.error('Error fetching user global reports:', userReportsError);
        return;
      }

      const userReportedPostIds = new Set(userReports?.map(report => report.post_id) || []);
      setGlobalReportedPosts(userReportedPostIds);

      // Buscar contagem de denúncias para todos os posts
      const { data: allReports, error: allReportsError } = await supabase
        .from('post_global_reports')
        .select('post_id');

      if (allReportsError) {
        console.error('Error fetching all global reports:', allReportsError);
        return;
      }

      // Contar denúncias por post
      const counts = new Map<string, number>();
      allReports?.forEach(report => {
        const currentCount = counts.get(report.post_id) || 0;
        counts.set(report.post_id, currentCount + 1);
      });
      setPostReportCounts(counts);

    } catch (error) {
      console.error('Error fetching global reports:', error);
    }
  };

  const addGlobalReport = async (postId: string) => {
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
        .from('post_global_reports')
        .insert({
          user_id: user.id,
          post_id: postId,
        });

      if (error) {
        console.error('Error creating global report:', error);
        toast({
          title: "Erro",
          description: "Erro ao denunciar post",
          variant: "destructive",
        });
        return false;
      }

      // Atualizar estado local
      setGlobalReportedPosts(prev => new Set([...prev, postId]));
      setPostReportCounts(prev => {
        const newCounts = new Map(prev);
        const currentCount = newCounts.get(postId) || 0;
        newCounts.set(postId, currentCount + 1);
        return newCounts;
      });

      toast({
        title: "Post denunciado",
        description: "Obrigado por ajudar a manter a comunidade segura",
      });
      return true;
    } catch (error) {
      console.error('Error creating global report:', error);
      toast({
        title: "Erro",
        description: "Erro ao denunciar post",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeGlobalReport = async (postId: string) => {
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
        .from('post_global_reports')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', postId);

      if (error) {
        console.error('Error removing global report:', error);
        toast({
          title: "Erro",
          description: "Erro ao retirar denúncia",
          variant: "destructive",
        });
        return false;
      }

      // Atualizar estado local
      setGlobalReportedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });

      setPostReportCounts(prev => {
        const newCounts = new Map(prev);
        const currentCount = newCounts.get(postId) || 0;
        if (currentCount > 1) {
          newCounts.set(postId, currentCount - 1);
        } else {
          newCounts.delete(postId);
        }
        return newCounts;
      });

      toast({
        title: "Denúncia retirada",
        description: "Sua denúncia foi removida",
      });
      return true;
    } catch (error) {
      console.error('Error removing global report:', error);
      toast({
        title: "Erro",
        description: "Erro ao retirar denúncia",
        variant: "destructive",
      });
      return false;
    }
  };

  const isPostGloballyReported = (postId: string) => {
    return globalReportedPosts.has(postId);
  };

  const getPostReportCount = (postId: string) => {
    return postReportCounts.get(postId) || 0;
  };

  const isPostCensored = (postId: string) => {
    return getPostReportCount(postId) >= 1; // Censurado a partir da primeira denúncia
  };

  useEffect(() => {
    fetchGlobalReports();

    // Configurar realtime para denúncias globais
    const channel = supabase
      .channel('global-reports-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_global_reports'
        },
        () => {
          fetchGlobalReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    addGlobalReport,
    removeGlobalReport,
    isPostGloballyReported,
    getPostReportCount,
    isPostCensored,
    refreshGlobalReports: fetchGlobalReports,
  };
};
