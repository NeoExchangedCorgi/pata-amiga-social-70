
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { postsApi, type Post } from '@/services/postsApi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useHiddenProfiles } from '@/hooks/useHiddenProfiles';

export const usePostsManager = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { isProfileHidden } = useHiddenProfiles();

  const fetchPosts = async () => {
    try {
      const data = await postsApi.fetchPosts();
      setAllPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar posts. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar posts de perfis ocultos
  useEffect(() => {
    if (!user) {
      setPosts(allPosts);
      return;
    }

    const filteredPosts = allPosts.filter(post => !isProfileHidden(post.author_id));
    setPosts(filteredPosts);
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
        await fetchPosts();
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
    setAllPosts(prev => prev.filter(post => post.id !== postId));
    
    const success = await postsApi.deletePost(postId, user.id);
    if (!success) {
      await fetchPosts(); // Restore on failure
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
    fetchPosts();

    const postsChannel = supabase
      .channel('posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, () => {
        fetchPosts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
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
