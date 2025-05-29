
import React from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';
import PostCard from '@/components/PostCard';
import PostFilter from '@/components/PostFilter';
import { useAuth } from '@/contexts/AuthContext';
import { useReportedPostsData } from '@/hooks/useReportedPostsData';

const ReportedPosts = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { reportedPosts, isLoading: postsLoading } = useReportedPostsData();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex w-full">
          <LeftSidebar />
          <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
            <div className="max-w-2xl mx-auto p-1 sm:p-2">
              <div className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
              </div>
            </div>
          </main>
          <RightSidebar />
        </div>
        <FooterBar />
      </div>
    );
  }

  const renderEmptyState = () => (
    <div className="text-center py-6 px-2 sm:px-4">
      <p className="text-muted-foreground text-sm">
        {isAuthenticated 
          ? "Nenhum post foi denunciado ainda." 
          : "Faça login para ver posts denunciados."
        }
      </p>
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
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <LeftSidebar />
        <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
          <div className="max-w-2xl mx-auto">
            <PostFilter currentSort="reported" onSortChange={() => {}} />
            
            <div className="p-1 sm:p-2 space-y-3 sm:space-y-4">
              {postsLoading ? renderLoadingState() : (
                reportedPosts.length === 0 ? renderEmptyState() : (
                  reportedPosts.map((post) => (
                    <div key={post.id} className="animate-fade-in">
                      <PostCard post={post} />
                    </div>
                  ))
                )
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

export default ReportedPosts;
