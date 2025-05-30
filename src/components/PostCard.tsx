
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import PostContent from '@/components/PostContent';
import PostMetrics from '@/components/post/PostMetrics';
import { usePostActions } from '@/hooks/usePostActions';
import { useAdminActions } from '@/hooks/useAdminActions';
import type { Post } from '@/hooks/usePosts';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const navigate = useNavigate();
  const { isAdmin, deletePost: adminDeletePost } = useAdminActions();
  
  const {
    isOwnPost,
    isSaved,
    isReported,
    isHidden,
    isLiked,
    isAuthenticated,
    handleLike,
    handleEdit,
    handleReport,
    handleRemoveReport,
    handleHidePost,
    handleUnhidePost,
    handleSave,
    handleView,
  } = usePostActions(post.id, post.author_id);

  const handlePostClick = () => {
    handleView();
    navigate(`/post/${post.id}`);
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/user/${post.profiles.username}`);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'agora';
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  const likesCount = post.post_likes?.length || 0;
  const isAdminPost = post.profiles.user_type === 'admin';

  const postActions = {
    isOwnPost: isOwnPost || isAdmin,
    isSaved,
    isReported,
    isHidden,
    isAuthenticated,
    handleSave,
    handleReport,
    handleRemoveReport,
    handleHidePost,
    handleUnhidePost,
    handleEdit,
    adminDeletePost: isAdmin ? () => adminDeletePost(post.id) : undefined,
  };

  return (
    <Card 
      className={`border-foreground/20 cursor-pointer hover:bg-foreground/5 transition-colors ${
        isAdminPost ? 'bg-red-50/30 dark:bg-red-950/10 border-red-200/50 dark:border-red-800/30' : ''
      }`}
      onClick={handlePostClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <Avatar className="cursor-pointer" onClick={handleAuthorClick}>
            <AvatarImage src={post.profiles.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white">
              {post.profiles.full_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 
                className="font-semibold text-foreground cursor-pointer hover:underline"
                onClick={handleAuthorClick}
              >
                {post.profiles.full_name}
              </h3>
              <span className="text-muted-foreground">@{post.profiles.username}</span>
              {isAdminPost && (
                <span className="text-xs bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 px-2 py-1 rounded-full">
                  Admin
                </span>
              )}
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{formatTimeAgo(post.created_at)}</span>
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
              onLike={handleLike}
              onSave={handleSave}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
