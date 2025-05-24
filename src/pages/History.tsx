
import React from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';
import PostCard from '@/components/PostCard';

const History = () => {
  const visitedPosts = [
    {
      id: '2',
      author: 'João Santos',
      username: 'joao_amigo_pets',
      content: 'Urgente! Gata prenha abandonada na Praça Central. Ela está muito magra e precisa de cuidados veterinários. Já contatei a ONG, mas precisamos de ajuda para o transporte.',
      timestamp: '4h',
      likes: 28,
      replies: 7,
      isLiked: true,
      visitedAt: '1h atrás',
    },
    {
      id: '1',
      author: 'Maria Silva',
      username: 'maria_defensora',
      content: 'Encontrei um cachorrinho ferido na Rua das Flores, 123. Ele está com uma pata machucada e muito assustado. Alguém pode ajudar com o resgate?',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500',
      timestamp: '2h',
      likes: 15,
      replies: 3,
      isLiked: false,
      visitedAt: '3h atrás',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <LeftSidebar />
        <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold text-foreground mb-6">Histórico</h1>
            
            <div className="space-y-4">
              {visitedPosts.map((post) => (
                <div key={post.id} className="animate-fade-in">
                  <div className="text-xs text-muted-foreground mb-2">
                    Visitado {post.visitedAt}
                  </div>
                  <PostCard post={post} />
                </div>
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

export default History;
