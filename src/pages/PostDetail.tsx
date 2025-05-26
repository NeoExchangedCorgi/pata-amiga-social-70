import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import FooterBar from '@/components/FooterBar';
import PostDetailHeader from '@/components/PostDetailHeader';
import PostDetailCard from '@/components/PostDetailCard';
import CommentSection from '@/components/CommentSection';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { usePosts } from '@/hooks/usePosts';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { usePostViews } from '@/hooks/usePostViews';
import { usePostReports } from '@/hooks/usePostReports';
import type { Post } from '@/hooks/usePosts';

interface Comment {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  replies?: Comment[];
}

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile, isAuthenticated } = useAuth();
  const { toggleLike, deletePost } = usePosts();
  const { toggleSavePost, isPostSaved } = useSavedPosts();
  const { addPostView } = usePostViews();
  const { reportPost, isPostReported } = usePostReports();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      if (!id) return;

      try {
        // Buscar dados do post
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select(`
            *,
            profiles!fk_posts_author_id (
              id,
              username,
              full_name,
              avatar_url
            ),
            post_likes!fk_post_likes_post_id (
              user_id
            ),
            comments!fk_comments_post_id (
              id
            )
          `)
          .eq('id', id)
          .single();

        if (postError || !postData) {
          console.error('Error fetching post:', postError);
          setIsLoading(false);
          return;
        }

        setPost(postData);

        // Buscar comentários do post
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select(`
            *,
            profiles!fk_comments_author_id (
              username,
              full_name,
              avatar_url
            )
          `)
          .eq('post_id', id)
          .order('created_at', { ascending: true });

        if (!commentsError && commentsData) {
          setComments(commentsData);
        }

        // Registrar visualização
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
  }, [id, user, addPostView]);

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

  const addComment = async (content: string) => {
    if (!user || !profile) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          content,
          post_id: post!.id,
          author_id: user.id,
        })
        .select(`
          *,
          profiles!fk_comments_author_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (!error && data) {
        setComments([...comments, data]);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex w-full">
          <LeftSidebar />
          <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
            <div className="max-w-2xl mx-auto p-4">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-6"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </main>
          <RightSidebar />
        </div>
        <FooterBar />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex w-full">
          <LeftSidebar />
          <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
            <div className="max-w-2xl mx-auto p-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Post não encontrado.</p>
              </div>
            </div>
          </main>
          <RightSidebar />
        </div>
        <FooterBar />
      </div>
    );
  }

  const isOwnPost = user?.id === post.author_id;
  const isLiked = post.post_likes?.some(like => like.user_id === user?.id) || false;
  const likesCount = post.post_likes?.length || 0;
  const commentsCount = comments.length;
  const isSaved = isPostSaved(post.id);
  const isReported = isPostReported(post.id);

  const handleLike = () => {
    if (!isOwnPost && isAuthenticated) {
      toggleLike(post.id);
    }
  };

  const handleReport = async () => {
    if (isAuthenticated && !isOwnPost) {
      await reportPost(post.id);
    }
  };

  const handleDelete = async () => {
    if (isOwnPost) {
      const success = await deletePost(post.id);
      if (success) {
        navigate('/');
      }
    }
  };

  const handleMark = () => {
    if (isAuthenticated) {
      toggleSavePost(post.id);
    }
  };

  const handleAuthorClick = () => {
    navigate(`/user/${post.profiles.username}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <LeftSidebar />
        <main className="md:ml-64 lg:mr-80 min-h-screen bg-background pb-20 md:pb-0">
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            <PostDetailHeader />

            <PostDetailCard
              post={post}
              isOwnPost={isOwnPost}
              isLiked={isLiked}
              likesCount={likesCount}
              commentsCount={commentsCount}
              isSaved={isSaved}
              isReported={isReported}
              isAuthenticated={isAuthenticated}
              onLike={handleLike}
              onReport={handleReport}
              onDelete={handleDelete}
              onMark={handleMark}
              onAuthorClick={handleAuthorClick}
              formatTimeAgo={formatTimeAgo}
            />

            <CommentSection
              comments={comments}
              isAuthenticated={isAuthenticated}
              onAddComment={addComment}
              formatTimeAgo={formatTimeAgo}
            />
          </div>
        </main>
        <RightSidebar />
      </div>
      <FooterBar />
    </div>
  );
};

export default PostDetail;
