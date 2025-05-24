import React, { useState } from 'react';
import { Heart, MessageCircle, Flag, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import CommentForm from './CommentForm';

interface Comment {
  id: string;
  author: string;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  isOwnComment?: boolean;
  replies?: Comment[];
}

interface CommentCardProps {
  comment: Comment;
  onReply: (content: string, parentId: string) => void;
  onLike: (commentId: string) => void;
  onReport: (commentId: string) => void;
  level?: number;
}

const CommentCard = ({ comment, onReply, onLike, onReport, level = 0 }: CommentCardProps) => {
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likesCount, setLikesCount] = useState(comment.likes);
  const [isReported, setIsReported] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  const handleLike = () => {
    if (!comment.isOwnComment && isAuthenticated) {
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
      onLike(comment.id);
    }
  };

  const handleReport = () => {
    if (isAuthenticated) {
      setIsReported(!isReported);
      onReport(comment.id);
    }
  };

  const handleReply = (content: string) => {
    onReply(content, comment.id);
    setShowReplyForm(false);
  };

  const handleAuthorClick = () => {
    navigate(`/user/${comment.username}`);
  };

  // Limitar nível de aninhamento para evitar comentários muito profundos
  const maxLevel = 3;
  const isMaxLevel = level >= maxLevel;

  return (
    <div className={`${level > 0 ? 'ml-8 border-l border-border/50 pl-4' : ''}`}>
      <div className="flex space-x-3 py-3">
        <Avatar className="w-8 h-8 cursor-pointer" onClick={handleAuthorClick}>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback className="bg-pata-blue-light dark:bg-pata-blue-dark text-white text-xs">
            {comment.author.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 
                className="font-semibold text-sm cursor-pointer hover:underline" 
                onClick={handleAuthorClick}
              >
                {comment.author}
              </h4>
              <span className="text-xs text-muted-foreground">
                @{comment.username} · {comment.timestamp}
              </span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {comment.isOwnComment ? (
                  <>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={handleReport}>
                    <Flag className="h-4 w-4 mr-2" />
                    {isReported ? 'Denunciado' : 'Denunciar'}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={comment.isOwnComment || !isAuthenticated}
              className={`flex items-center space-x-1 h-8 px-2 ${
                isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-muted-foreground hover:text-red-500'
              } ${(comment.isOwnComment || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">{likesCount}</span>
            </Button>
            
            {!isMaxLevel && isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center space-x-1 h-8 px-2 text-muted-foreground hover:text-pata-blue-light dark:hover:text-pata-blue-dark"
              >
                <MessageCircle className="h-3 w-3" />
                <span className="text-xs">Responder</span>
              </Button>
            )}
          </div>
          
          {showReplyForm && (
            <CommentForm
              onSubmit={handleReply}
              placeholder={`Respondendo para @${comment.username}...`}
              parentId={comment.id}
              isReply={true}
              onCancel={() => setShowReplyForm(false)}
            />
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="space-y-2 mt-3">
              {comment.replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onLike={onLike}
                  onReport={onReport}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
