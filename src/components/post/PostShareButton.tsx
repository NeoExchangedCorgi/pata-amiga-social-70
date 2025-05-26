
import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostShareButtonProps {
  postId: string;
}

const PostShareButton = ({ postId }: PostShareButtonProps) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Post do Pata Amiga',
        url: `${window.location.origin}/post/${postId}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center space-x-1 text-muted-foreground hover:text-green-500"
      onClick={handleShare}
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
};

export default PostShareButton;
