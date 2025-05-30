
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

type ActionType = 'like' | 'save' | 'report' | 'hide' | 'view';

interface HistoryEntry {
  id: string;
  post_id: string;
  action_type: ActionType;
  created_at: string;
  posts: any;
}

export const useUserHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const addToHistory = async (postId: string, actionType: ActionType) => {
    if (!user) return;
    // TODO: Implementar adição ao histórico com o novo banco
    console.log('Adding to history - to be implemented with new database', { postId, actionType });
  };

  const fetchHistory = async () => {
    if (!user) return;
    // TODO: Implementar busca de histórico com o novo banco
    console.log('Fetching history - to be implemented with new database');
    setHistory([]);
    setIsLoading(false);
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
