
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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

  const fetchLikedPosts = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
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
        return;
      }

      // Filtrar posts que ainda existem
      const validLikedPosts = (data || []).filter(like => like.posts);
      setLikedPosts(validLikedPosts);
    } catch (error) {
      console.error('Error fetching liked posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedPosts();
  }, [user]);

  return {
    likedPosts,
    isLoading,
    refetch: fetchLikedPosts,
  };
};
