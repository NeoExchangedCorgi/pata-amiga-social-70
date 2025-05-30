
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';
import PostDetailHeader from '@/components/PostDetailHeader';
import PostDetailCard from '@/components/PostDetailCard';
import CommentsList from '@/components/comments/CommentsList';
import { usePostDetail } from '@/hooks/usePostDetail';

const PostDetail = () => {
  const { id } = useParams();
  const {
    post,
    isLoading,
    isOwnPost,
    isLiked,
    likesCount,
    isSaved,
    isReported,
    isAuthenticated,
    handleLike,
    handleReport,
    handleRemoveReport,
    handleDelete,
    handleMark,
    handleAuthorClick,
    formatTimeAgo
  } = usePostDetail(id);

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
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </main>
          <RightSidebar />
        </div>
        <FooterBar />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex w-full">
          <LeftSidebar />
          <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
            <div className="max-w-2xl mx-auto p-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Post não encontrado.</p>
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
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            <PostDetailHeader />

            <PostDetailCard
              post={post}
              isOwnPost={isOwnPost}
              isLiked={isLiked}
              likesCount={likesCount}
              isSaved={isSaved}
              isReported={isReported}
              isAuthenticated={isAuthenticated}
              onLike={handleLike}
              onReport={handleReport}
              onRemoveReport={handleRemoveReport}
              onDelete={handleDelete}
              onMark={handleMark}
              onAuthorClick={handleAuthorClick}
              formatTimeAgo={formatTimeAgo}
            />

            <CommentsList postId={post.id} authorId={post.author_id} />
          </div>
        </main>
        <RightSidebar />
      </div>
      <FooterBar />
    </div>
  );
};

export default PostDetail;
