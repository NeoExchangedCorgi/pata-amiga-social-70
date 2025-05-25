
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { postsApi, type Post } from '@/services/postsApi';
import { usePostCreate } from '@/hooks/usePostCreate';
import { usePostDelete } from '@/hooks/usePostDelete';
import { usePostLike } from '@/hooks/usePostLike';

export type { Post };

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { createPost: createPostApi, isCreating } = usePostCreate();
  const { deletePost: deletePostApi } = usePostDelete();
  const { toggleLike: toggleLikeApi } = usePostLike();

  const fetchPosts = async () => {
    try {
      const data = await postsApi.fetchPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (content: string, imageUrl?: string) => {
    const result = await createPostApi(content, imageUrl);
    if (!result.error) {
      await fetchPosts(); // Refresh posts after creation
    }
    return result;
  };

  const deletePost = async (postId: string) => {
    // Optimistically remove from UI
    setPosts(prev => prev.filter(post => post.id !== postId));
    
    const success = await deletePostApi(postId);
    if (!success) {
      // Restore posts if deletion failed
      await fetchPosts();
    }
    return success;
  };

  const toggleLike = async (postId: string) => {
    await toggleLikeApi(postId);
  };

  // Set up realtime subscriptions for automatic updates
  useEffect(() => {
    fetchPosts();

    // Listen for changes in posts
    const postsChannel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        (payload) => {
          console.log('Posts realtime event:', payload);
          fetchPosts();
        }
      )
      .subscribe();

    // Listen for changes in likes
    const likesChannel = supabase
      .channel('likes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_likes'
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    // Listen for changes in comments
    const commentsChannel = supabase
      .channel('comments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments'
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(likesChannel);
      supabase.removeChannel(commentsChannel);
    };
  }, []);

  return {
    posts,
    isLoading: isLoading || isCreating,
    createPost,
    deletePost,
    toggleLike,
    refetch: fetchPosts,
  };
};
