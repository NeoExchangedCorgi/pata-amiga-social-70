
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'reply' | 'comment_like';
  post_id: string;
  actor_id: string;
  comment_id?: string;
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
  comment?: {
    content: string;
  };
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          actor:profiles!fk_notifications_actor_id (
            username,
            full_name,
            avatar_url
          ),
          post:posts!fk_notifications_post_id (
            content
          ),
          comment:comments!notifications_comment_id_fkey (
            content
          )
        `)
        .eq('user_id', user.id)
        .in('type', ['like', 'comment', 'reply', 'comment_like'])
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      // Transform and filter the data to ensure proper typing
      const transformedNotifications = (data || [])
        .filter(notification => 
          notification.actor && 
          notification.post && 
          (notification.comment_id ? notification.comment : true)
        )
        .map(notification => ({
          id: notification.id,
          type: notification.type as 'like' | 'comment' | 'reply' | 'comment_like',
          post_id: notification.post_id,
          actor_id: notification.actor_id,
          comment_id: notification.comment_id,
          read: notification.read || false,
          created_at: notification.created_at,
          actor: Array.isArray(notification.actor) ? notification.actor[0] : notification.actor,
          post: Array.isArray(notification.post) ? notification.post[0] : notification.post,
          comment: notification.comment ? (Array.isArray(notification.comment) ? notification.comment[0] : notification.comment) : undefined
        })) as Notification[];

      setNotifications(transformedNotifications);
      setUnreadCount(transformedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Configure realtime for notifications
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
