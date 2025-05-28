
import React from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';
import PostCard from '@/components/PostCard';
import { useReportedPosts } from '@/hooks/useReportedPosts';

const ReportedPosts = () => {
  const { reportedPosts, isLoading } = useReportedPosts();

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

  // Agrupar posts por ID para evitar duplicatas
  const uniquePosts = reportedPosts.reduce((acc, report) => {
    if (!acc.find(item => item.posts.id === report.posts.id)) {
      acc.push(report);
    }
    return acc;
  }, [] as typeof reportedPosts);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <LeftSidebar />
        <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold text-foreground mb-6">Posts Denunciados</h1>
            
            <div className="space-y-4">
              {uniquePosts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nenhum post foi denunciado ainda.
                  </p>
                </div>
              ) : (
                uniquePosts.map(report => (
                  <div key={report.id} className="animate-fade-in">
                    <PostCard post={report.posts} />
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
