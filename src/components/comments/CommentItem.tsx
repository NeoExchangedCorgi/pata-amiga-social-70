
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import CommentForm from './CommentForm';
import type { Comment } from '@/types/comment';

interface CommentItemProps {
  comment: Comment;
  onReply: (content: string, parentId: string) => Promise<boolean>;
  onEdit: (commentId: string, content: string) => Promise<boolean>;
  onDelete: (commentId: string) => Promise<boolean>;
  onLike: (commentId: string) => Promise<boolean>;
  level?: number;
}

const CommentItem = ({ comment, onReply, onEdit, onDelete, onLike, level = 0 }: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(false);
  const { user } = useAuth();

  const isOwnComment = user?.id === comment.author_id;
  const isLiked = comment.comment_likes?.some(like => like.user_id === user?.id) || false;
  const likesCount = comment.comment_likes?.length || 0;
  const repliesCount = comment.replies?.length || 0;

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

  const handleReply = async (content: string) => {
    const success = await onReply(content, comment.id);
    if (success) {
      setShowReplyForm(false);
    }
    return success;
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    const success = await onEdit(comment.id, editContent.trim());
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleLike = async () => {
    await onLike(comment.id);
  };

  if (level > 2) return null; // Limit nesting depth

  return (
    <div className={`${level > 0 ? 'ml-8 border-l border-gray-200 pl-4' : ''}`}>
      <div className="flex space-x-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment.profiles.avatar_url || "/placeholder.svg"} />
          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white text-xs">
            {comment.profiles.full_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold text-sm">{comment.profiles.full_name}</span>
            <span className="text-xs text-muted-foreground">@{comment.profiles.username}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.created_at)}</span>
            
            {isOwnComment && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Pencil className="h-3 w-3 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(comment.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={2}
                className="resize-none text-sm"
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleEdit}>
                  Salvar
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-foreground mb-2">{comment.content}</p>
          )}
          
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${
                isLiked ? 'text-red-500' : ''
              }`}
            >
              <Heart className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likesCount}</span>
            </button>
            
            {level < 2 && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
              >
                <MessageCircle className="h-3 w-3" />
                <span>Responder</span>
              </button>
            )}
            
            {repliesCount > 0 && level === 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-blue-500 hover:underline"
              >
                {showReplies ? 'Ocultar' : 'Ver'} {repliesCount} resposta{repliesCount > 1 ? 's' : ''}
              </button>
            )}
          </div>
          
          {showReplyForm && level < 2 && (
            <div className="mt-3">
              <CommentForm
                onSubmit={handleReply}
                placeholder="Adicione uma resposta..."
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Render replies */}
      {showReplies && comment.replies && comment.replies.length > 0 && level === 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={onLike}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
