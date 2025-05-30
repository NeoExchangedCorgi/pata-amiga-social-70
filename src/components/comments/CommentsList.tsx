
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import type { Comment, CommentSortType } from '@/types/comment';

interface CommentsListProps {
  comments: Comment[];
  isLoading: boolean;
  sortType: CommentSortType;
  onSortChange: (sortType: CommentSortType) => void;
  onCreateComment: (content: string) => Promise<boolean>;
  onReply: (content: string, parentId: string) => Promise<boolean>;
  onEdit: (commentId: string, content: string) => Promise<boolean>;
  onDelete: (commentId: string) => Promise<boolean>;
  onLike: (commentId: string) => Promise<boolean>;
  commentsCount: number;
}

const CommentsList = ({
  comments,
  isLoading,
  sortType,
  onSortChange,
  onCreateComment,
  onReply,
  onEdit,
  onDelete,
  onLike,
  commentsCount
}: CommentsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-t border-foreground/20 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">
            {commentsCount} comentário{commentsCount !== 1 ? 's' : ''}
          </h3>
          
          <Select value={sortType} onValueChange={(value: CommentSortType) => onSortChange(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chronological">Cronológica</SelectItem>
              <SelectItem value="popularity">Popularidade</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <CommentForm onSubmit={onCreateComment} />
      </div>
      
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Seja o primeiro a comentar neste post!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={onLike}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsList;
