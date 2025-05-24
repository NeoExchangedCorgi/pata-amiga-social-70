
import React, { useState } from 'react';
import { Heart, MessageCircle, Flag, MoreHorizontal, Trash2, Bookmark, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/hooks/usePosts';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { usePostViews } from '@/hooks/usePostViews';
import { usePostReports } from '@/hooks/usePostReports';
import type { Post } from '@/hooks/usePosts';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [showBlurredContent, setShowBlurredContent] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toggleLike, deletePost } = usePosts();
  const { toggleSavePost, isPostSaved } = useSavedPosts();
  const { addPostView } = usePostViews();
  const { reportPost, isPostReported } = usePostReports();

  const isOwnPost = user?.id === post.author_id;
  const isLiked = post.post_likes?.some(like => like.user_id === user?.id) || false;
  const likesCount = post.post_likes?.length || 0;
  const commentsCount = post.comments?.length || 0;
  const isSaved = isPostSaved(post.id);
  const isReported = isPostReported(post.id);

  const handleLike = () => {
    if (!isOwnPost && isAuthenticated) {
      toggleLike(post.id);
    }
  };

  const handleReport = async () => {
    if (isAuthenticated && !isOwnPost) {
      await reportPost(post.id);
    }
  };

  const handleDelete = async () => {
    if (isOwnPost) {
      console.log('Iniciando exclusão do post:', post.id);
      const success = await deletePost(post.id);
      console.log('Resultado da exclusão:', success);
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

  const shouldBlur = isReported && !showBlurredContent;

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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir post</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete} 
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
        {shouldBlur ? (
          <div className="relative">
            <div className="filter blur-md select-none pointer-events-none">
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
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBlurredContent(true);
                }}
                className="bg-background/80 backdrop-blur-sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                Possível conteúdo sensível! Clique para visualizar
              </Button>
            </div>
          </div>
        ) : (
          <>
            {isReported && showBlurredContent && (
              <div className="mb-3 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded border border-yellow-300 dark:border-yellow-700">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    Conteúdo denunciado - visualizando mesmo assim
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBlurredContent(false);
                    }}
                  >
                    <EyeOff className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
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
          </>
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
            disabled={!isAuthenticated || isOwnPost}
            className={`flex items-center space-x-2 ${
              isReported 
                ? 'text-red-500' 
                : 'text-muted-foreground hover:text-orange-500'
            } ${(!isAuthenticated || isOwnPost) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Flag className={`h-4 w-4 ${isReported ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
