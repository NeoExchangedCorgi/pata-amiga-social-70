
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { useComments } from '@/hooks/useComments';
import type { CommentSortType } from '@/types/comment';

interface CommentsListProps {
  postId: string;
  formatTimeAgo: (dateString: string) => string;
}

const CommentsList = ({ postId, formatTimeAgo }: CommentsListProps) => {
  const {
    comments,
    isLoading,
    sortType,
    setSortType,
    createComment,
    updateComment,
    deleteComment,
    toggleCommentLike,
    isCommentLiked,
    isCommentOwner,
  } = useComments(postId);

  const handleCreateComment = async (content: string) => {
    return await createComment(content);
  };

  const handleReply = async (content: string, parentId: string) => {
    return await createComment(content, parentId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Comentários ({comments.length})
        </h3>
        
        <Select value={sortType} onValueChange={(value: CommentSortType) => setSortType(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chronological">Cronológico</SelectItem>
            <SelectItem value="popularity">Populares</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CommentForm
        onSubmit={handleCreateComment}
        placeholder="Adicione um comentário..."
        submitText="Comentar"
      />

      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Seja o primeiro a comentar!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={toggleCommentLike}
              onReply={handleReply}
              onEdit={updateComment}
              onDelete={deleteComment}
              isLiked={isCommentLiked(comment)}
              isOwner={isCommentOwner(comment)}
              formatTimeAgo={formatTimeAgo}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsList;
