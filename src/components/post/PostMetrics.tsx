
import React from 'react';
import { Heart, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostMetricsProps {
  likesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  isOwnPost: boolean;
  isAuthenticated: boolean;
  onLike: () => void;
  onSave: () => void;
}

const PostMetrics = ({
  likesCount,
  isLiked,
  isSaved,
  isOwnPost,
  isAuthenticated,
  onLike,
  onSave
}: PostMetricsProps) => {
  const handleLike = async () => {
    await onLike();
    window.location.reload();
  };

  const handleSave = async () => {
    await onSave();
    window.location.reload();
  };

  return (
    <div className="flex items-center space-x-4 pt-4 border-t border-foreground/10">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleLike}
        disabled={isOwnPost || !isAuthenticated}
        className={`${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'} ${(isOwnPost || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
        {likesCount}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSave}
        disabled={isOwnPost || !isAuthenticated}
        className={`${isSaved ? 'text-blue-500 hover:text-blue-600' : 'text-muted-foreground hover:text-blue-500'} ${(isOwnPost || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Bookmark className={`h-4 w-4 mr-1 ${isSaved ? 'fill-current' : ''}`} />
        {isSaved ? 'Marcado' : 'Marcar'}
      </Button>
    </div>
  );
};

export default PostMetrics;
