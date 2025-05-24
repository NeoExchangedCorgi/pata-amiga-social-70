
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PostHeaderProps {
  author: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  createdAt: string;
  onAuthorClick: () => void;
}

const PostHeader = ({ author, createdAt, onAuthorClick }: PostHeaderProps) => {
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

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <Avatar className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onAuthorClick(); }}>
          <AvatarImage src={author.avatar_url || "/placeholder.svg"} />
          <AvatarFallback className="bg-pata-blue-light dark:bg-pata-blue-dark text-white">
            {author.full_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 
            className="font-semibold text-sm cursor-pointer hover:underline" 
            onClick={(e) => { e.stopPropagation(); onAuthorClick(); }}
          >
            {author.full_name}
          </h3>
          <p className="text-xs text-muted-foreground">
            @{author.username} · {formatTimeAgo(createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
