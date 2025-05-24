
import React from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';
import PostCard from '@/components/PostCard';
import type { Post } from '@/hooks/usePosts';

const Likes = () => {
  // Mock data that matches the Post interface
  const likedPosts: Post[] = [
    {
      id: '1',
      content: 'Encontrei um cachorrinho ferido na Rua das Flores, 123. Ele está com uma pata machucada e muito assustado. Alguém pode ajudar com o resgate?',
      image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
      author_id: 'user1',
      profiles: {
        id: 'user1',
        username: 'maria_defensora',
        full_name: 'Maria Silva',
        avatar_url: null,
      },
      post_likes: Array(15).fill(null).map((_, i) => ({ user_id: `user${i}` })),
      comments: Array(3).fill(null).map((_, i) => ({ id: `comment${i}` })),
    },
    {
      id: '3',
      content: 'Atualização: O cãozinho que resgatamos ontem já está melhor! Obrigada a todos que ajudaram. Ele ainda precisa de um lar definitivo. 🐕❤️',
      image_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500',
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6h ago
      author_id: 'user3',
      profiles: {
        id: 'user3',
        username: 'ana_ong_helper',
        full_name: 'Ana Costa',
        avatar_url: null,
      },
      post_likes: Array(42).fill(null).map((_, i) => ({ user_id: `user${i}` })),
      comments: Array(12).fill(null).map((_, i) => ({ id: `comment${i}` })),
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
