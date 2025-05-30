
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/hooks/usePosts';
import { useLikedPosts } from '@/hooks/useLikedPosts';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { usePostViews } from '@/hooks/usePostViews';
import { usePostReports } from '@/hooks/usePostReports';

export const usePostDetail = (postId: string | undefined) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { deletePost } = usePosts();
  const { toggleLike } = useLikedPosts();
  const { toggleSavePost, isPostSaved } = useSavedPosts();
  const { addPostView } = usePostViews();
  const { reportPost, removeReport, isPostReported } = usePostReports();

  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      if (!postId) return;

      // TODO: Implementar busca de post por ID com o novo banco
      console.log('Fetching post data - to be implemented with new database', postId);
      setPost(null);
      setIsLoading(false);

      if (user) {
        addPostView(postId);
      }
    };

    fetchPostData();
  }, [postId, user, addPostView]);

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

  const isOwnPost = user?.id === post?.author_id;
  const isLiked = false; // TODO: Implementar com o novo banco
  const likesCount = 0; // TODO: Implementar com o novo banco
  const isSaved = post ? isPostSaved(post.id) : false;
  const isReported = post ? isPostReported(post.id) : false;

  const handleLike = async () => {
    if (!isOwnPost && isAuthenticated && post) {
      await toggleLike(post.id);
      window.location.reload();
    }
  };

  const handleReport = async () => {
    if (isAuthenticated && !isOwnPost && post) {
      await reportPost(post.id);
      window.location.reload();
    }
  };

  const handleRemoveReport = async () => {
    if (isAuthenticated && !isOwnPost && post) {
      await removeReport(post.id);
      window.location.reload();
    }
  };

  const handleDelete = async () => {
    if (isOwnPost && post) {
      const success = await deletePost(post.id);
      if (success) {
        navigate('/');
      }
    }
  };

  const handleMark = async () => {
    if (isAuthenticated && post) {
      await toggleSavePost(post.id);
      window.location.reload();
    }
  };

  const handleAuthorClick = () => {
    if (post) {
      navigate(`/user/${post.profiles.username}`);
    }
  };

  return {
    post,
    isLoading,
    isOwnPost,
    isLiked,
    likesCount,
    isSaved,
    isReported,
    isAuthenticated,
    handleLike,
    handleReport,
    handleRemoveReport,
    handleDelete,
    handleMark,
    handleAuthorClick,
    formatTimeAgo
  };
};
