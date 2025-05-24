
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
import { usePosts } from '@/hooks/usePosts';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { usePostViews } from '@/hooks/usePostViews';
import type { Post } from '@/hooks/usePosts';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [isReported, setIsReported] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toggleLike } = usePosts();
  const { toggleSavePost, isPostSaved } = useSavedPosts();
  const { addPostView } = usePostViews();

  const isOwnPost = user?.id === post.author_id;
  const isLiked = post.post_likes?.some(like => like.user_id === user?.id) || false;
  const likesCount = post.post_likes?.length || 0;
  const commentsCount = post.comments?.length || 0;
  const isSaved = isPostSaved(post.id);

  const handleLike = () => {
    if (!isOwnPost && isAuthenticated) {
      toggleLike(post.id);
    }
  };

  const handleReport = () => {
    if (isAuthenticated) {
      setIsReported(!isReported);
    }
  };

  const handleSave = () => {
    if (isAuthenticated) {
      toggleSavePost(post.id);
    }
  };

  const handleCommentClick = () => {
    if (isAuthenticated) {
      addPostView(post.id);
      navigate(`/post/${post.id}`);
    }
  };

  const handleAuthorClick = () => {
    navigate(`/user/${post.profiles.username}`);
  };

  const handlePostClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return;
    }
    addPostView(post.id);
    navigate(`/post/${post.id}`);
  };

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

  return (
    <Card 
      className="border-border/50 hover:border-pata-blue-light/30 dark:hover:border-pata-blue-dark/30 transition-colors cursor-pointer"
      onClick={handlePostClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="cursor-pointer" onClick={(e) => { e.stopPropagation(); handleAuthorClick(); }}>
              <AvatarImage src={post.profiles.avatar_url || "/placeholder.svg"} />
              <AvatarFallback className="bg-pata-blue-light dark:bg-pata-blue-dark text-white">
                {post.profiles.full_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 
                className="font-semibold text-sm cursor-pointer hover:underline" 
                onClick={(e) => { e.stopPropagation(); handleAuthorClick(); }}
              >
                {post.profiles.full_name}
              </h3>
              <p className="text-xs text-muted-foreground">
                @{post.profiles.username} · {formatTimeAgo(post.created_at)}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwnPost ? (
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
        
        {post.image_url && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src={post.image_url} 
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
            <span className="text-xs">{commentsCount}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); handleLike(); }}
            disabled={isOwnPost || !isAuthenticated}
            className={`flex items-center space-x-2 ${
              isLiked 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-muted-foreground hover:text-red-500'
            } ${(isOwnPost || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-xs">{likesCount}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); handleSave(); }}
            disabled={isOwnPost || !isAuthenticated}
            className={`flex items-center space-x-2 ${
              isSaved 
                ? 'text-blue-500 hover:text-blue-600' 
                : 'text-muted-foreground hover:text-blue-500'
            } ${(isOwnPost || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
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
