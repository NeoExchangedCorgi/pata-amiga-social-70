
import React from 'react';
import CreatePost from './CreatePost';
import PostCard from './PostCard';

const MainFeed = () => {
  const samplePosts = [
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
    },
    {
      id: '2',
      author: 'João Santos',
      username: 'joao_amigo_pets',
      content: 'Urgente! Gata prenha abandonada na Praça Central. Ela está muito magra e precisa de cuidados veterinários. Já contatei a ONG, mas precisamos de ajuda para o transporte.',
      timestamp: '4h',
      likes: 28,
      replies: 7,
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
      isLiked: false,
    },
  ];

  return (
    <main className="ml-64 mr-80 min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="sticky top-20 z-40 bg-background/95 backdrop-blur pb-4">
          <CreatePost />
        </div>
        
        <div className="space-y-4">
          {samplePosts.map((post) => (
            <div key={post.id} className="animate-fade-in">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default MainFeed;
