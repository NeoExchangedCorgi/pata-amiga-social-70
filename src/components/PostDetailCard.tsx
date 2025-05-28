
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PostContent from '@/components/PostContent';
import PostDetailActions from '@/components/PostDetailActions';
import PostMetrics from '@/components/post/PostMetrics';
import type { Post } from '@/hooks/usePosts';

interface PostDetailCardProps {
  post: Post;
  isOwnPost: boolean;
  isLiked: boolean;
  likesCount: number;
  isSaved: boolean;
  isReported: boolean;
  isAuthenticated: boolean;
  onLike: () => void;
  onReport: () => void;
  onRemoveReport: () => void;
  onDelete: () => void;
  onMark: () => void;
  onAuthorClick: () => void;
  formatTimeAgo: (dateString: string) => string;
}

const PostDetailCard = ({
  post,
  isOwnPost,
  isLiked,
  likesCount,
  isSaved,
  isReported,
  isAuthenticated,
  onLike,
  onReport,
  onRemoveReport,
  onDelete,
  onMark,
  onAuthorClick,
  formatTimeAgo
}: PostDetailCardProps) => {
  const postActions = {
    isOwnPost,
    isSaved,
    isReported,
    isHidden: false,
    isAuthenticated,
    handleSave: onMark,
    handleReport: onReport,
    handleRemoveReport: onRemoveReport,
    handleHidePost: () => {},
    handleUnhidePost: () => {},
    handleEdit: () => {}
  };

  return (
    <Card className="border-foreground/20">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <Avatar className="cursor-pointer" onClick={onAuthorClick}>
              <AvatarImage src={post.profiles.avatar_url || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white">
                {post.profiles.full_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 
                  className="font-semibold text-foreground cursor-pointer hover:underline"
                  onClick={onAuthorClick}
                >
                  {post.profiles.full_name}
                </h3>
                <span className="text-muted-foreground">@{post.profiles.username}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{formatTimeAgo(post.created_at)}</span>
              </div>
            </div>
          </div>
          
          <PostDetailActions
            isOwnPost={isOwnPost}
            isReported={isReported}
            onDelete={onDelete}
            onReport={onReport}
            onRemoveReport={onRemoveReport}
          />
        </div>

        <PostContent 
          content={post.content}
          mediaUrl={post.media_url}
          mediaType={post.media_type}
          postId={post.id}
          authorId={post.author_id}
          postActions={postActions}
        />

        <PostMetrics
          likesCount={likesCount}
          isLiked={isLiked}
          isSaved={isSaved}
          isOwnPost={isOwnPost}
          isAuthenticated={isAuthenticated}
          onLike={onLike}
          onSave={onMark}
        />
      </CardContent>
    </Card>
  );
};

export default PostDetailCard;
