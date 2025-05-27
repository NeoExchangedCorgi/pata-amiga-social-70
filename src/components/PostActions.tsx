
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePostActions } from '@/hooks/usePostActions';
import { useHiddenProfiles } from '@/hooks/useHiddenProfiles';
import { usePosts } from '@/hooks/usePosts';
import PostLikeButton from './post/PostLikeButton';
import PostShareButton from './post/PostShareButton';
import PostDropdownMenu from './post/PostDropdownMenu';

interface PostActionsProps {
  postId: string;
  authorId: string;
  likesCount: number;
  isLiked: boolean;
  onEdit?: () => void;
}

const PostActions = ({ postId, authorId, likesCount, isLiked, onEdit }: PostActionsProps) => {
  const { user, isAuthenticated } = useAuth();
  const { deletePost } = usePosts();
  const { 
    handleReport, 
    handleRemoveReport, 
    handleSave, 
    handleHidePost,
    handleUnhidePost,
    handleView,
    handleLike,
    isSaved, 
    isOwnPost, 
    isReported,
    isHidden
  } = usePostActions(postId, authorId);
  const { hideProfile, isProfileHidden } = useHiddenProfiles();

  // Registrar visualização automaticamente quando o componente é montado
  useEffect(() => {
    if (isAuthenticated && !isOwnPost) {
      handleView();
    }
  }, [isAuthenticated, isOwnPost, handleView]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated && !isOwnPost) {
      await handleLike();
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
    await handleSave();
    window.location.reload();
  };

  const handleReportPost = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handleReport();
    window.location.reload();
  };

  const handleRemoveReportPost = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handleRemoveReport();
    window.location.reload();
  };

  const handleHidePostClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handleHidePost();
    window.location.reload();
  };

  const handleUnhidePostClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handleUnhidePost();
    window.location.reload();
  };

  const handleEditPost = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
  };

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
        isReported={isReported}
        isPostHidden={isHidden}
        onSave={handleSavePost}
        onHideProfile={handleHideProfile}
        onHidePost={handleHidePostClick}
        onUnhidePost={handleUnhidePostClick}
        onReport={handleReportPost}
        onRemoveReport={handleRemoveReportPost}
        onDelete={handleDeletePost}
        onEdit={handleEditPost}
      />
    </div>
  );
};

export default PostActions;
