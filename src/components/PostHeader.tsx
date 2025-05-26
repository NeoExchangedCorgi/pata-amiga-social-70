
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatTimeAgo, getUserInitials } from '@/utils/formatters';

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
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <Avatar className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onAuthorClick(); }}>
          <AvatarImage src={author.avatar_url || "/placeholder.svg"} />
          <AvatarFallback className="bg-pata-blue-light dark:bg-pata-blue-dark text-white">
            {getUserInitials(author.full_name)}
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
