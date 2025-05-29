
import React from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';
import PostCard from '@/components/PostCard';
import { useUserHistory } from '@/hooks/useUserHistory';

const History = () => {
  const { history, isLoading } = useUserHistory();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex w-full">
          <LeftSidebar />
          <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
            <div className="max-w-2xl mx-auto p-4">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-6"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </main>
          <RightSidebar />
        </div>
        <FooterBar />
      </div>
    );
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'agora';
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d atrás`;
    }
  };

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case 'like': return 'Curtiu';
      case 'save': return 'Marcou';
      case 'report': return 'Denunciou';
      case 'hide': return 'Ocultou';
      case 'view': return 'Visualizou';
      default: return 'Interagiu';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <LeftSidebar />
        <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold text-foreground mb-6">Histórico</h1>
            
            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nenhuma interação registrada ainda.
                  </p>
                </div>
              ) : (
                history.map(entry => (
                  <div key={entry.id} className="animate-fade-in">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-muted-foreground">
                        {getActionLabel(entry.action_type)} • {formatTimeAgo(entry.created_at)}
                      </div>
                    </div>
                    <PostCard post={entry.posts} />
                  </div>
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

export default History;
