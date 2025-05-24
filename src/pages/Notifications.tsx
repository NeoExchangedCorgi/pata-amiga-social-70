
import React from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, User } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    {
      id: '1',
      type: 'like',
      username: 'maria_defensora',
      postId: '1',
      timestamp: '2h',
    },
    {
      id: '2',
      type: 'like',
      username: 'joao_amigo_pets',
      postId: '3',
      timestamp: '4h',
    },
    {
      id: '3',
      type: 'follow',
      username: 'ana_ong_helper',
      timestamp: '1d',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <LeftSidebar />
        <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold text-foreground mb-6">Notificações</h1>
            
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card key={notification.id} className="border-foreground/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      {notification.type === 'like' ? (
                        <Heart className="h-5 w-5 text-red-500" />
                      ) : (
                        <User className="h-5 w-5 text-blue-500" />
                      )}
                      <div className="flex-1">
                        <p className="text-foreground">
                          <span className="font-semibold">{notification.username}</span>
                          {notification.type === 'like' ? ' curtiu seu post' : ' começou a te seguir'}
                        </p>
                        <p className="text-sm text-muted-foreground">{notification.timestamp}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
