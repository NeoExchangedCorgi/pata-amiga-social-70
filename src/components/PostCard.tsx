
import React, { useState } from 'react';
import { Heart, MessageCircle, Flag, MoreHorizontal, Edit, Trash2, Bookmark } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PostCardProps {
  post: {
    id: string;
    author: string;
    username: string;
    content: string;
    image?: string;
    timestamp: string;
    likes: number;
    replies: number;
    isLiked: boolean;
    isOwnPost?: boolean;
  };
}

const PostCard = ({ post }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isReported, setIsReported] = useState(false);
  const [isMarked, setIsMarked] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleLike = () => {
    if (!post.isOwnPost && isAuthenticated) {
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    }
  };

  const handleReport = () => {
    if (isAuthenticated) {
      setIsReported(!isReported);
    }
  };

  const handleMark = () => {
    if (isAuthenticated) {
      setIsMarked(!isMarked);
    }
  };

  const handleCommentClick = () => {
    if (isAuthenticated) {
      navigate(`/post/${post.id}`);
    }
  };

  const handleAuthorClick = () => {
    navigate(`/user/${post.username}`);
  };

  const handlePostClick = (e: React.MouseEvent) => {
    // Não navegar se clicou em botões ou links
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return;
    }
    navigate(`/post/${post.id}`);
  };

  return (
    <Card 
      className="border-border/50 hover:border-pata-blue-light/30 dark:hover:border-pata-blue-dark/30 transition-colors cursor-pointer"
      onClick={handlePostClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="cursor-pointer" onClick={(e) => { e.stopPropagation(); handleAuthorClick(); }}>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-pata-blue-light dark:bg-pata-blue-dark text-white">
                {post.author.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 
                className="font-semibold text-sm cursor-pointer hover:underline" 
                onClick={(e) => { e.stopPropagation(); handleAuthorClick(); }}
              >
                {post.author}
              </h3>
              <p className="text-xs text-muted-foreground">@{post.username} · {post.timestamp}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {post.isOwnPost ? (
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
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm leading-relaxed mb-3">{post.content}</p>
        
        {post.image && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src={post.image} 
              alt="Post image" 
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); handleCommentClick(); }}
            className="flex items-center space-x-2 text-muted-foreground hover:text-pata-blue-light dark:hover:text-pata-blue-dark"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{post.replies}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); handleLike(); }}
            disabled={post.isOwnPost || !isAuthenticated}
            className={`flex items-center space-x-2 ${
              isLiked 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-muted-foreground hover:text-red-500'
            } ${(post.isOwnPost || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-xs">{likesCount}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); handleMark(); }}
            disabled={post.isOwnPost || !isAuthenticated}
            className={`flex items-center space-x-2 ${
              isMarked 
                ? 'text-blue-500 hover:text-blue-600' 
                : 'text-muted-foreground hover:text-blue-500'
            } ${(post.isOwnPost || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Bookmark className={`h-4 w-4 ${isMarked ? 'fill-current' : ''}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); handleReport(); }}
            disabled={!isAuthenticated}
            className={`flex items-center space-x-2 ${
              isReported 
                ? 'text-red-500' 
                : 'text-muted-foreground hover:text-orange-500'
            } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Flag className={`h-4 w-4 ${isReported ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
