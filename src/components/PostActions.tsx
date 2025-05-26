
import React, { useState } from 'react';
import { Heart, Share2, MoreHorizontal, Flag, Bookmark, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { usePostActions } from '@/hooks/usePostActions';
import { useHiddenProfiles } from '@/hooks/useHiddenProfiles';
import { usePosts } from '@/hooks/usePosts';

interface PostActionsProps {
  postId: string;
  authorId: string;
  likesCount: number;
  isLiked: boolean;
}

const PostActions = ({ 
  postId, 
  authorId, 
  likesCount, 
  isLiked
}: PostActionsProps) => {
  const { user, isAuthenticated } = useAuth();
  const { toggleLike, deletePost } = usePosts();
  const { handleReport, handleSave, isSaved, isOwnPost } = usePostActions(postId, authorId);
  const { hideProfile, isProfileHidden } = useHiddenProfiles();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLikeClick = () => {
    if (isAuthenticated && !isOwnPost) {
      toggleLike(postId);
    }
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Post do Pata Amiga',
        url: `${window.location.origin}/post/${postId}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
    }
  };

  const handleDeletePost = async () => {
    if (isOwnPost) {
      await deletePost(postId);
    }
    setIsDropdownOpen(false);
  };

  const handleHideProfile = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await hideProfile(authorId);
    setIsDropdownOpen(false);
  };

  const handleReportPost = async () => {
    await handleReport();
    setIsDropdownOpen(false);
  };

  const handleSavePost = () => {
    handleSave();
    setIsDropdownOpen(false);
  };

  const isProfileCurrentlyHidden = isProfileHidden(authorId);

  return (
    <div className="flex items-center justify-between pt-3 border-t border-border/50">
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center space-x-1 ${
            isLiked 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-muted-foreground hover:text-red-500'
          } ${!isAuthenticated || isOwnPost ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleLikeClick}
          disabled={!isAuthenticated || isOwnPost}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm">{likesCount}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-1 text-muted-foreground hover:text-green-500"
          onClick={handleShareClick}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {isAuthenticated && (
            <>
              <DropdownMenuItem onClick={handleSavePost}>
                <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Remover dos salvos' : 'Salvar post'}
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={handleHideProfile}>
                <EyeOff className="h-4 w-4 mr-2" />
                {isProfileCurrentlyHidden ? 'Perfil já ocultado' : 'Ocultar perfil'}
              </DropdownMenuItem>
              
              {!isOwnPost && (
                <>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={handleReportPost}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Denunciar post
                  </DropdownMenuItem>
                </>
              )}
              
              {isOwnPost && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleDeletePost}
                    className="text-red-600 focus:text-red-600"
                  >
                    Excluir post
                  </DropdownMenuItem>
                </>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PostActions;
