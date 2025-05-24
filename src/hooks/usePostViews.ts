
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Post } from '@/hooks/usePosts';

interface PostView {
  id: string;
  post_id: string;
  viewed_at: string;
  is_pinned: boolean;
  posts: Post;
}

export const usePostViews = () => {
  const [viewedPosts, setViewedPosts] = useState<PostView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchViewedPosts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('post_views')
        .select(`
          *,
          posts (
            *,
            profiles (
              id,
              username,
              full_name,
              avatar_url
            ),
            post_likes (
              user_id
            ),
            comments (
              id
            )
          )
        `)
        .eq('user_id', user.id)
        .order('is_pinned', { ascending: false })
        .order('viewed_at', { ascending: false });

      if (error) {
        console.error('Error fetching viewed posts:', error);
        return;
      }

      setViewedPosts(data || []);
    } catch (error) {
      console.error('Error fetching viewed posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addPostView = async (postId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('post_views')
        .upsert({
          user_id: user.id,
          post_id: postId,
          viewed_at: new Date().toISOString(),
        });
    } catch (error) {
      console.error('Error adding post view:', error);
    }
  };

  const togglePinPost = async (postId: string) => {
    if (!user) return;

    try {
      const existingView = viewedPosts.find(view => view.post_id === postId);
      
      if (existingView) {
        const { error } = await supabase
          .from('post_views')
          .update({ is_pinned: !existingView.is_pinned })
          .eq('id', existingView.id);

        if (!error) {
          fetchViewedPosts();
        }
      } else {
        await supabase
          .from('post_views')
          .insert({
            user_id: user.id,
            post_id: postId,
            is_pinned: true,
          });
        fetchViewedPosts();
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const removeFromHistory = async (postId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('post_views')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', postId);

      if (!error) {
        fetchViewedPosts();
      }
    } catch (error) {
      console.error('Error removing from history:', error);
    }
  };

  useEffect(() => {
    fetchViewedPosts();
  }, [user]);

  return {
    viewedPosts,
    isLoading,
    addPostView,
    togglePinPost,
    removeFromHistory,
    refetch: fetchViewedPosts,
  };
};
