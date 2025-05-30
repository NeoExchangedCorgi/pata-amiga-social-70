
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
    if (!user) {
      setSavedPosts([]);
      setIsLoading(false);
      return;
    }

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
              avatar_url,
              user_type
            ),
            post_likes!fk_post_likes_post_id (
              user_id
            )
          )
        `)
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved posts:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar posts marcados",
          variant: "destructive",
        });
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
    if (!user) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para marcar posts",
        variant: "destructive",
      });
      return false;
    }

    try {
      const existingSave = savedPosts.find(save => save.post_id === postId);
      
      if (existingSave) {
        // Remove save
        const { error } = await supabase
          .from('saved_posts')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error removing save:', error);
          return false;
        }

        setSavedPosts(prev => prev.filter(save => save.post_id !== postId));
        toast({
          title: "Post desmarcado",
          description: "O post foi removido das suas marcações",
        });
        return false; // unsaved
      } else {
        // Add save
        const { error } = await supabase
          .from('saved_posts')
          .insert({
            post_id: postId,
            user_id: user.id,
          });

        if (error) {
          console.error('Error adding save:', error);
          return false;
        }

        await fetchSavedPosts(); // Refresh to get the complete data
        toast({
          title: "Post marcado",
          description: "O post foi adicionado às suas marcações",
        });
        return true; // saved
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      return false;
    }
  };

  const isPostSaved = (postId: string) => {
    return savedPosts.some(save => save.post_id === postId);
  };

  useEffect(() => {
    fetchSavedPosts();
  }, [user]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('saved_posts_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'saved_posts',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchSavedPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    savedPosts,
    isLoading,
    toggleSavePost,
    isPostSaved,
    refetch: fetchSavedPosts,
  };
};
