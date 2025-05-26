
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Bookmark } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PostContent from '@/components/PostContent';
import PostDetailActions from '@/components/PostDetailActions';
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
  onDelete,
  onMark,
  onAuthorClick,
  formatTimeAgo
}: PostDetailCardProps) => {
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
          />
        </div>

        <PostContent 
          content={post.content}
          mediaUrl={post.media_url}
          mediaType={post.media_type}
          isReported={isReported}
        />

        <div className="flex items-center space-x-4 pt-4 border-t border-foreground/10">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onLike}
            disabled={isOwnPost || !isAuthenticated}
            className={`${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'} ${(isOwnPost || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
            {likesCount}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMark}
            disabled={isOwnPost || !isAuthenticated}
            className={`${isSaved ? 'text-blue-500 hover:text-blue-600' : 'text-muted-foreground hover:text-blue-500'} ${(isOwnPost || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Bookmark className={`h-4 w-4 mr-1 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Marcado' : 'Marcar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostDetailCard;
