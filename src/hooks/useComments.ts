
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
    if (!postId) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles!fk_comments_author_id (
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

    try {
      // Create optimistic comment
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        author_id: user.id,
        content,
        created_at: new Date().toISOString(),
        post_id: postId,
        profiles: {
          username: profile.username || '',
          full_name: profile.full_name || '',
          avatar_url: profile.avatar_url || undefined,
        }
      };

      // Add optimistic update
      setComments(prev => [...prev, optimisticComment]);

      const { data, error } = await supabase
        .from('comments')
        .insert({
          content,
          post_id: postId,
          author_id: user.id,
        })
        .select(`
          *,
          profiles!fk_comments_author_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) {
        // Remove optimistic comment on error
        setComments(prev => prev.filter(c => c.id !== optimisticComment.id));
        toast({
          title: "Erro",
          description: "Erro ao adicionar comentário",
          variant: "destructive",
        });
        return;
      }

      // Replace optimistic comment with real one
      setComments(prev => 
        prev.map(c => c.id === optimisticComment.id ? data : c)
      );

      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi publicado",
      });
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
        .channel(`comments-${postId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`
        }, (payload) => {
          console.log('New comment added:', payload);
          fetchComments();
        })
        .on('postgres_changes', {
          event: 'DELETE',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`
        }, (payload) => {
          console.log('Comment deleted:', payload);
          const deletedId = payload.old?.id;
          if (deletedId) {
            setComments(prev => prev.filter(c => c.id !== deletedId));
          }
        })
        .subscribe();

      return () => {
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
