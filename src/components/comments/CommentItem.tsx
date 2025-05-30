
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, MoreVertical, Edit, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CommentForm from './CommentForm';
import type { Comment } from '@/types/comment';

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => Promise<boolean>;
  onReply: (content: string, parentId: string) => Promise<boolean>;
  onEdit: (commentId: string, content: string) => Promise<boolean>;
  onDelete: (commentId: string) => Promise<boolean>;
  isLiked: boolean;
  isOwner: boolean;
  formatTimeAgo: (dateString: string) => string;
}

const CommentItem = ({
  comment,
  onLike,
  onReply,
  onEdit,
  onDelete,
  isLiked,
  isOwner,
  formatTimeAgo
}: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const likesCount = comment.comment_likes?.length || 0;
  const repliesCount = comment.replies?.length || 0;

  const handleReply = async (content: string) => {
    const success = await onReply(content, comment.id);
    if (success) {
      setShowReplyForm(false);
      setShowReplies(true);
    }
    return success;
  };

  const handleEdit = async (content: string) => {
    const success = await onEdit(comment.id, content);
    if (success) {
      setIsEditing(false);
    }
    return success;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment.profiles.avatar_url || "/placeholder.svg"} />
          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white text-xs">
            {comment.profiles.full_name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{comment.profiles.full_name}</span>
                <span className="text-xs text-muted-foreground">@{comment.profiles.username}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.created_at)}</span>
              </div>
              
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="h-3 w-3 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(comment.id)}
                      className="text-destructive"
                    >
                      <Trash className="h-3 w-3 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            
            {isEditing ? (
              <CommentForm
                onSubmit={handleEdit}
                placeholder="Edite seu comentário..."
                submitText="Salvar"
                onCancel={() => setIsEditing(false)}
                initialValue={comment.content}
              />
            ) : (
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={() => onLike(comment.id)}
            >
              <Heart className={`h-3 w-3 mr-1 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              {likesCount > 0 && likesCount}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Responder
            </Button>

            {repliesCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? 'Ocultar' : 'Ver'} {repliesCount} {repliesCount === 1 ? 'resposta' : 'respostas'}
              </Button>
            )}
          </div>

          {showReplyForm && (
            <div className="ml-4">
              <CommentForm
                onSubmit={handleReply}
                placeholder="Escreva uma resposta..."
                submitText="Responder"
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}

          {showReplies && comment.replies && comment.replies.length > 0 && (
            <div className="ml-4 space-y-3 border-l-2 border-border pl-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onLike={onLike}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isLiked={false} // TODO: Implement reply like checking
                  isOwner={reply.author_id === comment.author_id} // TODO: Get actual user id
                  formatTimeAgo={formatTimeAgo}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
