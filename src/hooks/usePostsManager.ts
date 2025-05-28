
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { postsApi, type Post } from '@/services/postsApi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useHiddenProfiles } from '@/hooks/useHiddenProfiles';
import { useHiddenPosts } from '@/hooks/useHiddenPosts';
import { usePostsData } from './usePostsData';

export type SortType = 'likes' | 'recent' | 'reported';

export const usePostsManager = () => {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [sortType, setSortType] = useState<SortType>('likes');
  const [reportedPosts, setReportedPosts] = useState<Post[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const { isProfileHidden } = useHiddenProfiles();
  const { isPostHidden } = useHiddenPosts();
  const { posts: allPosts, isLoading, refetch, setPosts } = usePostsData();

  // Fetch reported posts
  const fetchReportedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('post_reports')
        .select(`
          *,
          posts!fk_post_reports_post_id (
            *,
            profiles!fk_posts_author_id (
              id,
              username,
              full_name,
              avatar_url
            ),
            post_likes!fk_post_likes_post_id (
              user_id
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reported posts:', error);
        return;
      }

      // Get unique posts from reports
      const uniquePosts = data?.reduce((acc, report) => {
        if (report.posts && !acc.find(p => p.id === report.posts.id)) {
          acc.push(report.posts);
        }
        return acc;
      }, [] as Post[]) || [];

      setReportedPosts(uniquePosts);
    } catch (error) {
      console.error('Error fetching reported posts:', error);
    }
  };

  useEffect(() => {
    fetchReportedPosts();
  }, []);

  // Filter and sort posts
  useEffect(() => {
    if (sortType === 'reported') {
      setFilteredPosts(reportedPosts);
      return;
    }

    let postsToFilter = allPosts;

    // Remove reported posts from main feed
    const reportedPostIds = new Set(reportedPosts.map(p => p.id));
    postsToFilter = allPosts.filter(post => !reportedPostIds.has(post.id));

    if (!user) {
      // For non-authenticated users, just apply sorting
      const sorted = [...postsToFilter].sort((a, b) => {
        if (sortType === 'recent') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else {
          const likesA = a.post_likes?.length || 0;
          const likesB = b.post_likes?.length || 0;
          
          if (likesA !== likesB) {
            return likesB - likesA;
          }
          
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
      setFilteredPosts(sorted);
      return;
    }

    // For authenticated users, filter hidden profiles and posts, then sort
    const filtered = postsToFilter
      .filter(post => !isProfileHidden(post.author_id))
      .filter(post => !isPostHidden(post.id))
      .sort((a, b) => {
        if (sortType === 'recent') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else {
          const likesA = a.post_likes?.length || 0;
          const likesB = b.post_likes?.length || 0;
          
          if (likesA !== likesB) {
            return likesB - likesA;
          }
          
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
    
    setFilteredPosts(filtered);
  }, [allPosts, reportedPosts, isProfileHidden, isPostHidden, user, sortType]);

  const createPost = async (content: string, mediaUrl?: string, mediaType?: 'image' | 'video') => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um post",
        variant: "destructive",
      });
      return { error: 'Usuário não autenticado' };
    }

    setIsCreating(true);
    try {
      const result = await postsApi.createPost(content, mediaUrl, mediaType, user.id);
      if (!result.error) {
        await refetch();
        toast({
          title: "Post criado!",
          description: "Seu post foi publicado com sucesso.",
        });
      }
      return result;
    } catch (error) {
      console.error('Error creating post:', error);
      return { error: 'Erro interno do servidor' };
    } finally {
      setIsCreating(false);
    }
  };

  const updatePost = async (postId: string, content: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para editar um post",
        variant: "destructive",
      });
      return { error: 'Usuário não autenticado' };
    }

    try {
      const result = await postsApi.updatePost(postId, content, user.id);
      if (!result.error) {
        setFilteredPosts(prev => prev.map(post => 
          post.id === postId ? { ...post, content } : post
        ));
        setPosts(prev => prev.map(post => 
          post.id === postId ? { ...post, content } : post
        ));
        
        toast({
          title: "Post atualizado!",
          description: "Seu post foi editado com sucesso.",
        });
      }
      return result;
    } catch (error) {
      console.error('Error updating post:', error);
      return { error: 'Erro interno do servidor' };
    }
  };

  const deletePost = async (postId: string) => {
    if (!user) return false;

    const updatedPosts = filteredPosts.filter(post => post.id !== postId);
    setFilteredPosts(updatedPosts);
    setPosts(prev => prev.filter(post => post.id !== postId));
    
    const success = await postsApi.deletePost(postId, user.id);
    if (!success) {
      await refetch();
    } else {
      toast({
        title: "Post excluído",
        description: "O post foi excluído com sucesso.",
      });
    }
    return success;
  };

  // Set up realtime subscriptions
  useEffect(() => {
    const postsChannel = supabase
      .channel('posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        refetch();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, () => {
        refetch();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_reports' }, () => {
        fetchReportedPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
    };
  }, [refetch]);

  return {
    posts: filteredPosts,
    isLoading: isLoading || isCreating,
    sortType,
    setSortType,
    createPost,
    updatePost,
    deletePost,
    refetch: () => {
      refetch();
      fetchReportedPosts();
    },
  };
};
