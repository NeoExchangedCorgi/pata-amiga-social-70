
import React from 'react';
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
}

const PostActions = ({ postId, authorId, likesCount, isLiked }: PostActionsProps) => {
  const { user, isAuthenticated } = useAuth();
  const { toggleLike, deletePost } = usePosts();
  const { handleReport, handleRemoveReport, handleSave, isSaved, isOwnPost, isReported } = usePostActions(postId, authorId);
  const { hideProfile, isProfileHidden } = useHiddenProfiles();

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
    await handleSave();
    window.location.reload();
  };

  const handleReportPost = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const success = await handleReport();
    if (success) {
      // O estado já foi atualizado no hook, não precisamos recarregar
      // A interface será atualizada automaticamente
    }
  };

  const handleRemoveReportPost = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const success = await handleRemoveReport();
    if (success) {
      // O estado já foi atualizado no hook, não precisamos recarregar
      // A interface será atualizada automaticamente
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
        onSave={handleSavePost}
        onHideProfile={handleHideProfile}
        onReport={handleReportPost}
        onRemoveReport={handleRemoveReportPost}
        onDelete={handleDeletePost}
      />
    </div>
  );
};

export default PostActions;
