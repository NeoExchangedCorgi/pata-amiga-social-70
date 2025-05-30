
import React from 'react';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostMetricsWithCommentsProps {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  isOwnPost: boolean;
  isAuthenticated: boolean;
  onLike: () => void;
  onSave: () => void;
}

const PostMetricsWithComments = ({
  likesCount,
  commentsCount,
  isLiked,
  isSaved,
  isOwnPost,
  isAuthenticated,
  onLike,
  onSave
}: PostMetricsWithCommentsProps) => {
  return (
    <div className="flex items-center justify-between pt-3 border-t border-foreground/20">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            disabled={isOwnPost || !isAuthenticated}
            className={`h-8 px-2 ${
              isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likesCount}</span>
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-muted-foreground">
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{commentsCount}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          disabled={!isAuthenticated}
          className={`h-8 px-2 ${
            isSaved ? 'text-blue-500' : 'text-muted-foreground hover:text-blue-500'
          }`}
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default PostMetricsWithComments;
