
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Post } from '@/hooks/usePosts';

interface SavedPost {
  id: string;
  post_id: string;
  saved_at: string;
  posts: Post;
}

export const useSavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSavedPosts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('saved_posts')
        .select(`
          *,
          posts!fk_saved_posts_post_id (
            *,
            profiles!fk_posts_author_id (
              id,
              username,
              full_name,
              avatar_url
            ),
            post_likes!fk_post_likes_post_id (
              user_id
            ),
            comments!fk_comments_post_id (
              id
            )
          )
        `)
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved posts:', error);
        return;
      }

      setSavedPosts(data || []);
    } catch (error) {
      console.error('Error fetching saved posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSavePost = async (postId: string) => {
    if (!user) return;

    try {
      const existingSave = savedPosts.find(save => save.post_id === postId);
      
      if (existingSave) {
        // Optimistic update - remove immediately
        setSavedPosts(prev => prev.filter(save => save.id !== existingSave.id));
        
        const { error } = await supabase
          .from('saved_posts')
          .delete()
          .eq('id', existingSave.id);

        if (error) {
          // Revert on error
          await fetchSavedPosts();
          toast({
            title: "Erro",
            description: "Erro ao remover post dos salvos",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Post removido",
            description: "Post removido dos salvos",
          });
        }
      } else {
        const { data, error } = await supabase
          .from('saved_posts')
          .insert({
            user_id: user.id,
            post_id: postId,
          })
          .select(`
            *,
            posts!fk_saved_posts_post_id (
              *,
              profiles!fk_posts_author_id (
                id,
                username,
                full_name,
                avatar_url
              ),
              post_likes!fk_post_likes_post_id (
                user_id
              ),
              comments!fk_comments_post_id (
                id
              )
            )
          `)
          .single();

        if (!error && data) {
          // Optimistic update - add immediately
          setSavedPosts(prev => [data, ...prev]);
          toast({
            title: "Post salvo",
            description: "Post adicionado aos salvos",
          });
        } else {
          toast({
            title: "Erro",
            description: "Erro ao salvar post",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar solicitação",
        variant: "destructive",
      });
    }
  };

  const isPostSaved = (postId: string) => {
    return savedPosts.some(save => save.post_id === postId);
  };

  // Set up realtime subscriptions
  useEffect(() => {
    if (user) {
      fetchSavedPosts();

      const channel = supabase
        .channel('saved-posts-realtime')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'saved_posts',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          console.log('Saved posts changed:', payload);
          fetchSavedPosts();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    savedPosts,
    isLoading,
    toggleSavePost,
    isPostSaved,
    refetch: fetchSavedPosts,
  };
};
