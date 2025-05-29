
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePostsManager } from '@/hooks/usePostsManager';
import { ROUTES } from '@/constants/app';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import PostFilter from './PostFilter';

const MainFeed = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { posts, isLoading: postsLoading, sortType, setSortType } = usePostsManager();

  if (authLoading) {
    return (
      <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
        <div className="max-w-2xl mx-auto p-1 sm:p-2">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          </div>
        </div>
      </main>
    );
  }

  const renderEmptyState = () => (
    <div className="text-center py-6 px-2 sm:px-4">
      <p className="text-muted-foreground text-sm">
        {isAuthenticated 
          ? "Nenhum post encontrado. Seja o primeiro a postar!" 
          : "Faça login para ver e criar posts sobre animais em situações críticas."
        }
      </p>
      {!isAuthenticated && (
        <div className="mt-3 text-sm">
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
    <div className="space-y-3 sm:space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-40 sm:h-48"></div>
        </div>
      ))}
    </div>
  );

  return (
    <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
      <div className="max-w-2xl mx-auto">
        {isAuthenticated && (
          <div className="sticky top-16 z-30 bg-background/95 backdrop-blur pb-2 sm:pb-3">
            <div className="p-1 sm:p-2">
              <CreatePost />
            </div>
          </div>
        )}
        
        <PostFilter currentSort={sortType} onSortChange={setSortType} />
        
        <div className="p-1 sm:p-2 space-y-3 sm:space-y-4">
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
