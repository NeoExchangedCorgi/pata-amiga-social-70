
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useHiddenPosts = () => {
  const [hiddenPostIds, setHiddenPostIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchHiddenPosts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('hidden_posts')
        .select('post_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching hidden posts:', error);
        return;
      }

      setHiddenPostIds(new Set(data?.map(hp => hp.post_id) || []));
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
    hiddenPostIds,
    isLoading,
    hidePost,
    unhidePost,
    isPostHidden,
    refetch: fetchHiddenPosts,
  };
};
