
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useLikedPosts } from '@/hooks/useLikedPosts';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { usePostViews } from '@/hooks/usePostViews';
import { usePostReports } from '@/hooks/usePostReports';
import { postManagement } from '@/services/posts/postManagement';
import type { Post } from '@/hooks/usePosts';

export const usePostDetail = (postId: string | undefined) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toggleLike } = useLikedPosts();
  const { toggleSavePost, isPostSaved } = useSavedPosts();
  const { addPostView } = usePostViews();
  const { reportPost, removeReport, isPostReported } = usePostReports();

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      if (!postId) return;

      try {
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select(`
            *,
            profiles!fk_posts_author_id (
              id,
              username,
              full_name,
              avatar_url,
              user_type
            ),
            post_likes!fk_post_likes_post_id (
              user_id
            )
          `)
          .eq('id', postId)
          .single();

        if (postError || !postData) {
          console.error('Error fetching post:', postError);
          setIsLoading(false);
          return;
        }

        setPost(postData);

        if (user && postData) {
          addPostView(postData.id);
        }

      } catch (error) {
        console.error('Error fetching post data:', error);
      } finally {
        setIsLoading(false);
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
  const isLiked = post?.post_likes?.some(like => like.user_id === user?.id) || false;
  const likesCount = post?.post_likes?.length || 0;
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
    if (isOwnPost && post && user) {
      const success = await postManagement.deletePost(post.id, user.id);
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
