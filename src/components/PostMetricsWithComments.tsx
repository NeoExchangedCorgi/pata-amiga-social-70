
import React from 'react';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostMetricsWithCommentsProps {
  likesCount: number;
  commentsCount?: number;
  isLiked: boolean;
  isSaved: boolean;
  isOwnPost: boolean;
  isAuthenticated: boolean;
  onLike: () => void;
  onSave: () => void;
  showSaveButton?: boolean;
}

const PostMetricsWithComments = ({
  likesCount,
  commentsCount = 0,
  isLiked,
  isSaved,
  isOwnPost,
  isAuthenticated,
  onLike,
  onSave,
  showSaveButton = true
}: PostMetricsWithCommentsProps) => {
  return (
    <div className="flex items-center justify-between pt-3 border-t border-border/50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Heart className="h-4 w-4" />
          <span>{likesCount}</span>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MessageCircle className="h-4 w-4" />
          <span>{commentsCount}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!isOwnPost && isAuthenticated && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            className={`${isLiked ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500' : ''}`} />
          </Button>
        )}

        {showSaveButton && isAuthenticated && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            className={`${isSaved ? 'text-blue-500' : 'text-muted-foreground'} hover:text-blue-500`}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-blue-500' : ''}`} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostMetricsWithComments;
