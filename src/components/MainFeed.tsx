
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePostsManager } from '@/hooks/usePostsManager';
import { ROUTES } from '@/constants/app';
import CreatePost from './CreatePost';
import PostCard from './PostCard';

const MainFeed = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { posts, isLoading: postsLoading } = usePostsManager();

  if (authLoading) {
    return (
      <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
        <div className="max-w-2xl mx-auto p-4">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          </div>
        </div>
      </main>
    );
  }

  const renderEmptyState = () => (
    <div className="text-center py-8">
      <p className="text-muted-foreground">
        {isAuthenticated 
          ? "Nenhum post encontrado. Seja o primeiro a postar!" 
          : "Faça login para ver e criar posts sobre animais em situações críticas."
        }
      </p>
      {!isAuthenticated && (
        <div className="mt-4">
          <a href={ROUTES.SIGNUP} className="text-primary hover:underline">
            Criar conta
          </a>
          {" ou "}
          <a href={ROUTES.LOGIN} className="text-primary hover:underline">
            Fazer login
          </a>
        </div>
      )}
    </div>
  );

  const renderLoadingState = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-48"></div>
        </div>
      ))}
    </div>
  );

  return (
    <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {isAuthenticated && (
          <div className="sticky top-20 z-40 bg-background/95 backdrop-blur pb-4">
            <CreatePost />
          </div>
        )}
        
        <div className="space-y-4">
          {postsLoading ? renderLoadingState() : (
            posts.length === 0 ? renderEmptyState() : (
              posts.map((post) => (
                <div key={post.id} className="animate-fade-in">
                  <PostCard post={post} />
                </div>
              ))
            )
          )}
        </div>
      </div>
    </main>
  );
};

export default MainFeed;
