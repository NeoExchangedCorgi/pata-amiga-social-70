
import React from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';
import PostCard from '@/components/PostCard';

const Likes = () => {
  const likedPosts = [
    {
      id: '1',
      author: 'Maria Silva',
      username: 'maria_defensora',
      content: 'Encontrei um cachorrinho ferido na Rua das Flores, 123. Ele está com uma pata machucada e muito assustado. Alguém pode ajudar com o resgate?',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500',
      timestamp: '2h',
      likes: 15,
      replies: 3,
      isLiked: true,
    },
    {
      id: '3',
      author: 'Ana Costa',
      username: 'ana_ong_helper',
      content: 'Atualização: O cãozinho que resgatamos ontem já está melhor! Obrigada a todos que ajudaram. Ele ainda precisa de um lar definitivo. 🐕❤️',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500',
      timestamp: '6h',
      likes: 42,
      replies: 12,
      isLiked: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <LeftSidebar />
        <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold text-foreground mb-6">Posts Curtidos</h1>
            
            <div className="space-y-4">
              {likedPosts.map((post) => (
                <div key={post.id} className="animate-fade-in">
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

export default Likes;
