
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Post } from '@/services/posts/types';

type ActionType = 'like' | 'save' | 'report' | 'hide' | 'view';

interface HistoryEntry {
  id: string;
  post_id: string;
  action_type: ActionType;
  created_at: string;
  posts: Post;
}

export const useUserHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const addToHistory = async (postId: string, actionType: ActionType) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_history')
        .upsert({
          user_id: user.id,
          post_id: postId,
          action_type: actionType,
        }, {
          onConflict: 'user_id,post_id,action_type'
        });

      if (!error) {
        await fetchHistory();
      }
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  };

  const fetchHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_history')
        .select(`
          *,
          posts!fk_user_history_post_id (
            *,
            profiles!fk_posts_author_id (
              id,
              username,
              full_name,
              avatar_url,
              user_type
            ),
            post_likes!fk_post_likes_post_id (
              user_id
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
        return;
      }

      // Type assertion to ensure proper typing
      setHistory((data || []) as HistoryEntry[]);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  return {
    history,
    isLoading,
    addToHistory,
    refetch: fetchHistory,
  };
};
