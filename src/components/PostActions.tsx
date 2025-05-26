
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
  const { handleReport, handleSave, isSaved, isOwnPost } = usePostActions(postId, authorId);
  const { hideProfile, isProfileHidden } = useHiddenProfiles();

  const handleLikeClick = () => {
    if (isAuthenticated && !isOwnPost) {
      toggleLike(postId);
    }
  };

  const handleDeletePost = async () => {
    if (isOwnPost) {
      await deletePost(postId);
    }
  };

  const handleHideProfile = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await hideProfile(authorId);
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
        onSave={handleSave}
        onHideProfile={handleHideProfile}
        onReport={handleReport}
        onDelete={handleDeletePost}
      />
    </div>
  );
};

export default PostActions;
