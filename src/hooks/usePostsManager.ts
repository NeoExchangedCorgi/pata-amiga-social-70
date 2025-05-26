
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
      console.log('PostsManager: Fetching posts...');
      setIsLoading(true);
      const data = await postsApi.fetchPosts();
      console.log('PostsManager: Posts fetched:', data);
      setAllPosts(data);
    } catch (error) {
      console.error('PostsManager: Error fetching posts:', error);
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
    console.log('PostsManager: Creating post:', { content, mediaUrl, mediaType, userId: user.id });
    
    try {
      const result = await postsApi.createPost(content, mediaUrl, mediaType, user.id);
      if (!result.error) {
        console.log('PostsManager: Post created successfully:', result.data);
        toast({
          title: "Post criado!",
          description: "Seu post foi publicado com sucesso.",
        });
        
        // Refresh imediatamente após criar o post
        await fetchPosts();
      } else {
        console.error('PostsManager: Error creating post:', result.error);
        toast({
          title: "Erro",
          description: "Erro ao criar post",
          variant: "destructive",
        });
      }
      return result;
    } catch (error) {
      console.error('PostsManager: Error creating post:', error);
      toast({
        title: "Erro",
        description: "Erro interno do servidor",
        variant: "destructive",
      });
      return { error: 'Erro interno do servidor' };
    } finally {
      setIsCreating(false);
    }
  };

  const deletePost = async (postId: string) => {
    if (!user) return false;

    console.log('PostsManager: Deleting post:', postId);
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
      console.log('PostsManager: Toggling like for post:', postId);
      const hasLiked = await postsApi.checkUserLike(postId, user.id);
      
      if (hasLiked) {
        await postsApi.removeLike(postId, user.id);
      } else {
        await postsApi.addLike(postId, user.id);
      }
      
      // Refresh para atualizar contagem de likes
      await fetchPosts();
    } catch (error) {
      console.error('PostsManager: Error toggling like:', error);
      toast({
        title: "Erro",
        description: "Erro ao curtir post",
        variant: "destructive",
      });
    }
  };

  // Set up realtime subscriptions
  useEffect(() => {
    fetchPosts();

    const postsChannel = supabase
      .channel('posts_and_interactions')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'posts' 
      }, (payload) => {
        console.log('PostsManager: Post change detected:', payload);
        fetchPosts();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'post_likes' 
      }, (payload) => {
        console.log('PostsManager: Like change detected:', payload);
        fetchPosts();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'comments' 
      }, (payload) => {
        console.log('PostsManager: Comment change detected:', payload);
        fetchPosts();
      })
      .subscribe((status) => {
        console.log('PostsManager: Realtime subscription status:', status);
      });

    return () => {
      console.log('PostsManager: Removing posts channel');
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
