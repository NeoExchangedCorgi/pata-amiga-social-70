
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostLikeButtonProps {
  likesCount: number;
  isLiked: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const PostLikeButton = ({ likesCount, isLiked, isDisabled, onClick }: PostLikeButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`flex items-center space-x-1 ${
        isLiked 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-muted-foreground hover:text-red-500'
      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      <span className="text-sm">{likesCount}</span>
    </Button>
  );
};

export default PostLikeButton;
