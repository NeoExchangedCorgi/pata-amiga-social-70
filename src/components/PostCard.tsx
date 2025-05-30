
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePostActions } from '@/hooks/usePostActions';
import { useLikedPosts } from '@/hooks/useLikedPosts';
import { ROUTES } from '@/constants/app';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostActions from './PostActions';
import EditPostDialog from './post/EditPostDialog';
import type { Post } from '@/hooks/usePosts';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const postActions = usePostActions(post.id, post.author_id);
  const { isPostLiked } = useLikedPosts();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const isLiked = isPostLiked(post.id);
  const likesCount = post.post_likes?.length || 0;

  // Register view when card is mounted
  useEffect(() => {
    postActions.handleView();
  }, []);

  const handleAuthorClick = () => {
    navigate(ROUTES.USER_PROFILE(post.profiles.username));
  };

  const handlePostClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return;
    }
    navigate(ROUTES.POST_DETAIL(post.id));
  };

  const handleEditClick = () => {
    setShowEditDialog(true);
  };

  const handleSaveEdit = async (newContent: string) => {
    return await postActions.handleEdit(newContent);
  };

  return (
    <>
      <Card 
        className="border-border/50 hover:border-pata-blue-light/30 dark:hover:border-pata-blue-dark/30 transition-colors cursor-pointer relative"
        onClick={handlePostClick}
      >
        <CardHeader className="pb-3">
          <PostHeader 
            author={post.profiles}
            createdAt={post.created_at}
            onAuthorClick={handleAuthorClick}
          />
        </CardHeader>
        
        <CardContent className="pt-0">
          <PostContent 
            content={post.content}
            mediaUrl={post.media_url}
            mediaUrls={post.media_urls}
            mediaType={post.media_type}
            postId={post.id}
            authorId={post.author_id}
            postActions={postActions}
          />
          
          <PostActions
            postId={post.id}
            authorId={post.author_id}
            likesCount={likesCount}
            isLiked={isLiked}
            onEdit={handleEditClick}
          />
        </CardContent>
      </Card>

      <EditPostDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSave={handleSaveEdit}
        initialContent={post.content}
      />
    </>
  );
};

export default PostCard;
