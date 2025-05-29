
import React from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';
import PostCard from '@/components/PostCard';
import PostFilter from '@/components/PostFilter';
import { useReportedPostsData } from '@/hooks/useReportedPostsData';

const ReportedPosts = () => {
  const { reportedPosts, isLoading } = useReportedPostsData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex w-full">
          <LeftSidebar />
          <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
            <div className="max-w-2xl mx-auto">
              <PostFilter currentSort="reported" onSortChange={() => {}} />
              <div className="p-1 sm:p-2 space-y-3 sm:space-y-4">
                <div className="animate-pulse space-y-3 sm:space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-40 sm:h-48 bg-gray-200 rounded"></div>
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <LeftSidebar />
        <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
          <div className="max-w-2xl mx-auto">
            <PostFilter currentSort="reported" onSortChange={() => {}} />
            
            <div className="p-1 sm:p-2 space-y-3 sm:space-y-4">
              {reportedPosts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nenhum post foi denunciado ainda.
                  </p>
                </div>
              ) : (
                reportedPosts.map(post => (
                  <div key={post.id} className="animate-fade-in">
                    <PostCard post={post} />
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

export default ReportedPosts;
