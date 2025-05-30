
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatTimeAgo, getUserInitials } from '@/utils/formatters';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

interface CommentItemProps {
  comment: Comment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div className="flex space-x-3">
      <Avatar className="w-8 h-8">
        <AvatarImage src={comment.author.avatar_url || "/placeholder.svg"} />
        <AvatarFallback className="bg-pata-blue-light dark:bg-pata-blue-dark text-white text-xs">
          {getUserInitials(comment.author.full_name)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-sm">{comment.author.full_name}</span>
          <span className="text-xs text-muted-foreground">@{comment.author.username}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(comment.created_at)}
          </span>
        </div>
        <p className="text-sm mt-1 break-words">{comment.content}</p>
      </div>
    </div>
  );
};

export default CommentItem;
