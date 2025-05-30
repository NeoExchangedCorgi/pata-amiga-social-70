
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePostActions } from '@/hooks/usePostActions';
import { useHiddenProfiles } from '@/hooks/useHiddenProfiles';
import { usePosts } from '@/hooks/usePosts';
import { useLikedPosts } from '@/hooks/useLikedPosts';
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
  const { toggleLike } = useLikedPosts();
  const { 
    handleReport, 
    handleRemoveReport, 
    handleSave, 
    handleHidePost,
    handleUnhidePost,
    isSaved, 
    isOwnPost, 
    isReported,
    isHidden
  } = usePostActions(postId, authorId);
  const { hideProfile, isProfileHidden } = useHiddenProfiles();

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated && !isOwnPost) {
      await toggleLike(postId);
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
  };

  const handleReportPost = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handleReport();
  };

  const handleRemoveReportPost = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handleRemoveReport();
  };

  const handleHidePostClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handleHidePost();
  };

  const handleUnhidePostClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handleUnhidePost();
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
