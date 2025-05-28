
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Post } from '@/hooks/usePosts';

interface LikedPost {
  id: string;
  post_id: string;
  created_at: string;
  posts: Post;
}

export const useLikedPosts = () => {
  const [likedPosts, setLikedPosts] = useState<LikedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchLikedPosts = async () => {
    if (!user) {
      setLikedPosts([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select(`
          *,
          posts!fk_post_likes_post_id (
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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching liked posts:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar posts curtidos",
          variant: "destructive",
        });
        return;
      }

      setLikedPosts(data || []);
    } catch (error) {
      console.error('Error fetching liked posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para curtir posts",
        variant: "destructive",
      });
      return false;
    }

    try {
      const existingLike = likedPosts.find(like => like.post_id === postId);
      
      if (existingLike) {
        // Remove like
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error removing like:', error);
          return false;
        }

        setLikedPosts(prev => prev.filter(like => like.post_id !== postId));
        return false; // unliked
      } else {
        // Add like
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id,
          });

        if (error) {
          console.error('Error adding like:', error);
          return false;
        }

        await fetchLikedPosts(); // Refresh to get the complete data
        return true; // liked
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      return false;
    }
  };

  const isPostLiked = (postId: string) => {
    return likedPosts.some(like => like.post_id === postId);
  };

  useEffect(() => {
    fetchLikedPosts();
  }, [user]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('liked_posts_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'post_likes',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchLikedPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    likedPosts,
    isLoading,
    toggleLike,
    isPostLiked,
    refetch: fetchLikedPosts,
  };
};
