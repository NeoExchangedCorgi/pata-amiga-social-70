
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHiddenProfiles } from '@/hooks/useHiddenProfiles';
import { usePosts } from '@/hooks/usePosts';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import PostLikeButton from './post/PostLikeButton';
import PostShareButton from './post/PostShareButton';
import PostDropdownMenu from './post/PostDropdownMenu';

interface PostActionsProps {
  postId: string;
  authorId: string;
  likesCount: number;
  isLiked: boolean;
}

const PostActions = ({ postId, authorId, likesCount, isLiked }: PostActionsProps) => {
  const { user, isAuthenticated } = useAuth();
  const { toggleLike, deletePost } = usePosts();
  const { toggleSavePost, isPostSaved } = useSavedPosts();
  const { hideProfile, isProfileHidden } = useHiddenProfiles();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated && !isOwnPost) {
      await toggleLike(postId);
      window.location.reload();
    }
  };

  const handleDeletePost = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOwnPost) {
      await deletePost(postId);
      window.location.reload();
    }
  };

  const handleHideProfile = async () => {
    await hideProfile(authorId);
    window.location.reload();
  };

  const handleSavePost = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleSavePost(postId);
    window.location.reload();
  };

  const handleReportPost = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Copiar link do post para área de transferência
    const postUrl = `${window.location.origin}/post/${postId}`;
    await navigator.clipboard.writeText(postUrl);
    
    toast({
      title: "Link copiado!",
      description: "O link do post foi copiado. Redirecionando para o chat...",
      className: "bg-green-500 text-white border-green-600",
    });
    
    // Redirecionar para a página de chat
    setTimeout(() => {
      navigate('/chat');
    }, 1500);
  };

  const isOwnPost = user?.id === authorId;
  const isSaved = isPostSaved(postId);
  const isProfileCurrentlyHidden = isProfileHidden(authorId);

  return (
    <div className="flex items-center justify-between pt-3 border-t border-border/50">
      <div className="flex items-center space-x-1">
        <PostLikeButton
          likesCount={likesCount}
          isLiked={isLiked}
          isDisabled={!isAuthenticated || isOwnPost}
          onClick={handleLikeClick}
        />
        <PostShareButton postId={postId} />
      </div>

      <PostDropdownMenu
        isAuthenticated={isAuthenticated}
        isOwnPost={isOwnPost}
        isSaved={isSaved}
        isProfileHidden={isProfileCurrentlyHidden}
        onSave={handleSavePost}
        onHideProfile={handleHideProfile}
        onReport={handleReportPost}
        onDelete={handleDeletePost}
      />
    </div>
  );
};

export default PostActions;
