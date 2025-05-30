
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface HiddenPost {
  id: string;
  user_id: string;
  post_id: string;
  hidden_at: string;
  posts: {
    id: string;
    content: string;
    media_url?: string;
    media_type?: 'image' | 'video' | 'mixed';
    created_at: string;
    author_id: string;
    profiles: {
      id: string;
      username: string;
      full_name: string;
      avatar_url?: string;
    };
  };
}

export const useHiddenPosts = () => {
  const [hiddenPosts, setHiddenPosts] = useState<HiddenPost[]>([]);
  const [hiddenPostIds, setHiddenPostIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchHiddenPosts = async () => {
    if (!user) return;

    try {
      const { data: hiddenData, error: hiddenError } = await supabase
        .from('hidden_posts')
        .select('*')
        .eq('user_id', user.id)
        .order('hidden_at', { ascending: false });

      if (hiddenError) {
        console.error('Error fetching hidden posts:', hiddenError);
        return;
      }

      if (!hiddenData || hiddenData.length === 0) {
        setHiddenPosts([]);
        setHiddenPostIds(new Set());
        return;
      }

      const postIds = hiddenData.map(hp => hp.post_id);
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          media_url,
          media_type,
          created_at,
          author_id,
          profiles!fk_posts_author_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .in('id', postIds);

      if (postsError) {
        console.error('Error fetching post details:', postsError);
        return;
      }

      const combinedData: HiddenPost[] = hiddenData.map(hiddenPost => {
        const post = postsData?.find(p => p.id === hiddenPost.post_id);
        return {
          ...hiddenPost,
          posts: post || {
            id: hiddenPost.post_id,
            content: 'Post não encontrado',
            created_at: hiddenPost.hidden_at,
            author_id: '',
            profiles: {
              id: '',
              username: 'Usuário desconhecido',
              full_name: 'Usuário desconhecido',
              avatar_url: undefined
            }
          }
        };
      });

      setHiddenPosts(combinedData);
      setHiddenPostIds(new Set(hiddenData.map(hp => hp.post_id)));
    } catch (error) {
      console.error('Error fetching hidden posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hidePost = async (postId: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para ocultar posts",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('hidden_posts')
        .insert({
          user_id: user.id,
          post_id: postId,
        });

      if (error) {
        console.error('Error hiding post:', error);
        toast({
          title: "Erro",
          description: "Erro ao ocultar post. Tente novamente.",
          variant: "destructive",
        });
        return false;
      }

      setHiddenPostIds(prev => new Set([...prev, postId]));
      await fetchHiddenPosts();
      
      toast({
        title: "Post ocultado",
        description: "O post foi ocultado da sua feed.",
      });
      
      return true;
    } catch (error) {
      console.error('Error hiding post:', error);
      return false;
    }
  };

  const unhidePost = async (postId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('hidden_posts')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', postId);

      if (error) {
        console.error('Error unhiding post:', error);
        toast({
          title: "Erro",
          description: "Erro ao desocultar post. Tente novamente.",
          variant: "destructive",
        });
        return false;
      }

      setHiddenPostIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
      
      await fetchHiddenPosts();
      
      toast({
        title: "Post desocultado",
        description: "O post voltará a aparecer na sua feed.",
      });
      
      return true;
    } catch (error) {
      console.error('Error unhiding post:', error);
      return false;
    }
  };

  const isPostHidden = (postId: string) => {
    return hiddenPostIds.has(postId);
  };

  useEffect(() => {
    fetchHiddenPosts();
  }, [user]);

  return {
    hiddenPosts,
    hiddenPostIds,
    isLoading,
    hidePost,
    unhidePost,
    isPostHidden,
    refetch: fetchHiddenPosts,
  };
};
