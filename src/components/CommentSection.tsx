
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CommentForm from '@/components/CommentForm';

interface Comment {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  replies?: Comment[];
}

interface CommentSectionProps {
  comments: Comment[];
  isAuthenticated: boolean;
  onAddComment: (content: string) => void;
  formatTimeAgo: (dateString: string) => string;
}

const CommentSection = ({ comments, isAuthenticated, onAddComment, formatTimeAgo }: CommentSectionProps) => {
  return (
    <Card className="border-foreground/20">
      <CardContent className="p-4">
        <h4 className="font-semibold text-foreground mb-4">Comentários</h4>
        
        {isAuthenticated && <CommentForm onSubmit={onAddComment} />}
        
        <div className="mt-6 space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="border-b border-foreground/10 pb-4 last:border-b-0">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.profiles.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white text-xs">
                      {comment.profiles.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground text-sm">{comment.profiles.full_name}</span>
                      <span className="text-muted-foreground text-xs">@{comment.profiles.username}</span>
                      <span className="text-muted-foreground text-xs">·</span>
                      <span className="text-muted-foreground text-xs">{formatTimeAgo(comment.created_at)}</span>
                    </div>
                    <p className="text-foreground text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">
              {isAuthenticated ? 'Seja o primeiro a comentar!' : 'Faça login para ver e adicionar comentários.'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentSection;
