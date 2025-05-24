
import React from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Check } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Notifications = () => {
  const { notifications, isLoading, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    navigate(`/post/${notification.post_id}`);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'agora';
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) {
        return '1 dia';
      } else if (diffInDays < 7) {
        return `${diffInDays} dias`;
      } else {
        return date.toLocaleDateString('pt-BR');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex w-full">
          <LeftSidebar />
          <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
            <div className="max-w-2xl mx-auto p-4">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded mb-6"></div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </main>
          <RightSidebar />
        </div>
        <FooterBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <LeftSidebar />
        <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">Notificações</h1>
              {notifications.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-sm"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Marcar todas como lidas
                </Button>
              )}
            </div>
            
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma notificação encontrada.</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`border-foreground/20 cursor-pointer hover:bg-muted/30 transition-colors ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {notification.type === 'like' ? (
                            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                              <Heart className="h-4 w-4 text-red-500" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                              <MessageCircle className="h-4 w-4 text-blue-500" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={notification.actor.avatar_url || "/placeholder.svg"} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white text-xs">
                                {notification.actor.full_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-sm text-foreground">
                              {notification.actor.full_name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              @{notification.actor.username}
                            </span>
                          </div>
                          
                          <p className="text-sm text-foreground mb-2">
                            {notification.type === 'like' ? 'curtiu seu post' : 'comentou no seu post'}
                          </p>
                          
                          <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                            "{notification.post.content.substring(0, 80)}
                            {notification.post.content.length > 80 ? '...' : ''}"
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-muted-foreground">
                              {formatTimeAgo(notification.created_at)}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
        <RightSidebar />
      </div>
      <FooterBar />
    </div>
  );
};

export default Notifications;
