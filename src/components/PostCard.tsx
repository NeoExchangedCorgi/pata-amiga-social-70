
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePostActions } from '@/hooks/usePostActions';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostActions from './PostActions';
import type { Post } from '@/hooks/usePosts';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handleView, isReported } = usePostActions(post.id, post.author_id);

  const isLiked = post.post_likes?.some(like => like.user_id === user?.id) || false;
  const likesCount = post.post_likes?.length || 0;
  const commentsCount = post.comments?.length || 0;

  const handleAuthorClick = () => {
    navigate(`/user/${post.profiles.username}`);
  };

  const handleCommentClick = () => {
    handleView();
    navigate(`/post/${post.id}`);
  };

  const handlePostClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return;
    }
    handleView();
    navigate(`/post/${post.id}`);
  };

  return (
    <Card 
      className="border-border/50 hover:border-pata-blue-light/30 dark:hover:border-pata-blue-dark/30 transition-colors cursor-pointer"
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
          mediaType={post.media_type}
          isReported={isReported}
        />
        
        <PostActions
          postId={post.id}
          authorId={post.author_id}
          likesCount={likesCount}
          commentsCount={commentsCount}
          isLiked={isLiked}
          onCommentClick={handleCommentClick}
        />
      </CardContent>
    </Card>
  );
};

export default PostCard;
