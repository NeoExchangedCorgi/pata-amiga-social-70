
import React from 'react';
import { Heart, MessageCircle, Flag, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePostActions } from '@/hooks/usePostActions';

interface PostActionsProps {
  postId: string;
  authorId: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  onCommentClick: () => void;
}

const PostActions = ({ 
  postId, 
  authorId, 
  likesCount, 
  commentsCount, 
  isLiked, 
  onCommentClick 
}: PostActionsProps) => {
  const {
    isOwnPost,
    isSaved,
    isReported,
    isAuthenticated,
    handleLike,
    handleReport,
    handleSave,
  } = usePostActions(postId, authorId);

  return (
    <div className="flex items-center justify-between pt-2 border-t border-border/50">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.stopPropagation(); onCommentClick(); }}
        className="flex items-center space-x-2 text-muted-foreground hover:text-pata-blue-light dark:hover:text-pata-blue-dark"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="text-xs">{commentsCount}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.stopPropagation(); handleLike(); }}
        disabled={isOwnPost || !isAuthenticated}
        className={`flex items-center space-x-2 ${
          isLiked 
            ? 'text-red-500 hover:text-red-600' 
            : 'text-muted-foreground hover:text-red-500'
        } ${(isOwnPost || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
        <span className="text-xs">{likesCount}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.stopPropagation(); handleSave(); }}
        disabled={isOwnPost || !isAuthenticated}
        className={`flex items-center space-x-2 ${
          isSaved 
            ? 'text-blue-500 hover:text-blue-600' 
            : 'text-muted-foreground hover:text-blue-500'
        } ${(isOwnPost || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.stopPropagation(); handleReport(); }}
        disabled={!isAuthenticated || isOwnPost}
        className={`flex items-center space-x-2 ${
          isReported 
            ? 'text-red-500' 
            : 'text-muted-foreground hover:text-orange-500'
        } ${(!isAuthenticated || isOwnPost) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Flag className={`h-4 w-4 ${isReported ? 'fill-current' : ''}`} />
      </Button>
    </div>
  );
};

export default PostActions;
