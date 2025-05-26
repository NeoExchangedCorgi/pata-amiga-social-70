
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { postsApi, type Post } from '@/services/postsApi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useHiddenProfiles } from '@/hooks/useHiddenProfiles';
import { usePostsData } from './usePostsData';

export const usePostsManager = () => {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { isProfileHidden } = useHiddenProfiles();
  const { posts: allPosts, isLoading, refetch, setPosts } = usePostsData();

  // Filter posts from hidden profiles
  useEffect(() => {
    if (!user) {
      setFilteredPosts(allPosts);
      return;
    }

    const filtered = allPosts.filter(post => !isProfileHidden(post.author_id));
    setFilteredPosts(filtered);
  }, [allPosts, isProfileHidden, user]);

  const createPost = async (content: string, mediaUrl?: string, mediaType?: 'image' | 'video') => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um post",
        variant: "destructive",
      });
      return { error: 'Usuário não autenticado' };
    }

    setIsCreating(true);
    try {
      const result = await postsApi.createPost(content, mediaUrl, mediaType, user.id);
      if (!result.error) {
        await refetch();
        toast({
          title: "Post criado!",
          description: "Seu post foi publicado com sucesso.",
        });
      }
      return result;
    } catch (error) {
      console.error('Error creating post:', error);
      return { error: 'Erro interno do servidor' };
    } finally {
      setIsCreating(false);
    }
  };

  const deletePost = async (postId: string) => {
    if (!user) return false;

    // Optimistic update
    setPosts(prev => prev.filter(post => post.id !== postId));
    
    const success = await postsApi.deletePost(postId, user.id);
    if (!success) {
      await refetch(); // Restore on failure
    }
    return success;
  };

  const toggleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para curtir posts",
        variant: "destructive",
      });
      return;
    }

    try {
      const hasLiked = await postsApi.checkUserLike(postId, user.id);
      
      if (hasLiked) {
        await postsApi.removeLike(postId, user.id);
      } else {
        await postsApi.addLike(postId, user.id);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Set up realtime subscriptions
  useEffect(() => {
    const postsChannel = supabase
      .channel('posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        refetch();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, () => {
        refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
    };
  }, [refetch]);

  return {
    posts: filteredPosts,
    isLoading: isLoading || isCreating,
    createPost,
    deletePost,
    toggleLike,
    refetch,
  };
};
