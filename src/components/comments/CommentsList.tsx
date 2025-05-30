
import React from 'react';
import { useComments } from '@/hooks/useComments';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { Separator } from '@/components/ui/separator';

interface CommentsListProps {
  postId: string;
  authorId: string;
}

const CommentsList = ({ postId, authorId }: CommentsListProps) => {
  const { comments, isLoading, createComment } = useComments(postId);

  const handleSubmitComment = async (content: string) => {
    return await createComment(content);
  };

  if (isLoading) {
    return (
      <div className="mt-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <CommentForm 
        postId={postId} 
        onSubmit={handleSubmitComment}
      />
      
      {comments.length > 0 && (
        <>
          <Separator />
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CommentsList;
