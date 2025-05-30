
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  type: 'like';
  post_id: string;
  actor_id: string;
  read: boolean;
  created_at: string;
  actor: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  post: {
    content: string;
  };
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;
    // TODO: Implementar busca de notificações com o novo banco
    console.log('Fetching notifications - to be implemented with new database');
    setNotifications([]);
    setUnreadCount(0);
    setIsLoading(false);
  };

  const markAsRead = async (notificationId: string) => {
    if (!user) return;
    // TODO: Implementar marcação como lida com o novo banco
    console.log('Marking as read - to be implemented with new database', notificationId);
  };

  const markAllAsRead = async () => {
    if (!user) return;
    // TODO: Implementar marcação de todas como lidas com o novo banco
    console.log('Marking all as read - to be implemented with new database');
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
};
