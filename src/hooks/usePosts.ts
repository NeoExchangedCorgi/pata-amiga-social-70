
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Post {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  author_id: string;
  profiles: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  post_likes: Array<{ user_id: string }>;
  comments: Array<{ id: string }>;
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
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
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      // Ordenar por número de curtidas (decrescente) e depois por data de criação (decrescente)
      const sortedData = (data || []).sort((a, b) => {
        const likesA = a.post_likes?.length || 0;
        const likesB = b.post_likes?.length || 0;
        
        if (likesA !== likesB) {
          return likesB - likesA; // Mais curtidas primeiro
        }
        
        // Se igual número de curtidas, ordenar por data (mais recente primeiro)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setPosts(sortedData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (content: string, imageUrl?: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um post",
        variant: "destructive",
      });
      return { error: 'Usuário não autenticado' };
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          content,
          image_url: imageUrl,
          author_id: user.id,
        })
        .select(`
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
        `)
        .single();

      if (error) {
        console.error('Error creating post:', error);
        return { error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error creating post:', error);
      return { error: 'Erro interno do servidor' };
    }
  };

  const deletePost = async (postId: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para excluir posts",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Remove the post from local state immediately for better UX
      setPosts(prev => prev.filter(post => post.id !== postId));

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('author_id', user.id);

      if (error) {
        console.error('Error deleting post:', error);
        // Restore the post if deletion failed
        fetchPosts();
        toast({
          title: "Erro",
          description: "Erro ao excluir post",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Post excluído",
        description: "O post e todos os dados relacionados foram excluídos com sucesso",
      });
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      // Restore the post if deletion failed
      fetchPosts();
      toast({
        title: "Erro",
        description: "Erro ao excluir post",
        variant: "destructive",
      });
      return false;
    }
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
      // Check if user already liked the post
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Remove like
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error removing like:', error);
          return;
        }
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
          return;
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Configurar realtime para atualizações automáticas
  useEffect(() => {
    fetchPosts();

    // Escutar mudanças em posts
    const postsChannel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    // Escutar mudanças em likes
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

    // Escutar mudanças em comentários
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
    isLoading,
    createPost,
    deletePost,
    toggleLike,
    refetch: fetchPosts,
  };
};
