
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
  post_id: string;
  profiles: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const fetchComments = async () => {
    if (!postId) {
      setIsLoading(false);
      return;
    }

    console.log('Fetching comments for post:', postId);

    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles!comments_author_id_fkey (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return;
      }

      console.log('Comments fetched successfully:', data);
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async (content: string) => {
    if (!user || !profile) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para comentar",
        variant: "destructive",
      });
      return;
    }

    console.log('Adding comment:', { content, postId, userId: user.id });

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          content,
          post_id: postId,
          author_id: user.id,
        })
        .select(`
          *,
          profiles!comments_author_id_fkey (
            username,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) {
        console.error('Error adding comment:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar comentário",
          variant: "destructive",
        });
        return;
      }

      console.log('Comment added successfully:', data);

      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi publicado",
      });

      // Fazer refresh para garantir sincronização
      await fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar comentário",
        variant: "destructive",
      });
    }
  };

  // Set up realtime subscriptions
  useEffect(() => {
    if (postId) {
      fetchComments();

      const channel = supabase
        .channel(`comments_for_post_${postId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`
        }, (payload) => {
          console.log('Comment realtime event:', payload);
          fetchComments(); // Refetch to get complete data with joins
        })
        .subscribe((status) => {
          console.log('Comments subscription status:', status);
        });

      return () => {
        console.log('Removing comments channel');
        supabase.removeChannel(channel);
      };
    }
  }, [postId]);

  return {
    comments,
    isLoading,
    addComment,
    refetch: fetchComments,
  };
};
