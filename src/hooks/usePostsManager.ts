
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
      console.log('Fetching posts...');
      const data = await postsApi.fetchPosts();
      console.log('Posts fetched:', data);
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
    console.log('Creating post:', { content, mediaUrl, mediaType, userId: user.id });
    
    try {
      const result = await postsApi.createPost(content, mediaUrl, mediaType, user.id);
      if (!result.error) {
        console.log('Post created successfully:', result.data);
        toast({
          title: "Post criado!",
          description: "Seu post foi publicado com sucesso.",
        });
        
        // Refresh imediatamente após criar o post
        await fetchPosts();
      } else {
        console.error('Error creating post:', result.error);
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

    console.log('Deleting post:', postId);
    const success = await postsApi.deletePost(postId, user.id);
    if (!success) {
      toast({
        title: "Erro",
        description: "Erro ao deletar post",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Post deletado",
        description: "Post removido com sucesso",
      });
      // Refresh após deletar
      await fetchPosts();
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
      console.log('Toggling like for post:', postId);
      const hasLiked = await postsApi.checkUserLike(postId, user.id);
      
      if (hasLiked) {
        await postsApi.removeLike(postId, user.id);
      } else {
        await postsApi.addLike(postId, user.id);
      }
      
      // Não fazer refresh imediato para likes, deixar o realtime atualizar
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Erro",
        description: "Erro ao curtir post",
        variant: "destructive",
      });
    }
  };

  // Set up realtime subscriptions with comprehensive event handling
  useEffect(() => {
    fetchPosts();

    const postsChannel = supabase
      .channel('posts_realtime')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'posts' 
      }, (payload) => {
        console.log('New post inserted via realtime:', payload);
        fetchPosts(); // Refetch to get complete data with relations
      })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'posts' 
      }, (payload) => {
        console.log('Post updated via realtime:', payload);
        fetchPosts();
      })
      .on('postgres_changes', { 
        event: 'DELETE', 
        schema: 'public', 
        table: 'posts' 
      }, (payload) => {
        console.log('Post deleted via realtime:', payload);
        fetchPosts();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'post_likes' 
      }, (payload) => {
        console.log('Post likes changed via realtime:', payload);
        fetchPosts();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'comments' 
      }, (payload) => {
        console.log('Comments changed via realtime:', payload);
        fetchPosts();
      })
      .subscribe((status) => {
        console.log('Posts realtime subscription status:', status);
      });

    return () => {
      console.log('Removing posts channel');
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
